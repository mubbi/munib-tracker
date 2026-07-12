import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContinueCard } from "@/components/continue-card";
import { DevotionAchievementSummary } from "@/components/devotion-achievement-summary";
import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { KnowledgeFlashCard } from "@/components/knowledge-flash-card";
import type { PrayerScheduleCardProps } from "@/components/prayer-schedule-card";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { IosPwaInstallBanner } from "@/components/pwa/ios-pwa-install-banner";
import { QazaSummaryCard } from "@/components/qaza-summary-card";
import { RamadanCard } from "@/components/ramadan-card";
import { SeasonalThemeBanner } from "@/components/seasonal-theme-banner";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, type StatusKey } from "@/constants/theme";
import { useReviewRouteTrigger } from "@/features/reviews/hooks/useReviewRouteTrigger";
import { useReviewStreakTrigger } from "@/features/reviews/hooks/useReviewStreakTrigger";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeeklyReport } from "@/hooks/use-weekly-report";
import {
  buildQuickActionItems,
  DEFAULT_QUICK_ACTION_ORDER,
  orderQuickActions,
  QUICK_ACTION_META,
} from "@/lib/quick-actions";
import { useArrowForward } from "@/lib/rtl";
import { usePreferences } from "@/stores/preferences-store";
import {
  useDailySummary,
  useDayExcused,
  useDevotionProgress,
  useQazaSummary,
  useRoza,
  useStreak,
} from "@/stores/tracker-store";

type SymbolName = SymbolViewProps["name"];

function resolveGoalTier(done: number, total: number): { tone: StatusKey; icon: SymbolName } {
  const ratio = total > 0 ? done / total : 0;
  if (ratio >= 1) {
    return {
      tone: "success",
      icon: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
    };
  }
  if (ratio >= 0.5) {
    return {
      tone: "warning",
      icon: { ios: "chart.pie.fill", android: "pie_chart", web: "pie_chart" },
    };
  }
  if (ratio > 0) {
    return {
      tone: "info",
      icon: { ios: "hourglass", android: "hourglass_top", web: "hourglass_top" },
    };
  }
  return {
    tone: "danger",
    icon: { ios: "exclamationmark.circle.fill", android: "error", web: "error" },
  };
}

export type HomeBelowFoldProps = Pick<
  PrayerScheduleCardProps,
  "schedule" | "nextIn" | "nextScheduleId"
>;

/**
 * Below-fold home content — separate module so web asyncRoutes can parse the
 * hero/shell first without pulling continue/knowledge/ramadan/schedule cards.
 */
