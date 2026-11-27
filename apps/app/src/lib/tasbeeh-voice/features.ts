/**
 * Voice-pattern features for "teach a zikr" counting (NF-3.20, D48–D51). Pure;
 * no imports (the Node eval script loads this file directly).
 *
 * 16 kHz PCM → 25 ms frames every 10 ms → pre-emphasis, Hamming window, 512-point
 * FFT power spectrum → 26 mel bands (log) → 13 MFCCs (DCT-II) + their deltas.
 * Each utterance is mean/variance normalised per coefficient (CMVN), so the
 * pattern does not depend on the microphone gain or the room.
 *
 * The result is a small matrix of numbers. It cannot be turned back into the
 * recording (no phase, 13 smoothed spectral coefficients per 10 ms), which is why
 * it may be kept on the device as the "voice pattern" a taught zikr is matched
 * against. Audio itself is never kept.
 */

export const FEATURE_SAMPLE_RATE = 16_000;
/** 25 ms analysis frame. */
export const FEATURE_FRAME = 400;
/** 10 ms hop. */
export const FEATURE_HOP = 160;
export const FEATURE_HOP_MS = (FEATURE_HOP / FEATURE_SAMPLE_RATE) * 1000;
const FFT_SIZE = 512;
const MEL_BANDS = 26;
export const MFCC_COUNT = 13;
/** Static MFCCs + deltas. */
export const FEATURE_DIM = MFCC_COUNT * 2;
/**
 * Bump when the feature recipe changes: stored patterns of an older version can't
 * be compared with new ones and are dropped (the user re-teaches).
 */
export const FEATURE_VERSION = 1;

/** Row-major `frames × dim` matrix + the raw frame energy (dBFS) for trimming. */
export type FeatureMatrix = {
  frames: number;
  dim: number;
  data: Float32Array;
  energyDb: Float32Array;
  /** First frame of this matrix inside the analysed audio (after trimming). */
  offsetFrames: number;
};

/* ------------------------------------------------------------ tables */

const HAMMING = (() => {
  const w = new Float32Array(FEATURE_FRAME);
  for (let i = 0; i < FEATURE_FRAME; i++) {
    w[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (FEATURE_FRAME - 1));
  }
  return w;
})();

const hzToMel = (hz: number) => 2595 * Math.log10(1 + hz / 700);
const melToHz = (mel: number) => 700 * (10 ** (mel / 2595) - 1);

/** Triangular mel filters over FFT bins 0..FFT_SIZE/2, as [startBin, weights]. */
const MEL_FILTERS: { start: number; weights: Float32Array }[] = (() => {
  const bins = FFT_SIZE / 2 + 1;
  const low = hzToMel(60);
  const high = hzToMel(7600);
  const points: number[] = [];
  for (let i = 0; i < MEL_BANDS + 2; i++) {
    const hz = melToHz(low + ((high - low) * i) / (MEL_BANDS + 1));
    points.push((hz * FFT_SIZE) / FEATURE_SAMPLE_RATE);
  }
  const filters: { start: number; weights: Float32Array }[] = [];
  for (let m = 1; m <= MEL_BANDS; m++) {
    const [left, centre, right] = [points[m - 1], points[m], points[m + 1]];
    const start = Math.max(0, Math.floor(left));
    const end = Math.min(bins - 1, Math.ceil(right));
    const weights = new Float32Array(end - start + 1);
    for (let k = start; k <= end; k++) {
      let w = 0;
      if (k >= left && k <= centre) w = (k - left) / Math.max(1e-9, centre - left);
      else if (k > centre && k <= right) w = (right - k) / Math.max(1e-9, right - centre);
      weights[k - start] = Math.max(0, w);
    }
    filters.push({ start, weights });
  }
  return filters;
})();

const DCT = (() => {
  const table = new Float32Array(MFCC_COUNT * MEL_BANDS);
  for (let c = 0; c < MFCC_COUNT; c++) {
    for (let m = 0; m < MEL_BANDS; m++) {
      table[c * MEL_BANDS + m] = Math.cos((Math.PI * c * (m + 0.5)) / MEL_BANDS);
    }
  }
  return table;
})();

