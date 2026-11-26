import {
  concatPcm,
  hush,
  seededNoise,
  syllable,
  syntheticPhrase,
  VOWELS,
  withPauses,
} from "@/test-support/tasbeeh-voice";

import { dtwDistance, findSubsequenceMatches } from "./dtw";
import { extractVoicedFeatures, FEATURE_DIM, voicedSpan } from "./features";
import {
  buildPattern,
  checkSample,
  DEFAULT_TUNING,
  LEARN_MIN_DISTANCE,
  learnFromMatch,
  MAX_LEARNED_TEMPLATES,
  matchUtterance,
  NOISE_RELAX_MAX,
  NOISE_TIGHTEN_MAX,
  noiseAdjustedThreshold,
  patternTemplates,
  sampleFeatures,
  thresholdForTemplates,
} from "./matcher";

const TAUGHT = ["a", "i", "u", "e"] as const;
const OTHER = ["o", "e", "a", "a"] as const;

/** Three teaching takes of the same "zikr" at slightly different speeds and pitch. */
function teachTakes() {
  return [0.95, 1.05, 1].map((stretch, i) =>
    sampleFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch, pitch: 136 + i * 4 })])),
  );
}

function taughtPattern() {
  const takes = teachTakes();
  for (const take of takes) expect(take).not.toBeNull();
  return buildPattern(takes.filter((t) => t != null));
}

describe("voice-pattern features", () => {
  it("trims the silence around a sample and keeps the voice", () => {
    const voice = syntheticPhrase(TAUGHT);
    const features = extractVoicedFeatures(concatPcm(hush(600), voice, hush(600)));
    expect(features).not.toBeNull();
    expect(features?.dim).toBe(FEATURE_DIM);
    // ~640 ms of voice in 10 ms frames, plus a little padding — not the 1.2 s of silence.
    expect(features?.frames).toBeGreaterThan(55);
    expect(features?.frames).toBeLessThan(85);
  });

  it("finds nothing voiced in digital silence", () => {
    expect(extractVoicedFeatures(new Float32Array(16_000))).toBeNull();
    expect(voicedSpan(new Float32Array(0))).toBeNull();
  });

  it("normalises level: a quiet take matches a loud one", () => {
    const loud = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT, { amplitude: 0.4 })]));
    const quiet = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT, { amplitude: 0.02 })]));
    expect(loud && quiet && dtwDistance(loud, quiet)).toBeLessThan(0.3);
  });
});

describe("DTW", () => {
  it("is zero for identical patterns and tolerant of speed", () => {
    const a = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT)]));
    const slow = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch: 1.3 })]));
    const other = extractVoicedFeatures(withPauses([syntheticPhrase(OTHER)]));
    if (!a || !slow || !other) throw new Error("no features");
    expect(dtwDistance(a, a)).toBeCloseTo(0, 5);
    expect(dtwDistance(a, slow)).toBeLessThan(dtwDistance(a, other));
  });

  it("refuses lengths too far apart to be the same phrase", () => {
    const a = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT)]));
    const long = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch: 3 })]));
    if (!a || !long) throw new Error("no features");
    expect(dtwDistance(a, long)).toBe(Number.POSITIVE_INFINITY);
  });

  it("finds two back-to-back repeats inside one burst", () => {
    const template = extractVoicedFeatures(withPauses([syntheticPhrase(TAUGHT)]));
    const burst = extractVoicedFeatures(
      concatPcm(hush(300), syntheticPhrase(TAUGHT), syntheticPhrase(TAUGHT), hush(300)),
    );
    if (!template || !burst) throw new Error("no features");
    const matches = findSubsequenceMatches(template, burst, { maxCost: 0.5 });
    expect(matches).toHaveLength(2);
    expect(matches[0].end).toBeLessThanOrEqual(matches[1].start + 10);
  });
});

