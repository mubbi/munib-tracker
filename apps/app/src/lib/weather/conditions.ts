import type { WeatherCondition } from "@munib-tracker/shared/types";

/** Wind speed (km/h) above which the windy overlay is shown. */
export const WINDY_THRESHOLD_KMH = 29;

/**
 * Maps Open-Meteo WMO weather codes to normalized conditions.
 * @see https://open-meteo.com/en/docs
 */
export function conditionFromWmoCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly_cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "thunderstorm";
  return "partly_cloudy";
}

/** Maps MET Norway symbol codes (e.g. `partlycloudy_day`) to normalized conditions. */
export function conditionFromMetNoSymbol(symbol: string): WeatherCondition {
  const key = symbol.replace(/_(day|night|polartwilight)$/i, "");
  if (key === "clearsky" || key === "fair") return "clear";
  if (key === "partlycloudy") return "partly_cloudy";
  if (key === "cloudy") return "cloudy";
  if (key === "fog") return "fog";
  if (
    key === "lightrain" ||
    key === "rain" ||
    key === "heavyrain" ||
    key === "lightrainshowers" ||
    key === "rainshowers" ||
    key === "heavyrainshowers" ||
    key === "sleet" ||
    key === "lightsleet" ||
    key === "heavysleet" ||
    key === "sleetshowers" ||
    key === "lightsleetshowers" ||
    key === "heavysleetshowers"
  ) {
    return "rain";
  }
  if (
    key === "snow" ||
    key === "lightsnow" ||
    key === "heavysnow" ||
    key === "snowshowers" ||
    key === "lightsnowshowers" ||
    key === "heavysnowshowers"
  ) {
    return "snow";
  }
  if (key.includes("thunder")) return "thunderstorm";
  return "partly_cloudy";
}

export function isWindy(windSpeedKmh: number): boolean {
  return windSpeedKmh >= WINDY_THRESHOLD_KMH;
}
