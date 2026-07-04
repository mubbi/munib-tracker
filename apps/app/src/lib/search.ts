import { DUA_ITEMS, DUROOD_ITEMS, NAMES_OF_ALLAH, ZIKR_ITEMS } from "@munib-tracker/shared/content";
import type {
  DuaItem,
  DurudItem,
  HadithItem,
  NameOfAllah,
  Surah,
  ZikrItem,
} from "@munib-tracker/shared/types";
import Fuse from "fuse.js";

import { getBundledCollection, getBundledCollections } from "@/lib/hadith";
import { getBundledEdition, getSurahAyahs, getSurahMeta, getTransliteration } from "@/lib/quran";

/**
 * Universal, offline search across every bundled content source (Qur'an, hadith,
 * duas, adhkar, duroods, and the 99 names). Pure and framework-free so it can be
 * unit-tested and driven from a single screen.
 *
 * Design notes:
 * - Matching is diacritic-insensitive on both sides (Arabic harakat and Latin
 *   accents are stripped, and transliteration joiners like `'`/`-` are removed)
 *   so "subhanallah" finds "Subhan-Allah" and a bare Arabic query finds a
 *   fully-vocalised ayah.
 * - Ranking + typo tolerance come from Fuse.js run over the *normalized* fields,
 *   with weighted keys (title/name outrank body text) and token-AND matching via
 *   extended search, so "forgivness" still finds "forgiveness".
 * - The small in-memory corpora (duas/adhkar/names/duroods/bundled hadith) plus
 *   the 114 surah names are indexed instantly. Qur'an ayah full-text is far
 *   larger, so its Fuse index is built lazily and cached — the caller runs
 *   {@link searchQuranAyahs} off the interaction thread to keep typing smooth.
 */

export type SearchCategory = "quran" | "hadith" | "dua" | "zikr" | "durood" | "name";

export interface SearchResult {
  /** Stable React key, unique across all categories. */
  key: string;
  category: SearchCategory;
  /** Primary line (transliteration / title / surah name). */
  title: string;
  /** Secondary line (translation / english / meaning). */
  subtitle?: string;
  /** Arabic text, when the source has it (shown small + RTL in the row). */
  arabic?: string;
  /** Longer human reference, e.g. "Bukhari & Muslim" or "Quran 2:201". */
  reference?: string;
  /** Short contextual tag for a pill, e.g. "2:255", "Sahih", "34/99". */
  badge?: string;
  /** Router pathname for the item's view. */
  href: SearchHref;
  /** Router params for dynamic routes. */
  params?: Record<string, string>;
}

export type SearchHref =
  | "/quran/[surah]"
  | "/hadith/[collection]"
  | "/dua/detail/[id]"
  | "/zikr/detail/[id]"
  | "/duroods"
  | "/names-of-allah";

export interface SearchGroup {
  category: SearchCategory;
  results: SearchResult[];
  /** Total matches before the per-group cap (drives "see all N"). */
  total: number;
}

/** Fixed display order for groups — mirrors the home quick-action ordering. */
export const SEARCH_CATEGORY_ORDER: SearchCategory[] = [
  "quran",
  "hadith",
  "dua",
  "zikr",
  "name",
  "durood",
];

/** Translation edition used for Qur'an ayah full-text (matches /quran/search). */
const QURAN_SEARCH_EDITION = "en-pickthall";

const DEFAULT_GROUP_LIMIT = 6;
const DEFAULT_AYAH_LIMIT = 8;

// ── Normalization ────────────────────────────────────────────────────────────

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

// ── Fuzzy index (Fuse over normalized fields) ────────────────────────────────

/**
 * Fuse fuzziness: lower = stricter. 0.2 keeps typo tolerance (fatiah → Al-Fatihah,
 * forgivness → forgiveness) while eliminating the false positives 0.3 produced on
 * short fields like surah names.
 */
const FUSE_THRESHOLD = 0.2;
const MIN_TOKEN_LENGTH = 2;

/** A source item paired with its normalized, searchable fields. */
type FuseDoc<T> = { item: T } & Record<string, string>;

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

