import type {
  NotificationPreferences,
  ObligatoryPrayer,
  PrayerId,
  QazaPrayer,
  RawatibExtraPrayer,
  RawatibId,
  RawatibPrayer,
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
export { DUA_COUNT } from "./content-counts";
export {
  BUNDLED_DATA_CREDITS,
  type DataCredit,
  QURANIC_ARABIC_CORPUS_NOTICE,
  RUNTIME_DATA_CREDITS,
  SERVICE_DATA_CREDITS,
} from "./credits";
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
  ANDROID_PLAY_STORE_MARKET_URL,
  buildAndroidWriteReviewUrl,
  buildIosWriteReviewUrl,
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
  buildMarketingSiteUrl,
  OFFICIAL_ADMIN_ORIGIN,
  OFFICIAL_ANDROID_PACKAGE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_APP_WEB_ORIGIN,
  OFFICIAL_IOS_APP_STORE_ID,
  OFFICIAL_IOS_APP_STORE_URL,
  OFFICIAL_IOS_BUNDLE_IDENTIFIER,
  OFFICIAL_SITE_ORIGIN,
} from "./site";
export {
  normalizeUserMediaMime,
  sniffUserMediaMime,
  USER_MEDIA_ALLOWED_MIME_TYPES,
  USER_MEDIA_FILE_NAME_MAX,
  USER_MEDIA_MAX_BYTES,
  USER_MEDIA_MAX_PER_ENTITY,
  type UserMediaAllowedMimeType,
} from "./user-media";

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
  fajr_before: "Sunnah before Fajr",
  dhuhr_before: "Sunnah before Dhuhr",
  dhuhr_after: "Sunnah after Dhuhr",
  maghrib_after: "Sunnah after Maghrib",
  isha_after: "Sunnah after Isha",
  asr_before: "Sunnah before Asr",
  maghrib_before: "Sunnah before Maghrib",
  isha_before: "Sunnah before Isha",
  dhuhr_after_extra: "Extra sunnah after Dhuhr",
};

/**
 * The sunnah mu'akkadah rawatib (NF-3.1), in daily order. Logged as their own
 * prayer ids; never part of qaza, fard totals, streaks or perfect days.
 */
export const RAWATIB_PRAYERS = [
  "fajr_before",
  "dhuhr_before",
  "dhuhr_after",
  "maghrib_after",
  "isha_after",
] as const satisfies readonly RawatibPrayer[];

/** Optional ghayr mu'akkadah extras (D8), in daily order. */
export const RAWATIB_EXTRA_PRAYERS = [
  "dhuhr_after_extra",
  "asr_before",
  "maghrib_before",
  "isha_before",
] as const satisfies readonly RawatibExtraPrayer[];

/** Every rawatib id (mu'akkadah + extras). */
export const RAWATIB_IDS = [
  ...RAWATIB_PRAYERS,
  ...RAWATIB_EXTRA_PRAYERS,
] as const satisfies readonly RawatibId[];

/** The fard each rawatib row is attached to. */
export const RAWATIB_PARENT: Readonly<Record<RawatibId, ObligatoryPrayer>> = {
  fajr_before: "fajr",
  dhuhr_before: "dhuhr",
  dhuhr_after: "dhuhr",
  dhuhr_after_extra: "dhuhr",
  asr_before: "asr",
  maghrib_before: "maghrib",
  maghrib_after: "maghrib",
  isha_before: "isha",
  isha_after: "isha",
};

/** Whether a row is prayed before or after its fard. */
export const RAWATIB_POSITION: Readonly<Record<RawatibId, "before" | "after">> = {
  fajr_before: "before",
  dhuhr_before: "before",
  dhuhr_after: "after",
  dhuhr_after_extra: "after",
  asr_before: "before",
  maghrib_before: "before",
  maghrib_after: "after",
  isha_before: "before",
  isha_after: "after",
};

/** Rak'at choices per row; the first entry is the fixed/default count. */
export const RAWATIB_RAKAH_OPTIONS: Readonly<Record<RawatibId, readonly number[]>> = {
  fajr_before: [2],
  dhuhr_before: [2, 4],
  dhuhr_after: [2],
  dhuhr_after_extra: [2],
  asr_before: [4, 2],
  maghrib_before: [2],
  maghrib_after: [2],
  isha_before: [2, 4],
  isha_after: [2],
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
export const RAWATIB_PRAYER_SET: ReadonlySet<string> = new Set(RAWATIB_IDS);

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
  before_prayer: "Before Salah",
  after_prayer: "After Salah",
  after_azan: "After Adhan",
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
  whiteDays: false,
  // NF-3.2: weekly (Mon/Thu) intent reminders off, seasonal (Arafah, Ashura, …) on.
  voluntaryFasting: { weekly: false, seasonal: true },
  // NF-3.5 habits nudge off; NF-3.3 seasonal Dhul-Hijjah nudges on, takbir off.
  habits: false,
  dhulHijjah: true,
  takbirTashriq: false,
  // NF-3.1: the after-fard rawatib nudge is opt-in.
  rawatibNudge: false,
  // D40: the school's preferred-time reminder is opt-in.
  preferredTime: false,
  // NF-3.13: the native "Tap to confirm your salah" alert from the focus-lock shield.
  focusLock: true,
  // D33: circle event pushes (khatm progress / completed, dua received) on.
  circleKhatmProgress: true,
  circleKhatmCompleted: true,
  circleDuaReceived: true,
  // D40: weekly family digest push to parents on.
  circleFamilyDigest: true,
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
    arabic: {},
    translation: {},
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
