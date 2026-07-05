import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaPrayer } from "@munib-tracker/shared/types";
import { sumQazaScheduleTargets } from "@munib-tracker/shared/utils";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import {
  useQazaCounters,
  useQazaDailyProgress,
  useQazaSchedule,
  useTrackerActions,
} from "@/stores/tracker-store";

type PendingQazaAction = { kind: "perform" | "undo"; prayerId: QazaPrayer };

export function QazaDailyChecklist() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const schedule = useQazaSchedule();
  const progress = useQazaDailyProgress();
  const counters = useQazaCounters();
  const { performQaza, undoQaza } = useTrackerActions();
  const [pending, setPending] = useState<PendingQazaAction | null>(null);

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

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    const prayer = t(`prayers.${pending.prayerId}`);
    if (pending.kind === "perform") {
      return {
        title: t("qaza.confirmPerformTitle"),
        message: t("qaza.confirmPerformMsg", { prayer }),
      };
    }
    return {
      title: t("qaza.confirmUndoPerformTitle"),
      message: t("qaza.confirmUndoPerformMsg", { prayer }),
    };
  }, [pending, t]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    if (pending.kind === "perform") {
      void performQaza(pending.prayerId);
    } else {
      void undoQaza(pending.prayerId);
    }
    setPending(null);
  }, [pending, performQaza, undoQaza]);

  if (dailyTotal <= 0) return null;

  return (
    <>
      <Card padding="three">
        <SectionHeader
          title={t("tracker.qazaTargets")}
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
        />

        <View style={styles.summary}>
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {t("tracker.qazaTargetsProgress", { done: dailyDone, total: dailyTotal })}
          </ThemedText>
          <ProgressBar value={dailyTotal ? dailyDone / dailyTotal : 0} height={6} />
        </View>

        <View style={styles.rows}>
          {QAZA_PRAYERS.map((prayerId) => {
            const target = schedule.targets[prayerId] ?? 0;
            if (target <= 0) return null;

            const done = progress.completed[prayerId] ?? 0;
            const counter = counterByPrayer.get(prayerId);
            const remaining = counter?.remaining ?? 0;
            const completed = counter?.completed ?? 0;
            const complete = done >= target;
            const canPerform = !complete && remaining > 0;
            const canUndo = done > 0 && completed > 0;
            const prayerName = t(`prayers.${prayerId}`);

            return (
              <View key={prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
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
                    hitTarget={40}
                    onPress={() => setPending({ kind: "undo", prayerId: prayerId as QazaPrayer })}
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
                    hitTarget={40}
                    onPress={() =>
                      setPending({ kind: "perform", prayerId: prayerId as QazaPrayer })
                    }
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>

      {confirmCopy ? (
        <ConfirmDialog
          visible={pending != null}
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmLabel={t("common.confirm")}
          destructive={pending?.kind === "undo"}
          onConfirm={handleConfirm}
          onClose={() => setPending(null)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
});
