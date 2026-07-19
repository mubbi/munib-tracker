import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import {
  buildReminders,
  hasOutstandingQazaDebt,
  isQazaReminderId,
  MAX_PENDING_REMINDERS,
  summarizeReminders,
} from "@/lib/notifications/build-reminders";
import { computePrayerTimes } from "@/lib/prayer-times";

/** Same coords as the seeded fallback, but marked as a real fix so prayer reminders schedule. */
const SET_LOCATION: StoredLocation = {
  ...DEFAULT_LOCATION,
  source: "device",
  updatedAt: "2026-07-01T00:00:00.000Z",
};

const basePrefs: UserPreferences = {
  locale: "en",
  translationLocale: "en",
  timeFormat: "24",
  bedtime: "22:30",
  notificationPrefs: {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    masterEnabled: true,
    prayer: true,
    sunnahPrayer: true,
    beforePrayer: true,
    afterPrayer: true,
    afterAzan: true,
  },
  prayerAlerts: {},
  fontPrefs: {
    global: {},
    arabic: {},
    translation: {},
    transliteration: {},
    titles: {},
  },
  favoriteZikrIds: [],
  favoriteZikrOrder: [],
  hasCompletedOnboarding: true,
};

// buildReminders derives each day from `new Date()` (with the clock set to noon),
// so pin the wall clock to a fixed instant to make the computed prayer times
// deterministic. An explicit `Z` fixes the *instant*; the code and the assertion
// both interpret the resulting local day identically, so the test is stable
// across time zones without asserting a hard-coded local hour.
const FIXED_NOW = new Date("2026-07-03T09:00:00.000Z");

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("buildReminders", () => {
  it("skips Salah/Adhan reminders while location is still the Makkah default", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);
    const ids = reminders.map((item) => item.id.split(":")[0]);
    expect(ids).not.toContain("prayer");
    expect(ids).not.toContain("afterAzan");
    expect(ids).not.toContain("beforePrayer");
    expect(ids).not.toContain("afterPrayer");
    // Wall-clock nudges still schedule.
    expect(ids).toContain("morningZikr");
  });

  it("includes prayer, azan, and before-prayer slots for enabled toggles", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    const ids = reminders.map((item) => item.id.split(":")[0]);

    expect(ids).toContain("prayer");
    expect(ids).toContain("afterAzan");
    expect(ids).toContain("beforePrayer");
    expect(ids).toContain("afterPrayer");
    expect(reminders.some((item) => item.id.startsWith("prayer:tahajjud:"))).toBe(true);
  });

  it("deep-links each reminder to the collection it is about", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);

    // Every reminder carries a non-empty in-app route so a tap always lands somewhere useful.
    expect(reminders.every((item) => typeof item.route === "string" && item.route.length > 0)).toBe(
      true,
    );

    const routeFor = (prefix: string) =>
      reminders.find((item) => item.id.startsWith(prefix))?.route;

    expect(routeFor("prayer:")).toBe("/tracker");
    expect(routeFor("afterAzan:")).toBe("/zikr/after_azan");
    expect(routeFor("beforePrayer:")).toBe("/zikr/before_prayer");
    expect(routeFor("afterPrayer:fajr:")).toBe("/zikr/after_prayer?prayer=fajr");
    expect(routeFor("afterPrayer:dhuhr:")).toBe("/zikr/after_prayer?prayer=dhuhr");
  });

  it("carries the reminder route through to summary rows", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    const rows = summarizeReminders(reminders, "24");

    const azan = rows.find((row) => row.id.startsWith("afterAzan:"));
    expect(azan?.route).toBe("/zikr/after_azan");
  });

  it("does not schedule after-adhan reminders for Witr", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);

    expect(reminders.some((item) => item.id.startsWith("afterAzan:witr:"))).toBe(false);
    expect(reminders.some((item) => item.id.startsWith("afterAzan:fajr:"))).toBe(true);
    expect(reminders.some((item) => item.id.startsWith("prayer:witr:"))).toBe(true);
  });

  it("computes Fajr's fireAt from the prayer-times engine, not a static hint", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);

    // Take the first surviving Fajr reminder (past ones are pruned, so this may be
    // a later day in the 7-day window). Its id encodes the day it was built for.
    const fajr = reminders.find((item) => item.id.startsWith("prayer:fajr:"));
    expect(fajr).toBeDefined();

    const dayKey = (fajr as { id: string }).id.split(":")[2];
    // Reconstruct that day at noon exactly as pushPrayerReminders does, so the
    // expected Fajr is computed against the same calendar day.
    const day = new Date(`${dayKey}T00:00:00`);
    day.setHours(12, 0, 0, 0);

    // Compute the expected Fajr the same way the scheduler does, so a real change
    // in the prayer-times calculation would move this and fail the test.
    const expected = computePrayerTimes(
      { latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude },
      day,
      DEFAULT_LOCATION.method,
      DEFAULT_LOCATION.madhab,
    ).fajr;

    const deltaMs = Math.abs((fajr as { fireAt: Date }).fireAt.getTime() - expected.getTime());
    expect(deltaMs).toBeLessThanOrEqual(60_000);
  });

  it("summarizeReminders collapses multi-day prayer slots to one row per template", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    const rows = summarizeReminders(reminders, "12");

    const keys = rows.map((row) => `${row.title}\0${row.body}`);
    expect(new Set(keys).size).toBe(keys.length);

    const tahajjud = rows.filter((row) => row.title.toLowerCase().includes("tahajjud"));
    expect(tahajjud).toHaveLength(1);
    expect(tahajjud[0]?.fireAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("drops reminders that have already passed relative to now", () => {
    const future = new Date(FIXED_NOW.getTime() + 30 * 24 * 60 * 60 * 1000);
    const reminders = buildReminders(basePrefs, SET_LOCATION, future);

    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders.every((r) => r.fireAt.getTime() > future.getTime() - 60_000)).toBe(true);
  });

  it("attaches the adhan sound only to obligatory prayers when the option is on", () => {
    const withAdhan: UserPreferences = {
      ...basePrefs,
      notificationPrefs: { ...basePrefs.notificationPrefs, playAdhanOnPrayer: true },
    };
    const reminders = buildReminders(withAdhan, SET_LOCATION);

    const fard = reminders.find((r) => r.id.startsWith("prayer:fajr:"));
    expect(fard?.sound).toBe("adhan.mp3");
    expect(fard?.channelId).toBe("prayerAdhan");

    // Sunnah/witr and the surrounding zikr nudges stay silent.
    const witr = reminders.find((r) => r.id.startsWith("prayer:witr:"));
    expect(witr?.sound).toBeUndefined();
    expect(reminders.filter((r) => r.id.startsWith("afterAzan:")).every((r) => !r.sound)).toBe(
      true,
    );
  });

  it("keeps obligatory prayers silent when the adhan option is off", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    const fard = reminders.find((r) => r.id.startsWith("prayer:fajr:"));
    expect(fard?.sound).toBeUndefined();
    expect(fard?.channelId).toBe("prayer");
  });

  it("shifts the main prayer reminder by the per-prayer offset (NF-1.7)", () => {
    const withOffset: UserPreferences = {
      ...basePrefs,
      prayerReminderOffsets: { fajr: -15 },
    };
    const base = buildReminders(basePrefs, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:fajr:"),
    );
    const shifted = buildReminders(withOffset, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:fajr:"),
    );
    expect(base && shifted).toBeTruthy();
    if (base && shifted) {
      // Same day's Fajr reminder, moved 15 minutes earlier.
      expect(base.fireAt.getTime() - shifted.fireAt.getTime()).toBe(15 * 60_000);
    }
    // The before-prayer nudge stays anchored to the true prayer time (10 min before it).
    const before = buildReminders(withOffset, SET_LOCATION).find((r) =>
      r.id.startsWith("beforePrayer:fajr:"),
    );
    expect(before).toBeDefined();
  });

  it("supports offsets up to ±120 minutes and clamps out-of-range values", () => {
    const late: UserPreferences = {
      ...basePrefs,
      prayerReminderOffsets: { maghrib: 120 },
    };
    const early: UserPreferences = {
      ...basePrefs,
      prayerReminderOffsets: { isha: -120 },
    };
    const clamped: UserPreferences = {
      ...basePrefs,
      prayerReminderOffsets: { dhuhr: 999 },
    };

    const baseMaghrib = buildReminders(basePrefs, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:maghrib:"),
    );
    const lateMaghrib = buildReminders(late, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:maghrib:"),
    );
    expect(baseMaghrib && lateMaghrib).toBeTruthy();
    if (baseMaghrib && lateMaghrib) {
      expect(lateMaghrib.fireAt.getTime() - baseMaghrib.fireAt.getTime()).toBe(120 * 60_000);
    }

    const baseIsha = buildReminders(basePrefs, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:isha:"),
    );
    const earlyIsha = buildReminders(early, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:isha:"),
    );
    expect(baseIsha && earlyIsha).toBeTruthy();
    if (baseIsha && earlyIsha) {
      expect(baseIsha.fireAt.getTime() - earlyIsha.fireAt.getTime()).toBe(120 * 60_000);
    }

    const baseDhuhr = buildReminders(basePrefs, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:dhuhr:"),
    );
    const clampedDhuhr = buildReminders(clamped, SET_LOCATION).find((r) =>
      r.id.startsWith("prayer:dhuhr:"),
    );
    const maxDhuhr = buildReminders(
      { ...basePrefs, prayerReminderOffsets: { dhuhr: 120 } },
      SET_LOCATION,
    ).find((r) => r.id.startsWith("prayer:dhuhr:"));
    expect(baseDhuhr && clampedDhuhr && maxDhuhr).toBeTruthy();
    if (baseDhuhr && clampedDhuhr && maxDhuhr) {
      expect(clampedDhuhr.fireAt.getTime()).toBe(maxDhuhr.fireAt.getTime());
    }
  });

  it("emits daily-content and Friday reminders only when opted in", () => {
    const off = buildReminders(basePrefs, SET_LOCATION);
    expect(off.some((r) => r.id === "dailyContent" || r.id.startsWith("dailyContent:"))).toBe(
      false,
    );
    expect(off.some((r) => r.id.startsWith("friday:"))).toBe(false);
    expect(off.some((r) => r.id.startsWith("fridayAcceptance:"))).toBe(false);

    const on: UserPreferences = {
      ...basePrefs,
      notificationPrefs: { ...basePrefs.notificationPrefs, dailyContent: true, friday: true },
    };
    const reminders = buildReminders(on, SET_LOCATION);
    const daily = reminders.find((r) => r.id === "dailyContent");
    expect(daily).toBeDefined();
    expect(daily?.repeat).toBe("daily");
    const friday = reminders.find((r) => r.id.startsWith("friday:"));
    expect(friday).toBeDefined();
    // Deep-links to Surah Al-Kahf, and the next Friday reminder is a Friday.
    expect(friday?.route).toBe("/quran/18");
    expect(reminders.filter((x) => x.id.startsWith("friday:"))).toHaveLength(1);
    for (const r of reminders.filter((x) => x.id.startsWith("friday:"))) {
      expect(new Date(`${r.id.split(":")[1]}T00:00:00`).getDay()).toBe(5);
    }

    const acceptance = reminders.filter((r) => r.id.startsWith("fridayAcceptance:"));
    expect(acceptance.length).toBeGreaterThanOrEqual(1);
    expect(acceptance.every((r) => r.route === "/friday/hour-of-acceptance")).toBe(true);
    expect(acceptance.some((r) => r.id.startsWith("fridayAcceptance:asr:"))).toBe(true);
    expect(acceptance.some((r) => r.id.startsWith("fridayAcceptance:mid:"))).toBe(true);
    for (const r of acceptance) {
      const dayKey = r.id.split(":")[2];
      expect(new Date(`${dayKey}T00:00:00`).getDay()).toBe(5);
    }
  });

  it("skips hour-of-acceptance reminders on the default Makkah location", () => {
    const on: UserPreferences = {
      ...basePrefs,
      notificationPrefs: { ...basePrefs.notificationPrefs, friday: true },
    };
    const reminders = buildReminders(on, DEFAULT_LOCATION);
    expect(reminders.some((r) => r.id.startsWith("friday:"))).toBe(true);
    expect(reminders.some((r) => r.id.startsWith("fridayAcceptance:"))).toBe(false);
  });

  it("anchors Friday acceptance nudges to Asr and the Asr→Maghrib midpoint", () => {
    const on: UserPreferences = {
      ...basePrefs,
      notificationPrefs: { ...basePrefs.notificationPrefs, friday: true },
    };
    // Fixed Friday morning so both Asr and mid are still upcoming that day.
    const fridayMorning = new Date("2026-07-03T06:00:00.000Z");
    const reminders = buildReminders(on, SET_LOCATION, fridayMorning);
    const asrNudge = reminders.find((r) => r.id.startsWith("fridayAcceptance:asr:"));
    const midNudge = reminders.find((r) => r.id.startsWith("fridayAcceptance:mid:"));
    expect(asrNudge && midNudge).toBeTruthy();
    if (!asrNudge || !midNudge) return;

    const day = new Date("2026-07-03T12:00:00.000Z");
    const times = computePrayerTimes(
      { latitude: SET_LOCATION.latitude, longitude: SET_LOCATION.longitude },
      day,
      SET_LOCATION.method,
      SET_LOCATION.madhab,
    );
    expect(asrNudge.fireAt.getTime()).toBe(times.asr.getTime());
    expect(midNudge.fireAt.getTime()).toBe(
      times.asr.getTime() + (times.maghrib.getTime() - times.asr.getTime()) / 2,
    );
    expect(midNudge.fireAt.getTime()).toBeGreaterThan(asrNudge.fireAt.getTime());
    expect(midNudge.fireAt.getTime()).toBeLessThan(times.maghrib.getTime());
  });

  it("stays within the iOS pending-notification budget", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    expect(reminders.length).toBeLessThanOrEqual(MAX_PENDING_REMINDERS);

    // Worst case: every nudge on — still capped.
    const allOn: UserPreferences = {
      ...basePrefs,
      notificationPrefs: {
        ...basePrefs.notificationPrefs,
        masterEnabled: true,
        prayer: true,
        sunnahPrayer: true,
        beforePrayer: true,
        afterPrayer: true,
        afterAzan: true,
        morningZikr: true,
        eveningZikr: true,
        beforeSleep: true,
        qaza: true,
        dailyContent: true,
        friday: true,
        playAdhanOnPrayer: true,
      },
    };
    expect(buildReminders(allOn, SET_LOCATION).length).toBeLessThanOrEqual(MAX_PENDING_REMINDERS);
  });

  it("uses a single DAILY slot for fixed-clock zikr reminders", () => {
    const reminders = buildReminders(basePrefs, SET_LOCATION);
    const morning = reminders.filter(
      (r) => r.id === "morningZikr" || r.id.startsWith("morningZikr:"),
    );
    expect(morning).toHaveLength(1);
    expect(morning[0]?.repeat).toBe("daily");
  });

  it("skips the Qaza reminder when there is no outstanding Salah or fasting debt", () => {
    const prefs: UserPreferences = {
      ...basePrefs,
      notificationPrefs: { ...basePrefs.notificationPrefs, qaza: true },
    };
    const withoutDebt = buildReminders(prefs, SET_LOCATION, FIXED_NOW, { hasQazaDebt: false });
    expect(withoutDebt.some((r) => r.id === "qaza" || r.id.startsWith("qaza:"))).toBe(false);

    const withDebt = buildReminders(prefs, SET_LOCATION, FIXED_NOW, { hasQazaDebt: true });
    const qaza = withDebt.find((r) => r.id === "qaza");
    expect(qaza).toBeDefined();
    expect(qaza?.repeat).toBe("daily");
    expect(qaza?.route).toBe("/qaza");
  });
});

describe("hasOutstandingQazaDebt", () => {
  it("is false when Salah and fasting remaining are both zero", () => {
    expect(hasOutstandingQazaDebt([{ remaining: 0 }, { remaining: 0 }], { remaining: 0 })).toBe(
      false,
    );
  });

  it("is true when any Salah remaining is positive", () => {
    expect(hasOutstandingQazaDebt([{ remaining: 0 }, { remaining: 2 }], { remaining: 0 })).toBe(
      true,
    );
  });

  it("is true when fasting remaining is positive", () => {
    expect(hasOutstandingQazaDebt([{ remaining: 0 }], { remaining: 1 })).toBe(true);
  });
});

describe("isQazaReminderId", () => {
  it("matches the daily Qaza reminder ids", () => {
    expect(isQazaReminderId("qaza")).toBe(true);
    expect(isQazaReminderId("qaza:2026-07-06")).toBe(true);
    expect(isQazaReminderId("morningZikr")).toBe(false);
    expect(isQazaReminderId("prayer:fajr:2026-07-06")).toBe(false);
  });
});
