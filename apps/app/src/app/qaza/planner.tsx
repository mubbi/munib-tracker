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
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { QazaDailyTargets } from "@/components/qaza-daily-targets";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { formatQazaDailyTime, formatQazaDuration } from "@/lib/qaza-duration";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { webPageSchema } from "@/lib/seo/structured-data";
import {
  trackerStore,
  useQazaCounters,
  useQazaSchedule,
  useQazaSummary,
  useTrackerActions,
  useTrackerLoadError,
  useTrackerReady,
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
  const ready = useTrackerReady();
  const loadError = useTrackerLoadError();
  const undoToast = useUndoToast();
  const [confirmPreset, setConfirmPreset] = useState<number | null>(null);
  const today = getLocalDateString();
  const { width } = useWindowDimensions();
  /** Desktop / wide web: plan editing on the start side, pace summary + guidance aside. */
  const twoPane = !isTV() && width >= 1200;

  /** Applies a preset with an Undo toast that restores the previous daily targets. */
  const applyPreset = (perPrayer: number) => {
    const before = schedule;
    triggerHaptic("selection");
    void undoToast.run({
      do: () => setQazaSchedule({ targets: buildUniformQazaTargets(counters, perPrayer) }),
      undo: () => setQazaSchedule(before),
      messageKey: "qazaPlan.toastPresetApplied",
    });
  };

  const dailyTotal = useMemo(() => sumQazaScheduleTargets(schedule), [schedule]);
  const dailyMinutes = estimateQazaDailyMinutes(dailyTotal);
  const sustainability = classifyQazaSustainability(dailyTotal);
  const selectedPreset = matchQazaPlanPreset(schedule.targets, counters);
  const hasCustomPlan = selectedPreset === "custom" && dailyTotal > 0;
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

  const consistencyCard = (
    <Card
      style={{
        backgroundColor: tokens.accentSoft,
        borderColor: colors.accent,
        borderWidth: BorderWidth.hairline,
      }}
    >
      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
        {t("qazaPlan.consistencyTitle")}
      </ThemedText>
      <ScriptureMeaning english={t("qazaPlan.consistencyHadith")}>
        {(text) => (
          <ThemedText type="small" themeColor="foreground" style={styles.hadithText}>
            {text}
          </ThemedText>
        )}
      </ScriptureMeaning>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("qazaPlan.consistencySource")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.principleText}>
        {t("qazaPlan.consistencyPrinciple")}
      </ThemedText>
    </Card>
  );

  const etaCard = (
    <Card padding="four">
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
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
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
  );

  const attachCard = (
    <Card>
      <SectionHeader
        title={t("qazaPlan.attachTitle")}
        icon={{ ios: "link", android: "link", web: "link" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("qazaPlan.attachHint")}
      </ThemedText>
    </Card>
  );

  const fiqhCard = (
    <Card>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("qazaPlan.fiqhNote")}
      </ThemedText>
    </Card>
  );

  const presetsCard =
    summary.remaining > 0 ? (
      <Card>
        <SectionHeader
          title={t("qazaPlan.presetsTitle")}
          icon={{ ios: "leaf.fill", android: "eco", web: "eco" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.suggestHint}>
          {t("qazaPlan.presetsHint")}
        </ThemedText>
        <View
          style={styles.presetList}
          accessibilityRole="radiogroup"
          accessibilityLabel={t("qazaPlan.presetsTitle")}
        >
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
                onPress={() =>
                  hasCustomPlan ? setConfirmPreset(preset.perPrayer) : applyPreset(preset.perPrayer)
                }
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
    ) : null;

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qazaPlan.eyebrow")}
      title={t("qazaPlan.title")}
      subtitle={t("qazaPlan.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
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
      <ContentState
        status={ready ? "ready" : loadError ? "error" : "loading"}
        onRetry={() => void trackerStore.getState().load()}
        skeleton="card"
        skeletonCount={3}
        loadingLabel={t("uiFeedback.loading")}
      >
        <Stagger>
          {twoPane ? (
            <View style={styles.split}>
              <View style={styles.primary}>
                {presetsCard}
                <QazaDailyTargets />
              </View>
              <View style={styles.aside}>
                {etaCard}
                {consistencyCard}
                {attachCard}
                {fiqhCard}
              </View>
            </View>
          ) : null}
          {twoPane ? null : consistencyCard}
          {twoPane ? null : etaCard}
          {twoPane ? null : presetsCard}
          {twoPane ? null : attachCard}
          {twoPane ? null : <QazaDailyTargets />}
          {twoPane ? null : fiqhCard}
        </Stagger>
      </ContentState>

      <ConfirmDialog
        visible={confirmPreset != null}
        title={t("qazaPlan.confirmPresetTitle")}
        message={t("qazaPlan.confirmPresetMsg", { perPrayer: confirmPreset ?? 0 })}
        confirmLabel={t("qazaPlan.confirmPresetAction")}
        onConfirm={() => {
          if (confirmPreset != null) applyPreset(confirmPreset);
        }}
        onClose={() => setConfirmPreset(null)}
      />
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
  const tv = isTV();

  return (
    <PressableScale
      haptic={false}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      // TV: land on the active preset first so Select re-confirms / D-pad compares.
      {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.presetRow,
        tv && styles.presetRowTv,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          // TV: selected = soft fill + hairline; the accent ring is reserved for focus.
          borderColor: selected ? (tv ? tokens.accentBorder : colors.accent) : "transparent",
          borderWidth: selected ? StyleSheet.hairlineWidth * (tv ? 1 : 2) : 0,
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
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  primary: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  aside: {
    width: 380,
    maxWidth: "40%",
    gap: Spacing.three,
  },
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
    padding: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  presetRowTv: {
    minHeight: TvLayout.minFocusTarget,
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza/planner");
