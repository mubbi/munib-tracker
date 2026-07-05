import { createId } from "../id";
import { DB_KEYS } from "../keys";
import { KeyedCollection, readJSON, removeKey, writeJSON } from "../store";

export interface QuranBookmark {
  id: string;
  surah: number;
  ayah: number;
  createdAt: string;
}

export interface QuranLastRead {
  surah: number;
  ayah: number;
  updatedAt: string;
}

export interface QuranPrefs {
  preferredTranslationIds: string[];
  preferredReciterDir: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  script?: "uthmani";
  /** Optional second translation shown side-by-side beneath the first (NF-1.13). */
  secondaryTranslationId?: string;
}

/** Furthest ayah reached per surah. */
export type QuranReadingProgress = Record<number, { furthestAyah: number; updatedAt: string }>;

export const DEFAULT_QURAN_PREFS: QuranPrefs = {
  preferredTranslationIds: ["en-pickthall"],
  preferredReciterDir: "Alafasy_128kbps",
  showTransliteration: true,
  showTranslation: true,
  script: "uthmani",
};

const bookmarks = new KeyedCollection<QuranBookmark>(DB_KEYS.quranBookmarks);

function bookmarkKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

export const QuranRepository = {
  // ── Bookmarks ──────────────────────────────────────────
  async getBookmarks(): Promise<QuranBookmark[]> {
    return (await bookmarks.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async isBookmarked(surah: number, ayah: number): Promise<boolean> {
    return (await bookmarks.get(bookmarkKey(surah, ayah))) != null;
  },

  async toggleBookmark(surah: number, ayah: number): Promise<boolean> {
    const key = bookmarkKey(surah, ayah);
    const existing = await bookmarks.get(key);
    if (existing) {
      await bookmarks.remove(key);
      await this.touchBookmarks();
      return false;
    }
    await bookmarks.upsert(key, {
      id: createId("qbm"),
      surah,
      ayah,
      createdAt: new Date().toISOString(),
    });
    await this.touchBookmarks();
    return true;
  },

  async removeBookmark(surah: number, ayah: number): Promise<void> {
    await bookmarks.remove(bookmarkKey(surah, ayah));
    await this.touchBookmarks();
  },

  // ── Bookmark sync (blob last-write-wins) ───────────────
  /** Stamps the blob-level watermark used for last-write-wins over the set. */
  async touchBookmarks(): Promise<void> {
    await writeJSON(DB_KEYS.quranBookmarksUpdatedAt, new Date().toISOString());
  },

  async getBookmarksUpdatedAt(): Promise<string | undefined> {
    return readJSON<string | undefined>(DB_KEYS.quranBookmarksUpdatedAt, undefined);
  },

  /** Replaces the whole bookmark set with a pulled one, newest-wins on the blob. */
  async applyRemoteBookmarks(incoming: QuranBookmark[], updatedAt?: string): Promise<void> {
    const local = await this.getBookmarksUpdatedAt();
    if (local && updatedAt && local >= updatedAt) return;
    const map: Record<string, QuranBookmark> = {};
    for (const bm of incoming) map[bookmarkKey(bm.surah, bm.ayah)] = bm;
    await writeJSON(DB_KEYS.quranBookmarks, map);
    if (updatedAt) await writeJSON(DB_KEYS.quranBookmarksUpdatedAt, updatedAt);
  },

  // ── Last read ──────────────────────────────────────────
  async getLastRead(): Promise<QuranLastRead | null> {
    return readJSON<QuranLastRead | null>(DB_KEYS.quranLastRead, null);
  },

  async setLastRead(surah: number, ayah: number): Promise<void> {
    await writeJSON(DB_KEYS.quranLastRead, {
      surah,
      ayah,
      updatedAt: new Date().toISOString(),
    } satisfies QuranLastRead);
  },

  /** Applies a pulled last-read position, newest-wins on its own `updatedAt`. */
  async applyRemoteLastRead(incoming: QuranLastRead): Promise<void> {
    const current = await this.getLastRead();
    if (current?.updatedAt && incoming.updatedAt && current.updatedAt >= incoming.updatedAt) {
      return;
    }
    await writeJSON(DB_KEYS.quranLastRead, incoming);
  },

  // ── Reading progress ───────────────────────────────────
  async getReadingProgress(): Promise<QuranReadingProgress> {
    return readJSON<QuranReadingProgress>(DB_KEYS.quranReadingProgress, {});
  },

  async recordProgress(surah: number, ayah: number): Promise<void> {
    const progress = await this.getReadingProgress();
    const existing = progress[surah];
    if (!existing || ayah > existing.furthestAyah) {
      progress[surah] = { furthestAyah: ayah, updatedAt: new Date().toISOString() };
      await writeJSON(DB_KEYS.quranReadingProgress, progress);
    }
  },

  // ── Preferences ────────────────────────────────────────
  async getPrefs(): Promise<QuranPrefs> {
    const stored = await readJSON<Partial<QuranPrefs>>(DB_KEYS.quranPrefs, {});
    return { ...DEFAULT_QURAN_PREFS, ...stored };
  },

  async updatePrefs(patch: Partial<QuranPrefs>): Promise<QuranPrefs> {
    const next = { ...(await this.getPrefs()), ...patch };
    await writeJSON(DB_KEYS.quranPrefs, next);
    return next;
  },

  async clear(): Promise<void> {
    await Promise.all([
      bookmarks.clear(),
      removeKey(DB_KEYS.quranBookmarksUpdatedAt),
      removeKey(DB_KEYS.quranLastRead),
      removeKey(DB_KEYS.quranReadingProgress),
      removeKey(DB_KEYS.quranPrefs),
    ]);
  },
};

export type QuranRepositoryType = typeof QuranRepository;