describe("teach-a-zikr matcher", () => {
  it("derives the threshold from the samples' spread, clamped to the calibrated range", () => {
    const takes = teachTakes().filter((t) => t != null);
    const threshold = thresholdForTemplates(takes);
    expect(threshold).toBeGreaterThanOrEqual(DEFAULT_TUNING.minThreshold);
    expect(threshold).toBeLessThanOrEqual(DEFAULT_TUNING.maxThreshold);
    expect(thresholdForTemplates(takes.slice(0, 1))).toBe(DEFAULT_TUNING.singleThreshold);
  });

  it("counts each repeat of the taught zikr", () => {
    const pattern = taughtPattern();
    // One burst at a time, as the VAD hands them over.
    for (const stretch of [0.9, 1, 1.15]) {
      const matches = matchUtterance(pattern, withPauses([syntheticPhrase(TAUGHT, { stretch })]));
      expect(matches).toHaveLength(1);
    }
  });

  it("does not count a different zikr, the taught one reversed, noise or a cough", () => {
    const pattern = taughtPattern();
    expect(matchUtterance(pattern, withPauses([syntheticPhrase(OTHER)]))).toHaveLength(0);
    const reversed = syntheticPhrase(TAUGHT).slice().reverse();
    expect(matchUtterance(pattern, withPauses([reversed]))).toHaveLength(0);
    const rand = seededNoise(3);
    const noise = new Float32Array(16_000).map(() => rand() * 0.3);
    expect(matchUtterance(pattern, concatPcm(hush(300), noise, hush(300)))).toHaveLength(0);
    const cough = new Float32Array(4800).map((_, i) => rand() * 0.6 * Math.exp(-i / 1900));
    expect(matchUtterance(pattern, concatPcm(hush(300), cough, hush(300)))).toHaveLength(0);
  });

  it("checks teaching samples: too short, too long, or a different phrase", () => {
    const first = sampleFeatures(withPauses([syntheticPhrase(TAUGHT)]));
    if (!first) throw new Error("no features");
    expect(checkSample(null, [])).toBe("too-short");
    expect(checkSample(sampleFeatures(withPauses([syntheticPhrase(["a"], { ms: 120 })])), [])).toBe(
      "too-short",
    );
    const long = sampleFeatures(withPauses([syntheticPhrase(new Array(60).fill("a"))]));
    expect(checkSample(long, [])).toBe("too-long");
    // Synthetic vowels are less distinct than speech, so a tighter limit stands in here.
    const strict = { ...DEFAULT_TUNING, maxSampleDistance: 0.5 };
    expect(checkSample(sampleFeatures(withPauses([syntheticPhrase(OTHER)])), [first], strict)).toBe(
      "different",
    );
    expect(
      checkSample(
        sampleFeatures(withPauses([syntheticPhrase(TAUGHT, { stretch: 1.05 })])),
        [first],
        strict,
      ),
    ).toBe("ok");
  });
});

describe("adaptive templates (learnFromMatch)", () => {
  const uneven = () =>
    sampleFeatures(
      withPauses([
        concatPcm(
          syllable(VOWELS.a, 280),
          syllable(VOWELS.i, 90),
          syllable(VOWELS.u, 240),
          syllable(VOWELS.e, 100),
        ),
      ]),
    );

  it("adds a confident, new-sounding repeat and matches with it", () => {
    const pattern = taughtPattern();
    const candidate = uneven();
    const next = learnFromMatch(pattern, candidate, 0.2);
    expect(next?.learned).toHaveLength(1);
    expect(next?.templates).toBe(pattern.templates);
    expect(next?.threshold).toBe(pattern.threshold);
    expect(patternTemplates(next ?? pattern)).toHaveLength(pattern.templates.length + 1);
  });

  it("refuses matches that are not confident, near-copies, or far from every taught sample", () => {
    const pattern = taughtPattern();
    expect(learnFromMatch(pattern, uneven(), pattern.threshold * 0.9)).toBeNull();
    // A near-copy of a taught take adds nothing.
    const copy = sampleFeatures(withPauses([syntheticPhrase(TAUGHT, { pitch: 138 })]));
    expect(dtwDistance(pattern.templates[0], copy as NonNullable<typeof copy>)).toBeLessThan(
      LEARN_MIN_DISTANCE,
    );
    expect(learnFromMatch(pattern, copy, 0.05)).toBeNull();
    // Another phrase never becomes a template, however low its claimed cost.
    const other = sampleFeatures(withPauses([syntheticPhrase(OTHER)]));
    expect(learnFromMatch(pattern, other, 0.05)).toBeNull();
    expect(learnFromMatch(pattern, null, 0.05)).toBeNull();
  });

  it(`keeps at most ${MAX_LEARNED_TEMPLATES} learned templates, dropping the oldest`, () => {
    const base = taughtPattern();
    const rand = seededNoise(7);
    const filler = () => {
      const data = new Float32Array(40 * FEATURE_DIM);
      for (let i = 0; i < data.length; i++) data[i] = rand() * 4;
      return { frames: 40, dim: FEATURE_DIM, data };
    };
    const full = { ...base, learned: Array.from({ length: MAX_LEARNED_TEMPLATES }, filler) };
    const oldest = full.learned[0];
    const next = learnFromMatch(full, uneven(), 0.2);
    expect(next?.learned).toHaveLength(MAX_LEARNED_TEMPLATES);
    expect(next?.learned).not.toContain(oldest);
    expect(next?.learned?.[0]).toBe(full.learned[1]);
  });
});

describe("noise-adaptive threshold", () => {
  it("is exactly the base threshold in a quiet room", () => {
    expect(noiseAdjustedThreshold(0.6, -70, -20)).toBe(0.6);
  });

  it("relaxes a little, within bounds, for a clear voice over a noisy floor", () => {
    const t = noiseAdjustedThreshold(0.6, -38, -10);
    expect(t).toBeGreaterThan(0.6);
    expect(t).toBeLessThanOrEqual(0.6 + NOISE_RELAX_MAX + 1e-9);
  });

  it("tightens when the voice barely clears the noise (over-counting is the worse error)", () => {
    const t = noiseAdjustedThreshold(0.6, -40, -34);
    expect(t).toBeLessThan(0.6);
    expect(t).toBeGreaterThanOrEqual(0.6 - NOISE_TIGHTEN_MAX - 1e-9);
    expect(noiseAdjustedThreshold(0.6, Number.NaN, -10)).toBe(0.6);
  });
});
