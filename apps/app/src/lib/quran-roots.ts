/**
 * Arabic root-word search engine (NF-3.22). Pure: everything works on a loaded
 * {@link RootIndex} built on the device from the Quranic Arabic Corpus file.
 * Roots come only from the dataset — nothing here guesses a root from a word.
 */

import { foldArabicWord } from "@/lib/quran-companion/align-words";
import {
  arabicLetterToRoot,
  buckwalterToArabic,
  ROOT_ALPHABET,
  rootToArabic,
} from "@/lib/quran-morphology/buckwalter";
import type { RootIndex } from "@/lib/quran-morphology/build-index";
import { decodeAlignment } from "@/lib/quran-morphology/build-index";
import {
  countLocations,
  decodeLocations,
  unpackLocation,
  type WordLocation,
} from "@/lib/quran-morphology/codec";
import { createFuzzyIndex, type FuzzyIndex } from "@/lib/search-fuse";

export { rootLetters, rootToArabic } from "@/lib/quran-morphology/buckwalter";

export type RootQuery =
  | { kind: "empty" }
  /** Candidate Buckwalter roots, most likely first (Latin input can give several). */
  | { kind: "root"; candidates: string[]; script: "arabic" | "latin"; word?: string }
  /** A whole Arabic word (folded) to look up in the dataset's word forms. */
  | { kind: "word"; word: string };

const ARABIC_RANGE = /[؀-ۿ]/;
// Harakat, Qur'anic annotation marks, superscript alif and tatweel — never letters.
const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const SEPARATORS = /[\s\-_.,،/|·]+/;
const ROOT_SET = new Set(ROOT_ALPHABET);
const MAX_LATIN_CANDIDATES = 64;

/** Latin letter (or digraph) → possible root letters, most common reading first. */
const LATIN_UNITS: Record<string, string[]> = {
  sh: ["$"],
  th: ["v"],
  dh: ["*", "D", "Z"],
  kh: ["x"],
  gh: ["g"],
  a: ["A", "E"],
  b: ["b"],
  t: ["t", "T"],
  v: ["v"],
  j: ["j"],
  h: ["H", "h"],
  x: ["x"],
  d: ["d", "D"],
  r: ["r"],
  z: ["z", "Z"],
  s: ["s", "S"],
  e: ["E"],
  g: ["g", "j"],
  f: ["f"],
  q: ["q"],
  k: ["k"],
  l: ["l"],
  m: ["m"],
  n: ["n"],
  w: ["w"],
  u: ["w"],
  o: ["w"],
  y: ["y"],
  i: ["y"],
  "'": ["A", "E"],
  "`": ["E"],
  ʿ: ["E"],
  ʾ: ["A"],
  "3": ["E"],
  "2": ["A"],
};

function rootFromArabicLetters(text: string): string | null {
  let root = "";
  for (const ch of text) {
    const bw = arabicLetterToRoot(ch);
    if (!bw) return null;
    root += bw;
  }
  return root;
}

/** Every way to split a lowercase Latin token into units (digraphs optional). */
function latinSegmentations(token: string): string[][] {
  const out: string[][] = [];
  const walk = (i: number, acc: string[]) => {
    if (out.length > MAX_LATIN_CANDIDATES) return;
    if (i === token.length) {
      out.push(acc);
      return;
    }
    const two = token.slice(i, i + 2);
    if (two.length === 2 && LATIN_UNITS[two]) walk(i + 2, [...acc, two]);
    const one = token[i];
    if (LATIN_UNITS[one]) walk(i + 1, [...acc, one]);
  };
  walk(0, []);
  return out;
}

function expandUnits(units: string[]): string[] {
  let acc = [""];
  for (const unit of units) {
    const options = LATIN_UNITS[unit] ?? [];
    const next: string[] = [];
    for (const prefix of acc) for (const opt of options) next.push(prefix + opt);
    acc = next.slice(0, MAX_LATIN_CANDIDATES);
  }
  return acc;
}

function isBuckwalterRoot(text: string): boolean {
  return text.length >= 2 && text.length <= 4 && [...text].every((ch) => ROOT_SET.has(ch));
}

/**
 * Parse what the user typed into candidate roots or a word to look up:
 * `ر ح م`, `رحم`, `ر-ح-م` (hamza forms → the dataset's `A`, ى → `y`), Buckwalter
 * (`rHm`, case-sensitive), or plain Latin (`r-h-m`, `rhm`), which is ambiguous
 * (h → ه or ح) and returns several candidates.
 */
