import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * The app defaults to a DARK theme (see MunibThemeProvider `defaultColorMode`).
 * Returning "light" before hydration causes a flash of the wrong (light) theme
 * on first paint (FOUC). Return the dark default until the client has hydrated,
 * after which we defer to the real system value.
 */
const DEFAULT_SCHEME = "dark" as const;

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return DEFAULT_SCHEME;
}
