import type { CoachHistory } from "@munib-tracker/shared/types";
import {
  acceptCoachGoal,
  coachWeekFor,
  dismissCoachRule,
  fardTotals,
  getLocalDateString,
  normalizeCoachWeekday,
  restoreCoachRules,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CoachInsightCard } from "@/components/coach/insight-card";
import { ScreenLayout } from "@/components/screen-layout";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { Seo } from "@/components/seo/seo";
import { habitTitle } from "@/components/sunnah-habits/habit-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { SwitchRow } from "@/components/ui/switch-row";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useCoachReport } from "@/hooks/use-coach-report";
import { coachCopyParams, coachDateLabel, coachGoalLabel } from "@/lib/coach/coach-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { resolveHabit } from "@/lib/sunnah-habits";
import { useToast } from "@/providers/toast-provider";
import { coachHistoryStore, useCoachHistory } from "@/stores/coach-history-store";
import { usePreferences } from "@/stores/preferences-store";
import { useSunnahHabits } from "@/stores/sunnah-habits-store";

const WEEKDAYS = ["0", "1", "2", "3", "4", "5", "6"] as const;
const WEEK_DAYS = WEEKDAYS.length;
const nowIso = () => new Date().toISOString();

function GlanceRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.glanceRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.flex}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

function CoachSettingsCard() {
  const { t } = useTranslation();
  const notif = useSetting<boolean>("notifications.personal.coach");
  const day = useSetting<number>("notifications.personal.coachWeekday");
  return (
    <Card>
      <SectionHeader
        title={t("coach.settings.title")}
        icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
      />
      <View style={styles.list}>
        <SwitchRow
          title={t("coach.settings.notifToggle")}
          subtitle={t("coach.settings.notifHint")}
          value={notif.value}
          onValueChange={(on) => void notif.setValue(on)}
        />
        <ThemedText type="small">{t("coach.settings.day")}</ThemedText>
        <ChoiceChips
          options={WEEKDAYS.map((id) => ({ id, label: t(`coach.weekday.${id}`) }))}
          value={String(day.value)}
          onChange={(id) => void day.setValue(Number(id))}
          accessibilityLabel={t("coach.settings.day")}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("coach.settings.dayHint")}
        </ThemedText>
      </View>
    </Card>
  );
}

