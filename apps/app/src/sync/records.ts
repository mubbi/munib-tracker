import type { SyncRecordDto } from "@munib-tracker/api-client";
import type {
  PrayerLog,
  QazaCounter,
  QazaRozaCounter,
  UserPreferences,
  ZikrProgress,
} from "@munib-tracker/shared/types";

import { prayerLogKey, zikrProgressKey } from "@/db/keys";

export interface LocalSnapshot {
  nowIso: string;
  prayerLogs: PrayerLog[];
  zikrProgress: ZikrProgress[];
  qazaCounters: QazaCounter[];
  roza: QazaRozaCounter;
  preferences: UserPreferences;
}

/** Maps the local database into the flat record list the sync API expects. */
export function buildSyncRecords(snapshot: LocalSnapshot): SyncRecordDto[] {
  const records: SyncRecordDto[] = [];

  for (const log of snapshot.prayerLogs) {
    records.push({
      entity: "prayer_logs",
      id: prayerLogKey(log.prayerId, log.date),
      data: { ...log },
      updatedAt: log.updatedAt,
    });
  }

  for (const entry of snapshot.zikrProgress) {
    records.push({
      entity: "zikr_progress",
      id: zikrProgressKey(entry.zikrId, entry.date),
      data: { ...entry },
      updatedAt: snapshot.nowIso,
    });
  }

  for (const counter of snapshot.qazaCounters) {
    records.push({
      entity: "qaza_entries",
      id: counter.prayerId,
      data: { ...counter },
      updatedAt: snapshot.nowIso,
    });
  }
  records.push({
    entity: "qaza_entries",
    id: "roza",
    data: { ...snapshot.roza },
    updatedAt: snapshot.nowIso,
  });

  records.push({
    entity: "preferences",
    id: "preferences",
    data: { ...snapshot.preferences },
    updatedAt: snapshot.nowIso,
  });

  records.push({
    entity: "favorites",
    id: "favorites",
    data: {
      ids: snapshot.preferences.favoriteZikrIds,
      order: snapshot.preferences.favoriteZikrOrder,
    },
    updatedAt: snapshot.nowIso,
  });

  return records;
}

/** Keeps the record with the most recent `updatedAt` for each (entity, id) pair. */
export function mergeByUpdatedAt(records: SyncRecordDto[]): SyncRecordDto[] {
  const winners = new Map<string, SyncRecordDto>();
  for (const record of records) {
    const key = `${record.entity}::${record.id}`;
    const current = winners.get(key);
    if (!current || record.updatedAt > current.updatedAt) winners.set(key, record);
  }
  return [...winners.values()];
}
