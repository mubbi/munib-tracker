/** Display unit for hero weather temperature. */
export type TemperatureUnit = "celsius" | "fahrenheit";

/** Normalized sky condition used for labels and hero effects. */
export type WeatherCondition =
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "thunderstorm";

/** Visual overlay kinds rendered on the hero gradient. */
export type WeatherEffectKind = WeatherCondition | "windy";

export interface WeatherPreferences {
  /** Animated weather overlays on the home hero. */
  effectsEnabled: boolean;
  unit: TemperatureUnit;
}

/** Device-local cached weather snapshot for a coordinate pair. */
export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  /** ISO timestamp when this snapshot was fetched from a provider. */
  fetchedAt: string;
  temperatureCelsius: number;
  windSpeedKmh: number;
  cloudCoverPercent: number;
  condition: WeatherCondition;
  /** True when sustained wind exceeds the windy overlay threshold. */
  isWindy: boolean;
  provider: "open-meteo" | "met-no";
}

/** How long cached weather remains valid before a background refresh. */
export const WEATHER_CACHE_TTL_MS = 3 * 60 * 60 * 1000;