const BIT_REVERSE = (() => {
  const bits = Math.log2(FFT_SIZE);
  const out = new Uint16Array(FFT_SIZE);
  for (let i = 0; i < FFT_SIZE; i++) {
    let r = 0;
    for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
    out[i] = r;
  }
  return out;
})();

/**
 * Twiddle factors for every FFT stage, computed once with the exact expression
 * the butterflies used to evaluate inline (so results are bit-identical). The
 * stage with `half` butterflies starts at index `half - 1`; 511 entries in all.
 * Saves ~2.3k `cos`/`sin` calls per 10 ms frame.
 */
const [TWIDDLE_RE, TWIDDLE_IM] = (() => {
  const re = new Float64Array(FFT_SIZE - 1);
  const im = new Float64Array(FFT_SIZE - 1);
  for (let size = 2; size <= FFT_SIZE; size <<= 1) {
    const half = size >> 1;
    const step = (-2 * Math.PI) / size;
    for (let k = 0; k < half; k++) {
      const angle = step * k;
      re[half - 1 + k] = Math.cos(angle);
      im[half - 1 + k] = Math.sin(angle);
    }
  }
  return [re, im];
})();

/** In-place iterative radix-2 FFT (`FFT_SIZE` points). */
function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  for (let i = 0; i < n; i++) {
    const j = BIT_REVERSE[i];
    if (j > i) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const twiddle = half - 1;
    for (let start = 0; start < n; start += size) {
      for (let k = 0; k < half; k++) {
        const wr = TWIDDLE_RE[twiddle + k];
        const wi = TWIDDLE_IM[twiddle + k];
        const a = start + k;
        const b = a + half;
        const tr = re[b] * wr - im[b] * wi;
        const ti = re[b] * wi + im[b] * wr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
      }
    }
  }
}

/* ---------------------------------------------------------- features */

/** Spectral subtraction: how much of the noise estimate to remove, and the floor kept. */
const NOISE_OVERSUBTRACT = 2;
const NOISE_FLOOR = 0.05;
/** Share of the quietest frames that estimates the steady background (fan, car, hum). */
const NOISE_FRAMES = 0.1;
/** Quiet frames count as background only this far below the median frame. */
const NOISE_MIN_GAP_DB = 10;
/**
 * Mel power floor relative to the utterance's loudest band (−25 dB), chosen by
 * the template eval (D51): deeper valleys are where clean and noisy takes differ
 * most, while the phrase itself lives well above them.
 */
const DYNAMIC_RANGE = 10 ** (-25 / 10);

/**
 * Static MFCCs (13 per frame) and frame energy for 16 kHz mono PCM. A steady
 * background is estimated per mel band from the utterance's quietest frames
 * (the VAD's pre-roll and the pauses) and subtracted before the log, so a zikr
 * taught in a quiet room still matches with a fan running, and vice versa.
 */
