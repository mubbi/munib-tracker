import { OBLIGATORY_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type {
  PrayerId,
  PrayerLog,
  QazaCounter,
  QazaDailyProgress,
  QazaRozaCounter,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import { getLocalDateString, parseLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import {
  CardDivider,
  LinkRow,
  type Metric,
  MetricGrid,
  ReadableView,
  StatLine,
  StatsGroup,
} from "@/components/statistics/metrics";
import { RawatibStatsCard } from "@/components/statistics/rawatib-stats-card";
import { SalahRateList } from "@/components/statistics/salah-rate-list";
import { StatusDistribution } from "@/components/statistics/status-distribution";
import { TodaySalahStrip } from "@/components/statistics/today-salah-strip";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import {
  HadithRepository,
  PrayerRepository,
  QazaRepository,
  QuranRepository,
  ZikrRepository,
} from "@/db";
import type { QuranReadingProgress } from "@/db/repositories/quran-repository";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  adhkarSetHistory,
  adhkarSetKey,
  adhkarSetsForDay,
  zikrCountsByDate,
} from "@/lib/adhkar-history";
import { masjidPrayerStats } from "@/lib/masjid/masjid-stats";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { getSurahMeta } from "@/lib/quran-meta";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  averageLevel,
  dailyPoints,
  indexPrayerDays,
  monthlyPoints,
  periodRange,
  projectQazaFinish,
  type StatsPeriod,
  salahBreakdown,
  salahExtremes,
  strongestWeekday,
  summarizePeriod,
  summarizeQuranReading,
  sumQazaMadeUp,
} from "@/lib/statistics";
import { ZIKR_CORPUS } from "@/lib/zikr";
import { useEnsureFastingLoaded, useFastingDays } from "@/stores/fasting-store";
import {
  useAchievementStats,
  useDailySummary,
  useDayExcused,
  useDevotionProgress,
  useQazaSchedule,
  useStreak,
  useTodayPrayers,
  useTrackerActions,
} from "@/stores/tracker-store";

const PERIOD_HINT_KEYS: Record<StatsPeriod, string> = {
  week: "statistics.periodWeek",
  month: "statistics.periodMonth",
  year: "statistics.periodYear",
};

const COMPARE_KEYS: Record<StatsPeriod, string> = {
  week: "statistics.compareWeek",
  month: "statistics.compareMonth",
  year: "statistics.compareYear",
};

const SUNNAH_STAT_PRAYERS: PrayerId[] = ["tahajjud", "ishraq", "duha"];
const TODAY_STRIP_PRAYERS: PrayerId[] = [...OBLIGATORY_PRAYERS, WITR_PRAYER];

type Insight = {
  key: string;
  icon: SymbolViewProps["name"];
  text: string;
  tone: "success" | "warning" | "info";
};

type LoadedData = {
  logs: PrayerLog[];
  zikr: ZikrProgress[];
  counters: QazaCounter[];
  roza: QazaRozaCounter;
  qazaDaily: Record<string, QazaDailyProgress>;
  quranProgress: QuranReadingProgress;
  quranBookmarks: number;
  hadithBookmarks: number;
};

export default function StatisticsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { refresh } = useTrackerActions();
  const summary = useDailySummary();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const achievementStats = useAchievementStats();
  const todayPrayers = useTodayPrayers();
  const excusedToday = useDayExcused();
  const qazaSchedule = useQazaSchedule();
  useEnsureFastingLoaded();
  const fastingDays = useFastingDays();
  const tv = isTV();
  const { date: adhkarDate } = useAdhkarClock();
  const { width } = useWindowDimensions();
  // Wide web / tablets (never TV): cards side by side, blocks in grids.
  const wide = !tv && width >= 1024;
  const [period, setPeriod] = useState<StatsPeriod>("week");
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [data, setData] = useState<LoadedData | null>(null);
  // The corpus maps stored zikr ids to their set — memos below must recompute
  // once it lands, or a cold open shows every adhkar set as empty.
  const { ready: corpusReady } = useContentCorpus(ZIKR_CORPUS);

  const locale = i18n.language?.split("-")[0];
  const formatCount = useCallback((value: number) => value.toLocaleString(locale), [locale]);
  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
  const formatShortDate = (date: string) => shortDate(date, locale);

  useFocusEffect(
    useCallback(() => {
      trackReviewInteraction("view_statistics");
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void Promise.all([
        refresh(),
        PrayerRepository.getAll(),
        ZikrRepository.getAll(),
        QazaRepository.getCounters(),
        QazaRepository.getRoza(),
        QazaRepository.getAllDailyProgress(),
        QuranRepository.getReadingProgress(),
        QuranRepository.getBookmarks(),
        HadithRepository.getBookmarks(),
      ]).then(([_, logs, zikr, counters, roza, qazaDaily, quranProgress, qB, hB]) => {
        if (!active) return;
        setData({
          logs,
          zikr,
          counters,
          roza,
          qazaDaily,
          quranProgress,
          quranBookmarks: qB.length,
          hadithBookmarks: hB.length,
        });
      });
      return () => {
        active = false;
      };
    }, [refresh]),
  );

  const today = getLocalDateString();
  const logs = data?.logs ?? EMPTY_LOGS;
  const zikr = data?.zikr ?? EMPTY_ZIKR;
  const index = useMemo(() => indexPrayerDays(logs), [logs]);
  const range = useMemo(() => periodRange(period, today), [period, today]);
  const points = useMemo(
    () => dailyPoints(index, range.from, range.to, today),
    [index, range, today],
  );
  const previousAverage = useMemo(
    () => averageLevel(dailyPoints(index, range.previousFrom, range.previousTo, today)),
    [index, range, today],
  );
  const periodSummary = useMemo(() => summarizePeriod(index, points), [index, points]);
  const months = useMemo(
    () => (period === "year" ? monthlyPoints(index, today) : null),
    [period, index, today],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new period clears the inspected bar
  useEffect(() => setSelectedBar(null), [period]);

  const chart: BarDatum[] = useMemo(() => {
    if (months) {
      return months.map((month) => {
        const name = new Date(2000, month.month, 1).toLocaleDateString(locale, { month: "long" });
        const narrow = new Date(2000, month.month, 1).toLocaleDateString(locale, {
          month: "narrow",
        });
        return {
          label: narrow,
          value: month.level ?? 0,
          tone:
            month.future || month.level == null
              ? "muted"
              : month.isCurrent
                ? "highlight"
                : "default",
          accessibilityLabel:
            month.level == null
              ? t("statistics.monthNoData", { month: name })
              : t("statistics.monthDetail", {
                  month: name,
                  percent: Math.round(month.level * 100),
                }),
        };
      });
    }
    const tickIndexes =
      period === "month"
        ? new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])
        : null;
    return points.map((point, i) => {
      const d = parseLocalDateString(point.date);
      const day = index.days.get(point.date);
      let label = "";
      if (period === "week") label = d.toLocaleDateString(locale, { weekday: "short" });
      else if (tickIndexes?.has(i)) label = shortDate(point.date, locale);
      const date = dayDate(point.date, locale);
      const accessibilityLabel = point.excused
        ? t("statistics.dayExcused", { date })
        : point.beforeStart
          ? t("statistics.dayNotTracked", { date })
          : day
            ? t("statistics.dayDetail", {
                date,
                done: day.completed,
                total: OBLIGATORY_PRAYERS.length,
              })
            : t("statistics.dayNotLogged", { date });
      return {
        label,
        value: point.level,
        tone: point.excused
          ? "excused"
          : point.beforeStart
            ? "muted"
            : point.isToday
              ? "highlight"
              : "default",
        accessibilityLabel,
      };
    });
  }, [months, points, period, index, locale, t]);

  const average = periodSummary.average;
  const delta =
    average != null && previousAverage != null
      ? Math.round((average - previousAverage) * 100)
      : null;

  const fardRows = useMemo(
    () => salahBreakdown(index, points, OBLIGATORY_PRAYERS),
    [index, points],
  );
  const witrRow = useMemo(() => salahBreakdown(index, points, [WITR_PRAYER])[0], [index, points]);
  const rateRows =
    witrRow &&
    witrRow.days > 0 &&
    witrRow.completed + witrRow.delayed + witrRow.missed + witrRow.qaza > 0
      ? [...fardRows, witrRow]
      : fardRows;
  const extremes = useMemo(() => salahExtremes(fardRows), [fardRows]);
  const bestWeekday = useMemo(
    () => (period === "week" ? null : strongestWeekday(points)),
    [period, points],
  );

  const sunnahCounts = useMemo(() => {
    const counts = new Map<PrayerId, number>();
    let jama = 0;
    for (const log of logs) {
      if (log.date < range.from || log.date > range.to || log.status !== "completed") continue;
      if (SUNNAH_STAT_PRAYERS.includes(log.prayerId)) {
        counts.set(log.prayerId, (counts.get(log.prayerId) ?? 0) + 1);
      } else if (log.isJama) {
        jama += 1;
      }
    }
    return { counts, jama };
  }, [logs, range]);

  const zikrInPeriod = useMemo(
    () => zikr.filter((z) => z.completed && z.date >= range.from && z.date <= range.to).length,
    [zikr, range],
  );
  const adhkarHistory = useMemo(
    () => (corpusReady ? adhkarSetHistory(zikr, range.from, range.to) : []),
    [corpusReady, zikr, range],
  );
  const hasAdhkarHistory = adhkarHistory.some((row) => row.doneDays > 0 || row.partialDays > 0);
  // Today's sets on the adhkar day (Fajr → Fajr), the day sessions log under.
  const todaySets = useMemo(() => {
    if (!corpusReady) return null;
    const sets = adhkarSetsForDay(zikrCountsByDate(zikr).get(adhkarDate) ?? {});
    return { done: sets.filter((set) => set.done).length, total: sets.length };
  }, [corpusReady, zikr, adhkarDate]);

  const counters = data?.counters ?? [];
  const roza = data?.roza ?? { remaining: 0, completed: 0 };
  const qazaDaily = data?.qazaDaily ?? {};
  const qazaRemaining = counters.reduce((sum, c) => sum + c.remaining, 0);
  const qazaCompleted = counters.reduce((sum, c) => sum + c.completed, 0);
  const qazaTotal = qazaRemaining + qazaCompleted;
  const qazaInPeriod = useMemo(
    () => sumQazaMadeUp(qazaDaily, range.from, range.to),
    [qazaDaily, range],
  );
  const elapsedDays = points.length;
  const projection = useMemo(
    () => projectQazaFinish(qazaRemaining, qazaDaily, qazaSchedule, today),
    [qazaRemaining, qazaDaily, qazaSchedule, today],
  );
  const rozaTotal = roza.remaining + roza.completed;
  const ramadanFasts = useMemo(
    () => Object.values(fastingDays).filter((status) => status === "fasted").length,
    [fastingDays],
  );
  const perPrayerQaza = counters.filter((c) => c.remaining > 0 || c.completed > 0);
  const hasDebt = qazaTotal > 0 || rozaTotal > 0 || ramadanFasts > 0;

  const reading = useMemo(
    () => summarizeQuranReading(data?.quranProgress ?? {}, getSurahMeta()),
    [data?.quranProgress],
  );
  const quranBookmarks = data?.quranBookmarks ?? 0;
  const hadithBookmarks = data?.hadithBookmarks ?? 0;
  const hasReadingData = reading.surahsStarted > 0 || quranBookmarks > 0 || hadithBookmarks > 0;

  const loaded = data != null;
  const isEmpty =
    loaded && logs.length === 0 && zikr.length === 0 && qazaTotal === 0 && !hasReadingData;

  const insights: Insight[] = [];
  if (extremes.strongest?.onTimeRate != null) {
    insights.push({
      key: "strongest",
      icon: { ios: "star.fill", android: "star", web: "star" },
      tone: "success",
      text: t("statistics.insightStrongest", {
        salah: t(`prayers.${extremes.strongest.prayerId}`),
        percent: Math.round(extremes.strongest.onTimeRate * 100),
      }),
    });
  }
  if (extremes.weakest?.onTimeRate != null && extremes.weakest.onTimeRate < 0.8) {
    insights.push({
      key: "weakest",
      icon: { ios: "leaf.fill", android: "eco", web: "eco" },
      tone: "warning",
      text: t("statistics.insightWeakest", {
        salah: t(`prayers.${extremes.weakest.prayerId}`),
        percent: Math.round(extremes.weakest.onTimeRate * 100),
      }),
    });
  }
  if (bestWeekday != null) {
    // 2000-01-02 was a Sunday — offset to the weekday for a localized name.
    const day = new Date(2000, 0, 2 + bestWeekday).toLocaleDateString(locale, { weekday: "long" });
    insights.push({
      key: "weekday",
      icon: { ios: "calendar", android: "calendar_today", web: "calendar_today" },
      tone: "info",
      text: t("statistics.insightBestDay", { day }),
    });
  }
  if (periodSummary.bestPerfectRun >= 2) {
    insights.push({
      key: "run",
      icon: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
      tone: "warning",
      text: t("statistics.insightPerfectRun", { value: formatCount(periodSummary.bestPerfectRun) }),
    });
  }
  if (periodSummary.excusedDays > 0) {
    insights.push({
      key: "excused",
      icon: { ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" },
      tone: "info",
      text: t("statistics.insightExcused", { value: formatCount(periodSummary.excusedDays) }),
    });
  }

  const selectedDetail = selectedBar != null ? chart[selectedBar]?.accessibilityLabel : null;

  const lifetimeMetrics: Metric[] = [
    {
      value: formatCount(streak),
      label: t("statistics.streak"),
      color: tokens.status.warning.text,
    },
    {
      value: formatCount(achievementStats.bestStreak),
      label: t("statistics.bestStreak"),
      color: tokens.status.warning.text,
    },
    {
      value: formatCount(achievementStats.prayersCompleted),
      label: t("statistics.salahOnTime"),
      color: tokens.status.success.text,
    },
    {
      value: formatCount(achievementStats.perfectDays),
      label: t("statistics.perfectDays"),
      color: tokens.status.info.text,
    },
  ];

  const qazaTodayValue =
    summary.qazaTargetToday > 0
      ? `${summary.qazaCompletedToday}/${summary.qazaTargetToday}`
      : `${summary.qazaCompletedToday}`;
  const todayMetrics: Metric[] = [
    {
      value: `${summary.salahCompleted}/${summary.salahTotal}`,
      label: t("statistics.todayPrayers"),
      color: tokens.status.success.text,
    },
    {
      value: todaySets ? `${todaySets.done}/${todaySets.total}` : "—",
      label: t("statistics.todayAdhkarSets"),
      color: tokens.status.danger.text,
    },
    { value: qazaTodayValue, label: t("statistics.todayQaza"), color: tokens.status.info.text },
  ];

  const toneColors = (tone: Insight["tone"]) => ({
    color: tokens.status[tone].text,
    background: tokens.status[tone].soft,
  });

  const rangeLabel =
    period === "year"
      ? t(PERIOD_HINT_KEYS.year)
      : t("statistics.periodWithRange", {
          period: t(PERIOD_HINT_KEYS[period]),
          range: `${formatShortDate(range.from)} – ${formatShortDate(range.to)}`,
        });

  const statusTotal =
    periodSummary.completed +
    periodSummary.delayed +
    periodSummary.qaza +
    periodSummary.missed +
    periodSummary.unlogged;

  const statusBlock = (
    <ReadableView style={styles.block}>
      <BlockTitle title={t("statistics.statusMix")} />
      <View style={[styles.blockShell, { backgroundColor: colors.muted }]}>
        <StatusDistribution
          formatValue={formatCount}
          segments={[
            {
              key: "completed",
              label: t("statistics.statusOnTime"),
              amount: periodSummary.completed,
              color: tokens.status.success.color,
            },
            {
              key: "delayed",
              label: t("prayerStatus.delayed"),
              amount: periodSummary.delayed,
              color: tokens.status.warning.color,
            },
            {
              key: "qaza",
              label: t("prayerStatus.qaza"),
              amount: periodSummary.qaza,
              color: tokens.status.info.color,
            },
            {
              key: "missed",
              label: t("prayerStatus.missed"),
              amount: periodSummary.missed,
              color: tokens.status.danger.color,
            },
            {
              key: "unlogged",
              label: t("statistics.statusUnlogged"),
              amount: periodSummary.unlogged,
              color: tokens.track,
            },
          ]}
          accessibilityLabel={t("statistics.statusMixA11y", {
            completed: formatCount(periodSummary.completed),
            total: formatCount(statusTotal),
          })}
        />
      </View>
    </ReadableView>
  );
  const perSalahBlock = (
    <View style={styles.block}>
      <BlockTitle title={t("statistics.perSalah")} hint={t("statistics.perSalahHint")} />
      <SalahRateList rows={rateRows} formatCount={formatCount} />
    </View>
  );
  const consistencyBlock = (
    <StatsGroup
      title={t("statistics.consistency")}
      columns={2}
      metrics={[
        {
          value: formatCount(periodSummary.perfectDays),
          label: t("stats.perfectDays"),
          color: tokens.status.success.text,
        },
        {
          value: formatCount(periodSummary.activeDays),
          label: t("stats.activeDays"),
          color: tokens.status.info.text,
        },
        {
          value: formatCount(periodSummary.bestPerfectRun),
          label: t("statistics.longestPerfectRun"),
          color: tokens.status.warning.text,
        },
        {
          value: formatCount(sunnahCounts.jama),
          label: t("statistics.jama"),
          color: colors.accentText,
        },
      ]}
    />
  );
  const zikrQazaBlock = (
    <StatsGroup
      title={t("statistics.zikrAndQaza")}
      columns={2}
      metrics={[
        {
          value: formatCount(zikrInPeriod),
          label: t("statistics.zikrThisPeriod"),
          color: tokens.status.danger.text,
        },
        {
          value: formatCount(achievementStats.zikrCompleted),
          label: t("statistics.zikrAllTime"),
          color: tokens.status.danger.text,
        },
        {
          value: formatCount(qazaInPeriod),
          label: t("statistics.qazaThisPeriod"),
          color: tokens.status.info.text,
        },
        {
          value: (qazaInPeriod / Math.max(1, elapsedDays)).toLocaleString(locale, {
            maximumFractionDigits: 1,
          }),
          label: t("statistics.qazaPerDay"),
          color: tokens.status.info.text,
        },
      ]}
    />
  );
  const sunnahBlock =
    sunnahCounts.counts.size > 0 ? (
      <StatsGroup
        title={t("statistics.sunnah")}
        columns={sunnahCounts.counts.size >= 3 ? 3 : 2}
        metrics={SUNNAH_STAT_PRAYERS.filter((p) => sunnahCounts.counts.has(p)).map((p) => ({
          value: formatCount(sunnahCounts.counts.get(p) ?? 0),
          label: t(`prayers.${p}`),
          color: colors.accentText,
        }))}
      />
    ) : null;
  // NF-3.11: Salah logged at the masjid — only rendered when the period has any.
  const masjidStats = useMemo(
    () => masjidPrayerStats(logs, range.from, [range.to, today].sort()[0] ?? today),
    [logs, range, today],
  );
  const masjidBlock =
    masjidStats.count > 0 ? (
      <StatsGroup
        title={t("masjidLog.statsTitle")}
        columns={2}
        metrics={[
          {
            value: formatCount(masjidStats.count),
            label: t("masjidLog.statsCount"),
            color: colors.accentText,
          },
          {
            value: masjidStats.perWeek.toLocaleString(locale, { maximumFractionDigits: 1 }),
            label: t("masjidLog.statsPerWeek"),
            color: tokens.status.success.text,
          },
        ]}
      />
    ) : null;
  const adhkarBlock = hasAdhkarHistory ? (
    <View style={styles.block}>
      <BlockTitle title={t("statistics.adhkarBySet")} hint={t("statistics.adhkarBySetHint")} />
      <View style={[styles.detailList, { backgroundColor: colors.muted }]}>
        {adhkarHistory.map((row, i) => (
          <TvReadableBlock key={adhkarSetKey(row.scope)}>
            {i > 0 ? (
              <View style={[styles.listDivider, { backgroundColor: tokens.hairline }]} />
            ) : null}
            <StatLine
              label={
                row.scope.prayer
                  ? t("zikrSession.afterPrayerEyebrow", {
                      prayer: t(`prayers.${row.scope.prayer}`),
                    })
                  : t(`zikrCat.${row.scope.categoryId}`)
              }
              value={t("statistics.adhkarDays", {
                done: formatCount(row.doneDays),
                days: formatCount(row.days),
              })}
              color={tokens.status.success.text}
              bar={row.days > 0 ? row.doneDays / row.days : 0}
            />
          </TvReadableBlock>
        ))}
      </View>
    </View>
  ) : null;

  return (
    <ScreenLayout
      eyebrow={t("statistics.eyebrow")}
      title={t("statistics.title")}
      subtitle={t("statistics.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/statistics" />
      {!loaded ? (
        <StatisticsSkeleton />
      ) : isEmpty ? (
        <Card padding="four">
          <EmptyState
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
            title={t("statistics.emptyTitle")}
            description={t("statistics.emptyDesc")}
            actionLabel={t("statistics.openTracker")}
            onAction={() => router.push("/tracker")}
          />
        </Card>
      ) : (
        <Stagger>
          <View style={styles.stack}>
            {/* ── Journey + today ─────────────────────────────────────────── */}
            <ResponsiveGrid columns={wide ? 2 : 1} gap={Spacing.four}>
              <Card padding="four" style={[styles.journeyCard, wide ? styles.fill : null]}>
                <ReadableView style={styles.heroRow}>
                  <View
                    style={[
                      styles.devotionBadge,
                      tv ? { width: tvDp(64), height: tvDp(64) } : null,
                      { backgroundColor: tokens.status.warning.soft },
                    ]}
                  >
                    <ThemedText type="title" style={{ color: tokens.status.warning.text }}>
                      {devotion.level}
                    </ThemedText>
                  </View>
                  <View style={styles.heroCopy}>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("achievements.devotion")}
                    </ThemedText>
                    <ThemedText type="subtitle">
                      {t("achievements.devotionLevel", { level: devotion.level })}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("achievements.devotionNoor", {
                        current: formatCount(devotion.noor - devotion.noorForCurrentLevel),
                        next: formatCount(devotion.noorForNextLevel - devotion.noorForCurrentLevel),
                      })}
                    </ThemedText>
                  </View>
                </ReadableView>
                <ProgressBar value={devotion.progress} color={tokens.status.warning.color} />
                <ReadableView style={[styles.metricShell, { backgroundColor: colors.muted }]}>
                  <MetricGrid metrics={lifetimeMetrics} columns={2} />
                </ReadableView>
                <LinkRow
                  label={t("statistics.viewAchievements")}
                  onPress={() => router.push("/achievements")}
                />
              </Card>

              <Card padding="four" style={[styles.journeyCard, wide ? styles.fill : null]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderCopy}>
                    <ThemedText type="subtitle">{t("statistics.today")}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {parseLocalDateString(today).toLocaleDateString(locale, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </ThemedText>
                  </View>
                  {excusedToday ? (
                    <View style={[styles.pill, { backgroundColor: tokens.status.info.soft }]}>
                      <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
                        {t("statistics.todayExcused")}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
                <TvReadableBlock>
                  <TodaySalahStrip prayers={TODAY_STRIP_PRAYERS} statuses={todayPrayers.status} />
                </TvReadableBlock>
                <ReadableView style={[styles.metricShell, { backgroundColor: colors.muted }]}>
                  <MetricGrid metrics={todayMetrics} columns={3} />
                </ReadableView>
                <View style={styles.spacer} />
                <LinkRow
                  label={t("statistics.openTracker")}
                  onPress={() => router.push("/tracker")}
                />
              </Card>
            </ResponsiveGrid>

            {/* ── Trends ──────────────────────────────────────────────────── */}
            <Card padding="four" style={styles.trendsCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderCopy}>
                  <ThemedText type="subtitle">{t("statistics.trends")}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {rangeLabel}
                  </ThemedText>
                </View>
                <View style={styles.pillColumn}>
                  {average != null ? (
                    <View style={[styles.pill, { backgroundColor: tokens.status.success.soft }]}>
                      <ThemedText type="smallBold" style={{ color: tokens.status.success.text }}>
                        {t("statistics.avgOnTime", { percent: Math.round(average * 100) })}
                      </ThemedText>
                    </View>
                  ) : null}
                  {delta != null ? (
                    <ThemedText
                      type="caption"
                      style={{
                        color:
                          delta > 0
                            ? tokens.status.success.text
                            : delta < 0
                              ? tokens.status.danger.text
                              : colors.mutedForeground,
                      }}
                    >
                      {t(COMPARE_KEYS[period], {
                        delta: `${delta > 0 ? "▲" : delta < 0 ? "▼" : "•"} ${Math.abs(delta)}%`,
                      })}
                    </ThemedText>
                  ) : null}
                </View>
              </View>

              <SegmentedControl<StatsPeriod>
                options={[
                  { id: "week", label: t("statistics.week") },
                  { id: "month", label: t("statistics.month") },
                  { id: "year", label: t("statistics.year") },
                ]}
                value={period}
                onChange={setPeriod}
              />

              <BarChart
                data={chart}
                color={tokens.status.success.color}
                height={period === "week" ? 132 : 120}
                emptyLabel={t("statistics.chartEmpty")}
                average={average}
                selectedIndex={selectedBar}
                onSelect={(i) => setSelectedBar((current) => (current === i ? null : i))}
              />

              <View style={styles.chartFooter}>
                {selectedDetail ? (
                  <ThemedText type="smallBold" style={styles.chartDetail}>
                    {selectedDetail}
                  </ThemedText>
                ) : (
                  <View style={styles.legendRow}>
                    <LegendKey
                      swatch={
                        <View
                          style={[
                            styles.legendSwatch,
                            styles.legendToday,
                            { borderColor: tokens.status.success.color },
                          ]}
                        />
                      }
                      label={
                        period === "year"
                          ? t("statistics.legendThisMonth")
                          : t("statistics.legendToday")
                      }
                    />
                    {period !== "year" ? (
                      <LegendKey
                        swatch={
                          <View
                            style={[
                              styles.legendSwatch,
                              styles.legendExcused,
                              { borderColor: colors.mutedForeground },
                            ]}
                          />
                        }
                        label={t("statistics.legendExcused")}
                      />
                    ) : null}
                    <LegendKey
                      swatch={
                        <View
                          style={[styles.legendLine, { borderColor: tokens.status.success.color }]}
                        />
                      }
                      label={t("statistics.legendAverage")}
                    />
                    {!tv ? (
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {period === "year"
                          ? t("statistics.tapMonthHint")
                          : t("statistics.tapBarHint")}
                      </ThemedText>
                    ) : null}
                  </View>
                )}
              </View>

              {insights.length > 0 ? (
                <View style={styles.insights}>
                  {insights.map((insight) => {
                    const tone = toneColors(insight.tone);
                    return (
                      <View
                        key={insight.key}
                        style={[styles.insight, { backgroundColor: tone.background }]}
                      >
                        <SymbolView name={insight.icon} size={14} tintColor={tone.color} />
                        <ThemedText type="caption" style={{ color: tone.color }}>
                          {insight.text}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <CardDivider />

              {wide ? (
                <View style={styles.columns}>
                  <View style={styles.column}>
                    {statusBlock}
                    {consistencyBlock}
                    {zikrQazaBlock}
                    {sunnahBlock}
                    {masjidBlock}
                  </View>
                  <View style={styles.column}>
                    {perSalahBlock}
                    {adhkarBlock}
                  </View>
                </View>
              ) : (
                <View style={styles.column}>
                  {statusBlock}
                  {perSalahBlock}
                  {consistencyBlock}
                  {zikrQazaBlock}
                  {sunnahBlock}
                  {masjidBlock}
                  {adhkarBlock}
                </View>
              )}
              <LinkRow
                label={t("statistics.openCalendar")}
                onPress={() => router.push("/calendar")}
              />
            </Card>

            {/* ── Sunnah rawatib (NF-3.1) — separate from the fard rates above ── */}
            <RawatibStatsCard
              logs={logs}
              index={index}
              from={range.from}
              to={range.to}
              today={today}
              formatCount={formatCount}
            />

            {/* ── Lifetime make-up (qaza + fasting) and reading ───────────── */}
            <ResponsiveGrid columns={wide && hasDebt && hasReadingData ? 2 : 1} gap={Spacing.four}>
              {hasDebt ? (
                <Card padding="four" style={[styles.journeyCard, wide ? styles.fill : null]}>
                  <View style={styles.headerStack}>
                    <ThemedText type="subtitle">{t("statistics.debtTitle")}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("statistics.debtHint")}
                    </ThemedText>
                  </View>

                  {qazaTotal > 0 ? (
                    <ReadableView style={styles.block}>
                      <BlockTitle title={t("statistics.qaza")} />
                      <View style={styles.progressHeader}>
                        <ThemedText type="header" style={{ color: tokens.status.info.text }}>
                          {formatPercent(qazaCompleted / qazaTotal)}
                        </ThemedText>
                        <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
                          {t("statistics.madeUpOf", {
                            done: formatCount(qazaCompleted),
                            total: formatCount(qazaTotal),
                          })}
                        </ThemedText>
                      </View>
                      <ProgressBar
                        value={qazaCompleted / qazaTotal}
                        color={tokens.status.info.color}
                      />
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {qazaRemaining === 0
                          ? t("statistics.qazaCleared")
                          : projection
                            ? t(
                                projection.basis === "pace"
                                  ? "statistics.projectionPace"
                                  : "statistics.projectionPlan",
                                {
                                  perDay: projection.perDay.toLocaleString(locale, {
                                    maximumFractionDigits: 1,
                                  }),
                                  date: parseLocalDateString(
                                    projection.finishDate,
                                  ).toLocaleDateString(locale, { month: "long", year: "numeric" }),
                                },
                              )
                            : t("statistics.projectionNone")}
                      </ThemedText>
                    </ReadableView>
                  ) : null}

                  {perPrayerQaza.length > 0 ? (
                    <View style={[styles.detailList, { backgroundColor: colors.muted }]}>
                      {perPrayerQaza.map((counter, i) => {
                        const total = counter.remaining + counter.completed;
                        return (
                          <TvReadableBlock key={counter.prayerId}>
                            {i > 0 ? (
                              <View
                                style={[styles.listDivider, { backgroundColor: tokens.hairline }]}
                              />
                            ) : null}
                            <View style={styles.qazaRow}>
                              <IconWell icon={PRAYER_ICONS[counter.prayerId]} />
                              <View style={styles.qazaCopy}>
                                <ThemedText type="small">
                                  {t(`prayers.${counter.prayerId}`)}
                                </ThemedText>
                                <ProgressBar
                                  value={total > 0 ? counter.completed / total : 0}
                                  height={4}
                                  color={tokens.status.info.color}
                                />
                                <ThemedText type="caption" themeColor="mutedForeground">
                                  {t("qaza.rowMeta", {
                                    remaining: formatCount(counter.remaining),
                                    completed: formatCount(counter.completed),
                                  })}
                                </ThemedText>
                              </View>
                            </View>
                          </TvReadableBlock>
                        );
                      })}
                    </View>
                  ) : null}

                  {rozaTotal > 0 || ramadanFasts > 0 ? (
                    <ReadableView style={styles.block}>
                      <BlockTitle title={t("statistics.roza")} />
                      {rozaTotal > 0 ? (
                        <>
                          <View style={styles.progressHeader}>
                            <ThemedText type="header" style={{ color: tokens.status.success.text }}>
                              {formatPercent(roza.completed / rozaTotal)}
                            </ThemedText>
                            <ThemedText
                              type="caption"
                              themeColor="mutedForeground"
                              style={styles.flex}
                            >
                              {t("statistics.fastsMadeUpOf", {
                                done: formatCount(roza.completed),
                                total: formatCount(rozaTotal),
                              })}
                            </ThemedText>
                          </View>
                          <ProgressBar
                            value={roza.completed / rozaTotal}
                            color={tokens.status.success.color}
                          />
                        </>
                      ) : null}
                      {ramadanFasts > 0 ? (
                        <StatLine
                          label={t("statistics.ramadanFasts")}
                          value={formatCount(ramadanFasts)}
                          color={tokens.status.success.text}
                        />
                      ) : null}
                    </ReadableView>
                  ) : null}
                  <View style={styles.spacer} />
                  <LinkRow label={t("statistics.openQaza")} onPress={() => router.push("/qaza")} />
                </Card>
              ) : null}

              {hasReadingData ? (
                <Card padding="four" style={[styles.journeyCard, wide ? styles.fill : null]}>
                  <ThemedText type="subtitle">{t("statistics.reading")}</ThemedText>
                  <ReadableView style={styles.block}>
                    <View style={styles.progressHeader}>
                      <ThemedText type="header" style={{ color: colors.accentText }}>
                        {(reading.ayahsRead / reading.totalAyahs).toLocaleString(locale, {
                          style: "percent",
                          maximumFractionDigits: 1,
                        })}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
                        {t("statistics.ayahsReadOf", {
                          read: formatCount(reading.ayahsRead),
                          total: formatCount(reading.totalAyahs),
                        })}
                      </ThemedText>
                    </View>
                    <ProgressBar
                      value={reading.ayahsRead / reading.totalAyahs}
                      color={colors.accent}
                    />
                  </ReadableView>
                  <ReadableView style={[styles.metricShell, { backgroundColor: colors.muted }]}>
                    <MetricGrid
                      columns={2}
                      metrics={[
                        {
                          value: `${formatCount(reading.surahsCompleted)}/${formatCount(114)}`,
                          label: t("statistics.surahsCompleted"),
                          color: tokens.status.success.text,
                        },
                        {
                          value: formatCount(reading.surahsStarted),
                          label: t("statistics.quranSurahs"),
                          color: colors.accentText,
                        },
                        {
                          value: formatCount(quranBookmarks),
                          label: t("statistics.quranBookmarks"),
                          color: tokens.status.info.text,
                        },
                        {
                          value: formatCount(hadithBookmarks),
                          label: t("statistics.hadithBookmarks"),
                          color: tokens.status.warning.text,
                        },
                      ]}
                    />
                  </ReadableView>
                  <View style={styles.spacer} />
                  <LinkRow
                    label={t("statistics.openQuran")}
                    onPress={() => router.push("/quran")}
                  />
                </Card>
              ) : null}
            </ResponsiveGrid>
          </View>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const EMPTY_LOGS: PrayerLog[] = [];

function shortDate(date: string, locale: string | undefined): string {
  return parseLocalDateString(date).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function dayDate(date: string, locale: string | undefined): string {
  return parseLocalDateString(date).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
const EMPTY_ZIKR: ZikrProgress[] = [];

function BlockTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.blockTitle}>
      <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.blockLabel}>
        {title}
      </ThemedText>
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

function LegendKey({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <View style={styles.legendKey}>
      {swatch}
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </View>
  );
}

/** Placeholder shapes while the repositories load (avoids a flash of zeros). */
function StatisticsSkeleton() {
  return (
    <View
      style={styles.stack}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {[180, 320, 220].map((height) => (
        <Card key={height} padding="four" style={styles.journeyCard}>
          <Skeleton width="40%" height={20} />
          <Skeleton height={height - 80} radius={Radius.md} />
          <Skeleton width="70%" height={14} />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  journeyCard: {
    gap: Spacing.three,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  devotionBadge: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  metricShell: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  /** Title + hint stacked in a column card (no flex: it would collapse there). */
  headerStack: {
    gap: 2,
  },
  pillColumn: {
    alignItems: "flex-end",
    gap: Spacing.one,
    flexShrink: 1,
  },
  pill: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
  },
  trendsCard: {
    gap: Spacing.three,
  },
  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  column: {
    flex: 1,
    gap: Spacing.four,
  },
  chartFooter: {
    minHeight: 24,
    justifyContent: "center",
  },
  chartDetail: {
    textAlign: "center",
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: Spacing.three,
    rowGap: Spacing.one,
  },
  legendKey: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendToday: {
    borderWidth: 1.5,
  },
  legendExcused: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  legendLine: {
    width: 14,
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  insights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  insight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
  },
  /** Wide grid cell: stretch the card to the row height. */
  fill: {
    flexGrow: 1,
  },
  spacer: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  block: {
    gap: Spacing.two,
  },
  blockTitle: {
    gap: 2,
  },
  blockLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
  },
  blockShell: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.three,
  },
  detailList: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  listDivider: {
    height: StyleSheet.hairlineWidth,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.two,
  },
  qazaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  qazaCopy: {
    flex: 1,
    gap: Spacing.one,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/statistics");
