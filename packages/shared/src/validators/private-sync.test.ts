import { describe, expect, it } from "vitest";

import {
  coarsenCoordinate,
  coarsenLocation,
  stripPrivatePrayerLogFields,
  stripPrivatePreferenceFields,
  stripPrivateSyncData,
} from "./private-sync";

describe("private sync fields (D46)", () => {
  it("strips the active excused reason from preferences only", () => {
    const prefs = { locale: "en", activeExcusedReason: "hayd" };
    expect(stripPrivatePreferenceFields(prefs)).toEqual({ locale: "en" });
    expect(stripPrivateSyncData("preferences", prefs)).toEqual({ locale: "en" });
    // Untouched input objects are returned as-is (no copy when nothing to strip).
    const clean = { locale: "en" };
    expect(stripPrivatePreferenceFields(clean)).toBe(clean);
  });

  it("strips the per-day excused reason but keeps isExcused on prayer logs", () => {
    const log = { prayerId: "fajr", date: "2026-11-24", isExcused: true, excusedReason: "nifas" };
    expect(stripPrivatePrayerLogFields(log)).toEqual({
      prayerId: "fajr",
      date: "2026-11-24",
      isExcused: true,
    });
    expect(JSON.stringify(stripPrivateSyncData("prayer_logs", log))).not.toContain("nifas");
  });

  it("rounds synced coordinates to ~1 km and leaves everything else", () => {
    expect(coarsenCoordinate(24.894_812)).toBe(24.89);
    expect(coarsenCoordinate(-0.004)).toBe(-0);
    expect(coarsenCoordinate("x")).toBe("x");
    const loc = { latitude: 24.894_812, longitude: 91.871_534, label: "Sylhet", method: "MWL" };
    expect(coarsenLocation(loc)).toEqual({
      latitude: 24.89,
      longitude: 91.87,
      label: "Sylhet",
      method: "MWL",
    });
    expect(stripPrivateSyncData("location", { value: loc })).toEqual({
      value: { ...loc, latitude: 24.89, longitude: 91.87 },
    });
    expect(stripPrivateSyncData("location", { value: null })).toEqual({ value: null });
  });

  it("passes other entities through", () => {
    const data = { value: { a: 1 } };
    expect(stripPrivateSyncData("fasting", data)).toBe(data);
  });
});