function CoachContent() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const tv = isTV();
  const { window, report, context } = useCoachReport({ record: true });
  const history = useCoachHistory();
  const habits = useSunnahHabits();
  const locale = i18n.language;

  if (!report || !context) {
    return <SkeletonPlaceholder preset="card" count={3} accessibilityLabel={t("coach.loading")} />;
  }

  const titleOfHabit = (id: string) => {
    const habit = resolveHabit(habits, id);
    return habit ? habitTitle(t, habit) : t("coach.habitFallback");
  };
  const apply = (fn: (h: CoachHistory) => CoachHistory) =>
    void coachHistoryStore.getState().apply(fn);

  const acceptedForNext = history.goals.find((goal) => goal.weekStart === window.reportDate);
  const nextDate = coachDateLabel(window.nextReportDate, locale);
  const week = context.week;
  const totals = fardTotals(week);

  return (
    <View style={styles.stack}>
      {/* TV: read-only cards are D-pad reading stops (TV scrollers aren't focusable). */}
      {report.mode === "quiet" ? (
        <TvReadableBlock>
          <EmptyState
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            title={t("coach.quiet.title")}
            description={t("coach.quiet.body")}
          />
        </TvReadableBlock>
      ) : null}

      {report.mode === "normal" ? (
        <TvReadableBlock>
          <Card>
            <SectionHeader
              title={t("coach.summary.title")}
              icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
            />
            <View style={styles.list}>
              <GlanceRow
                label={t("coach.summary.salah")}
                value={t("coach.summary.ofTotal", { done: totals.onTime, total: totals.days })}
              />
              <GlanceRow
                label={t("coach.summary.perfect")}
                value={t("coach.summary.ofTotal", { done: week.perfectDays, total: WEEK_DAYS })}
              />
              <GlanceRow
                label={t("coach.summary.quran")}
                value={t("coach.summary.ofTotal", { done: week.quranDays, total: WEEK_DAYS })}
              />
              <GlanceRow
                label={t("coach.summary.adhkar")}
                value={t("coach.summary.ofTotal", { done: week.adhkarDays, total: WEEK_DAYS })}
              />
              {context.qaza ? (
                <GlanceRow label={t("coach.summary.qaza")} value={context.qaza.madeUpThisWeek} />
              ) : null}
            </View>
          </Card>
        </TvReadableBlock>
      ) : null}

      {report.lastGoal ? (
        <TvReadableBlock>
          <Card>
            <SectionHeader
              title={t("coach.goal.last.title")}
              subtitle={coachGoalLabel(report.lastGoal.goal, t)}
              icon={{ ios: "flag.fill", android: "flag", web: "flag" }}
            />
            <ThemedText type="small" style={styles.list}>
              {t(report.lastGoal.met ? "coach.goal.last.met" : "coach.goal.last.progress", {
                value: report.lastGoal.value,
                target: report.lastGoal.goal.target,
              })}
            </ThemedText>
          </Card>
        </TvReadableBlock>
      ) : null}

      {report.insights.map((insight) => (
        <CoachInsightCard
          key={insight.ruleId}
          insight={insight}
          values={coachCopyParams(insight.params, t, locale, titleOfHabit)}
          onHide={() => {
            apply((h) => dismissCoachRule(h, insight.ruleId, nowIso()));
            toast.info(t("coach.hiddenToast"));
          }}
        />
      ))}

      {/* Off TV this is a fragment (the Accept button stays reachable); TV hides the button. */}
      {report.microGoal ? (
        <TvReadableBlock>
          <Card>
            <SectionHeader
              title={t("coach.goal.title")}
              subtitle={coachGoalLabel(report.microGoal, t)}
              icon={{ ios: "target", android: "track_changes", web: "track_changes" }}
            />
            {acceptedForNext ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.list}>
                {t("coach.goal.accepted", { date: nextDate })}
              </ThemedText>
            ) : tv ? null : (
              <View style={styles.list}>
                <Button
                  label={t("coach.goal.accept")}
                  onPress={() => {
                    const goal = report.microGoal;
                    if (goal) apply((h) => acceptCoachGoal(h, goal, window.reportDate, nowIso()));
                  }}
                />
              </View>
            )}
          </Card>
        </TvReadableBlock>
      ) : null}

      <TvReadableBlock>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("coach.next", { date: nextDate })}
        </ThemedText>
      </TvReadableBlock>

      {!tv && history.dismissedRules.length > 0 ? (
        <Button
          label={t("coach.restoreHidden")}
          variant="ghost"
          onPress={() => apply((h) => restoreCoachRules(h, nowIso()))}
        />
      ) : null}

      {tv ? null : <CoachSettingsCard />}

      <TvReadableBlock style={styles.footnotes}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("coach.privacy")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("coach.disclaimer")}
        </ThemedText>
      </TvReadableBlock>
    </View>
  );
}

export default function CoachScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { coachWeekday } = usePreferences();
  const window = coachWeekFor(getLocalDateString(), normalizeCoachWeekday(coachWeekday));
  return (
    <ScreenLayout
      eyebrow={t("coach.eyebrow")}
      title={t("coach.title")}
      subtitle={t("coach.range", {
        from: coachDateLabel(window.weekStart, i18n.language),
        to: coachDateLabel(window.weekEnd, i18n.language),
      })}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/coach" />
      <CoachContent />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  /** TV only — off TV the reading block is a fragment and `stack` spaces these. */
  footnotes: { gap: Spacing.three },
  list: { gap: Spacing.two, marginTop: Spacing.two },
  glanceRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/coach");
