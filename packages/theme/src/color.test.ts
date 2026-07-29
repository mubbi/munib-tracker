import { describe, expect, it } from "vitest";
import { accentColorIds } from "./accents";
import { accentOnSurface, bestForeground, contrastRatio, ensureContrastAgainst } from "./color";
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
