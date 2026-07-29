import { DB_KEYS } from "../keys";
import { readJSON, removeKey, updateJSON } from "../store";

/**
 * Offline cache for ayah-study remote payloads (tajweed segments, word-by-word).
 * Same pattern as {@link QuranCacheRepository}: in-memory + AsyncStorage.
 */

type StudyCache = Record<string, unknown>;

const memory = new Map<string, unknown>();
let storageLoaded = false;

async function ensureStorageLoaded(): Promise<void> {
  if (storageLoaded) return;
  const cache = await readJSON<StudyCache>(DB_KEYS.quranStudyCache, {});
  for (const [key, value] of Object.entries(cache)) {
    memory.set(key, value);
  }
  storageLoaded = true;
}

export const QuranStudyCacheRepository = {
  async get<T>(key: string): Promise<T | null> {
    const hit = memory.get(key);
    if (hit !== undefined) return hit as T;

    await ensureStorageLoaded();
    const stored = memory.get(key);
    return stored !== undefined ? (stored as T) : null;
  },

  async set(key: string, value: unknown, persist = true): Promise<void> {
    memory.set(key, value);
    if (!persist) return;
    try {
      await updateJSON<StudyCache>(DB_KEYS.quranStudyCache, {}, (cache) => {
        cache[key] = value;
        return cache;
      });
    } catch {
      // storage full / unavailable — keep session cache only
    }
  },

  async clear(): Promise<void> {
    memory.clear();
    storageLoaded = false;
    await removeKey(DB_KEYS.quranStudyCache);
  },
};

export type QuranStudyCacheRepositoryType = typeof QuranStudyCacheRepository;
