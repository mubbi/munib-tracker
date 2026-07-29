import {
  getTafsirEdition,
  QURAN_TAFSIR_EDITIONS,
  type QuranTafsirEditionDef,
  resolveDefaultTafsirId,
} from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";

import { APP_LOCALES } from "@/lib/locale-display";

export type TafsirLanguageGroup = {
  language: string;
  locale: AppLocale | null;
  name: string;
  english: string;
  editions: QuranTafsirEditionDef[];
};

export function getAllTafsirEditions(): readonly QuranTafsirEditionDef[] {
  return QURAN_TAFSIR_EDITIONS;
}

export function groupTafsirsByLanguage(
  editions: readonly QuranTafsirEditionDef[],
  preferredLanguages: string[] = [],
): TafsirLanguageGroup[] {
  const byLang = new Map<string, QuranTafsirEditionDef[]>();
  for (const edition of editions) {
    const list = byLang.get(edition.language) ?? [];
    list.push(edition);
    byLang.set(edition.language, list);
  }

  const preferred = new Set(preferredLanguages.map((l) => l.split("-")[0]?.toLowerCase() ?? l));
  const groups: TafsirLanguageGroup[] = [];

  for (const [language, languageEditions] of byLang) {
    const localeEntry = APP_LOCALES.find((entry) => entry.code === language);
    groups.push({
      language,
      locale: localeEntry?.code ?? null,
      name: localeEntry?.name ?? language.toUpperCase(),
      english: localeEntry?.english ?? language.toUpperCase(),
      editions: [...languageEditions].sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  return groups.sort((a, b) => {
    const aPreferred = preferred.has(a.language) ? 0 : 1;
    const bPreferred = preferred.has(b.language) ? 0 : 1;
    if (aPreferred !== bPreferred) return aPreferred - bPreferred;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
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
