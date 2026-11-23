import { accentOnSurface } from "@munib-tracker/theme/color";
import { useMemo } from "react";

import { type CategoryHueKey, CategoryHues, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export interface CategoryHue {
  /** Icon / glyph tint — ≥3:1 (non-text) against the row surface. */
  icon: string;
  /** AA text tone for hue-coloured captions. */
  text: string;
  /** Soft icon-well fill. */
  soft: string;
  /** Hairline border in the hue. */
  border: string;
}

/** Resolves a browse hue against the active theme (accent follows the user's choice). */
export function useCategoryHue(hue: CategoryHueKey): CategoryHue {
  const { colors, tokens } = useThemeTokens();
  return useMemo(() => {
    const raw = hue === "accent" ? colors.accent : CategoryHues[hue];
    return {
      icon: accentOnSurface(raw, colors.muted, 3),
      text: accentOnSurface(raw, colors.muted, 4.5),
      soft: hue === "accent" ? tokens.accentSoft : withAlpha(raw, tokens.isDark ? 0.24 : 0.16),
      border: hue === "accent" ? tokens.accentBorder : withAlpha(raw, tokens.isDark ? 0.45 : 0.34),
    };
  }, [colors.accent, colors.muted, hue, tokens.accentBorder, tokens.accentSoft, tokens.isDark]);
}
