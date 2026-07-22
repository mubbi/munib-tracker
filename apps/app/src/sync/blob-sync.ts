import type { SyncRecordDto } from "@munib-tracker/api-client";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";
import { DEFAULT_CALCULATION_METHOD, DEFAULT_MADHAB } from "@/lib/prayer-times";
import { aqeedahProgressStore } from "@/stores/aqeedah-progress-store";
import { battlesProgressStore } from "@/stores/battles-progress-store";
import { customAdhkarStore } from "@/stores/custom-adhkar-store";
import { fastingStore } from "@/stores/fasting-store";
import { fridayChecklistStore } from "@/stores/friday-checklist-store";
import { hadithStore } from "@/stores/hadith-store";
import { hajjChecklistStore } from "@/stores/hajj-checklist-store";
import { hifzStore } from "@/stores/hifz-store";
import { jahannamIntentionsStore } from "@/stores/jahannam-intentions-store";
import { jannahIntentionsStore } from "@/stores/jannah-intentions-store";
import { khatmStore } from "@/stores/khatm-store";
import { khushuStore } from "@/stores/khushu-store";
import { lastDayProgressStore } from "@/stores/last-day-progress-store";
import { learnDuaProgressStore } from "@/stores/learn-dua-progress-store";
import { locationStore } from "@/stores/location-store";
import { prophetsProgressStore } from "@/stores/prophets-progress-store";
import { quranGuideProgressStore } from "@/stores/quran-guide-progress-store";
import { quranStore } from "@/stores/quran-store";
import { readingTextVisibilityStore } from "@/stores/reading-text-visibility-store";
import { sadaqahStore } from "@/stores/sadaqah-store";
import { salahGuideProgressStore } from "@/stores/salah-guide-progress-store";
import { taharahProgressStore } from "@/stores/taharah-progress-store";
import { toursStore } from "@/stores/tours-store";
import { trackerStore } from "@/stores/tracker-store";
import { umrahChecklistStore } from "@/stores/umrah-checklist-store";

/**
 * Generic cloud sync for the many small "blob" userData entities that carry no
 * per-record `updatedAt` of their own — Ramadan fasting, khatm/hifz plans, the
 * personal adhkar/khushu/hajj collections, every Learn section's progress, the
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

/** Factory defaults for reading-text toggles — skip until the user changes them. */
function isPristineReadingTextVisibility(value: unknown): boolean {
  if (value == null || typeof value !== "object") return true;
  const v = value as { showTransliteration?: boolean; showTranslation?: boolean };
  return v.showTransliteration !== false && v.showTranslation !== false;
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
  {
    entity: "khushu_journal",
    storageKey: DB_KEYS.khushuJournal,
    reload: reloadIfReady(khushuStore),
  },
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
  },
  {
    entity: "reading_text_visibility",
    storageKey: DB_KEYS.readingTextVisibility,
    reload: reloadIfReady(readingTextVisibilityStore),
    isPristine: isPristineReadingTextVisibility,
  },
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

/**
 * Builds the push records for every blob entity, updating the local fingerprint
 * tracker in the same pass. Unchanged entities reuse their stored timestamp (so
 * the caller's delta filter skips them); changed ones are stamped `nowIso`.
 */
export async function buildBlobRecords(nowIso: string): Promise<SyncRecordDto[]> {
  return withKeyLock(DB_KEYS.blobSyncState, async () => {
    const state = await readJSON<BlobSyncState>(DB_KEYS.blobSyncState, {});
    const records: SyncRecordDto[] = [];
    let mutated = false;

    for (const e of BLOB_ENTITIES) {
      const value = await readJSON<unknown>(e.storageKey, null);
      const tracked = state[e.entity];
      // Never meaningfully touched on this device — nothing to sync, and pushing
      // an empty/default blob could clobber real data on another device.
      if (isUntouchedBlob(e, value, tracked)) continue;

      const hash = fingerprint(value);
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
        data: { value },
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
 */
export async function applyRemoteBlob(
  entity: string,
  data: Record<string, unknown>,
  updatedAt: string,
): Promise<boolean> {
  const e = BLOB_BY_ENTITY.get(entity);
  if (!e) return false;

  return withKeyLock(DB_KEYS.blobSyncState, async () => {
    const state = await readJSON<BlobSyncState>(DB_KEYS.blobSyncState, {});
    const tracked = state[entity];
    const unionMerge = UNION_MERGE_ENTITIES.has(entity);

    // Pure LWW blobs: keep local when it is the same age or newer.
    if (!unionMerge && tracked && updatedAt && tracked.updatedAt >= updatedAt) return false;

    const remoteValue = "value" in data ? data.value : null;
    const value = unionMerge
      ? await mergeBlobValue(entity, e.storageKey, remoteValue)
      : remoteValue;

    // For union-merge, advance watermark to the newer of local/remote.
    const nextUpdatedAt =
      unionMerge && tracked?.updatedAt && updatedAt
        ? tracked.updatedAt >= updatedAt
          ? tracked.updatedAt
          : updatedAt
        : updatedAt;

    const hash = fingerprint(value);
    // Identical content + watermark (e.g. server echo of our own push) — no-op.
    if (tracked?.hash === hash && tracked.updatedAt === nextUpdatedAt) return false;

    await withKeyLock(e.storageKey, () => writeJSON(e.storageKey, value));
    state[entity] = { hash, updatedAt: nextUpdatedAt };
    await writeJSON(DB_KEYS.blobSyncState, state);
    return true;
  });
}

/** Entities whose values are plain maps/arrays of independent user edits. */
const UNION_MERGE_ENTITIES = new Set([
  "fasting",
  "hajj_checklist",
  "umrah_checklist",
  "friday_checklist",
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

async function mergeBlobValue(
  entity: string,
  storageKey: string,
  remoteValue: unknown,
): Promise<unknown> {
  if (!UNION_MERGE_ENTITIES.has(entity)) return remoteValue;

  const localValue = await readJSON<unknown>(storageKey, null);
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
