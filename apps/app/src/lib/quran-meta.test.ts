import { describe, expect, it } from "@jest/globals";

import {
  getPageForAyah,
  getSurahByNumber,
  getSurahMeta,
  juzForAyah,
  pos,
  SAJDA_AYAHS,
} from "./quran-meta";

describe("quran-meta surah helpers", () => {
  it("returns 114 surahs from meta", () => {
    expect(getSurahMeta()).toHaveLength(114);
  });

  it("looks up Al-Fatihah by number", () => {
    const surah = getSurahByNumber(1);
    expect(surah?.nameTransliteration).toBe("Al-Fatihah");
    expect(surah?.ayahCount).toBe(7);
  });

  it("returns undefined for invalid surah numbers", () => {
    expect(getSurahByNumber(0)).toBeUndefined();
    expect(getSurahByNumber(115)).toBeUndefined();
  });
});

describe("juzForAyah", () => {
  it("returns juz 1 for the opening ayah", () => {
    expect(juzForAyah(1, 1)).toBe(1);
  });

  it("returns juz 2 for Al-Baqarah 142", () => {
    expect(juzForAyah(2, 142)).toBe(2);
  });
});

describe("pos", () => {
  it("encodes surah and ayah into a sortable integer", () => {
    expect(pos(2, 255)).toBe(2255);
    expect(pos(112, 1)).toBe(112001);
  });
});

describe("getPageForAyah", () => {
  it("returns mushaf page for Ayat al-Kursi", () => {
    const page = getPageForAyah(2, 255);
    expect(page).toBeGreaterThan(0);
    expect(page).toBeLessThanOrEqual(604);
  });
});

describe("SAJDA_AYAHS", () => {
  it("includes all fifteen prostration ayahs", () => {
    expect(SAJDA_AYAHS.size).toBe(15);
    expect(SAJDA_AYAHS.has(pos(96, 19))).toBe(true);
    expect(SAJDA_AYAHS.has(pos(1, 1))).toBe(false);
  });
});
