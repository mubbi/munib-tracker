/**
 * Synthetic CTC fixtures for NF-3.24 pronunciation tests. No audio is ever
 * committed: alignment / GOP / verdict / hook tests build log-probability
 * matrices frame by frame.
 *
 * Toy vocabulary (blank = 9), real Arabic letters so the lattice folding runs:
 *   1 "▁ب"  2 "سم"  3 "▁ربك"  4 "▁قل"  5 "َ" (harakat filler)  6 "▁ر"  7 "بك"  8 "▁هل"
 * Toy ayah "بسم ربك قل" (surah 5, ayah 2 in the toy corpus).
 */
import { buildPieceIndex, corpusIndex, expectedAyah } from "@/lib/quran-pronunciation/ayah-tokens";
import type {
  ExpectedAyah,
  LogprobMatrix,
  PronunciationThresholds,
} from "@/lib/quran-pronunciation/types";

export const TOY_VOCAB_SIZE = 10;
export const TOY_BLANK = 9;
export const TOY_VOCAB: Record<string, string> = {
  "0": "<unk>",
  "1": "▁ب",
  "2": "سم",
  "3": "▁ربك",
  "4": "▁قل",
  "5": "َ",
  "6": "▁ر",
  "7": "بك",
  "8": "▁هل",
};
export const TOY_PIECES = buildPieceIndex(TOY_VOCAB, TOY_BLANK);

/** Toy corpus rows (shape of the model's `quran.json`). 5:1 carries a "basmala" prefix. */
export const TOY_ROWS = [
  { surah: 1, ayah: 1, text_clean: "بسم" },
  { surah: 5, ayah: 1, text_clean: "بسم بسم ربك قل" },
  { surah: 5, ayah: 2, text_clean: "بسم ربك قل" },
  { surah: 5, ayah: 3, text_clean: "هل" },
];
export const TOY_CORPUS = corpusIndex(TOY_ROWS);

export function toyAyah(surah = 5, ayah = 2): ExpectedAyah {
  const out = expectedAyah(surah, ayah, TOY_CORPUS);
  if (!out) throw new Error(`no toy ayah ${surah}:${ayah}`);
  return out;
}

export const TOY_THRESHOLDS: PronunciationThresholds = {
  clear: 1,
  listen: -3,
  skip: -5,
  minChars: 2,
  fitMin: -2,
  maxFlaggedShare: 0.5,
};

/** One frame per entry: the named piece gets `confidence`, null = blank. */
export function toyLogprobs(frames: readonly (number | null)[], confidence = 0.9): LogprobMatrix {
  const logprobs = new Float32Array(frames.length * TOY_VOCAB_SIZE);
  const rest = Math.log((1 - confidence) / (TOY_VOCAB_SIZE - 1));
  frames.forEach((piece, t) => {
    const top = piece ?? TOY_BLANK;
    for (let v = 0; v < TOY_VOCAB_SIZE; v++) {
      logprobs[t * TOY_VOCAB_SIZE + v] = v === top ? Math.log(confidence) : rest;
    }
  });
  return { logprobs, timeSteps: frames.length, vocabSize: TOY_VOCAB_SIZE };
}

/** "بسم ربك قل" read clearly (▁ب سم ▁ربك ▁قل with blanks between). */
export const READ_CLEAR: readonly (number | null)[] = [
  null,
  1,
  null,
  2,
  null,
  null,
  3,
  null,
  null,
  4,
  null,
];
/** The last word read as "هل" (a different first letter). */
export const READ_SUBSTITUTED: readonly (number | null)[] = [
  null,
  1,
  null,
  2,
  null,
  null,
  3,
  null,
  null,
  8,
  null,
];
/** The middle word left out. */
export const READ_SKIPPED: readonly (number | null)[] = [null, 1, null, 2, null, null, 4, null];
/** Silence and stray noise before and after a clear reading. */
export const READ_PADDED: readonly (number | null)[] = [
  null,
  null,
  null,
  8,
  null,
  ...READ_CLEAR,
  null,
  null,
  8,
  null,
];
/** Something else entirely. */
export const READ_OTHER: readonly (number | null)[] = [null, 8, null, 8, null, 8, null, 8, null];
