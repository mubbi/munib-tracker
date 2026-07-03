import { Platform } from "react-native";

export type ThemeColor =
  | "foreground"
  | "background"
  | "muted"
  | "border"
  | "mutedForeground"
  | "accent"
  | "card"
  | "cardForeground";

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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Corner radii scale (squircle-friendly via `borderCurve: "continuous"`). */
export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
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

/** Semantic status colors for tracking states. Tuned to read on both themes. */
export const StatusPalette = {
  success: "#2E9E6B",
  warning: "#D9A343",
  danger: "#D9604C",
  info: "#4C8FD9",
} as const;

export type StatusKey = keyof typeof StatusPalette;

/**
 * Layered elevation presets. `shadowColor` uses black which is not a themed
 * color; opacity is kept low so it reads on cream and deep-green surfaces.
 */
export const Shadows = {
  none: {},
  sm: {
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  lg: {
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
} as const;

export type Elevation = keyof typeof Shadows;

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
