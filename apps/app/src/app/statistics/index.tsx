import { getZikrById } from "@munib-tracker/shared/content";
import type {
  PrayerLog,
  QazaCounter,
  QazaRozaCounter,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import {
  addDays,
  buildDayActivity,
  dailyCompletionSeries,
  getLocalDateString,
  parseLocalDateString,
  sumPrayerTotals,
} from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type Period = "week" | "month" | "year";

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function StatisticsScreen() {
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const [period, setPeriod] = useState<Period>("week");
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [zikr, setZikr] = useState<ZikrProgress[]>([]);
  const [counters, setCounters] = useState<QazaCounter[]>([]);
  const [roza, setRoza] = useState<QazaRozaCounter>({ remaining: 0, completed: 0 });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void Promise.all([
        PrayerRepository.getAll(),
        ZikrRepository.getAll(),
        QazaRepository.getCounters(),
        QazaRepository.getRoza(),
      ]).then(([l, z, c, r]) => {
        if (!active) return;
        setLogs(l);
        setZikr(z);
        setCounters(c);
        setRoza(r);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const today = getLocalDateString();

  const { chart, from } = useMemo(() => {
    if (period === "year") {
      const year = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const bars: BarDatum[] = MONTH_INITIALS.map((label, month) => {
        if (month > currentMonth) return { label, value: 0 };
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const lastDay = month === currentMonth ? new Date().getDate() : daysInMonth;
        let sum = 0;
        for (let day = 1; day <= lastDay; day += 1) {
          const date = `${year}-${`${month + 1}`.padStart(2, "0")}-${`${day}`.padStart(2, "0")}`;
          sum += buildDayActivity(logs, date).level;
        }
        return { label, value: lastDay ? sum / lastDay : 0 };
      });
      return { chart: bars, from: `${year}-01-01` };
    }

    const days = period === "week" ? 7 : 30;
    const series = dailyCompletionSeries(logs, days, today);
    const bars: BarDatum[] = series.map((activity, index) => {
      const d = parseLocalDateString(activity.date);
      const label =
        period === "week"
          ? d.toLocaleDateString(undefined, { weekday: "narrow" })
          : index % 5 === 0
            ? `${d.getDate()}`
            : "";
      return { label, value: activity.level };
    });
    return { chart: bars, from: addDays(today, -(days - 1)) };
  }, [period, logs, today]);

  const prayerTotals = useMemo(() => sumPrayerTotals(logs, from, today), [logs, from, today]);

  const zikrCompleted = useMemo(
    () => zikr.filter((z) => z.completed && z.date >= from && z.date <= today).length,
    [zikr, from, today],
  );

  const zikrByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of zikr) {
      if (!entry.completed || entry.date < from || entry.date > today) continue;
      const category = getZikrById(entry.zikrId)?.categoryId ?? "anytime";
      map.set(category, (map.get(category) ?? 0) + 1);
    }
    return map;
  }, [zikr, from, today]);

  const qazaRemaining = counters.reduce((sum, c) => sum + c.remaining, 0);
  const qazaCompleted = counters.reduce((sum, c) => sum + c.completed, 0);

  return (
    <ScreenLayout
      eyebrow="Insights"
      title="Statistics"
      subtitle="Trends across prayer, qaza, and zikr"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <SegmentedControl<Period>
          options={[
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
            { id: "year", label: "Year" },
          ]}
          value={period}
          onChange={setPeriod}
        />

        <Card padding="three">
          <SectionHeader
            title="Prayer completion"
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          />
          <View style={styles.chart}>
            <BarChart data={chart} color={tokens.status.success.color} />
          </View>
        </Card>

        <View style={styles.grid}>
          <StatPair
            title="Prayer"
            primary={prayerTotals.completed}
            primaryLabel="completed"
            secondary={prayerTotals.missed}
            secondaryLabel="missed"
            primaryColor={tokens.status.success.color}
            secondaryColor={tokens.status.danger.color}
          />
          <StatPair
            title="Qaza"
            primary={qazaRemaining}
            primaryLabel="remaining"
            secondary={qazaCompleted}
            secondaryLabel="made up"
            primaryColor={tokens.status.info.color}
            secondaryColor={tokens.status.success.color}
          />
          <StatPair
            title="Roza"
            primary={roza.remaining}
            primaryLabel="remaining"
            secondary={roza.completed}
            secondaryLabel="completed"
            primaryColor={tokens.status.info.color}
            secondaryColor={tokens.status.success.color}
          />
          <StatPair
            title="Zikr"
            primary={zikrCompleted}
            primaryLabel="completed"
            secondary={zikrByCategory.size}
            secondaryLabel="categories"
            primaryColor={tokens.status.warning.color}
            secondaryColor={tokens.status.info.color}
          />
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

function StatPair({
  title,
  primary,
  primaryLabel,
  secondary,
  secondaryLabel,
  primaryColor,
  secondaryColor,
}: {
  title: string;
  primary: number;
  primaryLabel: string;
  secondary: number;
  secondaryLabel: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <Card padding="three" style={styles.pair}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {title}
      </ThemedText>
      <View style={styles.pairRow}>
        <View style={styles.pairStat}>
          <ThemedText type="header" style={{ color: primaryColor }}>
            {primary}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {primaryLabel}
          </ThemedText>
        </View>
        <View style={styles.pairStat}>
          <ThemedText type="header" style={{ color: secondaryColor }}>
            {secondary}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {secondaryLabel}
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: {
    marginTop: Spacing.three,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  pair: {
    flexGrow: 1,
    flexBasis: "47%",
    gap: Spacing.two,
  },
  pairRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pairStat: {
    alignItems: "center",
    gap: 2,
  },
});
