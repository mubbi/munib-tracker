import type { QazaRozaCounter } from "@munib-tracker/shared/types";
import { computeMissedFasts } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { IconButton } from "@/components/ui/icon-button";
import { isNumberInRange, NumberField } from "@/components/ui/number-field";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Breakpoints, Radius, Spacing } from "@/constants/theme";
import { useFormatCount } from "@/hooks/use-format-count";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { webPageSchema } from "@/lib/seo/structured-data";
import {
  trackerStore,
  useRoza,
  useTrackerActions,
  useTrackerLoadError,
  useTrackerReady,
} from "@/stores/tracker-store";

type RozaConfirmAction = { kind: "addEstimate"; count: number } | { kind: "reset" };

/** Upper bound of the "years of missed fasts" estimate field. */
const MAX_ESTIMATE_YEARS = 99;

export default function QazaRozaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const ready = useTrackerReady();
  const loadError = useTrackerLoadError();
  const roza = useRoza();
  const { setRoza: storeSetRoza, performRoza, resetRoza } = useTrackerActions();
  /**
   * Every local roza write is a new edit: drop the snapshot's `updatedAt` so the
   * repository stamps it now. Restoring a snapshot (Undo) with its old timestamp
   * would let last-write-wins sync bring the undone value back and skip the
   * delta push (B-08).
   */
  const setRoza = useCallback(
    ({ updatedAt: _stale, ...next }: QazaRozaCounter) => storeSetRoza(next),
    [storeSetRoza],
  );
  const undoToast = useUndoToast();
  const formatCount = useFormatCount();
  const [years, setYears] = useState<number | undefined>(undefined);
  const [pending, setPending] = useState<RozaConfirmAction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Tablet / desktop web: counter and estimator side by side. */
  const twoPane = !tv && width >= Breakpoints.listDetail;

  // Out-of-range years stay as typed with the field's error and estimate nothing (B-03).
  const yearsValid = isNumberInRange(years, 0, MAX_ESTIMATE_YEARS);
  const estimate = yearsValid ? computeMissedFasts(years ?? 0) : 0;
  const total = roza.remaining + roza.completed;
  const progress = total > 0 ? roza.completed / total : 0;
  const progressPct = Math.round(progress * 100);
  const info = tokens.status.info;
  const success = tokens.status.success;

  /** One tap: log a make-up fast, success haptic, toast with Undo. */
  const madeUp = () => {
    const before = roza;
    triggerHaptic("success");
    void undoToast.run({
      do: () => performRoza(),
      undo: () => setRoza(before),
      messageKey: "qazaRoza.toastMadeUp",
    });
  };

  /** Exact value from the edit sheet: applied at once, reversible from the toast. */
  const setExact = (nextRemaining: number) => {
    const before = roza;
    if (nextRemaining === before.remaining) return;
    void undoToast.run({
      do: () => setRoza({ ...before, remaining: nextRemaining }),
      undo: () => setRoza(before),
      messageKey: "qazaRoza.toastSet",
      messageOptions: { value: formatCount(nextRemaining) },
    });
  };

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    if (pending.kind === "addEstimate") {
      return {
        title: t("qazaRoza.confirmAddEstimateTitle"),
        message: t("qazaRoza.confirmAddEstimateMsg", {
          count: pending.count,
          total: roza.remaining + pending.count,
        }),
      };
    }
    return {
      title: t("qazaRoza.confirmResetTitle"),
      message: t("qazaRoza.confirmResetMsg", {
        remaining: roza.remaining,
        completed: roza.completed,
      }),
    };
  }, [pending, roza.completed, roza.remaining, t]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    if (pending.kind === "addEstimate") {
      const before = roza;
      const count = pending.count;
      setYears(undefined);
      void undoToast.run({
        do: () => setRoza({ ...before, remaining: before.remaining + count }),
        undo: () => setRoza(before),
        messageKey: "qazaRoza.toastAdded",
        messageOptions: { value: formatCount(count) },
      });
    } else {
      triggerHaptic("warning");
      void resetRoza();
    }
  }, [formatCount, pending, resetRoza, roza, setRoza, undoToast]);

  const counterCard = (
    <Card style={styles.progressCard}>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}>
          <ThemedText type="display" style={[styles.statValue, { color: info.text }]}>
            {formatCount(roza.remaining)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.remaining")}
          </ThemedText>
        </View>
        <View
          style={[styles.statBox, { backgroundColor: success.soft, borderColor: success.border }]}
        >
          <ThemedText type="display" style={[styles.statValue, { color: success.text }]}>
            {formatCount(roza.completed)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.madeUp")}
          </ThemedText>
        </View>
      </View>

      {total > 0 ? (
        <View style={styles.progressBlock}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.qazaProgress", { pct: progressPct })}
          </ThemedText>
          <ProgressBar
            value={progress}
            accessibilityLabel={t("a11yProgress.qazaFasts")}
            height={6}
            color={success.color}
          />
        </View>
      ) : null}

      <View style={styles.actionRow}>
        <Button
          label={t("qazaRoza.logMakeUp")}
          icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
          disabled={roza.remaining === 0}
          preferredFocus
          onPress={madeUp}
          style={styles.madeUp}
        />
        <IconButton
          accessibilityLabel={t("qazaRoza.editCountA11y")}
          onPress={() => setEditOpen(true)}
          name={{ ios: "pencil", android: "edit", web: "edit" }}
          size={20}
          tintColor={colors.mutedForeground}
        />
      </View>
      {tv && undoToast.undoAvailable ? (
        <Button
          label={t("uiFeedback.undo")}
          variant="secondary"
          size="sm"
          onPress={() => undoToast.undo()}
          style={styles.resetCounter}
        />
      ) : null}
    </Card>
  );

  const estimateCard = (
    <Card>
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
        <View style={styles.yearsInputWrap}>
          <NumberField
            label={t("qazaRoza.yearsLabel")}
            value={years}
            onChangeValue={setYears}
            maxFractionDigits={0}
            max={MAX_ESTIMATE_YEARS}
            min={0}
            placeholder="0"
            step={1}
          />
        </View>
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
      <ContentState
        status={ready ? "ready" : loadError ? "error" : "loading"}
        onRetry={() => void trackerStore.getState().load()}
        skeleton="card"
        skeletonCount={2}
        loadingLabel={t("uiFeedback.loading")}
      >
        <Stagger>
          {twoPane ? (
            <View style={styles.split}>
              <View style={styles.pane}>{counterCard}</View>
              <View style={styles.pane}>{estimateCard}</View>
            </View>
          ) : (
            <>
              {counterCard}
              {estimateCard}
            </>
          )}
        </Stagger>
      </ContentState>

      <ConfirmDialog
        visible={pending != null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={pending?.kind === "reset" ? t("common.reset") : t("qazaRoza.addToRemaining")}
        destructive={pending?.kind === "reset"}
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />

      <QazaCountEditModal
        visible={editOpen}
        initialValue={roza.remaining}
        title={t("qazaRoza.editCountTitle")}
        hint={tTv(t, "qazaRoza.editCountHint", "qazaRoza.editCountHintTv")}
        accessibilityLabel={t("qazaRoza.editCountA11y")}
        onStep={(next) => void setRoza({ ...roza, remaining: next })}
        onSubmit={setExact}
        resetLabel={t("qazaRoza.resetCounter")}
        canReset={roza.remaining > 0 || roza.completed > 0}
        onReset={() => {
          setEditOpen(false);
          setPending({ kind: "reset" });
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
    borderWidth: BorderWidth.hairline,
  },
  statValue: {
    fontVariant: ["tabular-nums"],
  },
  progressBlock: {
    gap: Spacing.oneHalf,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  madeUp: {
    flex: 1,
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
    minWidth: 120,
    flexGrow: 1,
  },
  applyButton: {
    marginTop: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza/roza");
