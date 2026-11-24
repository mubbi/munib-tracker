import { TOY_THRESHOLDS } from "@/test-support/quran-pronunciation";

import { offsetFromCalibrationRead, sanitizeDeviceCalibration } from "./calibration";
import { emissionGop, equivalentIds } from "./gop";
import type { WordScore } from "./types";
import { clampCalibrationOffset, combineStates, flaggedShare, wordVerdict } from "./verdict";

const score = (gops: number[], chars = 4): WordScore => ({
  word: 0,
  gops,
  minGop: Math.min(...gops),
  meanGop: gops.reduce((a, b) => a + b, 0) / gops.length,
  startFrame: 0,
  endFrame: 1,
  chars,
});

describe("wordVerdict (NF-3.24 thresholds)", () => {
  it("is Clear only when every piece is at or above the Clear threshold", () => {
    expect(wordVerdict(score([2, 1]), TOY_THRESHOLDS, "full")).toBe("clear");
    expect(wordVerdict(score([2, 0.5]), TOY_THRESHOLDS, "full")).toBe("not-sure");
  });

  it("is Listen again when one piece is clearly below (full mode)", () => {
    expect(wordVerdict(score([4, -3.5]), TOY_THRESHOLDS, "full")).toBe("listen-again");
  });

  it("falls back to Not sure for that piece in skipped-only mode", () => {
    expect(wordVerdict(score([4, -3.5]), TOY_THRESHOLDS, "skipped-only")).toBe("not-sure");
  });

  it("flags a word that looks skipped in both modes", () => {
    expect(wordVerdict(score([-6, -6]), TOY_THRESHOLDS, "skipped-only")).toBe("listen-again");
    expect(wordVerdict(score([-6, -6]), TOY_THRESHOLDS, "full")).toBe("listen-again");
  });

  it("never flags a very short word — Not sure instead", () => {
    expect(wordVerdict(score([-6], 1), TOY_THRESHOLDS, "full")).toBe("not-sure");
  });

  it("keeps in-between evidence Not sure (the default)", () => {
    expect(wordVerdict(score([0]), TOY_THRESHOLDS, "full")).toBe("not-sure");
  });

  it("only relaxes with the device offset (never more flags)", () => {
    expect(clampCalibrationOffset(2)).toBe(0);
    expect(clampCalibrationOffset(-10)).toBe(-3);
    expect(clampCalibrationOffset(Number.NaN)).toBe(0);
    expect(wordVerdict(score([4, -3.5]), TOY_THRESHOLDS, "full", -1)).toBe("not-sure");
  });

  it("combines engine words worst-first and measures the flagged share", () => {
    expect(combineStates(["clear", "not-sure"])).toBe("not-sure");
    expect(combineStates(["clear", "listen-again", "not-sure"])).toBe("listen-again");
    expect(combineStates([])).toBe("not-sure");
    expect(flaggedShare(["clear", "listen-again"])).toBe(0.5);
  });
});

describe("GOP", () => {
  it("is the piece's margin over the best non-equivalent competitor", () => {
    const V = 4;
    // frame: piece 1 = log .7, piece 2 (equivalent spelling) = log .2, piece 3 = log .1
    const logprobs = Float32Array.from([-10, Math.log(0.7), Math.log(0.2), Math.log(0.1)]);
    const matrix = { logprobs, timeSteps: 1, vocabSize: V };
    const emission = { edge: 0, pieceId: 1, pos: 0, end: 2, startFrame: 0, endFrame: 0 };
    const excluded = equivalentIds(
      {
        text: " ب",
        wordStarts: [0],
        edges: [
          [0, 1, 2],
          [0, 2, 2],
        ],
      },
      emission,
    );
    expect(excluded).toEqual(new Set([1, 2]));
    const gop = emissionGop(matrix, emission, excluded, { blankId: 0, fillers: [] });
    expect(gop).toBeCloseTo(Math.log(0.7) - Math.log(0.1), 5);
  });
});

describe("device calibration read", () => {
  it("needs a few words before saving anything", () => {
    expect(offsetFromCalibrationRead([score([2]), score([2])], 1)).toEqual({
      ok: false,
      reason: "not-enough",
    });
  });

  it("keeps 0 when the read is already clear", () => {
    expect(offsetFromCalibrationRead([score([3]), score([4]), score([5])], 1)).toEqual({
      ok: true,
      offset: 0,
    });
  });

  it("relaxes (≤ 0, bounded) when the reader's weaker words sit below Clear", () => {
    const out = offsetFromCalibrationRead([score([-1]), score([2]), score([3]), score([4])], 1);
    expect(out).toEqual({ ok: true, offset: -2.5 });
  });

  it("sanitizes the stored value", () => {
    expect(sanitizeDeviceCalibration({ offset: 9, at: "x" })).toEqual({ offset: 0, at: "x" });
    expect(sanitizeDeviceCalibration({ offset: "a" })).toBeNull();
    expect(sanitizeDeviceCalibration(null)).toBeNull();
  });
});
