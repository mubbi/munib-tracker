/** Shared search result types (kept free of corpus imports). */

export type SearchCategory =
  | "quran"
  | "hadith"
  | "dua"
  | "zikr"
  | "durood"
  | "name"
  /** All Learn guides (Jannah, Seerah, Ruqyah, …) share one filter tab. */
  | "learn";

export type SearchHref =
  | "/quran/[surah]"
  | "/hadith/[collection]"
  | "/dua/detail/[id]"
  | "/zikr/detail/[id]"
  | "/duroods"
  | "/names-of-allah"
  | "/jannah/[topic]"
  | "/jahannam/[topic]"
  | "/last-day/[topic]"
  | "/salah-guide/[topic]"
  | "/battles/[topic]"
  | "/taharah/[topic]"
  | "/prophets/[topic]"
  | "/aqeedah/[topic]"
  | "/learn-dua/[topic]"
  | "/learn-quran/[topic]"
  | "/ruqyah/[topic]"
  | "/eid/[topic]"
  | "/friday/[topic]"
  | "/new-muslim/[topic]"
  | "/laylat-al-qadr/[topic]"
  | "/finance/[topic]"
  | "/zakat/[topic]"
  | "/sahaba/[id]"
  | "/seerah"
  | "/history"
  | "/hajj/[topic]"
  | "/travel"
  | "/hayd"
  | "/sick";

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
  "learn",
];
