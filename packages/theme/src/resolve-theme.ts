import { accentColors, defaultAccentColorId } from "./accents";
import { accentOnSurface, bestForeground } from "./color";
import type { AccentColorId, ColorMode, ThemeColors } from "./types";

/**
 * Surface ladder (WCAG ratios measured against the neighbouring surface):
 *
 *   background → card (elevated, ~1.2:1 + 1px `cardBorder`)
 *              → muted (chips, wells, list rows, segmented tracks; ~1.25:1 on card)
 *              → input (form fields; always paired with a ≥3:1 `inputBorder`, WCAG 1.4.11)
 *
 * `mutedForeground` clears AA (≥4.5:1) on background, card AND muted, so
 * secondary text stays legible wherever it lands. Page backgrounds are pinned
 * to the splash / PWA / widget colours (`app.json`, `cold-start.ts`) — change
 * those together or not at all.
 */
const lightBase = {
  background: "#F5F0E6",
  foreground: "#152921",
  muted: "#EAE3D4",
  mutedForeground: "#4A6157",
  border: "#D2C7B1",
  card: "#FFFDF9",
  cardForeground: "#152921",
  cardBorder: "#E3D9C6",
  input: "#FFFFFF",
  inputBorder: "#8C826E",
};

const darkBase = {
  background: "#152921",
  foreground: "#EEE4D2",
  muted: "#2B463D",
  mutedForeground: "#A2BDB0",
  border: "#3D5F53",
  card: "#1E3830",
  cardForeground: "#EEE4D2",
  cardBorder: "#30504A",
  input: "#2B463D",
  inputBorder: "#60857A",
};

function buildTheme(resolvedScheme: "light" | "dark", accentColorId: AccentColorId): ThemeColors {
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

/** Stable references for preset accent × scheme pairs — avoids re-allocating on every theme toggle. */
const presetThemeCache = new Map<string, ThemeColors>();

function getPresetTheme(
  resolvedScheme: "light" | "dark",
  accentColorId: AccentColorId,
): ThemeColors {
  const key = `${resolvedScheme}:${accentColorId}`;
  let cached = presetThemeCache.get(key);
  if (!cached) {
    cached = buildTheme(resolvedScheme, accentColorId);
    presetThemeCache.set(key, cached);
  }
  return cached;
}

export function resolveTheme(
  colorMode: ColorMode,
  systemScheme: "light" | "dark" | null | undefined,
  accentColorId: AccentColorId = defaultAccentColorId,
): ThemeColors {
  const resolvedScheme =
    colorMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : colorMode;

  return getPresetTheme(resolvedScheme, accentColorId);
}
