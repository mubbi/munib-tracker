/**
 * Cache-first Qur'an tajweed text via api.alquran.cloud `quran-tajweed` edition.
 * Markup uses Islamic Network rule tags like `[h:1[ٱ]` — rendered as colored spans.
 */
import type { TajweedRuleId, TajweedSegment } from "@munib-tracker/shared/types";

import { QuranStudyCacheRepository } from "@/db";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { fetchStaticJson } from "@/lib/static-json-fetch";

const API = "https://api.alquran.cloud/v1";
const EDITION = "quran-tajweed";
const SOURCE_PROVIDER = "api.alquran.cloud";

type SurahResponse = {
  code: number;
  data?: {
    ayahs?: Array<{ numberInSurah: number; text: string }>;
  };
};

/** Islamic Network single-letter rule codes → app tajweed rule ids. */
const LETTER_TO_RULE: Record<string, TajweedRuleId> = {
  h: "ham_wasl",
  s: "slnt",
  l: "laam_shamsiyah",
  n: "madda_normal",
  m: "madda_permissible",
  p: "madda_necessary",
  o: "madda_obligatory",
  q: "qalqalah",
  c: "ikhafa",
  f: "ikhafa_shafawi",
  e: "ikhafa_shafawi",
  w: "idgham_shafawi",
  i: "idgham_ghunnah",
  a: "idgham_wo_ghunnah",
  d: "idgham_wo_ghunnah",
  b: "idgham_wo_ghunnah",
  u: "iqlab",
  g: "ghunnah",
};

export type SurahTajweedMap = Record<string, TajweedSegment[]>;

/**
 * Parse Islamic Network tajweed markup into typed segments.
 *
 * Live `quran-tajweed` markup uses a single closing bracket:
 * `بِسْمِ [h:1[ٱ]للَّهِ [l[ل]رَّ…` → colored ham_wasl + laam_shamsiyah runs.
 * An optional second `]` is tolerated for older/docs samples.
 */
export function parseTajweedMarkup(raw: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  // `[h:1[ٱ]` or `[l[ل]` — optional trailing `]` for double-bracket samples.
  const re = /\[([a-z]+)(?::\d+)?\[([^\]]*)\]\]?/gi;
  let last = 0;
  let match: RegExpExecArray | null = re.exec(raw);
  while (match !== null) {
    if (match.index > last) {
      segments.push({ text: raw.slice(last, match.index) });
    }
    const letter = match[1].toLowerCase();
    const rule = LETTER_TO_RULE[letter];
    segments.push(rule ? { text: match[2], rule } : { text: match[2] });
    last = match.index + match[0].length;
    match = re.exec(raw);
  }
  if (last < raw.length) {
    segments.push({ text: raw.slice(last) });
  }
  return segments.filter((s) => s.text.length > 0);
}

function hasTajweedAyahs(data: SurahTajweedMap | null | undefined): data is SurahTajweedMap {
  if (!data) return false;
  return Object.keys(data).length > 0;
}

/** Cache-first fetch of parsed tajweed segments for one surah. */
export async function fetchSurahTajweed(surah: number): Promise<SurahTajweedMap> {
  // v3: parser fixed for single-`]` Islamic Network markup (v2 cached raw tags).
  const cacheKey = `tajweed:v3:${surah}`;
  const cached = await QuranStudyCacheRepository.get<SurahTajweedMap>(cacheKey);
  if (hasTajweedAyahs(cached)) return cached;

  const contentKey = `quran_tajweed:${surah}`;
  const contentMeta = {
    contentId: EDITION,
    sourceSlug: EDITION,
    displayName: "Tajweed (alquran.cloud)",
    surah,
  };
  const url = `${API}/surah/${surah}/${EDITION}`;

  const data = await fetchStaticJson<SurahResponse>(url, {
    contentKind: "quran_edition",
    contentKey,
    sourceProvider: SOURCE_PROVIDER,
    contentMeta,
  });

  const out: SurahTajweedMap = {};
  for (const ayah of data.data?.ayahs ?? []) {
    out[String(ayah.numberInSurah)] = parseTajweedMarkup(ayah.text);
  }

  if (!hasTajweedAyahs(out)) {
    const error = new Error(`Empty tajweed payload for surah ${surah}`);
    reportOssContentDownloadFailure({
      contentKind: "quran_edition",
      contentKey,
      sourceProvider: SOURCE_PROVIDER,
      sourceUrl: url,
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
