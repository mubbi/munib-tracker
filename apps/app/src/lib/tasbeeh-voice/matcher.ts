/**
 * "Teach a zikr" matching (NF-3.20, D48–D51): query-by-example. The person says
 * the zikr 1–3 times; each sample becomes a template (voice-pattern features,
 * `features.ts`). While counting, every spoken burst is searched for the
 * templates with subsequence DTW (`dtw.ts`); each non-overlapping match is one
 * count. Pure; imports only the other pure modules (the eval script loads it).
 *
 * The acceptance threshold comes from the samples themselves: how far apart the
 * person's own repeats are, plus a margin, clamped to a calibrated range (the
 * constants below are measured by `pnpm --filter app tasbeeh-voice:eval
 * --template`; see docs/proofs/hands-free-tasbeeh.md §7).
 */
import {
  dtwDistance,
  type Matrix,
  pickNonOverlapping,
  type SubsequenceMatch,
  subsequenceCandidates,
} from "./dtw";
import { extractVoicedFeatures, type FeatureMatrix, framesToMs } from "./features";

/** Taught samples asked for (and kept) per zikr. */
export const MAX_TEMPLATES = 3;
/**
 * Extra templates learned while counting (adaptive templates): confident
 * matches are added as feature templates — never audio — so the pattern follows
 * how the person actually says the zikr at speed. Oldest dropped first; with the
 * taught ones at most {@link MAX_TEMPLATES} + 5 = 8 are matched.
 */
export const MAX_LEARNED_TEMPLATES = 5;
/** A match at most this share of the threshold is confident enough to learn from. */
export const LEARN_COST_RATIO = 0.7;
/** Closer than this to a template already kept adds nothing new. */
export const LEARN_MIN_DISTANCE = 0.18;
/** A taught sample shorter than this is a cough or a click. */
export const MIN_SAMPLE_MS = 300;
/** Longer than this is more than one zikr (or talking). */
export const MAX_SAMPLE_MS = 8000;

export type MatcherTuning = {
  /** Threshold with a single sample (no spread to measure). */
  singleThreshold: number;
  /** threshold = spread × spreadFactor + margin, clamped to [min, max]. */
  spreadFactor: number;
  margin: number;
  minThreshold: number;
  maxThreshold: number;
  /** A new sample farther than this from an earlier one is "a different phrase". */
  maxSampleDistance: number;
  /** Match length vs template (speech-rate tolerance). */
  minLengthRatio: number;
  maxLengthRatio: number;
  /** A match quieter than the burst's loudest part by more than this is an echo / tail. */
  maxQuietDb: number;
};

/**
 * Calibrated on reference + synthetic audio (`tasbeeh-voice:eval --template`,
 * 2026-11-24, docs/proofs/hands-free-tasbeeh.md §7): with three samples the
 * over-count is 0.2% at an average frame cost of 0.6 and climbs fast above it
 * (1.6% at 0.65), while misses keep falling up to there. The samples' spread
 * on that set always landed below 0.6, so the calibrated range currently pins
 * the threshold to 0.6; the spread rule only matters if the range is widened.
 */
export const DEFAULT_TUNING: MatcherTuning = {
  singleThreshold: 0.6,
  spreadFactor: 1.1,
  margin: 0.06,
  minThreshold: 0.6,
  maxThreshold: 0.6,
  maxSampleDistance: 0.75,
  minLengthRatio: 0.6,
  maxLengthRatio: 1.7,
  maxQuietDb: 22,
};

/** What is kept per taught zikr: the templates and the threshold they imply. */
export type TaughtPattern = {
  /** The taught samples (1–3). The threshold and every learned template are anchored to them. */
  templates: Matrix[];
  threshold: number;
  /** Learned while counting (0–5, oldest first); matched like the taught ones. */
  learned?: Matrix[];
};

/** Every template a pattern is matched with: taught first, then learned. */
export function patternTemplates(pattern: TaughtPattern): Matrix[] {
  return pattern.learned?.length ? [...pattern.templates, ...pattern.learned] : pattern.templates;
}

