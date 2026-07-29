import type { HadithItem } from "@munib-tracker/shared/types";

import { resolveHadithTranslation } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";

/** Resolved hadith translation for the user's `translationLocale` preference. */
export function useHadithTranslation(
  item: Pick<HadithItem, "english" | "arabic" | "translations">,
): string {
  const { translationLocale } = usePreferences();
  return resolveHadithTranslation(item, { translationLocale });
}
