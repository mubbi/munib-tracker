import type { SyncRecordDto } from "@munib-tracker/api-client";
import {
  isValidQuranNotesPayload,
  mergeCoachHistory,
  mergeQuranNotesCapped,
  mergeUmrahSessions,
  mergeVoluntaryFasting,
} from "@munib-tracker/shared/utils";

import { coarsenCoordinate, coarsenLocation } from "@munib-tracker/shared/validators/private-sync";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import { mergeDhulHijjah } from "@/lib/dhul-hijjah";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import { DEFAULT_CALCULATION_METHOD, DEFAULT_MADHAB } from "@/lib/prayer-times";
import { mergeMemorization, mergeSessions } from "@/lib/quran-companion/merge";
import { isPristineCompanionPrefs } from "@/lib/quran-companion/prefs";
import { mergeQuranReadingLog } from "@/lib/quran-reading-log";
import { mergeSunnahHabits } from "@/lib/sunnah-habits";
import { mergeTajweedCoaching } from "@/lib/tajweed-coaching/progress";
import { VAULT_BLOB_ENTITIES } from "@/lib/vault/vault-sync";
import { aqeedahProgressStore } from "@/stores/aqeedah-progress-store";
import { battlesProgressStore } from "@/stores/battles-progress-store";
import { coachHistoryStore } from "@/stores/coach-history-store";
import { customAdhkarStore } from "@/stores/custom-adhkar-store";
import { dhulHijjahStore } from "@/stores/dhul-hijjah-store";
import { fastingStore } from "@/stores/fasting-store";
import { fridayChecklistStore } from "@/stores/friday-checklist-store";
import { hadithStore } from "@/stores/hadith-store";
import { hajjChecklistStore } from "@/stores/hajj-checklist-store";
import { hifzStore } from "@/stores/hifz-store";
import { homeMasjidTimesStore } from "@/stores/home-masjid-times-store";
import { jahannamIntentionsStore } from "@/stores/jahannam-intentions-store";
import { jannahIntentionsStore } from "@/stores/jannah-intentions-store";
import { khatmStore } from "@/stores/khatm-store";
import { lastDayProgressStore } from "@/stores/last-day-progress-store";
import { learnDuaProgressStore } from "@/stores/learn-dua-progress-store";
import { locationStore } from "@/stores/location-store";
import { prophetsProgressStore } from "@/stores/prophets-progress-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranGuideProgressStore } from "@/stores/quran-guide-progress-store";
import { quranMemorizationStore } from "@/stores/quran-memorization-store";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { quranReadingLogStore } from "@/stores/quran-reading-log-store";
import { quranStore } from "@/stores/quran-store";
import { sadaqahStore } from "@/stores/sadaqah-store";
import { salahGuideProgressStore } from "@/stores/salah-guide-progress-store";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { taharahProgressStore } from "@/stores/taharah-progress-store";
import { tajweedCoachingStore } from "@/stores/tajweed-coaching-store";
import { toursStore } from "@/stores/tours-store";
import { trackerStore } from "@/stores/tracker-store";
import { umrahChecklistStore } from "@/stores/umrah-checklist-store";
import { umrahSessionStore } from "@/stores/umrah-session-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { whiteDaysChecklistStore } from "@/stores/white-days-checklist-store";
import {
  clearBlobHold,
  type HeldMerge,
  heldMerge,
  isHeldMerge,
  readBlobHold,
  setBlobHold,
} from "@/sync/blob-hold";

