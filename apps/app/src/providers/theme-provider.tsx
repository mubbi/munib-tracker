import { defaultAccentColorId, resolveAccentColorId } from "@munib-tracker/theme/accents";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import type { AccentColorId, ColorMode, ThemeColors } from "@munib-tracker/theme/types";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Appearance, AppState, Platform, useColorScheme } from "react-native";

import {
  DEFAULT_COLOR_MODE,
  isExistingInstall,
  LEGACY_COLOR_MODE,
  peekExistingInstallSignals,
  peekStoredColorMode,
  resolveInitialColorMode,
} from "@/lib/boot/cold-start";
import {
  getResolvedAccent,
  resolveCustomAccentTheme,
  setResolvedAccent,
} from "@/lib/boot/resolved-accent";
import { normalizeHex } from "@/lib/color";
import { syncDocumentThemeColor } from "@/lib/pwa/theme-color";
import { setResolvedThemeScheme } from "@/lib/resolved-theme-scheme";
import { CUSTOM_ACCENT_KEY } from "@/lib/theme-storage-keys";
import { computeThemeTokens, type ThemeTokens } from "@/lib/theme-tokens";
import { preferencesStore } from "@/stores/preferences-store";
import { themeCssVariables } from "@/styles/theme-css-variables";

interface ThemeContextValue {
  colors: ThemeColors;
  tokens: ThemeTokens;
  colorMode: ColorMode;
  /** The resolved scheme after applying `colorMode` + system preference. */
  scheme: "light" | "dark";
  accentColorId: AccentColorId;
  /** Custom accent hex overriding the preset, or null. */
  customAccent: string | null;
  isReady: boolean;
  setColorMode: (mode: ColorMode) => void;
  setAccentColor: (accentId: AccentColorId) => void;
  setCustomAccent: (hex: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** D-UX2: fresh installs follow the OS; see `resolveInitialColorMode` for existing users. */
const defaultColorMode: ColorMode = DEFAULT_COLOR_MODE;
const STARTUP_HYDRATION_TIMEOUT_MS = 5000;

function isColorMode(value: string | null | undefined): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

/** Keep native Appearance in lockstep with the in-app color mode (tab bar, blur, StatusBar). */
function syncNativeColorScheme(mode: ColorMode) {
  // `setColorScheme` is native-only; it's absent on react-native-web.
  // "auto" clears the override so the app tracks the OS again ("unspecified" is
  // deprecated since React Native 0.88).
  Appearance.setColorScheme?.(mode === "system" ? "auto" : mode);
}

/**
 * Schedule native Appearance after the current paint so the JS theme commit
 * and Blur/Liquid Glass updates are not fighting Appearance listeners in the
 * same turn. Still runs within a frame — far sooner than idle deferral, which
 * previously left NativeTabs / StatusBar on the old scheme.
 */
function scheduleNativeColorScheme(
  mode: ColorMode,
  cancelRef: { current: ReturnType<typeof requestAnimationFrame> | null },
) {
  if (cancelRef.current != null) {
    cancelAnimationFrame(cancelRef.current);
  }
  cancelRef.current = requestAnimationFrame(() => {
    cancelRef.current = null;
    syncNativeColorScheme(mode);
  });
}

function persistThemeLocally(
  mode: ColorMode,
  accentId: AccentColorId,
  custom: string | null,
): void {
  void AsyncStorage.setItem(STORAGE_KEYS.colorMode, mode);
  void AsyncStorage.setItem(STORAGE_KEYS.accent, accentId);
  if (custom) void AsyncStorage.setItem(CUSTOM_ACCENT_KEY, custom);
  else void AsyncStorage.removeItem(CUSTOM_ACCENT_KEY);
}

/** Push appearance into the cloud-synced preferences blob (signed-in users). */
function persistThemeToPreferences(
  mode: ColorMode,
  accentId: AccentColorId,
  custom: string | null,
): void {
  void preferencesStore.getState().update({
    colorMode: mode,
    accentColorId: accentId,
    // Empty string clears a prior custom accent on other devices (JSON omits
    // `undefined`, which would leave the remote value untouched on merge).
    customAccent: custom ?? "",
  });
}

export function MunibThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultColorMode);
  // Seeded from the sync accent mirror (web: persisted accent) until hydration.
  const [accentColorId, setAccentColorIdState] = useState<AccentColorId>(
    () => getResolvedAccent().accentColorId,
  );
  const [customAccent, setCustomAccentState] = useState<string | null>(
    () => getResolvedAccent().customAccent,
  );
  const [isReady, setIsReady] = useState(false);
  const appearanceFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  // Apply persisted web color mode before first paint so splash / Suspense loaders
  // match light theme on full refresh (avoids waiting on AsyncStorage Promise).
  // A pre-D-UX2 web install with no stored mode keeps its legacy dark default.
  useLayoutEffect(() => {
    const peeked =
      peekStoredColorMode() ??
      (isExistingInstall(peekExistingInstallSignals()) ? LEGACY_COLOR_MODE : null);
    if (peeked) {
      setColorModeState(peeked);
      syncNativeColorScheme(peeked);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const hydrationTimeout = setTimeout(() => {
      if (!mounted) return;
      setIsReady(true);
      void SplashScreen.hideAsync();
    }, STARTUP_HYDRATION_TIMEOUT_MS);

    async function loadPreferences() {
      try {
        const [storedMode, storedAccent, storedCustom] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.colorMode),
          AsyncStorage.getItem(STORAGE_KEYS.accent),
          AsyncStorage.getItem(CUSTOM_ACCENT_KEY),
        ]);

        // Hydrate prefs (locale + synced appearance) before the first screen paints.
        await preferencesStore.getState().load();
        if (!mounted) return;

        const prefs = preferencesStore.getState().prefs;
        const modeFromPrefs = isColorMode(prefs.colorMode) ? prefs.colorMode : null;
        const accentFromPrefs = resolveAccentColorId(prefs.accentColorId ?? null);
        const customFromPrefs =
          prefs.customAccent && normalizeHex(prefs.customAccent)
            ? normalizeHex(prefs.customAccent)
            : null;

        // D-UX2: no stored mode anywhere → existing users (onboarded / an accent
        // on record) keep the pre-D-UX2 dark default, written back below so it
        // becomes their explicit choice; fresh installs follow the system.
        const mode =
          modeFromPrefs ??
          resolveInitialColorMode(storedMode, {
            hasCompletedOnboarding: prefs.hasCompletedOnboarding,
            storedAccent: storedAccent ?? prefs.accentColorId ?? null,
            storedCustomAccent: storedCustom ?? (prefs.customAccent || null),
          });
        // A fresh install has nothing to migrate: skip stamping the synced blob
        // so its defaults never last-write-win over an account's cloud theme.
        const hasStoredTheme =
          modeFromPrefs != null ||
          storedMode != null ||
          storedAccent != null ||
          storedCustom != null ||
          prefs.accentColorId != null ||
          Boolean(prefs.customAccent);
        const accent =
          accentFromPrefs ?? resolveAccentColorId(storedAccent) ?? defaultAccentColorId;
        const custom =
          customFromPrefs ??
          (storedCustom && normalizeHex(storedCustom) ? normalizeHex(storedCustom) : null);

        setColorModeState(mode);
        setAccentColorIdState(accent);
        setCustomAccentState(custom);
        syncNativeColorScheme(mode);
        persistThemeLocally(mode, accent, custom);

        // One-time migrate legacy AsyncStorage-only theme into the synced prefs blob.
        if (
          (hasStoredTheme || mode !== defaultColorMode) &&
          (prefs.colorMode !== mode ||
            prefs.accentColorId !== accent ||
            (prefs.customAccent || "") !== (custom ?? ""))
        ) {
          await preferencesStore.getState().update({
            colorMode: mode,
            accentColorId: accent,
            customAccent: custom ?? "",
          });
        }
      } finally {
        clearTimeout(hydrationTimeout);
        if (mounted) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    void loadPreferences();

    return () => {
      mounted = false;
      clearTimeout(hydrationTimeout);
      if (appearanceFrameRef.current != null) {
        cancelAnimationFrame(appearanceFrameRef.current);
        appearanceFrameRef.current = null;
      }
    };
  }, []);

