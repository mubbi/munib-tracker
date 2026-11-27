import { defaultAccentColorId, resolveAccentColorId } from "@munib-tracker/theme/accents";
import { accentOnSurface, bestForeground, ensureReadableAccent } from "@munib-tracker/theme/color";
import type { AccentColorId, ThemeColors } from "@munib-tracker/theme/types";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { useSyncExternalStore } from "react";

import { normalizeHex } from "@/lib/color";
import { CUSTOM_ACCENT_KEY } from "@/lib/theme-storage-keys";

/** Cache custom-accent overrides so light/dark toggles reuse stable object references. */
const customAccentThemeCache = new Map<string, ThemeColors>();

/**
 * Applies a user's custom accent hex over a `resolveTheme()` base palette
 * (contrast-guarded against the page background). Shared by
 * MunibThemeProvider and the provider-less Suspense fallback.
 */
export function resolveCustomAccentTheme(
  base: ThemeColors,
  scheme: "light" | "dark",
  customAccent: string,
): ThemeColors {
  const key = `${scheme}:${customAccent}`;
  let cached = customAccentThemeCache.get(key);
  if (!cached) {
    const textSurface = scheme === "dark" ? base.card : base.background;
    // Lightness-only rescue (same hue + saturation) against page and card, so a
    // deep custom accent stays recognisable instead of greying out. The stored
    // hex is untouched; the accent editor notes the adjustment.
    const accent = ensureReadableAccent(customAccent, [base.background, base.card], 3);
    cached = {
      ...base,
      accent,
      accentForeground: bestForeground(accent),
      accentText: accentOnSurface(accent, textSurface),
    };
    customAccentThemeCache.set(key, cached);
  }
  return cached;
}

/**
 * Sync mirror of MunibThemeProvider's accent (preset + optional custom hex) for
 * surfaces that cannot call `useTheme` — e.g. Expo Router's Suspense fallback,
 * which can render outside / before the provider. The scheme half lives in
 * `@/lib/resolved-theme-scheme`.
 *
 * Web seeds from the persisted device mirror (`localStorage`) so a full-refresh
 * loader already wears the user's accent; native starts on the default preset
 * until the provider publishes the hydrated value.
 */
export type ResolvedAccent = {
  accentColorId: AccentColorId;
  customAccent: string | null;
};

const DEFAULT_ACCENT: ResolvedAccent = { accentColorId: defaultAccentColorId, customAccent: null };

/** Sync read of the persisted accent mirror (web only; default elsewhere). */
export function peekStoredAccent(): ResolvedAccent {
  if (typeof localStorage === "undefined") return DEFAULT_ACCENT;
  try {
    const custom = localStorage.getItem(CUSTOM_ACCENT_KEY);
    return {
      accentColorId:
        resolveAccentColorId(localStorage.getItem(STORAGE_KEYS.accent)) ?? defaultAccentColorId,
      customAccent: custom ? normalizeHex(custom) : null,
    };
  } catch {
    return DEFAULT_ACCENT;
  }
}

let current: ResolvedAccent = typeof window === "undefined" ? DEFAULT_ACCENT : peekStoredAccent();
const listeners = new Set<() => void>();

export function getResolvedAccent(): ResolvedAccent {
  return current;
}

export function setResolvedAccent(accentColorId: AccentColorId, customAccent: string | null): void {
  if (current.accentColorId === accentColorId && current.customAccent === customAccent) return;
  current = { accentColorId, customAccent };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): ResolvedAccent {
  return DEFAULT_ACCENT;
}

export function useResolvedAccent(): ResolvedAccent {
  return useSyncExternalStore(subscribe, getResolvedAccent, getServerSnapshot);
}
