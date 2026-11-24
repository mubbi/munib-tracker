import type { QuranEdition } from "@munib-tracker/shared/types";

import { REMOTE_EDITIONS } from "@/api/quran-remote";
import { type EditionLanguageGroup, groupEditionsByLanguage } from "@/lib/quran-edition-groups";
// quran-meta, not @/lib/quran: settings and the pickers must not pull the ayah JSON graph.
import { getBundledEditions } from "@/lib/quran-meta";

/** Every primary Qur'an translation edition (bundled offline + remote on demand). */
export function getAllQuranTranslations(): QuranEdition[] {
  return [...getBundledEditions().filter((e) => e.kind === "translation"), ...REMOTE_EDITIONS];
}

export const ALL_QURAN_TRANSLATIONS = getAllQuranTranslations();

export type TranslationLanguageGroup = EditionLanguageGroup<QuranEdition>;

export function groupTranslationsByLanguage(
  editions: QuranEdition[],
  preferredLanguages: string[] = [],
): TranslationLanguageGroup[] {
  return groupEditionsByLanguage(editions, new Set(preferredLanguages));
}

export function languageForEditionId(
  editionId: string,
  editions: QuranEdition[],
): string | undefined {
  return editions.find((edition) => edition.id === editionId)?.language;
}
