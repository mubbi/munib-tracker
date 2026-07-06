/** All persisted AsyncStorage keys live under this namespace. */
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
  // Ordered favorite-dua id list. Kept under the user_preferences namespace for
  // backward compatibility with data written before this key was centralized.
  duaFavorites: `${PREFIX}/user_preferences/favorite_dua_order`,
  // Ordered favorite id lists for duroods and the 99 names.
  duroodFavorites: `${PREFIX}/durood_favorites`,
  nameFavorites: `${PREFIX}/name_favorites`,
  // Pending deletions awaiting sync (records the server should tombstone).
  tombstones: `${PREFIX}/tombstones`,
  // User-created tasbeeh counters (title, target, persisted count).
  customTasbeeh: `${PREFIX}/custom_tasbeeh`,
  // Ramadan fasting log: which days were fasted (date → status).
  fasting: `${PREFIX}/fasting`,
  // ISO datetime the last weekly worship report was delivered (NF-1.6).
  weeklyReportAt: `${PREFIX}/weekly_report_at`,
  // Khatm (complete-the-Qur'an) reading plan + progress (NF-1.8).
  khatm: `${PREFIX}/khatm`,
  // Hifz (memorization) status per ayah (NF-1.9).
  hifz: `${PREFIX}/hifz`,
  // User-authored adhkar (personal dhikr collection) — NF-2.11.
  customAdhkar: `${PREFIX}/custom_adhkar`,
  // Post-salah khushu reflections (rating + note per prayer/day) — NF-2.12.
  khushuJournal: `${PREFIX}/khushu_journal`,
  // Hajj & Umrah checklist completion state (per rite id) — NF-2.3.
  hajjChecklist: `${PREFIX}/hajj_checklist`,
  // Ids of in-app feature tours the user has completed/dismissed — NF-2.24.
  toursSeen: `${PREFIX}/tours_seen`,
  // Private daily intention toggles on Journey to Jannah (not synced).
  jannahIntentions: `${PREFIX}/jannah_intentions`,
  jahannamIntentions: `${PREFIX}/jahannam_intentions`,
  // Completed Learn Salah lesson ids (not synced).
  salahGuideProgress: `${PREFIX}/salah_guide_progress`,
  // Completed Battles in Islam topic ids (not synced).
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
  // Blob-level last-write-wins timestamps for entities synced as a single record
  // (the list itself carries no top-level updatedAt). Bumped on every mutation.
  duaFavoritesUpdatedAt: `${PREFIX}/dua_favorites_updated_at`,
  duroodFavoritesUpdatedAt: `${PREFIX}/durood_favorites_updated_at`,
  nameFavoritesUpdatedAt: `${PREFIX}/name_favorites_updated_at`,
  quranBookmarksUpdatedAt: `${PREFIX}/quran_bookmarks_updated_at`,
  hadithBookmarksUpdatedAt: `${PREFIX}/hadith_bookmarks_updated_at`,
  customTasbeehUpdatedAt: `${PREFIX}/custom_tasbeeh_updated_at`,
  // Queued content reports awaiting upload when back online.
  contentReportQueue: `${PREFIX}/content_report_queue`,
} as const;

/** Composite key for one prayer on one day. */
export function prayerLogKey(prayerId: string, date: string): string {
  return `${prayerId}::${date}`;
}

/** Composite key for one zikr on one day. */
export function zikrProgressKey(zikrId: string, date: string): string {
  return `${zikrId}::${date}`;
}
