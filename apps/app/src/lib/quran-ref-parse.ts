import { ayahCount, parsePassage } from "@/lib/quran-companion/passage";
import type { Passage } from "@/lib/quran-companion/types";
import { GLOBAL_OFFSETS, JUZ_STARTS, pageToStartAyah, QURAN_TOTAL_PAGES } from "@/lib/quran-meta";

/**
 * Pure helpers that turn the references the app already shows (a dua's
 * "Quran 2:201", a khatm portion, a juz, a group-khatm part) into a recite-along
 * passage (D68). A passage never crosses a surah boundary (D10), so spans that
 * do (a juz, a day's khatm portion) start at their first ayah and stop at the
 * end of that surah. Nothing here reads ayah text.
 */

export type AyahRef = { surah: number; ayah: number };

/** Total ayahs in the Qur'an (Hafs): the end of the last surah. */
const QURAN_TOTAL_AYAHS = GLOBAL_OFFSETS[114] + ayahCount(114);

/**
 * A leading Qur'an citation — `Quran 2:201`, `Qur'an 7:23`, `Quran 2:285-286`,
 * optionally followed by other sources (`Quran 21:87 · Tirmidhi`). Only the
 * first segment is read; anything else (a hadith-only reference) → `null`.
 */
const QURAN_REF = /^\s*qur[’']?an\s+(\d{1,3})\s*:\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?(?!\d)/i;

export function parseQuranReference(reference: string | null | undefined): Passage | null {
  if (!reference) return null;
  const match = QURAN_REF.exec(reference);
  if (!match) return null;
  const surah = Number(match[1]);
  const from = Number(match[2]);
  const to = match[3] != null ? Number(match[3]) : from;
  if (to < from) return null;
  const passage = parsePassage({ surah, from, to });
  // A citation past the surah's end is a typo, not "clamp to the last ayah".
  return passage && passage.ayahEnd === to ? passage : null;
}

/** 1-based global ayah number (1…6236) → surah:ayah, or `null` when out of range. */
export function globalAyahToRef(global: number): AyahRef | null {
  if (!Number.isInteger(global) || global < 1 || global > QURAN_TOTAL_AYAHS) return null;
  for (let surah = 114; surah >= 1; surah--) {
    const offset = GLOBAL_OFFSETS[surah] ?? 0;
    if (global > offset) return { surah, ayah: global - offset };
  }
  return null;
}

/**
 * The part of the span `[start, endExclusive)` that lies in `start`'s surah.
 * `endExclusive` null (or in a later surah) → to the end of that surah.
 */
export function passageInSpan(start: AyahRef, endExclusive?: AyahRef | null): Passage | null {
  const count = ayahCount(start.surah);
  if (count < 1 || start.ayah < 1 || start.ayah > count) return null;
  const end = endExclusive && endExclusive.surah === start.surah ? endExclusive.ayah - 1 : count;
  if (end < start.ayah) return null;
  return { surah: start.surah, ayahStart: start.ayah, ayahEnd: Math.min(end, count) };
}

/** Where to recite along in a juz: from its first ayah to the end of that surah's share. */
export function juzPassage(juz: number): Passage | null {
  const start = JUZ_STARTS[juz - 1];
  if (!start) return null;
  const next = JUZ_STARTS[juz];
  return passageInSpan(
    { surah: start[0], ayah: start[1] },
    next ? { surah: next[0], ayah: next[1] } : null,
  );
}

/**
 * Today's khatm portion as a passage: from the next unread ayah (or the first
 * ayah of the next unread page) up to today's target, stopping at the end of
 * that surah. `read` and `target` are in the plan's unit. `null` once finished.
 */
export function khatmPortionPassage(
  unit: "ayah" | "page",
  read: number,
  target: number,
): Passage | null {
  const amount = Math.max(1, Math.floor(target));
  const done = Math.max(0, Math.floor(read));
  if (unit === "page") {
    const firstPage = done + 1;
    if (firstPage > QURAN_TOTAL_PAGES) return null;
    const start = pageToStartAyah(firstPage);
    if (!start) return null;
    const afterLast = Math.min(QURAN_TOTAL_PAGES, done + amount) + 1;
    const next = afterLast <= QURAN_TOTAL_PAGES ? pageToStartAyah(afterLast) : undefined;
    return passageInSpan(start, next ?? null);
  }
  const start = globalAyahToRef(done + 1);
  if (!start) return null;
  const last = globalAyahToRef(Math.min(QURAN_TOTAL_AYAHS, done + amount));
  return passageInSpan(start, last ? { surah: last.surah, ayah: last.ayah + 1 } : null);
}

/**
 * A group-khatm part (juz / hizb / surah) as a passage, given where it starts
 * and where the next part starts (`null` for the last part).
 */
export function partPassage(start: AyahRef | null, nextStart: AyahRef | null): Passage | null {
  if (!start) return null;
  return passageInSpan(start, nextStart);
}
