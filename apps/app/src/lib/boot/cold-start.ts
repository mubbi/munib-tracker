import { resolveTheme } from "@munib-tracker/theme/resolve";
import type { ColorMode } from "@munib-tracker/theme/types";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { useEffect, useSyncExternalStore } from "react";

import { DB_KEYS } from "@/db/keys";
import { CUSTOM_ACCENT_KEY } from "@/lib/theme-storage-keys";

/**
 * Boot brand colors — the `resolveTheme` light/dark page `background`, shown
 * until the first real destination (intro or home) has painted. Derived (not
 * re-declared) so the boot paint can never drift from the app's first screen.
 * The native splash in `app.json` pins the same two values (see the comment in
 * `packages/theme/src/resolve-theme.ts`).
 */
export const BOOT_BACKGROUND_LIGHT = resolveTheme("light", "light").background;
export const BOOT_BACKGROUND_DARK = resolveTheme("dark", "dark").background;

export function bootBackgroundForScheme(scheme: "light" | "dark"): string {
  return scheme === "light" ? BOOT_BACKGROUND_LIGHT : BOOT_BACKGROUND_DARK;
}

/**
 * D-UX2: fresh installs follow the OS colour scheme. Installs that predate
 * D-UX2 but never stored a colour mode keep the old default ({@link
 * LEGACY_COLOR_MODE}) — see {@link resolveInitialColorMode}.
 */
export const DEFAULT_COLOR_MODE: ColorMode = "system";

/** The colour mode every install used before D-UX2 (dark-first). */
export const LEGACY_COLOR_MODE: ColorMode = "dark";

export function isBootColorMode(value: string | null | undefined): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

/** Signals that this install already holds user data from before D-UX2. */
export type ExistingInstallSignals = {
  /** `UserPreferences.hasCompletedOnboarding` from the preferences blob. */
  hasCompletedOnboarding?: boolean | null;
  /** Raw device-local theme mirror values (any non-null value counts). */
  storedAccent?: string | null;
  storedCustomAccent?: string | null;
};

/**
 * An install is "existing" when the user finished onboarding or ever picked /
 * persisted an accent (the provider wrote accent + mode together, so an accent
 * with no mode is a pre-mirror install). Fresh installs have none of these.
 */
export function isExistingInstall(signals: ExistingInstallSignals): boolean {
  return (
    signals.hasCompletedOnboarding === true ||
    signals.storedAccent != null ||
    signals.storedCustomAccent != null
  );
}

/**
 * The colour mode to use when neither the synced preferences nor the device
 * mirror holds one: existing users keep the pre-D-UX2 dark default (the
 * provider writes it back once, so it becomes an explicit choice); fresh
 * installs follow the system.
 */
export function resolveInitialColorMode(
  stored: string | null | undefined,
  signals: ExistingInstallSignals,
): ColorMode {
  if (isBootColorMode(stored)) return stored;
  return isExistingInstall(signals) ? LEGACY_COLOR_MODE : DEFAULT_COLOR_MODE;
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

/** Sync read of the existing-install signals (web only; empty on native / SSR). */
export function peekExistingInstallSignals(): ExistingInstallSignals {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(DB_KEYS.userPreferences);
    const prefs = raw ? (JSON.parse(raw) as { hasCompletedOnboarding?: unknown } | null) : null;
    return {
      hasCompletedOnboarding: prefs?.hasCompletedOnboarding === true,
      storedAccent: localStorage.getItem(STORAGE_KEYS.accent),
      storedCustomAccent: localStorage.getItem(CUSTOM_ACCENT_KEY),
    };
  } catch {
    return {};
  }
}

export function resolveBootScheme(mode: ColorMode, systemIsDark: boolean): "light" | "dark" {
  if (mode === "system") return systemIsDark ? "dark" : "light";
  return mode;
}

/** Best-effort scheme for first client paint (same default rules as the provider). */
export function peekBootScheme(): "light" | "dark" {
  const mode = peekStoredColorMode() ?? resolveInitialColorMode(null, peekExistingInstallSignals());
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
 * before the JS bundle so a full refresh never flashes the wrong background.
 * Mirrors {@link peekBootScheme}: stored mode → else existing install → dark →
 * else (fresh install, D-UX2) follow `prefers-color-scheme`.
 */
export const BOOT_THEME_SCRIPT = `(function(){try{var ls=localStorage;var mode=ls.getItem(${embedJsString(STORAGE_KEYS.colorMode)});if(mode!=="light"&&mode!=="dark"&&mode!=="system"){var old=ls.getItem(${embedJsString(STORAGE_KEYS.accent)})!=null||ls.getItem(${embedJsString(CUSTOM_ACCENT_KEY)})!=null;if(!old){try{var p=JSON.parse(ls.getItem(${embedJsString(DB_KEYS.userPreferences)})||"null");old=!!p&&p.hasCompletedOnboarding===true;}catch(e){}}mode=old?${embedJsString(LEGACY_COLOR_MODE)}:${embedJsString(DEFAULT_COLOR_MODE)};}var dark=mode==="dark"||(mode==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var bg=dark?${embedJsString(BOOT_BACKGROUND_DARK)}:${embedJsString(BOOT_BACKGROUND_LIGHT)};var s=dark?"dark":"light";document.documentElement.style.backgroundColor=bg;document.documentElement.style.colorScheme=s;if(document.body){document.body.style.backgroundColor=bg;}}catch(e){}})();`;

/**
 * Document CSS for `+html.tsx` — the no-script / storage-blocked fallback for
 * {@link BOOT_THEME_SCRIPT}: light page by default, dark when the OS prefers
 * dark (the D-UX2 fresh-install default). `html` only — `body` stays
 * transparent so the script's inline `html` colour always shows through.
 */
export const BOOT_THEME_CSS = `html{background-color:${BOOT_BACKGROUND_LIGHT};}@media (prefers-color-scheme: dark){html{background-color:${BOOT_BACKGROUND_DARK};}}`;
