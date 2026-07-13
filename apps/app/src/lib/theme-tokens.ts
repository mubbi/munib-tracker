import { accentOnSurface } from "@munib-tracker/theme/color";
import type { ThemeColors } from "@munib-tracker/theme/types";

import { Brand, Mushaf, type StatusKey, StatusPalette, withAlpha } from "@/constants/theme";

export type StatusToken = {
  /** Raw status hue — use for fills, icons, borders (not small text). */
  color: string;
  /** AA-passing tone for status-coloured TEXT on a card/background surface. */
  text: string;
  soft: string;
  border: string;
};

export type ThemeTokens = {
  isDark: boolean;
  accentSoft: string;
  accentBorder: string;
  hairline: string;
  surfaceRaised: string;
  /** Sliding thumb on a muted segmented track — must read clearly in both schemes. */
  segmentThumb: string;
  track: string;
  ripple: string;
  scrim: string;
  hero: typeof Brand;
  mushaf: {
    paper: string;
    frame: string;
    frameSoft: string;
    ink: string;
    bandFill: string;
    bandBorder: string;
    highlight: string;
  };
  status: Record<StatusKey, StatusToken>;
};

/**
 * Derives semantic tokens from resolved theme colors. Called once per theme
 * change in MunibThemeProvider — never per consumer.
 */
export function computeThemeTokens(colors: ThemeColors, scheme: "light" | "dark"): ThemeTokens {
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
    accentSoft: withAlpha(colors.accent, isDark ? 0.24 : 0.14),
    accentBorder: withAlpha(colors.accent, isDark ? 0.45 : 0.3),
    hairline: withAlpha(colors.foreground, isDark ? 0.1 : 0.08),
    surfaceRaised: isDark ? colors.muted : colors.card,
    // Dark `card` ≈ `muted`, so lift the thumb with a translucent foreground wash.
    segmentThumb: isDark ? withAlpha(colors.foreground, 0.22) : colors.card,
    track: withAlpha(colors.foreground, isDark ? 0.18 : 0.12),
    ripple: withAlpha(colors.foreground, isDark ? 0.16 : 0.1),
    scrim: withAlpha("#000000", 0.4),
    hero: Brand,
    mushaf: {
      paper: isDark ? colors.card : Mushaf.paperLight,
      frame: isDark ? Mushaf.goldDark : Mushaf.goldLight,
      frameSoft: isDark ? Mushaf.goldSoftDark : Mushaf.goldSoftLight,
      ink: isDark ? Mushaf.inkDark : Mushaf.inkLight,
      bandFill: withAlpha(isDark ? Mushaf.goldDark : Mushaf.goldLight, isDark ? 0.16 : 0.1),
      bandBorder: withAlpha(isDark ? Mushaf.goldDark : Mushaf.goldLight, isDark ? 0.5 : 0.36),
      highlight: withAlpha(isDark ? Mushaf.inkDark : Mushaf.goldLight, isDark ? 0.24 : 0.18),
    },
    status,
  };
}
