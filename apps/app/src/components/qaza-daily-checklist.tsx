import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { sumQazaScheduleTargets } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
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

export function QazaDailyChecklist() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const schedule = useQazaSchedule();
  const progress = useQazaDailyProgress();
  const counters = useQazaCounters();
  const { performQaza } = useTrackerActions();

  const dailyTotal = sumQazaScheduleTargets(schedule);
  if (dailyTotal <= 0) return null;

  const dailyDone = OBLIGATORY_PRAYERS.reduce(
    (sum, prayerId) =>
      sum + Math.min(progress.completed[prayerId] ?? 0, schedule.targets[prayerId] ?? 0),
    0,
  );
  const counterByPrayer = new Map(counters.map((counter) => [counter.prayerId, counter]));

  return (
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
        {OBLIGATORY_PRAYERS.map((prayerId) => {
          const target = schedule.targets[prayerId] ?? 0;
          if (target <= 0) return null;

          const done = progress.completed[prayerId] ?? 0;
          const counter = counterByPrayer.get(prayerId);
          const remaining = counter?.remaining ?? 0;
          const complete = done >= target;
          const canPerform = !complete && remaining > 0;

          return (
            <View key={prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
              <IconWell icon={PRAYER_ICONS[prayerId]} />
              <View style={styles.rowBody}>
                <ThemedText type="small">{t(`prayers.${prayerId}`)}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("qaza.dailyProgress", { done, target })}
                </ThemedText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("qaza.markPerformed", {
                  prayer: t(`prayers.${prayerId}`),
                })}
                disabled={!canPerform}
                hitSlop={6}
                onPress={() => performQaza(prayerId as ObligatoryPrayer)}
                style={{ opacity: canPerform ? 1 : 0.3 }}
              >
                <SymbolView
                  name={{
                    ios: complete ? "checkmark.circle.fill" : "circle",
                    android: complete ? "check_circle" : "radio_button_unchecked",
                    web: complete ? "check_circle" : "radio_button_unchecked",
                  }}
                  size={26}
                  tintColor={complete ? tokens.status.success.color : colors.mutedForeground}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    </Card>
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
});
