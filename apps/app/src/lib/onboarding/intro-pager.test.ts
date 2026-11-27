import { isNearbySlide, logicalForOffset, pageIndexForLogical } from "./intro-pager";

describe("isNearbySlide", () => {
  it("mounts the current slide and its direct neighbours only", () => {
    expect([0, 1, 2, 3, 4].map((i) => isNearbySlide(i, 2))).toEqual([
      false,
      true,
      true,
      true,
      false,
    ]);
  });
});

describe("pageIndexForLogical", () => {
  it("is the identity in LTR", () => {
    expect(pageIndexForLogical(1, 6, false)).toBe(1);
  });

  it("mirrors the order in RTL and is its own inverse", () => {
    expect(pageIndexForLogical(0, 6, true)).toBe(5);
    expect(pageIndexForLogical(pageIndexForLogical(2, 6, true), 6, true)).toBe(2);
  });
});

describe("logicalForOffset", () => {
  it("snaps to the nearest page", () => {
    expect(logicalForOffset(390 * 2 + 150, 390, 6, false)).toBe(2);
    expect(logicalForOffset(390 * 2 + 250, 390, 6, false)).toBe(3);
  });

  it("clamps overscroll to the first / last page", () => {
    expect(logicalForOffset(-80, 390, 6, false)).toBe(0);
    expect(logicalForOffset(390 * 9, 390, 6, false)).toBe(5);
  });

  it("maps the LTR offset back to the narrative slide in RTL", () => {
    expect(logicalForOffset(0, 390, 6, true)).toBe(5);
  });
});
