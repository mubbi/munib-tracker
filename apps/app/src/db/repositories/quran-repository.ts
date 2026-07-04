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
      return false;
    }
    await bookmarks.upsert(key, {
      id: createId("qbm"),
      surah,
      ayah,
      createdAt: new Date().toISOString(),
    });
    return true;
  },

  async removeBookmark(surah: number, ayah: number): Promise<void> {
    await bookmarks.remove(bookmarkKey(surah, ayah));
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
      removeKey(DB_KEYS.quranLastRead),
      removeKey(DB_KEYS.quranReadingProgress),
      removeKey(DB_KEYS.quranPrefs),
    ]);
  },
};

export type QuranRepositoryType = typeof QuranRepository;