/**
 * Generic cloud sync for the many small "blob" userData entities that carry no
 * per-record `updatedAt` of their own — Ramadan fasting, khatm/hifz plans, the
 * personal adhkar/hajj collections, every Learn section's progress, the
 * qaza schedule, and so on. Rather than retrofit a hand-written record + apply
 * path (and a bumped watermark on every mutation) into ~20 stores, change and
 * deletion detection is centralised here:
 *
 *  - Each entity syncs as a single last-write-wins blob record `{ value }`.
 *  - A device-local map (`DB_KEYS.blobSyncState`) remembers, per entity, a
 *    content hash and the timestamp that content was last established (locally or
 *    pulled). At push time we recompute the hash: unchanged → reuse the stored
 *    timestamp (so the delta-push filter skips it); changed → stamp "now" and
 *    push. A cleared list is just another content change, so deletions propagate
 *    without tombstones. An entity that was never touched (empty value AND no
 *    tracker row) is skipped so a fresh device can't clobber another with an
 *    empty blob.
 *
 * The already-timestamped entities (prayer logs, preferences, bookmarks, …) keep
 * their bespoke paths in `records.ts` / `sync-engine.ts`; this module is purely
 * additive.
 */

interface BlobEntity {
  /** Sync entity name — also the record id (one row per entity). */
  entity: string;
  /** AsyncStorage key holding the raw persisted value. */
  storageKey: string;
  /** Refreshes the in-memory store after a pulled blob is applied (no-op if the store isn't live). */
  reload: () => Promise<void>;
  /**
   * Optional: treat a non-empty default seed as "untouched" so a fresh device
   * doesn't push defaults and clobber real data on another device.
   */
  isPristine?: (value: unknown) => boolean;
  /**
   * Optional entity-specific merge, used instead of the generic union rule when
   * the generic `{ ...remote, ...local }` cannot converge (per-key records edited
   * on two devices) or cannot propagate a delete (a cleared history). Pure.
   */
  merge?: (local: unknown, remote: unknown) => unknown | Promise<unknown>;
  /**
   * Optional: whether this entity may sync right now (vault: only after the
   * user opts in). A closed gate skips the push, and a pulled value is handed
   * to `stash` instead of being applied (the pull cursor moves on regardless).
   */
  gate?: () => Promise<boolean>;
  /**
   * Parks a pulled value: one the gate refused, or one the merge held back
   * (`HeldMerge`). Without it, held values go to the generic `blob-hold` store.
   */
  stash?: (value: unknown, updatedAt: string) => Promise<void>;
  /**
   * Custom hold check for entities that park through `stash`. It retries the
   * parked value and resolves `true` while pushes must still pause. Without
   * it, the generic `blob-hold` retry runs.
   */
  pushPaused?: () => Promise<boolean>;
  /** Custom release of a parked value no newer than `upTo`, after a newer remote merged cleanly. */
  releaseHold?: (upTo: string) => Promise<void>;
  /**
   * Optional client copy of the server's payload check. A value that fails it
   * is skipped (and reported by `getSkippedBlobEntities`) instead of being
   * pushed, because the server would refuse it (H2).
   */
  validatePush?: (value: unknown) => boolean;
  /**
   * Optional: the form of the value that is pushed (and fingerprinted) when it
   * differs from what is stored locally — D46 location: coordinates rounded to
   * ~1 km, while the device keeps its exact fix.
   */
  toPushValue?: (value: unknown) => unknown;
  /**
   * Optional: how a pulled LWW value is stored, given the local one — D46
   * location: the device's exact coordinates are kept when the pulled (rounded)
   * copy points at the same ~1 km cell.
   */
  fromRemote?: (local: unknown, remote: unknown) => unknown;
}

/** Reloads a store's persisted state only if it has already been loaded once. */
function reloadIfReady(store: {
  getState: () => { isReady: boolean; load: () => Promise<void> };
}): () => Promise<void> {
  return () => (store.getState().isReady ? store.getState().load() : Promise.resolve());
}

/** Qaza schedule/daily-progress live in the tracker store; refresh recomputes them. */
function refreshTracker(): Promise<void> {
  return trackerStore.getState().isReady ? trackerStore.getState().refresh() : Promise.resolve();
}

