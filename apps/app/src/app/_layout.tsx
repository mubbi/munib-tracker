import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { MunibThemeProvider } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppApiProvider>
      <MunibThemeProvider>
        <AppProviders>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <AnimatedSplashOverlay />
        </AppProviders>
      </MunibThemeProvider>
    </AppApiProvider>
  );
}
