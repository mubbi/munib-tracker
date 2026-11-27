import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { HabitRow } from "@/components/sunnah-habits/habit-row";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useHabitContext } from "@/hooks/use-habit-context";
import { dayProgressSummary, selectedHabits } from "@/lib/sunnah-habits";
import { SUNNAH_HABITS_ICON } from "@/lib/sunnah-habits-ui";
import {
  useEnsureSunnahHabitsLoaded,
  useSunnahHabits,
  useSunnahHabitsReady,
} from "@/stores/sunnah-habits-store";
import { useDayExcused } from "@/stores/tracker-store";

type SunnahHabitsSectionProps = {
  date: string;
  /** `home`: today's habits as a compact card (max 4 rows). `tracker`: every selected habit. */
  variant?: "tracker" | "home";
};

const HOME_MAX_ROWS = 4;

/**
 * "Sunnah habits" on the Tracker (under the zikr section) and as the home module
 * `sunnah-habits` (NF-3.5). Before any habit is chosen it is a single invite row.
 */
export function SunnahHabitsSection({ date, variant = "tracker" }: SunnahHabitsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  useEnsureSunnahHabitsLoaded();
  const ready = useSunnahHabitsReady();
  const state = useSunnahHabits();
  const ctx = useHabitContext({ withHistory: variant === "tracker" });
  const excused = useDayExcused();
  if (!ready) return null;

  const habits = selectedHabits(state);
  const summary = dayProgressSummary(state, date, ctx);
  const shown = variant === "home" ? habits.slice(0, HOME_MAX_ROWS) : habits;

  return (
    <Card>
      <SectionHeader
        title={t("sunnahHabits.title")}
        icon={SUNNAH_HABITS_ICON}
        badge={
          habits.length ? (
            <Pill
              label={t("tracker.sectionProgress", {
                completed: summary.done,
                total: summary.total,
              })}
              compact
            />
          ) : undefined
        }
      />
      {habits.length === 0 ? (
        <View style={styles.rows}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("sunnahHabits.emptyHint")}
          </ThemedText>
          <NavRow
            icon={SUNNAH_HABITS_ICON}
            label={t("sunnahHabits.choose")}
            onPress={() => router.push("/habits" as Href)}
            href="/habits"
          />
        </View>
      ) : (
        <View style={styles.rows}>
          {shown.map((habit) => (
            <HabitRow
              key={habit.id}
              state={state}
              habit={habit}
              date={date}
              ctx={ctx}
              excusedReason={excused}
            />
          ))}
          <NavRow
            icon={SUNNAH_HABITS_ICON}
            label={t("sunnahHabits.openAll")}
            badge={
              habits.length > shown.length
                ? t("sunnahHabits.moreCount", { number: habits.length - shown.length })
                : undefined
            }
            onPress={() => router.push("/habits" as Href)}
            href="/habits"
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
