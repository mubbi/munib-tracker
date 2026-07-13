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
  quranStudyCache: `${PREFIX}/quran_study_cache`,
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
  // In-app review funnel gating state (device-local).
  reviewGating: `${PREFIX}/review_gating_v1`,
  reviewPendingTrigger: `${PREFIX}/review_pending_trigger_v1`,
  reviewReactivationDedupe: `${PREFIX}/review_reactivation_dedupe_v1`,
  // Per-entity content-hash + last-synced timestamp for blob-synced userData
  // (fasting, khatm, learning progress, …). Drives change/deletion detection for
  // the generic cloud-sync path in `sync/blob-sync.ts`. Device-local: rebuilds on
  // the next sync, so it's never backed up and is cleared on reset.
  blobSyncState: `${PREFIX}/blob_sync_state`,
  // Zakat calculator draft (currency, assets, metal prices, nisab) — device-local.
  zakatCalculator: `${PREFIX}/zakat_calculator`,
  /** @deprecated Prefer {@link DB_KEYS.zakatCalculator}; kept for one-time migration. */
  zakatCurrency: `${PREFIX}/zakat_currency`,
} as const;

/**
 * How each key is persisted. Classifying every key here — with a
 * `Record<keyof typeof DB_KEYS, …>` that fails to compile when a key is left out
 * — is what keeps {@link RESET_KEYS} and {@link BACKUP_KEYS} exhaustive as new
 * features add keys, replacing the two hand-maintained lists that used to drift.
 *
 * - `userData`    personal tracking/content — backed up, and wiped on reset.
 * - `watermark`   blob-level last-write-wins timestamp — travels with its userData.
 * - `cache`       rebuildable network cache — wiped on reset, never backed up.
 * - `deviceLocal` sync cursors, tombstones, upload queues, one-off UI flags —
 *                 wiped on reset, never backed up (device-specific, not portable).
 * - `schema`      storage schema version — survives reset, never backed up.
 */
export type KeyPersistence = "userData" | "watermark" | "cache" | "deviceLocal" | "schema";

const KEY_PERSISTENCE: Record<keyof typeof DB_KEYS, KeyPersistence> = {
  version: "schema",
  prayerLogs: "userData",
  zikrProgress: "userData",
  qazaCounters: "userData",
  qazaDailyPlans: "userData",
  qazaSchedule: "userData",
  qazaDailyProgress: "userData",
  qazaRoza: "userData",
  userPreferences: "userData",
  location: "userData",
  syncMetadata: "deviceLocal",
  achievements: "userData",
  quranBookmarks: "userData",
  quranLastRead: "userData",
  quranReadingProgress: "userData",
  quranPrefs: "userData",
  quranEditionCache: "cache",
  quranStudyCache: "cache",
  hadithBookmarks: "userData",
  hadithBookCache: "cache",
  continueActivity: "userData",
  duaFavorites: "userData",
  duroodFavorites: "userData",
  nameFavorites: "userData",
  tombstones: "deviceLocal",
  customTasbeeh: "userData",
  fasting: "userData",
  weeklyReportAt: "deviceLocal",
  khatm: "userData",
  hifz: "userData",
  customAdhkar: "userData",
  khushuJournal: "userData",
  hajjChecklist: "userData",
  toursSeen: "deviceLocal",
  jannahIntentions: "userData",
  jahannamIntentions: "userData",
  salahGuideProgress: "userData",
  battlesProgress: "userData",
  quranGuideProgress: "userData",
  taharahProgress: "userData",
  prophetsProgress: "userData",
  aqeedahProgress: "userData",
  lastDayProgress: "userData",
  learnDuaProgress: "userData",
  weatherCache: "cache",
  audioDurationCache: "cache",
  reverseGeocodeCache: "cache",
  duaFavoritesUpdatedAt: "watermark",
  duroodFavoritesUpdatedAt: "watermark",
  nameFavoritesUpdatedAt: "watermark",
  quranBookmarksUpdatedAt: "watermark",
  hadithBookmarksUpdatedAt: "watermark",
  customTasbeehUpdatedAt: "watermark",
  contentReportQueue: "deviceLocal",
  reviewGating: "deviceLocal",
  reviewPendingTrigger: "deviceLocal",
  reviewReactivationDedupe: "deviceLocal",
  blobSyncState: "deviceLocal",
  zakatCalculator: "deviceLocal",
  zakatCurrency: "deviceLocal",
};

function keysMatching(classes: readonly KeyPersistence[]): string[] {
  return (Object.keys(KEY_PERSISTENCE) as (keyof typeof DB_KEYS)[])
    .filter((key) => classes.includes(KEY_PERSISTENCE[key]))
    .map((key) => DB_KEYS[key]);
}

/**
 * Keys serialized into a portable backup: the user's own data plus the LWW
 * watermarks that guard it. Caches, sync cursors and the schema marker are
 * excluded — they rebuild themselves or are device-specific.
 */
export const BACKUP_KEYS: string[] = keysMatching(["userData", "watermark"]);

/**
 * Keys wiped when a user resets/deletes their account: everything we persist
 * except the schema-version marker (kept so migrations don't needlessly re-run
 * against an already-current, now-empty store).
 */
export const RESET_KEYS: string[] = keysMatching(["userData", "watermark", "cache", "deviceLocal"]);

/** Composite key for one prayer on one day. */
export function prayerLogKey(prayerId: string, date: string): string {
  return `${prayerId}::${date}`;
}

/** Composite key for one zikr on one day, optionally scoped to a fard prayer. */
export function zikrProgressKey(zikrId: string, date: string, prayerId?: string): string {
  return prayerId ? `${zikrId}::${date}::${prayerId}` : `${zikrId}::${date}`;
}
