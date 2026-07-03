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
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { StatPair } from "@/components/ui/stat-pair";
import { Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type Period = "week" | "month" | "year";

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function StatisticsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
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
      eyebrow={t("statistics.eyebrow")}
      title={t("statistics.title")}
      subtitle={t("statistics.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <SegmentedControl<Period>
          options={[
            { id: "week", label: t("statistics.week") },
            { id: "month", label: t("statistics.month") },
            { id: "year", label: t("statistics.year") },
          ]}
          value={period}
          onChange={setPeriod}
        />

        <Card padding="three">
          <SectionHeader
            title={t("statistics.prayerCompletion")}
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          />
          <View style={styles.chart}>
            <BarChart data={chart} color={tokens.status.success.color} />
          </View>
        </Card>

        <View style={styles.grid}>
          <TitledStatPair
            title={t("statistics.prayer")}
            primary={{
              value: prayerTotals.completed,
              label: t("stats.completed"),
              color: tokens.status.success.color,
            }}
            secondary={{
              value: prayerTotals.missed,
              label: t("stats.missed"),
              color: tokens.status.danger.color,
            }}
          />
          <TitledStatPair
            title={t("statistics.qaza")}
            primary={{
              value: qazaRemaining,
              label: t("stats.remaining"),
              color: tokens.status.info.color,
            }}
            secondary={{
              value: qazaCompleted,
              label: t("stats.madeUp"),
              color: tokens.status.success.color,
            }}
          />
          <TitledStatPair
            title={t("statistics.roza")}
            primary={{
              value: roza.remaining,
              label: t("stats.remaining"),
              color: tokens.status.info.color,
            }}
            secondary={{
              value: roza.completed,
              label: t("stats.completed"),
              color: tokens.status.success.color,
            }}
          />
          <TitledStatPair
            title={t("statistics.zikr")}
            primary={{
              value: zikrCompleted,
              label: t("stats.completed"),
              color: tokens.status.warning.color,
            }}
            secondary={{
              value: zikrByCategory.size,
              label: t("stats.categories"),
              color: tokens.status.info.color,
            }}
          />
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

type StatItem = { value: number; label: string; color: string };

function TitledStatPair({
  title,
  primary,
  secondary,
}: {
  title: string;
  primary: StatItem;
  secondary: StatItem;
}) {
  return (
    <Card padding="three" style={styles.pair}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {title}
      </ThemedText>
      <StatPair size="header" primary={primary} secondary={secondary} />
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
});
