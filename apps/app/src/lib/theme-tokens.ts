import { accentOnSurface, compositeOver } from "@munib-tracker/theme/color";
import type { ThemeColors } from "@munib-tracker/theme/types";

import {
  Brand,
  CelebrationPalette,
  DangerFillPalette,
  Mushaf,
  type StatusKey,
  StatusPalette,
  withAlpha,
} from "@/constants/theme";

export type StatusToken = {
  /** Raw status hue — use for fills, icons, borders (not small text). */
  color: string;
  /** AA-passing tone for status-coloured TEXT on a card/background surface. */
  text: string;
  soft: string;
  border: string;
  /** AA-passing tone for status-coloured text/icons ON `soft` (or on `muted`). */
  onSoft: string;
};

/** `status.danger` also carries the destructive-button fill and its label. */
export type DangerStatusToken = StatusToken & {
  /** Destructive button fill — ≥3:1 vs every surface. */
  fill: string;
  /** Label/icon on `fill` — ≥4.5:1. */
  onFill: string;
};

export type InputSurfaceToken = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
};

export type ThemeTokens = {
  isDark: boolean;
  accentSoft: string;
  accentBorder: string;
  /**
   * Accent text/icons ON `accentSoft`, the secondary-button tint, or `muted`
   * (raw `accent` / `accentText` fail AA there). Derived against the least
   * favourable of those surfaces, so it clears 4.5:1 on all of them.
   */
  accentOnSoft: string;
  /** Focus ring colour for web keyboard focus and TV (≥3:1 on background/card/muted). */
  focusRing: string;
  hairline: string;
  /**
   * Drop-in style for every text input / search field: fill + ≥3:1 outline.
   * Spread it into the TextInput (or its wrapper row) style array.
   */
  inputSurface: InputSurfaceToken;
  /** Same as `inputSurface` but with the accent ring — use while the field is focused. */
  inputSurfaceFocused: InputSurfaceToken;
  /** Field in error: `status.danger.text` outline. Always pair with an error message. */
  inputSurfaceError: InputSurfaceToken;
  surfaceRaised: string;
  /** Sliding thumb on a muted segmented track — must read clearly in both schemes. */
  segmentThumb: string;
  track: string;
  /** Off-state switch track — `inputBorder` (≥3:1 vs card); `track` is decorative only. */
  switchTrackOff: string;
  /** Pointer hover wash on transparent surfaces. */
  hover: string;
  ripple: string;
  scrim: string;
  /** Media viewers (image gallery, PDF) — black @ 70%. */
  scrimStrong: string;
  /** Text/icons over `scrimStrong` or media. */
  onScrim: string;
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
  status: Record<StatusKey, StatusToken> & { danger: DangerStatusToken };
  /** Confetti hues for completion bursts — the default `PartyPopper` palette. */
  celebration: readonly string[];
};

/** Stable token objects for cached theme color refs — toggles reuse the same map entry. */
const themeTokenCache = new WeakMap<ThemeColors, ThemeTokens>();

/**
 * Derives semantic tokens from resolved theme colors. Called once per theme
 * change in MunibThemeProvider — never per consumer.
 */
export function computeThemeTokens(colors: ThemeColors, scheme: "light" | "dark"): ThemeTokens {
  const cached = themeTokenCache.get(colors);
  if (cached && cached.isDark === (scheme === "dark")) {
    return cached;
  }

  const isDark = scheme === "dark";
  const textSurface = isDark ? colors.card : colors.background;
  const statusSoftAlpha = isDark ? 0.22 : 0.14;

  const baseStatus = Object.fromEntries(
    (Object.keys(StatusPalette) as StatusKey[]).map((key) => {
      const hue = StatusPalette[key];
      return [
        key,
        {
          color: hue,
          text: accentOnSurface(hue, textSurface),
          soft: withAlpha(hue, statusSoftAlpha),
          border: withAlpha(hue, isDark ? 0.4 : 0.28),
          // `soft` over `muted` is the darkest (light) / lightest (dark) tinted surface.
          onSoft: accentOnSurface(hue, compositeOver(hue, statusSoftAlpha, colors.muted), 4.5),
        } satisfies StatusToken,
      ];
    }),
  ) as Record<StatusKey, StatusToken>;
  const status: ThemeTokens["status"] = {
    ...baseStatus,
    danger: {
      ...baseStatus.danger,
      fill: isDark ? DangerFillPalette.fillDark : DangerFillPalette.fillLight,
      onFill: isDark ? DangerFillPalette.onFillDark : DangerFillPalette.onFillLight,
    },
  };

  const tokens: ThemeTokens = {
    isDark,
    // Light soft fills need more chroma on cream surfaces than dark glass.
    accentSoft: withAlpha(colors.accent, isDark ? 0.24 : 0.18),
    accentBorder: withAlpha(colors.accent, isDark ? 0.45 : 0.36),
    // The secondary-button tint (20% / 28%) over `muted` is the least favourable
    // surface accent text ever sits on — clearing 4.5:1 there clears it on
    // `accentSoft`, `muted`, background and card too (pinned by the Jest matrix).
    accentOnSoft: accentOnSurface(
      colors.accent,
      compositeOver(colors.accent, isDark ? 0.28 : 0.2, colors.muted),
      4.5,
    ),
    focusRing: colors.accentText,
    // 0.14 / 0.12: the old 0.10 / 0.08 hairlines disappeared on dark-green cards.
    hairline: withAlpha(colors.foreground, isDark ? 0.14 : 0.12),
    inputSurface: {
      backgroundColor: colors.input,
      borderColor: colors.inputBorder,
      borderWidth: 1,
    },
    inputSurfaceFocused: {
      backgroundColor: colors.input,
      borderColor: colors.accent,
      borderWidth: 1,
    },
    inputSurfaceError: {
      backgroundColor: colors.input,
      borderColor: status.danger.text,
      borderWidth: 1,
    },
    surfaceRaised: isDark ? colors.muted : colors.card,
    // Dark `card` ≈ `muted`, so lift the thumb with a translucent foreground wash.
    segmentThumb: isDark ? withAlpha(colors.foreground, 0.22) : colors.card,
    track: withAlpha(colors.foreground, isDark ? 0.2 : 0.14),
    switchTrackOff: colors.inputBorder,
    hover: withAlpha(colors.foreground, isDark ? 0.06 : 0.04),
    ripple: withAlpha(colors.foreground, isDark ? 0.16 : 0.1),
    scrim: withAlpha("#000000", 0.4),
    scrimStrong: withAlpha("#000000", 0.7),
    onScrim: "#FFFFFF",
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
    celebration: CelebrationPalette,
  };
  themeTokenCache.set(colors, tokens);
  return tokens;
}
