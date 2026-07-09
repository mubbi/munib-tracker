import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
// Web-only focus-visible ring (WCAG 2.4.7). Resolves to a no-op on native.
import "@/styles/focus-visible";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppStack } from "@/components/app-stack";
import { MiniPlayer } from "@/components/audio/mini-player";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ExternalCommandProcessor } from "@/components/external-command-processor";
import { LocalePathBootstrap } from "@/components/locale-path-bootstrap";
import { WebReminderAdhanBridge } from "@/components/notifications/web-reminder-adhan-bridge";
import { OnboardingGate } from "@/components/onboarding-gate";
import { RtlLayoutBootstrap } from "@/components/rtl-layout-bootstrap";
import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { ShareQrWarmup } from "@/components/share/share-qr-warmup";
import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { PinLockGate, PinLockProvider } from "@/features/pin-lock";
import { MiniPlayerInsetProvider } from "@/hooks/use-content-bottom-inset";
import { ARABIC_FONT_FILES } from "@/lib/arabic-fonts";
import { BENGALI_FONT_FILES } from "@/lib/bengali-fonts";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { BlurTargetProvider } from "@/providers/blur-target-provider";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastHost, ToastProvider } from "@/providers/toast-provider";
import { WebLayoutDirectionBridge } from "@/providers/web-layout-direction";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ ...ARABIC_FONT_FILES, ...BENGALI_FONT_FILES });

  useEffect(() => {
    if (fontError) {
      console.error("[RootLayout] Font load failed — continuing without bundled fonts", fontError);
      void SplashScreen.hideAsync();
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppApiProvider>
        <MunibThemeProvider>
          <WebLayoutDirectionBridge>
            {/* Catches any render error below the theme provider so a thrown screen
            shows a recoverable fallback instead of white-screening the app. */}
            <ErrorBoundary>
              <AppProviders>
                <AuthProvider>
                  <PinLockProvider>
                    <ToastProvider>
                      <ExternalCommandProcessor />
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
                                      <LocalePathBootstrap />
                                      <RtlLayoutBootstrap />
                                      <WebPwaBootstrap />
                                      <OnboardingGate />
                                      <PinLockGate />
                                      <MiniPlayer />
                                      {/* Outside BlurTargetView so Android can
                                        capture a real backdrop blur (same as
                                        mini-player / sheets). */}
                                      <ToastHost />
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
                  </PinLockProvider>
                </AuthProvider>
              </AppProviders>
            </ErrorBoundary>
          </WebLayoutDirectionBridge>
        </MunibThemeProvider>
      </AppApiProvider>
    </SafeAreaProvider>
  );
}
