import { resolveApiUrl } from "@munib-tracker/api-client";
import {
  encodeGeohash,
  isValidGeohash,
  type MasjidDetailResponse,
  type MasjidListResponse,
  type MasjidOsmType,
} from "@munib-tracker/shared/masjid";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";

/**
 * NF-3.11 client for the read-only masjids proxy. Privacy:
 *  - only the geohash-5 cell (~5 km) leaves the device, never precise coordinates;
 *  - plain `fetch` with `credentials: "omit"` and no Authorization header, so no
 *    user id or session cookie is attached (unlike `apiFetch`);
 *  - the exact distance sort happens on-device.
 */

const REQUEST_TIMEOUT_MS = 20_000;
/** Last lists kept for offline use (cells), oldest dropped first. */
const LIST_CACHE_MAX_CELLS = 12;

export class MasjidApiError extends Error {
  constructor(
    readonly kind: "offline" | "unavailable" | "not_found" | "rate_limited",
    message: string = kind,
  ) {
    super(message);
    this.name = "MasjidApiError";
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    let response: Response;
    try {
      response = await fetch(resolveApiUrl(path), {
        method: "GET",
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
    } catch {
      throw new MasjidApiError("offline");
    }
    if (response.status === 404) throw new MasjidApiError("not_found");
    if (response.status === 429) throw new MasjidApiError("rate_limited");
    if (!response.ok) throw new MasjidApiError("unavailable");
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/** The only location the client ever sends: a geohash-5 cell. */
export function cellFor(lat: number, lon: number): string {
  return encodeGeohash(lat, lon, 5);
}

type ListCache = Record<string, { savedAt: string; response: MasjidListResponse }>;

export async function readCachedMasjidList(cell: string): Promise<MasjidListResponse | null> {
  const cache = await readJSON<ListCache>(DB_KEYS.masjidListCache, {});
  return cache[cell]?.response ?? null;
}

async function cacheMasjidList(cell: string, response: MasjidListResponse): Promise<void> {
  await updateJSON<ListCache>(DB_KEYS.masjidListCache, {}, (current) => {
    const next: ListCache = { ...current, [cell]: { savedAt: new Date().toISOString(), response } };
    const cells = Object.keys(next).sort((a, b) =>
      (next[a]?.savedAt ?? "").localeCompare(next[b]?.savedAt ?? ""),
    );
    while (cells.length > LIST_CACHE_MAX_CELLS) {
      const oldest = cells.shift();
      if (oldest) delete next[oldest];
    }
    return next;
  });
}

export type MasjidListResult = MasjidListResponse & {
  /** True when the network failed and this came from the on-device cache. */
  offline: boolean;
};

/**
 * Fetches the cell's list; on a network/server failure falls back to the last
 * list cached on this device (flagged `offline`). Throws when there's nothing.
 */
export async function fetchMasjidList(
  cell: string,
  signal?: AbortSignal,
): Promise<MasjidListResult> {
  if (!isValidGeohash(cell)) throw new MasjidApiError("unavailable", "invalid cell");
  try {
    const response = await getJson<MasjidListResponse>(
      `/masjids?cell=${encodeURIComponent(cell)}`,
      signal,
    );
    const clean: MasjidListResponse = {
      masjids: Array.isArray(response.masjids) ? response.masjids : [],
      attribution: Array.isArray(response.attribution) ? response.attribution : [],
      stale: response.stale === true,
    };
    if (clean.masjids.length > 0 || !clean.stale) await cacheMasjidList(cell, clean);
    return { ...clean, offline: false };
  } catch (error) {
    const cached = await readCachedMasjidList(cell);
    if (cached) return { ...cached, offline: true };
    throw error;
  }
}

export async function fetchMasjidDetail(
  osmType: MasjidOsmType,
  osmId: string,
  signal?: AbortSignal,
): Promise<MasjidDetailResponse> {
  return getJson<MasjidDetailResponse>(
    `/masjids/${encodeURIComponent(osmType)}/${encodeURIComponent(osmId)}`,
    signal,
  );
}
