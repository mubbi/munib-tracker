import type { Ayah, MushafPageLayout } from "@munib-tracker/shared/types";
import {
  arabicLoaders,
  ayahMetaLoaders,
  mushafPageLoaders,
  translationLoaders,
  transliterationLoaders,
} from "./quran-loader";
import {
  GLOBAL_OFFSETS,
  getBundledEditions,
  getEditionById,
  getJuzList,
  getPageList,
  getPageStarts,
  getSurahByNumber,
  getSurahMeta,
  type JuzListEntry,
  juzForAyah,
  type PageListEntry,
  type PageStart,
  pageToStartAyah,
  pos,
  QURAN_TOTAL_PAGES,
  SAJDA_AYAHS,
} from "./quran-meta";

export type { JuzListEntry, PageListEntry, PageStart };
export {
  getBundledEditions,
  getEditionById,
  getJuzList,
  getPageList,
  getPageStarts,
  getSurahByNumber,
  getSurahMeta,
  juzForAyah,
  pageToStartAyah,
};

// ── Bundled loaders (memoized, LRU-capped) ───────────────────────────────────

/** Keep recent surahs/pages warm without unbounded heap growth on long sessions. */
const MAX_SURAH_CACHE = 16;
const MAX_TRANSLATION_CACHE = 24;
const MAX_PAGE_CACHE = 10;

function setLruCache<K, V>(map: Map<K, V>, key: K, value: V, max: number): void {
  if (map.has(key)) map.delete(key);
  map.set(key, value);
  while (map.size > max) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

const arabicCache = new Map<number, Record<string, string>>();
const translitCache = new Map<number, Record<string, string>>();
const translationCache = new Map<string, Record<string, string>>();
const ayahMetaCache = new Map<number, Record<string, { page: number; hizb: number }>>();
const mushafPageCache = new Map<number, MushafPageLayout>();

function loadArabic(surah: number): Record<string, string> {
  let data = arabicCache.get(surah);
  if (!data) {
    data = arabicLoaders[surah]();
    setLruCache(arabicCache, surah, data, MAX_SURAH_CACHE);
  } else {
    setLruCache(arabicCache, surah, data, MAX_SURAH_CACHE);
  }
  return data;
}

function loadTranslit(surah: number): Record<string, string> {
  let data = translitCache.get(surah);
  if (!data) {
    data = transliterationLoaders[surah]();
    setLruCache(translitCache, surah, data, MAX_SURAH_CACHE);
  } else {
    setLruCache(translitCache, surah, data, MAX_SURAH_CACHE);
  }
  return data;
}

function loadAyahMeta(surah: number): Record<string, { page: number; hizb: number }> {
  let data = ayahMetaCache.get(surah);
  if (!data) {
    data = ayahMetaLoaders[surah]();
    setLruCache(ayahMetaCache, surah, data, MAX_SURAH_CACHE);
  } else {
    setLruCache(ayahMetaCache, surah, data, MAX_SURAH_CACHE);
  }
  return data;
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

export function getPageForAyah(surah: number, ayah: number): number {
  return loadAyahMeta(surah)[String(ayah)]?.page ?? 1;
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
  }
  setLruCache(mushafPageCache, page, layout, MAX_PAGE_CACHE);
  return layout;
}

export function getPageCount(): number {
  return QURAN_TOTAL_PAGES;
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
  }
  setLruCache(translationCache, cacheKey, data, MAX_TRANSLATION_CACHE);
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
