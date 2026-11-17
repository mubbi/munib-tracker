import { computeMissedFasts } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { webPageSchema } from "@/lib/seo/structured-data";
import { useRoza, useTrackerActions } from "@/stores/tracker-store";

type RozaConfirmAction =
  | { kind: "decrement"; nextRemaining: number }
  | { kind: "increment"; nextRemaining: number }
  | { kind: "setRemaining"; nextRemaining: number }
  | { kind: "perform" }
  | { kind: "addEstimate"; count: number }
  | { kind: "reset" };

export default function QazaRozaScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const roza = useRoza();
  const { setRoza, performRoza, resetRoza } = useTrackerActions();
  const [years, setYears] = useState("");
  const [pending, setPending] = useState<RozaConfirmAction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Tablet / desktop web: counter and estimator side by side. */
  const twoPane = !tv && width >= 900;

  const estimate = computeMissedFasts(Number.parseInt(years, 10) || 0);
  const hasAnyCounts = roza.remaining > 0 || roza.completed > 0;
  const total = roza.remaining + roza.completed;
  const progress = total > 0 ? roza.completed / total : 0;
  const progressPct = Math.round(progress * 100);
  const locale = i18n.language?.split("-")[0];
  const info = tokens.status.info;
  const success = tokens.status.success;

  const confirmCopy = useMemo(() => {
    if (!pending) return null;

    switch (pending.kind) {
      case "decrement":
        return {
          title: t("qazaRoza.confirmDecrementTitle"),
          message: t("qazaRoza.confirmDecrementMsg", { remaining: pending.nextRemaining }),
        };
      case "increment":
        return {
          title: t("qazaRoza.confirmIncrementTitle"),
          message: t("qazaRoza.confirmIncrementMsg", { remaining: pending.nextRemaining }),
        };
      case "setRemaining":
        return {
          title: t("qazaRoza.confirmSetRemainingTitle"),
          message: t("qazaRoza.confirmSetRemainingMsg", { remaining: pending.nextRemaining }),
        };
      case "perform":
        return {
          title: t("qazaRoza.confirmPerformTitle"),
          message: t("qazaRoza.confirmPerformMsg"),
        };
      case "addEstimate":
        return {
          title: t("qazaRoza.confirmAddEstimateTitle"),
          message: t("qazaRoza.confirmAddEstimateMsg", {
            count: pending.count,
            total: roza.remaining + pending.count,
          }),
        };
      case "reset":
        return {
          title: t("qazaRoza.confirmResetTitle"),
          message: t("qazaRoza.confirmResetMsg", {
            remaining: roza.remaining,
            completed: roza.completed,
          }),
        };
      default:
        return null;
    }
  }, [pending, roza.completed, roza.remaining, t]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    switch (pending.kind) {
      case "decrement":
      case "increment":
      case "setRemaining":
        void setRoza({ ...roza, remaining: pending.nextRemaining });
        break;
      case "perform":
        void performRoza();
        break;
      case "addEstimate":
        void setRoza({ ...roza, remaining: roza.remaining + pending.count });
        setYears("");
        break;
      case "reset":
        void resetRoza();
        break;
    }
  }, [pending, performRoza, resetRoza, roza, setRoza]);

  const formatCount = (value: number) => value.toLocaleString(locale);

  const counterCard = (
    <Card padding="three" style={styles.progressCard}>
      <View style={styles.statsRow}>
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("qazaRoza.editCountA11y")}
          onPress={() => setEditOpen(true)}
          style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}
        >
          <ThemedText type="display" style={[styles.statValue, { color: info.text }]}>
            {formatCount(roza.remaining)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.remaining")}
          </ThemedText>
        </PressableScale>
        <View
          style={[styles.statBox, { backgroundColor: success.soft, borderColor: success.border }]}
        >
          <ThemedText type="display" style={[styles.statValue, { color: success.text }]}>
            {formatCount(roza.completed)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.completed")}
          </ThemedText>
        </View>
      </View>

      {total > 0 ? (
        <View style={styles.progressBlock}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.qazaProgress", { pct: progressPct })}
          </ThemedText>
          <ProgressBar value={progress} height={6} color={success.color} />
        </View>
      ) : null}

      <Button
        label={t("qazaRoza.fastedQaza")}
        fullWidth
        icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
        disabled={roza.remaining === 0}
        preferredFocus
        onPress={() => setPending({ kind: "perform" })}
      />

      <View style={[styles.adjustSection, { backgroundColor: colors.muted }]}>
        <ThemedText type="smallBold">{t("qazaRoza.adjustRemaining")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.adjustHint}>
          {tTv(t, "qazaRoza.adjustHint", "qazaRoza.adjustHintTv")}
        </ThemedText>
        <View style={styles.stepperWrap}>
          <Stepper
            value={roza.remaining}
            label={t("qazaRoza.fastsRemaining")}
            valueAccessibilityLabel={t("qazaRoza.editCountA11y")}
            onValuePress={() => setEditOpen(true)}
            onDecrement={() =>
              setPending({
                kind: "decrement",
                nextRemaining: Math.max(0, roza.remaining - 1),
              })
            }
            onIncrement={() =>
              setPending({
                kind: "increment",
                nextRemaining: roza.remaining + 1,
              })
            }
            size="md"
            buttonBackground={colors.card}
          />
        </View>
      </View>

      <Button
        label={t("qazaRoza.resetCounter")}
        variant="ghost"
        size="sm"
        icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
        disabled={!hasAnyCounts}
        onPress={() => setPending({ kind: "reset" })}
        style={styles.resetCounter}
      />
    </Card>
  );

  const estimateCard = (
    <Card padding="three">
      <SectionHeader
        title={t("qazaRoza.estimateTitle")}
        icon={{
          ios: "plus.forwardslash.minus",
          android: "calculate",
          web: "calculate",
        }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.calcHint}>
        {t("qazaRoza.estimateHint")}
      </ThemedText>
      <View style={[styles.formulaBox, { backgroundColor: colors.muted }]}>
        {tv ? (
          // TV: step the years with the D-pad instead of typing.
          <View style={styles.yearsInputWrap}>
            <TvNumberStepper
              value={Number.parseInt(years, 10) || 0}
              onChange={(next) => setYears(next > 0 ? String(next) : "")}
              label={t("qazaRoza.yearsPlaceholder")}
              max={99}
              steps={[1, 10]}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qazaRoza.yearsPlaceholder")}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.yearsInputWrap}>
            <TextInput
              value={years}
              onChangeText={(text) => setYears(text.replace(/[^0-9]/g, "").slice(0, 2))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("qazaRoza.yearsPlaceholder")}
              style={[styles.yearsInput, tokens.inputSurface, { color: colors.foreground }]}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qazaRoza.yearsPlaceholder")}
            </ThemedText>
          </View>
        )}
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {t("qazaRoza.estimateFormula")}
        </ThemedText>
        <ThemedText type="header" style={{ color: info.text, fontVariant: ["tabular-nums"] }}>
          {formatCount(estimate)}
        </ThemedText>
      </View>
      <Button
        label={t("qazaRoza.addToRemaining")}
        variant="secondary"
        fullWidth
        disabled={estimate === 0}
        onPress={() => setPending({ kind: "addEstimate", count: estimate })}
        style={styles.applyButton}
      />
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("qazaRoza.eyebrow")}
      title={t("qazaRoza.title")}
      subtitle={t("qazaRoza.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/qaza/roza"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("qaza.title"), path: "/qaza" },
          { name: t("qazaRoza.title"), path: "/qaza/roza" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qaza/roza",
            name: "Missed Fasts Tracker — Qaza Fasting",
            description:
              "Track and make up missed fasts (qaza fasting). Estimate missed Ramadan fasts and record each make-up.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
              { name: t("qazaRoza.title"), path: "/qaza/roza" },
            ],
          }),
        ]}
      />
      <Stagger>
        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.pane}>{counterCard}</View>
            <View style={styles.pane}>{estimateCard}</View>
          </View>
        ) : null}
        {twoPane ? null : counterCard}
        {twoPane ? null : estimateCard}
      </Stagger>

      <ConfirmDialog
        visible={pending != null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={t("common.confirm")}
        destructive={pending?.kind === "reset"}
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />

      <QazaCountEditModal
        visible={editOpen}
        initialValue={roza.remaining}
        title={t("qazaRoza.editCountTitle")}
        hint={tTv(t, "qazaRoza.editCountHint", "qazaRoza.editCountHintTv")}
        placeholder={t("qazaRoza.editCountPlaceholder")}
        accessibilityLabel={t("qazaRoza.editCountA11y")}
        onSubmit={(nextRemaining) => {
          setEditOpen(false);
          if (nextRemaining === roza.remaining) return;
          setPending({ kind: "setRemaining", nextRemaining });
        }}
        onClose={() => setEditOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  pane: {
    flex: 1,
    minWidth: 0,
  },
  progressCard: {
    gap: Spacing.three,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  statValue: {
    fontVariant: ["tabular-nums"],
  },
  progressBlock: {
    gap: Spacing.one + 2,
  },
  adjustSection: {
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  adjustHint: {
    textAlign: "center",
  },
  stepperWrap: {
    alignSelf: "center",
  },
  resetCounter: {
    alignSelf: "center",
  },
  calcHint: {
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
  formulaBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  yearsInputWrap: {
    alignItems: "center",
    gap: Spacing.one,
  },
  yearsInput: {
    width: 56,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  applyButton: {
    marginTop: Spacing.two,
  },
});
