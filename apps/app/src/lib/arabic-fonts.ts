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
