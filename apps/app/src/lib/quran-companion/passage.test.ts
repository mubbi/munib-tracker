import { parsePassage, passageForPreset } from "./passage";

describe("passage helpers", () => {
  it("validates route params", () => {
    expect(parsePassage({ surah: "1", from: "2", to: "4" })).toEqual({
      surah: 1,
      ayahStart: 2,
      ayahEnd: 4,
    });
    expect(parsePassage({ surah: "115", from: "1" })).toBeNull();
    expect(parsePassage({ surah: "1", from: "5", to: "3" })).toBeNull();
    expect(parsePassage({ surah: "1", from: "8" })).toBeNull();
    expect(parsePassage({ surah: "abc" })).toBeNull();
  });

  it("clamps the end of a range to the surah", () => {
    expect(parsePassage({ surah: "1", from: "6", to: "20" })).toEqual({
      surah: 1,
      ayahStart: 6,
      ayahEnd: 7,
    });
  });

  it("Next 5 stops at the last ayah of the surah", () => {
    expect(passageForPreset("next5", 1, 5)).toEqual({ surah: 1, ayahStart: 5, ayahEnd: 7 });
    expect(passageForPreset("next5", 2, 1)).toEqual({ surah: 2, ayahStart: 1, ayahEnd: 5 });
  });

  it("This surah covers the whole surah", () => {
    expect(passageForPreset("surah", 112, 3)).toEqual({ surah: 112, ayahStart: 1, ayahEnd: 4 });
  });
});
