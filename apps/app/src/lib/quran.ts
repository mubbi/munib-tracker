import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import type { Ayah, MushafPageLayout, Surah } from "@munib-tracker/shared/types";

import metaJson from "../../assets/data/quran/meta.json";
import pagesIndexJson from "../../assets/data/quran/pages/index.json";
import {
  arabicLoaders,
  ayahMetaLoaders,
  mushafPageLoaders,
  translationLoaders,
  transliterationLoaders,
} from "./quran-loader";

type SurahMeta = {
  surahs: Surah[];
  editions: import("@munib-tracker/shared/types").QuranEdition[];
};

const META = metaJson as SurahMeta;
const PAGES_INDEX = pagesIndexJson as {
  pageCount: number;
  starts: Array<{ page: number; surah: number; ayah: number }>;
};

export interface PageStart {
  page: number;
  surah: number;
  ayah: number;
}

export interface PageListEntry extends PageStart {
  surahNameEnglish: string;
  surahNameArabic: string;
  surahNameTransliteration: string;
  juz: number;
}

// ── Canonical reference tables (computed at runtime, nothing fabricated) ──────

/** Starting ayah (surah:ayah) of each of the 30 juz — standard Hafs division. */
const JUZ_STARTS: Array<[number, number]> = [
  [1, 1],
  [2, 142],
  [2, 253],
  [3, 92],
  [4, 24],
  [4, 148],
  [5, 82],
  [6, 111],
  [7, 88],
  [8, 41],
  [9, 93],
  [11, 6],
  [12, 53],
  [15, 1],
  [17, 1],
  [18, 75],
  [21, 1],
  [23, 1],
  [25, 21],
  [27, 56],
  [29, 46],
  [33, 31],
  [36, 28],
  [39, 32],
  [41, 47],
  [46, 1],
  [51, 31],
  [58, 1],
  [67, 1],
  [78, 1],
];

/** The 15 places of prostration in the mushaf, as surah:ayah. */
const SAJDA_AYAHS = new Set(
  [
    [7, 206],
    [13, 15],
    [16, 50],
    [17, 109],
    [19, 58],
    [22, 18],
    [22, 77],
    [25, 60],
    [27, 26],
    [32, 15],
    [38, 24],
    [41, 38],
    [53, 62],
    [84, 21],
    [96, 19],
  ].map(([s, a]) => s * 1000 + a),
);

function pos(surah: number, ayah: number): number {
  return surah * 1000 + ayah;
}

export function juzForAyah(surah: number, ayah: number): number {
  const p = pos(surah, ayah);
  let juz = 1;
  for (let i = 0; i < JUZ_STARTS.length; i++) {
    const [s, a] = JUZ_STARTS[i];
    if (p >= pos(s, a)) juz = i + 1;
    else break;
  }
  return juz;
}

/** One entry per juz (1..30) with the surah:ayah it begins at + that surah's name. */
export interface JuzListEntry {
  juz: number;
  surah: number;
  ayah: number;
  surahNameEnglish: string;
  surahNameArabic: string;
  surahNameTransliteration: string;
}

/** The 30 juz start points, resolved against surah metadata for display. */
export function getJuzList(): JuzListEntry[] {
  return JUZ_STARTS.map(([surah, ayah], index) => {
    const meta = getSurahByNumber(surah);
    return {
      juz: index + 1,
      surah,
      ayah,
      surahNameEnglish: meta?.nameEnglish ?? `Surah ${surah}`,
      surahNameArabic: meta?.nameArabic ?? "",
      surahNameTransliteration: meta?.nameTransliteration ?? `Surah ${surah}`,
    };
  });
}

// Cumulative ayah counts so we can derive a 1..6236 global number per ayah.
const GLOBAL_OFFSETS = (() => {
  const offsets: Record<number, number> = {};
  let running = 0;
  for (const surah of META.surahs) {
    offsets[surah.number] = running;
    running += surah.ayahCount;
  }
  return offsets;
})();

// ── Bundled loaders (memoized) ───────────────────────────────────────────────

const arabicCache = new Map<number, Record<string, string>>();
const translitCache = new Map<number, Record<string, string>>();
const translationCache = new Map<string, Record<string, string>>();
const ayahMetaCache = new Map<number, Record<string, { page: number; hizb: number }>>();
const mushafPageCache = new Map<number, MushafPageLayout>();

function loadArabic(surah: number): Record<string, string> {
  let data = arabicCache.get(surah);
  if (!data) {
    data = arabicLoaders[surah]();
    arabicCache.set(surah, data);
  }
  return data;
}

function loadTranslit(surah: number): Record<string, string> {
  let data = translitCache.get(surah);
  if (!data) {
    data = transliterationLoaders[surah]();
    translitCache.set(surah, data);
  }
  return data;
}

function loadAyahMeta(surah: number): Record<string, { page: number; hizb: number }> {
  let data = ayahMetaCache.get(surah);
  if (!data) {
    data = ayahMetaLoaders[surah]();
    ayahMetaCache.set(surah, data);
  }
  return data;
}

// ── Public selectors ─────────────────────────────────────────────────────────

export function getSurahMeta(): Surah[] {
  return META.surahs;
}

