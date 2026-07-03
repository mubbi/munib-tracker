import { aggregateByDate, type DayActivity, getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { PrayerRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildMonthGrid, monthLabel, WEEKDAYS } from "@/lib/calendar";

export default function CalendarScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [activity, setActivity] = useState<Map<string, DayActivity>>(new Map());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void PrayerRepository.getAll().then((logs) => {
        if (active) setActivity(aggregateByDate(logs));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const weeks = buildMonthGrid(year, month);
  const today = getLocalDateString();

  const shift = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  return (
    <ScreenLayout
      eyebrow="History"
      title="Calendar"
      subtitle="Your worship, day by day"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.header}>
            <NavButton
              icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
              label="Previous month"
              onPress={() => shift(-1)}
            />
            <ThemedText type="subtitle">{monthLabel(year, month)}</ThemedText>
            <NavButton
              icon={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              label="Next month"
              onPress={() => shift(1)}
            />
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((weekday) => (
              <View key={weekday.key} style={styles.cell}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {weekday.label}
                </ThemedText>
              </View>
            ))}
          </View>

          {weeks.map((week) => (
            <View key={week[0]?.date} style={styles.weekRow}>
              {week.map((day) => {
                const info = activity.get(day.date);
                const level = info?.level ?? 0;
                const hasMiss = (info?.missed ?? 0) > 0;
                const fill =
                  level > 0
                    ? withAlpha(tokens.status.success.color, 0.2 + level * 0.55)
                    : "transparent";
                const disabled = !day.inMonth || day.isFuture;

                return (
                  <Pressable
                    key={day.date}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={day.date}
                    onPress={() =>
                      router.push({ pathname: "/calendar/[date]", params: { date: day.date } })
                    }
                    style={styles.cell}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        { backgroundColor: fill },
                        day.isToday && { borderColor: colors.accent, borderWidth: 2 },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: day.inMonth ? colors.foreground : colors.mutedForeground,
                          opacity: disabled && !day.isToday ? 0.4 : 1,
                        }}
                      >
                        {day.day}
                      </ThemedText>
                    </View>
                    {hasMiss ? (
                      <View style={[styles.dot, { backgroundColor: tokens.status.danger.color }]} />
                    ) : (
                      <View style={styles.dot} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Card>

        <Card variant="muted" padding="three">
          <View style={styles.legend}>
            <LegendSwatch color={withAlpha(tokens.status.success.color, 0.75)} label="Prayed" />
            <LegendSwatch color={withAlpha(tokens.status.success.color, 0.3)} label="Partial" />
            <LegendDot color={tokens.status.danger.color} label="Missed" />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
            Tap any past or current day to review and adjust it. Today is {today}.
          </ThemedText>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

function NavButton({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.navButton, { backgroundColor: tokens.accentSoft }]}
    >
      <SymbolView name={icon} size={18} tintColor={colors.accent} />
    </PressableScale>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color }]} />
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  legend: {
    flexDirection: "row",
    gap: Spacing.four,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendHint: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
});
