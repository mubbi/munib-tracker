import type { QuranEditionKind } from "../types/quran";

import editionDefs from "./quran-edition-defs.json";

/**
 * Maps Munib's stable Qur'an edition ids (used in locale registry + user prefs)
 * to fawazahmed0/quran-api CDN slugs. Only dataset-backed editions belong here —
 * never invent translations.
 *
 * @see https://github.com/fawazahmed0/quran-api
 */
export interface QuranEditionRemoteDef {
  id: string;
  fawaz: string;
  name: string;
  language: string;
  direction: "ltr" | "rtl";
  kind?: QuranEditionKind;
}

type EditionDefJson = QuranEditionRemoteDef & { bundled?: boolean };

const ALL_EDITIONS = editionDefs as EditionDefJson[];

/** Editions shipped offline in `assets/data/quran/translation/`. */
export const BUNDLED_QURAN_EDITION_IDS: ReadonlySet<string> = new Set(
  ALL_EDITIONS.filter((ed) => ed.bundled).map((ed) => ed.id),
);

/** Every remote-fetchable edition (deduped by id). */
export const QURAN_REMOTE_EDITIONS: readonly QuranEditionRemoteDef[] = ALL_EDITIONS.map(
  ({ bundled: _bundled, ...ed }) => ed,
);

export function getQuranRemoteEdition(editionId: string): QuranEditionRemoteDef | undefined {
  return QURAN_REMOTE_EDITIONS.find((d) => d.id === editionId);
}

export function fawazSlugForEdition(editionId: string): string | undefined {
  return getQuranRemoteEdition(editionId)?.fawaz;
}
