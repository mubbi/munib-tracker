import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  type ColorSchemeName,
  I18nManager,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Fonts, MaxContentWidth, Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import i18n from "@/i18n";

export type SuspenseFallbackProps = {
  /** Route module context key (e.g. `./(tabs)/library.tsx`). */
  route: string;
  params: Record<string, string | string[]>;
};

/**
 * Default forest accent from `@munib-tracker/theme` — safe when MunibThemeProvider
 * is not mounted yet. Matches `accentColors.forest`.
 */
const ACCENT_LIGHT = "#2E7D32";
const ACCENT_DARK = "#66BB6A";

/**
 * Estimated floating header band (safe area + title row), matching
 * `ScreenLayout`'s pre-measure fallback — used when we omit chrome (tab roots).
 */
const HEADER_BAND = 60;

/**
 * Content-area placeholder while Expo Router async-route chunks bundle/load.
 * Parent layouts (tabs, stack) stay mounted; only this route slot suspends.
 *
 * The root is transparent so the previous screen can remain visible under the
 * stack card (see `AppStack` `contentStyle`). A compact elevated card sits in
 * the body — not a full-bleed blank page. Nested routes keep a slim back control.
 * No skeleton placeholders. Avoids Reanimated / `useTheme` / `useTranslation`.
 */
export function SuspenseFallback({ route }: SuspenseFallbackProps) {
  const scheme = useColorSchemeSafe();
  const palette = scheme === "dark" ? darkPalette : lightPalette;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const title = i18n.t("common.loadingRoute");
  const hint = i18n.t("common.loadingRouteHint");
  const showBack = offersBack(route) && router.canDismiss();

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={title}
      accessibilityLiveRegion="polite"
    >
      {showBack ? (
        <View
          style={[
            styles.chrome,
            {
              paddingTop: insets.top + Spacing.two,
            },
          ]}
        >
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={i18n.t("common.goBack")}
            hitSlop={8}
            haptic="light"
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: palette.accentSoft }]}
          >
            <SymbolView name={backChevron()} size={19} tintColor={palette.accent} />
          </PressableScale>
        </View>
      ) : null}

      <View
        style={[styles.body, !showBack && { paddingTop: insets.top + HEADER_BAND + Spacing.five }]}
      >
        <View
          style={[
            styles.status,
            {
              backgroundColor: palette.card,
              borderColor: palette.hairline,
            },
          ]}
        >
          <View style={[styles.well, { backgroundColor: palette.accentSoft }]}>
            <ActivityIndicator color={palette.accent} />
          </View>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: palette.foreground, fontFamily: Fonts.sans }]}>
              {title}
            </Text>
            <Text style={[styles.hint, { color: palette.mutedForeground, fontFamily: Fonts.sans }]}>
              {hint}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Tab roots and gate screens have no stack to pop while their chunk loads. */
function offersBack(route: string): boolean {
  const key = route.replace(/^\.\//, "");
  if (key.startsWith("(tabs)")) return false;
  if (key.startsWith("(auth)")) return false;
  if (key.startsWith("(onboarding)")) return false;
  if (key.startsWith("oauth")) return false;
  if (key.startsWith("+") || key === "_sitemap") return false;
  return true;
}

function backChevron(): SymbolViewProps["name"] {
  return I18nManager.isRTL
    ? { ios: "chevron.right", android: "arrow_forward", web: "arrow_forward" }
    : { ios: "chevron.left", android: "arrow_back", web: "arrow_back" };
}

/**
 * Pin the first paint to the app default (`dark`) so static HTML matches
 * hydration. Reading `Appearance` during render differs between SSG (often
 * `null` → would have been light) and a dark-mode browser → React #418.
 */
function useColorSchemeSafe(): "light" | "dark" {
  const [scheme, setScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const sync = (colorScheme: ColorSchemeName | null | undefined) => {
      setScheme(colorScheme === "dark" ? "dark" : "light");
    };
    sync(Appearance.getColorScheme());
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      sync(colorScheme);
    });
    return () => sub.remove();
  }, []);

  return scheme;
}

/** Mirrors `resolveTheme` light base + `computeThemeTokens` soft/hairline. */
const lightPalette = {
  card: "#FFFCF7",
  foreground: "#152921",
  mutedForeground: "#5C7268",
  hairline: withAlpha("#152921", 0.08),
  accent: ACCENT_LIGHT,
  accentSoft: withAlpha(ACCENT_LIGHT, 0.14),
};

/** Mirrors `resolveTheme` dark base + `computeThemeTokens` soft/hairline. */
const darkPalette = {
  card: "#1C322C",
  foreground: "#E8DCC8",
  mutedForeground: "#8BA89A",
  hairline: withAlpha("#E8DCC8", 0.1),
  accent: ACCENT_DARK,
  accentSoft: withAlpha(ACCENT_DARK, 0.24),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  chrome: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  status: {
    width: "100%",
    maxWidth: Math.min(MaxContentWidth, 420),
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    // Match elevated `Card` so the chip reads as an app surface, not a toast.
    ...Shadows.sm,
  },
  well: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
  // Mirrors ThemedText `smallBold` / `caption`.
  title: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
});
