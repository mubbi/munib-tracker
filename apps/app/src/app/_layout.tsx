import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
// Web-only focus-visible ring (WCAG 2.4.7). Resolves to a no-op on native.
import "@/styles/focus-visible";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { MiniPlayer } from "@/components/audio/mini-player";
import { ErrorBoundary } from "@/components/error-boundary";
import { OnboardingGate } from "@/components/onboarding-gate";
import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { MiniPlayerInsetProvider } from "@/hooks/use-content-bottom-inset";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppApiProvider>
      <MunibThemeProvider>
        {/* Catches any render error below the theme provider so a thrown screen
            shows a recoverable fallback instead of white-screening the app. */}
        <ErrorBoundary>
          <AppProviders>
            <I18nProvider>
              <AuthProvider>
                <ToastProvider>
                  <InAppNotificationsProvider>
                    <NotificationProvider>
                      <AudioPlayerProvider>
                        <MiniPlayerInsetProvider>
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
                            <Stack.Screen
                              name="(onboarding)/intro"
                              options={{ gestureEnabled: false }}
                            />
                          </Stack>
                          <WebNavigationFocusManager />
                          <WebPwaBootstrap />
                          <OnboardingGate />
                          <MiniPlayer />
                          <AnimatedSplashOverlay />
                        </MiniPlayerInsetProvider>
                      </AudioPlayerProvider>
                    </NotificationProvider>
                  </InAppNotificationsProvider>
                </ToastProvider>
              </AuthProvider>
            </I18nProvider>
          </AppProviders>
        </ErrorBoundary>
      </MunibThemeProvider>
    </AppApiProvider>
  );
}
