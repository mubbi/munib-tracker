import type {
  DuaItem,
  DurudItem,
  HadithItem,
  NameOfAllah,
  RevelationPlace,
  Surah,
  ZikrItem,
} from "@munib-tracker/shared/types";
import type Fuse from "fuse.js";

import { getBundledCollection, getBundledCollections } from "@/lib/hadith";
import { getBundledEdition, getSurahAyahs, getSurahMeta, getTransliteration } from "@/lib/quran";
import {
  createFuzzyIndex,
  type FuseDoc,
  type FuzzyField,
  type FuzzyIndex,
  fusePattern,
  fuseSearch,
  makeFuse,
} from "@/lib/search-fuse";
import {
  SEARCH_CATEGORY_ORDER,
  type SearchCategory,
  type SearchGroup,
  type SearchResult,
} from "@/lib/search-types";
import { resolveHadithTranslation, resolveTranslationField } from "@/lib/translation-locale";
import { preferencesStore } from "@/stores/preferences-store";

export type { FuzzyField, FuzzyIndex } from "@/lib/search-fuse";
export { createFuzzyIndex, normalize, tokenize } from "@/lib/search-fuse";
export type { SearchCategory, SearchGroup, SearchHref, SearchResult } from "@/lib/search-types";
export { SEARCH_CATEGORY_ORDER } from "@/lib/search-types";

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
 * - Learn guide corpora live in {@link ./search-guides} and load on first guide hit.
 */

function scriptureSubtitle<T extends { translation: string; translations?: unknown }>(
  item: T,
): string {
  return resolveTranslationField(item, preferencesStore.getState().prefs);
}

/** Translation edition used for Qur'an ayah full-text (matches /quran/search). */
const QURAN_SEARCH_EDITION = "en-pickthall";

const DEFAULT_GROUP_LIMIT = 6;
const DEFAULT_AYAH_LIMIT = 8;

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
let namePosition: Map<string, number> | null = null;

function loadDuaItems(): DuaItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@munib-tracker/shared/content/duas").DUA_ITEMS as DuaItem[];
}

function loadZikrItems(): ZikrItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@munib-tracker/shared/content/zikr").ZIKR_ITEMS as ZikrItem[];
}

function loadDuroodItems(): DurudItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@munib-tracker/shared/content/duroods").DUROOD_ITEMS as DurudItem[];
}

function loadNames(): NameOfAllah[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@munib-tracker/shared/content/names").NAMES_OF_ALLAH as NameOfAllah[];
}

function getNamePosition(): Map<string, number> {
  if (!namePosition) {
    namePosition = new Map(loadNames().map((name, index) => [name.id, index + 1]));
  }
  return namePosition;
}

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
  duaFuse ??= makeFuse(loadDuaItems(), DUA_FIELDS);
  return duaFuse;
}

function getZikrFuse(): Fuse<FuseDoc<ZikrItem>> {
  zikrFuse ??= makeFuse(loadZikrItems(), ZIKR_FIELDS);
  return zikrFuse;
}

/** Shared durood field weights, used by the global index and per-screen search. */
const DUROOD_FIELDS: FuzzyField<DurudItem>[] = [
  { key: "title", weight: 5, get: (d) => d.title },
  { key: "translit", weight: 3, get: (d) => d.transliteration },
  { key: "translation", weight: 2, get: (d) => d.translation },
  { key: "arabic", weight: 2, get: (d) => d.arabic },
];

/** Shared 99-names field weights, used by the global index and per-screen search. */
const NAME_FIELDS: FuzzyField<NameOfAllah>[] = [
  { key: "translit", weight: 5, get: (n) => n.transliteration },
  { key: "translation", weight: 3, get: (n) => n.translation },
  { key: "meaning", weight: 2, get: (n) => n.meaning },
  { key: "arabic", weight: 2, get: (n) => n.arabic },
];

function getDuroodFuse(): Fuse<FuseDoc<DurudItem>> {
  duroodFuse ??= makeFuse(loadDuroodItems(), DUROOD_FIELDS);
  return duroodFuse;
}

function getNameFuse(): Fuse<FuseDoc<NameOfAllah>> {
  nameFuse ??= makeFuse(loadNames(), NAME_FIELDS);
  return nameFuse;
}

/** A fuzzy index over the duroods list, for the in-screen search bar. */
export function createDuroodSearch(items: DurudItem[]): FuzzyIndex<DurudItem> {
  return createFuzzyIndex(items, DUROOD_FIELDS);
}

/** A fuzzy index over the 99 names, for the in-screen search bar. */
export function createNameSearch(items: NameOfAllah[]): FuzzyIndex<NameOfAllah> {
  return createFuzzyIndex(items, NAME_FIELDS);
}

function surahRevelationLabel(place: RevelationPlace): string {
  return place === "makkah" ? "makki makkah meccan" : "madani madinah medinan";
}

function getSurahFuse(): Fuse<FuseDoc<Surah>> {
  surahFuse ??= makeFuse(getSurahMeta(), [
    { key: "translit", weight: 5, get: (s) => s.nameTransliteration },
    { key: "english", weight: 4, get: (s) => s.nameEnglish },
    { key: "number", weight: 5, get: (s) => String(s.number) },
    { key: "arabic", weight: 3, get: (s) => s.nameArabic },
    { key: "revelation", weight: 1, get: (s) => surahRevelationLabel(s.revelationPlace) },
  ]);
  return surahFuse;
}