export type SampleCheck = "ok" | "too-short" | "too-long" | "different";

/** Is a new teaching sample usable next to the ones already accepted? */
export function checkSample(
  sample: FeatureMatrix | null,
  accepted: readonly Matrix[],
  tuning: MatcherTuning = DEFAULT_TUNING,
): SampleCheck {
  if (!sample) return "too-short";
  const ms = framesToMs(sample.frames);
  if (ms < MIN_SAMPLE_MS) return "too-short";
  if (ms > MAX_SAMPLE_MS) return "too-long";
  for (const other of accepted) {
    if (dtwDistance(other, sample) > tuning.maxSampleDistance) return "different";
  }
  return "ok";
}

/** Features of a teaching sample's PCM (voiced part only). */
export function sampleFeatures(pcm: Float32Array): FeatureMatrix | null {
  return extractVoicedFeatures(pcm);
}

/** The threshold the taught samples imply. */
export function thresholdForTemplates(
  templates: readonly Matrix[],
  tuning: MatcherTuning = DEFAULT_TUNING,
): number {
  if (templates.length < 2) return tuning.singleThreshold;
  let spread = 0;
  let pairs = 0;
  for (let a = 0; a < templates.length; a++) {
    for (let b = a + 1; b < templates.length; b++) {
      const d = dtwDistance(templates[a], templates[b]);
      if (Number.isFinite(d)) {
        spread = Math.max(spread, d);
        pairs += 1;
      }
    }
  }
  if (pairs === 0) return tuning.singleThreshold;
  const raw = spread * tuning.spreadFactor + tuning.margin;
  return Math.min(tuning.maxThreshold, Math.max(tuning.minThreshold, raw));
}

export function buildPattern(
  templates: readonly Matrix[],
  tuning: MatcherTuning = DEFAULT_TUNING,
): TaughtPattern {
  const kept = templates.slice(0, MAX_TEMPLATES);
  return { templates: kept, threshold: thresholdForTemplates(kept, tuning) };
}

/**
 * Adaptive templates: the pattern with `candidate` (the voiced features of a
 * match, re-extracted exactly like a taught sample) added as a learned
 * template, or null when it should not be learned. Only confident matches —
 * well under the threshold — that stay within the threshold of a TAUGHT sample
 * (so learning can never drift towards another phrase) and that add something
 * new (not a near-copy of a kept template). The threshold never changes.
 */
export function learnFromMatch(
  pattern: TaughtPattern,
  candidate: FeatureMatrix | null,
  cost: number,
): TaughtPattern | null {
  if (!candidate || !Number.isFinite(cost)) return null;
  if (cost > pattern.threshold * LEARN_COST_RATIO) return null;
  const ms = framesToMs(candidate.frames);
  if (ms < MIN_SAMPLE_MS || ms > MAX_SAMPLE_MS) return null;
  let nearestTaught = Number.POSITIVE_INFINITY;
  for (const taught of pattern.templates) {
    nearestTaught = Math.min(nearestTaught, dtwDistance(taught, candidate));
  }
  if (!(nearestTaught <= pattern.threshold)) return null;
  let nearest = nearestTaught;
  for (const learned of pattern.learned ?? []) {
    nearest = Math.min(nearest, dtwDistance(learned, candidate));
  }
  if (nearest < LEARN_MIN_DISTANCE) return null;
  const template: Matrix = { frames: candidate.frames, dim: candidate.dim, data: candidate.data };
  const learned = [...(pattern.learned ?? []), template].slice(-MAX_LEARNED_TEMPLATES);
  return { ...pattern, learned };
}

/** Noise adaptation bounds: never looser than +0.03, never tighter than −0.05. */
export const NOISE_RELAX_MAX = 0.03;
export const NOISE_TIGHTEN_MAX = 0.05;
/** Voice barely above the noise (dB): features are mostly noise — be stricter. */
const LOW_SNR_DB = 10;
/** A noisy room (floor dBFS) with the voice clearly above it (dB). */
const NOISY_FLOOR_DB = -50;
const CLEAR_SNR_DB = 22;

