import type { HadithCollectionData, HadithItem } from "@munib-tracker/shared/types";

import { ensureBundledCollectionData } from "@/lib/hadith-bundled";
import { LruMap } from "@/lib/lru-map";

import { createId } from "../id";
import { DB_KEYS } from "../keys";
import { KeyedCollection, readJSON, removeKey, updateJSON, writeJSON } from "../store";

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

/** Reader display toggles for hadith collection / bookmark screens. */
export interface HadithPrefs {
  showArabic: boolean;
  showTranslation: boolean;
  showNarrator: boolean;
  showGrade: boolean;
}

export const DEFAULT_HADITH_PREFS: HadithPrefs = {
  showArabic: true,
  showTranslation: true,
  showNarrator: true,
  showGrade: true,
};

type BookCache = Record<string, HadithCollectionData>;

/** Cap in-memory remote collections (disk cache remains authoritative). */
const bookMemory = new LruMap<string, HadithCollectionData>(12);
let bookStorageLoaded = false;

const bookmarks = new KeyedCollection<HadithBookmark>(DB_KEYS.hadithBookmarks);

async function ensureBookStorageLoaded(): Promise<void> {
  if (bookStorageLoaded) return;
  const cache = await readJSON<BookCache>(DB_KEYS.hadithBookCache, {});
  for (const [key, value] of Object.entries(cache)) {
    bookMemory.set(key, value);
  }
  bookStorageLoaded = true;
}

export const HadithRepository = {
  // ── Reading prefs ──────────────────────────────────────
  async getPrefs(): Promise<HadithPrefs> {
    const stored = await readJSON<Partial<HadithPrefs>>(DB_KEYS.hadithPrefs, {});
    return { ...DEFAULT_HADITH_PREFS, ...stored };
  },

  async updatePrefs(patch: Partial<HadithPrefs>): Promise<HadithPrefs> {
    const next = { ...(await this.getPrefs()), ...patch };
    await writeJSON(DB_KEYS.hadithPrefs, next);
    return next;
  },

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
        (await ensureBundledCollectionData(collection)) ?? (await this.getCachedBook(collection));
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
      await this.touchBookmarks();
      return false;
    }
    await bookmarks.upsert(item.id, {
      id: createId("hbm"),
      hadithId: item.id,
      collection: item.collection,
      number: item.number,
      createdAt: new Date().toISOString(),
    });
    await this.touchBookmarks();
    return true;
  },

  // ── Bookmark sync (blob last-write-wins) ───────────────
  /** Stamps the blob-level watermark used for last-write-wins over the set. */
  async touchBookmarks(): Promise<void> {
    await writeJSON(DB_KEYS.hadithBookmarksUpdatedAt, new Date().toISOString());
  },

  async getBookmarksUpdatedAt(): Promise<string | undefined> {
    return readJSON<string | undefined>(DB_KEYS.hadithBookmarksUpdatedAt, undefined);
  },

  /** Per-item LWW union merge from remote; deletes still need tombstones later. */
  async applyRemoteBookmarks(incoming: HadithBookmark[], updatedAt?: string): Promise<void> {
    const localMap = await bookmarks.getMap();
    const localUpdatedAt = await this.getBookmarksUpdatedAt();
    const merged: Record<string, HadithBookmark> = { ...localMap };
    for (const bm of incoming) {
      const existing = merged[bm.hadithId];
      if (!existing || bm.createdAt > existing.createdAt) {
        merged[bm.hadithId] = bm;
      }
    }
    await writeJSON(DB_KEYS.hadithBookmarks, merged);
    if (updatedAt) {
      const watermark = localUpdatedAt && localUpdatedAt > updatedAt ? localUpdatedAt : updatedAt;
      await writeJSON(DB_KEYS.hadithBookmarksUpdatedAt, watermark);
    }
  },

  // ── Offline cache of fetched books (D6) ────────────────
  async getCachedBook(cacheKey: string): Promise<HadithCollectionData | null> {
    const hit = bookMemory.get(cacheKey);
    if (hit) return hit;

    await ensureBookStorageLoaded();
    return bookMemory.get(cacheKey) ?? null;
  },

  /**
   * Cache a fetched collection. Always kept in the in-memory session cache so
   * re-opening it doesn't refetch; only persisted to on-device storage when
   * `persist` is true (the user's "save hadith locally" preference). When false
   * it lives for the session only and nothing is written to disk.
   */
  async setCachedBook(cacheKey: string, data: HadithCollectionData, persist = true): Promise<void> {
    bookMemory.set(cacheKey, data);

    if (!persist) return;

    // Best-effort: a full collection can exceed the storage quota (notably
    // localStorage on web). Never let a cache-write failure break the fetch —
    // the collection simply won't be available offline.
    try {
      await updateJSON<BookCache>(DB_KEYS.hadithBookCache, {}, (cache) => {
        cache[cacheKey] = data;
        return cache;
      });
    } catch {
      // storage full / unavailable — skip caching
    }
  },

  /** Clears only the offline collection cache (keeps bookmarks) — for NF-1.14. */
  async clearBookCache(): Promise<void> {
    bookMemory.clear();
    bookStorageLoaded = false;
    await removeKey(DB_KEYS.hadithBookCache);
  },

  async clear(): Promise<void> {
    bookMemory.clear();
    bookStorageLoaded = false;
    await Promise.all([
      bookmarks.clear(),
      removeKey(DB_KEYS.hadithBookmarksUpdatedAt),
      removeKey(DB_KEYS.hadithBookCache),
      removeKey(DB_KEYS.hadithPrefs),
    ]);
  },
};

export type HadithRepositoryType = typeof HadithRepository;