export function parseRootQuery(input: string): RootQuery {
  const raw = input.trim();
  if (!raw) return { kind: "empty" };

  if (ARABIC_RANGE.test(raw)) {
    const stripped = raw.replace(ARABIC_MARKS, "");
    const tokens = stripped.split(SEPARATORS).filter(Boolean);
    const joined = tokens.join("");
    const separatedLetters = tokens.length > 1 && tokens.every((tok) => [...tok].length === 1);
    const root = rootFromArabicLetters(joined);
    const letters = [...joined].length;
    if (root && letters >= 2 && letters <= 4 && (separatedLetters || tokens.length === 1)) {
      return {
        kind: "root",
        candidates: [root],
        script: "arabic",
        // An unseparated 2–4 letter entry may also be a whole word (e.g. "قال").
        word: separatedLetters ? undefined : foldArabicWord(joined),
      };
    }
    const word = foldArabicWord(tokens.length === 1 ? joined : stripped);
    return word ? { kind: "word", word } : { kind: "empty" };
  }

  const tokens = raw.split(SEPARATORS).filter(Boolean);
  const compact = tokens.join("");
  // Buckwalter is case-sensitive: any capital or BW symbol means "take it literally".
  if (/[A-Z$*]/.test(compact) && isBuckwalterRoot(compact)) {
    return { kind: "root", candidates: [compact], script: "latin" };
  }

  const lower = compact.toLowerCase();
  const segmentations =
    tokens.length > 1
      ? [tokens.map((tok) => tok.toLowerCase())]
      : latinSegmentations(lower).filter((units) => units.length >= 2 && units.length <= 4);
  const candidates = new Set<string>();
  for (const units of segmentations) {
    if (units.length < 2 || units.length > 4) continue;
    if (!units.every((unit) => LATIN_UNITS[unit])) continue;
    for (const candidate of expandUnits(units)) {
      candidates.add(candidate);
      if (candidates.size >= MAX_LATIN_CANDIDATES) break;
    }
  }
  if (!candidates.size) return { kind: "empty" };
  return { kind: "root", candidates: [...candidates], script: "latin" };
}

export type RootLookup =
  /** Roots found — by exact root match, or via the whole-word form index. */
  | { kind: "roots"; roots: string[]; via: "root" | "word" }
  /** The word is in the dataset but has no root (particle, pronoun, some proper nouns). */
  | { kind: "rootless" }
  /** Nothing matched — the UI offers normal text search instead. */
  | { kind: "none" };

function byCountDesc(index: RootIndex) {
  return (a: string, b: string) => (index.counts[b] ?? 0) - (index.counts[a] ?? 0);
}

/** Exact root match first; otherwise a whole-word lookup in the dataset's forms. */
export function lookupRoots(index: RootIndex, query: RootQuery): RootLookup {
  if (query.kind === "empty") return { kind: "none" };
  if (query.kind === "root") {
    const found = query.candidates.filter((root) => index.roots[root]).sort(byCountDesc(index));
    if (found.length) return { kind: "roots", roots: found, via: "root" };
    if (!query.word) return { kind: "none" };
    return lookupWord(index, query.word);
  }
  return lookupWord(index, query.word);
}

function lookupWord(index: RootIndex, folded: string): RootLookup {
  const hit = index.forms[folded];
  if (hit === undefined) return { kind: "none" };
  if (hit === "") return { kind: "rootless" };
  return { kind: "roots", roots: hit.split(",").sort(byCountDesc(index)), via: "word" };
}

/** Convenience: parse + look up in one call. */
export function searchRoots(index: RootIndex, input: string): RootLookup {
  return lookupRoots(index, parseRootQuery(input));
}

export type LemmaOccurrences = {
  /** Buckwalter lemma key ("" when the dataset gives none). */
  lemma: string;
  /** The lemma in Arabic script, converted from the dataset. */
  arabic: string;
  count: number;
  locations: WordLocation[];
};

export type RootOccurrences = {
  root: string;
  arabic: string;
  total: number;
  lemmas: LemmaOccurrences[];
  /** Occurrences per surah, in surah order (only surahs with at least one). */
  distribution: { surah: number; count: number }[];
};

/** Every occurrence of a root, grouped by lemma (most frequent first). */
export function getRootOccurrences(index: RootIndex, root: string): RootOccurrences | null {
  const lemmas = index.roots[root];
  if (!lemmas) return null;
  const perSurah = new Map<number, number>();
  const groups: LemmaOccurrences[] = [];
  for (const [lemma, packed] of Object.entries(lemmas)) {
    const locations = decodeLocations(packed).map(unpackLocation);
    for (const loc of locations) perSurah.set(loc.surah, (perSurah.get(loc.surah) ?? 0) + 1);
    groups.push({ lemma, arabic: buckwalterToArabic(lemma), count: locations.length, locations });
  }
  groups.sort((a, b) => b.count - a.count || a.lemma.localeCompare(b.lemma));
  return {
    root,
    arabic: rootToArabic(root),
    total: groups.reduce((sum, g) => sum + g.count, 0),
    lemmas: groups,
    distribution: [...perSurah.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([surah, count]) => ({ surah, count })),
  };
}

/** Occurrence count of a root (0 when unknown). */
export function rootCount(index: RootIndex, root: string): number {
  return index.counts[root] ?? 0;
}

/** Lemma count of a root without decoding its occurrences. */
export function lemmaCount(index: RootIndex, root: string): number {
  return Object.keys(index.roots[root] ?? {}).length;
}

