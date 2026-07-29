import { normalizeAyahWordSegments } from "@/api/quran-words";
import { activeWordIndexAt } from "@/lib/quran-word-timing";

describe("normalizeAyahWordSegments", () => {
  it("shifts chapter-absolute timings to ayah-relative ms", () => {
    expect(normalizeAyahWordSegments(6090, [[1, 6025, 7025], [2, 7025, 7885], [1]])).toEqual([
      [1, 0, 935],
      [2, 935, 1795],
    ]);
  });
});

describe("activeWordIndexAt", () => {
  const segments: Array<[number, number, number]> = [
    [1, 0, 580],
    [2, 580, 1409],
    [3, 1409, 2502],
    [4, 2502, 5840],
  ];

  it("maps playback time onto the matching word segment", () => {
    expect(activeWordIndexAt(0.1, segments)).toBe(0);
    expect(activeWordIndexAt(1.0, segments)).toBe(1);
    expect(activeWordIndexAt(2.0, segments)).toBe(2);
    expect(activeWordIndexAt(3.0, segments)).toBe(3);
  });

  it("keeps the last word after the final segment starts", () => {
    expect(activeWordIndexAt(6.0, segments, { wordCount: 4 })).toBe(3);
  });

  it("falls back to a proportional split when segments are missing", () => {
    expect(activeWordIndexAt(0.1, null, { wordCount: 4, durationSec: 4 })).toBe(0);
    expect(activeWordIndexAt(1.5, null, { wordCount: 4, durationSec: 4 })).toBe(1);
    expect(activeWordIndexAt(3.5, null, { wordCount: 4, durationSec: 4 })).toBe(3);
  });
});
