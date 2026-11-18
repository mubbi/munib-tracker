import { getPageForAyah } from "@/lib/quran-meta";

import {
  ayahCount,
  clampPassage,
  isPracticeMode,
  isSessionMode,
  modeNeedsListener,
  pageRangeInSurah,
  parsePassage,
  passageAyahs,
  passageForPreset,
  totalPages,
} from "./passage";

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

describe("passage helpers — edge cases", () => {
  it.each([
    [{ surah: "abc" }],
    [{ surah: 0 }],
    [{ surah: 115 }],
    [{ surah: 1, from: 0 }],
    [{ surah: 1, from: 3, to: 2 }],
  ])("rejects %o", (params) => {
    expect(parsePassage(params)).toBeNull();
  });

  it("defaults the range to the first ayah", () => {
    expect(parsePassage({ surah: "2" })).toEqual({ surah: 2, ayahStart: 1, ayahEnd: 1 });
  });

  it("clamps an overlong passage and lists its ayahs", () => {
    const clamped = clampPassage({ surah: 1, ayahStart: 5, ayahEnd: 99 });
    expect(clamped).toEqual({ surah: 1, ayahStart: 5, ayahEnd: 7 });
    expect(passageAyahs(clamped as NonNullable<typeof clamped>)).toEqual([5, 6, 7]);
  });

  it("knows surah lengths, and 0 for unknown surahs", () => {
    expect(ayahCount(1)).toBe(7);
    expect(ayahCount(999)).toBe(0);
    expect(totalPages()).toBe(604);
  });

  it("finds the ayahs of a surah on a mushaf page", () => {
    const page = getPageForAyah(2, 6);
    const range = pageRangeInSurah(2, page);
    expect(range?.ayahStart).toBeLessThanOrEqual(6);
    expect(range?.ayahEnd).toBeGreaterThanOrEqual(6);
    expect(pageRangeInSurah(2, 600)).toBeNull();
    expect(pageRangeInSurah(999, 1)).toBeNull();
  });

  it("builds single-ayah and page presets", () => {
    expect(passageForPreset("ayah", 1, 99)).toEqual({ surah: 1, ayahStart: 7, ayahEnd: 7 });
    expect(passageForPreset("page", 2, 6)?.ayahStart).toBeLessThanOrEqual(6);
    expect(passageForPreset("page", 2, 6, 600)).toEqual({ surah: 2, ayahStart: 6, ayahEnd: 6 });
  });

  it("returns null for unknown surahs or presets", () => {
    expect(passageForPreset("ayah", 999, 1)).toBeNull();
    expect(passageForPreset("nope" as never, 1, 1)).toBeNull();
  });

  it.each([
    ["follow", true, true, false],
    ["hide-ayahs", true, true, true],
    ["revision", false, true, true],
    ["nope", false, false, true],
  ])("classifies mode %s", (mode, practice, session, needsListener) => {
    expect(isPracticeMode(mode)).toBe(practice);
    expect(isSessionMode(mode)).toBe(session);
    expect(modeNeedsListener(mode as never)).toBe(needsListener);
  });
});
