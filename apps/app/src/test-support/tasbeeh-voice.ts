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

/* ---------------------------------------------- "teach a zikr" fixtures */

/** Deterministic pseudo-random noise in [-0.5, 0.5). */
export function seededNoise(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32 - 0.5;
  };
}

/**
 * One synthetic "syllable": a 140 Hz voiced tone whose harmonics are shaped by
 * two formant peaks, with a smooth attack / release — enough spectral structure
 * for the MFCC + DTW matcher to tell syllables apart. No recorded audio is ever
 * committed; tests build "zikr" from these.
 */
export function syllable(
  [f1, f2]: readonly [number, number],
  ms: number,
  { amplitude = 0.25, pitch = 140 } = {},
): Float32Array {
  const n = Math.round((ms * 16_000) / 1000);
  const out = new Float32Array(n);
  const ramp = Math.min(n / 4, 16_000 * 0.03);
  for (let h = 1; h * pitch < 7000; h++) {
    const f = h * pitch;
    const gain =
      Math.exp(-(((f - f1) / 160) ** 2)) + 0.6 * Math.exp(-(((f - f2) / 220) ** 2)) + 0.02;
    for (let i = 0; i < n; i++)
      out[i] += (gain / h ** 0.3) * Math.sin((2 * Math.PI * f * i) / 16_000);
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, i / ramp, (n - 1 - i) / ramp);
    out[i] = (out[i] / Math.max(1e-9, peak)) * amplitude * env;
  }
  return out;
}

/** Formant pairs for the synthetic syllables (vowel-like). */
export const VOWELS = {
  a: [750, 1250],
  i: [300, 2300],
  u: [320, 850],
  e: [500, 1900],
  o: [500, 900],
} as const;

/** A synthetic "phrase": syllables back to back, each `ms` long (× `stretch`). */
export function syntheticPhrase(
  vowels: readonly (keyof typeof VOWELS)[],
  { ms = 160, stretch = 1, amplitude = 0.25, pitch = 140 } = {},
): Float32Array {
  return concatPcm(...vowels.map((v) => syllable(VOWELS[v], ms * stretch, { amplitude, pitch })));
}

/** `parts` separated by `gapMs` of room floor, with lead-in / tail. */
export function withPauses(parts: readonly Float32Array[], gapMs = 600): Float32Array {
  const pieces: Float32Array[] = [hush(500)];
  parts.forEach((part, i) => {
    if (i > 0) pieces.push(hush(gapMs));
    pieces.push(part);
  });
  pieces.push(hush(900));
  return concatPcm(...pieces);
}

/** Feed PCM to a listener in 100 ms chunks (what the capture layer delivers). */
export function feedInChunks(listener: { feed(pcm: Float32Array): void }, pcm: Float32Array) {
  for (let i = 0; i < pcm.length; i += 1600) listener.feed(pcm.subarray(i, i + 1600));
}
