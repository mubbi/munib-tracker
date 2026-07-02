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

interface ThemeContextValue {
  colors: ThemeColors;
  colorMode: ColorMode;
  accentColorId: AccentColorId;
  isReady: boolean;
  setColorMode: (mode: ColorMode) => void;
  setAccentColor: (accentId: AccentColorId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const defaultColorMode: ColorMode = "dark";

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      try {
        const [storedMode, storedAccent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.colorMode),
          AsyncStorage.getItem(STORAGE_KEYS.accent),
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

  const colors = useMemo(
    () =>
      resolveTheme(
        colorMode,
        systemScheme === "dark" ? "dark" : systemScheme === "light" ? "light" : null,
        accentColorId,
      ),
    [accentColorId, colorMode, systemScheme],
  );

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    void AsyncStorage.setItem(STORAGE_KEYS.colorMode, mode);
  }, []);

  const setAccentColor = useCallback((accentId: AccentColorId) => {
    setAccentColorIdState(accentId);
    void AsyncStorage.setItem(STORAGE_KEYS.accent, accentId);
  }, []);

  const value = useMemo(
    () => ({
      colors,
      colorMode,
      accentColorId,
      isReady,
      setColorMode,
      setAccentColor,
    }),
    [accentColorId, colorMode, colors, isReady, setAccentColor, setColorMode],
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
