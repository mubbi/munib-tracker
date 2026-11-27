import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";

/** Notification prefs with the master switch, fard and sunnah reminders on. */
export function buildNotificationPreferences(
  overrides: Partial<NotificationPreferences> = {},
): NotificationPreferences {
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    masterEnabled: true,
    prayer: true,
    sunnahPrayer: true,
    ...overrides,
  };
}

/** An onboarded English user (24h clock) with reminders enabled. */
export function buildUserPreferences(overrides: Partial<UserPreferences> = {}): UserPreferences {
  return {
    locale: "en",
    translationLocale: "en",
    timeFormat: "24",
    bedtime: "22:30",
    notificationPrefs: buildNotificationPreferences(),
    prayerAlerts: {},
    fontPrefs: {
      arabic: {},
      translation: {},
    },
    favoriteZikrIds: [],
    favoriteZikrOrder: [],
    hasCompletedOnboarding: true,
    ...overrides,
  } as UserPreferences;
}
