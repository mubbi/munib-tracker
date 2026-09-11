/**
 * Bundled OFL Noto Sans Devanagari for offline Hindi scripture/UI text on native.
 * Source .ttf + OFL license live in `assets/fonts/`.
 */
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const NotoSansDevanagari = require("../../assets/fonts/NotoSansDevanagari-Regular.ttf") as any;

/** Font files registered at startup alongside Bengali / Arabic typefaces. */
export const DEVANAGARI_FONT_FILES = {
  NotoSansDevanagari,
} as const;

export const DEVANAGARI_FONT_FAMILY = "NotoSansDevanagari";
