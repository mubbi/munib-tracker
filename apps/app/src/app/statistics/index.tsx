import type {
  PrayerLog,
  QazaCounter,
  QazaDailyProgress,
  QazaRozaCounter,
  ZikrCategoryId,
  ZikrProgress,
} from "@munib-tracker/shared/types";
import {
  addDays,
  aggregateByDate,
  buildDayActivity,
  dailyCompletionSeries,
  getLocalDateString,
  parseLocalDateString,
  sumPrayerTotals,
} from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import {
  CardDivider,
  LinkRow,
  type Metric,
  MetricGrid,
  StatLine,
  StatsGroup,
} from "@/components/statistics/metrics";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import {
  HadithRepository,
  PrayerRepository,
  QazaRepository,
  QuranRepository,
  ZikrRepository,
} from "@/db";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import {
  useAchievementStats,
  useDailySummary,
  useDevotionProgress,
  useStreak,
  useTrackerActions,
} from "@/stores/tracker-store";

type Period = "week" | "month" | "year";

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const QURAN_SURAH_COUNT = 114;

const PERIOD_HINT_KEYS: Record<Period, string> = {
  week: "statistics.periodWeek",
  month: "statistics.periodMonth",
  year: "statistics.periodYear",
};

function countPerfectDaysInRange(logs: PrayerLog[], from: string, to: string): number {
  let count = 0;
  for (const day of aggregateByDate(logs).values()) {
    if (day.date < from || day.date > to) continue;
    if (day.completed >= day.total) count += 1;
  }
  return count;
}

function countActiveDaysInRange(logs: PrayerLog[], from: string, to: string): number {
  let count = 0;
  for (const day of aggregateByDate(logs).values()) {
    if (day.date < from || day.date > to) continue;
    if (day.completed + day.missed + day.qaza + day.delayed > 0) count += 1;
  }
  return count;
}

