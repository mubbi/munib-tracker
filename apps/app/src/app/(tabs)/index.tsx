import { type Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ContinueCard } from "@/components/continue-card";
import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { KnowledgeFlashCard } from "@/components/knowledge-flash-card";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { IosPwaInstallBanner } from "@/components/pwa/ios-pwa-install-banner";
import { QazaSummaryCard } from "@/components/qaza-summary-card";
import { RamadanCard } from "@/components/ramadan-card";
import { SeasonalThemeBanner } from "@/components/seasonal-theme-banner";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar, SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useNotificationBadgeCount } from "@/hooks/use-notification-badge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeatherDisplay } from "@/hooks/use-weather-display";
import { useWeeklyReport } from "@/hooks/use-weekly-report";
import { NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { orderQuickActions, TASBEEH_ICON } from "@/lib/quick-actions";
import { arrowForward, chevronForward } from "@/lib/rtl";
import { HOME_FAQ } from "@/lib/seo/faq-content";
import { faqSchema } from "@/lib/seo/structured-data";
import { useLocationActions } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import {
  useDailySummary,
  useDayExcused,
  useDevotionProgress,
  useQazaSummary,
  useRoza,
  useStreak,
  useTrackerActions,
} from "@/stores/tracker-store";
import { resolveWeatherEffects, useWeatherSnapshot, weatherActions } from "@/stores/weather-store";

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const summary = useDailySummary();
  const excusedReason = useDayExcused();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const qaza = useQazaSummary();
  const roza = useRoza();
  const { refresh } = useTrackerActions();
  const location = useLocationActions();
  const hero = useHomeHero();
  const weather = useWeatherDisplay();
  useWeeklyReport();
  const weatherSnapshot = useWeatherSnapshot();
  const { weatherPrefs, quickActionOrder, hiddenHomeModules } = usePreferences();
  const hiddenModules = new Set(hiddenHomeModules ?? []);
  const notificationCount = useNotificationBadgeCount();
  const [refreshing, setRefreshing] = useState(false);

  const tasksDone = summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday;
  const tasksTotal = summary.salahTotal + summary.zikrTotal + summary.qazaTargetToday;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const isExcused = excusedReason != null;
  const isFreshStart = tasksDone === 0 && streak === 0 && !isExcused;
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
      onPress: () => router.push("/schedule"),
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
      icon: TASBEEH_ICON,
      tint: colors.accent,
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "ramadan",
      label: t("actions.ramadan"),
      icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/ramadan"),
    },
    {
      id: "salahGuide",
      label: t("actions.salahGuide"),
      icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/salah-guide"),
    },
    {
      id: "events",
      label: t("actions.events"),
      icon: { ios: "star.circle.fill", android: "event", web: "event" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/events"),
    },
    {
      id: "zakat",
      label: t("actions.zakat"),
      icon: { ios: "banknote.fill", android: "payments", web: "payments" },
      tint: tokens.status.success.color,
      onPress: () => router.push("/zakat"),
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
      id: "duroods",
      label: t("actions.duroods"),
      icon: {
        ios: "heart.text.square.fill",
        android: "favorite",
        web: "favorite",
      },
      tint: tokens.status.danger.color,
      onPress: () => router.push("/duroods"),
    },
    {
      id: "names",
      label: t("actions.names"),
      icon: NAMES_OF_ALLAH_ICON,
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
      id: "jannah",
      label: t("actions.jannah"),
      icon: { ios: "leaf.fill", android: "park", web: "park" },
      tint: tokens.status.success.color,
      onPress: () => router.push("/jannah"),
    },
    {
      id: "battles",
      label: t("actions.battles"),
      icon: { ios: "scroll.fill", android: "history_edu", web: "history_edu" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/battles" as Href),
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
      <Seo path="/" isHome jsonLd={[faqSchema(HOME_FAQ)]} />
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomInset }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <View style={styles.column}>
          {/* Semantic H1 for search/AI crawlers; the visible hero is a graphic. */}
          <ThemedText heading={1} style={styles.srOnly}>
            {t("common.appName")} — {t("common.appTagline")}
          </ThemedText>
          <PrayerTimesHero
            location={hero.location}
            displayDate={hero.displayDate}
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

          <View style={styles.body}>
            <IosPwaInstallBanner />

            <Stagger>
              <SeasonalThemeBanner />

              <Card>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitle}>
                    <ThemedText type="subtitle">{t("home.todaysGoal")}</ThemedText>
                    <ThemedText type="small" themeColor="mutedForeground">
                      {isExcused
                        ? t("home.excusedGoalHint", {
                            reason: t(`tracker.excusedReason.${excusedReason}`),
                          })
                        : isFreshStart
                          ? t("home.freshStartHint")
                          : t("home.checklistHint")}
                    </ThemedText>
                  </View>
                  {isExcused ? (
                    <Pill
                      label={t("home.excusedPausedLabel")}
                      color={tokens.status.info.color}
                      background={colors.card}
                      icon={{
                        ios: "pause.circle.fill",
                        android: "pause_circle",
                        web: "pause_circle",
                      }}
                    />
                  ) : (
                    <Pill
                      label={`${progressPct}%`}
                      color={colors.accentForeground}
                      background={colors.accent}
                    />
                  )}
                </View>

                {isExcused ? (
                  <View
                    style={[
                      styles.pausedBanner,
                      {
                        backgroundColor: colors.card,
                        borderColor: tokens.status.info.color,
                      },
                    ]}
                  >
                    <SymbolView
                      name={{
                        ios: "pause.circle.fill",
                        android: "pause_circle",
                        web: "pause_circle",
                      }}
                      size={22}
                      tintColor={tokens.status.info.color}
                    />
                    <View style={styles.pausedCopy}>
                      <ThemedText type="smallBold" style={{ color: tokens.status.info.color }}>
                        {t("home.excusedPausedLabel")}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {t("home.excusedGoalBody")}
                      </ThemedText>
                    </View>
                  </View>
                ) : (
                  <View style={styles.goalProgress}>
                    <ThemedText type="smallBold" themeColor="mutedForeground">
                      {t("home.tasksProgress", { done: tasksDone, total: tasksTotal })}
                    </ThemedText>
                    <SegmentedProgress total={Math.max(tasksTotal, 1)} completed={tasksDone} />
                  </View>
                )}

                <ExcusedDayPicker variant="inline" />

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
                      name={chevronForward}
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
                  label={
                    isExcused
                      ? t("home.goToChecklist")
                      : isFreshStart
                        ? t("home.startTracking")
                        : t("home.goToChecklist")
                  }
                  variant={isExcused ? "secondary" : "primary"}
                  fullWidth
                  trailingIcon={arrowForward}
                  onPress={() => router.push("/tracker")}
                />
              </Card>

              <RamadanCard />

              {!hiddenModules.has("continue") ? <ContinueCard /> : null}

              {!hiddenModules.has("knowledge") ? <KnowledgeFlashCard /> : null}

              {!hiddenModules.has("quickActions") ? (
                <Card padding="three">
                  <SectionHeader
                    title={t("home.explore")}
                    icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
                    actionLabel={t("home.manage")}
                    actionAccessibilityLabel={t("home.manageA11y")}
                    actionIcon={{
                      ios: "slider.horizontal.3",
                      android: "tune",
                      web: "tune",
                    }}
                    onActionPress={() => router.push("/settings/home")}
                  />
                  <View style={styles.quickActions}>
                    <QuickActionGrid
                      items={
                        quickActionOrder?.length
                          ? orderQuickActions(quickActions, quickActionOrder)
                          : quickActions
                      }
                      columns={4}
                    />
                  </View>
                </Card>
              ) : null}

              {!hiddenModules.has("qaza") ? (
                <QazaSummaryCard
                  remaining={qaza.remaining}
                  completed={qaza.completed}
                  rozaRemaining={roza.remaining}
                  onPress={() => router.push("/qaza")}
                />
              ) : null}

              {!hiddenModules.has("schedule") ? (
                <PrayerScheduleCard
                  schedule={hero.schedule}
                  nextIn={hero.nextIn}
                  nextScheduleId={hero.nextScheduleId}
                />
              ) : null}
            </Stagger>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Visually hidden but present in the DOM/accessibility tree (sr-only heading).
  srOnly: { position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", opacity: 0 },
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
  pausedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  pausedCopy: {
    flex: 1,
    gap: Spacing.half,
  },
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
  quickActions: { marginTop: Spacing.three },
});
