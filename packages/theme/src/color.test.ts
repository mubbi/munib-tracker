import { describe, expect, it } from "vitest";
import { accentColorIds } from "./accents";
import {
  accentOnSurface,
  bestForeground,
  compositeOver,
  contrastMatrix,
  contrastRatio,
  ensureContrastAgainst,
  ensureReadableAccent,
  hexToHsl,
  hexToRgb,
  hslToHex,
  isValidHex,
  normalizeHex,
  relativeLuminance,
  rgbToHex,
} from "./color";
import { resolveTheme } from "./resolve-theme";

const AA = 4.5;
/** Non-text (graphical) contrast per WCAG 1.4.11. */
const UI = 3;
/** Munib page backgrounds. */
const LIGHT_BG = "#F5F0E6";
const DARK_BG = "#152921";

describe.concurrent("accent contrast (WCAG AA)", () => {
  for (const id of accentColorIds) {
    for (const mode of ["light", "dark"] as const) {
      it(`${id}/${mode}: accentForeground reads on the accent fill`, () => {
        const c = resolveTheme(mode, null, id);
        expect(contrastRatio(c.accentForeground, c.accent)).toBeGreaterThanOrEqual(AA);
      });

      it(`${id}/${mode}: accentText reads on background and card`, () => {
        const c = resolveTheme(mode, null, id);
        expect(contrastRatio(c.accentText, c.background)).toBeGreaterThanOrEqual(AA);
        expect(contrastRatio(c.accentText, c.card)).toBeGreaterThanOrEqual(AA);
      });
    }
  }
});

describe.concurrent("accentOnSurface", () => {
  it("returns the colour unchanged when it already passes", () => {
    expect(accentOnSurface("#152921", "#FFFFFF")).toBe("#152921");
  });

  it("darkens a low-contrast colour on a light surface until it passes", () => {
    const out = accentOnSurface("#D9A343", "#FFFCF7"); // warning on light card
    expect(contrastRatio(out, "#FFFCF7")).toBeGreaterThanOrEqual(AA);
  });

  it("lightens a low-contrast colour on a dark surface until it passes", () => {
    const out = accentOnSurface("#2A453C", "#152921");
    expect(contrastRatio(out, "#152921")).toBeGreaterThanOrEqual(AA);
  });
});

describe.concurrent("ensureContrastAgainst", () => {
  it("returns a vibrant mid-tone accent unchanged (already visible)", () => {
    expect(ensureContrastAgainst("#1565C0", LIGHT_BG).toLowerCase()).toBe("#1565c0");
    expect(ensureContrastAgainst("#FBBF24", DARK_BG).toLowerCase()).toBe("#fbbf24");
  });

  it("darkens a near-white custom accent on the light background", () => {
    const out = ensureContrastAgainst("#FFFFFF", LIGHT_BG);
    expect(out.toLowerCase()).not.toBe("#ffffff");
    expect(contrastRatio(out, LIGHT_BG)).toBeGreaterThanOrEqual(UI);
  });

  it("lightens a near-black custom accent on the dark background", () => {
    const out = ensureContrastAgainst("#000000", DARK_BG);
    expect(out.toLowerCase()).not.toBe("#000000");
    expect(contrastRatio(out, DARK_BG)).toBeGreaterThanOrEqual(UI);
  });

  it("rescues a pale accent that would vanish on the light background", () => {
    const out = ensureContrastAgainst("#FFEAA7", LIGHT_BG);
    expect(contrastRatio(out, LIGHT_BG)).toBeGreaterThanOrEqual(UI);
  });

  it("returns the input untouched when the hex is invalid", () => {
    expect(ensureContrastAgainst("not-a-color", LIGHT_BG)).toBe("not-a-color");
  });
});

describe.concurrent("bestForeground", () => {
  it("picks dark ink on mid-tone gold (where a 0.5 threshold guesses wrong)", () => {
    expect(bestForeground("#B8956A")).toBe("#152921");
  });
  it("picks paper on a deep slate", () => {
    expect(bestForeground("#475569")).toBe("#FFFFFF");
  });
});

describe("hexToRgb", () => {
  it.each([
    [" #0f8 ", { r: 0, g: 255, b: 136 }],
    ["#AbCdEf", { r: 171, g: 205, b: 239 }],
    ["#12345", null],
    ["zzzzzz", null],
  ])("%j -> %j", (hex, expected) => {
    expect(hexToRgb(hex)).toEqual(expected);
  });
});

describe("isValidHex", () => {
  it.each([
    ["#abc", true],
    ["#ggg", false],
  ])("%j -> %s", (hex, expected) => {
    expect(isValidHex(hex)).toBe(expected);
  });
});

describe("normalizeHex", () => {
  it.each([
    ["#AbC", "#aabbcc"],
    ["nope", null],
  ])("%j -> %j", (hex, expected) => {
    expect(normalizeHex(hex)).toBe(expected);
  });
});

describe("rgbToHex", () => {
  it("clamps and rounds channels", () => {
    expect(rgbToHex(-10, 300, 127.6)).toBe("#00ff80");
  });
});

