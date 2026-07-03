import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { MiniPlayer } from "@/components/audio/mini-player";
import { OnboardingGate } from "@/components/onboarding-gate";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppApiProvider>
      <MunibThemeProvider>
        <AppProviders>
          <I18nProvider>
            <AuthProvider>
              <NotificationProvider>
                <AudioPlayerProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
                    <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
                  </Stack>
                  <OnboardingGate />
                  <MiniPlayer />
                  <AnimatedSplashOverlay />
                </AudioPlayerProvider>
              </NotificationProvider>
            </AuthProvider>
          </I18nProvider>
        </AppProviders>
      </MunibThemeProvider>
    </AppApiProvider>
  );
}
