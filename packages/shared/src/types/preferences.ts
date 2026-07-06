import type { PrayerId } from "./prayer";
import type { WeatherPreferences } from "./weather";

export type AppLocale = "en" | "ar" | "ur";

/** Clock display format for prayer times, reminders, and schedules. */
export type TimeFormat = "12" | "24";

/** Calendar system used for on-screen dates and calendar pickers. */
export type CalendarMode = "gregorian" | "hijri";

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
  /**
   * Play the adhan as the notification sound at each obligatory prayer time
   * (native only — custom notification sounds require a dev/EAS build and do not
   * work in Expo Go or on the web).
   */
  playAdhanOnPrayer: boolean;
  /** A daily reflection nudge (verse / hadith of the day) — NF-1.24. */
  dailyContent: boolean;
  /** Friday reminder for Jumu'ah + Surah Al-Kahf — NF-1.25. */
  friday: boolean;
}

export interface FontScopePrefs {
  family?: string;
  size?: number;
}

/** Reading surfaces that can carry an in-context font-size delta on top of the global sizes. */
export type ReadingSurface =
  | "quran"
  | "hadith"
  | "dua_zikr"
  | "salah_guide"
  | "jannah"
  | "jahannam"
  | "battles"
  | "taharah"
  | "prophets"
  | "aqeedah"
  | "last_day"
  | "learn_dua"
  | "learn_quran";

/** A per-surface size adjustment applied on top of the global font sizes. */
export interface ReadingSizeOverride {
  /** Points added to the resolved Arabic size (clamped by the resolver). */
  arabicDelta?: number;
  /** Points added to the resolved transliteration + translation size. */
  textDelta?: number;
}

export interface FontPreferences {
  global: FontScopePrefs;
  arabic: FontScopePrefs;
  translation: FontScopePrefs;
  transliteration: FontScopePrefs;
  titles: FontScopePrefs;
  color?: string;
  /** In-context A−/A+ deltas per reading surface, applied over the global sizes. */
  readingOverrides?: Partial<Record<ReadingSurface, ReadingSizeOverride>>;
}

export interface UserPreferences {
  locale: AppLocale;
  translationLocale: AppLocale;
  /** Clock display format (12-hour with AM/PM or 24-hour). */
  timeFormat: TimeFormat;
  /** Default calendar for dates shown across the app and calendar tabs. */
  defaultCalendar: CalendarMode;
  /** HH:mm */
  bedtime?: string;
  notificationPrefs: NotificationPreferences;
  /** Per-prayer alert overrides; unset entries fall back to category toggles. */
  prayerAlerts?: Partial<Record<PrayerId, boolean>>;
  /**
   * Per-prayer reminder offset in minutes applied to the main obligatory-prayer
   * reminder (negative = before the adhan, positive = after, ±120). Unset ⇒
   * fires at adhan time (NF-1.7).
   */
  prayerReminderOffsets?: Partial<Record<PrayerId, number>>;
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
  /** Selected adhan style id (NF-1.26); resolves against the bundled ADHAN_STYLES. */
  adhanStyleId?: string;
  /** Ordered ids of the home quick actions to show (NF-1.23); unset ⇒ show all. */
  quickActionOrder?: string[];
  /** Home module ids the user has hidden (NF-1.21); unset ⇒ all visible. */
  hiddenHomeModules?: string[];
  /** Ordered ids of library tab entries to show (NF-1.22); unset ⇒ show all. */
  libraryMenuOrder?: string[];
  /** Preferred audio playback speed for the global player. */
  audioSpeed?: number;
  /** Preferred audio volume for the global player (0–1). */
  audioVolume?: number;
  /** Hero weather display and animated overlays. */
  weatherPrefs: WeatherPreferences;
  /** Vibration feedback on taps and meaningful actions (native only). */
  hapticsEnabled: boolean;
  /** ISO datetime the preferences blob was last edited (sync last-write-wins). */
  updatedAt?: string;
  /** ISO datetime the favorite-zikr list was last edited (sync last-write-wins). */
  favoritesUpdatedAt?: string;
}