/**
 * Bundled study-word indexes (0-based, from `splitAyahWords`) for a corpus word.
 * Identity unless the ayah has a recorded join/split; `[]` = show at ayah level.
 */
export function studyWordIndexes(index: RootIndex, loc: WordLocation): number[] {
  const encoded = index.align[`${loc.surah}:${loc.ayah}`];
  if (encoded === undefined) return [loc.word - 1];
  return decodeAlignment(encoded)[loc.word - 1] ?? [];
}

/**
 * Roots per bundled study word for one surah: `"ayah:studyIndex"` → roots.
 * Drives the word-by-word "Root" chip. Built by scanning the packed lists once.
 */
export function buildSurahWordRoots(index: RootIndex, surah: number): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const alignCache = new Map<number, number[][] | null>();
  for (const [root, lemmas] of Object.entries(index.roots)) {
    for (const packed of Object.values(lemmas)) {
      for (const code of decodeLocations(packed)) {
        const loc = unpackLocation(code);
        if (loc.surah !== surah) continue;
        let mapping = alignCache.get(loc.ayah);
        if (mapping === undefined) {
          const encoded = index.align[`${surah}:${loc.ayah}`];
          mapping = encoded === undefined ? null : decodeAlignment(encoded);
          alignCache.set(loc.ayah, mapping);
        }
        const study = mapping ? (mapping[loc.word - 1] ?? []) : [loc.word - 1];
        for (const s of study) {
          const key = `${loc.ayah}:${s}`;
          const list = out.get(key);
          if (!list) out.set(key, [root]);
          else if (!list.includes(root)) list.push(root);
        }
      }
    }
  }
  return out;
}

export type RootListItem = { root: string; arabic: string; letters: string; count: number };

/** All roots as list items, most frequent first (for "did you mean" and browsing). */
export function listRoots(index: RootIndex): RootListItem[] {
  return Object.keys(index.roots)
    .map((root) => ({
      root,
      arabic: rootToArabic(root),
      letters: rootToArabic(root).replace(/ /g, ""),
      count: index.counts[root] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Fuse index over the root list (project defaults) — "did you mean" only. */
export function createRootSuggestionIndex(items: RootListItem[]): FuzzyIndex<RootListItem> {
  return createFuzzyIndex(items, [
    { key: "letters", weight: 2, get: (item) => item.letters },
    { key: "bw", weight: 1, get: (item) => item.root },
  ]);
}

/**
 * "Did you mean" roots for a query that matched nothing: Fuse over the root
 * list (partial input such as two letters), then roots one letter away from an
 * Arabic candidate. The root match itself stays exact.
 */
export function suggestRoots(
  index: RootIndex,
  suggestionIndex: FuzzyIndex<RootListItem>,
  input: string,
  limit = 8,
): string[] {
  const query = parseRootQuery(input);
  const out: string[] = [];
  const add = (root: string) => {
    if (index.roots[root] && !out.includes(root) && out.length < limit) out.push(root);
  };
  if (query.kind === "root" && query.script === "arabic") {
    const fuzzy = suggestionIndex.search(rootToArabic(query.candidates[0]).replace(/ /g, ""));
    for (const item of fuzzy) add(item.root);
    for (const candidate of query.candidates) {
      for (let i = 0; i < candidate.length; i++) {
        for (const letter of ROOT_ALPHABET) {
          add(candidate.slice(0, i) + letter + candidate.slice(i + 1));
        }
      }
    }
  } else if (query.kind === "root") {
    for (const item of suggestionIndex.search(input)) add(item.root);
  }
  return out.sort(byCountDesc(index));
}

export type AyahSnippet = {
  before: string;
  match: string;
  after: string;
  /** Words were cut before / after the window. */
  clippedStart: boolean;
  clippedEnd: boolean;
};

/**
 * A short window of the bundled ayah around the matching word(s) — display tokens
 * are the bundled text, never altered. With no aligned word (`highlight` empty)
 * the snippet is the ayah start, with nothing highlighted (ayah-level fallback).
 */
export function buildAyahSnippet(
  words: readonly string[],
  highlight: readonly number[],
  radius = 4,
): AyahSnippet {
  if (!highlight.length) {
    const end = Math.min(words.length, radius * 2 + 1);
    return {
      before: "",
      match: "",
      after: words.slice(0, end).join(" "),
      clippedStart: false,
      clippedEnd: end < words.length,
    };
  }
  const first = Math.min(...highlight);
  const last = Math.max(...highlight);
  const start = Math.max(0, first - radius);
  const end = Math.min(words.length, last + 1 + radius);
  return {
    before: words.slice(start, first).join(" "),
    match: words.slice(first, last + 1).join(" "),
    after: words.slice(last + 1, end).join(" "),
    clippedStart: start > 0,
    clippedEnd: end < words.length,
  };
}

/** Text of a packed list's occurrence count — exported for screen headers. */
export { countLocations };
