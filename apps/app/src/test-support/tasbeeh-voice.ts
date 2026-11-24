/**
 * Synthetic CTC fixtures for hands-free tasbeeh tests (NF-3.20). No audio is
 * ever committed: spotter / listener / hook tests build log-probability
 * matrices frame by frame instead.
 *
 * Toy vocabulary (blank = 9):
 *   1 " a"   2 "b"   3 " ab"   4 (harakat filler)   5 " c"   6 "d"
 * Toy phrases: " ab" (a·b) and " cd" (c·d).
 */

import type { FastConformerRunner } from "@/lib/speech/fastconformer-runner";
import { compilePhrase, type LogprobMatrix } from "@/lib/tasbeeh-voice/ctc-keyword-spotter";

export const TOY_VOCAB_SIZE = 10;
export const TOY_BLANK = 9;
export const TOY_FILLER = 4;
export const TOY_SPOTTER_VOCAB = { blankId: TOY_BLANK, fillers: [TOY_FILLER] };

/** " ab": pieces 1 (" a", len 2) + 2 ("b", len 1), or 3 (" ab", len 3). */
export const TOY_AB = compilePhrase([
  {
    id: "base",
    text: " ab",
    edges: [
      [0, 1, 2],
      [2, 2, 1],
      [0, 3, 3],
    ],
  },
]);
/** " cd": pieces 5 + 6. */
export const TOY_CD = compilePhrase([
  {
    id: "base",
    text: " cd",
    edges: [
      [0, 5, 2],
      [2, 6, 1],
    ],
  },
]);

/** One frame per entry: the named piece gets ~0.9 probability, null = blank. */
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

/** " ab" said once: a a b, padded with blanks. */
export const SAID_AB: readonly (number | null)[] = [null, 1, 1, null, 2, null];

/** A runner that returns queued matrices in order (then all-blank windows). */
export function fakeRunner(
  matrices: LogprobMatrix[] = [],
): FastConformerRunner & { calls: number; released: boolean } {
  const runner = {
    calls: 0,
    released: false,
    async run() {
      runner.calls += 1;
      return matrices.shift() ?? toyLogprobs(new Array(10).fill(null));
    },
    async release() {
      runner.released = true;
    },
  };
  return runner;
}

/** `ms` of a 16 kHz tone at `amplitude` (speech for the energy VAD). */
export function tone(ms: number, amplitude = 0.3): Float32Array {
  const n = Math.round((ms * 16_000) / 1000);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = amplitude * Math.sin((2 * Math.PI * 220 * i) / 16_000);
  return out;
}

/** `ms` of near-silence (a quiet room floor). */
export function hush(ms: number, amplitude = 0.0005): Float32Array {
  const n = Math.round((ms * 16_000) / 1000);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = amplitude * Math.sin(i);
  return out;
}

export function concatPcm(...parts: Float32Array[]): Float32Array {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}
