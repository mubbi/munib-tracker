import { useMemo } from "react";

import { Brand, type StatusKey, StatusPalette, withAlpha } from "@/constants/theme";
import { useTheme } from "@/providers/theme-provider";

export type StatusToken = {
  color: string;
  soft: string;
  border: string;
};

/**
 * Extends the base theme with semantic, derived tokens (soft accent tints,
 * status colors, hero surface) so screens never hardcode raw colors.
 */
export function useThemeTokens() {
  const { colors, scheme, accentColorId, colorMode, isReady, setColorMode, setAccentColor } =
    useTheme();

  const tokens = useMemo(() => {
    const isDark = scheme === "dark";

    const status = Object.fromEntries(
      (Object.keys(StatusPalette) as StatusKey[]).map((key) => [
        key,
        {
          color: StatusPalette[key],
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
      /** Track color for progress bars / rings. */
      track: withAlpha(colors.foreground, isDark ? 0.14 : 0.1),
      /** Full-bleed scrim for overlays. */
      scrim: withAlpha("#000000", 0.4),
      hero: Brand,
      status,
    };
  }, [colors.accent, colors.card, colors.foreground, colors.muted, scheme]);

  return {
    colors,
    tokens,
    scheme,
    accentColorId,
    colorMode,
    isReady,
    setColorMode,
    setAccentColor,
  };
}
