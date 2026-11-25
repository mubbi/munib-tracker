import { Platform, StyleSheet, type ViewStyle } from "react-native";

import { tvDp } from "./tv-density";

export type ThemeColor =
  | "foreground"
  | "background"
  | "muted"
  | "border"
  | "mutedForeground"
  | "accent"
  | "card"
  | "cardForeground"
  /** AA accent tone for text/icons on background or card (never raw `accent` as text). */
  | "accentText"
  | "cardBorder"
  | "input"
  | "inputBorder";

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

/**
 * Spacing scale (dp). On Apple TV (1920×1080pt layout) every step is doubled via
 * {@link tvDp} so tvOS matches Android TV's physical size; identity elsewhere.
 * `Spacing.x ± n` arithmetic is banned — the literal part skips `tvDp`; use
 * `oneHalf` / `twoHalf` instead.
 */
export const Spacing = {
  half: tvDp(2),
  one: tvDp(4),
  /** Replaces `Spacing.one + 2` / `Spacing.half + 4`. */
  oneHalf: tvDp(6),
  two: tvDp(8),
  /** Replaces `Spacing.two + 2`. */
  twoHalf: tvDp(10),
  three: tvDp(16),
  four: tvDp(24),
  five: tvDp(32),
  six: tvDp(64),
} as const;

/** Corner radii scale (squircle-friendly via `borderCurve: "continuous"`). */
export const Radius = {
  /** Progress tracks, small badges, checkbox, skeleton lines, sheet grabber. */
  xs: tvDp(6),
  sm: tvDp(10),
  md: tvDp(14),
  lg: tvDp(20),
  xl: tvDp(28),
  pill: 999,
} as const;

/** Border widths. The TV focus ring keeps its own `TvLayout.focusRingWidth`. */
export const BorderWidth = {
  /** Dividers, secondary-button outline (one physical pixel — never TV-scaled). */
  hairline: StyleSheet.hairlineWidth,
  /** Card, field, ghost button, chip. */
  thin: tvDp(1),
  /** Selected / emphasis outline (literal 1.5 resolves here or to `thin`). */
  thick: tvDp(2),
} as const;

/**
 * Control heights (dp, `tvDp`-scaled). On TV, focusables use
 * `TvLayout.minFocusTarget` / `TvLayout.chipMinHeight` instead.
 */
export const Control = {
  /** `Button sm`, dense toolbars — never a screen's primary action. */
  sm: tvDp(36),
  /** `Button md`, `IconButton`, `SwitchRow`, `SegmentedControl`, `Stepper md`. */
  md: tvDp(44),
  /** `Button lg` — full-width primary CTA. */
  lg: tvDp(52),
  /** `NavRow`, settings rows. */
  row: tvDp(52),
  /** `TextField`, `SearchField`. */
  field: tvDp(50),
  /**
   * Minimum hit area — 48dp Android, 44pt iOS / web. Deliberately **unscaled**:
   * it is a platform HIG floor, not a layout size. Reach it with `hitSlop` on
   * native and with real size on web (`hitSlop` is ignored there).
   */
  minTouch: Platform.OS === "android" ? 48 : 44,
} as const;

/**
 * Icon sizes — **raw dp, NOT `tvDp`**. The `expo-symbols` TV shim already
 * multiplies every `SymbolView` `size` by `TV_DENSITY`; wrapping again would
 * double-scale. Wells, images and SVGs that are not `SymbolView` use
 * `tvDp(IconSize.x)`. On TV, use one step up (`md` → `lg`).
 */
export const IconSize = {
  /** Inline with caption, chevrons in pills. */
  xs: 12,
  /** `Button sm`, chips. */
  sm: 14,
  /** `Button md`, row chevrons. */
  md: 16,
  /** Row leading icons, tab bar. */
  lg: 20,
  /** Icon buttons, headers. */
  xl: 24,
  /** Empty state, feature wells. */
  hero: 28,
} as const;

/** Stacking order — the only z-index values screens may use. */
export const ZIndex = {
  base: 0,
  raised: 1,
  sticky: 10,
  header: 20,
  overlay: 1000,
  modal: 2000,
  toast: 3000,
} as const;

/**
 * Interaction opacities. Never use opacity to de-emphasise text — use
 * `mutedForeground`.
 */
export const Opacity = {
  disabled: 0.5,
  pressed: 0.88,
} as const;

/** Window-width breakpoints (px) — names for the layout literals; values unchanged. */
export const Breakpoints = {
  /** Side rail replaces bottom tabs. */
  tablet: 768,
  /** Two-pane list–detail where supported. */
  listDetail: 900,
  /** Content cap 1120; multi-column grids. */
  wide: 1024,
  /** Content cap 1320. */
  xwide: 1600,
} as const;

export const BottomTabInset = Platform.select({ ios: 84, android: 72, web: 72 }) ?? 72;
export const MaxContentWidth = 800;

/**
 * Brand hero palette — an intentional deep-green gradient used on the prayer
 * hero regardless of light/dark mode (premium "prayer app" look). Centralised
 * here so it stays the single source of truth and can be themed later.
 */
