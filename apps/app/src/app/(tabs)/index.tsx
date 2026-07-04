import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ContinueCard } from "@/components/continue-card";
import { KnowledgeFlashCard } from "@/components/knowledge-flash-card";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { IosPwaInstallBanner } from "@/components/pwa/ios-pwa-install-banner";
import { QazaSummaryCard } from "@/components/qaza-summary-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar, SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { Stagger } from "@/components/ui/stagger";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useNotificationBadgeCount } from "@/hooks/use-notification-badge";
import { scrollChildIntoView } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeatherDisplay } from "@/hooks/use-weather-display";
import { useLocationActions } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import {
  useDailySummary,
  useDevotionProgress,
  useQazaSummary,
  useStreak,
  useTrackerActions,
} from "@/stores/tracker-store";
import { resolveWeatherEffects, useWeatherSnapshot, weatherActions } from "@/stores/weather-store";

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const qaza = useQazaSummary();
  const { refresh } = useTrackerActions();
  const location = useLocationActions();
  const hero = useHomeHero();
  const weather = useWeatherDisplay();
  const weatherSnapshot = useWeatherSnapshot();
  const { weatherPrefs } = usePreferences();
  const notificationCount = useNotificationBadgeCount();
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scheduleRef = useRef<View>(null);
  const scrollY = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = event.nativeEvent.contentOffset?.y ?? 0;
  }, []);

  const scrollToSchedule = useCallback(() => {
    scrollChildIntoView(scrollRef, scheduleRef, scrollY.current);
  }, []);

  const tasksDone = summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday;
  const tasksTotal = summary.salahTotal + summary.zikrTotal + summary.qazaTargetToday;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const isFreshStart = tasksDone === 0 && streak === 0;
  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refresh(), location.refresh(), weatherActions.sync({ force: true })]);
    } finally {
      setRefreshing(false);
    }
  };

  const quickActions: QuickActionItem[] = [
    {
      id: "checklist",
      label: t("actions.checklist"),
      icon: { ios: "checklist", android: "checklist", web: "checklist" },
      tint: tokens.status.success.color,
      onPress: () => router.push("/tracker"),
    },
    {
      id: "schedule",
      label: t("home.scheduleTitle"),
      icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
      tint: tokens.status.info.color,
      onPress: scrollToSchedule,
    },
    {
      id: "zikr",
      label: t("actions.zikr"),
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      tint: tokens.status.danger.color,
      onPress: () => router.push("/zikr"),
    },
    {
      id: "tasbeeh",
      label: t("actions.tasbeeh"),
      icon: { ios: "hand.tap.fill", android: "touch_app", web: "touch_app" },
      tint: colors.accent,
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "qaza",
      label: t("actions.qaza"),
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/qaza"),
    },
    {
      id: "quran",
      label: t("actions.quran"),
      icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
      tint: colors.accent,
      onPress: () => router.push("/quran"),
    },
    {
      id: "hadith",
      label: t("actions.hadith"),
      icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/hadith"),
    },
    {
      id: "bookmarks",
      label: t("actions.bookmarks"),
      icon: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/bookmarks"),
    },
    {
      id: "duas",
      label: t("actions.duas"),
      icon: {
        ios: "hands.and.sparkles.fill",
        android: "volunteer_activism",
        web: "volunteer_activism",
      },
      tint: tokens.status.danger.color,
      onPress: () => router.push("/dua"),
    },
    {
      id: "names",
      label: t("actions.names"),
      icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
      tint: colors.accent,
      onPress: () => router.push("/names-of-allah"),
    },
    {
      id: "qibla",
      label: t("actions.qibla"),
      icon: { ios: "location.north.line.fill", android: "explore", web: "explore" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/qibla"),
    },
    {
      id: "calendar",
      label: t("actions.calendar"),
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/calendar"),
    },
    {
      id: "achievements",
      label: t("settings.achievements"),
      icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/achievements"),
    },
    {
      id: "stats",
      label: t("actions.stats"),
      icon: { ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" },
      tint: tokens.status.success.color,
      onPress: () => router.push("/statistics"),
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <View style={styles.column}>
          <PrayerTimesHero
            location={hero.location}
            hijriDate={hero.hijriDate}
            currentTime={hero.currentTime}
            countdown={hero.countdown}
            prayers={hero.prayers}
            activeIndex={hero.activeIndex}
            topInset={insets.top}
            sky={hero.sky}
            now={hero.now}
            moonLabel={hero.moonLabel}
            windowProgress={hero.windowProgress}
            notificationCount={notificationCount}
            weatherSummary={weather?.summary ?? null}
            weatherAccessibilityLabel={weather?.accessibilityLabel ?? null}
            weatherEffects={resolveWeatherEffects(weatherSnapshot, weatherPrefs)}
            onSearchPress={() => router.push("/search")}
            onNotificationsPress={() => router.push("/notifications")}
            onLocationPress={() => router.push("/location")}
          />

          <View style={styles.body}>
            <IosPwaInstallBanner />

            <Stagger>
              <Card>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitle}>
                    <ThemedText type="subtitle">{t("home.todaysGoal")}</ThemedText>
                    <ThemedText type="small" themeColor="mutedForeground">
                      {isFreshStart ? t("home.freshStartHint") : t("home.checklistHint")}
                    </ThemedText>
                  </View>
                  <Pill
                    label={`${progressPct}%`}
                    color={colors.accentForeground}
                    background={colors.accent}
                  />
                </View>

                <View style={styles.goalProgress}>
                  <ThemedText type="smallBold" themeColor="mutedForeground">
                    {t("home.tasksProgress", { done: tasksDone, total: tasksTotal })}
                  </ThemedText>
                  <SegmentedProgress total={Math.max(tasksTotal, 1)} completed={tasksDone} />
                </View>

                <PressableScale
                  onPress={() => router.push("/achievements")}
                  haptic="light"
                  scaleTo={0.98}
                  accessibilityRole="button"
                  accessibilityLabel={t("home.devotionA11y", {
                    level: devotion.level,
                    noor: devotion.noor,
                    current: devotionLevelProgress,
                    next: devotionLevelSpan,
                  })}
                  style={[styles.devotionBlock, { borderTopColor: colors.border }]}
                >
                  <View style={styles.devotionRow}>
                    <View style={styles.devotionCopy}>
                      <ThemedText type="smallBold">
                        {t("achievements.devotion")} ·{" "}
                        {t("home.devotionMeta", {
                          level: devotion.level,
                          noor: formatCount(devotion.noor),
                        })}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {t("home.devotionProgress", {
                          current: formatCount(devotionLevelProgress),
                          next: formatCount(devotionLevelSpan),
                        })}
                      </ThemedText>
                    </View>
                    <SymbolView
                      name={{
                        ios: "chevron.right",
                        android: "chevron_right",
                        web: "chevron_right",
                      }}
                      size={14}
                      tintColor={colors.mutedForeground}
                    />
                  </View>
                  <ProgressBar
                    value={devotion.progress}
                    height={4}
                    color={tokens.status.warning.color}
                  />
                </PressableScale>

                <Button
                  label={isFreshStart ? t("home.startTracking") : t("home.goToChecklist")}
                  fullWidth
                  trailingIcon={{
                    ios: "arrow.right",
                    android: "arrow_forward",
                    web: "arrow_forward",
                  }}
                  onPress={() => router.push("/tracker")}
                />
              </Card>

              <ContinueCard />

              <KnowledgeFlashCard />

              <Card padding="three">
                <QuickActionGrid items={quickActions} columns={4} />
              </Card>

              <QazaSummaryCard
                remaining={qaza.remaining}
                completed={qaza.completed}
                onPress={() => router.push("/qaza")}
              />

              <View ref={scheduleRef}>
                <PrayerScheduleCard
                  schedule={hero.schedule}
                  nextIn={hero.nextIn}
                  nextScheduleId={hero.nextScheduleId}
                />
              </View>
            </Stagger>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  column: { width: "100%", maxWidth: MaxContentWidth },
  body: { paddingHorizontal: Spacing.four, marginTop: -Spacing.five, gap: Spacing.four, zIndex: 1 },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  goalTitle: { flex: 1, gap: 2 },
  goalProgress: { gap: Spacing.two },
  devotionBlock: {
    gap: Spacing.one + 2,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  devotionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  devotionCopy: {
    flex: 1,
    gap: 2,
  },
});
