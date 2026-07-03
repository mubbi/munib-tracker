import { DB_KEYS } from "../keys";
import { readJSON, removeKey, writeJSON } from "../store";

/**
 * Offline cache of remotely-fetched Qur'an editions (D2). There is no
 * react-query persister configured, so fetched translation/tafsir editions are
 * written here per (edition, surah) and re-read offline afterward.
 */

type EditionCache = Record<string, Record<string, string>>;

function cacheKey(editionId: string, surah: number): string {
  return `${editionId}:${surah}`;
}

export const QuranCacheRepository = {
  async get(editionId: string, surah: number): Promise<Record<string, string> | null> {
    const cache = await readJSON<EditionCache>(DB_KEYS.quranEditionCache, {});
    return cache[cacheKey(editionId, surah)] ?? null;
  },

  async set(editionId: string, surah: number, ayahText: Record<string, string>): Promise<void> {
    const cache = await readJSON<EditionCache>(DB_KEYS.quranEditionCache, {});
    cache[cacheKey(editionId, surah)] = ayahText;
    await writeJSON(DB_KEYS.quranEditionCache, cache);
  },

  async clear(): Promise<void> {
    await removeKey(DB_KEYS.quranEditionCache);
  },
};

export type QuranCacheRepositoryType = typeof QuranCacheRepository;
