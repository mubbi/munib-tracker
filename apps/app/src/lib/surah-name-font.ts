import * as Font from "expo-font";
import { useEffect, useState } from "react";

/**
 * Calligraphic surah names — the surah-name font: each surah is ONE
 * Thuluth calligraphy glyph (bundled, offline). Loaded on demand the first time a
 * surah list shows; until then (or if loading fails) callers show the plain
 * Arabic name in the reading font, so nothing blocks on it.
 *
 * The glyphs live at fixed Private Use Area code points (verified against the
 * font's GSUB: ligature `surahNNN` → U+E000 + N, `surah-icon` → U+E000), so we
 * render the code point directly instead of relying on `liga` support.
 */
export const SURAH_NAME_FONT_FAMILY = "SurahNameV4";

/** The word "سورة" as a calligraphy glyph (pairs with a surah glyph in headers). */
export const SURAH_WORD_GLYPH = String.fromCharCode(0xe000);

/** The calligraphy glyph for surah `n` (1–114); plain text only with this family. */
export function surahNameGlyph(n: number): string {
  return String.fromCharCode(0xe000 + n);
}

/** Glyph sizes: the calligraphy sits inside the em box (−0.12…0.83 em, up to ~1.8 em wide). */
export const SURAH_NAME_SIZE = 50;
export const SURAH_NAME_SIZE_TV = 58;
export const SURAH_NAME_LINE_HEIGHT_RATIO = 1.05;

let loading: Promise<boolean> | null = null;

/** Loads the surah-name face once per app run; resolves `false` on failure (fallback font). */
export function loadSurahNameFont(): Promise<boolean> {
  if (Font.isLoaded(SURAH_NAME_FONT_FAMILY)) return Promise.resolve(true);
  loading ??= import("./surah-name-font-file")
    .then(({ SURAH_NAME_FONT_FILE }) =>
      Font.loadAsync({ [SURAH_NAME_FONT_FAMILY]: SURAH_NAME_FONT_FILE }),
    )
    .then(
      () => true,
      () => {
        // Allow a later retry (e.g. a transient asset error); callers keep the fallback.
        loading = null;
        return false;
      },
    );
  return loading;
}

/** Tests only: forget the in-flight / finished load so each case starts fresh. */
export function resetSurahNameFontForTests(): void {
  loading = null;
}

/** The calligraphic family once loaded, else `undefined` (use the reading Arabic font). */
export function useSurahNameFont(): string | undefined {
  const [ready, setReady] = useState(() => Font.isLoaded(SURAH_NAME_FONT_FAMILY));
  useEffect(() => {
    if (ready) return;
    let alive = true;
    void loadSurahNameFont().then((ok) => {
      if (alive && ok) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [ready]);
  return ready ? SURAH_NAME_FONT_FAMILY : undefined;
}
