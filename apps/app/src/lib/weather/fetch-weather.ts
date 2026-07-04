import type { WeatherSnapshot } from "@munib-tracker/shared/types";
import { WEATHER_CACHE_TTL_MS } from "@munib-tracker/shared/types";

import { fetchMetNoWeather } from "./providers/met-no";
import { fetchOpenMeteoWeather } from "./providers/open-meteo";

export function isWeatherCacheStale(fetchedAt: string, now = Date.now()): boolean {
  const fetchedMs = Date.parse(fetchedAt);
  if (Number.isNaN(fetchedMs)) return true;
  return now - fetchedMs >= WEATHER_CACHE_TTL_MS;
}

export function weatherCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)}:${longitude.toFixed(2)}`;
}

export function isWeatherForLocation(
  snapshot: WeatherSnapshot,
  latitude: number,
  longitude: number,
): boolean {
  return (
    weatherCacheKey(snapshot.latitude, snapshot.longitude) === weatherCacheKey(latitude, longitude)
  );
}

/**
 * Fetches current weather using Open-Meteo first, then MET Norway as fallback.
 * Both providers are free, open-data services that do not require API keys.
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherSnapshot> {
  try {
    return await fetchOpenMeteoWeather(latitude, longitude);
  } catch (primaryError) {
    try {
      return await fetchMetNoWeather(latitude, longitude);
    } catch (fallbackError) {
      const primaryMessage =
        primaryError instanceof Error ? primaryError.message : String(primaryError);
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      throw new Error(
        `Weather providers failed (Open-Meteo: ${primaryMessage}; MET Norway: ${fallbackMessage})`,
      );
    }
  }
}
