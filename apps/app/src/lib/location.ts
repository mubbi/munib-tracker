import * as Location from "expo-location";
import { Platform } from "react-native";

import {
  ReverseGeocodeCacheRepository,
  type ReverseGeocodePlace,
  reverseGeocodeCacheKey,
} from "@/db/repositories/reverse-geocode-cache-repository";
import { isTV } from "@/lib/platform/is-tv";
import {
  type CalculationMethodKey,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
  type HighLatitudeRuleKey,
  type MadhabKey,
  type PrayerAdjustments,
  type PrayerCalcExtras,
} from "@/lib/prayer-times";

/**
 * Location acquisition + reverse geocoding for prayer-time calculation.
 *
 * Coordinates come from `expo-location` (GPS/network). The human-readable place
 * label uses the OS geocoder on native and falls back to BigDataCloud's free,
 * key-less, open reverse-geocode endpoint (also the web path, where the OS
 * geocoder is unavailable).
 */

/**
 * Where the stored coordinates came from:
 * - `default` — the seeded fallback (Makkah), no fix yet.
 * - `device`  — an `expo-location` GPS/network fix.
 * - `manual`  — a city the user picked from search; GPS must not overwrite it.
 */
export type LocationSource = "default" | "device" | "manual";

export interface StoredLocation {
  latitude: number;
  longitude: number;
  /** Display label, e.g. "Sylhet, Bangladesh". */
  label: string;
  city?: string;
  country?: string;
  method: CalculationMethodKey;
  madhab: MadhabKey;
  /** High-latitude twilight rule override; unset ⇒ latitude-aware default (NF-2.21). */
  highLatitudeRule?: HighLatitudeRuleKey;
  /** Per-prayer manual minute offsets to match the local masjid (NF-2.20). */
  prayerAdjustments?: PrayerAdjustments;
  /** How these coordinates were obtained; drives whether GPS may replace them. */
  source: LocationSource;
  /** ISO timestamp of the last successful device fix, or null if defaulted. */
  updatedAt: string | null;
  /**
   * IANA timezone id (e.g. "Asia/Karachi") for a manually-picked city, so its
   * prayer times display in that city's local clock rather than the device's.
   * Undefined for device/default locations, which use the device timezone.
   */
  timeZone?: string;
}

/** Sensible default until a real fix is available: the Kaaba, Makkah. */
export const DEFAULT_LOCATION: StoredLocation = {
  latitude: 21.4225,
  longitude: 39.8262,
  label: "Makkah, Saudi Arabia",
  city: "Makkah",
  country: "Saudi Arabia",
  method: DEFAULT_CALCULATION_METHOD,
  madhab: DEFAULT_MADHAB,
  source: "default",
  updatedAt: null,
};

/**
 * Bundles the optional calculation refinements stored on a location (high-latitude
 * rule + per-prayer offsets) into the shape the prayer-time helpers accept, so
 * every compute call applies them consistently (NF-2.20, NF-2.21).
 */
export function locationCalcExtras(location: StoredLocation): PrayerCalcExtras {
  return {
    highLatitudeRule: location.highLatitudeRule,
    adjustments: location.prayerAdjustments,
  };
}

interface Place {
  city?: string;
  country?: string;
}

export type { ReverseGeocodePlace };
export { reverseGeocodeCacheKey };

/** True when two fixes fall in the same reverse-geocode cache bucket. */
export function coordsMatchCache(
  a: { latitude: number; longitude: number },
  latitude: number,
  longitude: number,
): boolean {
  return (
    reverseGeocodeCacheKey(a.latitude, a.longitude) === reverseGeocodeCacheKey(latitude, longitude)
  );
}

function buildLabel(place: Place, latitude: number, longitude: number): string {
  const parts = [place.city, place.country].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

/** Reverse-geocodes coordinates to a { city, country }, best-effort. */
const reverseGeocodeMemory = new Map<string, ReverseGeocodePlace>();
const reverseGeocodeInflight = new Map<string, Promise<ReverseGeocodePlace>>();

/** @internal Test helper — reset the in-memory reverse-geocode cache. */
export function clearReverseGeocodeMemoryCache(): void {
  reverseGeocodeMemory.clear();
  reverseGeocodeInflight.clear();
}

async function fetchReverseGeocodeFromNetwork(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodePlace> {
  // Native OS geocoder first (offline-capable, no network on most devices).
  if (Platform.OS !== "web") {
    try {
      const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result) {
        return {
          city: result.city ?? result.subregion ?? result.district ?? undefined,
          country: result.country ?? undefined,
        };
      }
    } catch {
      // Fall through to the network geocoder.
    }
  }

  // BigDataCloud client endpoint — free, no API key, CORS-enabled, open data.
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string;
        locality?: string;
        countryName?: string;
      };
      return {
        city: data.city || data.locality || undefined,
        country: data.countryName || undefined,
      };
    }
  } catch {
    // Ignore — caller falls back to a coordinate label.
  }
  return {};
}

/** Resolves a display label for coordinates via the reverse-geocode cache/API. */
export async function resolvePlaceFromCoordinates(
  latitude: number,
  longitude: number,
): Promise<{ city?: string; country?: string; label: string }> {
  const place = await reverseGeocode(latitude, longitude);
  return {
    city: place.city,
    country: place.country,
    label: buildLabel(place, latitude, longitude),
  };
}