function sumQazaPerformedInRange(
  progressMap: Record<string, QazaDailyProgress>,
  from: string,
  to: string,
): number {
  let sum = 0;
  for (const [date, progress] of Object.entries(progressMap)) {
    if (date < from || date > to) continue;
    for (const count of Object.values(progress.completed)) {
      sum += count ?? 0;
    }
  }
  return sum;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { refresh } = useTrackerActions();
  const summary = useDailySummary();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const achievementStats = useAchievementStats();
  const [period, setPeriod] = useState<Period>("week");
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [zikr, setZikr] = useState<ZikrProgress[]>([]);
  const [counters, setCounters] = useState<QazaCounter[]>([]);
  const [roza, setRoza] = useState<QazaRozaCounter>({ remaining: 0, completed: 0 });
  const [qazaDailyMap, setQazaDailyMap] = useState<Record<string, QazaDailyProgress>>({});
  const [quranSurahsStarted, setQuranSurahsStarted] = useState(0);
  const [quranBookmarks, setQuranBookmarks] = useState(0);
  const [hadithBookmarks, setHadithBookmarks] = useState(0);
  const [, setCorpusReady] = useState(false);
  useEffect(() => {
    void ensureZikrCorpus().then(() => setCorpusReady(true));
  }, []);

  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);

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
      ]).then(([_, l, z, c, r, qazaProgress, quranProgress, qBookmarks, hBookmarks]) => {
        if (!active) return;
        setLogs(l);
        setZikr(z);
        setCounters(c);
        setRoza(r);
        setQazaDailyMap(qazaProgress);
        setQuranSurahsStarted(Object.keys(quranProgress).length);
        setQuranBookmarks(qBookmarks.length);
        setHadithBookmarks(hBookmarks.length);
      });
      return () => {
        active = false;
      };
    }, [refresh]),
  );

  const today = getLocalDateString();

  const { chart, from, averageLevel } = useMemo(() => {
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
      const elapsed = bars.filter((_, month) => month <= currentMonth);
      const avg =
        elapsed.length > 0 ? elapsed.reduce((sum, bar) => sum + bar.value, 0) / elapsed.length : 0;
      return { chart: bars, from: `${year}-01-01`, averageLevel: avg };
    }

    const days = period === "week" ? 7 : 30;
    const series = dailyCompletionSeries(logs, days, today);
    const monthTickIndexes =
      period === "month"
        ? new Set(
            [0, Math.floor((series.length - 1) / 2), series.length - 1].filter(
              (i) => i >= 0 && i < series.length,
            ),
          )
        : null;
    const bars: BarDatum[] = series.map((activity, index) => {
      const d = parseLocalDateString(activity.date);
      let label = "";
      if (period === "week") {
        label = d.toLocaleDateString(locale, { weekday: "short" });
      } else if (monthTickIndexes?.has(index)) {
        label = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
      }
      return { label, value: activity.level };
    });
    const avg =
      series.length > 0
        ? series.reduce((sum, activity) => sum + activity.level, 0) / series.length
        : 0;
    return { chart: bars, from: addDays(today, -(days - 1)), averageLevel: avg };
  }, [period, logs, today, locale]);

  const prayerTotals = useMemo(() => sumPrayerTotals(logs, from, today), [logs, from, today]);

  const zikrCompleted = useMemo(
    () => zikr.filter((z) => z.completed && z.date >= from && z.date <= today).length,
    [zikr, from, today],
  );

  const zikrByCategory = useMemo(() => {
    const map = new Map<ZikrCategoryId, number>();
    for (const entry of zikr) {
      if (!entry.completed || entry.date < from || entry.date > today) continue;
      const category = getZikrById(entry.zikrId)?.categoryId ?? "anytime";
      map.set(category, (map.get(category) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [zikr, from, today]);

  const qazaRemaining = counters.reduce((sum, c) => sum + c.remaining, 0);
  const qazaCompleted = counters.reduce((sum, c) => sum + c.completed, 0);
  const qazaPerformedInPeriod = useMemo(
    () => sumQazaPerformedInRange(qazaDailyMap, from, today),
    [qazaDailyMap, from, today],
  );
  const perfectDaysInPeriod = useMemo(
    () => countPerfectDaysInRange(logs, from, today),
    [logs, from, today],
  );
  const activeDaysInPeriod = useMemo(
    () => countActiveDaysInRange(logs, from, today),
    [logs, from, today],
  );

  const perPrayerQaza = counters.filter((c) => c.remaining > 0 || c.completed > 0);
  const hasReadingData = quranSurahsStarted > 0 || quranBookmarks > 0 || hadithBookmarks > 0;
  const hasDetails = perPrayerQaza.length > 0 || zikrByCategory.length > 0 || hasReadingData;
  const maxZikrCategoryCount = zikrByCategory[0]?.[1] ?? 1;
  const qazaTodayValue =
    summary.qazaTargetToday > 0
      ? `${summary.qazaCompletedToday}/${summary.qazaTargetToday}`
      : `${summary.qazaCompletedToday}`;

  const lifetimeMetrics: Metric[] = [
    {
      value: streak,
      label: t("statistics.streak"),
      color: tokens.status.warning.color,
    },
    {
      value: formatCount(achievementStats.prayersCompleted),
      label: t("statistics.totalPrayers"),
      color: tokens.status.success.color,
    },
    {
      value: formatCount(achievementStats.zikrCompleted),
      label: t("statistics.totalZikr"),
      color: tokens.status.danger.color,
    },
    {
      value: formatCount(achievementStats.perfectDays),
      label: t("statistics.perfectDays"),
      color: tokens.status.info.color,
    },
  ];

  const todayMetrics: Metric[] = [
    {
      value: `${summary.salahCompleted}/${summary.salahTotal}`,
      label: t("statistics.todayPrayers"),
      color: tokens.status.success.color,
    },
    {
      value: `${summary.zikrCompleted}/${summary.zikrTotal}`,
      label: t("statistics.todayZikr"),
      color: tokens.status.danger.color,
    },
    {
      value: qazaTodayValue,
      label: t("statistics.todayQaza"),
      color: tokens.status.info.color,
    },
  ];

  return (
    <ScreenLayout
      eyebrow={t("statistics.eyebrow")}
      title={t("statistics.title")}
      subtitle={t("statistics.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/statistics" />
      <Stagger>
        <View style={styles.stack}>
          <Card padding="four" style={styles.journeyCard}>
            <View style={styles.heroRow}>
              <View style={[styles.devotionBadge, { backgroundColor: tokens.status.warning.soft }]}>
                <ThemedText type="title" style={{ color: tokens.status.warning.color }}>
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
                    current: devotion.noor - devotion.noorForCurrentLevel,
                    next: devotion.noorForNextLevel - devotion.noorForCurrentLevel,
                  })}
                </ThemedText>
              </View>
            </View>
            <ProgressBar value={devotion.progress} color={tokens.status.warning.color} />
            <View style={[styles.metricShell, { backgroundColor: colors.muted }]}>
              <MetricGrid metrics={lifetimeMetrics} columns={2} />
            </View>
            <LinkRow
              label={t("statistics.viewAchievements")}
              onPress={() => router.push("/achievements")}
            />
          </Card>

          <Card padding="three" style={styles.sectionCard}>
            <ThemedText type="subtitle">{t("statistics.today")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("statistics.todayHint")}
            </ThemedText>
            <View style={[styles.metricShell, { backgroundColor: colors.muted }]}>
              <MetricGrid metrics={todayMetrics} columns={3} />
            </View>
          </Card>

          <Card padding="three" style={styles.trendsCard}>
            <View style={styles.trendsHeader}>
              <View style={styles.trendsTitleRow}>
                <View style={styles.trendsCopy}>
                  <ThemedText type="subtitle">{t("statistics.trends")}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(PERIOD_HINT_KEYS[period])}
                  </ThemedText>
                </View>
                <View style={[styles.avgPill, { backgroundColor: tokens.status.success.soft }]}>
                  <ThemedText type="smallBold" style={{ color: tokens.status.success.text }}>
                    {t("statistics.avgCompletion", {
                      percent: Math.round(averageLevel * 100),
                    })}
                  </ThemedText>
                </View>
              </View>

              <SegmentedControl<Period>
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
                height={period === "month" ? 120 : 112}
                emptyLabel={t("statistics.chartEmpty")}
              />
            </View>

            <CardDivider />

            <View style={styles.trendGroups}>
              <StatsGroup
                title={t("statistics.prayer")}
                columns={2}
                metrics={[
                  {
                    value: prayerTotals.completed,
                    label: t("stats.completed"),
                    color: tokens.status.success.color,
                  },
                  {
                    value: prayerTotals.missed,
                    label: t("stats.missed"),
                    color: tokens.status.danger.color,
                  },
                  {
                    value: prayerTotals.delayed,
                    label: t("stats.delayed"),
                    color: tokens.status.warning.color,
                  },
                  {
                    value: prayerTotals.qaza,
                    label: t("stats.qazaLogged"),
                    color: tokens.status.info.color,
                  },
                ]}
              />

              <StatsGroup
                title={t("statistics.consistency")}
                columns={2}
                metrics={[
                  {
                    value: perfectDaysInPeriod,
                    label: t("stats.perfectDays"),
                    color: tokens.status.success.color,
                  },
                  {
                    value: activeDaysInPeriod,
                    label: t("stats.activeDays"),
                    color: tokens.status.info.color,
                  },
                ]}
              />

              <StatsGroup
                title={t("statistics.qaza")}
                columns={3}
                metrics={[
                  {
                    value: qazaPerformedInPeriod,
                    label: t("stats.madeUpPeriod"),
                    color: tokens.status.success.color,
                  },
                  {
                    value: qazaRemaining,
                    label: t("stats.remaining"),
                    color: tokens.status.info.color,
                  },
                  {
                    value: qazaCompleted,
                    label: t("stats.madeUp"),
                    color: tokens.status.success.color,
                  },
                ]}
              />

              <StatsGroup
                title={t("statistics.roza")}
                columns={2}
                metrics={[
                  {
                    value: roza.remaining,
                    label: t("stats.remaining"),
                    color: tokens.status.info.color,
                  },
                  {
                    value: roza.completed,
                    label: t("stats.completed"),
                    color: tokens.status.success.color,
                  },
                ]}
              />

              <StatsGroup
                title={t("statistics.zikr")}
                columns={2}
                metrics={[
                  {
                    value: zikrCompleted,
                    label: t("stats.completed"),
                    color: tokens.status.warning.color,
                  },
                  {
                    value: zikrByCategory.length,
                    label: t("stats.categories"),
                    color: tokens.status.info.color,
                  },
                ]}
              />
            </View>
          </Card>

          {hasDetails ? (
            <Card padding="three" style={styles.sectionCard}>
              <ThemedText type="subtitle">{t("statistics.details")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("statistics.detailsHint")}
              </ThemedText>

              {perPrayerQaza.length > 0 ? (
                <View style={styles.detailBlock}>
                  <ThemedText
                    type="smallBold"
                    themeColor="mutedForeground"
                    style={styles.detailLabel}
                  >
                    {t("statistics.perPrayer")}
                  </ThemedText>
                  <View style={[styles.detailList, { backgroundColor: colors.muted }]}>
                    {perPrayerQaza.map((counter, index) => (
                      <View key={counter.prayerId}>
                        {index > 0 ? (
                          <View
                            style={[styles.listDivider, { backgroundColor: tokens.hairline }]}
                          />
                        ) : null}
                        <View style={styles.qazaRow}>
                          <IconWell icon={PRAYER_ICONS[counter.prayerId]} />
                          <View style={styles.qazaCopy}>
                            <ThemedText type="small">{t(`prayers.${counter.prayerId}`)}</ThemedText>
                            <ThemedText type="caption" themeColor="mutedForeground">
                              {t("qaza.rowMeta", {
                                remaining: counter.remaining,
                                completed: counter.completed,
                              })}
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {zikrByCategory.length > 0 ? (
                <View style={styles.detailBlock}>
                  <ThemedText
                    type="smallBold"
                    themeColor="mutedForeground"
                    style={styles.detailLabel}
                  >
                    {t("statistics.zikrBreakdown")}
                  </ThemedText>
                  <View style={[styles.detailList, { backgroundColor: colors.muted }]}>
                    {zikrByCategory.map(([categoryId, count], index) => (
                      <View key={categoryId}>
                        {index > 0 ? (
                          <View
                            style={[styles.listDivider, { backgroundColor: tokens.hairline }]}
                          />
                        ) : null}
                        <StatLine
                          label={t(`zikrCat.${categoryId}`)}
                          value={formatCount(count)}
                          color={tokens.status.warning.color}
                          bar={count / maxZikrCategoryCount}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {hasReadingData ? (
                <View style={styles.detailBlock}>
                  <ThemedText
                    type="smallBold"
                    themeColor="mutedForeground"
                    style={styles.detailLabel}
                  >
                    {t("statistics.reading")}
                  </ThemedText>
                  <View style={[styles.metricShell, { backgroundColor: colors.muted }]}>
                    <MetricGrid
                      columns={2}
                      metrics={[
                        {
                          value: `${quranSurahsStarted}/${QURAN_SURAH_COUNT}`,
                          label: t("statistics.quranSurahs"),
                          color: colors.accent,
                        },
                        {
                          value: quranBookmarks,
                          label: t("statistics.quranBookmarks"),
                          color: tokens.status.info.color,
                        },
                        {
                          value: hadithBookmarks,
                          label: t("statistics.hadithBookmarks"),
                          color: tokens.status.warning.color,
                        },
                        {
                          value:
                            quranSurahsStarted > 0
                              ? `${Math.round((quranSurahsStarted / QURAN_SURAH_COUNT) * 100)}%`
                              : "0%",
                          label: t("statistics.quranProgress"),
                          color: tokens.status.success.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : null}
            </Card>
          ) : null}
        </View>
      </Stagger>
    </ScreenLayout>
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
  sectionCard: {
    gap: Spacing.two,
  },
  trendsCard: {
    gap: Spacing.three,
  },
  trendsHeader: {
    gap: Spacing.two,
  },
  trendsTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  trendsCopy: {
    flex: 1,
    gap: 2,
  },
  avgPill: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    marginTop: 2,
  },
  trendGroups: {
    gap: Spacing.three,
  },
  detailBlock: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  detailLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
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
  qazaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  qazaCopy: {
    flex: 1,
    gap: 2,
  },
});
