import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { SafeRefreshControl } from "@/components/ui/safe-refresh-control";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { MaxContentWidth, Radius, Shadows, Spacing } from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useNotificationBadgeCount } from "@/hooks/use-notification-badge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeatherDisplay } from "@/hooks/use-weather-display";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { isTV } from "@/lib/platform/is-tv";
import { horizontalSafeAreaPadding } from "@/lib/rtl";
import { HOME_FAQ } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema } from "@/lib/seo/structured-data";
import { useLocationActions } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { useTrackerActions } from "@/stores/tracker-store";
import { resolveWeatherEffects, useWeatherSnapshot, weatherActions } from "@/stores/weather-store";

/**
 * Window width at/above which home becomes a two-column dashboard (hero + main
 * cards on the start side, today's schedule + secondary cards in an aside).
 * Never on TV — TV keeps its tuned landscape stack.
 */
const HOME_DASHBOARD_BREAKPOINT = 1024;
/** Content caps for the dashboard — match `ScreenLayout`'s wide / x-wide columns. */
const HOME_DASHBOARD_MAX_WIDTH = 1120;
const HOME_DASHBOARD_MAX_WIDTH_XL = 1320;

const HomeBelowFoldLazy = lazy(() =>
  import("@/components/home-below-fold").then((mod) => ({ default: mod.HomeBelowFold })),
);

let HomeBelowFoldForTests: typeof import("@/components/home-below-fold").HomeBelowFold | undefined;

/** Jest-only: sync below-fold body so Suspense/lazy is not required under Jest. */
export function __setHomeBelowFoldForTests(
  Comp: typeof import("@/components/home-below-fold").HomeBelowFold,
): void {
  HomeBelowFoldForTests = Comp;
}

/** Visible placeholder while the lazy below-fold chunk loads (avoids a blank “stuck” home). */
function HomeBelowFoldFallback({ dashboard = false }: { dashboard?: boolean }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const title = t("common.loadingRoute");
  const hint = t("common.loadingRouteHint");

  return (
    <View
      style={dashboard ? styles.belowFoldFallbackDashboard : styles.belowFoldFallback}
      accessibilityRole="progressbar"
      accessibilityLabel={title}
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.belowFoldStatus,
          {
            backgroundColor: colors.card,
            borderColor: tokens.hairline,
          },
        ]}
      >
        <View style={[styles.belowFoldWell, { backgroundColor: tokens.accentSoft }]}>
          <ActivityIndicator color={colors.accent} />
        </View>
        <View style={styles.belowFoldCopy}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

/**
 * Thin home shell: brand hero + SEO paint first. Below-fold cards load in a
 * separate async chunk (web LCP / TBT).
 */
