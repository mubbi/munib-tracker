import { useSyncExternalStore } from "react";

import { peekBootScheme } from "@/lib/boot/cold-start";

/**
 * Sync mirror of MunibThemeProvider's resolved scheme for surfaces that cannot
 * call `useTheme` (e.g. Expo Router's Suspense fallback, which must stay light
 * and must not throw outside/before the provider).
 *
 * Client modules seed from persisted color mode so full-refresh loaders match
 * light theme before ThemeProvider finishes async hydration. SSR stays dark
 * (app default) to avoid Appearance/hydration mismatches.
 */
type Scheme = "light" | "dark";

function readInitialScheme(): Scheme {
  if (typeof window === "undefined") return "dark";
  return peekBootScheme();
}

let scheme: Scheme = readInitialScheme();
const listeners = new Set<(next: Scheme) => void>();

export function getResolvedThemeScheme(): Scheme {
  return scheme;
}

export function setResolvedThemeScheme(next: Scheme): void {
  if (scheme === next) return;
  scheme = next;
  for (const listener of listeners) listener(next);
}

export function subscribeResolvedThemeScheme(listener: (next: Scheme) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useResolvedThemeScheme(): Scheme {
  return useSyncExternalStore(subscribeResolvedThemeScheme, getResolvedThemeScheme, () => "dark");
}
