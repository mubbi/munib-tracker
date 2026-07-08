/**
 * Bundled OFL-licensed Arabic typefaces (offline-first, no `@expo-google-fonts`
 * network/runtime dependency). Source .ttf + OFL license files live alongside in
 * `assets/fonts/`. Metro requires resolve these to hashed static assets.
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

/** QCF V2 per-page font CDN (downloaded on demand, cached locally — see qcf-font-cache.ts). */
export const QCF_V2_FONT_CDN = "https://cdn.jsdelivr.net/gh/nuqayah/qpc-fonts@master/mushaf-v2";

export function qcfPageFontFamily(page: number): string {
  return `QCF2_${page}`;
}

export function qcfPageFontRemoteUrl(page: number): string {
  return `${QCF_V2_FONT_CDN}/QCF2${String(page).padStart(3, "0")}.ttf`;
}

/** Shared QCF V2 font for basmala / ornamental mushaf glyphs (not per-page). */
export const QCF_BSML_FONT_FAMILY = "QCF2_BSML";

export function qcfBsmlFontRemoteUrl(): string {
  return `${QCF_V2_FONT_CDN}/QCF2BSML.ttf`;
}
