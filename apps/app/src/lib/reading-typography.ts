import type { FontPreferences, ReadingSurface } from "@munib-tracker/shared/types";
import type { TextStyle } from "react-native";

import { Fonts } from "@/constants/theme";

/**
 * Central reading-typography resolver (NF-1.31 + NF-1.32). One place maps the
 * user's font preferences → the concrete `{ fontFamily, arabic, transliteration,
 * translation }` values every reading surface consumes, so the Qur'an reader,
 * ReadingCard, hadith list, and 99 names all size text identically instead of
 * hardcoding it per screen.
 */

/** A selectable Arabic typeface. `fontFamily` is applied to `type="arabic"` text. */
export interface ArabicFontOption {
  id: string;
  labelKey: string;
  /**
   * Resolved React Native `fontFamily`. `undefined` uses the theme's serif
   * default. Named families are registered at startup via `expo-font` (see
   * `src/lib/arabic-fonts.ts`).
   */
  fontFamily?: string;
  /**
   * Base line-height multiplier at reading sizes (~24–36 pt). Taller Qur'anic
   * faces (Scheherazade) need more vertical room so harakat do not collide.
   */
  lineHeightRatio: number;
}

export const DEFAULT_ARABIC_FONT_ID = "system";

/**
 * Bundled Arabic-capable typefaces. `system` always renders; the rest are bundled
 * OFL `.ttf` files loaded at startup (see `src/lib/arabic-fonts.ts`).
 */
export const ARABIC_FONT_OPTIONS: ArabicFontOption[] = [
  {
    id: "system",
    labelKey: "fonts.arabicFamily.system",
    fontFamily: Fonts.serif,
    lineHeightRatio: 2,
  },
  { id: "amiri", labelKey: "fonts.arabicFamily.amiri", fontFamily: "Amiri", lineHeightRatio: 2.05 },
  {
    id: "scheherazade",
    labelKey: "fonts.arabicFamily.scheherazade",
    fontFamily: "ScheherazadeNew",
    lineHeightRatio: 2.2,
  },
  {
    id: "notoNaskh",
    labelKey: "fonts.arabicFamily.notoNaskh",
    fontFamily: "NotoNaskhArabic",
    lineHeightRatio: 2,
  },
  {
    id: "qpc-hafs",
    labelKey: "fonts.arabicFamily.qpcHafs",
    fontFamily: "QPC_Hafs",
    lineHeightRatio: 2.15,
  },
];

/** Resolves the stored Arabic family id to a concrete `fontFamily` (falls back to serif). */
export function resolveArabicFontFamily(familyId: string | undefined): string | undefined {
  const option = ARABIC_FONT_OPTIONS.find((o) => o.id === familyId) ?? ARABIC_FONT_OPTIONS[0];
  return option.fontFamily;
}

function resolveArabicFontOption(familyId: string | undefined): ArabicFontOption {
  return ARABIC_FONT_OPTIONS.find((o) => o.id === familyId) ?? ARABIC_FONT_OPTIONS[0];
}

/**
 * Line-height for Arabic script at `fontSize`, tuned per typeface so harakat and
 * waqf marks stay legible. Smaller sizes get a slight ratio boost because
 * diacritics occupy a larger share of the line box.
 */
export function resolveArabicLineHeight(fontSize: number, familyId?: string): number {
  const option = resolveArabicFontOption(familyId);
  let ratio = option.lineHeightRatio;
  if (fontSize <= 14) ratio += 0.15;
  else if (fontSize <= 20) ratio += 0.08;
  return Math.round(fontSize * ratio);
}

/** RTL layout + optional size. Pair with `ThemedText type="arabic"` — line height is applied automatically. */
export function arabicReadingLayout(
  fontSize?: number,
  textAlign: TextStyle["textAlign"] = "right",
): TextStyle {
  return {
    ...(fontSize != null ? { fontSize } : null),
    writingDirection: "rtl",
    textAlign,
  };
}

/** Global default sizes when the user hasn't picked one in Settings → Fonts. */
export const DEFAULT_ARABIC_SIZE = 28;
export const DEFAULT_TRANSLATION_SIZE = 16;

/** Layout-safe bounds so an in-context adjustment can't break the page. */
export const ARABIC_SIZE_BOUNDS = { min: 14, max: 48 } as const;
export const TEXT_SIZE_BOUNDS = { min: 12, max: 28 } as const;
/** One A−/A+ tap changes the size by this many points. */
export const READING_SIZE_STEP = 2;

/** Smaller Arabic line for compact list rows (bookmarks, hifz, search hits). */
export const compactArabicTextStyle: TextStyle = {
  fontSize: 13,
  writingDirection: "rtl",
  textAlign: "right",
};

export interface ReadingFontSizes {
  arabic: number;
  transliteration: number;
  translation: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Resolves the three reading sizes for a surface: the global Settings sizes plus
 * the surface's in-context A−/A+ delta, clamped to layout-safe bounds.
 * Transliteration tracks the translation size (one point smaller).
 */
export function resolveReadingFontSizes(
  surface: ReadingSurface,
  fontPrefs: FontPreferences,
): ReadingFontSizes {
  const override = fontPrefs.readingOverrides?.[surface];
  const baseArabic = fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
  const baseText = fontPrefs.translation.size ?? DEFAULT_TRANSLATION_SIZE;

  const arabic = clamp(
    baseArabic + (override?.arabicDelta ?? 0),
    ARABIC_SIZE_BOUNDS.min,
    ARABIC_SIZE_BOUNDS.max,
  );
  const translation = clamp(
    baseText + (override?.textDelta ?? 0),
    TEXT_SIZE_BOUNDS.min,
    TEXT_SIZE_BOUNDS.max,
  );
  const transliteration = clamp(translation - 1, TEXT_SIZE_BOUNDS.min, TEXT_SIZE_BOUNDS.max);

  return { arabic, transliteration, translation };
}

/**
 * Returns the next Arabic + text deltas after an A−/A+ step, each independently
 * clamped so neither size can escape its bounds (given the global base sizes).
 */
export function nextReadingDelta(
  fontPrefs: FontPreferences,
  surface: ReadingSurface,
  direction: 1 | -1,
): ReadingSizeOverrideResult {
  const override = fontPrefs.readingOverrides?.[surface];
  const baseArabic = fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
  const baseText = fontPrefs.translation.size ?? DEFAULT_TRANSLATION_SIZE;

  const step = READING_SIZE_STEP * direction;
  const arabicDelta =
    clamp(
      baseArabic + (override?.arabicDelta ?? 0) + step,
      ARABIC_SIZE_BOUNDS.min,
      ARABIC_SIZE_BOUNDS.max,
    ) - baseArabic;
  const textDelta =
    clamp(
      baseText + (override?.textDelta ?? 0) + step,
      TEXT_SIZE_BOUNDS.min,
      TEXT_SIZE_BOUNDS.max,
    ) - baseText;

  return { arabicDelta, textDelta };
}

interface ReadingSizeOverrideResult {
  arabicDelta: number;
  textDelta: number;
}
