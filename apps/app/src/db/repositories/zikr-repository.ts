import type { ZikrProgress } from "@munib-tracker/shared/types";

import { createId } from "../id";
import { DB_KEYS, zikrProgressKey } from "../keys";
import { KeyedCollection } from "../store";

const collection = new KeyedCollection<ZikrProgress>(DB_KEYS.zikrProgress);

function build(zikrId: string, date: string, count: number, target: number): ZikrProgress {
  return {
    id: createId("zikr"),
    zikrId,
    date,
    count,
    target,
    completed: target > 0 && count >= target,
  };
}

export const ZikrRepository = {
  async getAll(): Promise<ZikrProgress[]> {
    return collection.getAll();
  },

  async getByDate(date: string): Promise<ZikrProgress[]> {
    return (await collection.getAll()).filter((entry) => entry.date === date);
  },

  async getProgress(zikrId: string, date: string): Promise<ZikrProgress | undefined> {
    return collection.get(zikrProgressKey(zikrId, date));
  },

  async setCount(
    zikrId: string,
    date: string,
    count: number,
    target: number,
  ): Promise<ZikrProgress> {
    const existing = await collection.get(zikrProgressKey(zikrId, date));
    const safeCount = Math.max(0, count);
    const entry: ZikrProgress = {
      ...(existing ?? build(zikrId, date, 0, target)),
      count: safeCount,
      target,
      completed: target > 0 && safeCount >= target,
      updatedAt: new Date().toISOString(),
    };
    return collection.upsert(zikrProgressKey(zikrId, date), entry);
  },

  async increment(zikrId: string, date: string, target: number, by = 1): Promise<ZikrProgress> {
    const existing = await collection.get(zikrProgressKey(zikrId, date));
    const nextCount = Math.max(0, (existing?.count ?? 0) + by);
    return this.setCount(zikrId, date, nextCount, target);
  },

  /** Writes a progress entry verbatim (used when applying a server record). */
  async upsertProgress(entry: ZikrProgress): Promise<ZikrProgress> {
    return collection.upsert(zikrProgressKey(entry.zikrId, entry.date), entry);
  },

  /** Applies a pulled entry with last-write-wins on `updatedAt` (keeps newer local). */
  async applyRemoteProgress(entry: ZikrProgress): Promise<void> {
    await collection.mutate((map) => {
      const key = zikrProgressKey(entry.zikrId, entry.date);
      const existing = map[key];
      if (existing && (existing.updatedAt ?? "") >= (entry.updatedAt ?? "")) return;
      map[key] = entry;
    });
  },

  async clear(): Promise<void> {
    await collection.clear();
  },
};

export type ZikrRepositoryType = typeof ZikrRepository;
