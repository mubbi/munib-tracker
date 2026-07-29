/** Mirrors apps/app/src/db/keys.ts — keep in sync when keys change. */
const PREFIX = "@munib-tracker/db";

export const DB_KEYS = {
  version: `${PREFIX}/version`,
  prayerLogs: `${PREFIX}/prayer_logs`,
  zikrProgress: `${PREFIX}/zikr_progress`,
  qazaCounters: `${PREFIX}/qaza_counters`,
  qazaDailyPlans: `${PREFIX}/qaza_daily_plans`,
  qazaSchedule: `${PREFIX}/qaza_schedule`,
  qazaDailyProgress: `${PREFIX}/qaza_daily_progress`,
  qazaRoza: `${PREFIX}/qaza_roza`,
  userPreferences: `${PREFIX}/user_preferences`,
  location: `${PREFIX}/location`,
  syncMetadata: `${PREFIX}/sync_metadata`,
  achievements: `${PREFIX}/achievements`,
  quranBookmarks: `${PREFIX}/quran_bookmarks`,
  quranLastRead: `${PREFIX}/quran_last_read`,
  quranReadingProgress: `${PREFIX}/quran_reading_progress`,
  quranPrefs: `${PREFIX}/quran_prefs`,
  quranEditionCache: `${PREFIX}/quran_edition_cache`,
  hadithBookmarks: `${PREFIX}/hadith_bookmarks`,
  hadithBookCache: `${PREFIX}/hadith_book_cache`,
  continueActivity: `${PREFIX}/continue_activity`,
  duaFavorites: `${PREFIX}/user_preferences/favorite_dua_order`,
  duroodFavorites: `${PREFIX}/durood_favorites`,
  nameFavorites: `${PREFIX}/name_favorites`,
  tombstones: `${PREFIX}/tombstones`,
  customTasbeeh: `${PREFIX}/custom_tasbeeh`,
  fasting: `${PREFIX}/fasting`,
  weeklyReportAt: `${PREFIX}/weekly_report_at`,
  khatm: `${PREFIX}/khatm`,
  hifz: `${PREFIX}/hifz`,
  customAdhkar: `${PREFIX}/custom_adhkar`,
  khushuJournal: `${PREFIX}/khushu_journal`,
  hajjChecklist: `${PREFIX}/hajj_checklist`,
  toursSeen: `${PREFIX}/tours_seen`,
  jannahIntentions: `${PREFIX}/jannah_intentions`,
  jahannamIntentions: `${PREFIX}/jahannam_intentions`,
  salahGuideProgress: `${PREFIX}/salah_guide_progress`,
  battlesProgress: `${PREFIX}/battles_progress`,
  quranGuideProgress: `${PREFIX}/quran_guide_progress`,
  taharahProgress: `${PREFIX}/taharah_progress`,
  prophetsProgress: `${PREFIX}/prophets_progress`,
  aqeedahProgress: `${PREFIX}/aqeedah_progress`,
  lastDayProgress: `${PREFIX}/last_day_progress`,
  learnDuaProgress: `${PREFIX}/learn_dua_progress`,
  weatherCache: `${PREFIX}/weather_cache`,
  audioDurationCache: `${PREFIX}/audio_duration_cache`,
  reverseGeocodeCache: `${PREFIX}/reverse_geocode_cache`,
  duaFavoritesUpdatedAt: `${PREFIX}/dua_favorites_updated_at`,
  duroodFavoritesUpdatedAt: `${PREFIX}/durood_favorites_updated_at`,
  nameFavoritesUpdatedAt: `${PREFIX}/name_favorites_updated_at`,
  quranBookmarksUpdatedAt: `${PREFIX}/quran_bookmarks_updated_at`,
  hadithBookmarksUpdatedAt: `${PREFIX}/hadith_bookmarks_updated_at`,
  customTasbeehUpdatedAt: `${PREFIX}/custom_tasbeeh_updated_at`,
  contentReportQueue: `${PREFIX}/content_report_queue`,
  reviewGating: `${PREFIX}/review_gating_v1`,
  reviewPendingTrigger: `${PREFIX}/review_pending_trigger_v1`,
  reviewReactivationDedupe: `${PREFIX}/review_reactivation_dedupe_v1`,
  blobSyncState: `${PREFIX}/blob_sync_state`,
};

/** Mirrors packages/theme STORAGE_KEYS. */
export const THEME_STORAGE_KEYS = {
  colorMode: "@munib-tracker/color-mode",
  accent: "@munib-tracker/accent",
};

export function prayerLogKey(prayerId, date) {
  return `${prayerId}::${date}`;
}

export function zikrProgressKey(zikrId, date, prayerId) {
  return prayerId ? `${zikrId}::${date}::${prayerId}` : `${zikrId}::${date}`;
}
