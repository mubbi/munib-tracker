import {
  getAyahsOnPage,
  getBundledEdition,
  getBundledEditions,
  getJuzList,
  getPageCount,
  getPageLayout,
  getSurahAyahs,
  getSurahMeta,
  getTransliteration,
  isBundledEdition,
  juzForAyah,
  parseVerseRange,
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

  it("lists all 30 juz with correct start surah:ayah and resolved names", () => {
    const list = getJuzList();
    expect(list).toHaveLength(30);
    expect(list[0]).toMatchObject({ juz: 1, surah: 1, ayah: 1 });
    // Juz 2 begins at 2:142, Juz 30 at 78:1 — the two canonical anchors.
    expect(list[1]).toMatchObject({ juz: 2, surah: 2, ayah: 142 });
    expect(list[29]).toMatchObject({ juz: 30, surah: 78, ayah: 1 });
    expect(list.every((e) => e.surahNameTransliteration.length > 0)).toBe(true);
    // Each entry's start ayah must actually fall in that juz.
    expect(list.every((e) => juzForAyah(e.surah, e.ayah) === e.juz)).toBe(true);
  });

  it("aligns every bundled edition 1:1 with its surah's ayahs", () => {
    const editionIds = getBundledEditions()
      .filter((e) => e.kind === "translation")
      .map((e) => e.id);
    // Offline defaults only — other locales fetch via CDN (quran-remote).
    expect(editionIds).toEqual(expect.arrayContaining(["en-pickthall", "ur-jalandhry"]));
    expect(editionIds).toHaveLength(2);

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

describe("mushaf pages", () => {
  it("has 604 pages", () => {
    expect(getPageCount()).toBe(604);
  });

  it("returns the ayahs printed on a page", () => {
    const refs = getAyahsOnPage(1).map((a) => `${a.surah}:${a.ayah}`);
    expect(refs).toEqual(["1:1", "1:2", "1:3", "1:4", "1:5", "1:6", "1:7"]);
  });

  it("starts mid-surah and stops at the next page", () => {
    const ayahs = getAyahsOnPage(2);
    expect(`${ayahs[0].surah}:${ayahs[0].ayah}`).toBe("2:1");
    expect(ayahs.every((a) => a.page === 2)).toBe(true);
  });

  it("reads the final page through the end of the Qur'an", () => {
    const ayahs = getAyahsOnPage(604);
    expect(ayahs.at(-1)).toMatchObject({ surah: 114, ayah: 6 });
  });

  it.each([0, 605])("returns no ayahs for page %i", (page) => {
    expect(getAyahsOnPage(page)).toEqual([]);
  });

  it("loads and memoises a page layout", () => {
    const layout = getPageLayout(1);
    expect(getPageLayout(1)).toBe(layout);
  });

  it("throws for a page without a layout", () => {
    expect(() => getPageLayout(9999)).toThrow("missing mushaf layout for page 9999");
  });
});

describe("bundled editions", () => {
  it.each([
    ["en-transliteration", true],
    ["en-pickthall", true],
    ["fr-hamidullah", false],
  ])("isBundledEdition(%s) → %p", (id, expected) => {
    expect(isBundledEdition(id)).toBe(expected);
  });

  it("serves transliteration as an edition", () => {
    expect(getBundledEdition("en-transliteration", 1)).toBe(getTransliteration(1));
  });

  it("returns an empty map for an edition that is not bundled", () => {
    expect(getBundledEdition("fr-hamidullah", 1)).toEqual({});
  });

  it("reuses the cached translation", () => {
    expect(getBundledEdition("en-pickthall", 112)).toBe(getBundledEdition("en-pickthall", 112));
  });

  it("evicts the oldest surahs beyond the cache cap without losing data", () => {
    for (let surah = 80; surah <= 114; surah++) getTransliteration(surah);
    for (let surah = 80; surah <= 110; surah++) getBundledEdition("ur-jalandhry", surah);
    expect(Object.keys(getTransliteration(80))).toHaveLength(42);
  });
});

describe("parseVerseRange", () => {
  it.each([
    [undefined, []],
    ["", []],
    ["2:255", [{ surah: 2, ayah: 255 }]],
    [
      "2:285-2:286",
      [
        { surah: 2, ayah: 285 },
        { surah: 2, ayah: 286 },
      ],
    ],
    [
      "1:7-2:1",
      [
        { surah: 1, ayah: 7 },
        { surah: 2, ayah: 1 },
      ],
    ],
  ])("parses %p", (range, expected) => {
    expect(parseVerseRange(range)).toEqual(expected);
  });

  it("spans whole surahs between the endpoints", () => {
    const refs = parseVerseRange("112:4-114:1");
    expect(refs.map((r) => `${r.surah}:${r.ayah}`)).toEqual([
      "112:4",
      "113:1",
      "113:2",
      "113:3",
      "113:4",
      "113:5",
      "114:1",
    ]);
  });
});
