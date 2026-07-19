import { getSurahAyahs, getTransliteration } from "@/lib/quran";

import { joinQuranAyahRange } from "./quran-ayah-range";

const quran = { getSurahAyahs, getTransliteration };

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
