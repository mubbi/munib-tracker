import { resolveTheme } from "@munib-tracker/theme/resolve";

import { contrastRatio } from "@/lib/color";
import { computeThemeTokens } from "@/lib/theme-tokens";

import {
  ANNOTATION_COLOR_IDS,
  ANNOTATION_HUES,
  annotationSwatch,
  annotationTint,
  compositeOver,
} from "./annotation-colors";

describe("annotation highlight colours", () => {
  it.each(["light", "dark"] as const)(
    "keep the Arabic text at AA contrast on every reading surface (%s)",
    (scheme) => {
      const colors = resolveTheme(scheme, scheme);
      const tokens = computeThemeTokens(colors, scheme);
      const surfaces = [colors.background, colors.card, tokens.mushaf.paper];
      for (const id of ANNOTATION_COLOR_IDS) {
        const tint = annotationTint(id, scheme === "dark");
        for (const surface of surfaces) {
          const seen = compositeOver(tint, surface);
          expect(contrastRatio(colors.foreground, seen)).toBeGreaterThanOrEqual(4.5);
          // …and the tint is actually visible against the bare surface.
          expect(seen.toLowerCase()).not.toBe(surface.toLowerCase());
        }
        // The swatch / note glyph stays a ≥3:1 non-text mark.
        expect(
          contrastRatio(annotationSwatch(id, colors.background), colors.background),
        ).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it("never follows the accent colour", () => {
    const forest = resolveTheme("light", "light", "forest");
    const other = resolveTheme("light", "light", "ocean");
    expect(annotationTint("gold", false)).toBe(annotationTint("gold", false));
    expect(Object.values(ANNOTATION_HUES)).not.toContain(forest.accent);
    expect(Object.values(ANNOTATION_HUES)).not.toContain(other.accent);
  });

  it("composites an 8-digit tint over a surface", () => {
    expect(compositeOver("#00000080", "#ffffff")).toBe("#7f7f7f");
    expect(compositeOver("#123456", "#ffffff")).toBe("#123456");
  });
});