/** Apply a synced location without triggering a GPS refresh that would overwrite it. */
function reloadLocationFromDisk(): Promise<void> {
  if (!locationStore.getState().isReady) return Promise.resolve();
  return readJSON<StoredLocation | null>(DB_KEYS.location, null).then((stored) => {
    if (!stored) return;
    locationStore.setState({ location: { ...DEFAULT_LOCATION, ...stored }, status: "ready" });
  });
}

const noop = (): Promise<void> => Promise.resolve();

/** Seeded Makkah + default calc settings — not yet a real user choice. */
function isPristineLocation(value: unknown): boolean {
  if (value == null || typeof value !== "object") return true;
  const loc = value as Partial<StoredLocation>;
  const adjustments = loc.prayerAdjustments;
  const hasAdjustments =
    adjustments != null && typeof adjustments === "object" && Object.keys(adjustments).length > 0;
  return (
    (loc.source ?? "default") === "default" &&
    (loc.method ?? DEFAULT_CALCULATION_METHOD) === DEFAULT_CALCULATION_METHOD &&
    (loc.madhab ?? DEFAULT_MADHAB) === DEFAULT_MADHAB &&
    loc.highLatitudeRule == null &&
    !hasAdjustments
  );
}

/**
 * D46 pull side of the location coarsening: when the pulled (rounded) location
 * is the same ~1 km cell as this device's exact one, the exact coordinates are
 * kept and everything else (label, method, offsets…) is taken from the pull.
 * A different place replaces the location, rounded coordinates and all.
 */
export function keepExactCoordinates(local: unknown, remote: unknown): unknown {
  if (remote == null || typeof remote !== "object") return remote;
  if (local == null || typeof local !== "object") return remote;
  const exact = local as Partial<StoredLocation>;
  const pulled = remote as Partial<StoredLocation>;
  const sameCell =
    coarsenCoordinate(exact.latitude) === pulled.latitude &&
    coarsenCoordinate(exact.longitude) === pulled.longitude;
  return sameCell ? { ...pulled, latitude: exact.latitude, longitude: exact.longitude } : remote;
}

/**
 * The blob-synced entities. Deliberately excluded: `continue_activity` (device
 * session UX) and `achievements` (derived from already-synced stats — recomputed
 * per device).
 */
