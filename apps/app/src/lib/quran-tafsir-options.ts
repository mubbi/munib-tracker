import {
  getTafsirEdition,
  QURAN_TAFSIR_EDITIONS,
  type QuranTafsirEditionDef,
  resolveDefaultTafsirId,
} from "@munib-tracker/shared/i18n";
import { type EditionLanguageGroup, groupEditionsByLanguage } from "@/lib/quran-edition-groups";

export type TafsirLanguageGroup = EditionLanguageGroup<QuranTafsirEditionDef>;

export function getAllTafsirEditions(): readonly QuranTafsirEditionDef[] {
  return QURAN_TAFSIR_EDITIONS;
}

export function groupTafsirsByLanguage(
  editions: readonly QuranTafsirEditionDef[],
  preferredLanguages: string[] = [],
): TafsirLanguageGroup[] {
  // Tafsir languages are bare codes: match "ur-PK" style preferences on the base.
  const preferred = new Set(preferredLanguages.map((l) => l.split("-")[0]?.toLowerCase() ?? l));
  return groupEditionsByLanguage(editions, preferred);
}

export function languageForTafsirId(
  editionId: string,
  editions: readonly QuranTafsirEditionDef[] = QURAN_TAFSIR_EDITIONS,
): string | undefined {
  return editions.find((edition) => edition.id === editionId)?.language;
}

/**
 * Resolves the active tafsir id from prefs, falling back to a locale default
 * only when prefs have never set a value (undefined). Explicit empty string means none.
 */
export function resolvePreferredTafsirId(
  preferredTafsirId: string | undefined,
  translationLocale: string,
  appLocale: string,
): string | undefined {
  if (preferredTafsirId === "") return undefined;
  if (preferredTafsirId && getTafsirEdition(preferredTafsirId)) return preferredTafsirId;
  return (
    resolveDefaultTafsirId(translationLocale) ?? resolveDefaultTafsirId(appLocale) ?? undefined
  );
}
