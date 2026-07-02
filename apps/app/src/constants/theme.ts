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

export const BottomTabInset = Platform.select({ ios: 84, android: 72, web: 72 }) ?? 72;
export const MaxContentWidth = 800;
