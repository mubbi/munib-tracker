import type { Passage, PracticeHistory, PracticeSummary } from "@/lib/quran-companion/types";

import type { PronunciationWordState, StudyWordVerdict } from "./types";

/**
 * Turn a pronunciation-check session into a `PracticeSummary` row inside the
 * existing `quran_practice_sessions` entity (no new entity). It is recorded under
 * the existing `follow` mode — the person read the ayah on screen, nothing was
 * recited from memory — so older clients show it like any follow-along session
 * and the memorisation ladder ignores it (`ladderOutcomes` skips `follow`). The
 * word states go in the optional `pronunciation` field; no audio, GOP values or
 * transcripts are ever stored or synced.
 */

/** Cap on stored word rows per session (keeps the synced blob small). */
export const MAX_STORED_WORDS = 400;

export type PronunciationResults = Record<number, StudyWordVerdict[]>;

export function buildPronunciationSummary(input: {
  id: string;
  passage: Passage;
  results: PronunciationResults;
  startedAt: string;
  endedAt: string;
  engineVersion: string;
  /** Study words per ayah of the passage (for "not reached"). */
  wordCounts: Record<number, number>;
}): PracticeSummary {
  const words: NonNullable<PracticeSummary["pronunciation"]>["words"] = [];
  let clear = 0;
  let unsure = 0;
  let notReached = 0;
  for (let ayah = input.passage.ayahStart; ayah <= input.passage.ayahEnd; ayah++) {
    const verdicts = input.results[ayah];
    if (!verdicts) {
      notReached += input.wordCounts[ayah] ?? 0;
      continue;
    }
    for (const v of verdicts) {
      if (v.state === "clear") clear += 1;
      else unsure += 1;
      if (words.length < MAX_STORED_WORDS) {
        words.push({ surah: input.passage.surah, ayah, word: v.index, state: v.state });
      }
    }
  }
  const start = Date.parse(input.startedAt);
  const end = Date.parse(input.endedAt);
  return {
    id: input.id,
    mode: "follow",
    surah: input.passage.surah,
    ayahStart: input.passage.ayahStart,
    ayahEnd: input.passage.ayahEnd,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationMs: Number.isFinite(end - start) ? Math.max(0, end - start) : 0,
    engine: "tilawa-fastconformer",
    engineVersion: input.engineVersion,
    matched: clear,
    // "Listen again" is not a memorisation mismatch: it is counted with "not sure".
    uncertain: unsure,
    confirmedMismatch: 0,
    corrected: 0,
    notReached,
    weakAyahs: [],
    mismatchesUnconfirmed: true,
    pronunciation: { words },
  };
}

/** True when a stored session row came from a pronunciation check. */
export function isPronunciationSummary(summary: PracticeSummary): boolean {
  return Array.isArray(summary.pronunciation?.words);
}

export function countStates(
  verdicts: readonly StudyWordVerdict[],
): Record<PronunciationWordState, number> {
  const out: Record<PronunciationWordState, number> = {
    clear: 0,
    "listen-again": 0,
    "not-sure": 0,
  };
  for (const v of verdicts) out[v.state] += 1;
  return out;
}

/** Newest-first pronunciation rows of the history (helper for `flagged-words.ts`). */
export function pronunciationSessions(history: PracticeHistory): PracticeSummary[] {
  return history.items
    .filter(isPronunciationSummary)
    .sort((a, b) => (a.endedAt < b.endedAt ? 1 : a.endedAt > b.endedAt ? -1 : 0));
}
