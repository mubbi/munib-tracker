import type { MushafPageLayout } from "@munib-tracker/shared/types";

import { mapMushafTokens } from "./mushaf-tokens";

// Real bundled layouts (madinah-15) for pages 1 and 2.
const PAGE_1: MushafPageLayout = {
  page: 1,
  lines: [
    { type: "surah_name", surah: 1, text: "سُورَةُ ٱلْفَاتِحَةِ" },
    { type: "text", alignment: "centered", glyphs: "ﱁ ﱂ ﱃ ﱄ ﱅ", verseRange: "1:1-1:1" },
    { type: "text", alignment: "centered", glyphs: "ﱆ ﱇ ﱈ ﱉ ﱊ", verseRange: "1:2-1:2" },
    { type: "text", alignment: "centered", glyphs: "ﱋ ﱌ ﱍ ﱎ ﱏ ﱐ ﱑ", verseRange: "1:3-1:4" },
    { type: "text", alignment: "centered", glyphs: "ﱒ ﱓ ﱔ ﱕ ﱖ ﱗ", verseRange: "1:5-1:6" },
    { type: "text", alignment: "centered", glyphs: "ﱘ ﱙ ﱚ ﱛ ﱜ ﱝ", verseRange: "1:6-1:7" },
    { type: "text", alignment: "centered", glyphs: "ﱞ ﱟ ﱠ ﱡ", verseRange: "1:7-1:7" },
    { type: "text", alignment: "centered", glyphs: "ﱢ ﱣ ﱤ", verseRange: "1:7-1:7" },
  ],
};

const PAGE_2: MushafPageLayout = {
  page: 2,
  lines: [
    { type: "surah_name", surah: 2, text: "سورة البقرة" },
    { type: "basmala", glyphs: "ﭑﭒﭓ" },
    { type: "text", alignment: "centered", glyphs: "ﱁ ﱂ ﱃ ﱄ ﱅ ﱆﱇ ﱈﱉ ﱊ", verseRange: "2:1-2:2" },
    { type: "text", alignment: "centered", glyphs: "ﱋ ﱌ ﱍ ﱎ ﱏ ﱐ ﱑ", verseRange: "2:2-2:3" },
    { type: "text", alignment: "centered", glyphs: "ﱒ ﱓ ﱔ ﱕ ﱖ ﱗ ﱘ ﱙ", verseRange: "2:3-2:4" },
    { type: "text", alignment: "centered", glyphs: "ﱚ ﱛ ﱜ ﱝ ﱞ ﱟ ﱠ ﱡ ﱢ", verseRange: "2:4-2:4" },
    { type: "text", alignment: "centered", glyphs: "ﱣ ﱤ ﱥ ﱦ ﱧﱨ ﱩ", verseRange: "2:5-2:5" },
    { type: "text", alignment: "centered", glyphs: "ﱪ ﱫ ﱬ", verseRange: "2:5-2:5" },
  ],
};

/** Quran.com word counts (words only). */
const FATIHA = { 1: 4, 2: 4, 3: 2, 4: 3, 5: 4, 6: 3, 7: 9 };
const BAQARAH_1_5 = { 1: 1, 2: 7, 3: 7, 4: 13, 5: 8 };

describe("mapMushafTokens", () => {
  it("maps Al-Fatiha: every word placed, one end marker per ayah", () => {
    const result = mapMushafTokens(PAGE_1, 1, FATIHA, null, PAGE_2);
    expect(result.mapped).toBe(true);
    const tokens = Object.values(result.lines).flat();
    expect(tokens).toHaveLength(36);
    expect(tokens.filter((t) => t.end).map((t) => t.ayah)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // Line 4 (index 4) is "1:5-1:6": 1:5 words 0–3, its marker, then 1:6 word 0.
    expect(result.lines[4].map((t) => [t.ayah, t.word, t.end])).toEqual([
      [5, 0, false],
      [5, 1, false],
      [5, 2, false],
      [5, 3, false],
      [5, null, true],
      [6, 0, false],
    ]);
    // 1:7's nine words then its marker close the page.
    expect(result.lines[7].at(-1)).toMatchObject({ ayah: 7, end: true });
  });

  it("keeps a word with a joined pause mark as one token (2:2)", () => {
    const result = mapMushafTokens(PAGE_2, 2, BAQARAH_1_5, PAGE_1, null);
    expect(result.mapped).toBe(true);
    const line = result.lines[2];
    expect(line[0]).toMatchObject({ ayah: 1, word: 0 });
    expect(line[1]).toMatchObject({ ayah: 1, end: true });
    expect(line[5]).toMatchObject({ text: "ﱆﱇ", ayah: 2, word: 3 });
  });

  it("falls back to line-level ayahs when word counts do not fit", () => {
    const result = mapMushafTokens(PAGE_1, 1, { ...FATIHA, 7: 8 }, null, PAGE_2);
    expect(result.mapped).toBe(false);
    // Single-ayah lines still know their ayah; mixed lines stay unplaced.
    expect(result.lines[1].every((t) => t.ayah === 1)).toBe(true);
    expect(result.lines[3].every((t) => t.ayah === null)).toBe(true);
    expect(
      Object.values(result.lines)
        .flat()
        .some((t) => t.end),
    ).toBe(false);
  });

  it("is unmapped without word counts (offline, nothing cached)", () => {
    expect(mapMushafTokens(PAGE_1, 1, null, null, PAGE_2).mapped).toBe(false);
  });

  it("aligns from the end when the page opens mid-ayah", () => {
    // Synthetic: ayah 10 (4 words) started on the previous page; 2 words + marker here.
    const prev: MushafPageLayout = {
      page: 9,
      lines: [{ type: "text", alignment: "justified", glyphs: "a b", verseRange: "5:10-5:10" }],
    };
    const page: MushafPageLayout = {
      page: 10,
      lines: [
        { type: "text", alignment: "justified", glyphs: "c d e f g", verseRange: "5:10-5:11" },
        { type: "text", alignment: "justified", glyphs: "h", verseRange: "5:11-5:11" },
      ],
    };
    const result = mapMushafTokens(page, 5, { 10: 4, 11: 2 }, prev, null);
    expect(result.mapped).toBe(true);
    expect(result.lines[0].map((t) => [t.ayah, t.word, t.end])).toEqual([
      [10, 2, false],
      [10, 3, false],
      [10, null, true],
      [11, 0, false],
      [11, 1, false],
    ]);
    expect(result.lines[1][0]).toMatchObject({ ayah: 11, end: true });
  });

  it("leaves other surahs on the page untouched", () => {
    const result = mapMushafTokens(PAGE_1, 2, BAQARAH_1_5, null, PAGE_2);
    expect(
      Object.values(result.lines)
        .flat()
        .every((t) => t.ayah === null),
    ).toBe(true);
  });
});
