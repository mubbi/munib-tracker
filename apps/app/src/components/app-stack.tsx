import { Stack, ThemeProvider } from "expo-router";
import { useMemo } from "react";

import { createNavigationTheme } from "@/lib/navigation-theme";
import { useTheme } from "@/providers/theme-provider";

/**
 * Root stack with a React Navigation theme synced to Munib colors.
 * Without this, iOS push/pop animations flash the default light stack background
 * in dark mode before each screen paints.
 */
export function AppStack() {
  const { colors, scheme } = useTheme();

  const navigationTheme = useMemo(() => createNavigationTheme(colors, scheme), [colors, scheme]);

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: colors.background },
    }),
    [colors.background],
  );

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
        <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
      </Stack>
    </ThemeProvider>
  );
}
