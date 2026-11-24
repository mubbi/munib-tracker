/**
 * Arabic folding shared by the phrase-token build script, the spotter and the
 * eval tool. Mirrors `@tilawa/core` `normalizeArabic` (the text form the
 * FastConformer CTC targets were built from): harakat, Qur'anic marks and tatweel
 * removed; أ إ آ ٱ → ا, ة → ه, ى → ي.
 *
 * Pure, no imports — the Node build / eval scripts load this file directly.
 */

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const FOLD: Record<string, string> = {
  أ: "ا",
  إ: "ا",
  آ: "ا",
  ٱ: "ا",
  ة: "ه",
  ى: "ي",
};

/** SentencePiece word-start marker. */
export const WORD_MARK = "▁";

/** Fold one run of Arabic text (no word-boundary handling). */
export function foldArabic(text: string): string {
  return text
    .replace(/﻿/g, "")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱةى]/g, (ch) => FOLD[ch] ?? ch);
}

/**
 * Phrase text as the spotter matches it: words folded, joined by single spaces,
 * with a leading space for the first word's `▁` marker. Punctuation and
 * digits are dropped.
 */
export function phraseMatchText(arabic: string): string {
  const words = foldArabic(arabic)
    .replace(/[^ء-ي\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words.length ? ` ${words.join(" ")}` : "";
}

/** A vocab piece in match-text form (`▁` → space, folded). May be "" (a pure-harakat piece). */
export function pieceMatchText(piece: string): string {
  return foldArabic(piece.split(WORD_MARK).join(" "));
}

/** Split a dataset Arabic string into words (keeping harakat), for word slices. */
export function arabicWords(arabic: string): string[] {
  return arabic
    .replace(/[،,؛;.!?()«»"۝]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
