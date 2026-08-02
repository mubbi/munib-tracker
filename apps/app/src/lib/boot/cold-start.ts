import type { ColorMode } from "@munib-tracker/theme/types";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Boot brand colors — match `resolveTheme` light/dark `background` until the
 * first real destination (intro or home) has painted.
 */
export const BOOT_BACKGROUND_DARK = "#152921";
export const BOOT_BACKGROUND_LIGHT = "#F5F0E6";

/** Dark boot color — legacy alias (native splash / PWA fallbacks). */
export const BOOT_BACKGROUND = BOOT_BACKGROUND_DARK;

export function bootBackgroundForScheme(scheme: "light" | "dark"): string {
  return scheme === "light" ? BOOT_BACKGROUND_LIGHT : BOOT_BACKGROUND_DARK;
}

export function isBootColorMode(value: string | null | undefined): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Sync read of persisted color mode (web `localStorage` via AsyncStorage keys).
 * Returns null on native / SSR / missing value.
 */
export function peekStoredColorMode(): ColorMode | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.colorMode);
    return isBootColorMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveBootScheme(mode: ColorMode, systemIsDark: boolean): "light" | "dark" {
  if (mode === "system") return systemIsDark ? "dark" : "light";
  return mode;
}

/** Best-effort scheme for first client paint (defaults to app default: dark). */
export function peekBootScheme(): "light" | "dark" {
  const mode = peekStoredColorMode() ?? "dark";
  const systemIsDark =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return resolveBootScheme(mode, systemIsDark);
}

let painted = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return painted;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Call once the first user-facing destination screen has mounted. */
export function markColdStartReady(): void {
  if (painted) return;
  painted = true;
  for (const listener of listeners) {
    listener();
  }
}

export function useColdStartReady(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Marks cold start ready on mount of intro / home (or other first destinations). */
export function useMarkColdStartReady(): void {
  useEffect(() => {
    markColdStartReady();
  }, []);
}

/** Jest-only: reset module state between tests. */
export function __resetColdStartForTests(): void {
  painted = false;
  for (const listener of listeners) {
    listener();
  }
}

/** Embed a string literal in generated JS (JSON.stringify + HTML/JS edge cases). */
function embedJsString(value: string): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Inline script for `+html.tsx` — paints `html`/`body` with the stored scheme
 * before the JS bundle so full refresh does not flash the dark splash color.
 */
export const BOOT_THEME_SCRIPT = `(function(){try{var k=${embedJsString(STORAGE_KEYS.colorMode)};var mode=localStorage.getItem(k);var dark=true;if(mode==="light")dark=false;else if(mode==="system")dark=window.matchMedia("(prefers-color-scheme: dark)").matches;else if(mode==="dark")dark=true;var bg=dark?${embedJsString(BOOT_BACKGROUND_DARK)}:${embedJsString(BOOT_BACKGROUND_LIGHT)};var s=dark?"dark":"light";document.documentElement.style.backgroundColor=bg;document.documentElement.style.colorScheme=s;if(document.body){document.body.style.backgroundColor=bg;}}catch(e){}})();`;
