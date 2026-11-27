import { buildLattice, letterCount, type PieceIndex, withoutOptional } from "./ayah-tokens";
import { type CtcAlignment, forceAlign } from "./ctc-align";
import { wordScores } from "./gop";
import type {
  AssessedWord,
  AssessmentMode,
  AyahAssessment,
  ExpectedAyah,
  LogprobMatrix,
  PronunciationThresholds,
  PronunciationWordState,
  StudyWordVerdict,
  WordScore,
} from "./types";
import { combineStates, flaggedShare, wordVerdict } from "./verdict";

/**
 * The NF-3.24 pipeline after the model, for ONE ayah take (pure):
 *
 *   CTC logprobs → ayah lattice → forced alignment → GOP per piece
 *     → words → calibrated verdict per word (or "couldn't follow this ayah")
 *
 * Optional words (the basmala the model corpus prepends to a surah's first ayah)
 * are tried both ways; the better-fitting alignment wins, and leaving them out is
 * never a flag. Nothing here is stored, logged or reported.
 */

export const FRAME_MS = 80;

export type WordWindow = { startMs: number; endMs: number };

export type AssessInput = {
  matrix: LogprobMatrix;
  expected: ExpectedAyah;
  pieces: PieceIndex;
  thresholds: PronunciationThresholds;
  mode: AssessmentMode;
  /** Device-local calibration offset (≤ 0). */
  offset?: number;
};

/**
 * Where a boundary sits inside the blank gap between two words, from 0 (right
 * after the last spike of the earlier word) to 1 (right at the first spike of
 * the next word). Measured in spike S4 against Quran.com word timings (proof log).
 */
export const BOUNDARY_SPLIT = 0.75;

/**
 * Word time windows from the aligned pieces. CTC pieces are short spikes, so a
 * word's acoustic span is not "first spike → last spike": each boundary is put
 * inside the gap between one word's last spike and the next word's first spike
 * ({@link BOUNDARY_SPLIT}), with a frame of padding at the ends of the take.
 */
export function wordWindows(
  scores: readonly WordScore[],
  timeSteps: number,
  split = BOUNDARY_SPLIT,
): WordWindow[] {
  const boundary = (a: WordScore, b: WordScore) =>
    a.endFrame + 1 + split * Math.max(0, b.startFrame - (a.endFrame + 1));
  return scores.map((score, i) => {
    const prev = scores[i - 1];
    const next = scores[i + 1];
    const startFrame = prev ? boundary(prev, score) : Math.max(0, score.startFrame - 1);
    const endFrame = next ? boundary(score, next) : Math.min(timeSteps, score.endFrame + 2);
    return {
      startMs: Math.round(startFrame * FRAME_MS),
      endMs: Math.round(Math.max(startFrame + 1, endFrame) * FRAME_MS),
    };
  });
}

export type AssessDetail = {
  assessment: AyahAssessment;
  /** Per-score time windows in the take (ms). */
  windows: WordWindow[];
  /** Evidence for the eval script and tests only — never persisted. */
  scores: WordScore[];
  alignment: CtcAlignment | null;
  /** Engine word index for each score (skipped optional words are absent). */
  engineWords: number[];
};

type Candidate = { alignment: CtcAlignment; scores: WordScore[]; engineWords: number[] };

function align(input: AssessInput, expected: ExpectedAyah, engineWords: number[]) {
  const lattice = buildLattice(expected.words, input.pieces);
  if (!lattice) return "no-text" as const;
  const alignment = forceAlign(input.matrix, lattice, input.pieces);
  if (!alignment) return null;
  const scores = wordScores(
    input.matrix,
    expected.words,
    lattice,
    alignment,
    input.pieces,
    letterCount,
  );
  return { alignment, scores, engineWords } satisfies Candidate;
}

export function assessAyahDetailed(input: AssessInput): AssessDetail {
  const all = input.expected.words.map((_, i) => i);
  const empty = { scores: [], windows: [], alignment: null, engineWords: [] };
  const attempts = [align(input, input.expected, all)];
  if (input.expected.words.some((w) => w.optional)) {
    const trimmed = withoutOptional(input.expected);
    attempts.push(align(input, trimmed.ayah, trimmed.original));
  }
  const candidates = attempts.filter((c): c is Candidate => c != null && c !== "no-text");
  if (!candidates.length) {
    const reason = attempts.every((c) => c === "no-text") ? "no-text" : "too-short";
    return { ...empty, assessment: { status: "no-fit", reason } };
  }
  const best = candidates.reduce((a, b) => (b.alignment.score > a.alignment.score ? b : a));
  const { thresholds, mode } = input;
  const windows = wordWindows(best.scores, best.alignment.timeSteps);
  const detail = {
    scores: best.scores,
    windows,
    alignment: best.alignment,
    engineWords: best.engineWords,
  };

  if (best.alignment.score < thresholds.fitMin) {
    return { ...detail, assessment: { status: "no-fit", reason: "different-passage" } };
  }
  const states = best.scores.map((score) => wordVerdict(score, thresholds, mode, input.offset));
  // Verdicts for optional words never count (they are not on screen).
  const shown = states.filter((_, i) => !input.expected.words[best.engineWords[i]]?.optional);
  if (flaggedShare(shown) > thresholds.maxFlaggedShare) {
    return { ...detail, assessment: { status: "no-fit", reason: "too-many-flags" } };
  }
  const words: AssessedWord[] = best.scores.map((_, i) => ({
    word: best.engineWords[i],
    state: states[i],
    startMs: windows[i].startMs,
    endMs: windows[i].endMs,
  }));
  return { ...detail, assessment: { status: "ok", mode, words } };
}

export function assessAyah(input: AssessInput): AyahAssessment {
  return assessAyahDetailed(input).assessment;
}

/**
 * Map engine-word verdicts onto the study words the screen shows
 * (`alignPracticeWords(...).studyToEngine`, which handles the known joins and
 * splits). A study word takes the worst state of the engine words covering it;
 * a study word no aligned engine word covers stays "Not sure" — never a guessed
 * flag.
 */
export function toStudyVerdicts(
  assessment: Extract<AyahAssessment, { status: "ok" }>,
  studyToEngine: readonly (readonly number[])[],
): StudyWordVerdict[] {
  const byEngine = new Map<number, AssessedWord>();
  for (const word of assessment.words) byEngine.set(word.word, word);
  return studyToEngine.map((engine, index) => {
    const covered = engine.map((e) => byEngine.get(e)).filter((w): w is AssessedWord => !!w);
    if (!covered.length) return { index, state: "not-sure" as PronunciationWordState };
    return {
      index,
      state: combineStates(covered.map((w) => w.state)),
      startMs: Math.min(...covered.map((w) => w.startMs)),
      endMs: Math.max(...covered.map((w) => w.endMs)),
    };
  });
}
