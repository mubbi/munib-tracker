import type {
  NotificationPreferences,
  ObligatoryPrayer,
  PrayerId,
  SunnahPrayer,
  UserPreferences,
  ZikrCategoryId,
} from "../types/index";

export const APP_NAME = "Munib Tracker";
export const APP_TAGLINE = "Track salah, dhikr, and qadha in your journey back to Allah.";

/** The five timed daily prayers plus Witr, treated as obligatory in this app. */
export const OBLIGATORY_PRAYERS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "witr",
] as const satisfies readonly ObligatoryPrayer[];

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

/** Display names for the five timed prayers plus Witr. */
export const PRAYER_NAMES = OBLIGATORY_PRAYERS.map((id) => PRAYER_LABELS[id]);

export const SUNNAH_PRAYER_NAMES = SUNNAH_PRAYERS.map((id) => PRAYER_LABELS[id]);

/** Legacy category list. */
export const TRACKER_CATEGORIES = ["salah", "dhikr", "qadha"] as const;

export const ZIKR_CATEGORY_IDS = [
  "morning",
  "evening",
  "before_prayer",
  "after_prayer",
  "after_azan",
  "before_sleep",
  "anytime",
] as const satisfies readonly ZikrCategoryId[];

export const ZIKR_CATEGORY_LABELS: Record<ZikrCategoryId, string> = {
  morning: "Morning Adhkar",
  evening: "Evening Adhkar",
  before_prayer: "Before Prayer",
  after_prayer: "After Prayer",
  after_azan: "After Azan",
  before_sleep: "Before Sleep",
  anytime: "Anytime Zikr",
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  masterEnabled: false,
  prayer: true,
  qaza: true,
  morningZikr: true,
  eveningZikr: true,
  beforePrayer: false,
  afterPrayer: false,
  beforeSleep: true,
  afterAzan: false,
  achievements: true,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  locale: "en",
  translationLocale: "en",
  bedtime: "22:30",
  notificationPrefs: DEFAULT_NOTIFICATION_PREFERENCES,
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
};
