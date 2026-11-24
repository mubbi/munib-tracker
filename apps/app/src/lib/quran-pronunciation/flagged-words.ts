import type { PracticeHistory } from "@/lib/quran-companion/types";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";

import { PINNED_CALIBRATION } from "./calibration";
import { pronunciationSessions } from "./summary";
import type { StudyWordVerdict } from "./types";

/**
 * NF-3.24 → NF-3.15 hand-off (D20, D25). Words a pronunciation check marked
 * "Listen again" feed the tajweed coaching plan automatically as example words,
 * unless the person turned `companion.feedCoachingFromAssessment` off.
 *
 * Public API for NF-3.15:
 * - `getFlaggedWords(options?)` — recent flagged words (newest first, de-duplicated),
 *   `[]` when the feed is off. Word indexes are 0-based study words (Quran.com
 *   word order), the same as the practice row and `api/quran-words.ts`.
 * - `getWordWindows(surah, ayah)` — per-word time windows inside the person's
 *   LAST take of that ayah (ms), from our own forced alignment. Memory only: the
 *   take itself is never stored, and the windows are dropped when the check
 *   screen closes (`clearWordWindows`).
 * - `alignmentBoundaryReliable()` — whether spike S4 met its word-boundary gate.
 *   When false, NF-3.15 Phase B falls back to its Phase A cards (D24).
 *
 * This is never a tajweed judgement: a flagged word means "worth listening to
 * again", nothing more.
 */

export type FlaggedWord = {
  surah: number;
  ayah: number;
  /** 0-based study word index. */
  word: number;
  /** When the check that flagged it ended (ISO). */
  at: string;
};

export type FlaggedWordsOptions = {
  /** Most words returned (default 30). */
  limit?: number;
  /** Only checks that ended at or after this ISO time. */
  since?: string;
};

/** Pure: flagged words from a practice history, newest first, one per (surah, ayah, word). */
export function flaggedWordsFromHistory(
  history: PracticeHistory,
  options: FlaggedWordsOptions = {},
): FlaggedWord[] {
  const limit = options.limit ?? 30;
  const seen = new Set<string>();
  const out: FlaggedWord[] = [];
  for (const session of pronunciationSessions(history)) {
    if (options.since && session.endedAt < options.since) continue;
    for (const w of session.pronunciation?.words ?? []) {
      if (w.state !== "listen-again") continue;
      const key = `${w.surah}:${w.ayah}:${w.word}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ surah: w.surah, ayah: w.ayah, word: w.word, at: session.endedAt });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export function isCoachingFeedEnabled(): boolean {
  return quranCompanionPrefsStore.getState().prefs.feedCoachingFromAssessment !== false;
}

/** Recent "Listen again" words for NF-3.15 coaching; `[]` when the person opted out. */
export function getFlaggedWords(options: FlaggedWordsOptions = {}): FlaggedWord[] {
  if (!isCoachingFeedEnabled()) return [];
  return flaggedWordsFromHistory(quranPracticeStore.getState().history, options);
}

/** Same as {@link getFlaggedWords}, loading the (lazy) practice stores first. */
export async function loadFlaggedWords(options: FlaggedWordsOptions = {}): Promise<FlaggedWord[]> {
  if (!quranCompanionPrefsStore.getState().isReady)
    await quranCompanionPrefsStore.getState().load();
  if (!quranPracticeStore.getState().isReady) await quranPracticeStore.getState().load();
  return getFlaggedWords(options);
}

export type WordWindow = { word: number; startMs: number; endMs: number };

const windows = new Map<string, WordWindow[]>();

/** Called by the check screen after each assessed take (replaces that ayah's windows). */
export function rememberWordWindows(
  surah: number,
  ayah: number,
  verdicts: readonly StudyWordVerdict[],
): void {
  const list: WordWindow[] = [];
  for (const v of verdicts) {
    if (v.startMs == null || v.endMs == null) continue;
    list.push({ word: v.index, startMs: v.startMs, endMs: v.endMs });
  }
  windows.set(`${surah}:${ayah}`, list);
}

/** Word windows of the person's last take of this ayah in this screen session, or null. */
export function getWordWindows(surah: number, ayah: number): WordWindow[] | null {
  return windows.get(`${surah}:${ayah}`) ?? null;
}

/** Drop every in-memory window (the check screen closed). */
export function clearWordWindows(): void {
  windows.clear();
}

export function alignmentBoundaryReliable(): boolean {
  const p90 = PINNED_CALIBRATION.gate.boundaryP90Ms;
  return p90 != null && p90 <= 80;
}
