import {
  getBundledEdition,
  getSurahAyahs,
  getSurahByNumber,
  getTransliteration,
} from "@/lib/quran";

import { joinQuranAyahCards, joinQuranAyahRange } from "./quran-ayah-range";

const quran = { getSurahAyahs, getTransliteration, getBundledEdition, getSurahByNumber };

describe("joinQuranAyahRange", () => {
  it("returns Arabic and transliteration for a single ayah", () => {
    const result = joinQuranAyahRange(quran, 1, 1);
    expect(result.arabic).toContain("بِس");
    expect(result.arabic.length).toBeGreaterThan(10);
    expect(result.transliteration.toLowerCase()).toContain("bismi");
  });

  it("joins a multi-ayah range with spaces", () => {
    const result = joinQuranAyahRange(quran, 1, 1, 2);
    const first = joinQuranAyahRange(quran, 1, 1);
    const second = joinQuranAyahRange(quran, 1, 2);
    expect(result.arabic).toBe(`${first.arabic} ${second.arabic}`);
    expect(result.transliteration).toBe(`${first.transliteration} ${second.transliteration}`);
  });
});

describe("joinQuranAyahCards", () => {
  it("returns one card for Ayat al-Kursi", () => {
    const result = joinQuranAyahCards(quran, 2, 255, 255, "en-pickthall");
    expect(result.surah).toBe(2);
    expect(result.ayahs).toHaveLength(1);
    expect(result.ayahs[0]?.ayah).toBe(255);
    expect(result.ayahs[0]?.arabic.length).toBeGreaterThan(20);
    expect(result.ayahs[0]?.translation.length).toBeGreaterThan(10);
  });

  it("returns two cards for the end of Al-Baqarah", () => {
    const result = joinQuranAyahCards(quran, 2, 285, 286, "en-pickthall");
    expect(result.ayahs.map((a) => a.ayah)).toEqual([285, 286]);
  });

  it("returns full Surah al-Ikhlas ayahs", () => {
    const result = joinQuranAyahCards(quran, 112, 1, 4, "en-pickthall");
    expect(result.ayahs).toHaveLength(4);
    expect(result.nameArabic.length).toBeGreaterThan(0);
  });
});