export function HomeBelowFold({ schedule, nextIn, nextScheduleId }: HomeBelowFoldProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const excusedReason = useDayExcused();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const qaza = useQazaSummary();
  const roza = useRoza();
  useWeeklyReport();
  useReviewRouteTrigger("home");
  useReviewStreakTrigger(streak);
  const { quickActionOrder, hiddenHomeModules } = usePreferences();
  const arrowForward = useArrowForward();
  const hiddenModules = new Set(hiddenHomeModules ?? []);

  const tasksDone = summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday;
  const tasksTotal = summary.salahTotal + summary.zikrTotal + summary.qazaTargetToday;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const goalBreakdown = [
    {
      key: "salah",
      label: t("home.prayersStat"),
      done: summary.salahCompleted,
      total: summary.salahTotal,
    },
    {
      key: "zikr",
      label: t("home.dhikrStat"),
      done: summary.zikrCompleted,
      total: summary.zikrTotal,
    },
    {
      key: "qaza",
      label: t("home.qazaStat"),
      done: summary.qazaCompletedToday,
      total: summary.qazaTargetToday,
    },
  ].filter((item) => item.total > 0);
  const isExcused = excusedReason != null;
  const isFreshStart = tasksDone === 0 && streak === 0 && !isExcused;
  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;

  const allQuickActions = buildQuickActionItems(t, router.push, { colors, tokens });
  const visibleQuickActions = orderQuickActions(
    allQuickActions,
    quickActionOrder?.length ? quickActionOrder : DEFAULT_QUICK_ACTION_ORDER,
  );

  return (
    <View style={styles.body}>
      <IosPwaInstallBanner />

      <Stagger entranceKey="home">
        <SeasonalThemeBanner />

        <Card>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitle}>
              <ThemedText type="subtitle">{t("home.todaysGoal")}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {isExcused
                  ? t("home.excusedGoalHint", {
                      reason: t(`tracker.excusedReason.${excusedReason}`),
                    })
                  : isFreshStart
                    ? t("home.freshStartHint")
                    : t("home.checklistHint")}
              </ThemedText>
            </View>
            {isExcused ? (
              <Pill
                label={t("home.excusedPausedLabel")}
                color={tokens.status.info.color}
                background={colors.card}
                icon={{
                  ios: "pause.circle.fill",
                  android: "pause_circle",
                  web: "pause_circle",
                }}
              />
            ) : (
              <Pill
                label={`${progressPct}%`}
                color={colors.accentForeground}
                background={colors.accent}
              />
            )}
          </View>

          {isExcused ? (
            <View
              style={[
                styles.pausedBanner,
                {
                  backgroundColor: colors.card,
                  borderColor: tokens.status.info.color,
                },
              ]}
            >
              <SymbolView
                name={{
                  ios: "pause.circle.fill",
                  android: "pause_circle",
                  web: "pause_circle",
                }}
                size={22}
                tintColor={tokens.status.info.color}
              />
              <View style={styles.pausedCopy}>
                <ThemedText type="smallBold" style={{ color: tokens.status.info.color }}>
                  {t("home.excusedPausedLabel")}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("home.excusedGoalBody")}
                </ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.goalProgress}>
              <ThemedText type="smallBold" themeColor="mutedForeground">
                {t("home.tasksProgress", { done: tasksDone, total: tasksTotal })}
              </ThemedText>
              <SegmentedProgress total={Math.max(tasksTotal, 1)} completed={tasksDone} />
              {goalBreakdown.length > 0 ? (
                <View style={styles.goalBreakdown}>
                  {goalBreakdown.map((item) => {
                    const tier = resolveGoalTier(item.done, item.total);
                    const status = tokens.status[tier.tone];
                    return (
                      <View
                        key={item.key}
                        style={[
                          styles.breakdownChip,
                          {
                            backgroundColor: status.soft,
                            borderColor: status.color,
                          },
                        ]}
                      >
                        <SymbolView name={tier.icon} size={13} tintColor={status.color} />
                        <ThemedText type="caption" style={{ color: status.text }}>
                          {item.label}
                        </ThemedText>
                        <ThemedText
                          type="caption"
                          style={{ color: status.text, fontWeight: "700" }}
                        >
                          {t("home.tasksFraction", {
                            done: formatCount(item.done),
                            total: formatCount(item.total),
                          })}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          )}

          <ExcusedDayPicker variant="inline" />

          <PressableScale
            onPress={() => router.push("/achievements")}
            haptic="light"
            scaleTo={0.98}
            accessibilityRole="button"
            accessibilityLabel={t("home.devotionA11y", {
              level: devotion.level,
              noor: devotion.noor,
              current: devotionLevelProgress,
              next: devotionLevelSpan,
            })}
            style={[
              styles.achievementBlock,
              {
                backgroundColor: colors.muted,
                borderColor: tokens.hairline,
              },
            ]}
          >
            <DevotionAchievementSummary compact milestonePillBackground={colors.card} />
          </PressableScale>

          <Button
            label={
              isExcused
                ? t("home.goToChecklist")
                : isFreshStart
                  ? t("home.startTracking")
                  : t("home.goToChecklist")
            }
            variant={isExcused ? "secondary" : "primary"}
            fullWidth
            trailingIcon={arrowForward}
            onPress={() => router.push("/tracker")}
          />
        </Card>

        <RamadanCard />

        {!hiddenModules.has("continue") ? <ContinueCard /> : null}

        {!hiddenModules.has("knowledge") ? <KnowledgeFlashCard /> : null}

        {!hiddenModules.has("quickActions") ? (
          <Card padding="three">
            <SectionHeader
              title={t("home.explore")}
              icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
              actionLabel={t("home.manage")}
              actionAccessibilityLabel={t("home.manageA11y")}
              actionIcon={{
                ios: "slider.horizontal.3",
                android: "tune",
                web: "tune",
              }}
              onActionPress={() => router.push("/settings/home")}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.exploreHint}>
              {t("home.exploreHint", {
                shown: visibleQuickActions.length,
                total: QUICK_ACTION_META.length,
              })}
            </ThemedText>
            <View style={styles.quickActions}>
              <QuickActionGrid items={visibleQuickActions} columns={4} />
            </View>
          </Card>
        ) : null}

        {!hiddenModules.has("qaza") ? (
          <QazaSummaryCard
            remaining={qaza.remaining}
            completed={qaza.completed}
            rozaRemaining={roza.remaining}
            onPress={() => router.push("/qaza")}
          />
        ) : null}

        {!hiddenModules.has("schedule") ? (
          <PrayerScheduleCard schedule={schedule} nextIn={nextIn} nextScheduleId={nextScheduleId} />
        ) : null}
      </Stagger>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: Spacing.four, marginTop: -Spacing.five, gap: Spacing.four, zIndex: 1 },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  goalTitle: { flex: 1, gap: 2 },
  goalProgress: { gap: Spacing.two },
  goalBreakdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  breakdownChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  pausedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  pausedCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  achievementBlock: {
    gap: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickActions: { marginTop: Spacing.two },
  exploreHint: { marginTop: Spacing.half },
});