  // Apply appearance pulled via cloud sync (preferences blob).
  useEffect(() => {
    return preferencesStore.subscribe(() => {
      const prefs = preferencesStore.getState().prefs;
      if (isColorMode(prefs.colorMode)) {
        setColorModeState((prev) => {
          if (prev === prefs.colorMode) return prev;
          scheduleNativeColorScheme(prefs.colorMode as ColorMode, appearanceFrameRef);
          void AsyncStorage.setItem(STORAGE_KEYS.colorMode, prefs.colorMode as ColorMode);
          return prefs.colorMode as ColorMode;
        });
      }
      const accent = resolveAccentColorId(prefs.accentColorId ?? null);
      if (accent) {
        setAccentColorIdState((prev) => {
          if (prev === accent) return prev;
          void AsyncStorage.setItem(STORAGE_KEYS.accent, accent);
          return accent;
        });
      }
      const custom =
        prefs.customAccent && normalizeHex(prefs.customAccent)
          ? normalizeHex(prefs.customAccent)
          : null;
      setCustomAccentState((prev) => {
        if (prev === custom) return prev;
        if (custom) void AsyncStorage.setItem(CUSTOM_ACCENT_KEY, custom);
        else void AsyncStorage.removeItem(CUSTOM_ACCENT_KEY);
        return custom;
      });
    });
  }, []);

