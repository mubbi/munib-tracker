import type { WeatherSnapshot } from "@munib-tracker/shared/types";

import { conditionFromWmoCode, isWindy } from "../conditions";

interface OpenMeteoCurrentResponse {
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    cloud_cover?: number;
  };
}

export async function fetchOpenMeteoWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code,wind_speed_10m,cloud_cover",
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo responded with ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoCurrentResponse;
  const current = data.current;
  if (
    current?.temperature_2m == null ||
    current.weather_code == null ||
    current.wind_speed_10m == null
  ) {
    throw new Error("Open-Meteo response missing current weather fields");
  }

  const windSpeedKmh = current.wind_speed_10m;
  return {
    latitude,
    longitude,
    fetchedAt: new Date().toISOString(),
    temperatureCelsius: current.temperature_2m,
    windSpeedKmh,
    cloudCoverPercent: current.cloud_cover ?? 0,
    condition: conditionFromWmoCode(current.weather_code),
    isWindy: isWindy(windSpeedKmh),
    provider: "open-meteo",
  };
}
