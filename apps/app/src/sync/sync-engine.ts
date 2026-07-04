import type { SyncRecordDto } from "@munib-tracker/api-client";
import type {
  PrayerId,
  PrayerLog,
  UserPreferences,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

import { syncPull, syncPush } from "@/api/endpoints";
import type { StoredSession } from "@/auth/session-store";
import {
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  TombstoneRepository,
  ZikrRepository,
} from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

import { buildSyncRecords } from "./records";

interface SyncMetadata {
  /** Server clock at our last successful pull — the `since` cursor for the next pull. */
  lastSyncedAt?: string;
  /** Local clock at our last successful push — the watermark for delta pushes. */
  lastPushedAt?: string;
}

export type SyncResult =
  | { status: "skipped"; reason: "guest" | "offline" }
  | { status: "ok"; pushed: number; pulled: number; conflicts: number };

async function readMeta(): Promise<SyncMetadata> {
  return readJSON<SyncMetadata>(DB_KEYS.syncMetadata, {});
}

/**
 * Applies pulled (or conflict) records to the local database. Every write goes
 * through a repository method that enforces last-write-wins on `updatedAt` and
 * preserves the server timestamp, so a newer offline edit is never clobbered and
 * applied records don't get re-stamped (which would cause sync ping-pong).
 */
async function applyRemoteRecords(records: SyncRecordDto[]): Promise<void> {
  for (const record of records) {
    const data = record.data as Record<string, unknown>;
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
        } else if (isObligatoryPrayer(record.id)) {
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
        await PreferencesRepository.applyRemotePreferences({
          ...(data as Partial<UserPreferences>),
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
    }
  }
}

/**
 * Push local changes then pull remote changes (last-write-wins on `updatedAt`).
 * Guest accounts never sync — the server returns 403 for them anyway.
 */
export async function runSync(session: StoredSession): Promise<SyncResult> {
  if (session.accountType === "guest") return { status: "skipped", reason: "guest" };

  const meta = await readMeta();

  const [prayerLogs, zikrProgress, qazaCounters, roza, preferences, tombstones] = await Promise.all(
    [
      PrayerRepository.getAll(),
      ZikrRepository.getAll(),
      QazaRepository.getCounters(),
      QazaRepository.getRoza(),
      PreferencesRepository.get(),
      TombstoneRepository.getAll(),
    ],
  );

  const nowIso = new Date().toISOString();
  const allRecords = buildSyncRecords({
    nowIso,
    prayerLogs,
    zikrProgress,
    qazaCounters,
    roza,
    preferences,
    tombstones,
  });

  // Delta push: only send records changed since our last successful push, plus
  // every tombstone (until the server acknowledges the deletion). The first sync
  // (no watermark yet) pushes everything so the account starts fully populated.
  const since = meta.lastPushedAt;
  const records = since
    ? allRecords.filter((record) => record.deletedAt != null || record.updatedAt > since)
    : allRecords;

  const pushResult = await syncPush(session.accessToken, records);
  // The server resolved these in favour of another device — take its version.
  if (pushResult.conflicts.length) await applyRemoteRecords(pushResult.conflicts);

  // The deletions we just pushed were accepted (or superseded by a conflict we
  // applied above), so drop those tombstones. Any tombstone created during this
  // sync is not in `tombstones` and is preserved for the next push.
  if (tombstones.length) {
    await TombstoneRepository.clear(tombstones.map((t) => ({ entity: t.entity, id: t.id })));
  }

  const pullResult = await syncPull(session.accessToken, meta.lastSyncedAt);
  if (pullResult.changes.length) await applyRemoteRecords(pullResult.changes);

  await writeJSON<SyncMetadata>(DB_KEYS.syncMetadata, {
    lastSyncedAt: pullResult.serverTime,
    lastPushedAt: nowIso,
  });

  // Refresh in-memory stores so the UI reflects merged data.
  await Promise.all([trackerStore.getState().refresh(), preferencesStore.getState().load()]);

  return {
    status: "ok",
    pushed: pushResult.accepted,
    pulled: pullResult.changes.length,
    conflicts: pushResult.conflicts.length,
  };
}
