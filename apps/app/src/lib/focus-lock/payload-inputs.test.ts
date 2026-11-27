import type { StoredLocation } from "@/lib/location";
import { focusInstant as at, makeFocusPrefs } from "@/test-support/focus-lock";

import { buildFocusDays, hasIqamahTimes, wallClockOn } from "./inputs";
import { FOCUS_CONFIRM_URL, toNativeConfig, toNativeWindows, windowPrayerLabel } from "./payload";
import { planFocusWindows } from "./plan";
import { effectiveWeekendDays, weekendRegionFor } from "./weekend";

const t = (key: string, opts?: Record<string, unknown>) =>
  opts ? `${key}|${JSON.stringify(opts)}` : key;

const THEME = {
  accent: "#059669",
  accentForeground: "#FFFFFF",
  background: "#F5F0E6",
  foreground: "#152921",
  muted: "#5C7268",
};

describe("native payload", () => {
  it("labels windows by prayer (merged, Jumu'ah, test)", () => {
    expect(windowPrayerLabel(["maghrib", "isha"], t)).toBe(
      "prayers.maghribfocusLock.andprayers.isha",
    );
    expect(windowPrayerLabel(["jumuah"], t)).toBe("focusLock.jumuah");
    expect(windowPrayerLabel([], t)).toBe("focusLock.testName");
  });

  it("sends ISO instants and localised shield copy only", () => {
    const [w] = toNativeWindows(
      [
        {
          id: "2026-11-26:dhuhr",
          date: "2026-11-26",
          prayers: ["dhuhr"],
          start: at("2026-11-26", "12:30"),
          end: at("2026-11-26", "12:50"),
          anchor: "adhan",
        },
      ],
      t,
    );
    expect(w).toEqual({
      id: "2026-11-26:dhuhr",
      prayer: "dhuhr",
      title: 'focusLock.shield.title|{"prayer":"prayers.dhuhr"}',
      body: "focusLock.shield.body",
      start: "2026-11-26T12:30:00.000Z",
      end: "2026-11-26T12:50:00.000Z",
    });
  });

  it("pre-formats one emergency label per remaining count and passes the confirm deep link", () => {
    const cfg = toNativeConfig(
      makeFocusPrefs({ unlockMode: "firm" }),
      { confirmNotification: false, theme: THEME },
      t,
    );
    expect(cfg.labels.emergency).toHaveLength(6);
    expect(cfg.labels.emergency[2]).toBe('focusLock.shield.emergency|{"count":2}');
    expect(cfg).toMatchObject({
      unlockMode: "firm",
      emergencyPerDay: 2,
      confirmNotification: false,
      confirmUrl: FOCUS_CONFIRM_URL,
      theme: THEME,
    });
  });
});

describe("prayer-time inputs", () => {
  const location: StoredLocation = {
    latitude: 21.4225,
    longitude: 39.8262,
    label: "Makkah",
    method: "UmmAlQura",
    madhab: "shafi",
    source: "manual",
    updatedAt: null,
    timeZone: "Asia/Riyadh",
  };
  const now = new Date("2026-11-26T03:00:00.000Z");

  it("builds today and tomorrow with ordered, valid adhan times", () => {
    const days = buildFocusDays(location, now);
    expect(days.map((d) => d.date)).toEqual(["2026-11-26", "2026-11-27"]);
    expect(days.map((d) => d.weekday)).toEqual([4, 5]);
    for (const d of days) {
      const order = [
        d.adhan.fajr,
        d.sunrise,
        d.adhan.dhuhr,
        d.adhan.asr,
        d.adhan.maghrib,
        d.adhan.isha,
      ];
      const ms = order.map((x) => x?.getTime() ?? Number.NaN);
      expect(ms.every(Number.isFinite)).toBe(true);
      expect([...ms].sort((a, b) => a - b)).toEqual(ms);
    }
    expect(hasIqamahTimes(days)).toBe(false);
    // Plans cleanly end-to-end: Friday has Jumu'ah instead of Dhuhr.
    const ids = planFocusWindows({ prefs: makeFocusPrefs(), days, now }).map((w) => w.id);
    expect(ids).toContain("2026-11-27:jumuah");
    expect(ids).not.toContain("2026-11-27:dhuhr");
  });

  it("maps home-masjid iqamah times (Friday Dhuhr → Jumu'ah) and ignores bad values", () => {
    const days = buildFocusDays(location, now, (_date, prayer) =>
      prayer === "dhuhr" ? "12:45" : prayer === "asr" ? "25:99" : null,
    );
    expect(hasIqamahTimes(days)).toBe(true);
    expect(days[0]?.iqamah?.asr).toBeUndefined();
    expect(days[1]?.iqamah?.jumuah?.toISOString()).toBe("2026-11-27T09:45:00.000Z");
    expect(wallClockOn(new Date(2026, 10, 26), "bad")).toBeUndefined();
  });

  it("D37/D38 end-to-end: the Makkah weekend skips Friday's daily windows (not Jumu'ah); the Jumu'ah iqamah starts a 60-minute window", () => {
    const days = buildFocusDays(location, now, (_date, prayer) =>
      prayer === "dhuhr" ? "12:45" : null,
    );
    const weekendDays = effectiveWeekendDays({}, weekendRegionFor(location));
    expect(weekendDays).toEqual([5, 6]);
    const skipped = planFocusWindows({
      prefs: makeFocusPrefs({ schedule: { weekdaysOnly: true } }),
      days,
      now,
      weekendDays,
    });
    // Weekdays-only applies to the daily windows; the Jumu'ah window still locks (L5).
    expect(skipped.filter((w) => w.date !== "2026-11-26").map((w) => w.id)).toEqual([
      "2026-11-27:jumuah",
    ]);
    const [jumuah] = planFocusWindows({
      prefs: makeFocusPrefs({ prayers: ["jumuah"] }),
      days,
      now,
      weekendDays,
    });
    expect(jumuah?.start.toISOString()).toBe("2026-11-27T09:45:00.000Z");
    expect(jumuah?.end.toISOString()).toBe("2026-11-27T10:45:00.000Z");
  });
});
