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
} as const;

/** Composite key for one prayer on one day. */
export function prayerLogKey(prayerId: string, date: string): string {
  return `${prayerId}::${date}`;
}

/** Composite key for one zikr on one day. */
export function zikrProgressKey(zikrId: string, date: string): string {
  return `${zikrId}::${date}`;
}
