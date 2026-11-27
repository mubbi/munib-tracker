import type { ReadingDisplayPrefs } from "@munib-tracker/shared/types";

import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

import { DEFAULT_READING_DISPLAY, readingDisplayOf } from "./reading-display-migration";

export { DEFAULT_READING_DISPLAY, readingDisplayOf };

/** Setting ids of the app-wide pair (Text & fonts, D13). Toolbar chips use these with `useSetting`. */
export const SHOW_TRANSLATION_SETTING = "fonts.reading.showTranslation";
export const SHOW_TRANSLITERATION_SETTING = "fonts.reading.showTransliteration";

/**
 * App-wide translation / transliteration visibility for every reader: the
 * Qur'an (ayah, page), practice, hadith, duas, adhkar, duroods and tasbeeh.
 */
export function useReadingDisplay(): ReadingDisplayPrefs {
  const showTranslation = useStore(
    preferencesStore,
    (s) => s.prefs.readingDisplay?.showTranslation !== false,
  );
  const showTransliteration = useStore(
    preferencesStore,
    (s) => s.prefs.readingDisplay?.showTransliteration !== false,
  );
  return { showTranslation, showTransliteration };
}

/** Write one half of the pair (the registry defs' write path). */
export function setReadingDisplay(patch: Partial<ReadingDisplayPrefs>): Promise<void> {
  const current = readingDisplayOf(preferencesStore.getState().prefs);
  return preferencesStore.getState().update({ readingDisplay: { ...current, ...patch } });
}
