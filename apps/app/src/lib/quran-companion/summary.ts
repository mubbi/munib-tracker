import { createId } from "@/db/id";
import { creditableSessionAyahs } from "./reading-credit";
import {
  type AyahPracticeState,
  ayahOutcome,
  countWords,
  type SessionState,
  type WordCounts,
} from "./reduce-session";
import type { AyahOutcome, EngineId, Passage, PracticeSummary, SessionMode } from "./types";

/** Ayahs that were shown in the session (visited), in order. */
export function visitedAyahs(state: SessionState, visited: Set<number>): AyahPracticeState[] {
  return [...visited]
    .sort((a, b) => a - b)
    .map((ayah) => state.ayahs[ayah])
    .filter((a): a is AyahPracticeState => !!a);
}

/**
 * Build the stored summary (§8 Session reducer). Counts only — never words,
 * transcript, or audio. Listen-only sessions report zero counts and no weak ayahs
 * (they say the person listened, and do not move the ladder).
 */
export function buildPracticeSummary(input: {
  state: SessionState;
  visited: Set<number>;
  passage: Passage;
  mode: SessionMode;
  startedAt: Date;
  endedAt: Date;
  engine: EngineId | "none";
  engineVersion: string;
  confirmsMismatches: boolean;
}): PracticeSummary {
  const totals: WordCounts = {
    matched: 0,
    uncertain: 0,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 0,
  };
  const withMismatch: number[] = [];
  const withUncertain: number[] = [];
  const listened = input.engine === "none";
  for (const a of visitedAyahs(input.state, input.visited)) {
    if (listened || a.takes === 0) continue;
    const c = countWords(a);
    totals.matched += c.matched;
    totals.uncertain += c.uncertain;
    totals.confirmedMismatch += c.confirmedMismatch;
    totals.corrected += c.corrected;
    totals.notReached += c.notReached;
    if (c.confirmedMismatch > 0) withMismatch.push(a.ayah);
    else if (c.uncertain > 0) withUncertain.push(a.ayah);
  }
  return {
    id: createId(),
    mode: input.mode,
    surah: input.passage.surah,
    ayahStart: input.passage.ayahStart,
    ayahEnd: input.passage.ayahEnd,
    startedAt: input.startedAt.toISOString(),
    endedAt: input.endedAt.toISOString(),
    durationMs: Math.max(0, input.endedAt.getTime() - input.startedAt.getTime()),
    engine: input.engine,
    engineVersion: input.engineVersion,
    ...totals,
    weakAyahs: withMismatch.length ? withMismatch : withUncertain,
    ...(input.confirmsMismatches ? {} : { mismatchesUnconfirmed: true }),
    // D68: ayahs heard well enough to count toward the reading log / khatm.
    heardAyahs: creditableSessionAyahs(input.state, input.visited, !listened),
  };
}

/** Ladder outcomes for a finished session (D8: Follow never writes; D9: listen-only never writes). */
export function ladderOutcomes(input: {
  state: SessionState;
  visited: Set<number>;
  surah: number;
  mode: SessionMode;
  engineRan: boolean;
}): { surah: number; ayah: number; outcome: AyahOutcome }[] {
  if (!input.engineRan || input.mode === "follow") return [];
  return (
    visitedAyahs(input.state, input.visited)
      .filter((a) => a.takes > 0)
      // Neutral outcomes still record the attempt (and create the record on first practice).
      .map((a) => ({ surah: input.surah, ayah: a.ayah, outcome: ayahOutcome(a) }))
  );
}