async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodePlace> {
  const key = reverseGeocodeCacheKey(latitude, longitude);
  const memHit = reverseGeocodeMemory.get(key);
  if (memHit) return memHit;

  const inflight = reverseGeocodeInflight.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    const cached = await ReverseGeocodeCacheRepository.get(latitude, longitude);
    if (cached && (cached.city || cached.country)) {
      reverseGeocodeMemory.set(key, cached);
      return cached;
    }

    const place = await fetchReverseGeocodeFromNetwork(latitude, longitude);
    if (place.city || place.country) {
      reverseGeocodeMemory.set(key, place);
      await ReverseGeocodeCacheRepository.set(latitude, longitude, place);
    }
    return place;
  })();

  reverseGeocodeInflight.set(key, promise);
  try {
    return await promise;
  } finally {
    reverseGeocodeInflight.delete(key);
  }
}

/** How long to wait for a fresh GPS fix before falling back to the last known one. */
const LOCATION_TIMEOUT_MS = 10_000;

/**
 * Gets a device fix, but never hangs: if `getCurrentPositionAsync` doesn't
 * resolve within {@link LOCATION_TIMEOUT_MS} (common indoors / with weak GPS),
 * fall back to the last known position so the "loading" state always resolves.
 */
async function getPositionWithTimeout(): Promise<Location.LocationObject> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), LOCATION_TIMEOUT_MS);
  });
  try {
    const result = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
      timeout,
    ]);
    if (result) return result;
    const last = await Location.getLastKnownPositionAsync();
    if (last) return last;
    throw new Error("Location request timed out");
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type LocationResult =
  | { status: "granted"; location: Omit<StoredLocation, "method" | "madhab"> }
  | { status: "denied" }
  | { status: "error" };

/**
 * Reads the current foreground location permission without prompting.
 * Use this for silent background refreshes; reserve
 * `requestForegroundPermissionsAsync` for explicit user actions.
 */
export async function getLocationPermissionGranted(): Promise<boolean> {
  // TV has no usable GPS — never treat device location as available.
  if (isTV()) return false;
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

/**
 * Requests foreground permission, gets a fix, and resolves a place label.
 * Never throws — returns a discriminated result the store can act on.
 *
 * When `existing` coordinates match the new fix, reuses the stored city/country
 * so tab switches and background refreshes do not re-hit the reverse-geocode API.
 *
 * Call only from explicit user actions (onboarding allow, "use current location").
 * Background refresh should gate on {@link getLocationPermissionGranted} first.
 */
export async function getDeviceLocation(
  existing?: Pick<StoredLocation, "latitude" | "longitude" | "city" | "country">,
): Promise<LocationResult> {
  // Apple TV / Android TV: force the manual city-search path (no GPS).
  if (isTV()) return { status: "denied" };
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return { status: "denied" };

    const position = await getPositionWithTimeout();
    const { latitude, longitude } = position.coords;
    const place =
      existing &&
      coordsMatchCache(existing, latitude, longitude) &&
      (existing.city || existing.country)
        ? { city: existing.city, country: existing.country }
        : await reverseGeocode(latitude, longitude);

    return {
      status: "granted",
      location: {
        latitude,
        longitude,
        city: place.city,
        country: place.country,
        label: buildLabel(place, latitude, longitude),
        source: "device",
        updatedAt: new Date().toISOString(),
        // A device fix uses the device clock — clear any timezone carried over
        // from a previously-selected manual city.
        timeZone: undefined,
      },
    };
  } catch {
    return { status: "error" };
  }
}

/** One place returned from a forward-geocode search, ready to select and store. */
export interface LocationSearchResult {
  /** Stable id from the geocoder, used as a list key. */
  id: string;
  /** Primary place name, e.g. "Karachi". */
  name: string;
  /** Region/state for disambiguation, e.g. "Sindh" (omitted if same as name). */
  admin?: string;
  country?: string;
  latitude: number;
  longitude: number;
  /** Compact display label persisted as the location, e.g. "Karachi, Pakistan". */
  label: string;
  /** IANA timezone id from the geocoder, so times render in the city's clock. */
  timeZone?: string;
}

/** Shape of a result row from the Open-Meteo geocoding endpoint. */
interface OpenMeteoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  /** IANA timezone id, e.g. "Asia/Karachi" (Open-Meteo returns this per result). */
  timezone?: string;
}

function toSearchResult(place: OpenMeteoPlace): LocationSearchResult {
  // Prefer the state/province for disambiguation, but skip it when it just
  // repeats the city name (common for city-states / capital districts).
  const admin =
    place.admin1 && place.admin1 !== place.name
      ? place.admin1
      : place.admin2 && place.admin2 !== place.name
        ? place.admin2
        : undefined;
  return {
    id: String(place.id),
    name: place.name,
    admin,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    label: [place.name, place.country].filter(Boolean).join(", "),
    timeZone: place.timezone,
  };
}

/**
 * Forward-geocodes a free-text query to a list of cities via the Open-Meteo
 * geocoding API — free, key-less, CORS-enabled, GeoNames-derived open data, so
 * it works identically on iOS/Android/Web with no native dependency.
 *
 * Never throws: returns `[]` for short queries, aborts, or any network/parse
 * error, so callers can treat "no results" and "failed" the same way.
 */
export async function searchLocations(
  query: string,
  language = "en",
  signal?: AbortSignal,
): Promise<LocationSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url =
      "https://geocoding-api.open-meteo.com/v1/search" +
      `?name=${encodeURIComponent(q)}&count=10&language=${encodeURIComponent(language)}&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: OpenMeteoPlace[] };
    return (data.results ?? []).map(toSearchResult);
  } catch {
    // Network failure, JSON parse error, or an aborted request — all "no results".
    return [];
  }
}
