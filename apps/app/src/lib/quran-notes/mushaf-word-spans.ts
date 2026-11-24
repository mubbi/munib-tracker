import type { MushafPageLayout } from "@munib-tracker/shared/types";

import { getPageLayout, getSurahAyahs } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import { mapMushafTokens, splitGlyphTokens } from "@/lib/quran-companion/mushaf-tokens";
import { QURAN_TOTAL_PAGES } from "@/lib/quran-meta";

/**
 * Spike N1 (NF-3.21, D15/D24): word boxes on the mushaf page.
 *
 * The QPC V2 page font draws one glyph token per word (plus one per ayah-end
 * marker), separated by spaces in the layout lines. Rendering each token as its
 * own nested `Text` run gives a box per word that the TEXT ENGINE lays out — a
 * `backgroundColor` on the run follows the glyph through font size, RTL,
 * justification, page zoom and TV scaling with no `onLayout` measuring at all.
 *
 * What remains is knowing which token is which word. Notes store word indexes
 * into `splitAyahWords(bundledAyahText)`, so the page is mapped with word counts
 * from that same tokeniser (`mapMushafTokens`). When every surah block on the
 * page maps exactly, word spans are drawn on their tokens; otherwise that page
 * falls back to an ayah tint (D24). The all-pages test records the mapped share.
 */

export type PageWordToken = {
  text: string;
  surah: number | null;
  ayah: number | null;
  /** 0-based index into `splitAyahWords` of the ayah; null for markers / unknown. */
  word: number | null;
  end: boolean;
};

export type PageWordMap = {
  /** Tokens per layout line index (text lines only). */
  lines: Record<number, PageWordToken[]>;
  /** True when every surah block on the page mapped word-exactly. */
  wordExact: boolean;
};

const countCache = new Map<number, Record<number, number>>();

/** Word count per ayah from the bundled text, with the tokeniser notes use. */
export function bundledWordCounts(surah: number): Record<number, number> {
  let counts = countCache.get(surah);
  if (!counts) {
    counts = {};
    for (const a of getSurahAyahs(surah)) counts[a.ayah] = splitAyahWords(a.arabic).length;
    countCache.set(surah, counts);
  }
  return counts;
}

function surahsOnPage(layout: MushafPageLayout): number[] {
  const out = new Set<number>();
  for (const line of layout.lines) {
    if (line.type !== "text" || !line.verseRange) continue;
    for (const part of line.verseRange.split("-")) {
      const surah = Number(part.split(":")[0]);
      if (Number.isFinite(surah) && surah > 0) out.add(surah);
    }
  }
  return [...out];
}

const pageCache = new Map<number, PageWordMap>();

/** Maps a mushaf page's glyph tokens to (surah, ayah, word) — cached per page. */
export function mapPageWords(page: number, override?: MushafPageLayout): PageWordMap {
  const cached = override ? undefined : pageCache.get(page);
  if (cached) return cached;
  const layout = override ?? getPageLayout(page);
  const lines: Record<number, PageWordToken[]> = {};
  layout.lines.forEach((line, index) => {
    if (line.type === "text") {
      lines[index] = splitGlyphTokens(line.glyphs).map((text) => ({
        text,
        surah: null,
        ayah: null,
        word: null,
        end: false,
      }));
    }
  });
  const prev = page > 1 ? getPageLayout(page - 1) : null;
  const next = page < QURAN_TOTAL_PAGES ? getPageLayout(page + 1) : null;
  let wordExact = true;
  for (const surah of surahsOnPage(layout)) {
    const mapped = mapMushafTokens(layout, surah, bundledWordCounts(surah), prev, next);
    if (!mapped.mapped) wordExact = false;
    for (const [lineIndex, tokens] of Object.entries(mapped.lines)) {
      const target = lines[Number(lineIndex)];
      if (!target) continue;
      tokens.forEach((token, i) => {
        const slot = target[i];
        if (!slot || token.ayah == null) return;
        slot.surah = surah;
        slot.ayah = token.ayah;
        slot.word = token.word;
        slot.end = token.end;
      });
    }
  }
  const result = { lines, wordExact };
  if (!override) {
    if (pageCache.size > 24) pageCache.clear();
    pageCache.set(page, result);
  }
  return result;
}
