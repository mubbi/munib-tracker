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

interface ThemeContextValue {
  colors: ThemeColors;
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

function isColorMode(value: string | null): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
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
      } finally {
        if (mounted) {
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
      const textSurface = scheme === "dark" ? base.card : base.background;
      const accent = ensureContrastAgainst(customAccent, base.background, 3);
      return {
        ...base,
        accent,
        accentForeground: bestForeground(accent),
        accentText: accentOnSurface(accent, textSurface),
      };
    }
    return base;
  }, [accentColorId, colorMode, systemScheme, customAccent, scheme]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  // Override the app-wide native interface style so system chrome — the iOS
  // native tab bar material, native stack transition backgrounds, blur, and
  // system controls — matches the in-app theme. Without this the OS keeps its
  // own appearance ("automatic" in app.json), so the tab bar renders in the
  // wrong scheme and screen pushes flash the default background in dark mode.
  // In "system" mode we clear the override so it tracks the OS again.
  useEffect(() => {
    // `setColorScheme` is native-only; it's absent on react-native-web.
    // "unspecified" clears the override so the app tracks the OS again.
    Appearance.setColorScheme?.(colorMode === "system" ? "unspecified" : colorMode);
  }, [colorMode]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
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
