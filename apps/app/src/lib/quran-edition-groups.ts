import type { AppLocale } from "@munib-tracker/shared/types";

import { APP_LOCALES } from "@/lib/locale-display";

/** Editions of one language (translation or tafsir pickers). */
export type EditionLanguageGroup<E> = {
  language: string;
  locale: AppLocale | null;
  name: string;
  english: string;
  editions: E[];
};

/**
 * Group editions by language: app-locale names (else the upper-cased code),
 * editions sorted by name, `preferred` languages first, then by display name.
 */
export function groupEditionsByLanguage<E extends { language: string; name: string }>(
  editions: readonly E[],
  preferred: ReadonlySet<string>,
): EditionLanguageGroup<E>[] {
  const byLang = new Map<string, E[]>();
  for (const edition of editions) {
    const list = byLang.get(edition.language) ?? [];
    list.push(edition);
    byLang.set(edition.language, list);
  }

  const groups: EditionLanguageGroup<E>[] = [];
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
