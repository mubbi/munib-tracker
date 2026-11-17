import type { MushafLine, MushafPageLayout } from "@munib-tracker/shared/types";

/**
 * Maps the QPC V2 glyph lines of a mushaf page onto ayah words, so practice can
 * hide, reveal and colour single words in the mushaf view while the ayah-number
 * glyphs stay visible.
 *
 * Each space-separated token on a text line is one Quran.com item in reading
 * order: a word (pause marks are joined to their word) or the ayah-end marker.
 * With the Quran.com word count of each ayah, the tokens of one surah block are
 * assigned in sequence and then checked against every line's `verseRange`. If
 * the counts do not fit (offline whitespace fallback, an odd page), the page is
 * marked unmapped and the caller shows it without word-level marks.
 */

export type MushafToken = {
  text: string;
  /** Null when the token is not in the practised surah or could not be placed. */
  ayah: number | null;
  /** 0-based study-word index; null for the ayah-number marker or when unknown. */
  word: number | null;
  /** The ayah-number glyph (never hidden). */
  end: boolean;
};

export type MushafPageTokens = {
  /** Tokens per layout line index (text lines only; other lines are absent). */
  lines: Record<number, MushafToken[]>;
  /** True when every token of the surah block was placed and matched the line ranges. */
  mapped: boolean;
};

type Ref = { surah: number; ayah: number };

function parseRange(range: string | undefined): { start: Ref; end: Ref } | null {
  if (!range) return null;
  const [a, b] = range.split("-");
  const parse = (ref: string | undefined): Ref | null => {
    if (!ref) return null;
    const [s, y] = ref.split(":").map(Number);
    return Number.isFinite(s) && Number.isFinite(y) ? { surah: s, ayah: y } : null;
  };
  const start = parse(a);
  const end = parse(b ?? a);
  return start && end ? { start, end } : null;
}

function textLines(
  layout: MushafPageLayout,
): Array<{ index: number; line: MushafLine & { type: "text" } }> {
  const out: Array<{ index: number; line: MushafLine & { type: "text" } }> = [];
  layout.lines.forEach((line, index) => {
    if (line.type === "text") out.push({ index, line });
  });
  return out;
}

export function splitGlyphTokens(glyphs: string): string[] {
  return glyphs.split(/\s+/).filter(Boolean);
}

/** True when the page's last text line ends inside `surah:ayah` (the ayah may continue). */
function pageEndsWith(layout: MushafPageLayout | null, ref: Ref): boolean {
  if (!layout) return false;
  const lines = textLines(layout);
  const range = parseRange(lines.at(-1)?.line.verseRange);
  return !!range && range.end.surah === ref.surah && range.end.ayah === ref.ayah;
}

/** True when the page opens (no surah header first) inside `surah:ayah`. */
function pageStartsWith(layout: MushafPageLayout | null, ref: Ref): boolean {
  if (!layout) return false;
  const first = layout.lines[0];
  if (first?.type !== "text") return false;
  const range = parseRange(first.verseRange);
  return !!range && range.start.surah === ref.surah && range.start.ayah === ref.ayah;
}

/**
 * @param wordCounts Quran.com word count per ayah of `surah` (words only, no end marker).
 * @param prev/next Neighbouring page layouts, to tell whether the block's first
 *   ayah started on the previous page and whether its last ayah runs on.
 */
export function mapMushafTokens(
  layout: MushafPageLayout,
  surah: number,
  wordCounts: Record<number, number> | null,
  prev: MushafPageLayout | null,
  next: MushafPageLayout | null,
): MushafPageTokens {
  const lines: Record<number, MushafToken[]> = {};
  const all = textLines(layout);
  // Every text line gets plain tokens first; the surah block is then placed.
  for (const { index, line } of all) {
    lines[index] = splitGlyphTokens(line.glyphs).map((text) => ({
      text,
      ayah: null,
      word: null,
      end: false,
    }));
  }

  const block = all
    .map((entry) => ({ ...entry, range: parseRange(entry.line.verseRange) }))
    .filter(
      (e) => e.range && e.range.start.surah === surah && e.range.end.surah === surah,
    ) as Array<{
    index: number;
    line: MushafLine & { type: "text" };
    range: { start: Ref; end: Ref };
  }>;
  if (!block.length) return { lines, mapped: true };

  const first = block[0].range.start.ayah;
  const last = block[block.length - 1].range.end.ayah;
  const blockIsLastOnPage = block[block.length - 1].index === all.at(-1)?.index;
  const blockIsFirstOnPage = block[0].index === all[0]?.index && layout.lines[0]?.type === "text";
  const contStart = blockIsFirstOnPage && pageEndsWith(prev, { surah, ayah: first });
  const contEnd = blockIsLastOnPage && pageStartsWith(next, { surah, ayah: last });

  // Single-ayah lines are always known, even when word counts are missing.
  const placeByLineOnly = () => {
    for (const { index, range } of block) {
      if (range.start.ayah !== range.end.ayah) continue;
      for (const token of lines[index]) token.ayah = range.start.ayah;
    }
    return { lines, mapped: false };
  };

  if (!wordCounts) return placeByLineOnly();
  const items: Array<{ ayah: number; word: number | null; end: boolean }> = [];
  for (let a = first; a <= last; a++) {
    const count = wordCounts[a];
    if (!count || count < 1) return placeByLineOnly();
    for (let w = 0; w < count; w++) items.push({ ayah: a, word: w, end: false });
    items.push({ ayah: a, word: null, end: true });
  }
  const tokenCount = block.reduce((n, e) => n + lines[e.index].length, 0);
  const missing = items.length - tokenCount;
  if (missing < 0) return placeByLineOnly();

  // Where the page's tokens begin inside `items`.
  let offsets: number[];
  if (!contStart) offsets = [0];
  else if (!contEnd) offsets = [missing];
  else offsets = Array.from({ length: missing + 1 }, (_, i) => i);
  if (!contStart && !contEnd && missing !== 0) return placeByLineOnly();
  if (!contStart && contEnd && missing < 0) return placeByLineOnly();

  const fits = (offset: number): boolean => {
    let k = offset;
    for (const { index, range } of block) {
      const n = lines[index].length;
      const head = items[k];
      const tail = items[k + n - 1];
      if (!head || !tail) return false;
      if (head.ayah !== range.start.ayah || tail.ayah !== range.end.ayah) return false;
      k += n;
    }
    return true;
  };
  const valid = offsets.filter(fits);
  if (valid.length !== 1) return placeByLineOnly();

  let k = valid[0];
  for (const { index } of block) {
    for (const token of lines[index]) {
      const item = items[k++];
      token.ayah = item.ayah;
      token.word = item.word;
      token.end = item.end;
    }
  }
  return { lines, mapped: true };
}
