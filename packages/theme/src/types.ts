export type ColorMode = "light" | "dark" | "system";

export type AccentColorId =
  | "forest"
  | "ocean"
  | "indigo"
  | "purple"
  | "rose"
  | "coral"
  | "amber"
  | "teal"
  | "cyan"
  | "slate"
  | "pink"
  | "lime";

export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  /** Readable foreground for text/icons placed ON an accent fill (e.g. Button). */
  accentForeground: string;
  /** AA-passing accent tone for accent-coloured TEXT on a neutral surface. */
  accentText: string;
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
