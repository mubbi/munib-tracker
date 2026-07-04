import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION } from "@/lib/location";
import { buildReminders } from "@/lib/notifications/build-reminders";

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

describe("buildReminders", () => {
  it("includes prayer, azan, and before-prayer slots for enabled toggles", () => {
    const reminders = buildReminders(basePrefs, DEFAULT_LOCATION, new Date("2026-07-03T12:00:00"));
    const ids = reminders.map((item) => item.id.split(":")[0]);

    expect(ids).toContain("prayer");
    expect(ids).toContain("afterAzan");
    expect(ids).toContain("beforePrayer");
    expect(ids).not.toContain("afterPrayer");
    expect(reminders.some((item) => item.id.startsWith("prayer:tahajjud:"))).toBe(true);
  });

  it("uses computed times instead of static prayer hints", () => {
    const reminders = buildReminders(
      { ...basePrefs, notificationPrefs: { ...basePrefs.notificationPrefs, prayer: true } },
      DEFAULT_LOCATION,
      new Date("2026-07-03T12:00:00"),
    );
    const fajr = reminders.find((item) => item.id.startsWith("prayer:fajr:"));
    expect(fajr?.fireAt.getHours()).not.toBe(4);
  });
});
