import { formatShortDate } from "@munib-tracker/shared/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FardDots } from "@/components/circles/fard-dots";
import { useCircleRun } from "@/components/circles/use-circle-run";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { clearSignal, putRestDay } from "@/lib/circles/api";
import { indexSignals, lastNDates, signalWindow } from "@/lib/circles/family";
import { useCircleMutation, useCircleSignals, useFardStatusLog } from "@/lib/circles/hooks";

const WEEK_DAYS = 7;

/** Parent tools: the child's last 7 days — fard dots (tap to log) and generic rest days. */
export function ChildWeekCard({
  circleId,
  childId,
  today,
}: {
  circleId: string;
  childId: string;
  today: string;
}) {
  const { t } = useTranslation();
  const run = useCircleRun();
  const window = signalWindow(today, WEEK_DAYS);
  const signals = useCircleSignals(circleId, window.from, window.to);
  const days = useMemo(
    () => indexSignals(signals.data ?? []).get(childId),
    [signals.data, childId],
  );
  const log = useFardStatusLog(circleId, window.from, window.to);
  const rest = useCircleMutation(async (token, input: { date: string; on: boolean }) => {
    if (input.on) {
      await putRestDay(token, circleId, { date: input.date, memberId: childId });
    } else {
      await clearSignal(token, circleId, "rest_day", input.date, childId);
    }
  });

  return (
    <>
      <SectionHeader title={t("family.child.weekTitle")} />
      <Card padding="three" style={styles.gap}>
        {lastNDates(today, WEEK_DAYS)
          .reverse()
          .map((date) => {
            const day = days?.get(date);
            return (
              <View key={date} style={styles.day}>
                <View style={styles.switchRow}>
                  <ThemedText type="smallBold" style={styles.flex}>
                    {date === today ? t("family.today") : formatShortDate(date)}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("family.restDay")}
                  </ThemedText>
                  <ThemedSwitch
                    value={day?.rest === true}
                    onValueChange={(on) => void run(() => rest.mutateAsync({ date, on }))}
                    accessibilityLabel={t("family.restDay")}
                  />
                </View>
                <FardDots
                  value={day?.fard ?? null}
                  showLabels={date === today}
                  onToggle={(prayer) => void run(() => log.toggle(childId, date, prayer))}
                />
              </View>
            );
          })}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("family.restDayHint")}
        </ThemedText>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.two },
  day: { gap: Spacing.one, paddingVertical: Spacing.one },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
