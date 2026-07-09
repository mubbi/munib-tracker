/**
 * Bundled OFL Noto Sans Bengali for offline Bengali scripture/UI text on native.
 * Source .ttf + OFL license live in `assets/fonts/`.
 */
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const NotoSansBengali = require("../../assets/fonts/NotoSansBengali-Regular.ttf") as any;

/** Font files registered at startup alongside Arabic typefaces. */
export const BENGALI_FONT_FILES = {
  NotoSansBengali,
} as const;

export const BENGALI_FONT_FAMILY = "NotoSansBengali";
