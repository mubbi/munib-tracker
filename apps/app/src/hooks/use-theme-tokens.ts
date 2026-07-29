import { useTheme } from "@/providers/theme-provider";

export type { StatusToken, ThemeTokens } from "@/lib/theme-tokens";

/**
 * Returns resolved theme colors plus pre-computed semantic tokens from the
 * provider — no per-consumer derivation on theme change.
 */
export function useThemeTokens() {
  const {
    colors,
    tokens,
    scheme,
    accentColorId,
    customAccent,
    colorMode,
    isReady,
    setColorMode,
    setAccentColor,
    setCustomAccent,
  } = useTheme();

  return {
    colors,
    tokens,
    scheme,
    accentColorId,
    customAccent,
    colorMode,
    isReady,
    setColorMode,
    setAccentColor,
    setCustomAccent,
  };
}
