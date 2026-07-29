import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaPrayer } from "@munib-tracker/shared/types";
import type { QazaPlanPresetId, QazaSustainabilityLevel } from "@munib-tracker/shared/utils";
import {
  buildUniformQazaTargets,
  classifyQazaSustainability,
  computeQazaEta,
  estimateQazaDailyMinutes,
  formatShortDate,
  getLocalDateString,
  matchQazaPlanPreset,
  QAZA_PLAN_PRESETS,
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
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { formatQazaDailyTime, formatQazaDuration } from "@/lib/qaza-duration";
import { webPageSchema } from "@/lib/seo/structured-data";
import {
  useQazaCounters,
  useQazaSchedule,
  useQazaSummary,
  useTrackerActions,
} from "@/stores/tracker-store";

function sustainabilityPalette(
  level: QazaSustainabilityLevel,
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  switch (level) {
    case "easy":
      return tokens.status.success;
    case "moderate":
      return tokens.status.info;
    case "challenging":
      return tokens.status.warning;
    case "intensive":
      return tokens.status.danger;
  }
}

export default function QazaPlannerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const summary = useQazaSummary();
  const schedule = useQazaSchedule();
  const counters = useQazaCounters();
  const { setQazaSchedule } = useTrackerActions();
  const today = getLocalDateString();

  const applyPreset = (perPrayer: number) => {
    void setQazaSchedule({ targets: buildUniformQazaTargets(counters, perPrayer) });
  };

  const dailyTotal = useMemo(() => sumQazaScheduleTargets(schedule), [schedule]);
  const dailyMinutes = estimateQazaDailyMinutes(dailyTotal);
  const sustainability = classifyQazaSustainability(dailyTotal);
  const selectedPreset = matchQazaPlanPreset(schedule.targets, counters);
  const eta = computeQazaEta(summary.remaining, dailyTotal, today);

  const activePrayers = useMemo(
    () => QAZA_PRAYERS.filter((prayerId) => (schedule.targets[prayerId] ?? 0) > 0) as QazaPrayer[],
    [schedule.targets],
  );

  const debtPrayerCount = useMemo(
    () => counters.filter((counter) => counter.remaining > 0).length,
    [counters],
  );

  const sustainabilityStyle = sustainability ? sustainabilityPalette(sustainability, tokens) : null;

  return (
    <ScreenLayout
      eyebrow={t("qazaPlan.eyebrow")}
      title={t("qazaPlan.title")}
      subtitle={t("qazaPlan.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
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
              "Choose a sustainable daily pace to make up missed prayers, guided by consistency over intensity.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
              { name: t("qazaPlan.title"), path: "/qaza/planner" },
            ],
          }),
        ]}
      />
      <Stagger>
        <Card
          padding="three"
          style={{
            backgroundColor: tokens.accentSoft,
            borderColor: colors.accent,
            borderWidth: StyleSheet.hairlineWidth,
          }}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("qazaPlan.consistencyTitle")}
          </ThemedText>
          <ThemedText type="small" themeColor="foreground" style={styles.hadithText}>
            {t("qazaPlan.consistencyHadith")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qazaPlan.consistencySource")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.principleText}>
            {t("qazaPlan.consistencyPrinciple")}
          </ThemedText>
        </Card>

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
                {formatQazaDailyTime(dailyMinutes, t)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaPlan.dailyTimeLabel")}
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

          {sustainability && sustainabilityStyle ? (
            <View style={styles.sustainabilityRow}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaPlan.sustainabilityLabel")}
              </ThemedText>
              <Pill
                label={t(`qazaPlan.sustainability.${sustainability}`)}
                color={sustainabilityStyle.color}
                background={sustainabilityStyle.soft}
              />
            </View>
          ) : null}

          <ThemedText type="small" themeColor="mutedForeground" style={styles.etaCaption}>
            {eta
              ? t("qazaPlan.etaCaption", {
                  count: summary.remaining,
                  date: formatShortDate(eta.date),
                })
              : t("qazaPlan.etaEmpty")}
          </ThemedText>

          {sustainability === "intensive" ? (
            <ThemedText type="caption" style={{ color: tokens.status.danger.color }}>
              {t("qazaPlan.intensiveWarning")}
            </ThemedText>
          ) : null}

          {activePrayers.length > 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.breakdown}>
              {activePrayers
                .map((prayerId) => `${t(`prayers.${prayerId}`)}: ${schedule.targets[prayerId]}`)
                .join(" · ")}
            </ThemedText>
          ) : null}
        </Card>

        {summary.remaining > 0 ? (
          <Card padding="three">
            <SectionHeader
              title={t("qazaPlan.presetsTitle")}
              icon={{ ios: "leaf.fill", android: "eco", web: "eco" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.suggestHint}>
              {t("qazaPlan.presetsHint")}
            </ThemedText>
            <View style={styles.presetList}>
              {QAZA_PLAN_PRESETS.map((preset) => {
                const presetDailyTotal = preset.perPrayer * debtPrayerCount;
                const isSelected = selectedPreset === preset.id;
                return (
                  <PresetRow
                    key={preset.id}
                    presetId={preset.id}
                    perPrayer={preset.perPrayer}
                    dailyTotal={presetDailyTotal}
                    recommended={preset.recommended}
                    selected={isSelected}
                    onPress={() => applyPreset(preset.perPrayer)}
                  />
                );
              })}
              {selectedPreset === "custom" && dailyTotal > 0 ? (
                <View style={[styles.presetRow, { backgroundColor: colors.muted }]}>
                  <View style={styles.presetCopy}>
                    <ThemedText type="smallBold">{t("qazaPlan.presetCustom")}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("qazaPlan.presetCustomHint")}
                    </ThemedText>
                  </View>
                  <Pill
                    label={t("qazaPlan.presetActive")}
                    color={colors.accent}
                    background={tokens.accentSoft}
                  />
                </View>
              ) : null}
            </View>
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title={t("qazaPlan.attachTitle")}
            icon={{ ios: "link", android: "link", web: "link" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qazaPlan.attachHint")}
          </ThemedText>
        </Card>

        <QazaDailyTargets />

        <Card padding="three">
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("qazaPlan.fiqhNote")}
          </ThemedText>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

function PresetRow({
  presetId,
  perPrayer,
  dailyTotal,
  recommended,
  selected,
  onPress,
}: {
  presetId: Exclude<QazaPlanPresetId, "custom">;
  perPrayer: number;
  dailyTotal: number;
  recommended?: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.presetRow,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : "transparent",
          borderWidth: selected ? StyleSheet.hairlineWidth * 2 : 0,
        },
      ]}
    >
      <View style={styles.presetCopy}>
        <View style={styles.presetTitleRow}>
          <ThemedText type="smallBold">{t(`qazaPlan.presets.${presetId}.title`)}</ThemedText>
          {recommended ? (
            <Pill
              compact
              label={t("qazaPlan.recommended")}
              color={tokens.status.info.color}
              background={tokens.status.info.soft}
            />
          ) : null}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`qazaPlan.presets.${presetId}.subtitle`, { perPrayer, dailyTotal })}
        </ThemedText>
      </View>
      {selected ? (
        <Pill
          label={t("qazaPlan.presetActive")}
          color={colors.accent}
          background={tokens.accentSoft}
        />
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hadithText: {
    marginTop: Spacing.two,
    fontStyle: "italic",
  },
  principleText: {
    marginTop: Spacing.two,
  },
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
  sustainabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  etaCaption: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  breakdown: {
    marginTop: Spacing.two,
    textAlign: "center",
  },
  suggestHint: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  presetList: {
    gap: Spacing.two,
  },
  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  presetCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  presetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
});