export default function HomeScreen() {
  useMarkColdStartReady();
  const BelowFold = HomeBelowFoldForTests ?? HomeBelowFoldLazy;
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  const insets = useAppSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dashboard = !tv && width >= HOME_DASHBOARD_BREAKPOINT;
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const [isFocused, setIsFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );
  const { refresh } = useTrackerActions();
  const location = useLocationActions();
  const hero = useHomeHero();
  const weather = useWeatherDisplay();
  const weatherSnapshot = useWeatherSnapshot();
  const { weatherPrefs } = usePreferences();
  const weatherEffects = useMemo(
    () => resolveWeatherEffects(weatherSnapshot, weatherPrefs),
    [weatherSnapshot, weatherPrefs],
  );
  const notificationCount = useNotificationBadgeCount();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refresh(), location.refresh(), weatherActions.sync({ force: true })]);
    } finally {
      setRefreshing(false);
    }
  };

  const heroElement = (
    <PrayerTimesHero
      location={hero.location}
      displayDates={hero.displayDates}
      currentTime={hero.currentTime}
      countdown={hero.countdown}
      prayers={hero.prayers}
      activeIndex={hero.activeIndex}
      topInset={dashboard ? Spacing.two : insets.top}
      variant={dashboard ? "card" : "banner"}
      sky={hero.sky}
      now={hero.now}
      moonLabel={hero.moonLabel}
      southernHemisphere={hero.southernHemisphere}
      celestial={hero.celestial}
      dayProgress={hero.dayProgress}
      notificationCount={notificationCount}
      weatherSummary={weather?.summary ?? null}
      weatherAccessibilityLabel={weather?.accessibilityLabel ?? null}
      weatherEffects={weatherEffects}
      // Particle trees are too heavy for low-end Fire TV / Android TV sticks.
      weatherEffectsEnabled={isFocused && !tv}
      onSearchPress={() => router.push("/search")}
      onNotificationsPress={() => router.push("/notifications")}
      onLocationPress={() => router.push("/location")}
    />
  );
  const belowFoldProps = {
    schedule: hero.schedule,
    nextIn: hero.nextIn,
    nextScheduleId: hero.nextScheduleId,
    scheduleDateLabel: hero.displayDates.primary,
    scheduleLocationLabel: hero.location,
  };

  return (
    <View
      // iOS 26 tab-bar minimize-on-scroll: UIKit resolves the tab's content
      // scroll view by walking first subviews from the tab screen root, so the
      // wrapper must not be view-flattened away from that chain.
      collapsable={false}
      // Left/right safe area: iOS 27 vertical system rail (iPhone Duo) and notches.
      style={[
        styles.root,
        { backgroundColor: colors.background },
        isTV() ? null : horizontalSafeAreaPadding(insets),
      ]}
    >
      <Seo path="/" isHome jsonLd={[faqSchema(HOME_FAQ)]} />
      {/* Dashboard: the hero is an inset card, so the status bar sits on the page background. */}
      {isFocused && !tv ? (
        <StatusBar style={dashboard && !tokens.isDark ? "dark" : "light"} />
      ) : null}
      <TvFocusGuide autoFocus={tv} style={styles.root}>
        <TvScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomInset }]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          // TV: no pull gesture on a remote — data refreshes on focus / sync instead.
          refreshControl={
            tv ? undefined : (
              <SafeRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            )
          }
        >
          {/* TV: fill the landscape pane (overscan lives on hero / body padding). */}
          <View
            style={[
              styles.column,
              tv ? styles.columnTv : null,
              dashboard
                ? [
                    styles.columnDashboard,
                    {
                      maxWidth:
                        width >= 1600 ? HOME_DASHBOARD_MAX_WIDTH_XL : HOME_DASHBOARD_MAX_WIDTH,
                      paddingTop: insets.top + Spacing.four,
                    },
                  ]
                : null,
            ]}
          >
            <ThemedText heading={1} style={styles.srOnly}>
              {t("common.appName")} — {t("common.appTagline")}
            </ThemedText>
            {dashboard ? (
              // Dashboard: the hero renders inside the below-fold grid (beside the
              // schedule aside); the fallback paints it first so LCP is unchanged.
              <Suspense
                fallback={
                  <>
                    {heroElement}
                    <HomeBelowFoldFallback dashboard />
                  </>
                }
              >
                <BelowFold {...belowFoldProps} hero={heroElement} />
              </Suspense>
            ) : (
              <>
                {heroElement}
                <Suspense fallback={<HomeBelowFoldFallback />}>
                  <BelowFold {...belowFoldProps} />
                </Suspense>
              </>
            )}
          </View>
        </TvScrollView>
      </TvFocusGuide>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  srOnly: { position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", opacity: 0 },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  column: { width: "100%", maxWidth: MaxContentWidth },
  columnTv: { maxWidth: undefined },
  columnDashboard: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  // Match `HomeBelowFold` body inset so the loader sits where cards will land.
  belowFoldFallback: {
    paddingHorizontal: Spacing.four,
    marginTop: -Spacing.five,
    zIndex: 1,
  },
  belowFoldFallbackDashboard: { width: "100%", maxWidth: 560 },
  belowFoldStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    ...Shadows.sm,
  },
  belowFoldWell: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  belowFoldCopy: {
    flex: 1,
    gap: Spacing.half,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)");
