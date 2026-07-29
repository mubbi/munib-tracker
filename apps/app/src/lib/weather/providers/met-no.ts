import { APP_AUTHOR_URL, APP_NAME, APP_SLUG } from "@munib-tracker/shared/constants";
import type { WeatherSnapshot } from "@munib-tracker/shared/types";

import { conditionFromMetNoSymbol, isWindy } from "../conditions";

interface MetNoTimeseriesEntry {
  time?: string;
  data?: {
    instant?: {
      details?: {
        air_temperature?: number;
        wind_speed?: number;
        cloud_area_fraction?: number;
      };
    };
    next_1_hours?: {
      summary?: { symbol_code?: string };
      details?: { precipitation_amount?: number };
    };
    next_6_hours?: {
      summary?: { symbol_code?: string };
    };
  };
}

interface MetNoResponse {
  properties?: {
    timeseries?: MetNoTimeseriesEntry[];
  };
}

const MET_NO_USER_AGENT = `${APP_NAME}/${APP_SLUG} (${APP_AUTHOR_URL})`;

export async function fetchMetNoWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });
  const response = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?${params.toString()}`,
    {
      headers: {
        "User-Agent": MET_NO_USER_AGENT,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`MET Norway responded with ${response.status}`);
  }

  const data = (await response.json()) as MetNoResponse;
  const entry = data.properties?.timeseries?.[0];
  const instant = entry?.data?.instant?.details;
  const symbol =
    entry?.data?.next_1_hours?.summary?.symbol_code ??
    entry?.data?.next_6_hours?.summary?.symbol_code;

  if (instant?.air_temperature == null || instant.wind_speed == null || !symbol) {
    throw new Error("MET Norway response missing current weather fields");
  }

  const windSpeedKmh = instant.wind_speed * 3.6;
  return {
    latitude,
    longitude,
    fetchedAt: new Date().toISOString(),
    temperatureCelsius: instant.air_temperature,
    windSpeedKmh,
    cloudCoverPercent: instant.cloud_area_fraction ?? 0,
    condition: conditionFromMetNoSymbol(symbol),
    isWindy: isWindy(windSpeedKmh),
    provider: "met-no",
  };
}
