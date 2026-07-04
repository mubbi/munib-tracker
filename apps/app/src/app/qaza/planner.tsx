import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaPrayer } from "@munib-tracker/shared/types";
import {
  computeQazaEta,
  formatShortDate,
  getLocalDateString,
  sumQazaScheduleTargets,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { QazaDailyTargets } from "@/components/qaza-daily-targets";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatQazaDuration } from "@/lib/qaza-duration";
import { webPageSchema } from "@/lib/seo/structured-data";
import { useQazaSchedule, useQazaSummary } from "@/stores/tracker-store";

export default function QazaPlannerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const summary = useQazaSummary();
  const schedule = useQazaSchedule();
  const today = getLocalDateString();

  const dailyTotal = useMemo(() => sumQazaScheduleTargets(schedule), [schedule]);

  const eta = computeQazaEta(summary.remaining, dailyTotal, today);

  const activePrayers = useMemo(
    () => QAZA_PRAYERS.filter((prayerId) => (schedule.targets[prayerId] ?? 0) > 0) as QazaPrayer[],
    [schedule.targets],
  );

  return (
    <ScreenLayout
      eyebrow={t("qazaPlan.eyebrow")}
      title={t("qazaPlan.title")}
      subtitle={t("qazaPlan.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/qaza/planner"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("qaza.title"), path: "/qaza" },
          { name: t("qazaPlan.title"), path: "/qaza/planner" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qaza/planner",
            name: "Qaza Planner",
            description:
              "Set a realistic daily pace to make up missed prayers and see an estimated date to clear your backlog.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
              { name: t("qazaPlan.title"), path: "/qaza/planner" },
            ],
          }),
        ]}
      />
      <Stagger>
        <Card>
          <View style={styles.etaRow}>
            <View style={styles.etaStat}>
              <ThemedText type="header">{dailyTotal}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaPlan.prayersPerDay")}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            <View style={styles.etaStat}>
              <ThemedText type="smallBold" style={styles.durationValue}>
                {eta ? formatQazaDuration(eta.days, t) : "—"}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaPlan.daysToClear")}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.etaCaption}>
            {eta
              ? t("qazaPlan.etaCaption", {
                  count: summary.remaining,
                  date: formatShortDate(eta.date),
                })
              : t("qazaPlan.etaEmpty")}
          </ThemedText>
          {activePrayers.length > 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.breakdown}>
              {activePrayers
                .map((prayerId) => `${t(`prayers.${prayerId}`)}: ${schedule.targets[prayerId]}`)
                .join(" · ")}
            </ThemedText>
          ) : null}
        </Card>

        <QazaDailyTargets />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  etaStat: {
    alignItems: "center",
    gap: Spacing.one,
    flex: 1,
  },
  durationValue: {
    textAlign: "center",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  etaCaption: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  breakdown: {
    marginTop: Spacing.two,
    textAlign: "center",
  },
});
