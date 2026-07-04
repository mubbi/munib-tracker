import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

export interface ReverseGeocodePlace {
  city?: string;
  country?: string;
}

type ReverseGeocodeCacheMap = Record<string, ReverseGeocodePlace>;

/** Rounds coordinates to ~1.1 km buckets — same precision as the weather cache. */
export function reverseGeocodeCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)}:${longitude.toFixed(2)}`;
}

export const ReverseGeocodeCacheRepository = {
  async get(latitude: number, longitude: number): Promise<ReverseGeocodePlace | null> {
    const cache = await readJSON<ReverseGeocodeCacheMap>(DB_KEYS.reverseGeocodeCache, {});
    return cache[reverseGeocodeCacheKey(latitude, longitude)] ?? null;
  },

  async set(latitude: number, longitude: number, place: ReverseGeocodePlace): Promise<void> {
    try {
      const cache = await readJSON<ReverseGeocodeCacheMap>(DB_KEYS.reverseGeocodeCache, {});
      cache[reverseGeocodeCacheKey(latitude, longitude)] = place;
      await writeJSON(DB_KEYS.reverseGeocodeCache, cache);
    } catch {
      // Storage quota — skip persisting; in-memory cache still works this session.
    }
  },

  async clear(): Promise<void> {
    await writeJSON(DB_KEYS.reverseGeocodeCache, {});
  },
};
