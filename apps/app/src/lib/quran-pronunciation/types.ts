/**
 * NF-3.24 Qur'an pronunciation assessment — shared types.
 *
 * Pure type module (no runtime imports) so the local eval script
 * (`scripts/quran-pronunciation-eval.mjs`) can load the logic files directly.
 */

/**
 * The only three states a word can get (D20). There is no score, percentage or
 * grade, and nothing is ever called "correct" or "wrong".
 */
export type PronunciationWordState = "clear" | "listen-again" | "not-sure";

/**
 * `full` = Clear / Listen again / Not sure per word (spike S3 passed).
 * `skipped-only` = the D24 fallback: only words that look skipped or very unclear
 * are flagged ("Skipped or unclear"); everything else is "Heard" or "Not sure".
 */
export type AssessmentMode = "full" | "skipped-only";

/** CTC log-probabilities in row-major order: `logprobs[t * vocabSize + v]`. */
export type LogprobMatrix = {
  logprobs: Float32Array | ArrayLike<number>;
  timeSteps: number;
  vocabSize: number;
};

/** One engine word: a `text_clean` word of the model's pinned corpus. */
export type ExpectedWord = {
  text: string;
  /**
   * A word the reciter may leave out without it being a skip — the basmala the
   * model's corpus prepends to the first ayah of a surah (the bundled text and
   * the study row never show it).
   */
  optional?: boolean;
};

export type ExpectedAyah = {
  surah: number;
  ayah: number;
  words: ExpectedWord[];
};

/**
 * The ayah's folded match text and every vocab piece that matches it
 * (`[position, pieceId, length]`), so the aligner accepts any segmentation.
 */
export type AyahLattice = {
  text: string;
  /** Text position where each word (its leading space) starts. */
  wordStarts: number[];
  edges: [number, number, number][];
};

export type SpotterVocabIds = {
  blankId: number;
  /** Pure-harakat pieces: allowed anywhere a blank is (the model emits both forms). */
  fillers: readonly number[];
};

/** Per-word evidence from alignment + GOP. Never stored, synced or logged. */
export type WordScore = {
  /** Engine word index inside `ExpectedAyah.words` (optional words included). */
  word: number;
  /** Goodness of pronunciation per emitted piece (mean log-posterior margin, clipped). */
  gops: number[];
  minGop: number;
  meanGop: number;
  /** Aligned frames, first token start → last token end (inclusive). */
  startFrame: number;
  endFrame: number;
  /** Folded letters in the word (very short words are never flagged). */
  chars: number;
};

export type PronunciationThresholds = {
  /** Every piece at or above this → Clear. */
  clear: number;
  /** A piece at or below this → Listen again (full mode only). */
  listen: number;
  /** The word's mean GOP at or below this → Listen again / "skipped or unclear" (both modes). */
  skip: number;
  /** Words with fewer folded letters are never flagged (Clear or Not sure only). */
  minChars: number;
  /** Mean per-piece log-likelihood ratio of the whole alignment below this → "couldn't follow". */
  fitMin: number;
  /** More than this share of words flagged → "couldn't follow" instead of marks. */
  maxFlaggedShare: number;
};

/** Pinned `pronunciation-calibration.json`, written by the S3 eval script. */
export type PronunciationCalibration = {
  modelVersion: string;
  /** sha256 of the pinned `vocab.json` the lattice pieces come from. */
  vocabSha256: string;
  /** sha256 of the pinned `quran.json` the expected text comes from. */
  corpusSha256: string;
  measuredOn: string;
  date: string;
  mode: AssessmentMode;
  thresholds: PronunciationThresholds;
  gate: {
    passed: boolean;
    falseListenAgain: number | null;
    detection: number | null;
    boundaryP90Ms: number | null;
    note: string;
  };
};

export type AssessedWord = {
  /** Engine word index. */
  word: number;
  state: PronunciationWordState;
  /** Time window of the word inside the user's take (ms). Memory only. */
  startMs: number;
  endMs: number;
};

export type NoFitReason = "too-short" | "different-passage" | "too-many-flags" | "no-text";

export type AyahAssessment =
  | { status: "ok"; mode: AssessmentMode; words: AssessedWord[] }
  | { status: "no-fit"; reason: NoFitReason };

/** One study word's verdict (what the screen shows and the session stores). */
export type StudyWordVerdict = {
  /** Study word index (0-based, Quran.com word order — the practice row). */
  index: number;
  state: PronunciationWordState;
  /** Window in the user's take (ms), when the word mapped onto aligned engine words. */
  startMs?: number;
  endMs?: number;
};
