// Per-slide design options — the "template" layer on top of a layout.
//
// Visual language is borrowed from the product app (docs/design-system.md:
// deep green, cream and gold, one accent per screen, calm) and the marketing
// site (apps/marketing-web/src/app/globals.css: Day Arc sunset → night sky,
// mosque skyline, girih strapwork, film grain, glass chips, emerald→gold
// gradient text). Composition ideas (docked/bleeding devices, alternating
// tilt, highlight boxes, magnifier lens, feature chips, fixed headline band)
// come from Parra-Inc/open-assets (MIT).
//
// Everything here is optional on a Slide: an old project renders exactly as
// before (background "aurora", gradient highlight, eyebrow label).

import type { LocalizedText } from "./types";

export type DeviceFinish =
  | "silver"
  | "titanium"
  | "space-black"
  | "deep-blue"
  | "cosmic-orange"
  | "gold"
  | "sage";

export type BackgroundStyle =
  | "aurora" // theme gradient + soft blobs + vignette (original look)
  | "night" // marketing night sky: stars, crescent glow, mosque skyline
  | "dusk" // marketing Day Arc sunset: warm bloom behind the device, skyline
  | "girih" // gold girih strapwork, faded behind the copy
  | "mesh" // blurred multi-colour orbs (open-assets glow orbs)
  | "grid" // hairline grid, radially masked
  | "parchment" // app light mode: cream paper, faint khatam tiles (dark text)
  | "solid"; // flat theme colour

export type HighlightStyle =
  | "gradient" // emerald gradient text (marketing .text-gradient)
  | "gold" // brand gold (Brand.heroAccent)
  | "box" // filled accent box behind the word (open-assets "Only Recipes")
  | "marker"; // gold highlighter stroke under the word

export type LabelStyle = "eyebrow" | "pill";

/** Magnifier lens: zooms into the slide's own screenshot (no extra asset, follows locale). */
export type LensSpec = {
  /** Focus point in the screenshot, 0–1. */
  x: number;
  y: number;
  /** Magnification relative to the device screen, 1.5–4. */
  zoom: number;
};

export type SlideDesign = {
  background?: BackgroundStyle;
  highlight?: HighlightStyle;
  labelStyle?: LabelStyle;
  finish?: DeviceFinish;
  /** Brand-tinted glow behind the device. */
  glow?: boolean;
  /** Flip the composition (tilt direction, lens side) — alternate across a deck for rhythm. */
  mirror?: boolean;
  /** Film grain over the background (marketing .noise). */
  grain?: boolean;
  lens?: LensSpec;
  /** Feature chips, one per line, per locale (rendered as glass pills). */
  features?: LocalizedText;
};

export const BACKGROUND_LABEL: Record<BackgroundStyle, string> = {
  aurora: "Aurora",
  night: "Night sky",
  dusk: "Dusk (Day Arc)",
  girih: "Girih pattern",
  mesh: "Mesh glow",
  grid: "Hairline grid",
  parchment: "Parchment (light)",
  solid: "Solid",
};

export const HIGHLIGHT_LABEL: Record<HighlightStyle, string> = {
  gradient: "Emerald gradient",
  gold: "Gold",
  box: "Accent box",
  marker: "Gold marker",
};

/** Backgrounds whose base is light — the copy switches to dark ink. */
export function isLightBackground(style: BackgroundStyle | undefined): boolean {
  return style === "parchment";
}

export const DEFAULT_LENS: LensSpec = { x: 0.5, y: 0.3, zoom: 2.4 };
