import {
  globalAyahToRef,
  juzPassage,
  khatmPortionPassage,
  parseQuranReference,
  partPassage,
  passageInSpan,
} from "./quran-ref-parse";

describe("parseQuranReference", () => {
  it("reads a single-ayah Qur'an citation", () => {
    expect(parseQuranReference("Quran 2:201")).toEqual({ surah: 2, ayahStart: 201, ayahEnd: 201 });
    expect(parseQuranReference("Qur'an 7:23")).toEqual({ surah: 7, ayahStart: 23, ayahEnd: 23 });
  });

  it("reads ranges and ignores trailing sources", () => {
    expect(parseQuranReference("Quran 2:285-286 · Bukhari 5009")).toEqual({
      surah: 2,
      ayahStart: 285,
      ayahEnd: 286,
    });
    expect(parseQuranReference("Quran 21:87 · Tirmidhi")).toEqual({
      surah: 21,
      ayahStart: 87,
      ayahEnd: 87,
    });
    expect(parseQuranReference("Quran 43:13–14")).toEqual({
      surah: 43,
      ayahStart: 13,
      ayahEnd: 14,
    });
  });

  it("rejects non-Qur'an and out-of-range references", () => {
    expect(parseQuranReference("Muslim")).toBeNull();
    expect(parseQuranReference("Tirmidhi 3433 · An-Nasa'i 1344")).toBeNull();
    expect(parseQuranReference("Quran 67")).toBeNull();
    expect(parseQuranReference("Quran 1:8")).toBeNull();
    expect(parseQuranReference("Quran 115:1")).toBeNull();
    expect(parseQuranReference("Quran 2:10-5")).toBeNull();
    expect(parseQuranReference(undefined)).toBeNull();
  });
});

describe("globalAyahToRef", () => {
  it("maps global ayah numbers to surah:ayah", () => {
    expect(globalAyahToRef(1)).toEqual({ surah: 1, ayah: 1 });
    expect(globalAyahToRef(7)).toEqual({ surah: 1, ayah: 7 });
    expect(globalAyahToRef(8)).toEqual({ surah: 2, ayah: 1 });
    expect(globalAyahToRef(6236)).toEqual({ surah: 114, ayah: 6 });
  });

  it("returns null out of range", () => {
    expect(globalAyahToRef(0)).toBeNull();
    expect(globalAyahToRef(6237)).toBeNull();
  });
});

describe("passageInSpan", () => {
  it("stops before the exclusive end in the same surah", () => {
    expect(passageInSpan({ surah: 2, ayah: 142 }, { surah: 2, ayah: 253 })).toEqual({
      surah: 2,
      ayahStart: 142,
      ayahEnd: 252,
    });
  });

  it("runs to the end of the surah when the span crosses a boundary", () => {
    expect(passageInSpan({ surah: 1, ayah: 1 }, { surah: 2, ayah: 142 })).toEqual({
      surah: 1,
      ayahStart: 1,
      ayahEnd: 7,
    });
    expect(passageInSpan({ surah: 114, ayah: 1 }, null)).toEqual({
      surah: 114,
      ayahStart: 1,
      ayahEnd: 6,
    });
  });

  it("rejects invalid starts", () => {
    expect(passageInSpan({ surah: 1, ayah: 9 })).toBeNull();
    expect(passageInSpan({ surah: 2, ayah: 5 }, { surah: 2, ayah: 5 })).toBeNull();
  });
});

describe("juzPassage", () => {
  it("covers the first surah share of a juz", () => {
    expect(juzPassage(1)).toEqual({ surah: 1, ayahStart: 1, ayahEnd: 7 });
    expect(juzPassage(2)).toEqual({ surah: 2, ayahStart: 142, ayahEnd: 252 });
    expect(juzPassage(30)).toEqual({ surah: 78, ayahStart: 1, ayahEnd: 40 });
  });

  it("returns null for an unknown juz", () => {
    expect(juzPassage(0)).toBeNull();
    expect(juzPassage(31)).toBeNull();
  });
});

describe("khatmPortionPassage", () => {
  it("ayah plans: next unread ayah up to today's target", () => {
    expect(khatmPortionPassage("ayah", 7, 10)).toEqual({ surah: 2, ayahStart: 1, ayahEnd: 10 });
  });

  it("ayah plans: a portion crossing surahs stops at the surah end", () => {
    expect(khatmPortionPassage("ayah", 0, 208)).toEqual({ surah: 1, ayahStart: 1, ayahEnd: 7 });
  });

  it("ayah plans: finished → null", () => {
    expect(khatmPortionPassage("ayah", 6236, 208)).toBeNull();
  });

  it("page plans: from the next unread page start", () => {
    const p = khatmPortionPassage("page", 1, 1);
    expect(p).toEqual({ surah: 2, ayahStart: 1, ayahEnd: 5 });
  });

  it("page plans: the last page runs to the end of its surah", () => {
    const p = khatmPortionPassage("page", 603, 20);
    expect(p?.surah).toBeGreaterThanOrEqual(112);
    expect(khatmPortionPassage("page", 604, 20)).toBeNull();
  });
});

describe("partPassage", () => {
  it("builds a part's first passage from its start and the next part start", () => {
    expect(partPassage({ surah: 18, ayah: 1 }, { surah: 19, ayah: 1 })).toEqual({
      surah: 18,
      ayahStart: 1,
      ayahEnd: 110,
    });
    expect(partPassage(null, null)).toBeNull();
  });
});