function mfcc(pcm: Float32Array): { frames: number; data: Float32Array; energyDb: Float32Array } {
  const frames =
    pcm.length < FEATURE_FRAME ? 0 : 1 + Math.floor((pcm.length - FEATURE_FRAME) / FEATURE_HOP);
  const mel = new Float32Array(frames * MEL_BANDS);
  const energyDb = new Float32Array(frames);
  const re = new Float32Array(FFT_SIZE);
  const im = new Float32Array(FFT_SIZE);
  const power = new Float32Array(FFT_SIZE / 2 + 1);
  for (let f = 0; f < frames; f++) {
    const offset = f * FEATURE_HOP;
    let mean = 0;
    for (let i = 0; i < FEATURE_FRAME; i++) mean += pcm[offset + i];
    mean /= FEATURE_FRAME;
    let energy = 0;
    re.fill(0);
    im.fill(0);
    let prev = pcm[offset] - mean;
    for (let i = 0; i < FEATURE_FRAME; i++) {
      const x = pcm[offset + i] - mean;
      energy += x * x;
      re[i] = (x - 0.97 * prev) * HAMMING[i];
      prev = x;
    }
    const rms = Math.sqrt(energy / FEATURE_FRAME);
    energyDb[f] = rms > 0 ? Math.max(-100, 20 * Math.log10(rms)) : -100;
    fft(re, im);
    for (let k = 0; k < power.length; k++) power[k] = re[k] * re[k] + im[k] * im[k];
    for (let m = 0; m < MEL_BANDS; m++) {
      const { start, weights } = MEL_FILTERS[m];
      let sum = 0;
      for (let k = 0; k < weights.length; k++) sum += weights[k] * power[start + k];
      mel[f * MEL_BANDS + m] = sum;
    }
  }

  // Background estimate: mean mel power of the quietest frames.
  const noise = new Float32Array(MEL_BANDS);
  if (frames > 0) {
    const order = Array.from({ length: frames }, (_, f) => f).sort(
      (a, b) => energyDb[a] - energyDb[b],
    );
    const quiet = order.slice(0, Math.max(1, Math.floor(frames * NOISE_FRAMES)));
    // Only a real pause is background: quiet frames that are still speech (no
    // pause in this stretch) must not be subtracted from the voice.
    const median = energyDb[order[Math.floor(frames / 2)]];
    const quietDb = quiet.reduce((sum, f) => sum + energyDb[f], 0) / quiet.length;
    if (median - quietDb >= NOISE_MIN_GAP_DB) {
      for (const f of quiet) {
        for (let m = 0; m < MEL_BANDS; m++) noise[m] += mel[f * MEL_BANDS + m] / quiet.length;
      }
    }
  }

  // Dynamic-range floor: spectral valleys deeper than this below the loudest
  // band are flattened in every recording, so clean and noisy takes compare.
  let loudest = 0;
  for (let i = 0; i < mel.length; i++) loudest = Math.max(loudest, mel[i]);
  const valleyFloor = loudest * DYNAMIC_RANGE + 1e-10;

  const data = new Float32Array(frames * MFCC_COUNT);
  const logMel = new Float32Array(MEL_BANDS);
  for (let f = 0; f < frames; f++) {
    for (let m = 0; m < MEL_BANDS; m++) {
      const p = mel[f * MEL_BANDS + m];
      const clean = Math.max(p - NOISE_OVERSUBTRACT * noise[m], NOISE_FLOOR * p);
      logMel[m] = Math.log(clean + valleyFloor);
    }
    for (let c = 0; c < MFCC_COUNT; c++) {
      let sum = 0;
      for (let m = 0; m < MEL_BANDS; m++) sum += DCT[c * MEL_BANDS + m] * logMel[m];
      data[f * MFCC_COUNT + c] = sum;
    }
  }
  return { frames, data, energyDb };
}

/** Per-coefficient mean / variance normalisation, in place. */
export function normalizeInPlace(data: Float32Array, frames: number, dim: number): void {
  if (frames === 0) return;
  for (let c = 0; c < dim; c++) {
    let mean = 0;
    for (let f = 0; f < frames; f++) mean += data[f * dim + c];
    mean /= frames;
    let variance = 0;
    for (let f = 0; f < frames; f++) {
      const d = data[f * dim + c] - mean;
      variance += d * d;
    }
    const scale = 1 / Math.sqrt(variance / frames + 1e-6);
    for (let f = 0; f < frames; f++) data[f * dim + c] = (data[f * dim + c] - mean) * scale;
  }
}

