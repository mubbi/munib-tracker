import { KIDS_SURAHS } from "@/lib/circles/kids-content";
import { creditableSessionAyahs } from "@/lib/quran-companion/reading-credit";
import type { SessionState } from "@/lib/quran-companion/reduce-session";
import type { WordState } from "@/lib/quran-companion/types";

/**
 * Kids recite-along (D27 + D68): the curated short surahs, and the gentle word
 * feedback a child sees — no scores, no grades, no streaks. "Try that word
 * again" is amber at most, never red.
 */

/** The curated kids surahs (D27) offered for recite-along — the same set as the Learn tab. */
export const KIDS_RECITE_SURAHS: readonly number[] = KIDS_SURAHS;

/** Route param → a curated kids surah, or null (never a surah outside the set). */
export function parseKidsReciteSurah(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isInteger(n) && KIDS_RECITE_SURAHS.includes(n) ? n : null;
}

/**
 * Words a child is gently asked to try again once an ayah settles: ones the
 * listener marked as a mismatch, or never reached (skipped). "Not sure" words are
 * left alone — kids mode never nags on a maybe. No listener alignment → nothing.
 */
export function kidsWordsToTryAgain(ayah: {
  alignment: unknown;
  states: readonly WordState[];
  takes: number;
}): number[] {
  if (!ayah.alignment || ayah.takes === 0) return [];
  const out: number[] = [];
  ayah.states.forEach((s, i) => {
    if (s === "confirmedMismatch" || s === "upcoming") out.push(i);
  });
  return out;
}

/** Every word of the ayah was heard (matched or self-corrected). */
export function kidsAyahHeard(ayah: {
  alignment: unknown;
  states: readonly WordState[];
  takes: number;
}): boolean {
  return (
    !!ayah.alignment &&
    ayah.takes > 0 &&
    ayah.states.length > 0 &&
    ayah.states.every((s) => s === "matched" || s === "corrected")
  );
}

/**
 * What the word row shows a child: a word the listener flagged reads as a gentle
 * amber "not sure" nudge instead of a red mistake, and never while reciting.
 */
export function kidsDisplayStates(states: readonly WordState[], reciting: boolean): WordState[] {
  return states.map((s) => (s === "confirmedMismatch" ? (reciting ? "upcoming" : "uncertain") : s));
}

/** The ayah a child finishes on: the passage is done once its last ayah has a settled take. */
export function kidsReciteFinished(input: {
  index: number;
  total: number;
  lastSettled: boolean;
}): boolean {
  return input.total > 0 && input.index >= input.total - 1 && input.lastSettled;
}

/**
 * D73: ayahs of a kids recite-along that newly earn the device's daily reading
 * log — settled ayahs the listener heard (≥ ⅔ of the words, the practice rule in
 * `reading-credit.ts`) that this kids session hasn't logged yet (`already`).
 * Never khatm, never practice history; nothing is shown to the child.
 */
export function kidsNewlyCreditedAyahs(input: {
  session: SessionState;
  settled: Iterable<number>;
  engineRan: boolean;
  already: ReadonlySet<number>;
}): number[] {
  return creditableSessionAyahs(input.session, input.settled, input.engineRan).filter(
    (a) => !input.already.has(a),
  );
}
