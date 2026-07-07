import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
// Web-only focus-visible ring (WCAG 2.4.7). Resolves to a no-op on native.
import "@/styles/focus-visible";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppStack } from "@/components/app-stack";
import { MiniPlayer } from "@/components/audio/mini-player";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { WebReminderAdhanBridge } from "@/components/notifications/web-reminder-adhan-bridge";
import { OnboardingGate } from "@/components/onboarding-gate";
import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { ShareQrWarmup } from "@/components/share/share-qr-warmup";
import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { MiniPlayerInsetProvider } from "@/hooks/use-content-bottom-inset";
import { ARABIC_FONT_FILES } from "@/lib/arabic-fonts";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { BlurTargetProvider } from "@/providers/blur-target-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(ARABIC_FONT_FILES);

  if (!fontsLoaded) {
    return null;
  }

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
                  <ContentReportProvider>
                    <InAppNotificationsProvider>
                      <NotificationProvider>
                        <AudioPlayerProvider>
                          <WebReminderAdhanBridge />
                          <ShareQrWarmup />
                          <MiniPlayerInsetProvider>
                            <BlurTargetProvider
                              overlays={
                                <>
                                  <WebNavigationFocusManager />
                                  <WebPwaBootstrap />
                                  <OnboardingGate />
                                  <MiniPlayer />
                                  <AnimatedSplashOverlay />
                                </>
                              }
                            >
                              <AppStack />
                            </BlurTargetProvider>
                          </MiniPlayerInsetProvider>
                        </AudioPlayerProvider>
                      </NotificationProvider>
                    </InAppNotificationsProvider>
                  </ContentReportProvider>
                </ToastProvider>
              </AuthProvider>
            </I18nProvider>
          </AppProviders>
        </ErrorBoundary>
      </MunibThemeProvider>
    </AppApiProvider>
  );
}