/** Makki / Madani filter for the Qur'an surah list. */
export type SurahRevelationFilter = "all" | RevelationPlace;

export interface SearchSurahListOptions {
  limit?: number;
  revelation?: SurahRevelationFilter;
}

function applySurahRevelationFilter(
  surahs: Surah[],
  revelation: SurahRevelationFilter = "all",
): Surah[] {
  if (revelation === "all") return surahs;
  return surahs.filter((surah) => surah.revelationPlace === revelation);
}

/** Exact surah number (1–114) when the query is a bare integer. */
function exactSurahNumberMatch(query: string): Surah | null {
  const trimmed = query.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return null;
  const number = Number(trimmed);
  if (number < 1 || number > 114) return null;
  return getSurahMeta().find((surah) => surah.number === number) ?? null;
}

/** Shared hadith field weights, used by the global index and per-collection search. */
const HADITH_FIELDS: FuzzyField<HadithItem>[] = [
  { key: "english", weight: 3, get: (h) => h.english },
  {
    key: "translation",
    weight: 3,
    get: (h) => resolveHadithTranslation(h, preferencesStore.getState().prefs),
  },
  { key: "narrator", weight: 2, get: (h) => h.narrator },
  { key: "reference", weight: 2, get: (h) => h.reference },
  { key: "arabic", weight: 1, get: (h) => h.arabic },
];

function getHadithFuse(): Fuse<FuseDoc<HadithItem>> {
  if (!hadithFuse) {
    const items: HadithItem[] = [];
    // Universal / light search indexes Nawawi only. Riyad (~2.2 MB) stays lazy —
    // open that collection (or call ensureRiyadHadithSearch) to search it.
    for (const collection of getBundledCollections()) {
      if (collection.id === "riyad_assalihin") continue;
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
 * Fuzzy-ranked surah list for the Qur'an index filter (transliteration, English
 * meaning, number, Arabic, or makki/madani). Reuses the cached global surah
 * index. An empty query returns the full list (optionally revelation-filtered).
 */
export function searchSurahList(query: string, options?: number | SearchSurahListOptions): Surah[] {
  const { limit, revelation = "all" } =
    typeof options === "number" ? { limit: options, revelation: "all" as const } : (options ?? {});

  const trimmed = query.trim();
  if (!trimmed) {
    return applySurahRevelationFilter(getSurahMeta(), revelation);
  }

  const exact = exactSurahNumberMatch(trimmed);
  if (exact) {
    const matched = applySurahRevelationFilter([exact], revelation);
    return limit ? matched.slice(0, limit) : matched;
  }

  const pattern = fusePattern(trimmed);
  if (!pattern) return [];

  const matches = getSurahFuse().search(pattern);
  const ranked = applySurahRevelationFilter(
    matches.map((match) => match.item.item),
    revelation,
  );
  return limit ? ranked.slice(0, limit) : ranked;
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

/** Drop the ayah Fuse index (e.g. when leaving Qur'an search) to reclaim heap. */
export function clearAyahIndex(): void {
  ayahFuse = null;
}

/**
 * Build (once) the Fuse index over all 6,236 ayahs by pairing the bundled
 * translation, transliteration, and Arabic text per surah — so an Arabic-script
 * query finds the ayah, not just its surah name. Normalizing ~18k strings on
 * first call is the heavy part, so callers defer it via `runWhenIdle`;
 * afterwards it is a cached in-memory fuzzy search.
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
    { key: "arabic", weight: 2, get: (r) => r.arabic },
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
  const prefs = preferencesStore.getState().prefs;
  return fuseSearch(getHadithFuse(), query, limit, (item) => ({
    key: `hadith:${item.id}`,
    category: "hadith",
    title: item.reference,
    subtitle: resolveHadithTranslation(item, prefs),
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
    subtitle: scriptureSubtitle(item),
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
    subtitle: scriptureSubtitle(item),
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
    subtitle: item.meaning ?? scriptureSubtitle(item),
    arabic: item.arabic,
    badge: `${getNamePosition().get(item.id) ?? ""}/99`,
    href: "/names-of-allah",
  }));
}

function searchDuroods(query: string, limit: number) {
  return fuseSearch(getDuroodFuse(), query, limit, (item) => ({
    key: `durood:${item.id}`,
    category: "durood",
    title: item.title,
    subtitle: scriptureSubtitle(item),
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

  // Guides are a separate module so dua/zikr/quran screens do not evaluate ~700 KB
  // of English Learn corpora until universal search actually needs them.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { searchGuideGroups } = require("./search-guides") as typeof import("./search-guides");
  const guides = searchGuideGroups(query, perGroupLimit);

  const byCategory: Record<SearchCategory, { results: SearchResult[]; total: number }> = {
    quran: searchSurahs(query, perGroupLimit),
    hadith: searchHadith(query, perGroupLimit),
    dua: searchDuas(query, perGroupLimit),
    zikr: searchZikr(query, perGroupLimit),
    name: searchNames(query, perGroupLimit),
    durood: searchDuroods(query, perGroupLimit),
    ...guides,
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
