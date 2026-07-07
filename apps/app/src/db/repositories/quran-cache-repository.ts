import { DB_KEYS } from "../keys";
import { readJSON, removeKey, updateJSON } from "../store";

/**
 * Offline cache of remotely-fetched Qur'an editions (D2). There is no
 * react-query persister configured, so fetched translation/tafsir editions are
 * written here per (edition, surah) and re-read offline afterward.
 *
 * An in-memory layer avoids repeated AsyncStorage reads when navigating between
 * surahs or remounting the reader.
 */

type EditionCache = Record<string, Record<string, string>>;

const memory = new Map<string, Record<string, string>>();
let storageLoaded = false;

function cacheKey(editionId: string, surah: number): string {
  return `${editionId}:${surah}`;
}

async function ensureStorageLoaded(): Promise<void> {
  if (storageLoaded) return;
  const cache = await readJSON<EditionCache>(DB_KEYS.quranEditionCache, {});
  for (const [key, value] of Object.entries(cache)) {
    memory.set(key, value);
  }
  storageLoaded = true;
}

export const QuranCacheRepository = {
  async get(editionId: string, surah: number): Promise<Record<string, string> | null> {
    const key = cacheKey(editionId, surah);
    const hit = memory.get(key);
    if (hit) return hit;

    await ensureStorageLoaded();
    return memory.get(key) ?? null;
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

    // Best-effort: never let a cache-write failure (e.g. storage quota) break
    // the fetch that produced this data.
    try {
      await updateJSON<EditionCache>(DB_KEYS.quranEditionCache, {}, (cache) => {
        cache[key] = ayahText;
        return cache;
      });
    } catch {
      // storage full / unavailable — skip persisting
    }
  },

  async clear(): Promise<void> {
    memory.clear();
    storageLoaded = false;
    await removeKey(DB_KEYS.quranEditionCache);
  },
};

export type QuranCacheRepositoryType = typeof QuranCacheRepository;
