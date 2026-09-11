import { DB_KEYS } from "../keys";
import {
  migrateMonolithToShards,
  readJSON,
  removeKeyTree,
  storageShardKey,
  writeJSONIfSafe,
} from "../store";

/**
 * Offline cache of remotely-fetched Qur'an editions (D2). There is no
 * react-query persister configured, so fetched translation/tafsir editions are
 * written here per (edition, surah) and re-read offline afterward.
 *
 * Each surah is its own AsyncStorage key. A single blob of every downloaded
 * edition overflows Android's SQLite CursorWindow (~1–2 MB) and makes getItem
 * throw `Row too big to fit into CursorWindow`.
 *
 * An in-memory layer avoids repeated storage reads when navigating between
 * surahs or remounting the reader.
 */

const memory = new Map<string, Record<string, string>>();

function cacheKey(editionId: string, surah: number): string {
  return `${editionId}:${surah}`;
}

function shardKey(editionId: string, surah: number): string {
  return storageShardKey(DB_KEYS.quranEditionCache, cacheKey(editionId, surah));
}

export const QuranCacheRepository = {
  async get(editionId: string, surah: number): Promise<Record<string, string> | null> {
    const key = cacheKey(editionId, surah);
    const hit = memory.get(key);
    if (hit) return hit;

    await migrateMonolithToShards(DB_KEYS.quranEditionCache);
    const stored = await readJSON<Record<string, string> | null>(shardKey(editionId, surah), null);
    if (stored) memory.set(key, stored);
    return stored;
  },

  /**
   * Cache a fetched edition surah. Always kept in the in-memory session cache so
   * re-reads don't refetch; only persisted to on-device storage when `persist`
   * is true (the user's "save Qur'an editions locally" preference). When false
   * the data lives for the session only and nothing is written to disk.
   */
  async set(
    editionId: string,
    surah: number,
    ayahText: Record<string, string>,
    persist = true,
  ): Promise<void> {
    const key = cacheKey(editionId, surah);
    memory.set(key, ayahText);

    if (!persist) return;

    // Best-effort: never let a cache-write failure (e.g. storage quota or a
    // value over the CursorWindow-safe size) break the fetch that produced this.
    try {
      await migrateMonolithToShards(DB_KEYS.quranEditionCache);
      await writeJSONIfSafe(shardKey(editionId, surah), ayahText);
    } catch {
      // storage full / unavailable — skip persisting
    }
  },

  async clear(): Promise<void> {
    memory.clear();
    await removeKeyTree(DB_KEYS.quranEditionCache);
  },
};

export type QuranCacheRepositoryType = typeof QuranCacheRepository;