export const Brand = {
  heroTop: "#12463A",
  heroBottom: "#0B2A22",
  heroGlow: "#1F7A63",
  heroText: "#F2EFE6",
  heroSubtext: "#A9C6BB",
  heroBorder: "#1E5A49",
  /** Soft brand-gold that reads on the deep-green hero (highlights, active prayer). */
  heroAccent: "#E4CE9E",
  onHeroMutedSurface: "rgba(255, 255, 255, 0.08)",
  onHeroStrongSurface: "rgba(255, 255, 255, 0.14)",
} as const;

/**
 * Illuminated-mushaf palette — the warm gold inks and parchment of a printed
 * Qur'an leaf. Deliberately CONSTANT across the app's themeable accents: a real
 * mushaf frame is always gold on cream (or gold on night), never the UI accent
 * hue. Consumed via `useThemeTokens().mushaf`, which picks the light/dark set.
 */
export const Mushaf = {
  /** Warm cream page ("paper") for the light reading surface. */
  paperLight: "#FBF5E6",
  /** Antique-gold outer rule + ornaments (light). */
  goldLight: "#AE8A34",
  /** Soft-gold thin inner rule (light). */
  goldSoftLight: "#D8C287",
  /** Gilt ink for ayah markers, ornaments, surah name (light). */
  inkLight: "#977A26",
  /** Brighter gilt that reads on the deep-green night page (dark). */
  goldDark: "#C9AC61",
  goldSoftDark: "#8C7538",
  inkDark: "#DAC079",
} as const;

/** Semantic status colors for tracking states. Tuned to read on both themes. */
export const StatusPalette = {
  success: "#2E9E6B",
  warning: "#D9A343",
  danger: "#D9604C",
  info: "#4C8FD9",
} as const;

export type StatusKey = keyof typeof StatusPalette;

/**
 * Destructive-button fill + label (`tokens.status.danger.fill` / `.onFill`). The
 * raw danger hue is 3.67:1 under white, so destructive actions get a deeper
 * (light) / lighter (dark) fill that clears 4.5:1 with its label.
 */
export const DangerFillPalette = {
  fillLight: "#B8432F",
  onFillLight: "#FFFFFF",
  fillDark: "#E57A68",
  onFillDark: "#152921",
} as const;

/** Precious-metal hues (zakat nisab indicators). Fills and icons only — never text. */
export const Metal = {
  gold: "#D4A017",
  silver: "#A8B0B8",
} as const;

/**
 * Festive confetti hues for completion bursts (`PartyPopper`) — gold, green,
 * sky and sun. Deliberately CONSTANT across accents and schemes (they are
 * small, short-lived particles on top of any surface). Consumed via
 * `useThemeTokens().celebration`.
 */
export const CelebrationPalette = ["#D4AF37", "#4CAF7D", "#5AA9E6", "#F2C94C"] as const;

/**
 * Calm browse-section hues (dua groups, …) that sit beside the brand green and
 * mushaf gold. Fills, icon wells and icons only — run text through
 * `accentOnSurface` first. The fourth group hue is the user's accent.
 */
export const CategoryHues = {
  dawn: "#C9923A",
  sky: "#4C8FD9",
  rose: "#C46A7A",
  // NF-3.21: the app keeps ONE palette of soft hues — ayah highlights use these too.
  sage: "#5E9E72",
  violet: "#8E6CC8",
} as const;

/** Browse-section hue keys (`accent` follows the user's chosen accent). */
export type CategoryHueKey = "accent" | keyof typeof CategoryHues;

/**
 * Layered elevation presets using the cross-platform `boxShadow` shorthand
 * ("offsetX offsetY blur color"). Black is used (not a themed color) with low
 * opacity so it reads on both cream and deep-green surfaces.
 */
export const Shadows = {
  none: {},
  sm: {
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
  },
  md: {
    boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.1)",
  },
  lg: {
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.16)",
  },
} as const;

export type Elevation = keyof typeof Shadows;

export type ShadowOptions = {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  opacity?: number;
  elevation?: number;
};

/**
 * Cross-platform shadow helper — `boxShadow` on web, legacy shadow* on iOS,
 * `elevation` on Android. Prefer this over raw shadow props to avoid RN Web
 * deprecation warnings.
 */
export function createShadow(color: string, options: ShadowOptions = {}): ViewStyle {
  const {
    offsetX = 0,
    offsetY = 2,
    blur = 6,
    opacity = 0.1,
    elevation = Math.max(1, Math.round(blur / 3)),
  } = options;

  return (
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: color,
        shadowOffset: { width: offsetX, height: offsetY },
        shadowOpacity: opacity,
        shadowRadius: blur,
      },
      android: { elevation },
      web: {
        boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${withAlpha(color, opacity)}`,
      },
      default: {},
    }) ?? {}
  );
}

/**
 * Applies an alpha channel to a 6-digit hex color, returning an 8-digit hex.
 * Used to derive soft/translucent tints from themed colors without hardcoding.
 */
export function withAlpha(hexColor: string, alpha: number): string {
  const normalized = hexColor.replace("#", "");
  if (normalized.length !== 6) {
    return hexColor;
  }
  const clamped = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return `#${normalized}${clamped.toString(16).padStart(2, "0")}`;
}
