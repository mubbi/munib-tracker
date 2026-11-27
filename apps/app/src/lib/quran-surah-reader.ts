/**
 * Pure rules behind the ayah-by-ayah surah reader (`app/quran/[surah].tsx`):
 * row lookup, audio ↔ surah matching, viewport → resume point, edition fallback,
 * hifz confirm copy and SEO copy. Kept React-free so every rule is unit tested.
 *
 * Imports `quran-meta` only (never `@/lib/quran`) so this stays out of the ayah JSON graph.
 */
import type { Ayah, Surah } from "@munib-tracker/shared/types";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";
import type { HifzStatus } from "@/stores/hifz-store";

/**
 * Row index of a `surah:ayah` key in this surah's ayah list, or -1. Ayahs are
 * contiguous from 1, so `ayah - 1` is tried first; gaps fall back to a search.
 */
export function ayahIndexForKey(
  ayahs: ReadonlyArray<Pick<Ayah, "ayah">>,
  surahNumber: number,
  key: string,
): number {
  const [surahPart, ayahPart] = key.split(":");
  if (Number(surahPart) !== surahNumber) return -1;
  const ayahNumber = Number(ayahPart);
  if (!Number.isFinite(ayahNumber)) return -1;
  const guess = ayahNumber - 1;
  if (ayahs[guess]?.ayah === ayahNumber) return guess;
  return ayahs.findIndex((a) => a.ayah === ayahNumber);
}

/** The player's track id (`surah:ayah`) when it belongs to this surah, else `undefined`. */
export function surahAudioKey(
  currentAudioId: string | undefined,
  surahNumber: number,
): string | undefined {
  return currentAudioId?.startsWith(`${surahNumber}:`) === true ? currentAudioId : undefined;
}

/** Ayah number of a `surah:ayah` key, or `null` when there is no key. */
export function ayahNumberFromKey(key: string | undefined): number | null {
  return key ? Number(key.split(":")[1]) : null;
}

/** Lowest / highest row index among viewable list tokens, or `null` when none has an index. */
export function viewableIndexRange(
  tokens: ReadonlyArray<{ index?: number | null }>,
): { min: number; max: number } | null {
  let max = -1;
  let min = Number.POSITIVE_INFINITY;
  for (const token of tokens) {
    if (token.index == null) continue;
    if (token.index > max) max = token.index;
    if (token.index < min) min = token.index;
  }
  return max >= 0 ? { min, max } : null;
}

/** 0→1 reading progress for the furthest row on screen (index-based, not pixel-based). */
export function readingProgressForIndex(maxIndex: number, total: number): number {
  return Math.min(1, Math.max(0, maxIndex / (total - 1)));
}

/**
 * Whether the settled top-most ayah should become the new resume point.
 * Skipped while this surah's audio plays (the player records its own position),
 * and never walks backward until the user has actually moved the list — a
 * deep-link / continue scroll often peeks the previous ayah as top-most.
 */
export function shouldPersistResumeAyah(input: {
  ayah: number | null;
  lastRecorded: number;
  audioActive: boolean;
  userMoved: boolean;
}): boolean {
  const { ayah, lastRecorded, audioActive, userMoved } = input;
  if (ayah == null || ayah === lastRecorded) return false;
  if (audioActive) return false;
  if (ayah < lastRecorded && !userMoved) return false;
  return true;
}

/** NF-3.22: the deep-linked word follows the ayah flash (cleared with it). */
export function focusWordTarget(
  focusHighlightAyah: number | undefined,
  focusAyah: number | undefined,
  focusWordNumber: number | undefined,
): { ayah: number; index: number } | null {
  return focusHighlightAyah != null &&
    focusHighlightAyah === focusAyah &&
    focusWordNumber != null &&
    focusWordNumber >= 1
    ? { ayah: focusHighlightAyah, index: focusWordNumber - 1 }
    : null;
}

function isKnownTranslation(id: string): boolean {
  return ALL_QURAN_TRANSLATIONS.some((e) => e.id === id);
}

/** The primary translation to show: the preferred one when it exists, else the locale default. */
export function resolvePrimaryEditionId(requested: string | undefined, fallbackId: string): string {
  const id = requested ?? fallbackId;
  return isKnownTranslation(id) ? id : fallbackId;
}

/** NF-1.13 side-by-side translation: a known edition other than the primary, else none. */
export function resolveSecondaryEditionId(
  secondaryId: string | undefined,
  primaryId: string,
): string | undefined {
  return secondaryId && secondaryId !== primaryId && isKnownTranslation(secondaryId)
    ? secondaryId
    : undefined;
}

/** i18n keys for the hifz confirm dialog, by the status the tap would move the ayah to. */
export function hifzConfirmCopyKeys(next: HifzStatus | null): {
  bodyKey: string;
  confirmKey: string;
  destructive: boolean;
} {
  if (next === "review") {
    return { bodyKey: "hifz.confirmReviewBody", confirmKey: "hifz.markReview", destructive: false };
  }
  if (next === "memorized") {
    return {
      bodyKey: "hifz.confirmMemorizedBody",
      confirmKey: "hifz.markMemorized",
      destructive: false,
    };
  }
  return { bodyKey: "hifz.confirmClearBody", confirmKey: "hifz.clear", destructive: true };
}

/** Crawlable `<head>` copy for one surah page (English, like the SEO registry). */
export function surahSeoCopy(
  surah: Pick<
    Surah,
    "number" | "nameTransliteration" | "nameEnglish" | "ayahCount" | "revelationPlace"
  >,
  labels: { home: string; quran: string },
): {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  breadcrumbs: Array<{ name: string; path: string }>;
} {
  const path = `/quran/${surah.number}`;
  const revelation = surah.revelationPlace === "makkah" ? "Makkah" : "Madinah";
  return {
    path,
    title: `Surah ${surah.nameTransliteration} — ${surah.nameEnglish}`,
    description: `Read and listen to Surah ${surah.nameTransliteration} (${surah.nameEnglish}), chapter ${surah.number} of the Qur'an — ${surah.ayahCount} ayahs, revealed in ${revelation}. Arabic text, transliteration, translation, and recitation, offline.`,
    keywords: [
      `Surah ${surah.nameTransliteration}`,
      surah.nameEnglish,
      `surah ${surah.number}`,
      "read Quran online",
    ],
    breadcrumbs: [
      { name: labels.home, path: "/" },
      { name: labels.quran, path: "/quran" },
      { name: surah.nameTransliteration, path },
    ],
  };
}
