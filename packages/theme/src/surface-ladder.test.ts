import { describe, expect, it } from "vitest";
import { accentColorIds } from "./accents";
import { contrastRatio } from "./color";
import { resolveTheme } from "./resolve-theme";

/**
 * Locks the surface ladder so cards, fills and inputs never collapse back into
 * the page background (the regression this guards: dark card vs muted was 1.04:1).
 */
describe.concurrent.each(["light", "dark"] as const)("%s surface ladder", (mode) => {
  const c = resolveTheme(mode, mode, "forest");

  it("mutedForeground is AA on every neutral surface", () => {
    for (const surface of [c.background, c.card, c.muted]) {
      expect(contrastRatio(c.mutedForeground, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("foreground is AAA on every neutral surface", () => {
    for (const surface of [c.background, c.card, c.muted, c.input]) {
      expect(contrastRatio(c.foreground, surface)).toBeGreaterThanOrEqual(7);
    }
  });

  it("input outline meets WCAG 1.4.11 (3:1) on card and background", () => {
    expect(contrastRatio(c.inputBorder, c.card)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(c.inputBorder, c.background)).toBeGreaterThanOrEqual(3);
  });

  it("muted fill is distinguishable from the card it sits on", () => {
    expect(contrastRatio(c.muted, c.card)).toBeGreaterThanOrEqual(1.2);
  });

  it("card outline is visible against the card fill", () => {
    expect(contrastRatio(c.cardBorder, c.card)).toBeGreaterThanOrEqual(1.3);
  });

  it("every accent fill stays visible as an icon / border on the card", () => {
    for (const id of accentColorIds) {
      const themed = resolveTheme(mode, mode, id);
      expect(contrastRatio(themed.accent, themed.card)).toBeGreaterThanOrEqual(2);
    }
  });
});
