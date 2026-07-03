import {
  getBundledEdition,
  getBundledEditions,
  getSurahAyahs,
  getSurahMeta,
  getTransliteration,
} from "@/lib/quran";

describe("quran bundled data", () => {
  const surahs = getSurahMeta();

  it("has exactly 114 surahs totalling 6236 ayahs", () => {
    expect(surahs).toHaveLength(114);
    const total = surahs.reduce((sum, s) => sum + s.ayahCount, 0);
    expect(total).toBe(6236);
  });

  it("loads Al-Fatihah with correct ayah count and global numbering", () => {
    const ayahs = getSurahAyahs(1);
    expect(ayahs).toHaveLength(7);
    expect(ayahs[0].arabic.length).toBeGreaterThan(0);
    expect(ayahs[0].global).toBe(1);
    expect(ayahs[6].global).toBe(7);
    expect(ayahs.every((a) => a.juz === 1)).toBe(true);
  });

  it("computes juz boundaries and sajda positions", () => {
    // Juz 2 begins at 2:142.
    expect(getSurahAyahs(2)[141].juz).toBe(2);
    // 32:15 is a place of prostration.
    expect(getSurahAyahs(32)[14].sajda).toBe(true);
    expect(getSurahAyahs(1)[0].sajda).toBe(false);
  });

  it("aligns every bundled edition 1:1 with its surah's ayahs", () => {
    const editionIds = getBundledEditions()
      .filter((e) => e.kind === "translation")
      .map((e) => e.id);
    expect(editionIds.length).toBeGreaterThanOrEqual(3);

    for (const n of [1, 2, 18, 114]) {
      const meta = surahs.find((s) => s.number === n);
      if (!meta) throw new Error(`missing surah ${n}`);
      expect(Object.keys(getTransliteration(n))).toHaveLength(meta.ayahCount);
      for (const id of editionIds) {
        expect(Object.keys(getBundledEdition(id, n))).toHaveLength(meta.ayahCount);
      }
    }
  });
});
