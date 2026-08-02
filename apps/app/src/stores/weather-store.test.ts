import { describe, expect, it } from "@jest/globals";
import type { WeatherSnapshot } from "@munib-tracker/shared/types";
import { isSameWeatherView, resolveWeatherEffects } from "@/stores/weather-store";

const baseSnapshot = (overrides: Partial<WeatherSnapshot> = {}): WeatherSnapshot => ({
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
});

describe("resolveWeatherEffects", () => {
  it("returns a stable empty array when effects are disabled", () => {
    const a = resolveWeatherEffects(baseSnapshot(), { effectsEnabled: false, unit: "celsius" });
    const b = resolveWeatherEffects(baseSnapshot(), { effectsEnabled: false, unit: "celsius" });
    expect(a).toBe(b);
    expect(a).toEqual([]);
  });

  it("returns the same array instance for the same condition", () => {
    const prefs = { effectsEnabled: true, unit: "celsius" as const };
    const a = resolveWeatherEffects(baseSnapshot(), prefs);
    const b = resolveWeatherEffects(baseSnapshot({ fetchedAt: "2026-08-01T19:00:00.000Z" }), prefs);
    expect(a).toBe(b);
    expect(a).toEqual(["rain"]);
  });

  it("includes windy when flagged", () => {
    const effects = resolveWeatherEffects(baseSnapshot({ isWindy: true }), {
      effectsEnabled: true,
      unit: "celsius",
    });
    expect(effects).toEqual(["rain", "windy"]);
  });
});

describe("isSameWeatherView", () => {
  it("ignores fetchedAt and provider for hero equality", () => {
    const a = baseSnapshot({ fetchedAt: "2026-08-01T18:00:00.000Z", provider: "open-meteo" });
    const b = baseSnapshot({ fetchedAt: "2026-08-01T21:00:00.000Z", provider: "met-no" });
    expect(isSameWeatherView(a, b)).toBe(true);
  });

  it("detects temperature and condition changes", () => {
    const a = baseSnapshot();
    expect(isSameWeatherView(a, baseSnapshot({ temperatureCelsius: 32 }))).toBe(false);
    expect(isSameWeatherView(a, baseSnapshot({ condition: "cloudy" }))).toBe(false);
  });
});
