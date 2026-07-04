import type { PrayerId } from "./prayer";
import type { WeatherPreferences } from "./weather";

export type AppLocale = "en" | "ar" | "ur";

/** Clock display format for prayer times, reminders, and schedules. */
export type TimeFormat = "12" | "24";

export interface NotificationPreferences {
  masterEnabled: boolean;
  prayer: boolean;
  /** Reminders for sunnah & optional prayers with fixed times. */
  sunnahPrayer: boolean;
  qaza: boolean;
  morningZikr: boolean;
  eveningZikr: boolean;
  beforePrayer: boolean;
  afterPrayer: boolean;
  beforeSleep: boolean;
  afterAzan: boolean;
  achievements: boolean;
}

export interface FontScopePrefs {
  family?: string;
  size?: number;
}

export interface FontPreferences {
  global: FontScopePrefs;
  arabic: FontScopePrefs;
  translation: FontScopePrefs;
  transliteration: FontScopePrefs;
  titles: FontScopePrefs;
  color?: string;
}

export interface UserPreferences {
  locale: AppLocale;
  translationLocale: AppLocale;
  /** Clock display format (12-hour with AM/PM or 24-hour). */
  timeFormat: TimeFormat;
  /** HH:mm */
  bedtime?: string;
  notificationPrefs: NotificationPreferences;
  /** Per-prayer alert overrides; unset entries fall back to category toggles. */
  prayerAlerts?: Partial<Record<PrayerId, boolean>>;
  fontPrefs: FontPreferences;
  favoriteZikrIds: string[];
  favoriteZikrOrder: string[];
  hasCompletedOnboarding: boolean;
  /** Local display name (falls back to the provider's name when signed in). */
  displayName?: string;
  /** Local avatar image URI chosen from the gallery. */
  avatarUri?: string;
  /** Custom accent hex when the user picks their own colour (P7.6). */
  customAccent?: string;
  /** Preferred audio playback speed for the global player. */
  audioSpeed?: number;
  /** Hero weather display and animated overlays. */
  weatherPrefs: WeatherPreferences;
  /** ISO datetime the preferences blob was last edited (sync last-write-wins). */
  updatedAt?: string;
  /** ISO datetime the favorite-zikr list was last edited (sync last-write-wins). */
  favoritesUpdatedAt?: string;
}
