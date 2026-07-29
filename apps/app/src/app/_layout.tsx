import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { lazy, Suspense, useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
// Web-only focus-visible ring (WCAG 2.4.7). Resolves to a no-op on native.
import "@/styles/focus-visible";
import { setAppVersionInfo } from "@munib-tracker/api-client";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppStack } from "@/components/app-stack";
import { AppVersionGate } from "@/components/app-update/app-version-gate";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { ErrorFallback } from "@/components/error-boundary";
import { ExternalCommandProcessor } from "@/components/external-command-processor";
import { IdleMount } from "@/components/idle-mount";
import { LocalePathBootstrap } from "@/components/locale-path-bootstrap";
import { OnboardingGate } from "@/components/onboarding-gate";
import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { RtlLayoutBootstrap } from "@/components/rtl-layout-bootstrap";
import { TvRemoteBridge } from "@/components/tv/tv-remote-bridge";
import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { PinLockGate, PinLockProvider } from "@/features/pin-lock";
import { ReviewDeepLinkBridge } from "@/features/reviews/components/ReviewDeepLinkBridge";
import { ReviewEngagementProvider } from "@/features/reviews/context/ReviewEngagementProvider";
import { ReviewPromptProvider } from "@/features/reviews/context/ReviewPromptContext";
import { MiniPlayerInsetProvider } from "@/hooks/use-content-bottom-inset";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { BENGALI_FONT_FILES } from "@/lib/bengali-fonts";
import { isTV } from "@/lib/platform/is-tv";
import { DEFAULT_ARABIC_FONT_ID } from "@/lib/reading-typography";
import { Sentry } from "@/lib/sentry";
import { AppApiProvider } from "@/providers/api-provider";
import { AppProviders } from "@/providers/app-providers";
import { AppVersionProvider } from "@/providers/app-version-provider";
import { useAudioPlayerContext } from "@/providers/audio-player-context";
import { AudioPlayerProvider } from "@/providers/audio-player-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { BlurTargetProvider } from "@/providers/blur-target-provider";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastHost, ToastProvider } from "@/providers/toast-provider";
import { WebLayoutDirectionBridge } from "@/providers/web-layout-direction";
import { preferencesStore } from "@/stores/preferences-store";

const MiniPlayer = lazy(() =>
  import("@/components/audio/mini-player").then((mod) => ({ default: mod.MiniPlayer })),
);
const ShareQrWarmup = lazy(() =>
  import("@/components/share/share-qr-warmup").then((mod) => ({ default: mod.ShareQrWarmup })),
);
const WebReminderAdhanBridge = lazy(() =>
  import("@/components/notifications/web-reminder-adhan-bridge").then((mod) => ({
    default: mod.WebReminderAdhanBridge,
  })),
);

/**
 * Phone/web: idle-mount the mini-player after first paint.
 * TV: wait until a track is queued — the ~2900-module player chunk OOMs ~1GB Leanback AVDs
 * when loaded alongside home-below-fold on cold start.
 */
function DeferredMiniPlayer() {
  const tv = isTV();
  const { current } = useAudioPlayerContext();
  const [armed, setArmed] = useState(!tv);

  useEffect(() => {
    if (!tv || !current) return;
    setArmed(true);
  }, [tv, current]);

  if (!armed) return null;

  return (
    <IdleMount>
      <Suspense fallback={null}>
        <MiniPlayer />
      </Suspense>
    </IdleMount>
  );
}
setAppVersionInfo(resolveAppVersion(), resolveAppPlatform());

SplashScreen.preventAutoHideAsync();

/**
 * Optional scripture/UI typefaces — loaded after first paint so splash is not
 * gated on ~1.5 MB of Arabic + Bengali TTFs. Arabic picker faces load from
 * Settings → Fonts; Bengali OFL face warms here for locale `bn`.
 *
 * Do not block the root tree on `useFonts` — on Android TV / slow emulators an
 * empty `useFonts({})` can leave `ready=false` indefinitely, which stuck the
 * native splash forever (Dev Client gear visible, no intro).
 */
function useDeferredReadingFonts() {
  useFonts({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const Font = await import("expo-font");
        if (cancelled) return;
        const family = preferencesStore.getState().prefs.fontPrefs.arabic.family;
        const files: Record<string, unknown> = { ...BENGALI_FONT_FILES };
        // Dynamic import keeps all Arabic TTFs out of the root layout graph until needed.
        if (family && family !== DEFAULT_ARABIC_FONT_ID) {
          const { ARABIC_FONT_FILES } = await import("@/lib/arabic-font-files");
          if (family in ARABIC_FONT_FILES) {
            files[family] = ARABIC_FONT_FILES[family as keyof typeof ARABIC_FONT_FILES];
          }
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
}

function RootLayout() {
  useDeferredReadingFonts();

  return (
    <GestureHandlerRootView style={styles.root}>
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
                                      {Platform.OS === "web" ? (
                                        <IdleMount>
                                          <Suspense fallback={null}>
                                            <WebReminderAdhanBridge />
                                            <ShareQrWarmup />
                                          </Suspense>
                                        </IdleMount>
                                      ) : null}
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
                                                <DeferredMiniPlayer />
                                                <TvRemoteBridge />
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default Sentry.wrap(RootLayout);
