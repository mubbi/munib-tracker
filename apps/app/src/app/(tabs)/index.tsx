import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrayerTimesHero } from "@/components/prayer-times-hero";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { Stagger } from "@/components/ui/stagger";
import { StatCard } from "@/components/ui/stat-card";
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useLocationActions } from "@/stores/location-store";
import {
  useDailySummary,
  useQazaSummary,
  useStreak,
  useTrackerActions,
} from "@/stores/tracker-store";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const streak = useStreak();
  const qaza = useQazaSummary();
  const { refresh } = useTrackerActions();
  const location = useLocationActions();
  const hero = useHomeHero();
  const [refreshing, setRefreshing] = useState(false);

  const tasksDone = summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday;
  const tasksTotal = summary.salahTotal + summary.zikrTotal;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const isFreshStart = tasksDone === 0 && streak === 0;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refresh(), location.refresh()]);
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
            onSearchPress={() => router.push("/search")}
            onNotificationsPress={() => router.push("/notifications")}
            onLocationPress={() => router.push("/location")}
          />

          <View style={styles.body}>
            <Stagger>
              <Card padding="three">
                <QuickActionGrid items={quickActions} columns={4} />
              </Card>

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

              <Card>
                <ThemedText type="subtitle" style={styles.scheduleTitle}>
                  {t("home.scheduleTitle")}
                </ThemedText>
                <View>
                  {hero.schedule.map((item) => (
                    <View
                      key={item.id}
                      accessibilityRole="text"
                      accessibilityLabel={t(
                        item.active ? "hero.prayerItemActive" : "hero.prayerItem",
                        { name: item.name, time: item.time },
                      )}
                      style={[
                        styles.scheduleRow,
                        {
                          borderLeftColor: item.active ? colors.accent : "transparent",
                          backgroundColor: item.active ? tokens.accentSoft : "transparent",
                        },
                      ]}
                    >
                      <ThemedText
                        type={item.active ? "smallBold" : "small"}
                        style={item.active ? { color: colors.accentText } : undefined}
                        themeColor={item.active ? undefined : "mutedForeground"}
                      >
                        {item.name}
                      </ThemedText>
                      <View style={styles.scheduleRight}>
                        {item.active ? (
                          <ThemedText type="caption" style={{ color: colors.accentText }}>
                            {hero.nextIn}
                          </ThemedText>
                        ) : null}
                        <ThemedText
                          type={item.active ? "smallBold" : "small"}
                          style={[
                            styles.scheduleTime,
                            item.active ? { color: colors.accentText } : undefined,
                          ]}
                          themeColor={item.active ? undefined : "foreground"}
                        >
                          {item.time}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>

              <View style={styles.statsRow}>
                <StatCard
                  label={t("home.prayersStat")}
                  value={`${summary.salahCompleted}/${summary.salahTotal}`}
                  icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
                />
                <StatCard
                  label={t("home.dhikrStat")}
                  value={`${summary.zikrCompleted}/${summary.zikrTotal}`}
                  icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
                  tint={tokens.status.danger.color}
                />
                <StatCard
                  label={t("home.streakStat")}
                  value={`${streak}`}
                  icon={{
                    ios: "flame.fill",
                    android: "local_fire_department",
                    web: "local_fire_department",
                  }}
                  tint={tokens.status.warning.color}
                />
              </View>

              <Card variant="outline" style={styles.qazaCard} onPress={() => router.push("/qaza")}>
                <View style={[styles.qazaIcon, { backgroundColor: tokens.status.info.soft }]}>
                  <ThemedText type="subtitle" style={{ color: tokens.status.info.color }}>
                    {qaza.remaining}
                  </ThemedText>
                </View>
                <View style={styles.qazaText}>
                  <ThemedText type="smallBold">{t("home.qazaRemaining")}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("home.qazaMeta", { completed: qaza.completed })}
                  </ThemedText>
                </View>
              </Card>

              <Card variant="muted" style={styles.reminder}>
                <View style={[styles.reminderIcon, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="header" style={{ color: colors.accent }}>
                    ﷽
                  </ThemedText>
                </View>
                <View style={styles.reminderText}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {t("home.gentleReminder")}
                  </ThemedText>
                  <ThemedText type="small" themeColor="mutedForeground">
                    {t("home.gentleReminderBody")}
                  </ThemedText>
                </View>
              </Card>
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
  scheduleTitle: { marginBottom: Spacing.two },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingRight: Spacing.two,
    paddingLeft: Spacing.two + 2,
    borderLeftWidth: 3,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  scheduleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  scheduleTime: { fontVariant: ["tabular-nums"] },
  goalProgress: { gap: Spacing.two, marginBottom: Spacing.four },
  statsRow: { flexDirection: "row", gap: Spacing.two },
  qazaCard: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  qazaIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  qazaText: { flex: 1, gap: 2 },
  reminder: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  reminderText: { flex: 1, gap: 2 },
});
