import { ARABIC_ZWJ, shouldJoinArabicSegments, withArabicJoiningZwj } from "@/lib/arabic-text-join";

describe("shouldJoinArabicSegments", () => {
  it("joins within a word across colour boundaries", () => {
    expect(shouldJoinArabicSegments("ٱل", "عَـٰلَمِينَ")).toBe(true);
    expect(shouldJoinArabicSegments("ٱ", "للَّهِ")).toBe(true);
  });

  it("does not join across whitespace", () => {
    expect(shouldJoinArabicSegments("بِسْمِ ", "ٱ")).toBe(false);
    expect(shouldJoinArabicSegments("ٱ", " للَّهِ")).toBe(false);
  });

  it("rejects empty edges", () => {
    expect(shouldJoinArabicSegments("", "ٱ")).toBe(false);
    expect(shouldJoinArabicSegments("ٱ", "")).toBe(false);
  });
});

describe("withArabicJoiningZwj", () => {
  it("appends ZWJ only between joinable runs", () => {
    // Live-style Bismillah segments from quran-tajweed markup.
    const texts = ["بِسْمِ ", "ٱ", "للَّهِ ", "ٱ", "ل", "رَّحْمَ", "ـٰ", "نِ"];
    expect(withArabicJoiningZwj(texts)).toEqual([
      "بِسْمِ ",
      `ٱ${ARABIC_ZWJ}`,
      "للَّهِ ",
      `ٱ${ARABIC_ZWJ}`,
      `ل${ARABIC_ZWJ}`,
      `رَّحْمَ${ARABIC_ZWJ}`,
      `ـٰ${ARABIC_ZWJ}`,
      "نِ",
    ]);
  });

  it("leaves a single segment unchanged", () => {
    expect(withArabicJoiningZwj(["بِسْمِ"])).toEqual(["بِسْمِ"]);
  });
});
