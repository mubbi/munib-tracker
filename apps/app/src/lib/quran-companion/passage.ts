import { getPageForAyah, getPageList, getSurahByNumber } from "@/lib/quran-meta";

import type { Passage, PracticeMode, RangePreset, SessionMode } from "./types";

/**
 * Surah/ayah range helpers on top of `quran-meta` (no ayah JSON). A passage
 * never crosses a surah boundary (D10). Invalid input → `null` so routes can fall
 * back to the hub instead of crashing.
 */

export function ayahCount(surah: number): number {
  return getSurahByNumber(surah)?.ayahCount ?? 0;
}

function toInt(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isInteger(n) ? n : null;
}

/** Validate raw route params into a passage. */
export function parsePassage(params: {
  surah?: unknown;
  from?: unknown;
  to?: unknown;
}): Passage | null {
  const surah = toInt(params.surah);
  if (surah == null || surah < 1 || surah > 114) return null;
  const count = ayahCount(surah);
  if (count < 1) return null;
  const from = toInt(params.from) ?? 1;
  const to = toInt(params.to) ?? from;
  if (from < 1 || from > count || to < from) return null;
  return { surah, ayahStart: from, ayahEnd: Math.min(to, count) };
}

/** Clamp a passage into its surah; returns null when nothing valid remains. */
export function clampPassage(p: Passage): Passage | null {
  return parsePassage({ surah: p.surah, from: p.ayahStart, to: p.ayahEnd });
}

/** Ayah numbers in a passage, in order. */
export function passageAyahs(p: Passage): number[] {
  const out: number[] = [];
  for (let a = p.ayahStart; a <= p.ayahEnd; a++) out.push(a);
  return out;
}

/** Ayahs on a mushaf page that belong to `surah` (for the "This page" preset). */
export function pageRangeInSurah(surah: number, page: number): Passage | null {
  const count = ayahCount(surah);
  if (count < 1) return null;
  let start: number | null = null;
  let end: number | null = null;
  for (let a = 1; a <= count; a++) {
    const p = getPageForAyah(surah, a);
    if (p === page) {
      if (start == null) start = a;
      end = a;
    } else if (start != null) {
      break;
    }
  }
  return start != null && end != null ? { surah, ayahStart: start, ayahEnd: end } : null;
}

/** Build a passage from a range preset anchored at `surah:ayah`. */
export function passageForPreset(
  preset: RangePreset,
  surah: number,
  ayah: number,
  page?: number | null,
): Passage | null {
  const count = ayahCount(surah);
  if (count < 1) return null;
  const start = Math.min(Math.max(1, ayah), count);
  switch (preset) {
    case "ayah":
      return { surah, ayahStart: start, ayahEnd: start };
    case "next5":
      return { surah, ayahStart: start, ayahEnd: Math.min(count, start + 4) };
    case "surah":
      return { surah, ayahStart: 1, ayahEnd: count };
    case "page": {
      const p = page ?? getPageForAyah(surah, start);
      return pageRangeInSurah(surah, p) ?? { surah, ayahStart: start, ayahEnd: start };
    }
    default:
      return null;
  }
}

export function isPracticeMode(value: unknown): value is PracticeMode {
  return (
    value === "follow" || value === "check" || value === "hide-words" || value === "hide-ayahs"
  );
}

export function isSessionMode(value: unknown): value is SessionMode {
  return isPracticeMode(value) || value === "revision";
}

/** True when a mode needs the listener to mark words (§9.1). */
export function modeNeedsListener(mode: SessionMode): boolean {
  return mode !== "follow";
}

/** Total pages, re-exported for the range pill logic. */
export function totalPages(): number {
  return getPageList().length;
}
