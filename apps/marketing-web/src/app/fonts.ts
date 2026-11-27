import {
  Amiri_Quran,
  IBM_Plex_Sans_Arabic,
  Inter,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Plus_Jakarta_Sans,
} from "next/font/google";
import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Qur'an script for Arabic ayah text (landing-page practice preview). Not preloaded. */
const amiriQuran = Amiri_Quran({
  variable: "--font-amiri-quran",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  preload: false,
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

/*
 * Arabic-script faces, chained after Inter/Jakarta per `<html lang>` in
 * `globals.css` (Latin keeps its font). None is preloaded and each is
 * unicode-range-scoped, so English pages never download them.
 *
 * - Arabic: IBM Plex Sans Arabic — a contemporary humanist sans that matches
 *   Inter's tone and x-height, for body and headings.
 * - Urdu: Noto Nastaliq Urdu for headings (the script Urdu readers expect),
 *   Noto Naskh Arabic for body text (legible at small sizes; the app's face).
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

/** Font CSS variables for `<html className>`. */
export const FONT_VARIABLES = [inter, jakarta, amiriQuran, plexArabic, nastaliq, naskh]
  .map((font) => font.variable)
  .join(" ");

type NextFont = { style: { fontFamily: string } };

/** `["'Inter'", "'Inter Fallback'"]` — the webfont and its metric-matched local fallback. */
function families(font: NextFont): string[] {
  return font.style.fontFamily.split(",").map((name) => name.trim());
}

/**
 * Latin webfont, then the script's webfont, then their local fallbacks.
 * Order matters: next/font's "… Fallback" faces are local Arial, which has
 * Arabic glyphs on Windows — listed before the Arabic webfont, they would
 * render every Arabic letter in Arial.
 */
function stack(latin: NextFont, ...script: NextFont[]): string {
  const [latinFace, ...latinFallback] = families(latin);
  const scriptFaces = script.map((font) => families(font)[0]);
  return [latinFace, ...scriptFaces, ...latinFallback, "system-ui", "sans-serif"].join(", ");
}

/**
 * Per-locale font stacks, set as inline CSS variables on `<html>` (Tailwind's
 * `font-sans` / `font-display` and the base styles read them). English uses
 * the theme defaults.
 */
export const LOCALE_FONT_STYLE: Record<Locale, CSSProperties | undefined> = {
  en: undefined,
  ar: {
    "--font-sans": stack(inter, plexArabic),
    "--font-display": stack(jakarta, plexArabic),
  } as CSSProperties,
  ur: {
    "--font-sans": stack(inter, naskh),
    "--font-display": stack(jakarta, nastaliq, naskh),
  } as CSSProperties,
};
