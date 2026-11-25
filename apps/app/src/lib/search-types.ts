/** Shared search result types (kept free of corpus imports). */

import type { SettingsGroupPath } from "@/lib/settings/routes";

export type SearchCategory =
  | "quran"
  | "hadith"
  | "dua"
  | "zikr"
  | "durood"
  | "name"
  /** All Learn guides (Jannah, Seerah, Ruqyah, …) share one filter tab. */
  | "learn"
  /** Settings rows (NF-3.0b) — merged in by the search screen from `lib/settings/search`. */
  | "settings"
  /** NF-3.21 the user's own ayah notes — searched locally by the search screen. */
  | "notes"
  /** NF-3.22 Arabic roots from the on-device Quranic Arabic Corpus index. */
  | "roots";

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
  | "/white-days/[topic]"
  | "/new-muslim/[topic]"
  | "/laylat-al-qadr/[topic]"
  | "/finance/[topic]"
  | "/zakat/[topic]"
  | "/fidyah/[topic]"
  | "/janazah/[topic]"
  | "/prophets/tree"
  | "/sadaqah"
  | "/habits"
  // NF-3.13 Salah focus hub.
  | "/focus-lock"
  // NF-3.11 masjid finder (+ NF-3.12 timetable import from "Your times").
  | "/masjids"
  | "/dhul-hijjah"
  | "/umrah"
  | "/fidyah"
  | "/janazah"
  | "/sahaba/[id]"
  | "/seerah"
  | "/history"
  | "/hajj/[topic]"
  | "/travel"
  | "/hayd"
  | "/sick"
  | "/tasbeeh/free"
  | "/quran/notes"
  /** NF-3.22 root page (`params.root` = Buckwalter root). */
  | "/quran/roots/[root]"
  /** NF-3.22 Root tab of Qur'an search (Learn/guide search hit). */
  | "/quran/search?mode=root"
  | "/muhasabah"
  /** NF-3.8 / NF-3.9 private records (vault). */
  | "/debts"
  | "/wasiyyah"
  /** NF-3.10 Mirath calculator. */
  | "/mirath"
  | "/family-ties"
  | "/partner"
  | "/khatm-groups"
  /** NF-3.14 weekly gentle coach. */
  | "/coach"
  /** NF-3.2 voluntary fasting hub. */
  | "/fasting"
  /** NF-3.16 family & kids mode (parent view). */
  | "/family"
  /** NF-3.1 sunnah rawatib hub. */
  | "/rawatib"
  /** NF-3.0a fiqh difference comparison card (`params.id` = difference slug). */
  | "/fiqh/[id]"
  | SettingsGroupPath;

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
  // NF-3.22: a root match tops the list (Arabic input of 2–4 letters only).
  "roots",
  "quran",
  "hadith",
  "dua",
  "zikr",
  "name",
  "durood",
  "learn",
  "notes",
  "settings",
];

/**
 * Library destinations (screens, not content) — a result category of its own on
 * the search screen (P5-33). Its hits come from the Library tab index
 * (`createLibraryMenuSearch` in `lib/library-menu.ts`), not from `searchAll`, so
 * it is kept out of {@link SearchCategory} (whose groups the content engine fills).
 */
export const LIBRARY_SEARCH_CATEGORY = "library" as const;

/** Every category a search screen can group and filter by. */
export type SearchFilterCategory = SearchCategory | typeof LIBRARY_SEARCH_CATEGORY;

/** Group / filter-chip order on the search screen: content first, then Library destinations. */
export const SEARCH_FILTER_ORDER: SearchFilterCategory[] = [
  ...SEARCH_CATEGORY_ORDER,
  LIBRARY_SEARCH_CATEGORY,
];
