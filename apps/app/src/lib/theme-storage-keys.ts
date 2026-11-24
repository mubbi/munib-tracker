import { STORAGE_KEYS } from "@munib-tracker/theme/types";

/**
 * AsyncStorage keys of the device-local theme mirror. `MunibThemeProvider`
 * writes these so the first frame after launch paints the right colours before
 * the preferences blob hydrates; "Reset app data" must clear them too (B6).
 */
export const CUSTOM_ACCENT_KEY = "@munib-tracker/custom-accent";

export const THEME_MIRROR_KEYS = [
  STORAGE_KEYS.colorMode,
  STORAGE_KEYS.accent,
  CUSTOM_ACCENT_KEY,
] as const;
