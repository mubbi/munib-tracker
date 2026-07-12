import { Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";

import { createNavigationTheme } from "@/lib/navigation-theme";
import { useTheme } from "@/providers/theme-provider";

/**
 * Root stack with a React Navigation theme synced to Munib colors.
 * Screen cards are transparent so async-route Suspense can leave the previous
 * screen visible under a content-area loader; each route paints its own opaque
 * background (ScreenLayout / tab roots) to avoid light/dark flash.
 */
export function AppStack() {
  const { colors, scheme } = useTheme();

  const navigationTheme = useMemo(() => createNavigationTheme(colors, scheme), [colors, scheme]);

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: "transparent" as const },
    }),
    [],
  );

  return (
    <ThemeProvider value={navigationTheme}>
      {/* Follows resolved scheme so icon contrast updates on every light/dark toggle,
          including screens that leave StatusBar unmanaged or hard-code light icons. */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
        <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(onboarding)/intro-location" options={{ gestureEnabled: false }} />
      </Stack>
    </ThemeProvider>
  );
}
