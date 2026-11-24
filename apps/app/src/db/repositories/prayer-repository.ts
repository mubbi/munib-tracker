import type {
  ObligatoryPrayer,
  PrayerCombineMode,
  PrayerId,
  PrayerLog,
  PrayerStatus,
  RawatibId,
} from "@munib-tracker/shared/types";

import { createId } from "../id";
import { DB_KEYS, prayerLogKey } from "../keys";
import { KeyedCollection } from "../store";
import { TombstoneRepository } from "./tombstone-repository";

const collection = new KeyedCollection<PrayerLog>(DB_KEYS.prayerLogs);

/**
 * Next version of a log: every field of the existing log is carried over
 * (`rakahs`, `late`, `combinedWith`, `combineMode`, flags, and any field added
 * later) and only `changes` are replaced — a partial update can never drop a
 * field it doesn't know about.
 */
function nextLog(
  existing: PrayerLog | undefined,
  prayerId: PrayerId,
  date: string,
  changes: Partial<PrayerLog>,
): PrayerLog {
  return {
    status: "pending",
    ...existing,
    id: existing?.id ?? createId("prayer"),
    prayerId,
    date,
    ...changes,
    updatedAt: new Date().toISOString(),
    source: "manual",
  };
}

export const PrayerRepository = {
  async getAll(): Promise<PrayerLog[]> {
    return collection.getAll();
  },

  async getByDate(date: string): Promise<PrayerLog[]> {
    return (await collection.getAll()).filter((log) => log.date === date);
  },

  async getLog(prayerId: PrayerId, date: string): Promise<PrayerLog | undefined> {
    return collection.get(prayerLogKey(prayerId, date));
  },

  async setStatus(
    prayerId: PrayerId,
    date: string,
    status: PrayerStatus,
    patch?: { notes?: string; qazaDebtAdded?: boolean },
  ): Promise<PrayerLog> {
    let result!: PrayerLog;
    await collection.mutate((map) => {
      const key = prayerLogKey(prayerId, date);
      const existing = map[key];
      const log = nextLog(existing, prayerId, date, {
        status,
        notes: patch?.notes ?? existing?.notes,
        qazaDebtAdded:
          patch?.qazaDebtAdded !== undefined ? patch.qazaDebtAdded : existing?.qazaDebtAdded,
      });
      map[key] = log;
      result = log;
    });
    return result;
  },

  async setNotes(prayerId: PrayerId, date: string, notes: string): Promise<PrayerLog> {
    let result!: PrayerLog;
    await collection.mutate((map) => {
      const key = prayerLogKey(prayerId, date);
      const existing = map[key];
      const log = nextLog(existing, prayerId, date, { notes });
      map[key] = log;
      result = log;
    });
    return result;
  },

  /**
   * Sets the optional flags (jama' / jam' combined / excused) on a prayer without changing its
   * status, creating a pending log if none exists yet. Used by the congregation
   * toggle and the "mark day excused" action.
   */
  async setFlags(
    prayerId: PrayerId,
    date: string,
    patch: {
      isJama?: boolean;
      isExcused?: boolean;
      excusedReason?: PrayerLog["excusedReason"];
      /** `null` clears the jam' flag; `undefined` keeps it. */
      combined?: { with: ObligatoryPrayer; mode: PrayerCombineMode } | null;
      /** NF-3.11 "prayed at the masjid": `null` clears it (and the masjid ref); `undefined` keeps it. */
      masjid?: { masjidId?: string } | null;
    },
  ): Promise<PrayerLog> {
    let result!: PrayerLog;
    await collection.mutate((map) => {
      const key = prayerLogKey(prayerId, date);
      const existing = map[key];
      const log = nextLog(existing, prayerId, date, {
        isJama: patch.isJama ?? existing?.isJama,
        combinedWith:
          patch.combined === undefined
            ? existing?.combinedWith
            : (patch.combined?.with ?? undefined),
        combineMode:
          patch.combined === undefined
            ? existing?.combineMode
            : (patch.combined?.mode ?? undefined),
        atMasjid: patch.masjid === undefined ? existing?.atMasjid : patch.masjid ? true : undefined,
        masjidId:
          patch.masjid === undefined ? existing?.masjidId : (patch.masjid?.masjidId ?? undefined),
        isExcused: patch.isExcused ?? existing?.isExcused,
        excusedReason:
          patch.isExcused === false ? undefined : (patch.excusedReason ?? existing?.excusedReason),
      });
      map[key] = log;
      result = log;
    });
    return result;
  },

  /**
   * Logs or clears a sunnah rawatib row (NF-3.1). Only `completed` / `pending`
   * are written; `rakahs` / `late` are kept on clear so a re-tap restores them.
   * Rawatib never carry qaza or excused flags.
   */
  async setRawatib(
    prayerId: RawatibId,
    date: string,
    completed: boolean,
    patch: { rakahs?: number; late?: boolean } = {},
  ): Promise<PrayerLog> {
    let result!: PrayerLog;
    await collection.mutate((map) => {
      const key = prayerLogKey(prayerId, date);
      const existing = map[key];
      const log = nextLog(existing, prayerId, date, {
        status: completed ? "completed" : "pending",
        rakahs: patch.rakahs ?? existing?.rakahs,
        late: completed ? (patch.late ?? existing?.late) : existing?.late,
      });
      map[key] = log;
      result = log;
    });
    return result;
  },

  /** Writes a log verbatim (used when applying a record pulled from the server). */
  async upsertLog(log: PrayerLog): Promise<PrayerLog> {
    return collection.upsert(prayerLogKey(log.prayerId, log.date), log);
  },

  /**
   * Applies a pulled log with last-write-wins on `updatedAt`: the local copy is
   * kept when it is newer or equal, so an offline edit is never clobbered by a
   * staler server version. Read + compare + write run atomically under the
   * collection's per-key lock.
   */
  async applyRemoteLog(log: PrayerLog): Promise<void> {
    await collection.mutate((map) => {
      const key = prayerLogKey(log.prayerId, log.date);
      const existing = map[key];
      if (existing && existing.updatedAt >= log.updatedAt) return;
      map[key] = log;
    });
  },

  /**
   * Removes a log. Records a tombstone by default so the deletion propagates on
   * the next sync push; pass `{ tombstone: false }` when applying a deletion that
   * was itself pulled from the server (no need to echo it back).
   */
  async remove(prayerId: PrayerId, date: string, opts?: { tombstone?: boolean }): Promise<void> {
    const key = prayerLogKey(prayerId, date);
    await collection.remove(key);
    if (opts?.tombstone !== false) {
      await TombstoneRepository.record("prayer_logs", key, new Date().toISOString());
    }
  },

  async clear(): Promise<void> {
    await collection.clear();
  },
};

export type PrayerRepositoryType = typeof PrayerRepository;
