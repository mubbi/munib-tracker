export type AppLocale = "en" | "ar" | "ur";

export interface NotificationPreferences {
  masterEnabled: boolean;
  prayer: boolean;
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
  /** HH:mm */
  bedtime?: string;
  notificationPrefs: NotificationPreferences;
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
}
