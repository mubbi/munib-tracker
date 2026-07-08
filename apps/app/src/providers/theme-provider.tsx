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

function isColorMode(value: string | null): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

/** Keep native Appearance in lockstep with the in-app color mode (tab bar, blur, StatusBar). */
function syncNativeColorScheme(mode: ColorMode) {
  // `setColorScheme` is native-only; it's absent on react-native-web.
  // "unspecified" clears the override so the app tracks the OS again.
  Appearance.setColorScheme?.(mode === "system" ? "unspecified" : mode);
}

export function MunibThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultColorMode);
  const [accentColorId, setAccentColorIdState] = useState<AccentColorId>(defaultAccentColorId);
  const [customAccent, setCustomAccentState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      try {
        const [storedMode, storedAccent, storedCustom] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.colorMode),
          AsyncStorage.getItem(STORAGE_KEYS.accent),
          AsyncStorage.getItem(CUSTOM_ACCENT_KEY),
        ]);

        if (!mounted) {
          return;
        }

        if (isColorMode(storedMode)) {
          setColorModeState(storedMode);
          syncNativeColorScheme(storedMode);
        } else {
          syncNativeColorScheme(defaultColorMode);
        }

        const resolvedAccent = resolveAccentColorId(storedAccent);
        if (resolvedAccent) {
          setAccentColorIdState(resolvedAccent);
          if (storedAccent !== resolvedAccent) {
            void AsyncStorage.setItem(STORAGE_KEYS.accent, resolvedAccent);
          }
        }

        if (storedCustom && normalizeHex(storedCustom)) {
          setCustomAccentState(normalizeHex(storedCustom));
        }

        // Drop legacy seasonal-theme preference (banners are now automatic).
        void AsyncStorage.removeItem("@munib-tracker/seasonal-theme");

        // Hydrate saved locale + RTL before the first screen paints so users
        // never see English strings in an RTL shell (or vice versa).
        await preferencesStore.getState().load();
      } finally {
        if (mounted && preferencesStore.getState().isReady) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    void loadPreferences();

    return () => {
      mounted = false;
    };
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
  // Appearance must stay synchronous in setColorMode; deferring it left BlurView /
  // NativeTabs / StatusBar on the previous scheme until an idle flush or app refresh.
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    syncNativeColorScheme(mode);
    void AsyncStorage.setItem(STORAGE_KEYS.colorMode, mode);
  }, []);

  const setAccentColor = useCallback((accentId: AccentColorId) => {
    setAccentColorIdState(accentId);
    setCustomAccentState(null);
    void AsyncStorage.setItem(STORAGE_KEYS.accent, accentId);
    void AsyncStorage.removeItem(CUSTOM_ACCENT_KEY);
  }, []);

  const setCustomAccent = useCallback((hex: string | null) => {
    const normalized = hex ? normalizeHex(hex) : null;
    setCustomAccentState(normalized);
    if (normalized) void AsyncStorage.setItem(CUSTOM_ACCENT_KEY, normalized);
    else void AsyncStorage.removeItem(CUSTOM_ACCENT_KEY);
  }, []);

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

  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within MunibThemeProvider");
  }

  return context;
}
