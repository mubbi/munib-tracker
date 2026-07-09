import type {
  NotificationPreferences,
  ObligatoryPrayer,
  PrayerId,
  QazaPrayer,
  SunnahPrayer,
  UserPreferences,
  WeatherPreferences,
  WitrPrayer,
  ZikrCategoryId,
} from "../types/index";

export {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SLUG,
  APP_TAGLINE,
} from "./branding";
export {
  APP_ACHIEVEMENTS,
  APP_FEATURE_PILLARS,
  APP_HOME_FEATURES,
  APP_VALUE_PROPS,
  type AppFeatureIcon,
  type AppFeaturePillar,
  type AppHomeFeature,
  type AppValueProp,
} from "./features";
export {
  QURAN_TOTAL_AYAHS,
  QURAN_TOTAL_HIZBS,
  QURAN_TOTAL_PAGES,
} from "./quran";
export {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
  buildMarketingSiteUrl,
  OFFICIAL_ANDROID_PACKAGE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_APP_WEB_ORIGIN,
  OFFICIAL_IOS_APP_STORE_URL,
  OFFICIAL_IOS_BUNDLE_IDENTIFIER,
  OFFICIAL_SITE_ORIGIN,
} from "./site";

/** Minutes before/after adhan the main obligatory-prayer reminder may be shifted (NF-1.7). */
export const PRAYER_REMINDER_OFFSET_MIN = -120;
export const PRAYER_REMINDER_OFFSET_MAX = 120;

/** Clamps a per-prayer reminder offset to the allowed range. */
export function clampPrayerReminderOffset(minutes: number): number {
  return Math.max(PRAYER_REMINDER_OFFSET_MIN, Math.min(PRAYER_REMINDER_OFFSET_MAX, minutes));
}

/** The five daily fard prayers. */
export const OBLIGATORY_PRAYERS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const satisfies readonly ObligatoryPrayer[];

/** Witr — sunnah mu'akkadah, tracked separately from the five fard prayers. */
export const WITR_PRAYER = "witr" as const satisfies WitrPrayer;

/** Fard plus Witr — used for qaza counters and lifetime estimates (Witr make-up is madhhab-dependent). */
export const QAZA_PRAYERS = [
  ...OBLIGATORY_PRAYERS,
  WITR_PRAYER,
] as const satisfies readonly QazaPrayer[];

/** The five daily prayers called with adhan. Witr is prayed after Isha without a separate adhan. */
export const ADHAN_PRAYERS = [...OBLIGATORY_PRAYERS] as const satisfies readonly ObligatoryPrayer[];

export const SUNNAH_PRAYERS = [
  "tahajjud",
  "ishraq",
  "duha",
  "tahiyyatul_masjid",
  "hajat_istikhara",
] as const satisfies readonly SunnahPrayer[];

export const PRAYER_LABELS: Record<PrayerId, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  witr: "Witr",
  tahajjud: "Tahajjud",
  ishraq: "Ishraq",
  duha: "Duha",
  tahiyyatul_masjid: "Tahiyyatul Masjid",
  hajat_istikhara: "Hajat & Istikhara",
};

/** Display names for the five fard prayers plus Witr. */
export const PRAYER_NAMES = QAZA_PRAYERS.map((id) => PRAYER_LABELS[id]);

export const SUNNAH_PRAYER_NAMES = SUNNAH_PRAYERS.map((id) => PRAYER_LABELS[id]);

/** Top-level tracking categories (consumed by the marketing site). */
export const TRACKER_CATEGORIES = ["salah", "dhikr", "qadha"] as const;

/** Shared read-only lookup sets, so consumers don't each re-allocate them. */
export const OBLIGATORY_PRAYER_SET: ReadonlySet<string> = new Set(OBLIGATORY_PRAYERS);
export const QAZA_PRAYER_SET: ReadonlySet<string> = new Set(QAZA_PRAYERS);
export const ADHAN_PRAYER_SET: ReadonlySet<string> = new Set(ADHAN_PRAYERS);
export const SUNNAH_PRAYER_SET: ReadonlySet<string> = new Set(SUNNAH_PRAYERS);

export const ZIKR_CATEGORY_IDS = [
  "morning",
  "evening",
  "before_prayer",
  "after_prayer",
  "after_azan",
  "before_sleep",
  "anytime",
] as const satisfies readonly ZikrCategoryId[];

export const ZIKR_CATEGORY_SET: ReadonlySet<string> = new Set(ZIKR_CATEGORY_IDS);

export const ZIKR_CATEGORY_LABELS: Record<ZikrCategoryId, string> = {
  morning: "Morning Adhkar",
  evening: "Evening Adhkar",
  before_prayer: "Before Prayer",
  after_prayer: "After Prayer",
  after_azan: "After Azan",
  before_sleep: "Before Sleep",
  anytime: "Anytime Zikr",
};

export const DEFAULT_WEATHER_PREFERENCES: WeatherPreferences = {
  effectsEnabled: true,
  unit: "celsius",
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  masterEnabled: false,
  prayer: true,
  sunnahPrayer: true,
  qaza: true,
  morningZikr: true,
  eveningZikr: true,
  beforePrayer: false,
  afterPrayer: false,
  beforeSleep: true,
  afterAzan: false,
  achievements: true,
  playAdhanOnPrayer: false,
  dailyContent: false,
  friday: false,
  reviewReactivationEnabled: true,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  locale: "en",
  translationLocale: "en",
  timeFormat: "24",
  defaultCalendar: "hijri",
  bedtime: "22:30",
  notificationPrefs: DEFAULT_NOTIFICATION_PREFERENCES,
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
  hasCompletedOnboarding: false,
  audioVolume: 1,
  cacheAudioLocally: true,
  cacheQuranEditionsLocally: true,
  cacheHadithLocally: true,
  weatherPrefs: DEFAULT_WEATHER_PREFERENCES,
  hapticsEnabled: true,
};
