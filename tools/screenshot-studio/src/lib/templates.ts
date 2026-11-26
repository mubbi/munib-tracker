// Template gallery + deck recipes. A template is a layout + SlideDesign preset
// applied to the current slide (copy and screenshots are kept); a recipe
// restyles a whole deck with a coordinated rhythm (backgrounds and highlight
// alternate, tilt/lens direction mirrors on every other slide).

import { DEFAULT_LENS, type SlideDesign } from "./design";
import type { Slide, SlideLayout } from "./types";

export type SlideTemplate = {
  id: string;
  name: string;
  hint: string;
  layout: SlideLayout;
  design: SlideDesign;
  inverted?: boolean;
};

export const SLIDE_TEMPLATES: SlideTemplate[] = [
  {
    id: "dusk-hero",
    name: "Day Arc hero",
    hint: "Sunset sky, mosque horizon, gold emphasis — the marketing hero",
    layout: "hero",
    design: { background: "dusk", highlight: "gold", labelStyle: "pill" },
  },
  {
    id: "night-docked",
    name: "Night · docked",
    hint: "Starry night sky, device docked to the bottom edge",
    layout: "bleed-bottom",
    design: { background: "night", highlight: "gradient", glow: true },
  },
  {
    id: "forest-box",
    name: "Forest · box",
    hint: "Brand green, docked device, accent box behind the key word",
    layout: "bleed-bottom",
    design: { background: "aurora", highlight: "box", labelStyle: "pill" },
  },
  {
    id: "tilted-mesh",
    name: "Tilted · glow",
    hint: "Bold 7° tilt bleeding off the corner, mesh glow",
    layout: "tilted",
    design: { background: "mesh", highlight: "gradient", glow: true },
  },
  {
    id: "tilted-girih",
    name: "Tilted · girih",
    hint: "Mirrored tilt over gold girih strapwork",
    layout: "tilted",
    design: { background: "girih", highlight: "gold", mirror: true },
  },
  {
    id: "magnifier",
    name: "Magnifier",
    hint: "Lens zooms into a detail of the same screenshot",
    layout: "bleed-bottom",
    design: { background: "night", highlight: "gold", lens: DEFAULT_LENS, glow: true },
  },
  {
    id: "parchment-docked",
    name: "Parchment",
    hint: "The app's light mode: cream paper, dark ink, gold marker",
    layout: "bleed-bottom",
    design: {
      background: "parchment",
      highlight: "marker",
      labelStyle: "pill",
      finish: "space-black",
    },
  },
  {
    id: "parchment-top",
    name: "Parchment · flipped",
    hint: "Device on top, headline below, accent box",
    layout: "device-top",
    design: { background: "parchment", highlight: "box", finish: "space-black" },
  },
  {
    id: "pair-grid",
    name: "Pair · grid",
    hint: "Two overlapping devices over a hairline grid",
    layout: "two-devices",
    design: { background: "grid", highlight: "gradient", glow: true },
  },
  {
    id: "features",
    name: "Feature list",
    hint: "Headline, glass feature chips, docked device",
    layout: "feature-list",
    design: { background: "night", highlight: "gold" },
  },
  {
    id: "statement",
    name: "Statement",
    hint: "No device — big headline over girih",
    layout: "no-device",
    design: { background: "girih", highlight: "gold", labelStyle: "pill" },
  },
  {
    id: "classic",
    name: "Classic",
    hint: "The original studio look (aurora, emerald gradient)",
    layout: "device-bottom",
    design: {},
  },
];

const DEFAULT_FEATURES = { en: "Works offline\nPrivate by design\nNo ads\n24 languages" };

/** Patch that applies `t` to `slide`, keeping its copy, screenshots and lens/feature content. */
export function applyTemplate(slide: Slide, t: SlideTemplate): Partial<Slide> {
  const prev = slide.design ?? {};
  const wantsFeatures = t.layout === "feature-list" || t.layout === "no-device";
  return {
    layout: t.layout,
    inverted: t.inverted ?? false,
    transforms: undefined,
    screenshotSecondary:
      t.layout === "two-devices"
        ? slide.screenshotSecondary || slide.screenshot
        : slide.screenshotSecondary,
    design: {
      ...t.design,
      lens: t.design.lens ? (prev.lens ?? t.design.lens) : undefined,
      features: wantsFeatures
        ? (prev.features ?? (t.layout === "feature-list" ? DEFAULT_FEATURES : undefined))
        : prev.features,
    },
  };
}

export type DeckRecipe = {
  id: string;
  name: string;
  hint: string;
  /** Cycled across the deck by slide index. */
  steps: SlideDesign[];
  /** Base applied to every slide. */
  base?: SlideDesign;
};

export const DECK_RECIPES: DeckRecipe[] = [
  {
    id: "day-arc",
    name: "Day Arc",
    hint: "Marketing site: dusk → night → girih, gold + emerald emphasis",
    base: { labelStyle: "pill", finish: "silver" },
    steps: [
      { background: "dusk", highlight: "gold" },
      { background: "night", highlight: "gradient", glow: true },
      { background: "girih", highlight: "gold" },
      { background: "night", highlight: "box", glow: true },
      { background: "mesh", highlight: "gradient" },
    ],
  },
  {
    id: "forest",
    name: "Forest",
    hint: "App brand hero: deep green, emerald gradient, soft glow",
    base: { labelStyle: "eyebrow", finish: "silver" },
    steps: [
      { background: "aurora", highlight: "gradient" },
      { background: "mesh", highlight: "gradient", glow: true },
      { background: "girih", highlight: "gold" },
      { background: "grid", highlight: "box", glow: true },
    ],
  },
  {
    id: "parchment",
    name: "Parchment",
    hint: "App light mode: cream paper, dark ink, black devices",
    base: { background: "parchment", labelStyle: "pill", finish: "space-black" },
    steps: [{ highlight: "box" }, { highlight: "marker" }],
  },
  {
    id: "classic",
    name: "Classic",
    hint: "Reset every slide to the original look",
    steps: [{}],
  },
];

export function applyRecipe(slides: Slide[], recipe: DeckRecipe): Slide[] {
  return slides.map((slide, i) => {
    const keep: Partial<SlideDesign> = {
      lens: slide.design?.lens,
      features: slide.design?.features,
    };
    if (recipe.id === "classic") return { ...slide, design: keep };
    const step = recipe.steps[i % recipe.steps.length];
    return {
      ...slide,
      design: { ...keep, ...recipe.base, ...step, mirror: i % 2 === 1 },
    };
  });
}
