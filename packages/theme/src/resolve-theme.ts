import { accentColors, defaultAccentColorId } from "./accents";
import { accentOnSurface, bestForeground } from "./color";
import type { AccentColorId, ColorMode, ThemeColors } from "./types";

const lightBase = {
  background: "#F5F0E6",
  foreground: "#152921",
  muted: "#E8E2D4",
  mutedForeground: "#5C7268",
  border: "#C9C0AE",
  card: "#FFFCF7",
  cardForeground: "#152921",
};

const darkBase = {
  background: "#152921",
  foreground: "#E8DCC8",
  muted: "#1E3530",
  mutedForeground: "#8BA89A",
  border: "#2A453C",
  card: "#1C322C",
  cardForeground: "#E8DCC8",
};

export function resolveTheme(
  colorMode: ColorMode,
  systemScheme: "light" | "dark" | null | undefined,
  accentColorId: AccentColorId = defaultAccentColorId,
): ThemeColors {
  const resolvedScheme =
    colorMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : colorMode;

  const base = resolvedScheme === "dark" ? darkBase : lightBase;
  const accent = accentColors[accentColorId] ?? accentColors[defaultAccentColorId];
  const resolvedAccent = resolvedScheme === "dark" ? accent.dark : accent.light;
  // Accent text sits on the surface with the least contrast headroom for that
  // scheme: the (darker) page background in light mode, the (lighter) card in dark.
  const textSurface = resolvedScheme === "dark" ? base.card : base.background;

  return {
    ...base,
    accent: resolvedAccent,
    accentForeground: bestForeground(resolvedAccent),
    accentText: accentOnSurface(resolvedAccent, textSurface),
  };
}
