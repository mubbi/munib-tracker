export type ColorMode = "light" | "dark" | "system";

export type AccentColorId = "gold" | "emerald" | "teal" | "amber" | "slate";

export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemeSettings {
  colorMode: ColorMode;
  accentColorId: AccentColorId;
}

export const STORAGE_KEYS = {
  colorMode: "@munib-tracker/color-mode",
  accent: "@munib-tracker/accent",
} as const;
