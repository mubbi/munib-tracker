import { Redirect, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { type ReactElement, type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { TabletRail } from "@/components/app-tabs-wide";
import { ScreenErrorBoundary } from "@/components/navigation/screen-error-boundary";
import { ScreenLayout } from "@/components/screen-layout";
import { UnavailableOnDevice } from "@/components/ui/unavailable-on-device";
import { WebGlobalRail } from "@/components/web/web-global-rail";
import { useNativeTabletRail, useWebGlobalRail } from "@/hooks/use-large-screen-layout";
import { hiddenFinanceToolForRoute, useDestinationScope } from "@/lib/library-menu";
import { useTrackCurrentPathname } from "@/lib/navigation";
import { createNavigationTheme } from "@/lib/navigation-theme";
import { useOnboardingAccess } from "@/lib/onboarding/deferred-onboarding";
import { isTV } from "@/lib/platform/is-tv";
import { useTheme } from "@/providers/theme-provider";
import { usePreferencesReady } from "@/stores/preferences-store";

/**
 * TV (D-UX5): a deep link or stale shortcut to a hidden finance tool shows the
 * "not on this device" state instead of the tool, until Settings › Devices ›
 * "Show finance tools" is on. Re-renders when the setting changes.
 */
export function TvFinanceRouteGate({
  routeName,
  children,
}: {
  routeName: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const tool = hiddenFinanceToolForRoute(routeName, useDestinationScope());
  if (!tool) return <>{children}</>;
  return (
    <ScreenLayout title={t(tool.labelKey)} scrollable={false}>
      <UnavailableOnDevice
        title={t("tvFinance.hiddenTitle")}
        description={t("tvFinance.hiddenBody")}
      />
    </ScreenLayout>
  );
}

/** Stack `screenLayout` wrapping every screen in {@link TvFinanceRouteGate} (TV only). */
function tvScreenLayout({
  route,
  children,
}: {
  route: { name: string };
  children: ReactElement;
}): ReactElement {
  return <TvFinanceRouteGate routeName={route.name}>{children}</TvFinanceRouteGate>;
}

/**
 * Mirrors the focused pathname for `goBackOrReplace(router, "/")`, which then
 * falls back to the screen's parent hub. A leaf so pathname changes never
 * re-render the stack.
 */
function CurrentPathnameTracker() {
  useTrackCurrentPathname();
  return null;
}

/**
 * Root stack with a React Navigation theme synced to Munib colors.
 * Screen cards are transparent so async-route Suspense can leave the previous
 * screen visible under a content-area loader; each route paints its own opaque
 * background (ScreenLayout / tab roots) to avoid light/dark flash.
 *
 * Until preferences hydrate, only a boot-colored shell is shown (splash covers
 * it). After hydrate, a first-time user landing on Home is redirected to intro
 * (tabs stay protected so home chrome never mounts underneath the splash); a
 * first-time user opening any other page keeps it and onboarding is deferred
 * for the session (`lib/onboarding/deferred-onboarding.ts`).
 */
export function AppStack() {
  const { colors, scheme } = useTheme();
  const prefsReady = usePreferencesReady();
  const { showApp } = useOnboardingAccess();

  const navigationTheme = useMemo(() => createNavigationTheme(colors, scheme), [colors, scheme]);
  const { width: windowWidth } = useWindowDimensions();
  const webRail = useWebGlobalRail();
  const tabletRail = useNativeTabletRail();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      contentStyle: { backgroundColor: "transparent" as const },
    }),
    [],
  );

  if (!prefsReady) {
    return <View style={[styles.bootShell, { backgroundColor: colors.background }]} />;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      {/* Follows resolved scheme so icon contrast updates on every light/dark toggle,
          including screens that leave StatusBar unmanaged or hard-code light icons. */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <CurrentPathnameTracker />
      {!showApp ? <Redirect href="/intro" /> : null}
      {/* Wide web and native tablets (D-UX3): a persistent rail beside the stack
          so every page keeps primary navigation (not just the four tab roots).
          Each rail keeps its own slot so toggling one never remounts the stack. */}
      <View style={styles.shell}>
        {webRail.visible && showApp ? <WebGlobalRail windowWidth={windowWidth} /> : null}
        {tabletRail.visible && showApp ? (
          <TabletRail
            width={tabletRail.width}
            expanded={tabletRail.expanded}
            startInset={tabletRail.startInset}
          />
        ) : null}
        <View style={styles.stackColumn}>
          <Stack
            screenOptions={screenOptions}
            unstable_screenErrorBoundary={ScreenErrorBoundary}
            screenLayout={isTV() ? tvScreenLayout : undefined}
          >
            {/* SDK 58: a failed guard renders a redirect (the route stays registered). */}
            <Stack.Protected guard={showApp} redirectTo="/intro">
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Screen name="(onboarding)/intro" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(onboarding)/intro-location" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(onboarding)/intro-madhhab" options={{ gestureEnabled: false }} />
            {/* Setup wizard: Back / Android back walk its steps, so no swipe-to-dismiss. */}
            <Stack.Screen name="(onboarding)/setup" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(auth)/login" options={{ presentation: "modal" }} />
          </Stack>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bootShell: {
    flex: 1,
  },
  shell: {
    flex: 1,
    flexDirection: "row",
  },
  stackColumn: {
    flex: 1,
    minWidth: 0,
  },
});
