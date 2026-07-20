import { defaultAccentColorId, resolveAccentColorId } from "@munib-tracker/theme/accents";
import { accentOnSurface, bestForeground, ensureContrastAgainst } from "@munib-tracker/theme/color";
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
  useMemo,
  useRef,
  useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";

import { normalizeHex } from "@/lib/color";
import { computeThemeTokens, type ThemeTokens } from "@/lib/theme-tokens";
import { preferencesStore } from "@/stores/preferences-store";

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

const defaultColorMode: ColorMode = "dark";
const CUSTOM_ACCENT_KEY = "@munib-tracker/custom-accent";
const STARTUP_HYDRATION_TIMEOUT_MS = 5000;

/** Cache custom-accent overrides so light/dark toggles reuse stable object references. */
const customAccentThemeCache = new Map<string, ThemeColors>();

function resolveCustomAccentTheme(
  base: ThemeColors,
  scheme: "light" | "dark",
  customAccent: string,
): ThemeColors {
  const key = `${scheme}:${customAccent}`;
  let cached = customAccentThemeCache.get(key);
  if (!cached) {
    const textSurface = scheme === "dark" ? base.card : base.background;
    const accent = ensureContrastAgainst(customAccent, base.background, 3);
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

function isColorMode(value: string | null | undefined): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

/** Keep native Appearance in lockstep with the in-app color mode (tab bar, blur, StatusBar). */
function syncNativeColorScheme(mode: ColorMode) {
  // `setColorScheme` is native-only; it's absent on react-native-web.
  // "unspecified" clears the override so the app tracks the OS again.
  Appearance.setColorScheme?.(mode === "system" ? "unspecified" : mode);
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
  const [accentColorId, setAccentColorIdState] = useState<AccentColorId>(defaultAccentColorId);
  const [customAccent, setCustomAccentState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const appearanceFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

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

        const mode = modeFromPrefs ?? (isColorMode(storedMode) ? storedMode : defaultColorMode);
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
          prefs.colorMode !== mode ||
          prefs.accentColorId !== accent ||
          (prefs.customAccent || "") !== (custom ?? "")
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

  // Root window / activity background — safe to keep in an effect (async native API).
  // Native Appearance is scheduled one frame after mode changes (see setColorMode)
  // so the React theme commit paints before Appearance listeners fire.
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
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

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within MunibThemeProvider");
  }

  return context;
}
