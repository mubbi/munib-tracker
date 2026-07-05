import type { Ayah, QuranEdition, Surah } from "@munib-tracker/shared/types";

import metaJson from "../../assets/data/quran/meta.json";
import { arabicLoaders, translationLoaders, transliterationLoaders } from "./quran-loader";

type SurahMeta = { surahs: Surah[]; editions: QuranEdition[] };

const META = metaJson as SurahMeta;

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

// ── Public selectors ─────────────────────────────────────────────────────────

export function getSurahMeta(): Surah[] {
  return META.surahs;
}

export function getSurahByNumber(n: number): Surah | undefined {
  return META.surahs.find((s) => s.number === n);
}

export function getBundledEditions(): QuranEdition[] {
  return META.editions;
}

export function getEditionById(id: string): QuranEdition | undefined {
  return META.editions.find((e) => e.id === id);
}

/** Full ayah list for a surah (Arabic + computed juz/sajda/global), memoized. */
export function getSurahAyahs(surah: number): Ayah[] {
  const arabic = loadArabic(surah);
  const offset = GLOBAL_OFFSETS[surah] ?? 0;
  const meta = getSurahByNumber(surah);
  const count = meta?.ayahCount ?? Object.keys(arabic).length;

  const ayahs: Ayah[] = [];
  for (let a = 1; a <= count; a++) {
    ayahs.push({
      surah,
      ayah: a,
      global: offset + a,
      arabic: arabic[String(a)] ?? "",
      juz: juzForAyah(surah, a),
      sajda: SAJDA_AYAHS.has(pos(surah, a)),
    });
  }
  return ayahs;
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
