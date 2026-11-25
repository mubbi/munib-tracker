import type { FardPrayer, FardStatusValue } from "@munib-tracker/shared/circles";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FardDots } from "@/components/circles/fard-dots";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { type ChildProfile, type CircleSignal, listChildSignals } from "@/lib/circles/api";
import { setChildDayStatus, useChildSession } from "@/lib/circles/child-session";
import {
  EMPTY_FARD_STATUS,
  indexSignals,
  mergeDeviceFardDays,
  prayedCount,
  rewardProgress,
  signalWindow,
} from "@/lib/circles/family";
import { circleKeys, useCircleSignals, useFardStatusLog } from "@/lib/circles/hooks";
import { useToast } from "@/providers/toast-provider";

/** Days of signals the reward bar looks back over. */
const KIDS_SIGNAL_DAYS = 35;

/** The five big buttons + stars + reward bar. */
function PrayPanel({
  child,
  value,
  onToggle,
  signals,
}: {
  child: ChildProfile;
  value: FardStatusValue;
  onToggle: (prayer: FardPrayer) => void;
  signals: readonly CircleSignal[];
}) {
  const { t } = useTranslation();
  const days = useMemo(() => indexSignals(signals).get(child.id), [signals, child.id]);
  const reward = child.reward ? rewardProgress(days, child.reward.days) : null;
  const stars = prayedCount(value);
  const learning = child.ageBand === "learning";
  return (
    <View style={styles.stack}>
      <Card style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {learning ? t("kids.pray.learningHint") : t("kids.pray.hint")}
        </ThemedText>
        <FardDots value={value} onToggle={onToggle} size="lg" />
        <ThemedText type="subtitle">
          {stars === 5 ? t("kids.pray.allFive") : t("kids.pray.stars", { count: stars })}
        </ThemedText>
      </Card>
      {child.reward && reward ? (
        <Card style={styles.gap}>
          <ThemedText type="smallBold">
            {reward.reached
              ? t("family.reward.reached", { title: child.reward.title })
              : t("family.reward.progress", {
                  title: child.reward.title,
                  done: reward.done,
                  target: reward.target,
                })}
          </ThemedText>
          <ProgressBar value={reward.ratio} accessibilityLabel={t("a11yProgress.reward")} />
        </Card>
      ) : null}
    </View>
  );
}

/**
 * Linked child device: taps are saved on the device first (and pushed when
 * online), so the device's own days win over the server copy.
 */
export function DevicePrayTab({ child }: { child: ChildProfile }) {
  const { t } = useTranslation();
  const session = useChildSession();
  const today = getLocalDateString();
  const window = signalWindow(today, KIDS_SIGNAL_DAYS);
  const token = session.token as string;
  const signals = useQuery({
    queryKey: circleKeys.childDeviceSignals(child.id, window.from, window.to),
    queryFn: () => listChildSignals(token, child.circleId, window.from, window.to),
    enabled: !!token,
    staleTime: 30_000,
  });
  const deviceDays = session.meta?.days;
  const local = deviceDays?.[today]?.value;
  const server = indexSignals(signals.data ?? [])
    .get(child.id)
    ?.get(today)?.fard;
  const value = local ?? server ?? EMPTY_FARD_STATUS;
  const merged = useMemo(
    () => mergeDeviceFardDays(signals.data ?? [], deviceDays ?? {}, child.id),
    [signals.data, deviceDays, child.id],
  );

  return (
    <View style={styles.stack}>
      {child.consentPending ? (
        // D34: calm, never punishing — taps are kept on this device meanwhile.
        <Card style={styles.gap}>
          <ThemedText type="smallBold">{t("kids.consentPending.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.consentPending.body")}
          </ThemedText>
        </Card>
      ) : null}
      <PrayPanel
        child={child}
        value={value}
        signals={merged}
        onToggle={(prayer) => void setChildDayStatus(today, { ...value, [prayer]: !value[prayer] })}
      />
    </View>
  );
}

/** Parent's device in "Child: <nickname>" mode — writes go through the optimistic log. */
export function ParentPrayTab({ child, circleId }: { child: ChildProfile; circleId: string }) {
  const { t } = useTranslation();
  const toast = useToast();
  const today = getLocalDateString();
  const window = signalWindow(today, KIDS_SIGNAL_DAYS);
  const signals = useCircleSignals(circleId, window.from, window.to);
  const log = useFardStatusLog(circleId, window.from, window.to);
  const value =
    indexSignals(signals.data ?? [])
      .get(child.id)
      ?.get(today)?.fard ?? EMPTY_FARD_STATUS;
  return (
    <PrayPanel
      child={child}
      value={value}
      signals={signals.data ?? []}
      onToggle={(prayer) =>
        void log
          .toggle(child.id, today, prayer)
          .catch(() => toast.error(t("circles.common.offline")))
      }
    />
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});
