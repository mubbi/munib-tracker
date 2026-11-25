import { ayahCount, clampPassage, parsePassage } from "@/lib/quran-companion/passage";
import type { Passage } from "@/lib/quran-companion/types";
import { PRONUNCIATION_MODE } from "@/lib/quran-pronunciation/entry";

/**
 * Recite-along (D68): pure helpers behind every "recite along" entry point — the
 * Salah-guide al-Fatihah check, kids recite-along, Friday / Ruqyah / Learn Qur'an
 * buttons. Passages are references only (surah + ayah range); the words are always
 * rendered from the bundled corpus by the practice screens, never typed here.
 */

/** Above this many ayahs a passage is "long": whole-passage takes start in Follow. */
export const LONG_PASSAGE_AYAHS = 20;
/** Size of the sections a long passage is offered in. */
export const SECTION_AYAHS = 10;
/** Route `source` for sessions started from a recite-along entry point. */
export const RECITE_ALONG_SOURCE = "recite-along";

/** Al-Fatihah 1:1–7 — recited in every rakah. */
export const FATIHAH_PASSAGE: Passage = { surah: 1, ayahStart: 1, ayahEnd: 7 };

/** Modes a recite-along button may start (the practice session's own modes). */
export type ReciteAlongMode = "follow" | "check";

export function passageLength(p: Passage): number {
  return Math.max(0, p.ayahEnd - p.ayahStart + 1);
}

export function isLongPassage(p: Passage): boolean {
  return passageLength(p) > LONG_PASSAGE_AYAHS;
}

/** A whole surah as a passage (null for an unknown surah). */
export function wholeSurah(surah: number): Passage | null {
  return parsePassage({ surah, from: 1, to: ayahCount(surah) });
}

/** Consecutive sections of at most `size` ayahs covering the passage, in order. */
export function splitPassage(p: Passage, size: number = SECTION_AYAHS): Passage[] {
  const step = Math.max(1, Math.floor(size));
  const out: Passage[] = [];
  for (let start = p.ayahStart; start <= p.ayahEnd; start += step) {
    out.push({ surah: p.surah, ayahStart: start, ayahEnd: Math.min(p.ayahEnd, start + step - 1) });
  }
  return out;
}

/**
 * The mode a whole-passage session starts in. Correction ("check") is slow to stop
 * on long passages with Tilawa 0.4.0 (D70 known issue), so long passages always
 * start in Follow; a 10-ayah section can still be checked.
 */
export function reciteAlongModeFor(p: Passage, preferred: ReciteAlongMode): ReciteAlongMode {
  return isLongPassage(p) ? "follow" : preferred;
}

/** Content refs (`{ surah, ayahFrom, ayahTo? }`) → a valid passage, clamped to the surah. */
export function passageFromRef(ref: {
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
}): Passage | null {
  return clampPassage({
    surah: ref.surah,
    ayahStart: ref.ayahFrom,
    ayahEnd: ref.ayahTo ?? ref.ayahFrom,
  });
}

/** Valid, de-duplicated passages from content refs (first `max`), in content order. */
export function passagesFromRefs(
  refs: readonly { surah: number; ayahFrom: number; ayahTo?: number }[] | undefined,
  max = 4,
): Passage[] {
  const seen = new Set<string>();
  const out: Passage[] = [];
  for (const ref of refs ?? []) {
    const p = passageFromRef(ref);
    if (!p) continue;
    const key = passageKey(p);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= max) break;
  }
  return out;
}

export function passageKey(p: Passage): string {
  return `${p.surah}:${p.ayahStart}-${p.ayahEnd}`;
}

/** Route `source` for a recite-along take started from a Sunnah habit (D74). */
export const HABIT_RECITE_SOURCE = "habit";

/** Where a recite-along take was started from, beyond the passage itself. */
export type ReciteAlongOrigin = {
  /** D74: the Sunnah habit (e.g. `ayat_kursi_sleep`) — the summary offers "Mark habit done". */
  habitId?: string;
};

/**
 * Practice session route for a recite-along take. With `origin.habitId` the take
 * is a habit's (`source=habit&habit=<id>`); otherwise `source=recite-along`.
 */
export function reciteAlongHref(
  p: Passage,
  mode: ReciteAlongMode | typeof PRONUNCIATION_MODE,
  origin: ReciteAlongOrigin = {},
) {
  const habit = origin.habitId?.trim();
  return {
    pathname: "/quran/practice/session" as const,
    params: {
      surah: String(p.surah),
      from: String(p.ayahStart),
      to: String(p.ayahEnd),
      mode,
      source: habit ? HABIT_RECITE_SOURCE : RECITE_ALONG_SOURCE,
      ...(habit ? { habit } : {}),
    },
  };
}

/**
 * "Check my al-Fatihah": the NF-3.24 skipped-or-unclear-words check where that
 * listener exists on this platform, otherwise the practice Check mode.
 */
export function fatihahCheckHref(pronunciationAvailable: boolean) {
  return reciteAlongHref(FATIHAH_PASSAGE, pronunciationAvailable ? PRONUNCIATION_MODE : "check");
}
