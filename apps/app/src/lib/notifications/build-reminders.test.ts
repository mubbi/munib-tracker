import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION } from "@/lib/location";
import { buildReminders, summarizeReminders } from "@/lib/notifications/build-reminders";
import { computePrayerTimes } from "@/lib/prayer-times";

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
    afterPrayer: false,
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
  it("includes prayer, azan, and before-prayer slots for enabled toggles", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);
    const ids = reminders.map((item) => item.id.split(":")[0]);

    expect(ids).toContain("prayer");
    expect(ids).toContain("afterAzan");
    expect(ids).toContain("beforePrayer");
    expect(ids).not.toContain("afterPrayer");
    expect(reminders.some((item) => item.id.startsWith("prayer:tahajjud:"))).toBe(true);
  });

  it("deep-links each reminder to the collection it is about", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);

    // Every reminder carries a non-empty in-app route so a tap always lands somewhere useful.
    expect(reminders.every((item) => typeof item.route === "string" && item.route.length > 0)).toBe(
      true,
    );

    const routeFor = (prefix: string) =>
      reminders.find((item) => item.id.startsWith(prefix))?.route;

    expect(routeFor("prayer:")).toBe("/tracker");
    expect(routeFor("afterAzan:")).toBe("/zikr/after_azan");
    expect(routeFor("beforePrayer:")).toBe("/zikr/before_prayer");
  });

  it("carries the reminder route through to summary rows", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);
    const rows = summarizeReminders(reminders, "24");

    const azan = rows.find((row) => row.id.startsWith("afterAzan:"));
    expect(azan?.route).toBe("/zikr/after_azan");
  });

  it("does not schedule after-adhan reminders for Witr", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);

    expect(reminders.some((item) => item.id.startsWith("afterAzan:witr:"))).toBe(false);
    expect(reminders.some((item) => item.id.startsWith("afterAzan:fajr:"))).toBe(true);
    expect(reminders.some((item) => item.id.startsWith("prayer:witr:"))).toBe(true);
  });

  it("computes Fajr's fireAt from the prayer-times engine, not a static hint", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);

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
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION);
    const rows = summarizeReminders(reminders, "12");

    const keys = rows.map((row) => `${row.title}\0${row.body}`);
    expect(new Set(keys).size).toBe(keys.length);

    const tahajjud = rows.filter((row) => row.title.toLowerCase().includes("tahajjud"));
    expect(tahajjud).toHaveLength(1);
    expect(tahajjud[0]?.fireAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("drops reminders that have already passed relative to now", () => {
    const future = new Date(FIXED_NOW.getTime() + 30 * 24 * 60 * 60 * 1000);
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION, future);

    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders.every((r) => r.fireAt.getTime() > future.getTime() - 60_000)).toBe(true);
  });
});
