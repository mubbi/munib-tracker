import { activeWordIndexAt } from "@/lib/quran-word-timing";

describe("activeWordIndexAt", () => {
  const segments: Array<[number, number, number]> = [
    [1, 0, 500],
    [2, 500, 1000],
    [3, 1200, 1800],
  ];

  it("returns the word whose segment contains the playback time", () => {
    expect(activeWordIndexAt(0, segments)).toBe(0);
    expect(activeWordIndexAt(0.75, segments)).toBe(1);
    expect(activeWordIndexAt(1.5, segments)).toBe(2);
  });

  it("clamps negative time to the first segment", () => {
    expect(activeWordIndexAt(-3, segments)).toBe(0);
  });

  it("holds the last started word in gaps and after the end", () => {
    expect(activeWordIndexAt(1.1, segments)).toBe(1);
    expect(activeWordIndexAt(5, segments)).toBe(2);
  });

  it("caps the held word at wordCount - 1", () => {
    expect(activeWordIndexAt(5, segments, { wordCount: 2 })).toBe(1);
    expect(activeWordIndexAt(5, segments, { wordCount: 0 })).toBe(2);
  });

  it("falls back to sequence order when wordSeq is missing", () => {
    const loose = [[undefined, 0, 100]] as unknown as Array<[number, number, number]>;
    expect(activeWordIndexAt(0.05, loose)).toBe(0);
    expect(activeWordIndexAt(1, loose)).toBe(0);
  });

  it("splits evenly by duration when segments are missing or not yet started", () => {
    expect(activeWordIndexAt(0, null, { wordCount: 4, durationSec: 8 })).toBe(0);
    expect(activeWordIndexAt(5, undefined, { wordCount: 4, durationSec: 8 })).toBe(2);
    expect(activeWordIndexAt(99, [], { wordCount: 4, durationSec: 8 })).toBe(3);
    expect(activeWordIndexAt(-1, [], { wordCount: 4, durationSec: 8 })).toBe(0);
    expect(activeWordIndexAt(0.1, [[1, 500, 900]], { wordCount: 4, durationSec: 8 })).toBe(0);
  });

  it("returns null without usable timing", () => {
    expect(activeWordIndexAt(1, null)).toBeNull();
    expect(activeWordIndexAt(1, null, { wordCount: 4 })).toBeNull();
    expect(activeWordIndexAt(1, null, { wordCount: 4, durationSec: 0.2 })).toBeNull();
    expect(activeWordIndexAt(1, null, { wordCount: 0, durationSec: 5 })).toBeNull();
    expect(activeWordIndexAt(0.1, [[1, 500, 900]])).toBeNull();
  });
});
