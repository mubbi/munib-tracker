/** Line types for a single Madani mushaf page (15-line Hafs layout). */
export type MushafLine =
  | { type: "surah_name"; surah: number; text: string }
  | { type: "basmala"; glyphs: string }
  | {
      type: "text";
      alignment: "centered" | "justified";
      glyphs: string;
      verseRange?: string;
    };

export interface MushafPageLayout {
  page: number;
  lines: MushafLine[];
}

export interface MushafLayoutInfo {
  id: string;
  name: string;
  pageCount: number;
  linesPerPage: number;
  fontId: string;
  sourceUrl: string;
}
