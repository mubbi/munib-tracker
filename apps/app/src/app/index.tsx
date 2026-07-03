import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
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

const DAILY_TASKS_TOTAL = 24;
const DAILY_TASKS_DONE = 8;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const progressPct = Math.round((DAILY_TASKS_DONE / DAILY_TASKS_TOTAL) * 100);

  const quickActions: QuickActionItem[] = [
    {
      id: "quran",
      label: "Quran",
      icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    },
    {
      id: "duas",
      label: "Duas",
      icon: {
        ios: "hands.and.sparkles.fill",
        android: "volunteer_activism",
        web: "volunteer_activism",
      },
    },
    {
      id: "tasbeeh",
      label: "Tasbeeh",
      icon: { ios: "circle.hexagongrid.fill", android: "hive", web: "hive" },
      onPress: () => router.push("/tracker"),
    },
    {
      id: "qibla",
      label: "Qibla",
      icon: { ios: "safari.fill", android: "explore", web: "explore" },
    },
    {
      id: "qaza",
      label: "Qaza",
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      onPress: () => router.push("/tracker"),
    },
    {
      id: "names",
      label: "99 Names",
      icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
    },
    {
      id: "stats",
      label: "Stats",
      icon: { ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" },
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
                      Complete the daily activity checklist
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
                    {DAILY_TASKS_DONE} of {DAILY_TASKS_TOTAL} tasks
                  </ThemedText>
                  <SegmentedProgress total={DAILY_TASKS_TOTAL} completed={DAILY_TASKS_DONE} />
                </View>

                <Button
                  label="Go to Checklist"
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
                  value="2/5"
                  icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
                />
                <StatCard
                  label="Dhikr"
                  value="1/3"
                  icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
                  tint={tokens.status.danger.color}
                />
                <StatCard
                  label="Streak"
                  value="7"
                  icon={{
                    ios: "flame.fill",
                    android: "local_fire_department",
                    web: "local_fire_department",
                  }}
                  tint={tokens.status.warning.color}
                />
              </View>

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
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  column: {
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  body: {
    paddingHorizontal: Spacing.four,
    marginTop: -Spacing.five,
    gap: Spacing.four,
    zIndex: 1,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  goalTitle: {
    flex: 1,
    gap: 2,
  },
  goalProgress: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  reminderText: {
    flex: 1,
    gap: 2,
  },
});
