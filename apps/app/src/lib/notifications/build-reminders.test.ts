import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION } from "@/lib/location";
import { buildReminders } from "@/lib/notifications/build-reminders";
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

  it("drops date-based reminders that have already passed relative to now", () => {
    // A `now` far in the future prunes every one-off (date) reminder; only the
    // repeating daily reminders survive.
    const future = new Date(FIXED_NOW.getTime() + 30 * 24 * 60 * 60 * 1000);
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION, future);

    expect(reminders.every((r) => r.repeat === "daily")).toBe(true);
    expect(reminders.length).toBeGreaterThan(0);
  });
});
