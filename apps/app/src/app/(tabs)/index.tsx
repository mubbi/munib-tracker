import { OBLIGATORY_PRAYER_SET } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { usePrayerStatusController } from "@/components/tracker/use-prayer-status-controller";
import { SafeRefreshControl } from "@/components/ui/safe-refresh-control";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Breakpoints, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useNotificationBadgeCount } from "@/hooks/use-notification-badge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeatherDisplay } from "@/hooks/use-weather-display";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { useIqamahCountdown } from "@/lib/masjid/use-iqamah-countdown";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_SLOT_ORDER } from "@/lib/prayer-times";
import { horizontalSafeAreaPadding } from "@/lib/rtl";
import { HOME_FAQ } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema } from "@/lib/seo/structured-data";
import { useLocationActions } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { useTodayPrayers, useTrackerActions, useTrackerReady } from "@/stores/tracker-store";
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

/**
 * Visible placeholder while the lazy below-fold chunk loads (avoids a blank
 * "stuck" home): a card-shaped skeleton announced once as "Loading…" (P8-04).
 */
function HomeBelowFoldFallback({ dashboard = false }: { dashboard?: boolean }) {
  const { t } = useTranslation();
  return (
    <View style={dashboard ? styles.belowFoldFallbackDashboard : styles.belowFoldFallback}>
      <SkeletonPlaceholder preset="card" accessibilityLabel={t("common.loadingRoute")} />
    </View>
  );
}

/**
 * The Salah the hero cell marks (P5-04): the running fard, or Fajr while the
 * sunrise window runs — the same slot `mark-current-obligatory` resolves.
 */
function markableHeroPrayer(activeIndex: number): ObligatoryPrayer | null {
  const slot = PRAYER_SLOT_ORDER[activeIndex];
  if (slot === "sunrise") return "fajr";
  return slot && OBLIGATORY_PRAYER_SET.has(slot) ? (slot as ObligatoryPrayer) : null;
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
  const iqamahCountdown = useIqamahCountdown(hero.now);
  const weather = useWeatherDisplay();
  const weatherSnapshot = useWeatherSnapshot();
  const { weatherPrefs } = usePreferences();
  const weatherEffects = useMemo(
    () => resolveWeatherEffects(weatherSnapshot, weatherPrefs),
    [weatherSnapshot, weatherPrefs],
  );
  const notificationCount = useNotificationBadgeCount();
  // Mark today's Salah from the hero (one tap opens its status sheet in place).
  const prayerStatus = usePrayerStatusController();
  const trackerReady = useTrackerReady();
  const { status: todayStatus } = useTodayPrayers();
  const markPrayer = trackerReady ? markableHeroPrayer(hero.activeIndex) : null;
  const markStatus = markPrayer ? (todayStatus[markPrayer] ?? "pending") : "pending";
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
      iqamahCountdown={iqamahCountdown}
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
      markIndex={markPrayer ? PRAYER_SLOT_ORDER.indexOf(markPrayer) : -1}
      markStatusLabel={t(`prayerStatus.${markStatus}`)}
      markCompleted={markStatus === "completed"}
      onMarkPress={markPrayer ? () => prayerStatus.open(markPrayer) : undefined}
    />
  );
  const belowFoldProps = {
    schedule: hero.schedule,
    nextIn: hero.nextIn,
    nextScheduleId: hero.nextScheduleId,
    scheduleDateLabel: hero.displayDates.primary,
    scheduleLocationLabel: hero.location,
    // "Mark {{salah}}" in Today's Goal while the running Salah is unlogged.
    markPrayer: markPrayer && markStatus === "pending" ? markPrayer : null,
    // Opens the status sheet (Completed / Missed / Delayed / Qaza, congregation,
    // note) instead of logging "completed" outright.
    onMarkPrayer: markPrayer ? () => prayerStatus.open(markPrayer) : undefined,
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
                        width >= Breakpoints.xwide
                          ? HOME_DASHBOARD_MAX_WIDTH_XL
                          : HOME_DASHBOARD_MAX_WIDTH,
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
      {prayerStatus.sheet}
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
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)");
