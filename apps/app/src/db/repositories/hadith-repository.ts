import type { HadithItem } from "@munib-tracker/shared/types";

import { createId } from "../id";
import { DB_KEYS } from "../keys";
import { KeyedCollection, readJSON, removeKey, writeJSON } from "../store";

export interface HadithBookmark {
  id: string;
  hadithId: string; // `${collection}:${number}`
  collection: string;
  number: string;
  createdAt: string;
}

type BookCache = Record<string, HadithItem[]>;

const bookmarks = new KeyedCollection<HadithBookmark>(DB_KEYS.hadithBookmarks);

export const HadithRepository = {
  // ── Bookmarks ──────────────────────────────────────────
  async getBookmarks(): Promise<HadithBookmark[]> {
    return (await bookmarks.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async isBookmarked(hadithId: string): Promise<boolean> {
    return (await bookmarks.get(hadithId)) != null;
  },

  async toggleBookmark(item: Pick<HadithItem, "id" | "collection" | "number">): Promise<boolean> {
    const existing = await bookmarks.get(item.id);
    if (existing) {
      await bookmarks.remove(item.id);
      return false;
    }
    await bookmarks.upsert(item.id, {
      id: createId("hbm"),
      hadithId: item.id,
      collection: item.collection,
      number: item.number,
      createdAt: new Date().toISOString(),
    });
    return true;
  },

  // ── Offline cache of fetched books (D6) ────────────────
  async getCachedBook(cacheKey: string): Promise<HadithItem[] | null> {
    const cache = await readJSON<BookCache>(DB_KEYS.hadithBookCache, {});
    return cache[cacheKey] ?? null;
  },

  async setCachedBook(cacheKey: string, items: HadithItem[]): Promise<void> {
    const cache = await readJSON<BookCache>(DB_KEYS.hadithBookCache, {});
    cache[cacheKey] = items;
    await writeJSON(DB_KEYS.hadithBookCache, cache);
  },

  async clear(): Promise<void> {
    await Promise.all([bookmarks.clear(), removeKey(DB_KEYS.hadithBookCache)]);
  },
};

export type HadithRepositoryType = typeof HadithRepository;
