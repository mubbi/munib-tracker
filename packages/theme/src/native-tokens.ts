import { defaultAccentColorId } from "./accents";
import { bestForeground } from "./color";
import { resolveTheme } from "./resolve-theme";
import type { ThemeColors } from "./types";

/**
 * Single source of truth for every NON-React-Native surface (Swift widgets / watch /
 * Live Activity fallbacks, Android widget JS, Wear OS tiles, config plugins, screenshot
 * scenes). Colour only — type and spacing follow the host platform.
 *
 * Everything here is derived from `resolveTheme()` for the default accent; the only
 * literals are the status hues, which mirror `StatusPalette` in
 * `apps/app/src/constants/theme.ts` (that file lives in the RN app, so the package
 * cannot import it; `apps/app/plugins/nativeTokens.test.js` asserts they are equal).
 *
 * Regenerate the committed native outputs with `pnpm --filter app generate:native-tokens`.
 */

export interface NativeSchemeTokens {
  background: string;
  card: string;
  cardBorder: string;
  muted: string;
  /** Primary text (`foreground`). */
  text: string;
  /** Secondary text (`mutedForeground`), AA on background, card and muted. */
  textSecondary: string;
  border: string;
  /** Default-accent fill (forest). */
  accent: string;
  /** Readable colour on an accent fill. */
  accentForeground: string;
  /** Accent-coloured TEXT on a neutral surface (AA). */
  accentText: string;
}

function pick(theme: ThemeColors): NativeSchemeTokens {
  return {
    background: theme.background,
    card: theme.card,
    cardBorder: theme.cardBorder,
    muted: theme.muted,
    text: theme.foreground,
    textSecondary: theme.mutedForeground,
    border: theme.border,
    accent: theme.accent,
    accentForeground: theme.accentForeground,
    accentText: theme.accentText,
  };
}

const light = pick(resolveTheme("light", null, defaultAccentColorId));
const dark = pick(resolveTheme("dark", null, defaultAccentColorId));

/** Mirrors `StatusPalette` (apps/app/src/constants/theme.ts). Drift-tested. */
const status = {
  success: "#2E9E6B",
  warning: "#D9A343",
  danger: "#D9604C",
  info: "#4C8FD9",
} as const;

export const nativeTokens = {
  light,
  dark,
  defaultAccent: { light: light.accent, dark: dark.accent },
  status,
  /** Destructive fill and the colour of text/icons on it. */
  danger: { fill: status.danger, onFill: bestForeground(status.danger) },
} as const;

export type NativeTokens = typeof nativeTokens;
