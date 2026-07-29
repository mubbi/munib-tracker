import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaPrayer } from "@munib-tracker/shared/types";
import { sumQazaScheduleTargets } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useQazaDailyProgress, useQazaSchedule, useTrackerActions } from "@/stores/tracker-store";

type QazaDailyTargetsProps = {
  /** Show per-prayer today progress under each target row. */
  showProgress?: boolean;
  /** Wrap in a Card with section header. */
  framed?: boolean;
};

export function QazaDailyTargets({ showProgress = true, framed = true }: QazaDailyTargetsProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const schedule = useQazaSchedule();
  const progress = useQazaDailyProgress();
  const { setQazaSchedule } = useTrackerActions();
  const dailyTotal = sumQazaScheduleTargets(schedule);

  const setTarget = (prayerId: QazaPrayer, target: number) => {
    void setQazaSchedule({
      targets: {
        ...schedule.targets,
        [prayerId]: Math.max(0, target),
      },
    });
  };

  const rows = (
    <View style={styles.rows}>
      {QAZA_PRAYERS.map((prayerId) => {
        const target = schedule.targets[prayerId] ?? 0;
        const done = progress.completed[prayerId] ?? 0;
        return (
          <View key={prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
            <IconWell icon={PRAYER_ICONS[prayerId]} />
            <View style={styles.rowBody}>
              <ThemedText type="small">{t(`prayers.${prayerId}`)}</ThemedText>
              {showProgress && target > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("qaza.dailyProgress", { done, target })}
                </ThemedText>
              ) : (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("qaza.dailyTargetHint")}
                </ThemedText>
              )}
            </View>
            <Stepper
              value={target}
              label={t("qaza.dailyTargetA11y", { prayer: t(`prayers.${prayerId}`) })}
              onDecrement={() => setTarget(prayerId, target - 1)}
              onIncrement={() => setTarget(prayerId, target + 1)}
            />
          </View>
        );
      })}
    </View>
  );

  if (!framed) return rows;

  return (
    <Card padding="three">
      <SectionHeader
        title={t("qaza.dailySchedule")}
        icon={{ ios: "target", android: "track_changes", web: "track_changes" }}
      />
      {dailyTotal > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.total}>
          {t("qaza.dailyTotal", { count: dailyTotal })}
        </ThemedText>
      ) : null}
      {rows}
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("qaza.dailyScheduleHint")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  hint: {
    marginTop: Spacing.three,
  },
  total: {
    marginTop: Spacing.one,
  },
});
