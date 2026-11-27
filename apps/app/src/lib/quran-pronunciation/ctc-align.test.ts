import {
  READ_CLEAR,
  READ_OTHER,
  READ_PADDED,
  READ_SKIPPED,
  READ_SUBSTITUTED,
  TOY_PIECES,
  toyAyah,
  toyLogprobs,
} from "@/test-support/quran-pronunciation";

import { buildLattice } from "./ayah-tokens";
import { forceAlign } from "./ctc-align";

const lattice = () => {
  const l = buildLattice(toyAyah().words, TOY_PIECES);
  if (!l) throw new Error("unspellable");
  return l;
};

describe("forceAlign (NF-3.24 CTC forced alignment)", () => {
  it("builds a lattice that accepts every segmentation of the text", () => {
    const l = lattice();
    expect(l.text).toBe(" بسم ربك قل");
    expect(l.wordStarts).toEqual([0, 4, 8]);
    // " ربك" can be one piece or " ر" + "بك".
    expect(l.edges).toEqual(
      expect.arrayContaining([
        [4, 3, 4],
        [4, 6, 2],
        [6, 7, 2],
      ]),
    );
  });

  it("aligns a clear reading on the expected pieces with a near-zero score", () => {
    const a = forceAlign(toyLogprobs(READ_CLEAR), lattice(), TOY_PIECES);
    expect(a).not.toBeNull();
    expect(a?.emissions.map((e) => e.pieceId)).toEqual([1, 2, 3, 4]);
    expect(a?.emissions.map((e) => e.startFrame)).toEqual([1, 3, 6, 9]);
    expect(a?.score).toBeGreaterThan(-0.5);
  });

  it("still spells the whole text for a substituted word, on a costly frame", () => {
    const a = forceAlign(toyLogprobs(READ_SUBSTITUTED), lattice(), TOY_PIECES);
    expect(a?.emissions.at(-1)?.pieceId).toBe(4);
    expect(a?.score).toBeLessThan(-0.5);
  });

  it("forces a skipped word's pieces somewhere (they score badly)", () => {
    const a = forceAlign(toyLogprobs(READ_SKIPPED), lattice(), TOY_PIECES);
    expect(a).not.toBeNull();
    const ids = a?.emissions.map((e) => e.pieceId) ?? [];
    expect(ids[0]).toBe(1);
    expect(ids.at(-1)).toBe(4);
    expect(ids.some((id) => id === 3 || id === 6)).toBe(true);
  });

  it("lets leading / trailing silence and noise fall outside the ayah", () => {
    const a = forceAlign(toyLogprobs(READ_PADDED), lattice(), TOY_PIECES);
    expect(a?.emissions.map((e) => e.pieceId)).toEqual([1, 2, 3, 4]);
    expect(a?.score).toBeGreaterThan(-0.5);
  });

  it("scores a different passage very low", () => {
    const a = forceAlign(toyLogprobs(READ_OTHER), lattice(), TOY_PIECES);
    expect(a?.score ?? Number.NEGATIVE_INFINITY).toBeLessThan(-2);
  });

  it("returns null when the take is too short to hold the ayah", () => {
    expect(forceAlign(toyLogprobs([1, 2]), lattice(), TOY_PIECES)).toBeNull();
  });
});
