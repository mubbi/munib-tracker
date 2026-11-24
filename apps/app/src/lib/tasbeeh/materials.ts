/**
 * Procedural bead materials for the sliding-bead misbaha (NF-3.19).
 *
 * Bead colours are **material data**, exempt from the "no hardcoded colours"
 * rule (plan §NF-3.19): they describe olive wood, amber or turquoise, not UI
 * chrome. Everything a bead sits on (stage, thread fallback, outlines) comes
 * from theme tokens. Spheres are shaded with `gradientBackground()` radial
 * gradients — no image assets, works on native and web.
 */

import type {
  TasbeehBeadShape,
  TasbeehClickerBacklight,
  TasbeehMisbahaAppearance,
  TasbeehSpacerStyle,
  TasbeehTasselStyle,
} from "@munib-tracker/shared/types";
import { contrastRatio } from "@munib-tracker/theme/color";

import type { TasbeehSoundPackId } from "./sound-packs";

export type MaterialFamily = "wood" | "amber" | "pearl" | "stone" | "glass" | "accent";

export interface MaterialRecipe {
  family: MaterialFamily;
  /** Mid-tone body colour. */
  base: string;
  /** Specular / lit side. */
  highlight: string;
  /** Core shadow / unlit side. */
  shadow: string;
  /** 0 = opaque, 1 = clear (amber, glass). */
  translucency: number;
  /** 0–1 nacre sheen (pearl). */
  sheen: number;
  /** Wood grain hint (drawn as a soft band, no image). */
  grain?: boolean;
  /** Sound pack that suits the material when the sound pack is "auto". */
  sound: TasbeehSoundPackId;
}

export const MATERIAL_IDS = [
  "oliveWood",
  "kukaWood",
  "sandalwood",
  "ebony",
  "amberHoney",
  "amberCherry",
  "pearl",
  "motherOfPearl",
  "turquoise",
  "onyx",
  "lapis",
  "jade",
  "agate",
  "glass",
  "accent",
] as const;

export type MaterialId = (typeof MATERIAL_IDS)[number];

/** `accent` is a placeholder — {@link materialFor} derives it from the theme accent. */
export const MATERIALS: Record<MaterialId, MaterialRecipe> = {
  oliveWood: {
    family: "wood",
    base: "#9A7B4F",
    highlight: "#C8A97A",
    shadow: "#5E4426",
    translucency: 0,
    sheen: 0,
    grain: true,
    sound: "woodSoft",
  },
  kukaWood: {
    family: "wood",
    base: "#4A2F22",
    highlight: "#7A5642",
    shadow: "#22140D",
    translucency: 0,
    sheen: 0.1,
    grain: true,
    sound: "woodHard",
  },
  sandalwood: {
    family: "wood",
    base: "#B98A5C",
    highlight: "#E2BF94",
    shadow: "#7A5531",
    translucency: 0,
    sheen: 0,
    grain: true,
    sound: "woodSoft",
  },
  ebony: {
    family: "wood",
    base: "#2B2522",
    highlight: "#5A504A",
    shadow: "#0E0B0A",
    translucency: 0,
    sheen: 0.15,
    grain: true,
    sound: "woodHard",
  },
  amberHoney: {
    family: "amber",
    base: "#E09A2D",
    highlight: "#FFD77A",
    shadow: "#9A5A0E",
    translucency: 0.35,
    sheen: 0.2,
    sound: "resin",
  },
  amberCherry: {
    family: "amber",
    base: "#B0391C",
    highlight: "#F07A4A",
    shadow: "#5E160A",
    translucency: 0.3,
    sheen: 0.2,
    sound: "resin",
  },
  pearl: {
    family: "pearl",
    base: "#E9E3D8",
    highlight: "#FFFFFF",
    shadow: "#A79E90",
    translucency: 0,
    sheen: 0.8,
    sound: "pearl",
  },
  motherOfPearl: {
    family: "pearl",
    base: "#D9DCE6",
    highlight: "#FFF6FB",
    shadow: "#8E93A6",
    translucency: 0,
    sheen: 1,
    sound: "pearl",
  },
  turquoise: {
    family: "stone",
    base: "#2FA7A0",
    highlight: "#8FE3D9",
    shadow: "#11605B",
    translucency: 0,
    sheen: 0.1,
    sound: "stone",
  },
  onyx: {
    family: "stone",
    base: "#1F2226",
    highlight: "#5B636D",
    shadow: "#050607",
    translucency: 0,
    sheen: 0.35,
    sound: "stone",
  },
  lapis: {
    family: "stone",
    base: "#25408F",
    highlight: "#6C88D8",
    shadow: "#101F4F",
    translucency: 0,
    sheen: 0.15,
    sound: "stone",
  },
  jade: {
    family: "stone",
    base: "#3E8E5E",
    highlight: "#93D3A8",
    shadow: "#1B4D30",
    translucency: 0.15,
    sheen: 0.2,
    sound: "stone",
  },
  agate: {
    family: "stone",
    base: "#A65A3A",
    highlight: "#E3A182",
    shadow: "#5C2A16",
    translucency: 0.1,
    sheen: 0.2,
    sound: "stone",
  },
  glass: {
    family: "glass",
    base: "#8DB8C9",
    highlight: "#F2FBFF",
    shadow: "#3F6C7D",
    translucency: 0.55,
    sheen: 0.4,
    sound: "glass",
  },
  accent: {
    family: "accent",
    base: "#808080",
    highlight: "#A0A0A0",
    shadow: "#606060",
    translucency: 0,
    sheen: 0,
    sound: "woodSoft",
  },
};

