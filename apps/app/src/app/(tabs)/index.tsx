import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lazy, Suspense, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useNotificationBadgeCount } from "@/hooks/use-notification-badge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeatherDisplay } from "@/hooks/use-weather-display";
import { HOME_FAQ } from "@/lib/seo/faq-content";
import { faqSchema } from "@/lib/seo/structured-data";
import { useLocationActions } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { useTrackerActions } from "@/stores/tracker-store";
import { resolveWeatherEffects, useWeatherSnapshot, weatherActions } from "@/stores/weather-store";

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
 * Thin home shell: brand hero + SEO paint first. Below-fold cards load in a
 * separate async chunk (web LCP / TBT).
 */
export default function HomeScreen() {
  const BelowFold = HomeBelowFoldForTests ?? HomeBelowFoldLazy;
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeTokens();
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

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Seo path="/" isHome jsonLd={[faqSchema(HOME_FAQ)]} />
      {isFocused ? <StatusBar style="light" /> : null}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomInset }]}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <View style={styles.column}>
          <ThemedText heading={1} style={styles.srOnly}>
            {t("common.appName")} — {t("common.appTagline")}
          </ThemedText>
          <PrayerTimesHero
            location={hero.location}
            displayDates={hero.displayDates}
            currentTime={hero.currentTime}
            countdown={hero.countdown}
            prayers={hero.prayers}
            activeIndex={hero.activeIndex}
            topInset={insets.top}
            sky={hero.sky}
            now={hero.now}
            moonLabel={hero.moonLabel}
            southernHemisphere={hero.southernHemisphere}
            windowProgress={hero.windowProgress}
            notificationCount={notificationCount}
            weatherSummary={weather?.summary ?? null}
            weatherAccessibilityLabel={weather?.accessibilityLabel ?? null}
            weatherEffects={resolveWeatherEffects(weatherSnapshot, weatherPrefs)}
            onSearchPress={() => router.push("/search")}
            onNotificationsPress={() => router.push("/notifications")}
            onLocationPress={() => router.push("/location")}
          />

          <Suspense fallback={null}>
            <BelowFold
              schedule={hero.schedule}
              nextIn={hero.nextIn}
              nextScheduleId={hero.nextScheduleId}
            />
          </Suspense>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  srOnly: { position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", opacity: 0 },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  column: { width: "100%", maxWidth: MaxContentWidth },
});
