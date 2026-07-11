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
import { IdleMount } from "@/components/idle-mount";
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
import { DEFAULT_ARABIC_FONT_ID } from "@/lib/reading-typography";
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
import { preferencesStore } from "@/stores/preferences-store";

setAppVersionInfo(resolveAppVersion(), resolveAppPlatform());

SplashScreen.preventAutoHideAsync();

/**
 * Optional scripture/UI typefaces — loaded after first paint so splash is not
 * gated on ~1.5 MB of Arabic + Bengali TTFs. Arabic picker faces load from
 * Settings → Fonts; Bengali OFL face warms here for locale `bn`.
 */
function useDeferredReadingFonts() {
  const [ready, error] = useFonts({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const Font = await import("expo-font");
        if (cancelled) return;
        const family = preferencesStore.getState().prefs.fontPrefs.arabic.family;
        const files: Record<string, unknown> = { ...BENGALI_FONT_FILES };
        // Warm only the active Arabic face (system = skip). Full picker set loads in Settings → Fonts.
        if (family && family !== DEFAULT_ARABIC_FONT_ID && family in ARABIC_FONT_FILES) {
          files[family] = ARABIC_FONT_FILES[family as keyof typeof ARABIC_FONT_FILES];
        }
        await Font.loadAsync(files as Parameters<typeof Font.loadAsync>[0]);
      } catch (err) {
        console.error("[RootLayout] Deferred font load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.error("[RootLayout] Font bootstrap failed — continuing", error);
      void SplashScreen.hideAsync();
    }
  }, [error]);

  return ready || Boolean(error);
}

function RootLayout() {
  const fontsReady = useDeferredReadingFonts();

  if (!fontsReady) {
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
                                    <IdleMount>
                                      <WebReminderAdhanBridge />
                                      <ShareQrWarmup />
                                    </IdleMount>
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
                                              <IdleMount>
                                                <MiniPlayer />
                                              </IdleMount>
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
