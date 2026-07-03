import { accentColorIds, defaultAccentColorId } from "@munib-tracker/theme/accents";
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
import { useColorScheme } from "react-native";

import { normalizeHex, readableForeground } from "@/lib/color";

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

function isAccentColorId(value: string | null): value is AccentColorId {
  return value !== null && accentColorIds.includes(value as AccentColorId);
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

        if (isAccentColorId(storedAccent)) {
          setAccentColorIdState(storedAccent);
        }

        if (storedCustom && normalizeHex(storedCustom)) {
          setCustomAccentState(normalizeHex(storedCustom));
        }
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
      return { ...base, accent: customAccent, accentForeground: readableForeground(customAccent) };
    }
    return base;
  }, [accentColorId, colorMode, systemScheme, customAccent]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    void AsyncStorage.setItem(STORAGE_KEYS.colorMode, mode);
  }, []);

  const setAccentColor = useCallback((accentId: AccentColorId) => {
    setAccentColorIdState(accentId);
    // Choosing a preset clears any custom accent.
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
