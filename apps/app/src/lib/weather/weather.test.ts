import { describe, expect, it } from "@jest/globals";
import { generateCloudPuffs, generateCumulusCloud } from "@/components/weather/cloud-shape";
import { conditionFromMetNoSymbol, conditionFromWmoCode, isWindy } from "./conditions";
import { isWeatherCacheStale, weatherCacheKey } from "./fetch-weather";
import { formatTemperature } from "./format";

describe("generateCumulusCloud", () => {
  it("returns stable cumulus silhouettes per seed and size", () => {
    const a = generateCumulusCloud(11, "large");
    const b = generateCumulusCloud(11, "large");
    const c = generateCumulusCloud(23, "small");
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(4);
    expect(c.length).toBeGreaterThanOrEqual(4);
    expect(a.some((part) => part.kind === "ellipse")).toBe(true);
    expect(a.every((part) => part.r > 0.1)).toBe(true);
  });
});

describe("generateCloudPuffs", () => {
  it("maps legacy archetypes to cumulus sizes", () => {
    const triplet = generateCloudPuffs(11, "triplet");
    const wisp = generateCloudPuffs(23, "wisp");
    expect(triplet.length).toBeGreaterThanOrEqual(4);
    expect(wisp.length).toBeGreaterThanOrEqual(4);
  });
});

describe("conditionFromWmoCode", () => {
  it("maps common WMO codes", () => {
    expect(conditionFromWmoCode(0)).toBe("clear");
    expect(conditionFromWmoCode(3)).toBe("cloudy");
    expect(conditionFromWmoCode(61)).toBe("rain");
    expect(conditionFromWmoCode(71)).toBe("snow");
    expect(conditionFromWmoCode(95)).toBe("thunderstorm");
  });
});

describe("conditionFromMetNoSymbol", () => {
  it("normalizes day/night suffixes", () => {
    expect(conditionFromMetNoSymbol("partlycloudy_day")).toBe("partly_cloudy");
    expect(conditionFromMetNoSymbol("heavyrainshowers_night")).toBe("rain");
    expect(conditionFromMetNoSymbol("clearsky_day")).toBe("clear");
  });
});

describe("isWindy", () => {
  it("flags strong wind speeds", () => {
    expect(isWindy(20)).toBe(false);
    expect(isWindy(30)).toBe(true);
  });
});

describe("formatTemperature", () => {
  it("formats celsius and fahrenheit", () => {
    expect(formatTemperature(20, "celsius")).toBe("20°");
    expect(formatTemperature(0, "fahrenheit")).toBe("32°");
  });
});

describe("weather cache helpers", () => {
  it("builds stable coordinate keys", () => {
    expect(weatherCacheKey(21.4225, 39.8262)).toBe("21.42:39.83");
  });

  it("respects the three-hour TTL", () => {
    const now = Date.parse("2026-07-04T12:00:00.000Z");
    const fresh = "2026-07-04T09:30:00.000Z";
    const stale = "2026-07-04T08:59:59.000Z";
    expect(isWeatherCacheStale(fresh, now)).toBe(false);
    expect(isWeatherCacheStale(stale, now)).toBe(true);
  });
});
