import type { AppLocale, QuranEdition } from "@munib-tracker/shared/types";

import { REMOTE_EDITIONS } from "@/api/quran-remote";
import { APP_LOCALES } from "@/lib/locale-display";
import { getBundledEditions } from "@/lib/quran";

/** Every primary Qur'an translation edition (bundled offline + remote on demand). */
export function getAllQuranTranslations(): QuranEdition[] {
  return [...getBundledEditions().filter((e) => e.kind === "translation"), ...REMOTE_EDITIONS];
}

export const ALL_QURAN_TRANSLATIONS = getAllQuranTranslations();

export type TranslationLanguageGroup = {
  language: string;
  locale: AppLocale | null;
  name: string;
  english: string;
  editions: QuranEdition[];
};

export function groupTranslationsByLanguage(
  editions: QuranEdition[],
  preferredLanguages: string[] = [],
): TranslationLanguageGroup[] {
  const byLang = new Map<string, QuranEdition[]>();
  for (const edition of editions) {
    const list = byLang.get(edition.language) ?? [];
    list.push(edition);
    byLang.set(edition.language, list);
  }

  const preferred = new Set(preferredLanguages);
  const groups: TranslationLanguageGroup[] = [];

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

export function languageForEditionId(
  editionId: string,
  editions: QuranEdition[],
): string | undefined {
  return editions.find((edition) => edition.id === editionId)?.language;
}