/** Metal spacer finishes. */
export const SPACER_METALS: Record<"silver" | "gold", MaterialRecipe> = {
  silver: {
    family: "stone",
    base: "#B9BEC4",
    highlight: "#F4F6F8",
    shadow: "#6C737B",
    translucency: 0,
    sheen: 0.6,
    sound: "stone",
  },
  gold: {
    family: "stone",
    base: "#C9A23A",
    highlight: "#F6DE8A",
    shadow: "#7D5F14",
    translucency: 0,
    sheen: 0.6,
    sound: "stone",
  },
};

/** "Contrasting material" spacer for each material family. */
const CONTRAST_SPACER: Record<MaterialFamily, MaterialId> = {
  wood: "onyx",
  amber: "ebony",
  pearl: "lapis",
  stone: "pearl",
  glass: "ebony",
  accent: "pearl",
};

/** Curated tassel colours (silk). */
export const TASSEL_COLORS = [
  "#7A1E2C",
  "#1F3A6B",
  "#1E5A3A",
  "#B8912F",
  "#2A2A2A",
  "#EDE6D6",
] as const;

/** i18n names (`tasbeehDesigns.colors.*`) for the curated tassel / thread colours. */
export const COLOR_NAMES: Record<string, string> = {
  "#7A1E2C": "burgundy",
  "#1F3A6B": "navy",
  "#1E5A3A": "green",
  "#B8912F": "gold",
  "#2A2A2A": "charcoal",
  "#EDE6D6": "ivory",
  "#3B2A20": "brown",
  "#D9D2C3": "linen",
};

/** Curated thread colours. */
export const THREAD_COLORS = ["#3B2A20", "#7A1E2C", "#1F3A6B", "#B8912F", "#D9D2C3"] as const;

export const BEAD_SHAPES: readonly TasbeehBeadShape[] = [
  "round",
  "olive",
  "faceted",
  "cylinder",
  "rondelle",
];

export const SPACER_STYLES: readonly TasbeehSpacerStyle[] = [
  "same",
  "silver",
  "gold",
  "contrast",
  "off",
];

export const TASSEL_STYLES: readonly TasbeehTasselStyle[] = ["silk", "chain", "none"];

export interface MisbahaPreset {
  id: string;
  shape: TasbeehBeadShape;
  material: MaterialId;
  spacer: TasbeehSpacerStyle;
  tassel: { style: TasbeehTasselStyle; color?: string };
  thread: { color?: string; hidden?: boolean };
}

/** The eight v1 presets — every one free (D16). */
export const PRESETS: readonly MisbahaPreset[] = [
  {
    id: "amberClassic",
    shape: "round",
    material: "amberHoney",
    spacer: "gold",
    tassel: { style: "silk", color: TASSEL_COLORS[0] },
    thread: { color: THREAD_COLORS[1] },
  },
  {
    id: "kukaWood",
    shape: "cylinder",
    material: "kukaWood",
    spacer: "silver",
    tassel: { style: "silk", color: TASSEL_COLORS[4] },
    thread: { color: THREAD_COLORS[0] },
  },
  {
    id: "oliveWood",
    shape: "olive",
    material: "oliveWood",
    spacer: "same",
    tassel: { style: "silk", color: TASSEL_COLORS[2] },
    thread: { color: THREAD_COLORS[0] },
  },
  {
    id: "sandalwood",
    shape: "round",
    material: "sandalwood",
    spacer: "contrast",
    tassel: { style: "silk", color: TASSEL_COLORS[3] },
    thread: { color: THREAD_COLORS[3] },
  },
  {
    id: "pearl",
    shape: "round",
    material: "pearl",
    spacer: "silver",
    tassel: { style: "chain" },
    thread: { color: THREAD_COLORS[4] },
  },
  {
    id: "turquoise",
    shape: "rondelle",
    material: "turquoise",
    spacer: "silver",
    tassel: { style: "silk", color: TASSEL_COLORS[1] },
    thread: { color: THREAD_COLORS[2] },
  },
  {
    id: "onyxNight",
    shape: "faceted",
    material: "onyx",
    spacer: "silver",
    tassel: { style: "chain" },
    thread: { hidden: true },
  },
  {
    id: "themeAccent",
    shape: "round",
    material: "accent",
    spacer: "same",
    tassel: { style: "none" },
    thread: {},
  },
];

