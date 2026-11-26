/**
 * Surah-name calligraphy font — one Thuluth glyph per surah
 * (`assets/fonts/surah-name-v4.ttf`; see assets/fonts/README.md).
 * Kept in its own module and imported dynamically from `surah-name-font.ts` so the
 * TTF never enters the root bundle graph.
 */
// biome-ignore lint/suspicious/noExplicitAny: Metro asset require
export const SURAH_NAME_FONT_FILE = require("../../assets/fonts/surah-name-v4.ttf") as any;
