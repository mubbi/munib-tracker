import { useMemo } from "react";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { NativeFocusTheme } from "@/lib/focus-lock/native";

/**
 * Colours handed to the native shield / overlay (NF-3.13) — one mapping for
 * the root host and the setup test window. Stable while the palette is.
 */
export function useNativeFocusTheme(): NativeFocusTheme {
  const { colors } = useThemeTokens();
  const { accent, accentForeground, background, foreground, mutedForeground } = colors;
  return useMemo(
    () => ({ accent, accentForeground, background, foreground, muted: mutedForeground }),
    [accent, accentForeground, background, foreground, mutedForeground],
  );
}
