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
  hadithBookmarks: `${PREFIX}/hadith_bookmarks`,
  continueActivity: `${PREFIX}/continue_activity`,
  duaFavorites: `${PREFIX}/user_preferences/favorite_dua_order`,
  duroodFavorites: `${PREFIX}/durood_favorites`,
  nameFavorites: `${PREFIX}/name_favorites`,
  customTasbeeh: `${PREFIX}/custom_tasbeeh`,
  fasting: `${PREFIX}/fasting`,
  khatm: `${PREFIX}/khatm`,
  hifz: `${PREFIX}/hifz`,
  customAdhkar: `${PREFIX}/custom_adhkar`,
  khushuJournal: `${PREFIX}/khushu_journal`,
  hajjChecklist: `${PREFIX}/hajj_checklist`,
  toursSeen: `${PREFIX}/tours_seen`,
  jannahIntentions: `${PREFIX}/jannah_intentions`,
  salahGuideProgress: `${PREFIX}/salah_guide_progress`,
  battlesProgress: `${PREFIX}/battles_progress`,
  quranGuideProgress: `${PREFIX}/quran_guide_progress`,
  taharahProgress: `${PREFIX}/taharah_progress`,
  prophetsProgress: `${PREFIX}/prophets_progress`,
  aqeedahProgress: `${PREFIX}/aqeedah_progress`,
  lastDayProgress: `${PREFIX}/last_day_progress`,
  learnDuaProgress: `${PREFIX}/learn_dua_progress`,
};

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
