import { getTafsirEdition } from "@munib-tracker/shared/i18n";

import { hasEditionAyahs } from "@/api/quran-remote";
import { QuranCacheRepository } from "@/db";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { fetchStaticJson } from "@/lib/static-json-fetch";

/**
 * On-demand ayah tafsir (spa5k/tafsir_api + fawaz Siraj). Cache-first over
 * AsyncStorage via {@link QuranCacheRepository} with a `tafsir:` id prefix so
 * keys never collide with translation edition caches.
 */

const SPA5K_BASE = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";
const FAWAZ_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";
const SPA5K_PROVIDER = "spa5k/tafsir_api";
const FAWAZ_PROVIDER = "fawazahmed0/quran-api";

/** Namespace cache keys away from D2 translation editions. */
export function tafsirCacheEditionId(editionId: string): string {
  return editionId.startsWith("tafsir:") ? editionId : `tafsir:${editionId}`;
}

type Spa5kAyah = { ayah?: number; verse?: number; surah?: number; text?: string };
type Spa5kSurahPayload = { ayahs?: Spa5kAyah[] } | Spa5kAyah[];

type FawazVerse = { verse: number; text: string };
type FawazSurahPayload = { chapter?: FawazVerse[]; quran?: FawazVerse[] };

/** @internal Exported for unit tests. */
export function ayahMapFromSpa5kPayload(data: Spa5kSurahPayload): Record<string, string> {
  const ayahs = Array.isArray(data) ? data : (data.ayahs ?? []);
  const out: Record<string, string> = {};
  for (const row of ayahs) {
    const n = row.ayah ?? row.verse;
    const text = row.text?.trim() ?? "";
    if (n == null || text.length === 0) continue;
    out[String(n)] = text;
  }
  return out;
}

function ayahMapFromFawazPayload(data: FawazSurahPayload): Record<string, string> {
  const verses = data.chapter ?? data.quran ?? [];
  const out: Record<string, string> = {};
  for (const v of verses) {
    if (v.text?.trim()) out[String(v.verse)] = v.text;
  }
  return out;
}

/**
 * Cache-first fetch of one tafsir edition for a surah. Returns ayah-number → text.
 */
export async function fetchTafsirSurah(
  editionId: string,
  surah: number,
): Promise<Record<string, string>> {
  const cacheId = tafsirCacheEditionId(editionId);
  const cached = await QuranCacheRepository.get(cacheId, surah);
  if (hasEditionAyahs(cached)) return cached;

  const def = getTafsirEdition(editionId);
  const contentKey = `quran_tafsir:${editionId}:${surah}`;
  const contentMeta = {
    contentId: editionId,
    sourceSlug: def?.slug,
    displayName: def?.name,
    language: def?.language,
    kind: "tafsir" as const,
    direction: def?.direction,
    surah,
    decisionId: "D2",
  };

  if (!def) {
    const error = new Error(`Unknown tafsir edition: ${editionId}`);
    reportOssContentDownloadFailure({
      contentKind: "quran_edition",
      contentKey,
      sourceProvider: SPA5K_PROVIDER,
      sourceUrl: SPA5K_BASE,
      contentMeta,
      errorCode: "unknown_content",
      errorMessage: error.message,
      error,
    });
    throw error;
  }

  let out: Record<string, string>;
  let sourceProvider: string;
  let sourceUrl: string;

  if (def.provider === "fawaz") {
    sourceProvider = FAWAZ_PROVIDER;
    sourceUrl = `${FAWAZ_BASE}/${def.slug}/${surah}.json`;
    const data = await fetchStaticJson<FawazSurahPayload>(sourceUrl, {
      contentKind: "quran_edition",
      contentKey,
      sourceProvider,
      contentMeta,
    });
    out = ayahMapFromFawazPayload(data);
  } else {
    sourceProvider = SPA5K_PROVIDER;
    sourceUrl = `${SPA5K_BASE}/${def.slug}/${surah}.json`;
    const data = await fetchStaticJson<Spa5kSurahPayload>(sourceUrl, {
      contentKind: "quran_edition",
      contentKey,
      sourceProvider,
      contentMeta,
    });
    out = ayahMapFromSpa5kPayload(data);
  }

  if (!hasEditionAyahs(out)) {
    const error = new Error(`Empty tafsir payload for ${editionId} surah ${surah}`);
    reportOssContentDownloadFailure({
      contentKind: "quran_edition",
      contentKey,
      sourceProvider,
      sourceUrl,
      contentMeta,
      errorCode: "empty_payload",
      errorMessage: error.message,
      error,
    });
    throw error;
  }

  await QuranCacheRepository.set(cacheId, surah, out);
  return out;
}

/**
 * Fetch a single ayah when the surah map is missing that ayah (rare fallback).
 */
export async function fetchTafsirAyah(
  editionId: string,
  surah: number,
  ayah: number,
): Promise<string | null> {
  const surahMap = await fetchTafsirSurah(editionId, surah);
  const hit = surahMap[String(ayah)]?.trim();
  if (hit) return hit;

  const def = getTafsirEdition(editionId);
  if (def?.provider !== "spa5k") return null;

  const url = `${SPA5K_BASE}/${def.slug}/${surah}/${ayah}.json`;
  try {
    const data = await fetchStaticJson<{ text?: string }>(url, {
      contentKind: "quran_edition",
      contentKey: `quran_tafsir:${editionId}:${surah}:${ayah}`,
      sourceProvider: SPA5K_PROVIDER,
      contentMeta: {
        contentId: editionId,
        sourceSlug: def.slug,
        displayName: def.name,
        language: def.language,
        kind: "tafsir",
        surah,
        decisionId: "D2",
      },
    });
    const text = data.text?.trim() ?? "";
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}