export const BLOB_ENTITIES: BlobEntity[] = [
  { entity: "fasting", storageKey: DB_KEYS.fasting, reload: reloadIfReady(fastingStore) },
  { entity: "khatm", storageKey: DB_KEYS.khatm, reload: reloadIfReady(khatmStore) },
  { entity: "hifz", storageKey: DB_KEYS.hifz, reload: reloadIfReady(hifzStore) },
  {
    entity: "custom_adhkar",
    storageKey: DB_KEYS.customAdhkar,
    reload: reloadIfReady(customAdhkarStore),
  },
  // `khushu_journal` is retired (D46): the journal syncs only as the vault doc
  // `vault_khushu` (`lib/private-sync/khushu-mirror.ts`).
  {
    entity: "hajj_checklist",
    storageKey: DB_KEYS.hajjChecklist,
    reload: reloadIfReady(hajjChecklistStore),
  },
  {
    entity: "umrah_checklist",
    storageKey: DB_KEYS.umrahChecklist,
    reload: reloadIfReady(umrahChecklistStore),
  },
  {
    entity: "friday_checklist",
    storageKey: DB_KEYS.fridayChecklist,
    reload: reloadIfReady(fridayChecklistStore),
  },
  {
    entity: "white_days_checklist",
    storageKey: DB_KEYS.whiteDaysChecklist,
    reload: reloadIfReady(whiteDaysChecklistStore),
  },
  // NF-3.11 private iqamah times per masjid — plain LWW (not union) so deletions propagate.
  {
    entity: "home_masjid_times",
    storageKey: DB_KEYS.homeMasjidTimes,
    reload: reloadIfReady(homeMasjidTimesStore),
  },
  // NF-3.5 / NF-3.3: nested maps need their own merges (max per check, union per year).
  {
    entity: "sunnah_habits",
    storageKey: DB_KEYS.sunnahHabits,
    reload: reloadIfReady(sunnahHabitsStore),
    merge: mergeSunnahHabits,
  },
  {
    entity: "dhul_hijjah",
    storageKey: DB_KEYS.dhulHijjah,
    reload: reloadIfReady(dhulHijjahStore),
    merge: mergeDhulHijjah,
  },
  {
    entity: "jannah_intentions",
    storageKey: DB_KEYS.jannahIntentions,
    reload: reloadIfReady(jannahIntentionsStore),
  },
  {
    entity: "jahannam_intentions",
    storageKey: DB_KEYS.jahannamIntentions,
    reload: reloadIfReady(jahannamIntentionsStore),
  },
  {
    entity: "salah_guide_progress",
    storageKey: DB_KEYS.salahGuideProgress,
    reload: reloadIfReady(salahGuideProgressStore),
  },
  {
    entity: "battles_progress",
    storageKey: DB_KEYS.battlesProgress,
    reload: reloadIfReady(battlesProgressStore),
  },
  {
    entity: "quran_guide_progress",
    storageKey: DB_KEYS.quranGuideProgress,
    reload: reloadIfReady(quranGuideProgressStore),
  },
  {
    entity: "taharah_progress",
    storageKey: DB_KEYS.taharahProgress,
    reload: reloadIfReady(taharahProgressStore),
  },
  {
    entity: "prophets_progress",
    storageKey: DB_KEYS.prophetsProgress,
    reload: reloadIfReady(prophetsProgressStore),
  },
  {
    entity: "aqeedah_progress",
    storageKey: DB_KEYS.aqeedahProgress,
    reload: reloadIfReady(aqeedahProgressStore),
  },
  {
    entity: "last_day_progress",
    storageKey: DB_KEYS.lastDayProgress,
    reload: reloadIfReady(lastDayProgressStore),
  },
  {
    entity: "learn_dua_progress",
    storageKey: DB_KEYS.learnDuaProgress,
    reload: reloadIfReady(learnDuaProgressStore),
  },
  // Qur'an prefs are held in the quran store; reading progress is read on demand,
  // so there's nothing in memory to refresh for it.
  { entity: "quran_prefs", storageKey: DB_KEYS.quranPrefs, reload: reloadIfReady(quranStore) },
  { entity: "hadith_prefs", storageKey: DB_KEYS.hadithPrefs, reload: reloadIfReady(hadithStore) },
  { entity: "quran_reading_progress", storageKey: DB_KEYS.quranReadingProgress, reload: noop },
  { entity: "qaza_schedule", storageKey: DB_KEYS.qazaSchedule, reload: refreshTracker },
  { entity: "qaza_daily_progress", storageKey: DB_KEYS.qazaDailyProgress, reload: refreshTracker },
  // Legacy per-date plans — `getSchedule()` falls back to them, so they still
  // carry targets on old-data devices that never migrated to `qaza_schedule`.
  { entity: "qaza_daily_plans", storageKey: DB_KEYS.qazaDailyPlans, reload: refreshTracker },
  {
    entity: "location",
    storageKey: DB_KEYS.location,
    reload: reloadLocationFromDisk,
    isPristine: isPristineLocation,
    // D46: the server only ever sees coordinates rounded to ~1 km.
    toPushValue: coarsenLocation,
    fromRemote: keepExactCoordinates,
  },
  // `reading_text_visibility` is no longer written or applied (D13): the pair now
  // lives in `preferences.readingDisplay`. The API keeps accepting the entity for
  // one release so old clients don't fail; it is then removed from SYNC_ENTITIES.
  {
    entity: "zakat_calculator",
    storageKey: DB_KEYS.zakatCalculator,
    reload: noop,
  },
  {
    entity: "fidyah_calculator",
    storageKey: DB_KEYS.fidyahCalculator,
    reload: noop,
  },
  {
    entity: "sadaqah_goals",
    storageKey: DB_KEYS.sadaqahGoals,
    reload: reloadIfReady(sadaqahStore),
  },
  {
    entity: "tours_seen",
    storageKey: DB_KEYS.toursSeen,
    reload: reloadIfReady(toursStore),
  },
  // Qur'an practice (§10). Prefs are whole-value LWW guarded by `isPristine`;
  // memorization and history use their own merges (decision D7).
  {
    entity: "quran_companion_prefs",
    storageKey: DB_KEYS.quranCompanionPrefs,
    reload: reloadIfReady(quranCompanionPrefsStore),
    isPristine: isPristineCompanionPrefs,
  },
  {
    entity: "quran_practice_sessions",
    storageKey: DB_KEYS.quranPracticeSessions,
    reload: reloadIfReady(quranPracticeStore),
    merge: mergeSessions,
  },
  {
    entity: "quran_memorization",
    storageKey: DB_KEYS.quranMemorization,
    reload: reloadIfReady(quranMemorizationStore),
    merge: mergeMemorization,
  },
  // NF-3.15 tajweed coaching: per-head LWW on `lastAt`, newer plan wins.
  {
    entity: "tajweed_coaching",
    storageKey: DB_KEYS.tajweedCoaching,
    reload: reloadIfReady(tajweedCoachingStore),
    merge: mergeTajweedCoaching,
  },
  // NF-3.21 personal ayah notes (D15 — normal sync, not the vault): per-note LWW
  // on `updatedAt`, tombstones win over older edits, tombstone GC after 90 days.
  // H2: the merge enforces the 1 MB server cap. A union that won't fit keeps
  // every local note, parks the remote and pauses pushes ("notes full" in the UI).
  {
    entity: "quran_notes",
    storageKey: DB_KEYS.quranNotes,
    reload: reloadIfReady(quranNotesStore),
    merge: (local: unknown, remote: unknown) => {
      const result = mergeQuranNotesCapped(local, remote);
      return result.pending > 0
        ? heldMerge(result.value, "overflow", result.pending)
        : result.value;
    },
    validatePush: (value: unknown) => isValidQuranNotesPayload({ value }),
  },
  // NF-3.2 voluntary fasting: per-date LWW on `updatedAt`; tombstones carry removals.
  {
    entity: "voluntary_fasting",
    storageKey: DB_KEYS.voluntaryFasting,
    reload: reloadIfReady(voluntaryFastingStore),
    merge: mergeVoluntaryFasting,
  },
  // NF-3.14 coach history: shown ids + goals union, dismiss/snooze LWW on `updatedAt`.
  {
    entity: "coach_history",
    storageKey: DB_KEYS.coachHistory,
    reload: reloadIfReady(coachHistoryStore),
    merge: mergeCoachHistory,
  },
  // D40 daily Qur'an reading log: union of dates, per-field max on a shared date.
  {
    entity: "quran_reading_log",
    storageKey: DB_KEYS.quranReadingLog,
    reload: reloadIfReady(quranReadingLogStore),
    merge: mergeQuranReadingLog,
  },
  // NF-3.4 Umrah mode: per-session LWW on `updatedAt`; tombstones carry removals.
  {
    entity: "umrah_sessions",
    storageKey: DB_KEYS.umrahSessions,
    reload: reloadIfReady(umrahSessionStore),
    merge: mergeUmrahSessions,
  },
  // E2E-encrypted vault (plan §4.2, D2): keyring + one envelope per document.
  // Gated on the user's opt-in; merges decrypt → domain merge → re-encrypt.
  ...VAULT_BLOB_ENTITIES,
];

