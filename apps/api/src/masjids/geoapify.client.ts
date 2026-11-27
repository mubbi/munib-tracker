import {
  GEOAPIFY_ATTRIBUTION_LINE,
  type GeohashBounds,
  type MasjidOsmType,
  type OverpassElement,
  type OverpassResponse,
} from "@munib-tracker/shared/masjid/osm";
import { Injectable } from "@nestjs/common";

/**
 * Geoapify Places client (NF-3.11): keyed, free-tier (no billing) access to the
 * same OpenStreetMap data Overpass serves. Responses carry each place's raw OSM
 * tags (`properties.datasource.raw`), so they are converted to Overpass-shaped
 * elements and parsed by the existing `parseOverpass*` helpers — one data model,
 * one set of masjid rules, whichever upstream answered.
 *
 * Privacy: only the coarse geohash bounding box (or an OSM ref) is sent; the API
 * key rides in the query string, so URLs are never logged.
 */

const PLACES_URL = "https://api.geoapify.com/v2/places";
const DETAILS_URL = "https://api.geoapify.com/v2/place-details";
/** Islamic places of worship + mosque buildings (sights) — the parser's masjid rules still apply. */
export const GEOAPIFY_MASJID_CATEGORIES = [
  "religion.place_of_worship.islam",
  "tourism.sights.place_of_worship.mosque",
] as const;
/**
 * Free plan: 20 places = 1 credit, so the nearest 200 cost ≤ 10 credits
 * (`GEOAPIFY_CREDITS_PER_CELL`) — far more than the app lists for one area.
 */
const PLACES_LIMIT = 200;
/** Short, so the Overpass fallback still fits inside the request's overall budget. */
const REQUEST_TIMEOUT_MS = 8_000;

/** Defined in shared so the app's `attributionCreditsGeoapify` matches it exactly. */
export { GEOAPIFY_ATTRIBUTION_LINE };

const OSM_TYPE_BY_CODE: Record<string, MasjidOsmType> = {
  n: "node",
  w: "way",
  r: "relation",
  node: "node",
  way: "way",
  relation: "relation",
};
const OSM_CODE_BY_TYPE: Record<MasjidOsmType, string> = { node: "n", way: "w", relation: "r" };

export class GeoapifyError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "GeoapifyError";
  }
}

export function geoapifyApiKey(): string | null {
  const key = process.env.GEOAPIFY_API_KEY?.trim();
  return key ? key : null;
}

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function finite(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * One Geoapify feature → one Overpass-style element, or null when it doesn't
 * come from OSM / lacks an OSM ref. Categories only fill tags the raw data
 * leaves out (never override a conflicting `religion`).
 */
function elementOf(feature: unknown): OverpassElement | null {
  if (!isObject(feature) || !isObject(feature.properties)) return null;
  const props = feature.properties;
  const datasource = isObject(props.datasource) ? props.datasource : null;
  const raw = datasource && isObject(datasource.raw) ? datasource.raw : null;
  if (!raw) return null;

  const type = typeof raw.osm_type === "string" ? OSM_TYPE_BY_CODE[raw.osm_type] : undefined;
  const rawId = typeof raw.osm_id === "string" ? Number(raw.osm_id) : raw.osm_id;
  // Some OSM-derived datasets sign way/relation ids; the OSM ref itself is positive.
  const id = typeof rawId === "number" && Number.isSafeInteger(rawId) ? Math.abs(rawId) : 0;
  if (!type || id <= 0) return null;

  const geometry = isObject(feature.geometry) ? feature.geometry : null;
  const coords =
    geometry?.type === "Point" && Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
  const lat = finite(props.lat) ?? finite(coords[1]);
  const lon = finite(props.lon) ?? finite(coords[0]);

  const tags: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "osm_id" || key === "osm_type") continue;
    if (typeof value === "string") tags[key] = value;
    else if (typeof value === "number" && Number.isFinite(value)) tags[key] = String(value);
  }
  const categories = Array.isArray(props.categories) ? props.categories : [];
  if (GEOAPIFY_MASJID_CATEGORIES.some((category) => categories.includes(category))) {
    tags.amenity ??= "place_of_worship";
    tags.religion ??= "muslim";
  }
  return { type, id, lat, lon, tags };
}

/** Geoapify FeatureCollection → `{ elements }` for `parseOverpassSummaries` / `parseOverpassDetail`. */
export function geoapifyToOverpass(body: unknown): OverpassResponse {
  const features = isObject(body) && Array.isArray(body.features) ? body.features : [];
  const elements: OverpassElement[] = [];
  for (const feature of features) {
    const element = elementOf(feature);
    if (element) elements.push(element);
  }
  return { elements };
}

function fmt(value: number): string {
  return value.toFixed(6);
}

@Injectable()
export class GeoapifyClient {
  get configured(): boolean {
    return geoapifyApiKey() !== null;
  }

  /** Masjids in the box, nearest to its centre first. */
  async listInBounds(bounds: GeohashBounds): Promise<OverpassResponse> {
    const centerLat = (bounds.south + bounds.north) / 2;
    const centerLon = (bounds.west + bounds.east) / 2;
    return geoapifyToOverpass(
      await this.get(PLACES_URL, {
        categories: GEOAPIFY_MASJID_CATEGORIES.join(","),
        filter: `rect:${fmt(bounds.west)},${fmt(bounds.south)},${fmt(bounds.east)},${fmt(bounds.north)}`,
        bias: `proximity:${fmt(centerLon)},${fmt(centerLat)}`,
        limit: String(PLACES_LIMIT),
      }),
    );
  }

  /** One place by its OSM ref. */
  async element(osmType: MasjidOsmType, osmId: string): Promise<OverpassResponse> {
    return geoapifyToOverpass(
      await this.get(DETAILS_URL, {
        osm_id: osmId,
        osm_type: OSM_CODE_BY_TYPE[osmType],
        features: "details",
      }),
    );
  }

  private async get(base: string, params: Record<string, string>): Promise<unknown> {
    const apiKey = geoapifyApiKey();
    if (!apiKey) throw new GeoapifyError("Geoapify API key is not configured");
    const url = `${base}?${new URLSearchParams({ ...params, apiKey }).toString()}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (response.status === 401 || response.status === 403) {
        throw new GeoapifyError("Geoapify rejected the API key", response.status);
      }
      if (!response.ok) {
        throw new GeoapifyError(`Geoapify responded ${response.status}`, response.status);
      }
      try {
        return (await response.json()) as unknown;
      } catch {
        throw new GeoapifyError("Geoapify returned a non-JSON body");
      }
    } catch (error) {
      if (error instanceof GeoapifyError) throw error;
      throw new GeoapifyError(
        controller.signal.aborted ? "Geoapify request timed out" : "Geoapify request failed",
      );
    } finally {
      clearTimeout(timer);
    }
  }
}
