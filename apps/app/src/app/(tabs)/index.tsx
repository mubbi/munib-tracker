import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type PrayerTime, PrayerTimesHero } from "@/components/prayer-times-hero";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { Stagger } from "@/components/ui/stagger";
import { StatCard } from "@/components/ui/stat-card";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useDailySummary,
  useQazaSummary,
  useStreak,
  useTrackerActions,
} from "@/stores/tracker-store";

const PRAYERS: PrayerTime[] = [
  {
    name: "Fajr",
    time: "4:50",
    icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  },
  {
    name: "Sunrise",
    time: "6:12",
    icon: { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" },
  },
  {
    name: "Dhuhr",
    time: "11:48",
    icon: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
  },
  {
    name: "Asr",
    time: "15:05",
    icon: { ios: "cloud.sun.fill", android: "wb_cloudy", web: "wb_cloudy" },
  },
  {
    name: "Maghrib",
    time: "17:06",
    icon: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
  },
  {
    name: "Isha",
    time: "18:28",
    icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const streak = useStreak();
  const qaza = useQazaSummary();
  const { refresh } = useTrackerActions();
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const tasksDone = summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday;
  const tasksTotal = summary.salahTotal + summary.zikrTotal;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const isFreshStart = tasksDone === 0 && streak === 0;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const quickActions: QuickActionItem[] = [
    {
      id: "checklist",
      label: "Checklist",
      icon: { ios: "checklist", android: "checklist", web: "checklist" },
      onPress: () => router.push("/tracker"),
    },
    {
      id: "zikr",
      label: "Zikr",
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      onPress: () => router.push("/zikr"),
    },
    {
      id: "tasbeeh",
      label: "Tasbeeh",
      icon: { ios: "circle.hexagongrid.fill", android: "hive", web: "hive" },
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "qaza",
      label: "Qaza",
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      onPress: () => router.push("/qaza"),
    },
    {
      id: "duas",
      label: "Duas",
      icon: {
        ios: "hands.and.sparkles.fill",
        android: "volunteer_activism",
        web: "volunteer_activism",
      },
      onPress: () => router.push("/dua"),
    },
    {
      id: "names",
      label: "99 Names",
      icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
      onPress: () => router.push("/names-of-allah"),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
      onPress: () => router.push("/calendar"),
    },
    {
      id: "stats",
      label: "Stats",
      icon: { ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" },
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
            location="Sylhet, Bangladesh"
            hijriDate="Jumada al-Akhira 15, 1446 AH"
            currentTime={currentTime}
            nextPrayer="Maghrib"
            minutesToNext={27}
            prayers={PRAYERS}
            activeIndex={4}
            topInset={insets.top}
            notificationCount={2}
          />

          <View style={styles.body}>
            <Stagger>
              <Card padding="three">
                <QuickActionGrid items={quickActions} columns={4} />
              </Card>

              <Card>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitle}>
                    <ThemedText type="subtitle">Today&apos;s Goal</ThemedText>
                    <ThemedText type="small" themeColor="mutedForeground">
                      {isFreshStart
                        ? "Log your first act of worship to begin"
                        : "Complete the daily activity checklist"}
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
                    {tasksDone} of {tasksTotal} tasks
                  </ThemedText>
                  <SegmentedProgress total={Math.max(tasksTotal, 1)} completed={tasksDone} />
                </View>

                <Button
                  label={isFreshStart ? "Start tracking" : "Go to Checklist"}
                  fullWidth
                  trailingIcon={{
                    ios: "arrow.right",
                    android: "arrow_forward",
                    web: "arrow_forward",
                  }}
                  onPress={() => router.push("/tracker")}
                />
              </Card>

              <View style={styles.statsRow}>
                <StatCard
                  label="Prayers"
                  value={`${summary.salahCompleted}/${summary.salahTotal}`}
                  icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
                />
                <StatCard
                  label="Dhikr"
                  value={`${summary.zikrCompleted}/${summary.zikrTotal}`}
                  icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
                  tint={tokens.status.danger.color}
                />
                <StatCard
                  label="Streak"
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
                  <ThemedText type="smallBold">Qaza remaining</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {qaza.completed} made up so far · tap to manage
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
                    Gentle reminder
                  </ThemedText>
                  <ThemedText type="small" themeColor="mutedForeground">
                    Small, steady steps matter more than perfection. Log what you complete and
                    return tomorrow.
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
