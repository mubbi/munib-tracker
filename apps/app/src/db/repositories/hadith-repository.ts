import type { HadithCollectionData, HadithItem } from "@munib-tracker/shared/types";

import { getBundledCollectionData } from "@/lib/hadith";

import { createId } from "../id";
import { DB_KEYS } from "../keys";
import { KeyedCollection, readJSON, removeKey, writeJSON } from "../store";

/** A saved hadith resolved back to its full content for display. */
export interface BookmarkedHadith {
  bookmark: HadithBookmark;
  item: HadithItem;
}

export interface HadithBookmark {
  id: string;
  hadithId: string; // `${collection}:${number}`
  collection: string;
  number: string;
  createdAt: string;
}

type BookCache = Record<string, HadithCollectionData>;

const bookmarks = new KeyedCollection<HadithBookmark>(DB_KEYS.hadithBookmarks);

export const HadithRepository = {
  // ── Bookmarks ──────────────────────────────────────────
  async getBookmarks(): Promise<HadithBookmark[]> {
    return (await bookmarks.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async isBookmarked(hadithId: string): Promise<boolean> {
    return (await bookmarks.get(hadithId)) != null;
  },

  /**
   * Resolve every bookmarked hadith back to its full content so it can be
   * rendered on the bookmarks screen. Items are looked up from bundled data
   * first, then from the offline cache of any fetched remote collection.
   * Bookmarks whose source content is unavailable (e.g. a remote collection
   * never opened on this device) are dropped from the result.
   */
  async getBookmarkedHadiths(): Promise<BookmarkedHadith[]> {
    const list = await this.getBookmarks();
    const byCollection = new Map<string, Map<string, HadithItem>>();

    const itemsFor = async (collection: string): Promise<Map<string, HadithItem>> => {
      const existing = byCollection.get(collection);
      if (existing) return existing;
      const data: HadithCollectionData | null =
        getBundledCollectionData(collection) ?? (await this.getCachedBook(collection));
      const map = new Map<string, HadithItem>((data?.items ?? []).map((it) => [it.id, it]));
      byCollection.set(collection, map);
      return map;
    };

    const resolved: BookmarkedHadith[] = [];
    for (const bookmark of list) {
      const item = (await itemsFor(bookmark.collection)).get(bookmark.hadithId);
      if (item) resolved.push({ bookmark, item });
    }
    return resolved;
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
  async getCachedBook(cacheKey: string): Promise<HadithCollectionData | null> {
    const cache = await readJSON<BookCache>(DB_KEYS.hadithBookCache, {});
    return cache[cacheKey] ?? null;
  },

  async setCachedBook(cacheKey: string, data: HadithCollectionData): Promise<void> {
    // Best-effort: a full collection can exceed the storage quota (notably
    // localStorage on web). Never let a cache-write failure break the fetch —
    // the collection simply won't be available offline.
    try {
      const cache = await readJSON<BookCache>(DB_KEYS.hadithBookCache, {});
      cache[cacheKey] = data;
      await writeJSON(DB_KEYS.hadithBookCache, cache);
    } catch {
      // storage full / unavailable — skip caching
    }
  },

  async clear(): Promise<void> {
    await Promise.all([bookmarks.clear(), removeKey(DB_KEYS.hadithBookCache)]);
  },
};

export type HadithRepositoryType = typeof HadithRepository;
