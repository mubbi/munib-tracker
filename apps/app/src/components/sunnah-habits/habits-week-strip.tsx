import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localizedWeekdayInitials } from "@/lib/calendar";

type HabitsWeekStripProps = {
  /** Oldest → newest (see `weekSummary`). */
  days: readonly { date: string; done: number; total: number }[];
  /** Today's date — its column is emphasised. */
  today: string;
  /** "Most consistent: …" line, when some habit stands out. */
  footnote?: string;
};

const BAR_HEIGHT = 28;

function weekdayIndex(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, d ?? 1).getDay();
}

/**
 * One compact "This week" strip for the whole list (replaces the per-row 30-day
 * dots): a soft bar per day filled by the share of habits kept. Start → end is
 * oldest → newest, so RTL flips with the layout. No streak or "missed" wording.
 */
export function HabitsWeekStrip({ days, today, footnote }: HabitsWeekStripProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const weekdays = useMemo(() => localizedWeekdayInitials(i18n.language ?? "en"), [i18n.language]);

  return (
    <Card>
      <ThemedText type="smallBold">{t("sunnahHabits.week.title")}</ThemedText>
      <View style={styles.row}>
        {days.map((day) => {
          const share = day.total > 0 ? Math.min(1, day.done / day.total) : 0;
          const label = weekdays[weekdayIndex(day.date)]?.label ?? "";
          const isToday = day.date === today;
          return (
            <View
              key={day.date}
              style={styles.day}
              accessible
              accessibilityRole="text"
              accessibilityLabel={t("sunnahHabits.week.dayA11y", {
                day: label,
                done: day.done,
                total: day.total,
              })}
            >
              <View
                style={[
                  styles.track,
                  { backgroundColor: colors.muted, borderColor: tokens.hairline },
                ]}
              >
                {share > 0 ? (
                  <View
                    style={[
                      styles.fill,
                      {
                        height: Math.max(4, Math.round(BAR_HEIGHT * share)),
                        backgroundColor:
                          share >= 1 ? tokens.status.success.color : tokens.accentBorder,
                      },
                    ]}
                  />
                ) : null}
              </View>
              <ThemedText
                type="caption"
                themeColor={isToday ? undefined : "mutedForeground"}
                weight={isToday ? "bold" : undefined}
              >
                {label}
              </ThemedText>
            </View>
          );
        })}
      </View>
      {footnote ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footnote}>
          {footnote}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  day: { flex: 1, alignItems: "center", gap: Spacing.half },
  track: {
    width: 14,
    height: BAR_HEIGHT,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: { width: "100%", borderRadius: Radius.sm },
  footnote: { marginTop: Spacing.two },
});
