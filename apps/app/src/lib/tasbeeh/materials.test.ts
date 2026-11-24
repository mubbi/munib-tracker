import { contrastRatio } from "@munib-tracker/theme/color";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import { DEFAULT_MISBAHA } from "./designs";
import {
  applyPreset,
  beadEdgeColor,
  beadGradient,
  COLOR_NAMES,
  getPreset,
  LCD_BACKLIGHTS,
  MATERIAL_IDS,
  MATERIALS,
  MIN_EDGE_CONTRAST,
  materialFor,
  PRESETS,
  SPACER_METALS,
  shade,
  spacerMaterialFor,
  TASSEL_COLORS,
  THREAD_COLORS,
} from "./materials";
import { isSoundPackId } from "./sound-packs";

const HEX = /^#[0-9A-F]{6}$/i;
const SURFACES = [
  resolveTheme("light", "light").card,
  resolveTheme("light", "light").background,
  resolveTheme("dark", "dark").card,
  resolveTheme("dark", "dark").background,
];

describe("materials", () => {
  it.each(MATERIAL_IDS.filter((id) => id !== "accent"))("%s has every stop", (id) => {
    const recipe = MATERIALS[id];
    expect(recipe.base).toMatch(HEX);
    expect(recipe.highlight).toMatch(HEX);
    expect(recipe.shadow).toMatch(HEX);
    expect(recipe.translucency).toBeGreaterThanOrEqual(0);
    expect(recipe.translucency).toBeLessThanOrEqual(1);
    expect(recipe.sheen).toBeGreaterThanOrEqual(0);
    expect(isSoundPackId(recipe.sound)).toBe(true);
  });

  it.each([...MATERIAL_IDS.filter((id) => id !== "accent"), "silver", "gold"])(
    "%s keeps a visible silhouette on every theme surface",
    (id) => {
      const recipe =
        id === "silver" || id === "gold"
          ? SPACER_METALS[id]
          : MATERIALS[id as keyof typeof MATERIALS];
      for (const surface of SURFACES) {
        expect(contrastRatio(beadEdgeColor(recipe, surface), surface)).toBeGreaterThanOrEqual(
          MIN_EDGE_CONTRAST,
        );
      }
    },
  );

  it("derives the accent bead from the theme accent", () => {
    const recipe = materialFor("accent", "#336699");
    expect(recipe.base).toBe("#336699");
    expect(recipe.highlight).not.toBe(recipe.base);
    expect(materialFor("nonsense", "#336699").base).toBe("#336699");
    expect(materialFor("jade", "#336699")).toBe(MATERIALS.jade);
  });

  it("shades toward white and black", () => {
    expect(shade("#808080", 1)).toBe("#FFFFFF");
    expect(shade("#808080", -1)).toBe("#000000");
    expect(shade("#808080", 0)).toBe("#808080");
  });

  it("builds a radial gradient, translucent for amber and glass", () => {
    expect(beadGradient(MATERIALS.onyx)).toMatch(/^radial-gradient\(/);
    expect(beadGradient(MATERIALS.glass)).not.toContain(`${MATERIALS.glass.base}FF`);
  });

  it("resolves spacer finishes", () => {
    expect(spacerMaterialFor("off", "oliveWood", "#000000")).toBeNull();
    expect(spacerMaterialFor("gold", "oliveWood", "#000000")).toBe(SPACER_METALS.gold);
    expect(spacerMaterialFor("same", "jade", "#000000")).toBe(MATERIALS.jade);
    expect(spacerMaterialFor("contrast", "oliveWood", "#000000")?.family).not.toBe("wood");
  });
});

describe("presets", () => {
  it("ships eight free presets with valid options", () => {
    expect(PRESETS).toHaveLength(8);
    for (const preset of PRESETS) {
      expect(MATERIAL_IDS).toContain(preset.material);
      if (preset.tassel.color) expect(TASSEL_COLORS).toContain(preset.tassel.color);
      if (preset.thread.color) expect(THREAD_COLORS).toContain(preset.thread.color);
    }
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(8);
  });

  it("names every curated colour", () => {
    for (const color of [...TASSEL_COLORS, ...THREAD_COLORS]) {
      expect(COLOR_NAMES[color]).toBeTruthy();
    }
  });

  it("applies a preset but keeps strand, layout and background", () => {
    const current = {
      ...DEFAULT_MISBAHA,
      strand: 99 as const,
      layout: "loop" as const,
      background: "velvet" as const,
    };
    const next = applyPreset(current, "onyxNight");
    expect(next).toMatchObject({ preset: "onyxNight", material: "onyx", shape: "faceted" });
    expect(next).toMatchObject({ strand: 99, layout: "loop", background: "velvet" });
    expect(getPreset("missing").id).toBe(PRESETS[0].id);
  });

  it("has three LCD backlights", () => {
    expect(Object.keys(LCD_BACKLIGHTS)).toEqual(["green", "amber", "mono"]);
  });
});
