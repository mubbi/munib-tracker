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
  // Sharded under `${quranEditionCache}/${encodeURIComponent(edition:surah)}`.
  quranEditionCache: `${PREFIX}/quran_edition_cache`,
  // Sharded under `${quranStudyCache}/${encodeURIComponent(studyKey)}`.
  quranStudyCache: `${PREFIX}/quran_study_cache`,
  hadithBookmarks: `${PREFIX}/hadith_bookmarks`,
  hadithPrefs: `${PREFIX}/hadith_prefs`,
  // Sharded under `${hadithBookCache}/${encodeURIComponent(collectionKey)}`.
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
  // Hajj rite checklist completion state (per rite id) — NF-2.3.
  hajjChecklist: `${PREFIX}/hajj_checklist`,
  // Umrah rite checklist completion state (per rite id) — NF-2.3.
  umrahChecklist: `${PREFIX}/umrah_checklist`,
  // NF-3.4 Umrah mode sessions (id → session) — cloud-synced blob, per-session LWW merge.
  umrahSessions: `${PREFIX}/umrah_sessions`,
  // Friday / Jumu'ah checklist completion (itemId::date) — cloud-synced blob.
  fridayChecklist: `${PREFIX}/friday_checklist`,
  // LEGACY White Days checklist (itemId::hijriYear-hijriMonth): local only, folded into
  // `voluntaryFasting` by lib/white-days-migration.ts (sync entity retired).
  whiteDaysChecklist: `${PREFIX}/white_days_checklist`,
  // NF-3.5 daily Sunnah habits (selection, custom, checks) — cloud-synced blob, custom merge.
  sunnahHabits: `${PREFIX}/sunnah_habits`,
  // NF-3.3 Dhul-Hijjah mode per Hijri year (checklists, tashriq, udhiyah plan) — cloud-synced blob.
  dhulHijjah: `${PREFIX}/dhul_hijjah`,
  // NF-3.2 voluntary fasting log (date → entry); per-date LWW sync merge.
  voluntaryFasting: `${PREFIX}/voluntary_fasting`,
  // NF-3.14 weekly coach: shown insight ids, accepted micro-goals + outcomes,
  // dismiss/snooze — no raw data. Blob entity `coach_history`, custom merge.
  coachHistory: `${PREFIX}/coach_history`,
  // D40 daily Qur'an reading log (date → seconds/ayahs/pages); blob entity
  // `quran_reading_log`, per-date max merge, pruned to 400 days.
  quranReadingLog: `${PREFIX}/quran_reading_log`,
  // Ids of in-app feature tours the user has completed/dismissed — NF-2.24 (cloud-synced).
  toursSeen: `${PREFIX}/tours_seen`,
  // Private daily intention toggles on Journey to Jannah — blob-synced.
  jannahIntentions: `${PREFIX}/jannah_intentions`,
  jahannamIntentions: `${PREFIX}/jahannam_intentions`,
  // Completed Learn Salah lesson ids — blob-synced.
  salahGuideProgress: `${PREFIX}/salah_guide_progress`,
  // Completed Battles in Islam topic ids — blob-synced.
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
  // Ratings & reviews gating state (D76, device-local).
  reviewGating: `${PREFIX}/review_gating_v1`,
  // LEGACY pre-D76 review funnel (persisted wake trigger, local nudge dedupe): no longer
  // read or written; kept so a data reset still clears what older builds left behind.
  reviewPendingTrigger: `${PREFIX}/review_pending_trigger_v1`,
  /** Deferred invite (install referrer / clipboard) already checked on this install. */
  deferredInviteChecked: `${PREFIX}/deferred_invite_checked_v1`,
  reviewReactivationDedupe: `${PREFIX}/review_reactivation_dedupe_v1`,
  // Per-entity content-hash + last-synced timestamp for blob-synced userData
  // (fasting, khatm, learning progress, …). Drives change/deletion detection for
  // the generic cloud-sync path in `sync/blob-sync.ts`. Device-local: rebuilds on
  // the next sync, so it's never backed up and is cleared on reset.
  blobSyncState: `${PREFIX}/blob_sync_state`,
  // Zakat calculator draft (currency, assets, metal prices, nisab) — cloud-synced.
  zakatCalculator: `${PREFIX}/zakat_calculator`,
  /** @deprecated Prefer {@link DB_KEYS.zakatCalculator}; kept for one-time migration. */
  zakatCurrency: `${PREFIX}/zakat_currency`,
  // Fidyah / kaffarah estimate draft — cloud-synced.
  fidyahCalculator: `${PREFIX}/fidyah_calculator`,
  // Sadaqah intention + giving log — cloud-synced.
  sadaqahGoals: `${PREFIX}/sadaqah_goals`,
  // LEGACY show/hide transliteration + translation pair: local only, read once by
  // lib/settings/reading-display-migration.ts into `preferences.readingDisplay` (D13).
  readingTextVisibility: `${PREFIX}/reading_text_visibility`,
  // Qur'an practice (recitation companion) prefs — cloud-synced, LWW.
  quranCompanionPrefs: `${PREFIX}/quran_companion_prefs`,
  // Last 30 practice session summaries + a clearedAt marker — cloud-synced, custom merge.
  quranPracticeSessions: `${PREFIX}/quran_practice_sessions`,
  // D71 Recitation track: lifetime practice totals (sessions, ayahs recited, revision
  // days) credited once per session id, so the 30-row history cap never lowers
  // recitation milestones or Noor. Backed up, NOT a sync entity — each device credits
  // the synced practice rows it sees (`lib/quran-companion/recitation-totals.ts`).
  recitationTotals: `${PREFIX}/recitation_totals`,
  // Per-ayah revision ladder records — cloud-synced, custom merge.
  quranMemorization: `${PREFIX}/quran_memorization`,
  // NF-3.15 tajweed coaching: drill counts, spacing and the last plan (no audio) —
  // cloud-synced as `tajweed_coaching`, custom merge.
  tajweedCoaching: `${PREFIX}/tajweed_coaching`,
  // NF-3.21 personal ayah notes/highlights/tags (`Record<id, AyahNote>`) —
  // cloud-synced as `quran_notes` (normal sync, D15), per-note LWW + tombstones.
  quranNotes: `${PREFIX}/quran_notes`,
  // Pulled blob records a merge couldn't take yet (e.g. ayah notes over the 1 MB
  // cap): `Record<entity, { value, updatedAt, reason }>`. Pushes of a held entity
  // pause until the parked value merges (see `sync/blob-hold.ts`).
  blobSyncHold: `${PREFIX}/blob_sync_hold`,
  // Manifest of the downloaded on-device listener. The files live in the documents
  // directory (native) / Cache Storage (web); wipe deletes them explicitly.
  quranRecitationModel: `${PREFIX}/quran_recitation_model`,
  // Phase 6: the Quran Lab model version + which drill heads its calibration
  // validates. The model files live in the SDK's own storage.
  quranPronunciationModel: `${PREFIX}/quran_pronunciation_model`,
  // NF-3.20 hands-free tasbeeh: per-phrase personal calibration
  // (`Record<PhraseKey, { thresholdOffset, at }>`) — this device's voice only,
  // never synced or backed up.
  tasbeehVoiceCalibration: `${PREFIX}/tasbeeh_voice_calibration`,
  // NF-3.20 D48 "teach a zikr": per-zikr voice patterns (quantised features of 1–3
  // samples + a threshold, never audio) — this device only, never synced or backed up.
  tasbeehVoiceTemplates: `${PREFIX}/tasbeeh_voice_templates`,
  // NF-3.24 pronunciation check: optional "read one ayah to calibrate" offset
  // (`{ offset, at }`) — this device's voice only, never synced or backed up.
  quranPronunciationCalibration: `${PREFIX}/quran_pronunciation_calibration`,
  // "New" badges: when this device first showed each new feature (starts its
  // 15-day window) and whether it was added to a customised home grid.
  newFeaturesSeen: `${PREFIX}/new_features_seen`,
  // Recently opened dua ids (most recent first, capped) — device history for the
  // Duas hub, not synced or backed up.
  duaRecents: `${PREFIX}/dua_recents`,
  duaRecentsUpdatedAt: `${PREFIX}/dua_recents_updated_at`,
  // Settings hub (NF-3.0b): the dismissed "Finish setting up" checklist item ids.
  settingsSetupDismissed: `${PREFIX}/settings_setup_dismissed`,
  // Home seasonal banners hidden "for this season" (`<seasonId>:<hijriYear>`, capped).
  seasonalBannerDismissed: `${PREFIX}/seasonal_banner_dismissed`,
  // Device preferences (NF-3.0b B4): haptics, cache toggles, volume, precise adhan,
  // Live Activity, avatar, TTS voices — device-specific, never synced or backed up.
  devicePreferences: `${PREFIX}/device_preferences`,
  // Vault (plan §4.2, D2): AES-256-GCM `VaultEnvelope` ciphertext per document
  // (`DB_KEYS.vault/<docId>`). The DEK lives outside DB_KEYS (SecureStore /
  // IndexedDB), so a backup carries ciphertext only — restoring it needs this
  // device's DEK or the sync passphrase / recovery code.
  vaultMuhasabah: `${PREFIX}/vault/muhasabah`,
  vaultDebts: `${PREFIX}/vault/debts`,
  vaultWasiyyah: `${PREFIX}/vault/wasiyyah`,
  vaultRelatives: `${PREFIX}/vault/relatives`,
  // D46: the excused period (active reason + per-day reasons) and the khushu
  // journal sync only through these vault docs. Their source of truth stays the
  // plaintext local stores (preferences / prayer logs / `khushu_journal`); the
  // docs are mirrors written only while vault sync is on (`lib/private-sync`).
  vaultExcused: `${PREFIX}/vault/excused`,
  vaultKhushu: `${PREFIX}/vault/khushu`,
  // Last agreed fingerprint per mirrored item (3-way reconcile base). Device-local.
  vaultMirrorBase: `${PREFIX}/vault_mirror_base`,
  // Opt-in sync keyring: the DEK wrapped under the passphrase + recovery code.
  vaultKeyring: `${PREFIX}/vault/keyring`,
  // Device-local vault sync switch + inbox of pulled records awaiting unlock.
  vaultSyncState: `${PREFIX}/vault_sync_state`,
  // "Lock private journals" (require the app PIN before vault screens) — device pref.
  vaultLockJournals: `${PREFIX}/vault_lock_journals`,
  // NF-3.22 Arabic root index, built on the device from the Quranic Arabic Corpus
  // file (D22). Sharded (`/meta`, `/roots`, `/forms`), tagged with the source hash,
  // rebuildable — never synced or backed up. The raw file lives outside DB_KEYS.
  quranRootIndex: `${PREFIX}/quran_root_index`,
  // NF-3.11 masjid finder: the user's private iqamah times per masjid (`Record<masjidKey,
  // PrivateMasjidTimes>`, blob entity `home_masjid_times`, own devices only), the home
  // masjid's cached public OSM detail, and the last list per geohash cell (offline).
  homeMasjidTimes: `${PREFIX}/home_masjid_times`,
  homeMasjidCache: `${PREFIX}/home_masjid_cache`,
  masjidListCache: `${PREFIX}/masjid_list_cache`,
  // NF-3.13 Salah focus lock: this device's setup state, picked-app count, ended
  // windows and the emergency-unlock log (neutral count, never synced or backed up).
  // The app selection itself lives natively (iOS App Group / Android prefs).
  focusLockDevice: `${PREFIX}/focus_lock_device`,
  // NF-3.17 accountability partner: "my daily goal" per partner circle
  // (`Record<circleId, PartnerGoal>`). Private — never sent to the server or partners;
  // backed up with the user's data, not a sync entity.
  partnerGoals: `${PREFIX}/partner_goals`,
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
  hadithPrefs: "userData",
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
  umrahChecklist: "userData",
  umrahSessions: "userData",
  fridayChecklist: "userData",
  whiteDaysChecklist: "userData",
  sunnahHabits: "userData",
  dhulHijjah: "userData",
  voluntaryFasting: "userData",
  coachHistory: "userData",
  quranReadingLog: "userData",
  toursSeen: "userData",
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
  deferredInviteChecked: "deviceLocal",
  reviewReactivationDedupe: "deviceLocal",
  blobSyncState: "deviceLocal",
  zakatCalculator: "userData",
  zakatCurrency: "deviceLocal",
  fidyahCalculator: "userData",
  sadaqahGoals: "userData",
  readingTextVisibility: "userData",
  quranCompanionPrefs: "userData",
  quranPracticeSessions: "userData",
  recitationTotals: "userData",
  quranMemorization: "userData",
  tajweedCoaching: "userData",
  quranNotes: "userData",
  blobSyncHold: "deviceLocal",
  quranRecitationModel: "deviceLocal",
  quranPronunciationModel: "deviceLocal",
  tasbeehVoiceCalibration: "deviceLocal",
  tasbeehVoiceTemplates: "deviceLocal",
  quranPronunciationCalibration: "deviceLocal",
  newFeaturesSeen: "deviceLocal",
  duaRecents: "deviceLocal",
  duaRecentsUpdatedAt: "deviceLocal",
  settingsSetupDismissed: "deviceLocal",
  seasonalBannerDismissed: "deviceLocal",
  devicePreferences: "deviceLocal",
  vaultMuhasabah: "userData",
  vaultDebts: "userData",
  vaultWasiyyah: "userData",
  vaultRelatives: "userData",
  vaultExcused: "userData",
  vaultKhushu: "userData",
  vaultMirrorBase: "deviceLocal",
  vaultKeyring: "userData",
  vaultSyncState: "deviceLocal",
  vaultLockJournals: "deviceLocal",
  quranRootIndex: "cache",
  homeMasjidTimes: "userData",
  homeMasjidCache: "cache",
  masjidListCache: "cache",
  focusLockDevice: "deviceLocal",
  partnerGoals: "userData",
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