const BLOB_BY_ENTITY = new Map(BLOB_ENTITIES.map((e) => [e.entity, e]));

/** True when `entity` is synced through this generic blob path. */
export function isBlobEntity(entity: string): boolean {
  return BLOB_BY_ENTITY.has(entity);
}

/** Per-entity content fingerprint + the timestamp that content was last established. */
type BlobSyncState = Record<string, { hash: string; updatedAt: string }>;

/** Deterministic serialization: object keys are sorted so key order can't change the hash. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

/** FNV-1a (32-bit) of the canonical string, plus its length — ample for change detection. */
function fingerprint(value: unknown): string {
  const str = stableStringify(value);
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${(h >>> 0).toString(16)}:${str.length}`;
}

/** A value with no user content — the pristine/untouched state for every blob entity. */
function isEmptyBlob(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

function isUntouchedBlob(e: BlobEntity, value: unknown, tracked: unknown): boolean {
  if (tracked) return false;
  if (isEmptyBlob(value)) return true;
  return e.isPristine?.(value) === true;
}

/** Entities whose last push skipped an invalid value (H2). In memory, for the sync-status UI. */
const skippedEntities = new Set<string>();

/** Blob entities whose value failed the client copy of the server check on the last push. */
export function getSkippedBlobEntities(): string[] {
  return [...skippedEntities];
}

/**
 * Builds the push records for every blob entity, updating the local fingerprint
 * tracker in the same pass. Unchanged entities reuse their stored timestamp (so
 * the caller's delta filter skips them); changed ones are stamped `nowIso`.
 *
 * Held entities (a parked remote that didn't merge yet) are retried first and
 * skipped while still held. A value that would fail the server's payload check
 * is skipped on its own, so one bad blob can't fail the whole push.
 */
export async function buildBlobRecords(nowIso: string): Promise<SyncRecordDto[]> {
  return withKeyLock(DB_KEYS.blobSyncState, async () => {
    const state = await readJSON<BlobSyncState>(DB_KEYS.blobSyncState, {});
    const records: SyncRecordDto[] = [];
    let mutated = false;

    for (const e of BLOB_ENTITIES) {
      if (e.gate && !(await e.gate())) continue;
      if (await isPushPaused(e)) continue;
      const value = await readJSON<unknown>(e.storageKey, null);
      const tracked = state[e.entity];
      // Never meaningfully touched on this device — nothing to sync, and pushing
      // an empty/default blob could clobber real data on another device.
      if (isUntouchedBlob(e, value, tracked)) continue;
      if (e.validatePush && !e.validatePush(value)) {
        // Leave the tracker alone so the value is re-checked on the next push.
        skippedEntities.add(e.entity);
        continue;
      }
      skippedEntities.delete(e.entity);

      const pushValue = e.toPushValue ? e.toPushValue(value) : value;
      const hash = fingerprint(pushValue);
      let updatedAt: string;
      if (tracked && tracked.hash === hash) {
        updatedAt = tracked.updatedAt;
      } else {
        updatedAt = nowIso;
        state[e.entity] = { hash, updatedAt };
        mutated = true;
      }

      records.push({
        entity: e.entity as SyncRecordDto["entity"],
        id: e.entity,
        data: { value: pushValue },
        updatedAt,
      });
    }

    if (mutated) await writeJSON(DB_KEYS.blobSyncState, state);
    return records;
  });
}

/**
 * Applies a pulled (or conflict) blob record with last-write-wins on the tracked
 * timestamp. Returns `true` when the local value changed (so the caller can
 * refresh the store). Marking the applied content in the tracker with the remote
 * timestamp is what prevents a sync ping-pong.
 *
 * H1: the local read, the (possibly async) merge and the write all run inside
 * one `withKeyLock(storageKey)`. Store mutations take the same lock, so a local
 * edit is serialized before or after the merge and is never overwritten. A
 * writer that skips the lock is caught by re-reading before the write; the
 * merge then runs again on top of its value.
 *
 * A merge that can't take all of the remote (`HeldMerge`), or that throws,
 * keeps local, parks the remote and pauses the entity's pushes. It never
 * throws out of here, so one bad record can't stop the rest of the pull.
 */
export async function applyRemoteBlob(
  entity: string,
  data: Record<string, unknown>,
  updatedAt: string,
): Promise<boolean> {
  const e = BLOB_BY_ENTITY.get(entity);
  if (!e) return false;
  if (e.gate && !(await e.gate())) {
    await e.stash?.("value" in data ? data.value : null, updatedAt);
    return false;
  }

  return withKeyLock(DB_KEYS.blobSyncState, async () => {
    const state = await readJSON<BlobSyncState>(DB_KEYS.blobSyncState, {});
    const tracked = state[entity];
    const unionMerge = UNION_MERGE_ENTITIES.has(entity) || !!e.merge;

    // Pure LWW blobs: keep local when it is the same age or newer.
    if (!unionMerge && tracked && updatedAt && tracked.updatedAt >= updatedAt) return false;

    const remoteValue = "value" in data ? data.value : null;

    // For union-merge, advance watermark to the newer of local/remote.
    const nextUpdatedAt =
      unionMerge && tracked?.updatedAt && updatedAt
        ? tracked.updatedAt >= updatedAt
          ? tracked.updatedAt
          : updatedAt
        : updatedAt;

    const outcome = await withKeyLock(e.storageKey, async () => {
      for (let attempt = 0; ; attempt += 1) {
        const localValue =
          unionMerge || e.fromRemote ? await readJSON<unknown>(e.storageKey, null) : null;
        let value: unknown = e.fromRemote ? e.fromRemote(localValue, remoteValue) : remoteValue;
        let held: HeldMerge | null = null;
        if (unionMerge) {
          const merged = await runMerge(e, localValue, remoteValue);
          if (isHeldMerge(merged)) held = merged;
          value = isHeldMerge(merged) ? merged.value : merged;
          // A writer that skipped the key lock changed the value mid-merge: redo it.
          const now = await readJSON<unknown>(e.storageKey, null);
          if (attempt < 2 && fingerprint(now) !== fingerprint(localValue)) continue;
        }
        // Fingerprint the pushed form, so a kept exact location isn't re-pushed.
        const hash = fingerprint(e.toPushValue ? e.toPushValue(value) : value);
        if (held) {
          const changed = hash !== fingerprint(localValue);
          if (changed) await writeJSON(e.storageKey, value);
          return { kind: "held" as const, changed, held };
        }
        // Identical content + watermark (e.g. server echo of our own push) — no-op.
        if (tracked?.hash === hash && tracked.updatedAt === nextUpdatedAt) {
          return { kind: "noop" as const };
        }
        await writeJSON(e.storageKey, value);
        return { kind: "applied" as const, hash };
      }
    });

    if (outcome.kind === "noop") return false;

    if (outcome.kind === "held") {
      // Track the server's fingerprint: once the hold clears, the merged value
      // differs from it and is pushed. Until then `isPushPaused` skips the
      // entity, so the server copy stays intact.
      state[entity] = { hash: fingerprint(remoteValue), updatedAt: nextUpdatedAt };
      await writeJSON(DB_KEYS.blobSyncState, state);
      await parkRemote(e, remoteValue, updatedAt, outcome.held);
      return outcome.changed;
    }

    // Custom merges: when the merged value differs from what the server holds,
    // track the server's fingerprint so the next push sends the merged value and
    // both devices converge after one round trip each.
    const hash = outcome.hash;
    const remoteHash = e.merge ? fingerprint(remoteValue) : hash;
    state[entity] = {
      hash: e.merge && remoteHash !== hash ? remoteHash : hash,
      updatedAt: nextUpdatedAt,
    };
    await writeJSON(DB_KEYS.blobSyncState, state);
    // A newer remote merged cleanly, so it supersedes any older parked one.
    if (e.merge) await releaseHold(e, updatedAt);
    return true;
  });
}

/** Runs the entity's merge. A throw becomes a hold, so the pull keeps going (H2). */
async function runMerge(e: BlobEntity, local: unknown, remote: unknown): Promise<unknown> {
  try {
    return e.merge ? await e.merge(local, remote) : mergeUnion(e.entity, local, remote);
  } catch {
    return heldMerge(local, "error");
  }
}

async function parkRemote(
  e: BlobEntity,
  remoteValue: unknown,
  updatedAt: string,
  held: HeldMerge,
): Promise<void> {
  if (e.stash) {
    await e.stash(remoteValue, updatedAt);
    return;
  }
  await setBlobHold(e.entity, {
    value: remoteValue,
    updatedAt,
    reason: held.reason,
    pending: held.pending,
  });
}

async function releaseHold(e: BlobEntity, upTo: string): Promise<void> {
  if (e.releaseHold) await e.releaseHold(upTo);
  else await clearBlobHold(e.entity, upTo);
}

/**
 * True while `e` has a parked remote that still can't merge. The merge is
 * retried first, under the storage-key lock. Once it fits, the merged value is
 * written, the hold is released, and the caller pushes it in the same pass.
 */
async function isPushPaused(e: BlobEntity): Promise<boolean> {
  if (e.pushPaused) return e.pushPaused();
  if (!e.merge) return false;
  const hold = await readBlobHold(e.entity);
  if (!hold) return false;

  const result = await withKeyLock(e.storageKey, async () => {
    const local = await readJSON<unknown>(e.storageKey, null);
    const merged = await runMerge(e, local, hold.value);
    const value = isHeldMerge(merged) ? merged.value : merged;
    const changed = fingerprint(value) !== fingerprint(local);
    if (changed) await writeJSON(e.storageKey, value);
    return { held: isHeldMerge(merged) ? merged : null, changed };
  });

  if (result.held) {
    if (result.held.pending !== hold.pending) {
      await setBlobHold(e.entity, { ...hold, pending: result.held.pending });
    }
  } else {
    await clearBlobHold(e.entity, hold.updatedAt);
  }
  if (result.changed) await e.reload();
  return result.held != null;
}

/** Entities whose values are plain maps/arrays of independent user edits. */
const UNION_MERGE_ENTITIES = new Set([
  "fasting",
  "hajj_checklist",
  "umrah_checklist",
  "friday_checklist",
  "white_days_checklist",
  "salah_guide_progress",
  "taharah_progress",
  "aqeedah_progress",
  "battles_progress",
  "prophets_progress",
  "quran_guide_progress",
  "learn_dua_progress",
  "last_day_progress",
  "jannah_intentions",
  "jahannam_intentions",
  "tours_seen",
]);

function mergeUnion(entity: string, localValue: unknown, remoteValue: unknown): unknown {
  if (!UNION_MERGE_ENTITIES.has(entity)) return remoteValue;

  if (localValue == null || isEmptyBlob(localValue)) return remoteValue;
  if (remoteValue == null || isEmptyBlob(remoteValue)) return localValue;

  if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
    const seen = new Set<unknown>();
    const merged: unknown[] = [];
    for (const item of [...localValue, ...remoteValue]) {
      const key =
        typeof item === "string" || typeof item === "number" ? item : stableStringify(item);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
    return merged;
  }

  if (
    typeof localValue === "object" &&
    typeof remoteValue === "object" &&
    !Array.isArray(localValue) &&
    !Array.isArray(remoteValue)
  ) {
    // Local keys win on conflict (same day edited on both devices).
    return { ...(remoteValue as object), ...(localValue as object) };
  }

  return remoteValue;
}

/** Refreshes the in-memory stores for the given applied blob entities (deduped). */
export async function reloadBlobStores(entities: Iterable<string>): Promise<void> {
  const seen = new Set<string>();
  const reloads: Promise<void>[] = [];
  for (const entity of entities) {
    if (seen.has(entity)) continue;
    seen.add(entity);
    const e = BLOB_BY_ENTITY.get(entity);
    if (e) reloads.push(e.reload());
  }
  await Promise.all(reloads);
}