describe("relativeLuminance", () => {
  it.each([
    ["bogus", 0],
    ["#000000", 0],
    ["#ffffff", 1],
  ])("%j -> %f", (hex, expected) => {
    expect(relativeLuminance(hex)).toBeCloseTo(expected);
  });
});

describe("accentOnSurface fallbacks", () => {
  it.each([
    ["an already-passing colour", "#000000", "#ffffff", 4.5, "#000000"],
    ["an invalid colour (treated as black) on a dark surface", "bogus", "#000000", 4.5, "#FFFFFF"],
    ["an unreachable target on a light surface", "#777777", "#ffffff", 22, "#152921"],
    ["an unreachable target on a dark surface", "#777777", "#000000", 22, "#FFFFFF"],
  ])("handles %s", (_label, color, surface, target, expected) => {
    expect(accentOnSurface(color, surface, target)).toBe(expected);
  });
});

describe("ensureContrastAgainst fallbacks", () => {
  it.each([
    ["returns invalid input unchanged", "not-a-colour", LIGHT_BG, 3, "not-a-colour"],
    ["falls back to slate on light backgrounds", "#808080", "#ffffff", 22, "#475569"],
    ["falls back to light slate on dark backgrounds", "#808080", "#000000", 22, "#CBD5E1"],
  ])("%s", (_label, accent, background, minRatio, expected) => {
    expect(ensureContrastAgainst(accent, background, minRatio)).toBe(expected);
  });

  it("lightens dark accents on dark backgrounds until they pass", () => {
    const out = ensureContrastAgainst("#101010", DARK_BG);

    expect(out).not.toBe("#101010");
    expect(contrastRatio(out, DARK_BG)).toBeGreaterThanOrEqual(UI);
  });
});

describe("compositeOver", () => {
  it("blends 50% black over white to mid grey", () => {
    const rgb = hexToRgb(compositeOver("#000000", 0.5, "#FFFFFF"));
    expect(rgb?.r).toBeGreaterThanOrEqual(127);
    expect(rgb?.r).toBeLessThanOrEqual(129);
  });

  it("returns the background at alpha 0 and the foreground at alpha 1", () => {
    expect(compositeOver("#123456", 0, "#ABCDEF")).toBe("#abcdef");
    expect(compositeOver("#123456", 1, "#ABCDEF")).toBe("#123456");
  });

  it("falls back to the background for invalid input", () => {
    expect(compositeOver("nope", 0.5, "#FFFFFF")).toBe("#FFFFFF");
  });
});

describe("contrastMatrix", () => {
  it("returns only the pairs below their minimum", () => {
    const failures = contrastMatrix([
      { label: "black on white", foreground: "#000000", background: "#FFFFFF", min: 4.5 },
      { label: "grey on white", foreground: "#BBBBBB", background: "#FFFFFF", min: 4.5 },
    ]);
    expect(failures.map((f) => f.label)).toEqual(["grey on white"]);
    expect(failures[0]?.ratio).toBeLessThan(4.5);
  });
});

describe("hexToHsl / hslToHex", () => {
  it("round-trips primary and mixed colours", () => {
    for (const hex of ["#ff0000", "#00ff00", "#0000ff", "#0c390f", "#d4a017", "#808080"]) {
      const hsl = hexToHsl(hex);
      expect(hsl).not.toBeNull();
      if (hsl) expect(hslToHex(hsl.h, hsl.s, hsl.l)).toBe(hex);
    }
  });

  it("returns null for invalid hex", () => {
    expect(hexToHsl("nope")).toBeNull();
  });
});

describe("ensureReadableAccent", () => {
  const darkSurfaces = ["#152921", "#1E3830"];
  const lightSurfaces = ["#F5F0E6", "#FFFDF9"];

  it("returns a passing accent unchanged (normalised)", () => {
    expect(ensureReadableAccent("#3B82F6", darkSurfaces)).toBe("#3b82f6");
  });

  it("lightens a deep green on the dark page without greying it out", () => {
    const out = ensureReadableAccent("#0C390F", darkSurfaces);
    for (const s of darkSurfaces) expect(contrastRatio(out, s)).toBeGreaterThanOrEqual(3);
    const before = hexToHsl("#0C390F");
    const after = hexToHsl(out);
    expect(after?.h).toBeCloseTo(before?.h ?? 0, 0);
    expect(after?.s).toBeCloseTo(before?.s ?? 0, 1);
    expect(after?.l).toBeGreaterThan(before?.l ?? 1);
  });

  it("darkens a pale accent on the light page", () => {
    const out = ensureReadableAccent("#FDE68A", lightSurfaces);
    for (const s of lightSurfaces) expect(contrastRatio(out, s)).toBeGreaterThanOrEqual(3);
    expect(hexToHsl(out)?.l).toBeLessThan(hexToHsl("#FDE68A")?.l ?? 0);
  });

  it("passes invalid input and empty surfaces through", () => {
    expect(ensureReadableAccent("nope", darkSurfaces)).toBe("nope");
    expect(ensureReadableAccent("#0C390F", [])).toBe("#0C390F");
  });
});
