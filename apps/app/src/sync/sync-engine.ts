import type { SyncPushResponseDto, SyncRecordDto } from "@munib-tracker/api-client";
import type {
  PrayerId,
  PrayerLog,
  UserPreferences,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import { isQazaPrayer } from "@munib-tracker/shared/validators";

import { syncPull, syncPush } from "@/api/endpoints";
import { SessionStore, type StoredSession } from "@/auth/session-store";
import {
  HadithRepository,
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  QuranRepository,
  TombstoneRepository,
  ZikrRepository,
} from "@/db";
import { DB_KEYS } from "@/db/keys";
import type { HadithBookmark } from "@/db/repositories/hadith-repository";
import type { QuranBookmark } from "@/db/repositories/quran-repository";
import { readJSON, writeJSON } from "@/db/store";
import { isAppReloadInProgress } from "@/lib/cloud-api-reload-gate";
import {
  clearPreferencesDirty,
  filterRemotePreferencesPatch,
  hasPendingPreferenceChanges,
} from "@/lib/sync/preferences-cloud-sync";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import {
  applyRemoteCustomTasbeeh,
  type CustomTasbeeh,
  customTasbeehStore,
  readCustomTasbeehBlob,
} from "@/stores/custom-tasbeeh-store";
import { applyRemoteDuaFavorites, readDuaFavoritesBlob } from "@/stores/dua-favorites-store";
import {
  applyRemoteDuroodFavorites,
  readDuroodFavoritesBlob,
} from "@/stores/durood-favorites-store";
import { applyRemoteNameFavorites, readNameFavoritesBlob } from "@/stores/name-favorites-store";
import { preferencesStore } from "@/stores/preferences-store";
import { quranStore } from "@/stores/quran-store";
import { trackerStore } from "@/stores/tracker-store";

import { buildSyncRecords } from "./records";

let blobSyncModuleForTests: typeof import("./blob-sync") | undefined;

/** Jest-only: avoid `require("./blob-sync")` in production (Metro would embed all progress corpora). */
export function __setBlobSyncModuleForTests(mod: typeof import("./blob-sync")): void {
  blobSyncModuleForTests = mod;
}

async function blobSync() {
  if (blobSyncModuleForTests) return blobSyncModuleForTests;
  return import("./blob-sync");
}

export interface SyncMetadata {
  /** Server clock at our last successful pull — the `since` cursor for the next pull. */
  lastSyncedAt?: string;
  /** Local clock at our last successful push — the watermark for delta pushes. */
  lastPushedAt?: string;
  /** Local clock when the last sync outcome below was recorded (NF-2.19). */
  lastOutcomeAt?: string;
  /** Records accepted by the server on the last push. */
  lastPushed?: number;
  /** Records pulled from other devices on the last sync. */
  lastPulled?: number;
  /**
   * Records where the server had a newer version and its copy was kept — a
   * last-write-wins conflict that was auto-resolved (NF-2.19).
   */
  lastConflicts?: number;
  /** Distinct entity types that had a conflict on the last sync. */
  lastConflictEntities?: string[];
}

export type SyncResult =
  | { status: "skipped"; reason: "guest" | "offline" | "reload" }
  | { status: "ok"; pushed: number; pulled: number; conflicts: number };

async function readMeta(): Promise<SyncMetadata> {
  return readJSON<SyncMetadata>(DB_KEYS.syncMetadata, {});
}

/** Public accessor for the last sync/push timestamps (drives the sync-status UI). */
export async function readSyncMetadata(): Promise<SyncMetadata> {
  return readMeta();
}

/**
 * Applies pulled (or conflict) records to the local database. Every write goes
 * through a repository method that enforces last-write-wins on `updatedAt` and
 * preserves the server timestamp, so a newer offline edit is never clobbered and
 * applied records don't get re-stamped (which would cause sync ping-pong).
 */
async function applyRemoteRecords(records: SyncRecordDto[]): Promise<void> {
  const resetMarker = records
    .filter((record) => (record.entity as string) === "data_reset")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  if (resetMarker) {
    await wipeLocalDeviceData();
  }
  const applicableRecords = resetMarker
    ? records.filter(
        (record) =>
          (record.entity as string) !== "data_reset" && record.updatedAt > resetMarker.updatedAt,
      )
    : records;

  const { applyRemoteBlob, isBlobEntity, reloadBlobStores } = await blobSync();
  const reloadBlobEntities = new Set<string>();
  for (const record of applicableRecords) {
    const data = record.data as Record<string, unknown>;
    // Generic blob entities (fasting, learning progress, qaza schedule, …) are
    // applied through the content-hash path and their stores reloaded in bulk.
    if (isBlobEntity(record.entity)) {
      if (await applyRemoteBlob(record.entity, data, record.updatedAt)) {
        reloadBlobEntities.add(record.entity);
      }
      continue;
    }
    switch (record.entity) {
      case "prayer_logs": {
        if (record.deletedAt) {
          const prayerId = data.prayerId as PrayerId | undefined;
          const date = data.date as string | undefined;
          // Applying a server-originated deletion — don't echo a tombstone back.
          if (prayerId && date) await PrayerRepository.remove(prayerId, date, { tombstone: false });
        } else {
          await PrayerRepository.applyRemoteLog(data as unknown as PrayerLog);
        }
        break;
      }
      case "zikr_progress": {
        if (record.deletedAt) break;
        await ZikrRepository.applyRemoteProgress(data as unknown as ZikrProgress);
        break;
      }
      case "qaza_entries": {
        if (record.id === "roza") {
          await QazaRepository.applyRemoteRoza({
            remaining: Number(data.remaining ?? 0),
            completed: Number(data.completed ?? 0),
            estimatedMissed:
              data.estimatedMissed != null ? Number(data.estimatedMissed) : undefined,
            updatedAt: record.updatedAt,
          });
        } else if (isQazaPrayer(record.id)) {
          await QazaRepository.applyRemoteCounter(record.id, {
            prayerId: record.id,
            remaining: Number(data.remaining ?? 0),
            completed: Number(data.completed ?? 0),
            updatedAt: record.updatedAt,
          });
        }
        break;
      }
      case "preferences": {
        const patch = filterRemotePreferencesPatch(
          data as Partial<UserPreferences>,
          hasPendingPreferenceChanges(),
        );
        await PreferencesRepository.applyRemotePreferences({
          ...patch,
          updatedAt: record.updatedAt,
        });
        break;
      }
      case "favorites": {
        const ids = Array.isArray(data.ids) ? (data.ids as string[]) : [];
        const order = Array.isArray(data.order) ? (data.order as string[]) : ids;
        await PreferencesRepository.applyRemoteFavorites(ids, order, record.updatedAt);
        break;
      }
      case "dua_favorites": {
        if (record.deletedAt) break;
        const order = Array.isArray(data.order) ? (data.order as string[]) : [];
        await applyRemoteDuaFavorites(order, record.updatedAt);
        break;
      }
      case "durood_favorites": {
        if (record.deletedAt) break;
        const order = Array.isArray(data.order) ? (data.order as string[]) : [];
        await applyRemoteDuroodFavorites(order, record.updatedAt);
        break;
      }
      case "name_favorites": {
        if (record.deletedAt) break;
        const order = Array.isArray(data.order) ? (data.order as string[]) : [];
        await applyRemoteNameFavorites(order, record.updatedAt);
        break;
      }
      case "quran_bookmarks": {
        if (record.deletedAt) break;
        const list = Array.isArray(data.bookmarks) ? (data.bookmarks as QuranBookmark[]) : [];
        await QuranRepository.applyRemoteBookmarks(list, record.updatedAt);
        break;
      }
      case "quran_last_read": {
        if (record.deletedAt) break;
        const surah = Number(data.surah);
        const ayah = Number(data.ayah);
        if (!Number.isFinite(surah) || !Number.isFinite(ayah)) break;
        await QuranRepository.applyRemoteLastRead({
          surah,
          ayah,
          updatedAt: (data.updatedAt as string | undefined) ?? record.updatedAt,
        });
        break;
      }
      case "hadith_bookmarks": {
        if (record.deletedAt) break;
        const list = Array.isArray(data.bookmarks) ? (data.bookmarks as HadithBookmark[]) : [];
        await HadithRepository.applyRemoteBookmarks(list, record.updatedAt);
        break;
      }
      case "custom_tasbeeh": {
        if (record.deletedAt) break;
        const items = Array.isArray(data.items) ? (data.items as CustomTasbeeh[]) : [];
        await applyRemoteCustomTasbeeh(items, record.updatedAt);
        break;
      }
    }
  }
  await reloadBlobStores(reloadBlobEntities);
}

/**
 * Push local changes then pull remote changes (last-write-wins on `updatedAt`).
 * Guest accounts never sync — the server returns 403 for them anyway.
 */
export async function runSync(session: StoredSession): Promise<SyncResult> {
  if (session.accountType === "guest") return { status: "skipped", reason: "guest" };
  if (isAppReloadInProgress()) return { status: "skipped", reason: "reload" };

  const meta = await readMeta();

  const [
    prayerLogs,
    zikrProgress,
    qazaCounters,
    roza,
    preferences,
    tombstones,
    duaFavorites,
    duroodFavorites,
    nameFavorites,
    quranBookmarks,
    quranBookmarksUpdatedAt,
    quranLastRead,
    hadithBookmarks,
    hadithBookmarksUpdatedAt,
    customTasbeeh,
  ] = await Promise.all([
    PrayerRepository.getAll(),
    ZikrRepository.getAll(),
    QazaRepository.getCounters(),
    QazaRepository.getRoza(),
    PreferencesRepository.get(),
    TombstoneRepository.getAll(),
    readDuaFavoritesBlob(),
    readDuroodFavoritesBlob(),
    readNameFavoritesBlob(),
    QuranRepository.getBookmarks(),
    QuranRepository.getBookmarksUpdatedAt(),
    QuranRepository.getLastRead(),
    HadithRepository.getBookmarks(),
    HadithRepository.getBookmarksUpdatedAt(),
    readCustomTasbeehBlob(),
  ]);

  const nowIso = new Date().toISOString();
  const typedRecords = buildSyncRecords({
    nowIso,
    prayerLogs,
    zikrProgress,
    qazaCounters,
    roza,
    preferences,
    tombstones,
    duaFavorites,
    duroodFavorites,
    nameFavorites,
    quranBookmarks,
    quranBookmarksUpdatedAt,
    quranLastRead,
    hadithBookmarks,
    hadithBookmarksUpdatedAt,
    customTasbeeh,
  });
  // Blob entities (fasting, khatm, learning progress, qaza schedule, …) detect
  // their own changes/deletions via a content-hash tracker; merge them in so the
  // same delta filter and last-write-wins push apply uniformly.
  const blobRecords = await (await blobSync()).buildBlobRecords(nowIso);
  const allRecords = [...typedRecords, ...blobRecords];

  // Delta push: only send records changed since our last successful push, plus
  // every tombstone (until the server acknowledges the deletion). The first sync
  // (no watermark yet) pushes everything so the account starts fully populated.
  const since = meta.lastPushedAt;
  const records = since
    ? allRecords.filter((record) => record.deletedAt != null || record.updatedAt > since)
    : allRecords;

  // Pull-only syncs are common on foreground. Do not POST an empty change set.
  const pushResult: SyncPushResponseDto =
    records.length > 0
      ? await syncPush(session.accessToken, records)
      : { accepted: 0, conflicts: [], serverTime: nowIso };
  // The server resolved these in favour of another device — take its version.
  if (pushResult.conflicts.length) await applyRemoteRecords(pushResult.conflicts);

  // Pull before clearing tombstones / advancing watermarks. If pull fails after a
  // successful push, deletions must remain queued so the next sync re-pushes them.
  // A push may have refreshed an expired native token through apiFetch's 401
  // handler. Read the persisted session so pull does not retry with the old JWT.
  const currentSession = await SessionStore.get();
  const pullResult = await syncPull(
    currentSession?.accessToken ?? session.accessToken,
    meta.lastSyncedAt,
  );
  if (pullResult.changes.length) await applyRemoteRecords(pullResult.changes);

  // Deletions we pushed were accepted (or superseded by a conflict applied above).
  // Any tombstone created during this sync is not in `tombstones` and is preserved.
  if (tombstones.length) {
    await TombstoneRepository.clear(tombstones.map((t) => ({ entity: t.entity, id: t.id })));
  }

  // Record the merge outcome so the sync-status UI can surface auto-resolved
  // last-write-wins conflicts and cross-device changes (NF-2.19).
  const conflictEntities = [...new Set(pushResult.conflicts.map((record) => record.entity))];
  await writeJSON<SyncMetadata>(DB_KEYS.syncMetadata, {
    lastSyncedAt: pullResult.serverTime,
    // Preserve the watermark when no push occurred so a concurrent local write
    // cannot be skipped by an empty foreground sync.
    lastPushedAt: records.length > 0 ? nowIso : meta.lastPushedAt,
    lastOutcomeAt: nowIso,
    lastPushed: pushResult.accepted,
    lastPulled: pullResult.changes.length,
    lastConflicts: pushResult.conflicts.length,
    lastConflictEntities: conflictEntities,
  });

  // Refresh in-memory stores so the UI reflects merged data. The dua-favorites
  // and custom-tasbeeh apply helpers self-update when loaded; the Qur'an store
  // reads bookmarks/last-read from the repository, so reload it if it is live.
  await Promise.all([
    trackerStore.getState().refresh(),
    preferencesStore.getState().refreshFromDb(),
    quranStore.getState().isReady ? quranStore.getState().load() : Promise.resolve(),
    customTasbeehStore.getState().isReady
      ? customTasbeehStore.getState().load()
      : Promise.resolve(),
  ]);

  clearPreferencesDirty();

  return {
    status: "ok",
    pushed: pushResult.accepted,
    pulled: pullResult.changes.length,
    conflicts: pushResult.conflicts.length,
  };
}