/**
 * Noise-adaptive acceptance threshold, within safe bounds. Background noise
 * lifts every frame cost: when the voice is clearly above a noisy floor, the
 * real repeats drift a little over the quiet-room threshold, so it relaxes by
 * up to {@link NOISE_RELAX_MAX}; when the voice barely clears the noise the
 * features are mostly noise (everything starts to look alike), so it tightens
 * by up to {@link NOISE_TIGHTEN_MAX} — over-counting is always the worse error.
 * In a quiet room it is exactly `base`.
 */
export function noiseAdjustedThreshold(base: number, noiseFloorDb: number, peakDb: number): number {
  if (!Number.isFinite(noiseFloorDb) || !Number.isFinite(peakDb)) return base;
  const snr = peakDb - noiseFloorDb;
  if (snr < LOW_SNR_DB) {
    const k = Math.min(1, (LOW_SNR_DB - snr) / 6);
    return base - NOISE_TIGHTEN_MAX * k;
  }
  if (noiseFloorDb > NOISY_FLOOR_DB && snr >= CLEAR_SNR_DB) {
    const k = Math.min(1, (noiseFloorDb - NOISY_FLOOR_DB) / 12);
    return base + NOISE_RELAX_MAX * k;
  }
  return base;
}

export type UtteranceMatch = {
  /** Offsets inside the utterance's PCM, in ms. */
  startMs: number;
  endMs: number;
  cost: number;
};

/**
 * Every repeat of the taught zikr inside one spoken burst. A burst that holds
 * two fast repeats returns two matches; other speech, coughs and noise return
 * none (or, rarely, a miscount the person corrects with a tap).
 */
export function matchUtterance(
  pattern: TaughtPattern,
  pcm: Float32Array,
  tuning: MatcherTuning = DEFAULT_TUNING,
): UtteranceMatch[] {
  const features = extractVoicedFeatures(pcm);
  if (!features) return [];
  return matchFeatures(pattern, features, tuning).map((match) => ({
    startMs: framesToMs(match.start + features.offsetFrames),
    endMs: framesToMs(match.end + features.offsetFrames),
    cost: match.cost,
  }));
}

/** `matchUtterance` on already-extracted features (frame indices are inside `features`). */
export function matchFeatures(
  pattern: TaughtPattern,
  features: FeatureMatrix,
  tuning: MatcherTuning = DEFAULT_TUNING,
  threshold: number = pattern.threshold,
): SubsequenceMatch[] {
  return pickNonOverlapping(
    matchCandidates(patternTemplates(pattern), features, threshold, tuning),
  );
}

/**
 * Every candidate match (overlapping, from all templates) at or below `maxCost`
 * that passes the sanity checks. `matchFeatures` keeps the best non-overlapping
 * ones; the eval re-picks them at several thresholds from one DTW pass.
 */
export function matchCandidates(
  templates: readonly Matrix[],
  features: FeatureMatrix,
  maxCost: number,
  tuning: MatcherTuning = DEFAULT_TUNING,
): SubsequenceMatch[] {
  if (templates.length === 0 || features.frames === 0) return [];
  let peak = -100;
  for (let f = 0; f < features.frames; f++) peak = Math.max(peak, features.energyDb[f]);
  return templates.flatMap((template) =>
    subsequenceCandidates(template, features, {
      maxCost,
      minLengthRatio: tuning.minLengthRatio,
      maxLengthRatio: tuning.maxLengthRatio,
    }).filter((match) => {
      // Energy sanity: the match must carry the voice, not a quiet tail or echo.
      let sum = 0;
      for (let f = match.start; f < match.end; f++) sum += features.energyDb[f];
      return sum / Math.max(1, match.end - match.start) >= peak - tuning.maxQuietDb;
    }),
  );
}
