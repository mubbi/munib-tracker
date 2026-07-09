import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
// Web-only focus-visible ring (WCAG 2.4.7). Resolves to a no-op on native.
import "@/styles/focus-visible";
import { setAppVersionInfo } from "@munib-tracker/api-client";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppStack } from "@/components/app-stack";
import { AppVersionGate } from "@/components/app-update/app-version-gate";
import { MiniPlayer } from "@/components/audio/mini-player";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { ErrorFallback } from "@/components/error-boundary";
import { ExternalCommandProcessor } from "@/components/external-command-processor";
import { LocalePathBootstrap } from "@/components/locale-path-bootstrap";
import { WebReminderAdhanBridge } from "@/components/notifications/web-reminder-adhan-bridge";
import { OnboardingGate } from "@/components/onboarding-gate";
import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { RtlLayoutBootstrap } from "@/components/rtl-layout-bootstrap";
import { ShareQrWarmup } from "@/components/share/share-qr-warmup";
import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { PinLockGate, PinLockProvider } from "@/features/pin-lock";
import { ReviewDeepLinkBridge } from "@/features/reviews/components/ReviewDeepLinkBridge";
import { ReviewEngagementProvider } from "@/features/reviews/context/ReviewEngagementProvider";
import { ReviewPromptProvider } from "@/features/reviews/context/ReviewPromptContext";
import { MiniPlayerInsetProvider } from "@/hooks/use-content-bottom-inset";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { ARABIC_FONT_FILES } from "@/lib/arabic-fonts";
import { BENGALI_FONT_FILES } from "@/lib/bengali-fonts";
import { Sentry } from "@/lib/sentry";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AppVersionProvider } from "@/providers/app-version-provider";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { BlurTargetProvider } from "@/providers/blur-target-provider";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastHost, ToastProvider } from "@/providers/toast-provider";
import { WebLayoutDirectionBridge } from "@/providers/web-layout-direction";

setAppVersionInfo(resolveAppVersion(), resolveAppPlatform());

SplashScreen.preventAutoHideAsync();

function RootLayout() {
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
            {/* Catches render, global JS, and unhandled promise errors; reports to Sentry. */}
            <Sentry.GlobalErrorBoundary
              includeUnhandledRejections
              fallback={({ resetError }) => <ErrorFallback onReset={resetError} />}
            >
              <AppProviders>
                <AuthProvider>
                  <AppVersionProvider>
                    <PinLockProvider>
                      <ToastProvider>
                        <ExternalCommandProcessor />
                        <ReviewEngagementProvider>
                          <ReviewPromptProvider>
                            <ReviewDeepLinkBridge />
                            <ContentReportProvider>
                              <InAppNotificationsProvider>
                                <NotificationProvider>
                                  <AudioPlayerProvider>
                                    <WebReminderAdhanBridge />
                                    <ShareQrWarmup />
                                    <MiniPlayerInsetProvider>
                                      <AppVersionGate>
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
                                      </AppVersionGate>
                                    </MiniPlayerInsetProvider>
                                  </AudioPlayerProvider>
                                </NotificationProvider>
                              </InAppNotificationsProvider>
                            </ContentReportProvider>
                          </ReviewPromptProvider>
                        </ReviewEngagementProvider>
                      </ToastProvider>
                    </PinLockProvider>
                  </AppVersionProvider>
                </AuthProvider>
              </AppProviders>
            </Sentry.GlobalErrorBoundary>
          </WebLayoutDirectionBridge>
        </MunibThemeProvider>
      </AppApiProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
