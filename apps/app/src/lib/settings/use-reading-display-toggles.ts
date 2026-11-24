import { useCallback } from "react";

import { SHOW_TRANSLATION_SETTING, SHOW_TRANSLITERATION_SETTING } from "./reading-display";
import { useSetting } from "./use-setting";

export interface ReadingDisplayToggles {
  showTranslation: boolean;
  showTransliteration: boolean;
  setShowTranslation: (value: boolean) => Promise<void>;
  setShowTransliteration: (value: boolean) => Promise<void>;
  toggleTranslation: () => Promise<void>;
  toggleTransliteration: () => Promise<void>;
}

/**
 * Toolbar / filter-card shortcut to the app-wide translation + transliteration
 * pair (D13). Writes go through the registered settings, so every reader and
 * Settings › Text & fonts always show the same value.
 */
export function useReadingDisplayToggles(): ReadingDisplayToggles {
  const translation = useSetting<boolean>(SHOW_TRANSLATION_SETTING);
  const transliteration = useSetting<boolean>(SHOW_TRANSLITERATION_SETTING);
  const { value: showTranslation, setValue: setShowTranslation } = translation;
  const { value: showTransliteration, setValue: setShowTransliteration } = transliteration;
  const toggleTranslation = useCallback(
    () => setShowTranslation(!showTranslation),
    [setShowTranslation, showTranslation],
  );
  const toggleTransliteration = useCallback(
    () => setShowTransliteration(!showTransliteration),
    [setShowTransliteration, showTransliteration],
  );
  return {
    showTranslation,
    showTransliteration,
    setShowTranslation,
    setShowTransliteration,
    toggleTranslation,
    toggleTransliteration,
  };
}
