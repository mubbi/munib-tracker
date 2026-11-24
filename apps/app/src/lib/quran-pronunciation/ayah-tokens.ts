import { foldArabic, WORD_MARK } from "../tasbeeh-voice/arabic-text";
import type { AyahLattice, ExpectedAyah, ExpectedWord, SpotterVocabIds } from "./types";

/**
 * Expected text → piece lattice for one ayah (NF-3.24 step 1). Pure; the only
 * runtime import is NF-3.20's pure Arabic folding, so the eval script loads this
 * file directly.
 *
 * Spike S4 (token compatibility, proof log): the pinned `quran_ctc_tokens.json`
 * uses the pinned `vocab.json` ids and decodes back to the model corpus'
 * `text_clean` (the small waw / yaa marks ۥ ۦ become `<unk>`). But the pinned
 * model is the "mixed" build: it emits bare AND diacritised pieces (`▁الْ`, `لَ`,
 * harakat-only pieces), so forcing the single canonical segmentation measured
 * badly on reference recitation. Like the NF-3.20 spotter, we therefore align
 * against a LATTICE: the ayah's folded text with every vocab piece that matches
 * it at each position, so any segmentation the model prefers is accepted.
 *
 * Text source: `text_clean` from the model's own pinned `quran.json` (the text
 * the CTC targets were built from; nothing typed here). Folding: harakat,
 * Qur'anic marks and tatweel removed, alif / hamza forms unified (NF-3.20
 * `foldArabic`), and — as in the NF-3.20 eval — alifs dropped altogether so the
 * Uthmani (`العلمين`) and imla'i (`العالمين`) spellings the model may emit agree.
 * Alif-only pieces become fillers (allowed anywhere a blank is).
 *
 * The corpus prepends the basmala to the first ayah of every surah except
 * al-Fatihah and at-Tawbah; those leading words are marked `optional` (the
 * bundled text and the study row never show them).
 */

export type QuranCorpusRow = { surah: number; ayah: number; text_clean?: string };
export type VocabJson = Record<string, string>;

/** Folded match form of a text run: harakat / marks / alifs removed. */
export function matchFold(text: string): string {
  return foldArabic(text).replace(/ا/g, "");
}

/** Arabic letters in a word (alifs included — used for the "very short word" rule). */
export function letterCount(text: string): number {
  return foldArabic(text).replace(/[^ء-ي]/g, "").length;
}

export type PieceIndex = SpotterVocabIds & {
  /** [id, match text] for every piece that keeps at least one letter or the word mark. */
  pieces: [number, string][];
  /** match text → ids (alternative spellings of the same sound). */
  sameText: Map<string, number[]>;
};

/** Index the pinned vocab once per model load. */
export function buildPieceIndex(vocab: VocabJson, blankId: number): PieceIndex {
  const pieces: [number, string][] = [];
  const fillers: number[] = [];
  const sameText = new Map<string, number[]>();
  for (const [key, raw] of Object.entries(vocab)) {
    const id = Number(key);
    if (id === blankId || raw === "<unk>" || raw === "<blank>") continue;
    const piece = matchFold(raw.split(WORD_MARK).join(" "));
    if (piece === "") {
      fillers.push(id);
      continue;
    }
    pieces.push([id, piece]);
    const list = sameText.get(piece) ?? [];
    list.push(id);
    sameText.set(piece, list);
  }
  fillers.sort((a, b) => a - b);
  return { blankId, fillers, pieces, sameText };
}

export function corpusIndex(rows: readonly QuranCorpusRow[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const row of rows) {
    if (row?.text_clean) index.set(`${row.surah}:${row.ayah}`, row.text_clean);
  }
  return index;
}

function cleanWords(textClean: string): string[] {
  return textClean
    .replace(/﻿/g, "")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => /[ء-ي]/.test(foldArabic(w)));
}

/**
 * The expected engine words for one ayah, or `null` when the pinned corpus has
 * no row (a different model build — the caller shows "not available").
 */
export function expectedAyah(
  surah: number,
  ayah: number,
  corpus: ReadonlyMap<string, string>,
): ExpectedAyah | null {
  const raw = corpus.get(`${surah}:${ayah}`);
  if (!raw) return null;
  const words: ExpectedWord[] = cleanWords(raw).map((text) => ({ text }));
  if (!words.length) return null;
  if (ayah === 1 && surah !== 1 && surah !== 9) {
    const basmala = cleanWords(corpus.get("1:1") ?? "");
    const n = basmala.length;
    const prefixed =
      n > 0 && words.length > n && basmala.every((word, i) => word === words[i].text);
    if (prefixed) for (let i = 0; i < n; i++) words[i].optional = true;
  }
  return { surah, ayah, words };
}

/** The ayah without its optional words (what a reciter who skips the basmala says). */
export function withoutOptional(expected: ExpectedAyah): {
  ayah: ExpectedAyah;
  /** Index map: position in the trimmed ayah → original engine word index. */
  original: number[];
} {
  const original: number[] = [];
  const words: ExpectedWord[] = [];
  expected.words.forEach((word, i) => {
    if (word.optional) return;
    original.push(i);
    words.push(word);
  });
  return { ayah: { ...expected, words }, original };
}

/** Engine words as strings (for `alignPracticeWords`). Optional words included. */
export function engineWordTexts(expected: ExpectedAyah): string[] {
  return expected.words.map((w) => w.text);
}

/**
 * Lattice for a word sequence: the match text ` w₁ w₂ …` (each word starts with
 * the space its first piece's `▁` stands for) and every (position, piece) where
 * a vocab piece matches. Returns `null` when the text can't be spelled with the
 * pinned vocab end to end.
 */
export function buildLattice(
  words: readonly ExpectedWord[],
  index: PieceIndex,
): AyahLattice | null {
  let text = "";
  const wordStarts: number[] = [];
  for (const word of words) {
    wordStarts.push(text.length);
    text += ` ${matchFold(word.text)}`;
  }
  const edges: [number, number, number][] = [];
  for (let pos = 0; pos < text.length; pos++) {
    for (const [id, piece] of index.pieces) {
      if (text.startsWith(piece, pos)) edges.push([pos, id, piece.length]);
    }
  }
  const reach = new Array<boolean>(text.length + 1).fill(false);
  reach[0] = true;
  for (const [pos, , len] of [...edges].sort((a, b) => a[0] - b[0])) {
    if (reach[pos]) reach[pos + len] = true;
  }
  if (!reach[text.length]) return null;
  return { text, wordStarts, edges };
}
