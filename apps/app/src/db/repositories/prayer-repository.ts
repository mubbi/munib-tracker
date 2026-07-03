import type { PrayerId, PrayerLog, PrayerStatus } from "@munib-tracker/shared/types";

import { createId } from "../id";
import { DB_KEYS, prayerLogKey } from "../keys";
import { KeyedCollection } from "../store";

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
    notes?: string,
  ): Promise<PrayerLog> {
    const existing = await collection.get(prayerLogKey(prayerId, date));
    const log: PrayerLog = {
      id: existing?.id ?? createId("prayer"),
      prayerId,
      date,
      status,
      notes: notes ?? existing?.notes,
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

  async remove(prayerId: PrayerId, date: string): Promise<void> {
    await collection.remove(prayerLogKey(prayerId, date));
  },

  async clear(): Promise<void> {
    await collection.clear();
  },
};

export type PrayerRepositoryType = typeof PrayerRepository;
