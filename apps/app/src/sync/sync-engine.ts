import type { SyncRecordDto } from "@munib-tracker/api-client";
import type {
  PrayerLog,
  QazaCounter,
  UserPreferences,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

import { syncPull, syncPush } from "@/api/endpoints";
import type { StoredSession } from "@/auth/session-store";
import { PrayerRepository, PreferencesRepository, QazaRepository, ZikrRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

import { buildSyncRecords } from "./records";

interface SyncMetadata {
  lastSyncedAt?: string;
}

export type SyncResult =
  | { status: "skipped"; reason: "guest" | "offline" }
  | { status: "ok"; pushed: number; pulled: number; conflicts: number };

async function readMeta(): Promise<SyncMetadata> {
  return readJSON<SyncMetadata>(DB_KEYS.syncMetadata, {});
}

async function applyRemoteRecords(records: SyncRecordDto[]): Promise<void> {
  for (const record of records) {
    const data = record.data as Record<string, unknown>;
    switch (record.entity) {
      case "prayer_logs": {
        if (record.deletedAt) {
          const log = data as unknown as PrayerLog;
          if (log.prayerId && log.date) await PrayerRepository.remove(log.prayerId, log.date);
        } else {
          await PrayerRepository.upsertLog(data as unknown as PrayerLog);
        }
        break;
      }
      case "zikr_progress": {
        await ZikrRepository.upsertProgress(data as unknown as ZikrProgress);
        break;
      }
      case "qaza_entries": {
        if (record.id === "roza") {
          await QazaRepository.setRoza({
            remaining: Number(data.remaining ?? 0),
            completed: Number(data.completed ?? 0),
          });
        } else {
          const counter = data as unknown as QazaCounter;
          if (isObligatoryPrayer(record.id)) {
            await QazaRepository.setCounter(record.id, counter.remaining, counter.completed);
          }
        }
        break;
      }
      case "preferences": {
        await PreferencesRepository.update(data as unknown as Partial<UserPreferences>);
        break;
      }
      case "favorites": {
        const ids = Array.isArray(data.ids) ? (data.ids as string[]) : [];
        const order = Array.isArray(data.order) ? (data.order as string[]) : ids;
        await PreferencesRepository.update({ favoriteZikrIds: ids, favoriteZikrOrder: order });
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

  const [prayerLogs, zikrProgress, qazaCounters, roza, preferences] = await Promise.all([
    PrayerRepository.getAll(),
    ZikrRepository.getAll(),
    QazaRepository.getCounters(),
    QazaRepository.getRoza(),
    PreferencesRepository.get(),
  ]);

  const records = buildSyncRecords({
    nowIso: new Date().toISOString(),
    prayerLogs,
    zikrProgress,
    qazaCounters,
    roza,
    preferences,
  });

  const pushResult = await syncPush(session.accessToken, records);
  // The server resolved these in favour of another device — take its version.
  if (pushResult.conflicts.length) await applyRemoteRecords(pushResult.conflicts);

  const pullResult = await syncPull(session.accessToken, meta.lastSyncedAt);
  if (pullResult.changes.length) await applyRemoteRecords(pullResult.changes);

  await writeJSON(DB_KEYS.syncMetadata, { lastSyncedAt: pullResult.serverTime });

  // Refresh in-memory stores so the UI reflects merged data.
  await Promise.all([trackerStore.getState().refresh(), preferencesStore.getState().load()]);

  return {
    status: "ok",
    pushed: pushResult.accepted,
    pulled: pullResult.changes.length,
    conflicts: pushResult.conflicts.length,
  };
}
