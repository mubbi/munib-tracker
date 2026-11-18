import type { Ayah, MushafLine, MushafPageLayout } from "@munib-tracker/shared/types";

/** Shared Qur'an fixtures. Append new builders; never rename existing exports. */

/** One ayah (defaults: Al-Fatihah 1:1 on page 1). */
export function buildAyah(overrides: Partial<Ayah> = {}): Ayah {
  return {
    surah: 1,
    ayah: 1,
    global: 1,
    arabic: "بِسْمِ ٱللَّهِ",
    juz: 1,
    sajda: false,
    hizb: 1,
    page: 1,
    ...overrides,
  };
}

/** A mushaf glyph line holding `verseRange` (e.g. "1:1-1:2"). */
export function buildMushafTextLine(
  overrides: Partial<Extract<MushafLine, { type: "text" }>> = {},
): MushafLine {
  return {
    type: "text",
    alignment: "justified",
    glyphs: "ﱁ ﱂ",
    verseRange: "1:1-1:1",
    ...overrides,
  };
}

/** A mushaf page: a surah banner, a basmala and one text line by default. */
export function buildMushafPageLayout(overrides: Partial<MushafPageLayout> = {}): MushafPageLayout {
  return {
    page: 1,
    lines: [
      { type: "surah_name", surah: 1, text: "سورة الفاتحة" },
      { type: "basmala", glyphs: "﷽" },
      buildMushafTextLine(),
    ],
    ...overrides,
  };
}
