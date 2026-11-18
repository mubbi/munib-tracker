import type { WeatherSnapshot } from "@munib-tracker/shared/types";

/** Rainy Karachi reading from Open-Meteo. */
export function buildWeatherSnapshot(overrides: Partial<WeatherSnapshot> = {}): WeatherSnapshot {
  return {
    latitude: 24.83,
    longitude: 67.07,
    fetchedAt: "2026-08-01T18:00:00.000Z",
    temperatureCelsius: 31,
    windSpeedKmh: 12,
    cloudCoverPercent: 40,
    condition: "rain",
    isWindy: false,
    provider: "open-meteo",
    ...overrides,
  };
}
