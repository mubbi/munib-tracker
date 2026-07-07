import type { QuranEdition, QuranEditionKind } from "@munib-tracker/shared/types";

import { QuranCacheRepository } from "@/db";
import { fetchStaticJson } from "@/lib/static-json-fetch";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * D2 — extra Qur'an translations fetched on demand from fawazahmed0/quran-api
 * (no key). There is no react-query persister, so every fetch is cache-first
 * over AsyncStorage (`quran-cache-repository`): opened translations work offline
 * afterward.
 */

const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";

interface RemoteEditionDef {
  id: string;
  fawaz: string;
  name: string;
  language: string;
  direction: "ltr" | "rtl";
  /** Defaults to "translation"; set to "tafsir" for on-demand tafsir editions (NF-1.10). */
  kind?: QuranEditionKind;
}

const REMOTE_DEFS: RemoteEditionDef[] = [
  {
    id: "en-saheehintl",
    fawaz: "eng-ummmuhammad",
    name: "Saheeh International",
    language: "en",
    direction: "ltr",
  },
  {
    id: "en-clearquran",
    fawaz: "eng-mustafakhattaba",
    name: "Clear Qur'an (Khattab)",
    language: "en",
    direction: "ltr",
  },
  // On-demand tafsir (NF-1.10) — cache-first like translations. Arabic, RTL.
  {
    id: "ar-tafsir-muyassar",
    fawaz: "ara-tafsirmuyassar",
    name: "Tafsir al-Muyassar (Arabic)",
    language: "ar",
    direction: "rtl",
    kind: "tafsir",
  },
];

export const REMOTE_EDITIONS: QuranEdition[] = REMOTE_DEFS.map((d) => ({
  id: d.id,
  kind: d.kind ?? "translation",
  language: d.language,
  name: d.name,
  bundled: false,
  direction: d.direction,
}));

export function isRemoteEdition(editionId: string): boolean {
  return REMOTE_DEFS.some((d) => d.id === editionId);
}

function fawazId(editionId: string): string | undefined {
  return REMOTE_DEFS.find((d) => d.id === editionId)?.fawaz;
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

  const fawaz = fawazId(editionId);
  if (!fawaz) throw new Error(`Unknown remote edition: ${editionId}`);

  const json = await fetchStaticJson<{ chapter: Array<{ verse: number; text: string }> }>(
    `${FAWAZ}/${fawaz}/${surah}.json`,
  );

  const map: Record<string, string> = {};
  for (const row of json.chapter) map[String(row.verse)] = row.text;

  // Persist to disk only when the user allows saving Qur'an editions locally;
  // otherwise it stays in the session cache and refetches next launch.
  const persist = preferencesStore.getState().prefs.cacheQuranEditionsLocally !== false;
  await QuranCacheRepository.set(editionId, surah, map, persist);
  return map;
}
