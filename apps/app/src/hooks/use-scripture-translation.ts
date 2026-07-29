import type { UserPreferences } from "@munib-tracker/shared/types";
import { resolveTranslationField } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";

/** Resolved scripture translation for the user's `translationLocale` preference. */
export function useScriptureTranslation<T extends { translation: string; translations?: unknown }>(
  item: T,
): string {
  const { translationLocale } = usePreferences();
  return resolveTranslationField(item, { translationLocale });
}

/** Non-hook variant when prefs are already available. */
export function scriptureTranslationForPrefs<
  T extends { translation: string; translations?: unknown },
>(item: T, prefs: Pick<UserPreferences, "translationLocale">): string {
  return resolveTranslationField(item, prefs);
}