export function getSurahByNumber(n: number): Surah | undefined {
  return META.surahs.find((s) => s.number === n);
}

export function getBundledEditions() {
  return META.editions;
}

export function getEditionById(id: string) {
  return META.editions.find((e) => e.id === id);
}

/** Full ayah list for a surah (Arabic + page/hizb/juz/sajda/global), memoized. */
export function getSurahAyahs(surah: number): Ayah[] {
  const arabic = loadArabic(surah);
  const metaMap = loadAyahMeta(surah);
  const offset = GLOBAL_OFFSETS[surah] ?? 0;
  const meta = getSurahByNumber(surah);
  const count = meta?.ayahCount ?? Object.keys(arabic).length;

  const ayahs: Ayah[] = [];
  for (let a = 1; a <= count; a++) {
    const pageMeta = metaMap[String(a)] ?? { page: 1, hizb: 1 };
    ayahs.push({
      surah,
      ayah: a,
      global: offset + a,
      arabic: arabic[String(a)] ?? "",
      juz: juzForAyah(surah, a),
      sajda: SAJDA_AYAHS.has(pos(surah, a)),
      page: pageMeta.page,
      hizb: pageMeta.hizb,
    });
  }
  return ayahs;
}

export function getPageStarts(): PageStart[] {
  return PAGES_INDEX.starts;
}

export function getPageList(): PageListEntry[] {
  return PAGES_INDEX.starts.map((entry) => {
    const meta = getSurahByNumber(entry.surah);
    return {
      ...entry,
      surahNameEnglish: meta?.nameEnglish ?? `Surah ${entry.surah}`,
      surahNameArabic: meta?.nameArabic ?? "",
      surahNameTransliteration: meta?.nameTransliteration ?? `Surah ${entry.surah}`,
      juz: juzForAyah(entry.surah, entry.ayah),
    };
  });
}

export function getPageForAyah(surah: number, ayah: number): number {
  return loadAyahMeta(surah)[String(ayah)]?.page ?? 1;
}

export function pageToStartAyah(page: number): PageStart | undefined {
  return PAGES_INDEX.starts.find((s) => s.page === page);
}

/** All ayahs appearing on a mushaf page (may span multiple surahs). */
export function getAyahsOnPage(page: number): Ayah[] {
  const start = pageToStartAyah(page);
  if (!start) return [];
  const nextStart = pageToStartAyah(page + 1);
  const ayahs: Ayah[] = [];

  outer: for (let surahNum = start.surah; surahNum <= 114; surahNum++) {
    const surahAyahs = getSurahAyahs(surahNum);
    for (const ayah of surahAyahs) {
      if (surahNum === start.surah && ayah.ayah < start.ayah) continue;
      if (nextStart) {
        const p = pos(ayah.surah, ayah.ayah);
        const nextP = pos(nextStart.surah, nextStart.ayah);
        if (p >= nextP) break outer;
      }
      if (ayah.page === page) ayahs.push(ayah);
      else if (ayah.page > page) break outer;
    }
  }
  return ayahs;
}

export function getPageLayout(page: number): MushafPageLayout {
  let layout = mushafPageCache.get(page);
  if (!layout) {
    const loader = mushafPageLoaders[page];
    if (!loader) throw new Error(`missing mushaf layout for page ${page}`);
    layout = loader();
    mushafPageCache.set(page, layout);
  }
  return layout;
}

export function getPageCount(): number {
  return PAGES_INDEX.pageCount ?? QURAN_TOTAL_PAGES;
}

/** Transliteration text keyed by ayah number for a surah. */
export function getTransliteration(surah: number): Record<string, string> {
  return loadTranslit(surah);
}

/** Bundled edition text (translation) keyed by ayah number for a surah. */
export function getBundledEdition(editionId: string, surah: number): Record<string, string> {
  if (editionId === "en-transliteration") return loadTranslit(surah);
  const loaders = translationLoaders[editionId];
  if (!loaders) return {};
  const cacheKey = `${editionId}:${surah}`;
  let data = translationCache.get(cacheKey);
  if (!data) {
    data = loaders[surah]();
    translationCache.set(cacheKey, data);
  }
  return data;
}

export function isBundledEdition(editionId: string): boolean {
  return editionId === "en-transliteration" || editionId in translationLoaders;
}

/** Parse verseRange like "2:1-2:2" into surah/ayah pairs on a mushaf line. */
export function parseVerseRange(
  verseRange: string | undefined,
): Array<{ surah: number; ayah: number }> {
  if (!verseRange) return [];
  const [startRaw, endRaw] = verseRange.split("-");
  const parseRef = (ref: string) => {
    const [s, a] = ref.split(":").map(Number);
    return { surah: s, ayah: a };
  };
  const start = parseRef(startRaw);
  const end = parseRef(endRaw ?? startRaw);
  const refs: Array<{ surah: number; ayah: number }> = [];
  for (let surah = start.surah; surah <= end.surah; surah++) {
    const surahMeta = getSurahByNumber(surah);
    const first = surah === start.surah ? start.ayah : 1;
    const last = surah === end.surah ? end.ayah : (surahMeta?.ayahCount ?? first);
    for (let ayah = first; ayah <= last; ayah++) refs.push({ surah, ayah });
  }
  return refs;
}