  const scheme: "light" | "dark" = useMemo(() => {
    if (colorMode === "system") {
      return systemScheme === "dark" ? "dark" : "light";
    }
    return colorMode;
  }, [colorMode, systemScheme]);

  // Keep SuspenseFallback / other non-hook readers in lockstep with app theme
  // (Appearance.setColorScheme is native-only, so OS Appearance alone is wrong on web).
  useLayoutEffect(() => {
    setResolvedThemeScheme(scheme);
  }, [scheme]);

  // Same for the accent, so the Suspense fallback wears the user's accent.
  useLayoutEffect(() => {
    setResolvedAccent(accentColorId, customAccent);
  }, [accentColorId, customAccent]);

  const colors = useMemo(() => {
    const base = resolveTheme(
      colorMode,
      systemScheme === "dark" ? "dark" : systemScheme === "light" ? "light" : null,
      accentColorId,
    );
    if (customAccent) {
      return resolveCustomAccentTheme(base, scheme, customAccent);
    }
    return base;
  }, [accentColorId, colorMode, systemScheme, customAccent, scheme]);

  const tokens = useMemo(() => computeThemeTokens(colors, scheme), [colors, scheme]);

  // Web: theme the document-level CSS (the single `:focus-visible` ring in
  // `+html.tsx`) so it follows light/dark + accent changes.
  useLayoutEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(themeCssVariables(colors, tokens))) {
      style.setProperty(name, value);
    }
    // Browser toolbar / installed-app title bar follow the in-app theme.
    syncDocumentThemeColor(colors.background);
  }, [colors, tokens]);

  // Root window / activity background. Skip while inactive/background so we do
  // not sync-block the main thread via ExpoSystemUI during AVPlayer background
  // assertion acquisition (TestFlight: RUNNINGBOARD 0xd00d2bad on notif cold start).
  useEffect(() => {
    const apply = () => {
      if (AppState.currentState !== "active") return;
      void SystemUI.setBackgroundColorAsync(colors.background);
    };
    apply();
    const sub = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        void SystemUI.setBackgroundColorAsync(colors.background);
      }
    });
    return () => sub.remove();
  }, [colors.background]);

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setColorModeState(mode);
      scheduleNativeColorScheme(mode, appearanceFrameRef);
      persistThemeLocally(mode, accentColorId, customAccent);
      persistThemeToPreferences(mode, accentColorId, customAccent);
    },
    [accentColorId, customAccent],
  );

  const setAccentColor = useCallback(
    (accentId: AccentColorId) => {
      setAccentColorIdState(accentId);
      setCustomAccentState(null);
      persistThemeLocally(colorMode, accentId, null);
      persistThemeToPreferences(colorMode, accentId, null);
    },
    [colorMode],
  );

  const setCustomAccent = useCallback(
    (hex: string | null) => {
      const normalized = hex ? normalizeHex(hex) : null;
      setCustomAccentState(normalized);
      persistThemeLocally(colorMode, accentColorId, normalized);
      persistThemeToPreferences(colorMode, accentColorId, normalized);
    },
    [accentColorId, colorMode],
  );

  const value = useMemo(
    () => ({
      colors,
      tokens,
      colorMode,
      scheme,
      accentColorId,
      customAccent,
      isReady,
      setColorMode,
      setAccentColor,
      setCustomAccent,
    }),
    [
      accentColorId,
      customAccent,
      colorMode,
      colors,
      isReady,
      scheme,
      setAccentColor,
      setColorMode,
      setCustomAccent,
      tokens,
    ],
  );

  // Paint immediately with defaults — hydrate prefs/locale in the background so
  // cold start is not gated on AsyncStorage + catalog load (splash still hides
  // once the first paint path completes, with a timeout fallback).
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Renders `children` with the dark palette (same accent / custom accent),
 * whatever the app's colour mode — for surfaces that must stay dark, like the
 * tasbeeh Focus / Night screen. A dark app passes its own theme through.
 */
export function DarkThemeScope({ children }: { children: ReactNode }) {
  const parent = useTheme();
  const value = useMemo<ThemeContextValue>(() => {
    if (parent.scheme === "dark") return parent;
    const base = resolveTheme("dark", "dark", parent.accentColorId);
    const colors = parent.customAccent
      ? resolveCustomAccentTheme(base, "dark", parent.customAccent)
      : base;
    return { ...parent, colors, tokens: computeThemeTokens(colors, "dark"), scheme: "dark" };
  }, [parent]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within MunibThemeProvider");
  }

  return context;
}
