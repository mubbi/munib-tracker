/**
 * Shared Fuse helpers for offline search. Kept separate from corpus loaders so
 * light screens and Learn guides can share normalize/Fuse defaults without a
 * circular import between search.ts and search-guides.ts.
 */
import Fuse from "fuse.js";

import type { SearchResult } from "@/lib/search-types";

// Arabic combining marks only (never letters): annotation signs U+0610–U+061A,
// harakat/tanwin U+064B–U+065F, tatweel U+0640, superscript alef U+0670, and the
// Qur'anic annotation range U+06D6–U+06ED.
const ARABIC_MARKS = /[ؐ-ًؚ-ٟـٰۖ-ۭ]/g;
/** Latin combining diacritics left over after NFD decomposition (U+0300–U+036F). */
const LATIN_MARKS = /[̀-ͯ]/g;
/**
 * Intra-word joiners removed (not spaced) so transliteration punctuation folds
 * away: apostrophes/hamza marks and hyphens/periods, letting "subhanallah" match
 * "Subhan-Allah" while "subhan allah" still matches too.
 */
const JOINERS = /['ʻʼʽʾʿ`´.-]+/g;
/** Anything that isn't a Latin alphanumeric or an Arabic-block char → a separator. */
const SEPARATORS = /[^0-9a-z؀-ۿ]+/g;

/** Fold the common Arabic letter variants so spelling differences still match. */
function foldArabicLetters(text: string): string {
  return text
    .replace(/[آأإٱ]/g, "ا") // aa/hamza-alef variants -> alef
    .replace(/ى/g, "ي") // alef maksura -> yaa
    .replace(/ة/g, "ه") // taa marbuta -> haa
    .replace(/ؤ/g, "و") // waw+hamza -> waw
    .replace(/ئ/g, "ي"); // yaa+hamza -> yaa
}

/**
 * Collapse a string to a diacritic-free, punctuation-free, lowercase token
 * stream suitable for substring matching across scripts.
 */
export function normalize(input: string): string {
  if (!input) return "";
  return foldArabicLetters(
    input.normalize("NFD").replace(LATIN_MARKS, "").replace(ARABIC_MARKS, ""),
  )
    .toLowerCase()
    .replace(JOINERS, "")
    .replace(SEPARATORS, " ")
    .trim();
}

/** Split a raw query into normalized tokens; returns [] for queries under 2 chars. */
export function tokenize(query: string): string[] {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];
  return normalized.split(" ").filter(Boolean);
}

/**
 * Fuse fuzziness: lower = stricter. 0.2 keeps typo tolerance (fatiah → Al-Fatihah,
 * forgivness → forgiveness) while eliminating the false positives 0.3 produced on
 * short fields like surah names.
 */
const FUSE_THRESHOLD = 0.2;
export const MIN_TOKEN_LENGTH = 2;

/** A source item paired with its normalized, searchable fields. */
export type FuseDoc<T> = { item: T } & Record<string, string>;

/** A searchable field on an item: which text to index, and its relative weight. */
export interface FuzzyField<T> {
  key: string;
  weight: number;
  get: (item: T) => string | undefined | null;
}

/** A reusable fuzzy index over an arbitrary in-memory list (for screen-local search bars). */
export interface FuzzyIndex<T> {
  /** Ranked matches for the query; `[]` for a query below the minimum length. */
  search(query: string, limit?: number): T[];
  /** Match count (unbounded) for the query; `0` for a too-short query. */
  count(query: string): number;
}

export function makeFuse<T>(items: T[], fields: FuzzyField<T>[]): Fuse<FuseDoc<T>> {
  const docs = items.map((item) => {
    const doc = { item } as FuseDoc<T>;
    for (const field of fields) doc[field.key] = normalize(field.get(item) ?? "");
    return doc;
  });
  return new Fuse(docs, {
    includeScore: true,
    ignoreLocation: true,
    threshold: FUSE_THRESHOLD,
    minMatchCharLength: MIN_TOKEN_LENGTH,
    useExtendedSearch: true,
    keys: fields.map((field) => ({ name: field.key, weight: field.weight })),
  });
}

/**
 * Turn a raw query into an extended-search pattern: normalized tokens joined by
 * spaces (Fuse treats that as AND), each fuzzy-matched. Tokens below the minimum
 * length are dropped to avoid noise.
 */
export function fusePattern(query: string): string {
  return tokenize(query)
    .filter((token) => token.length >= MIN_TOKEN_LENGTH)
    .join(" ");
}

export function fuseSearch<T>(
  fuse: Fuse<FuseDoc<T>>,
  query: string,
  limit: number,
  toResult: (item: T) => SearchResult,
): { results: SearchResult[]; total: number } {
  const pattern = fusePattern(query);
  if (!pattern) return { results: [], total: 0 };
  const matches = fuse.search(pattern);
  return {
    results: matches.slice(0, limit).map((match) => toResult(match.item.item)),
    total: matches.length,
  };
}

/**
 * Build a reusable fuzzy index over an arbitrary list, using the project Fuse
 * defaults + `normalize()`-ed fields. Screens memoize this (keyed on the list)
 * for their own search bars instead of scanning with `.includes()`; extend this
 * module rather than calling `new Fuse()` in a screen (see AGENTS.md).
 */
export function createFuzzyIndex<T>(items: T[], fields: FuzzyField<T>[]): FuzzyIndex<T> {
  const fuse = makeFuse(items, fields);
  return {
    search(query, limit) {
      const pattern = fusePattern(query);
      if (!pattern) return [];
      const matches = fuse.search(pattern, limit ? { limit } : undefined);
      return matches.map((match) => match.item.item);
    },
    count(query) {
      const pattern = fusePattern(query);
      if (!pattern) return 0;
      return fuse.search(pattern).length;
    },
  };
}
