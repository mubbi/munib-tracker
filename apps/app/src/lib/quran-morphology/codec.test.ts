import {
  countLocations,
  decodeLocations,
  encodeLocations,
  packLocation,
  unpackLocation,
} from "./codec";

describe("packed occurrence codec", () => {
  it.each([
    [1, 1, 1],
    [2, 282, 128],
    [114, 6, 3],
    [2, 286, 255],
  ])("packs and unpacks %i:%i:%i", (surah, ayah, word) => {
    expect(unpackLocation(packLocation(surah, ayah, word))).toEqual({ surah, ayah, word });
  });

  it("sorts packed codes in reading order", () => {
    expect(packLocation(1, 7, 9)).toBeLessThan(packLocation(2, 1, 1));
    expect(packLocation(2, 5, 9)).toBeLessThan(packLocation(2, 6, 1));
  });

  it("round-trips a list (sorted, duplicates kept)", () => {
    const codes = [packLocation(2, 3, 1), packLocation(1, 1, 3), packLocation(1, 1, 3)];
    const packed = encodeLocations(codes);
    expect(decodeLocations(packed)).toEqual([...codes].sort((a, b) => a - b));
    expect(countLocations(packed)).toBe(3);
  });

  it("delta-encodes dense lists compactly", () => {
    const codes = Array.from({ length: 50 }, (_, i) => packLocation(1, 1, i + 1));
    expect(encodeLocations(codes).length).toBeLessThan(150);
  });

  it("handles the empty list", () => {
    expect(encodeLocations([])).toBe("");
    expect(decodeLocations("")).toEqual([]);
    expect(countLocations("")).toBe(0);
  });
});
