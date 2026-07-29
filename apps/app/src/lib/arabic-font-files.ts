/**
 * Bundled OFL-licensed Arabic typefaces (offline-first). Source .ttf + OFL
 * license files live in `assets/fonts/`. Only import this module from Settings →
 * Fonts (or deferred root warm) — Metro resolves requires to hashed static assets.
 */
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const Amiri = require("../../assets/fonts/Amiri-Regular.ttf") as any;
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const ScheherazadeNew = require("../../assets/fonts/ScheherazadeNew-Regular.ttf") as any;
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const NotoNaskhArabic = require("../../assets/fonts/NotoNaskhArabic-Regular.ttf") as any;
/** King Fahd Complex Uthmanic Hafs (bundled for mushaf mode). */
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
const QpcHafs = require("../../assets/fonts/qpc-hafs.ttf") as any;

/**
 * Font files for the Settings → Fonts Arabic typeface picker (NF-1.31).
 * Keys must match the `fontFamily` values in `ARABIC_FONT_OPTIONS`.
 */
export const ARABIC_FONT_FILES = {
  Amiri,
  ScheherazadeNew,
  NotoNaskhArabic,
  QPC_Hafs: QpcHafs,
} as const;
