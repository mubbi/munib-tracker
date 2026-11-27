import {
  SAID_AB,
  TOY_AB,
  TOY_BLANK,
  TOY_CD,
  TOY_FILLER,
  TOY_SPOTTER_VOCAB,
  toyLogprobs,
} from "@/test-support/tasbeeh-voice";

import { greedyChars, greedyFuzzySpot, spotPhrase } from "./ctc-keyword-spotter";
import { mergeHits } from "./hit-dedupe";

const STRICT = { minScore: -0.5 };
const count = (frames: readonly (number | null)[], phrase = TOY_AB, minScore = -0.5) =>
  mergeHits(
    spotPhrase(toyLogprobs(frames), phrase, TOY_SPOTTER_VOCAB, { minScore }).map((h) => ({
      startMs: h.startFrame * 80,
      endMs: (h.endFrame + 1) * 80,
      score: h.score,
    })),
    160,
  ).length;

describe("ctc keyword spotter", () => {
  it("finds a single phrase with a near-zero likelihood ratio", () => {
    const hits = spotPhrase(toyLogprobs(SAID_AB), TOY_AB, TOY_SPOTTER_VOCAB, STRICT);
    expect(hits.length).toBeGreaterThan(0);
    const best = hits.reduce((a, b) => (b.score > a.score ? b : a));
    expect(best.score).toBeCloseTo(0, 5);
    expect(best.startFrame).toBe(1);
    expect(best.endFrame).toBe(4);
    expect(count(SAID_AB)).toBe(1);
  });

  it("accepts any segmentation of the phrase (one piece or two)", () => {
    expect(count([null, 3, 3, null])).toBe(1);
  });

  it("allows harakat-only pieces inside the phrase", () => {
    expect(count([null, 1, TOY_FILLER, 2, null])).toBe(1);
  });

  it("counts back-to-back repeats with no pause between them", () => {
    expect(count([1, 2, 1, 2, 1, 2])).toBe(3);
    expect(count([null, 1, 1, 2, 1, 2, null, 3, null])).toBe(3);
  });

  it("does not count a different phrase", () => {
    expect(count([null, 5, 5, 6, null], TOY_AB)).toBe(0);
    expect(count(SAID_AB, TOY_CD)).toBe(0);
  });

  it("does not count half a phrase", () => {
    expect(count([null, 1, 1, null, null])).toBe(0);
  });

  it("never counts silence", () => {
    expect(count(new Array(40).fill(null))).toBe(0);
    expect(count(new Array(40).fill(TOY_BLANK))).toBe(0);
  });

  it("rejects a mumbled phrase at Strict but finds it with a loose gate", () => {
    // The pieces are only weakly present: a competing piece (5) wins most frames.
    const frames = toyLogprobs([null, 5, 1, 5, 2, null]);
    expect(spotPhrase(frames, TOY_AB, TOY_SPOTTER_VOCAB, STRICT)).toHaveLength(0);
    expect(spotPhrase(frames, TOY_AB, TOY_SPOTTER_VOCAB, { minScore: -5 }).length).toBeGreaterThan(
      0,
    );
  });
});

describe("greedy + fuzzy alternative (spike S1)", () => {
  const PIECES: Record<number, string> = { 1: " a", 2: "b", 3: " ab", 5: " c", 6: "d" };
  const text = (id: number) => PIECES[id] ?? "";

  it("finds repeats in the greedy character stream", () => {
    const stream = greedyChars(toyLogprobs([1, 2, null, 1, 2]), text, TOY_BLANK);
    expect(greedyFuzzySpot(stream, " ab", 0)).toHaveLength(2);
  });

  it("does not match another phrase exactly", () => {
    const stream = greedyChars(toyLogprobs([5, 6]), text, TOY_BLANK);
    expect(greedyFuzzySpot(stream, " ab", 0)).toHaveLength(0);
  });
});
