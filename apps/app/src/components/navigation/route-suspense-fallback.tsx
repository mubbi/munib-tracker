import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  type ColorSchemeName,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Spacing } from "@/constants/theme";
import i18n from "@/i18n";

export type SuspenseFallbackProps = {
  /** Route module context key (e.g. `./(tabs)/library.tsx`). */
  route: string;
  params: Record<string, string | string[]>;
};

/** Brand accent from app config — safe when MunibThemeProvider is not mounted yet. */
const ACCENT = "#059669";

/**
 * Content-space placeholder while Expo Router async-route chunks bundle/load.
 * Replaces expo-router's default (tiny "Bundling…" toast in dev, blank in prod)
 * via Metro alias so the chrome stays and the body never feels stuck.
 *
 * Intentionally avoids `useTheme` / `useTranslation` so it still works if the
 * root layout chunk itself is the one suspending (providers not mounted yet).
 */
export function SuspenseFallback(_props: SuspenseFallbackProps) {
  const scheme = useColorSchemeSafe();
  const palette = scheme === "dark" ? darkPalette : lightPalette;
  const title = i18n.t("common.loadingRoute");

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      style={[styles.root, { backgroundColor: palette.background }]}
      accessibilityRole="progressbar"
      accessibilityLabel={title}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.status}>
        <ActivityIndicator color={ACCENT} />
        <Text style={[styles.title, { color: palette.foreground }]}>{title}</Text>
      </View>
    </Animated.View>
  );
}

function useColorSchemeSafe(): "light" | "dark" {
  const [scheme, setScheme] = useState<ColorSchemeName>(() => Appearance.getColorScheme());

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme));
    return () => sub.remove();
  }, []);

  return scheme === "dark" ? "dark" : "light";
}

const lightPalette = {
  background: "#F7F7F4",
  foreground: "#14201B",
};

const darkPalette = {
  background: "#0E1613",
  foreground: "#E8EEEA",
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  status: {
    alignItems: "center",
    gap: Spacing.two,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