/** Static coefficients → static + delta (±2 frame regression), CMVN applied to both. */
export function withDeltas(statics: Float32Array, frames: number): Float32Array {
  const out = new Float32Array(frames * FEATURE_DIM);
  const s = new Float32Array(statics);
  normalizeInPlace(s, frames, MFCC_COUNT);
  for (let f = 0; f < frames; f++) {
    for (let c = 0; c < MFCC_COUNT; c++) {
      out[f * FEATURE_DIM + c] = s[f * MFCC_COUNT + c];
      let num = 0;
      for (let k = 1; k <= 2; k++) {
        const ahead = s[Math.min(frames - 1, f + k) * MFCC_COUNT + c];
        const behind = s[Math.max(0, f - k) * MFCC_COUNT + c];
        num += k * (ahead - behind);
      }
      out[f * FEATURE_DIM + MFCC_COUNT + c] = num / 10;
    }
  }
  // Deltas get their own CMVN so both halves weigh the same in the distance.
  const deltas = new Float32Array(frames * MFCC_COUNT);
  for (let f = 0; f < frames; f++) {
    for (let c = 0; c < MFCC_COUNT; c++) {
      deltas[f * MFCC_COUNT + c] = out[f * FEATURE_DIM + MFCC_COUNT + c];
    }
  }
  normalizeInPlace(deltas, frames, MFCC_COUNT);
  for (let f = 0; f < frames; f++) {
    for (let c = 0; c < MFCC_COUNT; c++) {
      out[f * FEATURE_DIM + MFCC_COUNT + c] = deltas[f * MFCC_COUNT + c];
    }
  }
  return out;
}

/** Below this an utterance is digital silence, not a voice. */
const SILENT_PEAK_DB = -75;

/**
 * The voiced span of an utterance (frame indices, end exclusive). The quiet
 * floor is the 5th-percentile frame; frames clearly above it (a quarter of the
 * floor-to-peak range, at least `floorMarginDb`, and within `rangeDb` of the
 * peak) are voice. An utterance with little dynamic range is voiced throughout
 * (nothing to trim). Null for digital silence.
 */
export function voicedSpan(
  energyDb: Float32Array,
  { rangeDb = 40, floorMarginDb = 8, flatDb = 15, padFrames = 5 } = {},
): { start: number; end: number } | null {
  const n = energyDb.length;
  if (n === 0) return null;
  const sorted = Array.from(energyDb).sort((a, b) => a - b);
  const floor = sorted[Math.floor(n * 0.05)];
  const peak = sorted[n - 1];
  if (peak < SILENT_PEAK_DB) return null;
  if (peak - floor < flatDb) return { start: 0, end: n };
  const gate = Math.max(peak - rangeDb, floor + Math.max(floorMarginDb, (peak - floor) * 0.25));
  let start = -1;
  let end = -1;
  for (let f = 0; f < n; f++) {
    if (energyDb[f] >= gate) {
      if (start < 0) start = f;
      end = f + 1;
    }
  }
  if (start < 0) return null;
  return { start: Math.max(0, start - padFrames), end: Math.min(n, end + padFrames) };
}

/** Features of a whole utterance (no trimming). */
export function extractFeatures(pcm: Float32Array): FeatureMatrix {
  const { frames, data, energyDb } = mfcc(pcm);
  return { frames, dim: FEATURE_DIM, data: withDeltas(data, frames), energyDb, offsetFrames: 0 };
}

/**
 * Features of the voiced part of an utterance (a taught sample): silence before
 * and after the zikr is cut off before normalising. Null when nothing is voiced.
 */
export function extractVoicedFeatures(pcm: Float32Array): FeatureMatrix | null {
  const { frames, data, energyDb } = mfcc(pcm);
  const span = voicedSpan(energyDb);
  if (!span || frames === 0) return null;
  const count = span.end - span.start;
  const statics = data.slice(span.start * MFCC_COUNT, span.end * MFCC_COUNT);
  return {
    frames: count,
    dim: FEATURE_DIM,
    data: withDeltas(statics, count),
    energyDb: energyDb.slice(span.start, span.end),
    offsetFrames: span.start,
  };
}

/** Frames → milliseconds. */
export function framesToMs(frames: number): number {
  return frames * FEATURE_HOP_MS;
}
