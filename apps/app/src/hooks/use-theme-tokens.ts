import { accentOnSurface } from "@munib-tracker/theme/color";
import { useMemo } from "react";

import { Brand, type StatusKey, StatusPalette, withAlpha } from "@/constants/theme";
import { useTheme } from "@/providers/theme-provider";

export type StatusToken = {
  /** Raw status hue — use for fills, icons, borders (not small text). */
  color: string;
  /** AA-passing tone for status-coloured TEXT on a card/background surface. */
  text: string;
  soft: string;
  border: string;
};

/**
 * Extends the base theme with semantic, derived tokens (soft accent tints,
 * status colors, hero surface) so screens never hardcode raw colors.
 */
export function useThemeTokens() {
  const {
    colors,
    scheme,
    accentColorId,
    customAccent,
    colorMode,
    isReady,
    setColorMode,
    setAccentColor,
    setCustomAccent,
  } = useTheme();

  const tokens = useMemo(() => {
    const isDark = scheme === "dark";

    const textSurface = isDark ? colors.card : colors.background;
    const status = Object.fromEntries(
      (Object.keys(StatusPalette) as StatusKey[]).map((key) => [
        key,
        {
          color: StatusPalette[key],
          text: accentOnSurface(StatusPalette[key], textSurface),
          soft: withAlpha(StatusPalette[key], isDark ? 0.22 : 0.14),
          border: withAlpha(StatusPalette[key], isDark ? 0.4 : 0.28),
        } satisfies StatusToken,
      ]),
    ) as Record<StatusKey, StatusToken>;

    return {
      isDark,
      /** Soft translucent accent used for chips, icon wells, highlights. */
      accentSoft: withAlpha(colors.accent, isDark ? 0.24 : 0.14),
      accentBorder: withAlpha(colors.accent, isDark ? 0.45 : 0.3),
      /** Subtle divider that reads on both card and background. */
      hairline: withAlpha(colors.foreground, isDark ? 0.1 : 0.08),
      /** Elevated surface tint for nested cards. */
      surfaceRaised: isDark ? colors.muted : colors.card,
      /** Track color for progress bars / rings — a light "disabled" wash behind fills. */
      track: withAlpha(colors.foreground, isDark ? 0.18 : 0.12),
      /** Native Android Material ripple tint — a soft on-surface wash that reads
       * on both accent fills and neutral cards. Used by PressableScale. */
      ripple: withAlpha(colors.foreground, isDark ? 0.16 : 0.1),
      /** Full-bleed scrim for overlays. */
      scrim: withAlpha("#000000", 0.4),
      hero: Brand,
      status,
    };
  }, [colors.accent, colors.background, colors.card, colors.foreground, colors.muted, scheme]);

  return {
    colors,
    tokens,
    scheme,
    accentColorId,
    customAccent,
    colorMode,
    isReady,
    setColorMode,
    setAccentColor,
    setCustomAccent,
  };
}
