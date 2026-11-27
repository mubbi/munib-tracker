import { useEffect } from "react";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { pronunciationClient } from "@/stores/quran-pronunciation-store";

/** `#RGB` / `#RRGGBB` / `#RRGGBBAA` → `#RRGGBB`, or null for anything else (rgba(), names). */
export function toHex6(color: string | undefined): string | null {
  const raw = color?.trim() ?? "";
  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(raw)) return raw.slice(0, 7).toUpperCase();
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    return `#${raw
      .slice(1)
      .split("")
      .map((c) => c + c)
      .join("")}`.toUpperCase();
  }
  return null;
}

/**
 * Quran Lab SDK 4 presents its own recitation-sharing sheet (D66). Hand it the
 * app's accent and surface colours so it looks like part of the app; the SDK
 * changes colours only, never its words or structure. Applied when the client
 * is next configured (first use in a session).
 */
export function useQuranLabSharingTheme(): void {
  const { colors, scheme } = useThemeTokens();
  useEffect(() => {
    const accent = toHex6(colors.accent);
    const background = toHex6(colors.card) ?? toHex6(colors.background);
    const text = toHex6(colors.foreground);
    const secondaryText = toHex6(colors.mutedForeground);
    pronunciationClient.setSharingTheme(
      accent && background && text && secondaryText
        ? { accent, background, text, secondaryText, dark: scheme === "dark" }
        : null,
    );
  }, [
    colors.accent,
    colors.card,
    colors.background,
    colors.foreground,
    colors.mutedForeground,
    scheme,
  ]);
}
