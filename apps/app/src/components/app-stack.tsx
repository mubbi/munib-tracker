import { Redirect, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { WebGlobalRail } from "@/components/web/web-global-rail";
import { useWebGlobalRail } from "@/hooks/use-large-screen-layout";
import { createNavigationTheme } from "@/lib/navigation-theme";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { useTheme } from "@/providers/theme-provider";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/**
 * Root stack with a React Navigation theme synced to Munib colors.
 * Screen cards are transparent so async-route Suspense can leave the previous
 * screen visible under a content-area loader; each route paints its own opaque
 * background (ScreenLayout / tab roots) to avoid light/dark flash.
 *
 * Until preferences hydrate, only a boot-colored shell is shown (splash covers
 * it). After hydrate, tabs stay protected for first-time users and we Redirect
 * to intro so home chrome never mounts underneath the splash.
 */
export function AppStack() {
  const { colors, scheme } = useTheme();
  const prefsReady = usePreferencesReady();
  const prefs = usePreferences();

  const navigationTheme = useMemo(() => createNavigationTheme(colors, scheme), [colors, scheme]);
  const { width: windowWidth } = useWindowDimensions();
  const webRail = useWebGlobalRail();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: "transparent" as const },
    }),
    [],
  );

  const showApp = prefs.hasCompletedOnboarding || (Platform.OS === "web" && isIndexingBot());

  if (!prefsReady) {
    return <View style={[styles.bootShell, { backgroundColor: colors.background }]} />;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      {/* Follows resolved scheme so icon contrast updates on every light/dark toggle,
          including screens that leave StatusBar unmanaged or hard-code light icons. */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {!showApp ? <Redirect href="/intro" /> : null}
      {/* Wide web: persistent rail beside the stack so every page keeps primary
          navigation (not just the four tab roots). */}
      <View style={styles.webShell}>
        {webRail.visible && showApp ? <WebGlobalRail windowWidth={windowWidth} /> : null}
        <View style={styles.stackColumn}>
          <Stack screenOptions={screenOptions}>
            <Stack.Protected guard={showApp}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(onboarding)/intro-location" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
          </Stack>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bootShell: {
    flex: 1,
  },
  webShell: {
    flex: 1,
    flexDirection: "row",
  },
  stackColumn: {
    flex: 1,
    minWidth: 0,
  },
});
