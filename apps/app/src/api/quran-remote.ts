import {
  BUNDLED_QURAN_EDITION_IDS,
  fawazSlugForEdition,
  QURAN_REMOTE_EDITIONS,
} from "@munib-tracker/shared/i18n";
import type { QuranEdition } from "@munib-tracker/shared/types";

import { QuranCacheRepository } from "@/db";
import { fetchStaticJson } from "@/lib/static-json-fetch";

/**
 * D2 — extra Qur'an translations fetched on demand from fawazahmed0/quran-api
 * (no key). Cache-first over AsyncStorage (`quran-cache-repository`).
 */

const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";

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
  if (cached) return cached;

  const slug = fawazSlugForEdition(editionId);
  if (!slug) {
    throw new Error(`Unknown remote Qur'an edition: ${editionId}`);
  }

  const data = await fetchStaticJson<{ quran?: { verse: number; text: string }[] }>(
    `${FAWAZ}/${slug}/${surah}.json`,
  );
  const verses = data.quran ?? [];
  const out: Record<string, string> = {};
  for (const v of verses) {
    out[String(v.verse)] = v.text;
  }
  await QuranCacheRepository.set(editionId, surah, out);
  return out;
}
