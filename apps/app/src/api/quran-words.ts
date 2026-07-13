/**
 * Cache-first Qur'an word-by-word (NF-2.7) via api.quran.com v4.
 * Not bundled — fetched per surah and cached like remote editions.
 */
import type { QuranWord } from "@munib-tracker/shared/types";

import { QuranStudyCacheRepository } from "@/db";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { fetchStaticJson } from "@/lib/static-json-fetch";

const QURAN_COM = "https://api.quran.com/api/v4";
const AUDIO_CDN = "https://audio.qurancdn.com";
const SOURCE_PROVIDER = "api.quran.com/v4";

type ApiWord = {
  position: number;
  char_type_name?: string;
  text_uthmani?: string;
  text?: string;
  audio_url?: string | null;
  translation?: { text?: string };
  transliteration?: { text?: string };
};

type ApiVerse = {
  verse_number: number;
  words?: ApiWord[];
};

type ApiChapterResponse = {
  verses?: ApiVerse[];
  pagination?: { next_page?: number | null };
};

/** Timing segment for one word during recitation: [wordSeq, startMs, endMs]. */
export type WordTimingSegment = [number, number, number];

export type SurahWordsMap = Record<string, QuranWord[]>;

function absoluteWordAudio(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${AUDIO_CDN}/${url.replace(/^\//, "")}`;
}

function wordsFromApi(words: ApiWord[] | undefined): QuranWord[] {
  if (!words?.length) return [];
  return words
    .filter((w) => (w.char_type_name ?? "word") === "word")
    .map((w) => ({
      arabic: w.text_uthmani ?? w.text ?? "",
      translit: w.transliteration?.text ?? "",
      gloss: w.translation?.text ?? "",
      audioUrl: absoluteWordAudio(w.audio_url),
    }))
    .filter((w) => w.arabic.length > 0);
}

function hasWords(data: SurahWordsMap | null | undefined): data is SurahWordsMap {
  if (!data) return false;
  for (const words of Object.values(data)) {
    if (words.length > 0) return true;
  }
  return false;
}

/**
 * Fetch all word-by-word rows for a surah. `language` is a primary subtag
 * (e.g. "en", "ur") used for glosses. Cache-first.
 */
export async function fetchSurahWords(surah: number, language = "en"): Promise<SurahWordsMap> {
  const lang = language.split("-")[0]?.toLowerCase() || "en";
  const cacheKey = `words:v2:${lang}:${surah}`;
  const cached = await QuranStudyCacheRepository.get<SurahWordsMap>(cacheKey);
  if (hasWords(cached)) return cached;

  const contentKey = `quran_wbw:${lang}:${surah}`;
  const contentMeta = {
    contentId: "quran-words",
    sourceSlug: "quran.com/v4/verses",
    displayName: "Word-by-word (Quran.com)",
    language: lang,
    surah,
  };

  const out: SurahWordsMap = {};
  let page = 1;
  const perPage = 50;

  while (true) {
    const url =
      `${QURAN_COM}/verses/by_chapter/${surah}` +
      `?language=${encodeURIComponent(lang)}&words=true` +
      `&word_fields=text_uthmani,translation,transliteration,audio_url` +
      `&per_page=${perPage}&page=${page}`;

    const data = await fetchStaticJson<ApiChapterResponse>(url, {
      contentKind: "quran_edition",
      contentKey,
      sourceProvider: SOURCE_PROVIDER,
      contentMeta: { ...contentMeta, page },
    });

    for (const verse of data.verses ?? []) {
      out[String(verse.verse_number)] = wordsFromApi(verse.words);
    }

    if (!data.pagination?.next_page) break;
    page = data.pagination.next_page;
  }

  if (!hasWords(out)) {
    const error = new Error(`Empty word-by-word payload for surah ${surah} (${lang})`);
    reportOssContentDownloadFailure({
      contentKind: "quran_edition",
      contentKey,
      sourceProvider: SOURCE_PROVIDER,
      sourceUrl: `${QURAN_COM}/verses/by_chapter/${surah}`,
      contentMeta,
      errorCode: "empty_payload",
      errorMessage: error.message,
      error,
    });
    throw error;
  }

  await QuranStudyCacheRepository.set(cacheKey, out);
  return out;
}

/** @deprecated Prefer {@link fetchSurahWords}. */
export async function fetchSurahWordByWord(surah: number): Promise<Record<number, QuranWord[]>> {
  const map = await fetchSurahWords(surah, "en");
  const out: Record<number, QuranWord[]> = {};
  for (const [ayah, words] of Object.entries(map)) {
    out[Number(ayah)] = words;
  }
  return out;
}

type ChapterRecitationPayload = {
  audio_file?: {
    timestamps?: Array<{
      verse_key?: string;
      timestamp_from?: number;
      timestamp_to?: number;
      segments?: Array<number[]>;
    }>;
  };
};

/** Per-ayah word timings for one surah, keyed by ayah number string. */
export type SurahWordSegmentsMap = Record<string, WordTimingSegment[]>;

/**
 * Normalize chapter-absolute segments to per-ayah everyayah playback time
 * (subtract verse `timestamp_from`; drop malformed rows).
 */
export function normalizeAyahWordSegments(
  timestampFrom: number,
  raw: Array<number[]> | undefined,
): WordTimingSegment[] {
  if (!raw?.length) return [];
  const out: WordTimingSegment[] = [];
  for (const seg of raw) {
    if (!Array.isArray(seg) || seg.length < 3) continue;
    const wordSeq = Number(seg[0]);
    const start = Number(seg[1]);
    const end = Number(seg[2]);
    if (!Number.isFinite(wordSeq) || !Number.isFinite(start) || !Number.isFinite(end)) continue;
    out.push([wordSeq, Math.max(0, start - timestampFrom), Math.max(0, end - timestampFrom)]);
  }
  return out;
}

/**
 * Cache-first word timings for an entire surah from
 * `chapter_recitations/{id}/{surah}?segments=true`.
 * Per-ayah `by_ayah` URLs do not include segments on the public API.
 */
export async function fetchSurahWordSegments(
  recitationId: number,
  surah: number,
): Promise<SurahWordSegmentsMap> {
  const cacheKey = `segments:v2:${recitationId}:${surah}`;
  const cached = await QuranStudyCacheRepository.get<SurahWordSegmentsMap>(cacheKey);
  if (cached && Object.keys(cached).length > 0) return cached;

  const url = `${QURAN_COM}/chapter_recitations/${recitationId}/${surah}?segments=true`;
  const contentKey = `quran_segments:${recitationId}:${surah}`;

  try {
    const data = await fetchStaticJson<ChapterRecitationPayload>(url, {
      contentKind: "quran_audio",
      contentKey,
      sourceProvider: SOURCE_PROVIDER,
      contentMeta: {
        contentId: String(recitationId),
        surah,
        displayName: "Word timing segments",
      },
    });

    const out: SurahWordSegmentsMap = {};
    for (const verse of data.audio_file?.timestamps ?? []) {
      const key = verse.verse_key?.split(":")[1];
      if (!key) continue;
      const segments = normalizeAyahWordSegments(verse.timestamp_from ?? 0, verse.segments);
      if (segments.length > 0) out[key] = segments;
    }

    if (Object.keys(out).length > 0) {
      await QuranStudyCacheRepository.set(cacheKey, out);
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Word timing segments for one ayah (from the chapter segments payload).
 * Times are relative to the start of that ayah's audio file.
 */
export async function fetchAyahWordSegments(
  recitationId: number,
  surah: number,
  ayah: number,
): Promise<WordTimingSegment[] | null> {
  const map = await fetchSurahWordSegments(recitationId, surah);
  const segments = map[String(ayah)];
  return segments?.length ? segments : null;
}
