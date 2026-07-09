import { BUNDLED_QURAN_EDITION_IDS, getLocaleDefinition } from "@munib-tracker/shared/i18n";
import type { UserPreferences } from "@munib-tracker/shared/types";

/** Qur'an editions actually bundled offline (see `assets/data/quran/translation/`). */
export { BUNDLED_QURAN_EDITION_IDS as BUNDLED_QURAN_EDITIONS } from "@munib-tracker/shared/i18n";

/**
 * Resolves which Qur'an translation edition to default to, preferring the
 * user's `translationLocale` (falling back to `locale`, then the bundled
 * English default). Never invents an edition — only returns ids the registry
 * says are real (bundled or remote, wired in `quran-remote.ts`).
 */
export function resolveQuranEditionId(
  prefs: Pick<UserPreferences, "translationLocale" | "locale">,
): string {
  const fromTranslationLocale = getLocaleDefinition(prefs.translationLocale).quranEditionId;
  if (fromTranslationLocale) return fromTranslationLocale;
  const fromLocale = getLocaleDefinition(prefs.locale).quranEditionId;
  if (fromLocale) return fromLocale;
  return "en-pickthall";
}

/** Whether the resolved Qur'an edition is bundled offline vs fetched remotely. */
export function isBundledQuranEdition(editionId: string): boolean {
  return BUNDLED_QURAN_EDITION_IDS.has(editionId);
}

/**
 * Resolves the display translation for a dua/zikr/durud/name item against the
 * user's `translationLocale`. Falls back to the item's English `translation`
 * when no dataset-sourced translation exists for that locale — never
 * generates or paraphrases (see the Critical Rule in docs/TRANSLATIONS_TODO.md).
 */
export function resolveTranslationField<T extends { translation: string; translations?: unknown }>(
  item: T,
  prefs: Pick<UserPreferences, "translationLocale">,
): string {
  const translations = item.translations as Partial<Record<string, string>> | undefined;
  const preferred = translations?.[prefs.translationLocale];
  return preferred && preferred.trim().length > 0 ? preferred : item.translation;
}
