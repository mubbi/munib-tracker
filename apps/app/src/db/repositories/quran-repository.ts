import type {
  QuranReaderLayout,
  QuranRepeatMode,
  QuranTranslationAudio,
} from "@munib-tracker/shared/types";

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
  page?: number;
  updatedAt: string;
}

export interface QuranPrefs {
  preferredTranslationIds: string[];
  preferredReciterDir: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  /** Word-by-word glosses under each ayah (NF-2.7, cache-first from api.quran.com). */
  showWordByWord?: boolean;
  /** Colored tajweed markup for Arabic lines (cache-first from api.alquran.cloud). */
  showTajweed?: boolean;
  script?: "uthmani";
  /** Optional second translation shown side-by-side beneath the first (NF-1.13). */
  secondaryTranslationId?: string;
  /**
   * On-demand tafsir edition id (`spa5k` / fawaz Siraj). Empty / unset = none
   * selected until the user picks one (NF-1.10).
   */
  preferredTafsirId?: string;
  /** Reader layout: ayah cards, page view, or mushaf lines (NF-1.11). */
  readerLayout?: QuranReaderLayout;
  /** Speak translation after each Arabic ayah via native TTS. */
  translationAudio?: QuranTranslationAudio;
  /** Repeat plan for ayah-study playback. */
  repeatMode?: QuranRepeatMode;
  /** Inclusive ayah range when `repeatMode` is `"range"`. */
  repeatRange?: { start: number; end: number };
  /** Preferred TTS voice identifier per BCP-47 language tag. */
  ttsVoiceByLang?: Record<string, string>;
}

/** Furthest ayah reached per surah. */
export type QuranReadingProgress = Record<number, { furthestAyah: number; updatedAt: string }>;

export const DEFAULT_QURAN_PREFS: QuranPrefs = {
  preferredTranslationIds: ["en-pickthall"],
  preferredReciterDir: "Alafasy_128kbps",
  showTransliteration: true,
  showTranslation: true,
  showWordByWord: false,
  showTajweed: false,
  script: "uthmani",
  readerLayout: "ayah",
  translationAudio: "off",
  repeatMode: "off",
  ttsVoiceByLang: {},
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

  /** Per-item LWW union merge from remote; deletes still need tombstones later. */
  async applyRemoteBookmarks(incoming: QuranBookmark[], updatedAt?: string): Promise<void> {
    const localMap = await bookmarks.getMap();
    const localUpdatedAt = await this.getBookmarksUpdatedAt();
    const merged: Record<string, QuranBookmark> = { ...localMap };
    for (const bm of incoming) {
      const key = bookmarkKey(bm.surah, bm.ayah);
      const existing = merged[key];
      if (!existing || bm.createdAt > existing.createdAt) {
        merged[key] = bm;
      }
    }
    await writeJSON(DB_KEYS.quranBookmarks, merged);
    if (updatedAt) {
      const watermark = localUpdatedAt && localUpdatedAt > updatedAt ? localUpdatedAt : updatedAt;
      await writeJSON(DB_KEYS.quranBookmarksUpdatedAt, watermark);
    }
  },

  // ── Last read ──────────────────────────────────────────
  async getLastRead(): Promise<QuranLastRead | null> {
    return readJSON<QuranLastRead | null>(DB_KEYS.quranLastRead, null);
  },

  async setLastRead(surah: number, ayah: number, page?: number): Promise<void> {
    await writeJSON(DB_KEYS.quranLastRead, {
      surah,
      ayah,
      page,
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
