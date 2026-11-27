import { describe, expect, it } from "vitest";
import { accentColors } from "./accents";
import { bestForeground, contrastRatio } from "./color";
import { nativeTokens } from "./native-tokens";
import { resolveTheme } from "./resolve-theme";

describe("nativeTokens", () => {
  for (const scheme of ["light", "dark"] as const) {
    it(`${scheme} equals resolveTheme(forest)`, () => {
      const t = resolveTheme(scheme, null, "forest");
      expect(nativeTokens[scheme]).toEqual({
        background: t.background,
        card: t.card,
        cardBorder: t.cardBorder,
        muted: t.muted,
        text: t.foreground,
        textSecondary: t.mutedForeground,
        border: t.border,
        accent: t.accent,
        accentForeground: t.accentForeground,
        accentText: t.accentText,
      });
    });

    it(`${scheme} secondary text is AA on background, card and muted`, () => {
      const s = nativeTokens[scheme];
      for (const surface of [s.background, s.card, s.muted]) {
        expect(contrastRatio(s.textSecondary, surface)).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  it("default accent is forest", () => {
    expect(nativeTokens.defaultAccent).toEqual({
      light: accentColors.forest.light,
      dark: accentColors.forest.dark,
    });
  });

  it("danger on-fill is the best foreground for the danger fill", () => {
    expect(nativeTokens.danger.fill).toBe(nativeTokens.status.danger);
    expect(nativeTokens.danger.onFill).toBe(bestForeground(nativeTokens.status.danger));
  });
});
