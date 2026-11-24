import { RAWATIB_IDS } from "@munib-tracker/shared/constants";
import { rawatibRowState, rawatibWindow } from "@munib-tracker/shared/utils";

import { nextRawatibPreferences, rawatibDayTimes } from "@/lib/rawatib";
import { buildStoredLocation } from "@/test-support/fixtures/location";

describe("rawatibDayTimes (visibility windows from real prayer times)", () => {
  it("returns null for the default display location (every row stays visible)", () => {
    expect(rawatibDayTimes(buildStoredLocation({ source: "default" }), new Date())).toBeNull();
  });

  it("orders every window across a DST change (New York, spring forward)", () => {
    const location = buildStoredLocation({
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: "America/New_York",
    });
    // 2026-03-08: US clocks jump forward at 02:00 local.
    const times = rawatibDayTimes(location, new Date("2026-03-08T16:00:00Z"));
    expect(times).not.toBeNull();
    if (!times) return;
    expect(times.fajr < times.sunrise && times.sunrise < times.dhuhr).toBe(true);
    expect(times.isha < times.nextFajr).toBe(true);
    for (const id of RAWATIB_IDS) {
      const window = rawatibWindow(id, times);
      expect(window).not.toBeNull();
      expect(window?.end.getTime()).toBeGreaterThan(window?.start.getTime() ?? 0);
    }
    // Day length to the next Fajr shrinks by ~1h on the DST day, never negative.
    const ishaWindow = rawatibWindow("isha_after", times);
    expect((ishaWindow?.end.getTime() ?? 0) - (ishaWindow?.start.getTime() ?? 0)).toBeGreaterThan(
      4 * 3_600_000,
    );
  });

  it("stays computable at high latitude in summer with a high-latitude rule (Oslo)", () => {
    const location = buildStoredLocation({
      latitude: 59.9139,
      longitude: 10.7522,
      timeZone: "Europe/Oslo",
      highLatitudeRule: "SeventhOfTheNight",
    });
    const times = rawatibDayTimes(location, new Date("2026-06-21T10:00:00Z"));
    expect(times).not.toBeNull();
    if (!times) return;
    for (const id of RAWATIB_IDS) {
      const window = rawatibWindow(id, times);
      // Either a valid window, or null ⇒ the row stays visible (never hidden by a polar edge).
      if (window) expect(window.end.getTime()).toBeGreaterThan(window.start.getTime());
      else
        expect(
          rawatibRowState(id, new Date("2026-06-21T10:00:00Z"), times, "pending", false).visible,
        ).toBe(true);
    }
  });
});

describe("nextRawatibPreferences", () => {
  const followSchool = { enabled: true, extras: [] };

  it("pins the resolved state on the first edit and toggles extras", () => {
    const next = nextRawatibPreferences(undefined, followSchool, {
      extra: "asr_before",
      on: true,
    });
    expect(next).toEqual({ enabled: true, extras: ["asr_before"] });
    expect(
      nextRawatibPreferences(next, followSchool, { extra: "asr_before", on: false }).extras,
    ).toEqual([]);
  });

  it("sets a preset and clears it back to follow the madhhab", () => {
    const pinned = nextRawatibPreferences(undefined, followSchool, { preset: 10 });
    expect(pinned.preset).toBe(10);
    expect(nextRawatibPreferences(pinned, followSchool, { preset: null })).not.toHaveProperty(
      "preset",
    );
  });

  it("turns tracking off without losing extras", () => {
    const stored = { enabled: true, extras: ["maghrib_before" as const] };
    expect(nextRawatibPreferences(stored, followSchool, { enabled: false })).toEqual({
      enabled: false,
      extras: ["maghrib_before"],
    });
  });
});