export const DEFAULT_PRESET_ID = "amberClassic";

export function getPreset(id: string): MisbahaPreset {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}

export function isMaterialId(id: string): id is MaterialId {
  return (MATERIAL_IDS as readonly string[]).includes(id);
}

/** Mixes `hex` toward white (amount > 0) or black (amount < 0). */
export function shade(hex: string, amount: number): string {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value.length === 3 ? value.replace(/(.)/g, "$1$1") : value, 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const target = amount >= 0 ? 255 : 0;
  const t = Math.min(1, Math.abs(amount));
  const mixed = channels.map((c) => Math.round(c + (target - c) * t));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Recipe for a material id; `accent` (and unknown ids) follow the theme accent as a matte bead. */
export function materialFor(id: string, accent: string): MaterialRecipe {
  if (id !== "accent" && isMaterialId(id)) return MATERIALS[id];
  return {
    ...MATERIALS.accent,
    base: accent,
    highlight: shade(accent, 0.35),
    shadow: shade(accent, -0.45),
  };
}

/** Recipe for a spacer bead, or `null` when spacers are off. */
export function spacerMaterialFor(
  style: TasbeehSpacerStyle,
  beadMaterial: string,
  accent: string,
): MaterialRecipe | null {
  if (style === "off") return null;
  if (style === "silver" || style === "gold") return SPACER_METALS[style];
  const bead = materialFor(beadMaterial, accent);
  if (style === "contrast") return MATERIALS[CONTRAST_SPACER[bead.family]];
  return bead;
}

function withHexAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`.toUpperCase();
}

/**
 * Radial-gradient shading for a bead: lit from the upper start, shadow on the
 * far side; translucent materials let the stage show through the body.
 */
export function beadGradient(recipe: MaterialRecipe): string {
  const body = 1 - recipe.translucency * 0.6;
  const stops = [
    `${withHexAlpha(recipe.highlight, Math.min(1, body + 0.2))} 0%`,
    `${withHexAlpha(recipe.base, body)} ${recipe.sheen > 0.5 ? 38 : 45}%`,
    `${withHexAlpha(recipe.shadow, Math.min(1, body + 0.15))} 100%`,
  ];
  return `radial-gradient(circle at 34% 30%, ${stops.join(", ")})`;
}

/** Flat fallback ("simple beads") for low-end devices or reduced transparency. */
export function beadFlatColor(recipe: MaterialRecipe): string {
  return recipe.base;
}

/**
 * Outline that keeps a bead's silhouette visible on a given theme surface: the
 * recipe's own shadow or highlight, whichever stands out more.
 */
export function beadEdgeColor(recipe: MaterialRecipe, surface: string): string {
  return contrastRatio(recipe.shadow, surface) >= contrastRatio(recipe.highlight, surface)
    ? recipe.shadow
    : recipe.highlight;
}

/** Minimum silhouette contrast a bead edge must reach against a theme surface. */
export const MIN_EDGE_CONTRAST = 1.5;

/** Seven-segment LCD backlights for the Clicker design (device data, not UI chrome). */
export const LCD_BACKLIGHTS: Record<
  TasbeehClickerBacklight,
  { panel: string; segmentOn: string; segmentOff: string }
> = {
  green: { panel: "#9DB58A", segmentOn: "#1E2A16", segmentOff: "#8CA479" },
  amber: { panel: "#E2B25A", segmentOn: "#3A2406", segmentOff: "#D1A24C" },
  mono: { panel: "#C9CCC4", segmentOn: "#1A1C18", segmentOff: "#B7BAB2" },
};

/** Focus / Night design: true black for OLED, dimmed numerals (device data). */
export const NIGHT_PALETTE = {
  background: "#000000",
  numeral: "#8A8F98",
  numeralComplete: "#6FA889",
  caption: "#4C5058",
} as const;

/** Applies a preset over the current misbaha options, keeping strand / layout / background. */
export function applyPreset(
  current: TasbeehMisbahaAppearance,
  presetId: string,
): TasbeehMisbahaAppearance {
  const preset = getPreset(presetId);
  return {
    ...current,
    preset: preset.id,
    shape: preset.shape,
    material: preset.material,
    spacer: preset.spacer,
    tassel: { ...preset.tassel },
    thread: { ...preset.thread },
  };
}