function makeFuse<T>(items: T[], fields: FuzzyField<T>[]): Fuse<FuseDoc<T>> {
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
function fusePattern(query: string): string {
  return tokenize(query)
    .filter((token) => token.length >= MIN_TOKEN_LENGTH)
    .join(" ");
}

function fuseSearch<T>(
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

/** "sahih" -> "Sahih"; used for the hadith grade badge. */
function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// ── Per-source indexes (lazy + cached) ───────────────────────────────────────

let duaFuse: Fuse<FuseDoc<DuaItem>> | null = null;
let zikrFuse: Fuse<FuseDoc<ZikrItem>> | null = null;
let duroodFuse: Fuse<FuseDoc<DurudItem>> | null = null;
let nameFuse: Fuse<FuseDoc<NameOfAllah>> | null = null;
let surahFuse: Fuse<FuseDoc<Surah>> | null = null;
let hadithFuse: Fuse<FuseDoc<HadithItem>> | null = null;

/** Precomputed 1-based position for each name (drives the "34/99" badge). */
const NAME_POSITION = new Map(NAMES_OF_ALLAH.map((name, index) => [name.id, index + 1]));

/** Shared dua field weights, used by the global index and per-category search. */
const DUA_FIELDS: FuzzyField<DuaItem>[] = [
  { key: "title", weight: 5, get: (d) => d.title },
  { key: "translit", weight: 3, get: (d) => d.transliteration },
  { key: "translation", weight: 2, get: (d) => d.translation },
  { key: "arabic", weight: 2, get: (d) => d.arabic },
  { key: "reference", weight: 1, get: (d) => d.reference },
  { key: "chapter", weight: 1, get: (d) => d.chapter },
  { key: "categoryId", weight: 1, get: (d) => d.categoryId },
];

/** Shared zikr field weights, used by the global index and per-category search. */
const ZIKR_FIELDS: FuzzyField<ZikrItem>[] = [
  { key: "title", weight: 5, get: (z) => z.title },
  { key: "translit", weight: 3, get: (z) => z.transliteration },
  { key: "translation", weight: 2, get: (z) => z.translation },
  { key: "arabic", weight: 2, get: (z) => z.arabic },
  { key: "reference", weight: 1, get: (z) => z.reference },
  { key: "categoryId", weight: 1, get: (z) => z.categoryId },
];

function getDuaFuse(): Fuse<FuseDoc<DuaItem>> {
  duaFuse ??= makeFuse(DUA_ITEMS, DUA_FIELDS);
  return duaFuse;
}

function getZikrFuse(): Fuse<FuseDoc<ZikrItem>> {
  zikrFuse ??= makeFuse(ZIKR_ITEMS, ZIKR_FIELDS);
  return zikrFuse;
}

function getDuroodFuse(): Fuse<FuseDoc<DurudItem>> {
  duroodFuse ??= makeFuse(DUROOD_ITEMS, [
    { key: "title", weight: 5, get: (d) => d.title },
    { key: "translit", weight: 3, get: (d) => d.transliteration },
    { key: "translation", weight: 2, get: (d) => d.translation },
    { key: "arabic", weight: 2, get: (d) => d.arabic },
  ]);
  return duroodFuse;
}

function getNameFuse(): Fuse<FuseDoc<NameOfAllah>> {
  nameFuse ??= makeFuse(NAMES_OF_ALLAH, [
    { key: "translit", weight: 5, get: (n) => n.transliteration },
    { key: "translation", weight: 3, get: (n) => n.translation },
    { key: "meaning", weight: 2, get: (n) => n.meaning },
    { key: "arabic", weight: 2, get: (n) => n.arabic },
  ]);
  return nameFuse;
}

function getSurahFuse(): Fuse<FuseDoc<Surah>> {
  surahFuse ??= makeFuse(getSurahMeta(), [
    { key: "translit", weight: 5, get: (s) => s.nameTransliteration },
    { key: "english", weight: 4, get: (s) => s.nameEnglish },
    { key: "number", weight: 5, get: (s) => String(s.number) },
    { key: "arabic", weight: 2, get: (s) => s.nameArabic },
  ]);
  return surahFuse;
}

/** Shared hadith field weights, used by the global index and per-collection search. */
const HADITH_FIELDS: FuzzyField<HadithItem>[] = [
  { key: "english", weight: 3, get: (h) => h.english },
  { key: "narrator", weight: 2, get: (h) => h.narrator },
  { key: "reference", weight: 2, get: (h) => h.reference },
  { key: "arabic", weight: 1, get: (h) => h.arabic },
];

function getHadithFuse(): Fuse<FuseDoc<HadithItem>> {
  if (!hadithFuse) {
    const items: HadithItem[] = [];
    for (const collection of getBundledCollections()) {
      const bundled = getBundledCollection(collection.id);
      if (bundled) items.push(...bundled.items);
    }
    hadithFuse = makeFuse(items, HADITH_FIELDS);
  }
  return hadithFuse;
}

/**
 * A fuzzy index over one hadith collection's items, for the in-collection search
 * bar. Memoize per collection (its item list is stable once loaded) — a remote
 * collection can hold thousands of hadith, so don't rebuild on every keystroke.
 */
export function createHadithSearch(items: HadithItem[]): FuzzyIndex<HadithItem> {
  return createFuzzyIndex(items, HADITH_FIELDS);
}

/**
 * A fuzzy index over one dua category's items, for the in-category search bar.
 * Memoize per category list — the bundled corpus is small, so a synchronous build
 * on first search is fine.
 */
export function createDuaSearch(items: DuaItem[]): FuzzyIndex<DuaItem> {
  return createFuzzyIndex(items, DUA_FIELDS);
}

/**
 * A fuzzy index over one zikr category's items, for the in-category search bar.
 */
export function createZikrSearch(items: ZikrItem[]): FuzzyIndex<ZikrItem> {
  return createFuzzyIndex(items, ZIKR_FIELDS);
}

/**
 * Fuzzy-ranked dua list for the duas index filter (title, translation, Arabic,
 * reference, chapter, or category id). Reuses the cached global dua index.
 */
export function searchDuaList(query: string, limit?: number): DuaItem[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  const matches = getDuaFuse().search(pattern, limit ? { limit } : undefined);
  return matches.map((match) => match.item.item);
}

/**
 * Fuzzy-ranked zikr list for the zikr index filter (title, translation, Arabic,
 * reference, or category id). Reuses the cached global zikr index.
 */
export function searchZikrList(query: string, limit?: number): ZikrItem[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  const matches = getZikrFuse().search(pattern, limit ? { limit } : undefined);
  return matches.map((match) => match.item.item);
}

/**
 * Fuzzy-ranked surah list for the Qur'an index filter (by name, English, number,
 * or Arabic). Reuses the cached global surah index. `[]` for a too-short query —
 * callers show the full list when the query is empty.
 */
export function searchSurahList(query: string, limit?: number): Surah[] {
  const pattern = fusePattern(query);
  if (!pattern) return [];
  const matches = getSurahFuse().search(pattern, limit ? { limit } : undefined);
  return matches.map((match) => match.item.item);
}

// ── Qur'an ayah index (lazy, heavy — build off the interaction thread) ────────

interface AyahRef {
  surah: number;
  ayah: number;
  surahName: string;
  translation: string;
  transliteration: string;
  arabic: string;
}

let ayahFuse: Fuse<FuseDoc<AyahRef>> | null = null;

/** Whether the (heavy) ayah Fuse index has already been built and cached. */
export function isAyahIndexReady(): boolean {
  return ayahFuse !== null;
}

/**
 * Build (once) the Fuse index over all 6,236 ayahs by pairing the bundled
 * translation and transliteration per surah. Normalizing ~12k strings on first
 * call is the heavy part, so callers run it via `InteractionManager`; afterwards
 * it is a cached in-memory fuzzy search.
 */
function getAyahFuse(): Fuse<FuseDoc<AyahRef>> {
  if (ayahFuse) return ayahFuse;
  const refs: AyahRef[] = [];
  for (const surah of getSurahMeta()) {
    const translation = getBundledEdition(QURAN_SEARCH_EDITION, surah.number);
    const transliteration = getTransliteration(surah.number);
    const ayahs = getSurahAyahs(surah.number);
    for (let a = 1; a <= surah.ayahCount; a++) {
      refs.push({
        surah: surah.number,
        ayah: a,
        surahName: surah.nameTransliteration,
        translation: translation[String(a)] ?? "",
        transliteration: transliteration[String(a)] ?? "",
        arabic: ayahs[a - 1]?.arabic ?? "",
      });
    }
  }
  ayahFuse = makeFuse(refs, [
    { key: "translation", weight: 2, get: (r) => r.translation },
    { key: "translit", weight: 2, get: (r) => r.transliteration },
  ]);
  return ayahFuse;
}

// ── Public search API ────────────────────────────────────────────────────────

function searchSurahs(query: string, limit: number) {
  return fuseSearch(getSurahFuse(), query, limit, (surah) => ({
    key: `quran-surah:${surah.number}`,
    category: "quran",
    title: surah.nameTransliteration,
    subtitle: surah.nameEnglish,
    arabic: surah.nameArabic,
    href: "/quran/[surah]",
    params: { surah: String(surah.number) },
  }));
}

function searchHadith(query: string, limit: number) {
  return fuseSearch(getHadithFuse(), query, limit, (item) => ({
    key: `hadith:${item.id}`,
    category: "hadith",
    title: item.reference,
    subtitle: item.english,
    arabic: item.arabic,
    reference: item.narrator,
    badge: item.grade ? capitalize(item.grade) : undefined,
    href: "/hadith/[collection]",
    params: { collection: item.collection },
  }));
}

function searchDuas(query: string, limit: number) {
  return fuseSearch(getDuaFuse(), query, limit, (item) => ({
    key: `dua:${item.id}`,
    category: "dua",
    title: item.title,
    subtitle: item.translation,
    arabic: item.arabic,
    reference: item.reference,
    badge: item.reference,
    href: "/dua/detail/[id]",
    params: { id: item.id },
  }));
}

function searchZikr(query: string, limit: number) {
  return fuseSearch(getZikrFuse(), query, limit, (item) => ({
    key: `zikr:${item.id}`,
    category: "zikr",
    title: item.title,
    subtitle: item.translation,
    arabic: item.arabic,
    reference: item.reference,
    badge: item.reference,
    href: "/zikr/detail/[id]",
    params: { id: item.id },
  }));
}

function searchNames(query: string, limit: number) {
  return fuseSearch(getNameFuse(), query, limit, (item) => ({
    key: `name:${item.id}`,
    category: "name",
    title: item.transliteration,
    subtitle: item.meaning ?? item.translation,
    arabic: item.arabic,
    badge: `${NAME_POSITION.get(item.id) ?? ""}/99`,
    href: "/names-of-allah",
  }));
}

function searchDuroods(query: string, limit: number) {
  return fuseSearch(getDuroodFuse(), query, limit, (item) => ({
    key: `durood:${item.id}`,
    category: "durood",
    title: item.title,
    subtitle: item.translation,
    arabic: item.arabic,
    reference: item.reference,
    badge: item.reference,
    href: "/duroods",
  }));
}

/**
 * Search the Qur'an ayah full-text index. Heavy on the very first call (builds
 * the Fuse index); callers should defer it so lighter results paint first.
 */
export function searchQuranAyahs(query: string, limit = DEFAULT_AYAH_LIMIT): SearchGroup {
  const { results, total } = fuseSearch(getAyahFuse(), query, limit, (ref) => ({
    key: `quran-ayah:${ref.surah}:${ref.ayah}`,
    category: "quran",
    title: ref.surahName,
    subtitle: ref.translation,
    arabic: ref.arabic,
    badge: `${ref.surah}:${ref.ayah}`,
    href: "/quran/[surah]",
    params: { surah: String(ref.surah), ayah: String(ref.ayah) },
  }));
  return { category: "quran", results, total };
}

/**
 * Instant fuzzy search over every source except Qur'an ayah full-text (that is
 * Qur'an *surah* names only here). Returns non-empty groups in {@link
 * SEARCH_CATEGORY_ORDER}. Pair with {@link searchQuranAyahs} for full coverage.
 */
export function searchLight(query: string, perGroupLimit = DEFAULT_GROUP_LIMIT): SearchGroup[] {
  if (fusePattern(query) === "") return [];

  const byCategory: Record<SearchCategory, { results: SearchResult[]; total: number }> = {
    quran: searchSurahs(query, perGroupLimit),
    hadith: searchHadith(query, perGroupLimit),
    dua: searchDuas(query, perGroupLimit),
    zikr: searchZikr(query, perGroupLimit),
    name: searchNames(query, perGroupLimit),
    durood: searchDuroods(query, perGroupLimit),
  };

  return SEARCH_CATEGORY_ORDER.map((category) => ({ category, ...byCategory[category] })).filter(
    (group) => group.total > 0,
  );
}

/**
 * Full synchronous search (light sources + Qur'an ayahs merged into the Qur'an
 * group, surah matches first). Convenient for tests and non-interactive callers;
 * the search screen composes {@link searchLight} + {@link searchQuranAyahs}
 * instead so it can defer the heavy ayah pass.
 */
export function searchAll(query: string, perGroupLimit = DEFAULT_GROUP_LIMIT): SearchGroup[] {
  const light = searchLight(query, perGroupLimit);
  const ayahs = searchQuranAyahs(query, perGroupLimit);
  if (ayahs.total === 0) return light;

  const hasQuran = light.some((group) => group.category === "quran");
  const groups: SearchGroup[] = hasQuran
    ? light.map((group) =>
        group.category === "quran"
          ? {
              category: "quran",
              results: [...group.results, ...ayahs.results].slice(0, perGroupLimit),
              total: group.total + ayahs.total,
            }
          : group,
      )
    : [ayahs, ...light];

  // Keep the fixed category order even when the Qur'an group was newly inserted.
  return SEARCH_CATEGORY_ORDER.map((category) =>
    groups.find((group) => group.category === category),
  ).filter((group): group is SearchGroup => Boolean(group));
}
