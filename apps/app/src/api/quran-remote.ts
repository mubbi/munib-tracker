import {
  BUNDLED_QURAN_EDITION_IDS,
  fawazSlugForEdition,
  getQuranRemoteEdition,
  QURAN_REMOTE_EDITIONS,
} from "@munib-tracker/shared/i18n";
import type { QuranEdition } from "@munib-tracker/shared/types";

import { QuranCacheRepository } from "@/db";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { fetchStaticJson } from "@/lib/static-json-fetch";

/**
 * D2 — extra Qur'an translations fetched on demand from fawazahmed0/quran-api
 * (no key). Cache-first over AsyncStorage (`quran-cache-repository`).
 */

const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";
const SOURCE_PROVIDER = "fawazahmed0/quran-api";

export const REMOTE_EDITIONS: QuranEdition[] = QURAN_REMOTE_EDITIONS.map((d) => ({
  id: d.id,
  kind: d.kind ?? "translation",
  language: d.language,
  name: d.name,
  bundled: false,
  direction: d.direction,
}));

export function isRemoteEdition(editionId: string): boolean {
  if (BUNDLED_QURAN_EDITION_IDS.has(editionId)) return false;
  return QURAN_REMOTE_EDITIONS.some((d) => d.id === editionId);
}

type FawazVerse = { verse: number; text: string };

/** fawazahmed0 per-surah payloads use `chapter`; older docs/mirrors used `quran`. */
type FawazSurahPayload = {
  chapter?: FawazVerse[];
  quran?: FawazVerse[];
};

/** True when a cache/query hit has at least one ayah string. */
export function hasEditionAyahs(
  ayahText: Record<string, string> | null | undefined,
): ayahText is Record<string, string> {
  if (!ayahText) return false;
  for (const value of Object.values(ayahText)) {
    if (value.trim().length > 0) return true;
  }
  return false;
}

function versesFromPayload(data: FawazSurahPayload): FawazVerse[] {
  return data.chapter ?? data.quran ?? [];
}

/**
 * Cache-first fetch of a remote edition for one surah. Returns ayah-number →
 * text. Reads AsyncStorage first; on a miss, fetches, then writes back so the
 * translation is available offline afterward.
 */
export async function fetchRemoteEditionSurah(
  editionId: string,
  surah: number,
): Promise<Record<string, string>> {
  const cached = await QuranCacheRepository.get(editionId, surah);
  // Empty maps were cached by an older parser that read the wrong JSON key —
  // treat them as a miss so we refetch the real edition.
  if (hasEditionAyahs(cached)) return cached;

  const slug = fawazSlugForEdition(editionId);
  const def = getQuranRemoteEdition(editionId);
  const contentKey = `quran_edition:${editionId}:${surah}`;
  const contentMeta = {
    contentId: editionId,
    sourceSlug: slug,
    displayName: def?.name,
    language: def?.language,
    kind: def?.kind ?? "translation",
    direction: def?.direction,
    surah,
    decisionId: "D2",
  };

  if (!slug) {
    const error = new Error(`Unknown remote Qur'an edition: ${editionId}`);
    reportOssContentDownloadFailure({
      contentKind: "quran_edition",
      contentKey,
      sourceProvider: SOURCE_PROVIDER,
      sourceUrl: FAWAZ,
      contentMeta,
      errorCode: "unknown_content",
      errorMessage: error.message,
      error,
    });
    throw error;
  }

  const url = `${FAWAZ}/${slug}/${surah}.json`;
  const data = await fetchStaticJson<FawazSurahPayload>(url, {
    contentKind: "quran_edition",
    contentKey,
    sourceProvider: SOURCE_PROVIDER,
    contentMeta,
  });
  const verses = versesFromPayload(data);
  const out: Record<string, string> = {};
  for (const v of verses) {
    out[String(v.verse)] = v.text;
  }

  if (!hasEditionAyahs(out)) {
    const error = new Error(`Empty Qur'an edition payload for ${editionId} surah ${surah}`);
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

  await QuranCacheRepository.set(editionId, surah, out);
  return out;
}
