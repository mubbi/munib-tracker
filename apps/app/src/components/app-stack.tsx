import { Redirect, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { BOOT_BACKGROUND } from "@/lib/boot/cold-start";
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

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: "transparent" as const },
    }),
    [],
  );

  const showApp = prefs.hasCompletedOnboarding || (Platform.OS === "web" && isIndexingBot());

  if (!prefsReady) {
    return <View style={styles.bootShell} />;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      {/* Follows resolved scheme so icon contrast updates on every light/dark toggle,
          including screens that leave StatusBar unmanaged or hard-code light icons. */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {!showApp ? <Redirect href="/intro" /> : null}
      <Stack screenOptions={screenOptions}>
        <Stack.Protected guard={showApp}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(onboarding)/intro-location" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bootShell: {
    flex: 1,
    backgroundColor: BOOT_BACKGROUND,
  },
});
