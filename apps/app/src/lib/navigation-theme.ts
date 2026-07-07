import type { ThemeColors } from "@munib-tracker/theme/types";
import { DarkTheme } from "expo-router/build/react-navigation/native/theming/DarkTheme";
import { DefaultTheme } from "expo-router/build/react-navigation/native/theming/DefaultTheme";

type NavigationTheme = typeof DarkTheme;

/** Maps Munib theme tokens onto React Navigation's theme for stack/tab backgrounds. */
export function createNavigationTheme(
  colors: ThemeColors,
  scheme: "light" | "dark",
): NavigationTheme {
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: scheme === "dark",
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.card,
      text: colors.foreground,
      border: colors.border,
      notification: colors.accent,
    },
  };
}
