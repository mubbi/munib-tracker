import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaPrayer } from "@munib-tracker/shared/types";
import { getLocalDateString, sumQazaScheduleTargets } from "@munib-tracker/shared/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { QazaRepository } from "@/db";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import {
  useQazaCounters,
  useQazaDailyProgress,
  useQazaSchedule,
  useTrackerActions,
} from "@/stores/tracker-store";

type QazaDailyChecklistProps = {
  /** Defaults to today. Past dates render read-only when progress exists. */
  date?: string;
};

export function QazaDailyChecklist({ date: dateProp }: QazaDailyChecklistProps = {}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const today = getLocalDateString();
  const date = dateProp ?? today;
  const isToday = date === today;
  const schedule = useQazaSchedule();
  const storeProgress = useQazaDailyProgress();
  const counters = useQazaCounters();
  const { performQaza, undoQaza } = useTrackerActions();
  const undoToast = useUndoToast();
  const [historicalProgress, setHistoricalProgress] = useState(storeProgress);
  const tv = isTV();
  const iconTarget = tv ? TvLayout.minFocusTarget : undefined;

  useEffect(() => {
    if (isToday) return;
    let active = true;
    void QazaRepository.getDailyProgress(date).then((next) => {
      if (active) setHistoricalProgress(next);
    });
    return () => {
      active = false;
    };
  }, [date, isToday]);

  const progress = isToday ? storeProgress : historicalProgress;

  const dailyTotal = sumQazaScheduleTargets(schedule);

  const dailyDone = useMemo(
    () =>
      QAZA_PRAYERS.reduce(
        (sum, prayerId) =>
          sum + Math.min(progress.completed[prayerId] ?? 0, schedule.targets[prayerId] ?? 0),
        0,
      ),
    [progress.completed, schedule.targets],
  );

  const counterByPrayer = useMemo(
    () => new Map(counters.map((counter) => [counter.prayerId, counter])),
    [counters],
  );

  /** One tap logs a make-up; the toast offers Undo (no confirm dialog). */
  const perform = (prayerId: QazaPrayer) => {
    triggerHaptic("success");
    trackReviewInteraction("mark_qaza");
    void undoToast.run({
      do: () => performQaza(prayerId),
      undo: () => undoQaza(prayerId),
      messageKey: "qaza.toastMadeUp",
      messageOptions: { prayer: t(`prayers.${prayerId}`) },
    });
  };

  /** Takes one make-up back from today; the toast offers Undo to re-log it. */
  const takeBack = (prayerId: QazaPrayer) => {
    void undoToast.run({
      do: () => undoQaza(prayerId),
      undo: () => performQaza(prayerId),
      messageKey: "qaza.toastTakenBack",
      messageOptions: { prayer: t(`prayers.${prayerId}`) },
      type: "info",
    });
  };

  if (dailyTotal <= 0) return null;
  if (!isToday && dailyDone <= 0) return null;

  // Single wrapper so parent stacks with `gap` treat this as one child (fragment
  // would flatten the Modal and open an extra gap before the next card).
  return (
    <View style={styles.root}>
      <Card>
        <SectionHeader
          title={t("tracker.qazaTargets")}
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
        />

        <View style={styles.summary}>
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {t("tracker.qazaTargetsProgress", { done: dailyDone, total: dailyTotal })}
          </ThemedText>
          <ProgressBar
            value={dailyTotal ? dailyDone / dailyTotal : 0}
            accessibilityLabel={t("tracker.qazaTargets")}
            height={6}
          />
        </View>

        <View style={[styles.rows, tv && styles.rowsTv]}>
          {QAZA_PRAYERS.map((prayerId) => {
            const target = schedule.targets[prayerId] ?? 0;
            if (target <= 0) return null;

            const done = progress.completed[prayerId] ?? 0;
            const counter = counterByPrayer.get(prayerId);
            const remaining = counter?.remaining ?? 0;
            const completed = counter?.completed ?? 0;
            const complete = done >= target;
            const canPerform = isToday && !complete && remaining > 0;
            const canUndo = isToday && done > 0 && completed > 0;
            const prayerName = t(`prayers.${prayerId}`);

            return (
              <View
                key={prayerId}
                style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
              >
                <IconWell icon={PRAYER_ICONS[prayerId]} />
                <View style={styles.rowBody}>
                  <ThemedText type="small">{prayerName}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("qaza.dailyProgress", { done, target })}
                  </ThemedText>
                </View>

                <View style={styles.actions}>
                  <IconButton
                    name={{
                      ios: "minus.circle.fill",
                      android: "remove_circle",
                      web: "remove_circle",
                    }}
                    size={24}
                    tintColor={tokens.status.warning.color}
                    accessibilityLabel={t("qaza.undoPerformed", { prayer: prayerName })}
                    disabled={!canUndo}
                    hitTarget={iconTarget}
                    onPress={() => takeBack(prayerId as QazaPrayer)}
                  />
                  <IconButton
                    name={{
                      ios: complete ? "checkmark.circle.fill" : "plus.circle.fill",
                      android: complete ? "check_circle" : "add_circle",
                      web: complete ? "check_circle" : "add_circle",
                    }}
                    size={24}
                    tintColor={tokens.status.success.color}
                    accessibilityLabel={t("qaza.markPerformed", { prayer: prayerName })}
                    disabled={!canPerform}
                    hitTarget={iconTarget}
                    onPress={() => perform(prayerId as QazaPrayer)}
                  />
                </View>
              </View>
            );
          })}
        </View>
        {tv && undoToast.undoAvailable ? (
          <Button
            label={t("uiFeedback.undo")}
            variant="secondary"
            size="sm"
            onPress={() => undoToast.undo()}
          />
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  summary: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  /** TV: 2-column grid so the landscape width is used. */
  rowsTv: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rowTv: {
    flexBasis: "45%",
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    padding: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    flex: 1,
    gap: Spacing.half,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
});
