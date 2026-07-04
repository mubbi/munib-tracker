import type { PrayerId, PrayerLog, PrayerStatus } from "@munib-tracker/shared/types";

import { createId } from "../id";
import { DB_KEYS, prayerLogKey } from "../keys";
import { KeyedCollection } from "../store";
import { TombstoneRepository } from "./tombstone-repository";

const collection = new KeyedCollection<PrayerLog>(DB_KEYS.prayerLogs);

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
    const existing = await collection.get(prayerLogKey(prayerId, date));
    const log: PrayerLog = {
      id: existing?.id ?? createId("prayer"),
      prayerId,
      date,
      status,
      notes: patch?.notes ?? existing?.notes,
      qazaDebtAdded:
        patch?.qazaDebtAdded !== undefined ? patch.qazaDebtAdded : existing?.qazaDebtAdded,
      updatedAt: new Date().toISOString(),
      source: "manual",
    };
    return collection.upsert(prayerLogKey(prayerId, date), log);
  },

  async setNotes(prayerId: PrayerId, date: string, notes: string): Promise<PrayerLog> {
    const existing = await collection.get(prayerLogKey(prayerId, date));
    const log: PrayerLog = {
      id: existing?.id ?? createId("prayer"),
      prayerId,
      date,
      status: existing?.status ?? "pending",
      notes,
      updatedAt: new Date().toISOString(),
      source: "manual",
    };
    return collection.upsert(prayerLogKey(prayerId, date), log);
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
