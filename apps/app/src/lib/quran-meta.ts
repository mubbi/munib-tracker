/**
 * Surah / edition metadata without Qur'an ayah JSON loaders.
 * Import this from home, search (light), and reference helpers so Metro does
 * not pull the ~9 MB require-map in `quran-loader` into the shared web chunk.
 */
import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import type { Surah } from "@munib-tracker/shared/types";

import metaJson from "../../assets/data/quran/meta.json";
import pagesIndexJson from "../../assets/data/quran/pages/index.json";

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
export const SAJDA_AYAHS = new Set(
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

export function pos(surah: number, ayah: number): number {
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

export interface JuzListEntry {
  juz: number;
  surah: number;
  ayah: number;
  surahNameEnglish: string;
  surahNameArabic: string;
  surahNameTransliteration: string;
}

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

/** Cumulative ayah counts so we can derive a 1..6236 global number per ayah. */
export const GLOBAL_OFFSETS = (() => {
  const offsets: Record<number, number> = {};
  let running = 0;
  for (const surah of META.surahs) {
    offsets[surah.number] = running;
    running += surah.ayahCount;
  }
  return offsets;
})();

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

export function pageToStartAyah(page: number): PageStart | undefined {
  return PAGES_INDEX.starts.find((s) => s.page === page);
}

/**
 * Mushaf page for a surah:ayah from the Madinah-15 page-start index (no per-surah
 * ayah-meta JSON). Safe for light boot paths (stores, home) that must not pull
 * `quran-loader`.
 */
export function getPageForAyah(surah: number, ayah: number): number {
  const target = pos(surah, ayah);
  let page = 1;
  for (const start of PAGES_INDEX.starts) {
    if (pos(start.surah, start.ayah) > target) break;
    page = start.page;
  }
  return page;
}

export { JUZ_STARTS, QURAN_TOTAL_PAGES };
