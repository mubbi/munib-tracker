import type { WeatherSnapshot } from "@munib-tracker/shared/types";
import { weatherCacheKey } from "@/lib/weather/fetch-weather";
import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

type WeatherCacheMap = Record<string, WeatherSnapshot>;

export const WeatherCacheRepository = {
  async get(latitude: number, longitude: number): Promise<WeatherSnapshot | null> {
    const cache = await readJSON<WeatherCacheMap>(DB_KEYS.weatherCache, {});
    return cache[weatherCacheKey(latitude, longitude)] ?? null;
  },

  async set(snapshot: WeatherSnapshot): Promise<void> {
    try {
      const cache = await readJSON<WeatherCacheMap>(DB_KEYS.weatherCache, {});
      cache[weatherCacheKey(snapshot.latitude, snapshot.longitude)] = snapshot;
      await writeJSON(DB_KEYS.weatherCache, cache);
    } catch {
      // Storage quota — skip persisting weather; in-memory state still works this session.
    }
  },

  async clear(): Promise<void> {
    await writeJSON(DB_KEYS.weatherCache, {});
  },
};
