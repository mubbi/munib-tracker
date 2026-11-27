import type {
  AssessmentMode,
  PronunciationThresholds,
  PronunciationWordState,
  WordScore,
} from "./types";

/**
 * Per-word verdict (NF-3.24 step 5). Pure; type-only imports.
 *
 * - **Listen again** when the whole word looks skipped or very unclear (mean GOP
 *   at or below `skip`), in both modes.
 * - **Clear** when every token is at or above `clear`.
 * - **Listen again** (full mode only) when one token is clearly below `listen`
 *   and the word is long enough to judge.
 * - **Not sure** for everything in between, for very short words, and whenever
 *   the evidence is weak. "Not sure" is the default — a false "Listen again" on
 *   a correct word is the error that matters most.
 *
 * The device-local calibration offset (`calibration.ts`) only ever RELAXES the
 * flag thresholds (offset ≤ 0): an accent or a child's voice gets fewer flags,
 * never more.
 */

export const MAX_OFFSET_RELAX = 3;

export function clampCalibrationOffset(offset: number): number {
  if (!Number.isFinite(offset)) return 0;
  return Math.max(-MAX_OFFSET_RELAX, Math.min(0, offset));
}

export function wordVerdict(
  score: WordScore,
  thresholds: PronunciationThresholds,
  mode: AssessmentMode,
  offset = 0,
): PronunciationWordState {
  const relax = clampCalibrationOffset(offset);
  if (score.meanGop <= thresholds.skip + relax && score.chars >= thresholds.minChars) {
    return "listen-again";
  }
  if (score.minGop >= thresholds.clear + relax) return "clear";
  if (
    mode === "full" &&
    score.chars >= thresholds.minChars &&
    score.minGop <= thresholds.listen + relax
  ) {
    return "listen-again";
  }
  return "not-sure";
}

/** Worst-of for one study word covering several engine words. */
const RANK: Record<PronunciationWordState, number> = {
  clear: 0,
  "not-sure": 1,
  "listen-again": 2,
};

export function combineStates(states: readonly PronunciationWordState[]): PronunciationWordState {
  if (!states.length) return "not-sure";
  return states.reduce((a, b) => (RANK[b] > RANK[a] ? b : a));
}

/** Share of words flagged "Listen again" (used by the whole-take fit check). */
export function flaggedShare(states: readonly PronunciationWordState[]): number {
  if (!states.length) return 0;
  return states.filter((s) => s === "listen-again").length / states.length;
}
