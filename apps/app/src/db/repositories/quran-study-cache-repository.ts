import { DB_KEYS } from "../keys";
import {
  migrateMonolithToShards,
  readJSON,
  removeKeyTree,
  storageShardKey,
  writeJSONIfSafe,
} from "../store";

/**
 * Offline cache for ayah-study remote payloads (tajweed segments, word-by-word).
 * Same pattern as {@link QuranCacheRepository}: in-memory + one AsyncStorage
 * shard per study key (not a single growing blob — Android CursorWindow).
 */

const memory = new Map<string, unknown>();

function shardKey(key: string): string {
  return storageShardKey(DB_KEYS.quranStudyCache, key);
}

export const QuranStudyCacheRepository = {
  async get<T>(key: string): Promise<T | null> {
    const hit = memory.get(key);
    if (hit !== undefined) return hit as T;

    await migrateMonolithToShards(DB_KEYS.quranStudyCache);
    const stored = await readJSON<T | null>(shardKey(key), null);
    if (stored !== null) memory.set(key, stored);
    return stored;
  },

  async set(key: string, value: unknown, persist = true): Promise<void> {
    memory.set(key, value);
    if (!persist) return;
    try {
      await migrateMonolithToShards(DB_KEYS.quranStudyCache);
      await writeJSONIfSafe(shardKey(key), value);
    } catch {
      // storage full / unavailable — keep session cache only
    }
  },

  async clear(): Promise<void> {
    memory.clear();
    await removeKeyTree(DB_KEYS.quranStudyCache);
  },
};

export type QuranStudyCacheRepositoryType = typeof QuranStudyCacheRepository;
