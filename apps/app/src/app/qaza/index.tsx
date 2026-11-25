import type { QazaPrayer } from "@munib-tracker/shared/types";
import {
  computeQazaEta,
  formatShortDate,
  getLocalDateString,
  sumQazaScheduleTargets,
} from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
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
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { BorderWidth, Breakpoints, Radius, Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useFormatCount } from "@/hooks/use-format-count";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import {
  trackerStore,
  useQazaCounters,
  useQazaDailyProgress,
  useQazaSchedule,
  useQazaSummary,
  useTrackerActions,
  useTrackerLoadError,
  useTrackerReady,
} from "@/stores/tracker-store";

type QazaConfirmAction = { kind: "resetPrayer"; prayerId: QazaPrayer } | { kind: "resetAll" };

export default function QazaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const ready = useTrackerReady();
  const loadError = useTrackerLoadError();
  const counters = useQazaCounters();
  const schedule = useQazaSchedule();
  const dailyProgress = useQazaDailyProgress();
  const summary = useQazaSummary();
  const { adjustQaza, performQaza, undoQaza, resetQazaCounter, resetAllQazaCounters, refresh } =
    useTrackerActions();
  const undoToast = useUndoToast();
  const formatCount = useFormatCount();
  const [pending, setPending] = useState<QazaConfirmAction | null>(null);
  const [editPrayer, setEditPrayer] = useState<QazaPrayer | null>(null);
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Desktop / wide web: counters on the start side, summary + tools in an aside. */
  const twoPane = !tv && width >= 1200;
  /** Tablet + desktop: per-prayer rows in a 2-column grid (TV keeps its own grid). */
  const rowsGrid = !tv && width >= Breakpoints.tablet;

  // Re-read persistence when this screen is focused so calculator / planner /
  // external-command updates are visible immediately on return.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const hasAnyCounts = summary.remaining > 0 || summary.completed > 0;
  const totalTracked = summary.remaining + summary.completed;
  const progress = totalTracked > 0 ? summary.completed / totalTracked : 0;
  const progressPct = Math.round(progress * 100);
  const info = tokens.status.info;
  const success = tokens.status.success;
  const dailyTotal = useMemo(() => sumQazaScheduleTargets(schedule), [schedule]);
  const eta = useMemo(
    () => computeQazaEta(summary.remaining, dailyTotal, getLocalDateString()),
    [dailyTotal, summary.remaining],
  );
  const editCounter = editPrayer ? counters.find((c) => c.prayerId === editPrayer) : undefined;

  /** One tap: log a make-up, success haptic, toast with Undo (which also restores today's progress). */
  const madeUp = (prayerId: QazaPrayer) => {
    triggerHaptic("success");
    trackReviewInteraction("mark_qaza");
    void undoToast.run({
      do: () => performQaza(prayerId),
      undo: () => undoQaza(prayerId),
      messageKey: "qaza.toastMadeUp",
      messageOptions: { prayer: t(`prayers.${prayerId}`) },
    });
  };

  /** Exact value from the edit sheet: applied at once, reversible from the toast. */
  const setExact = (prayerId: QazaPrayer, nextRemaining: number) => {
    const before = counters.find((c) => c.prayerId === prayerId);
    if (!before || before.remaining === nextRemaining) return;
    void undoToast.run({
      do: () => adjustQaza(prayerId, nextRemaining, before.completed),
      undo: () => adjustQaza(prayerId, before.remaining, before.completed),
      messageKey: "qaza.toastSet",
      messageOptions: { prayer: t(`prayers.${prayerId}`), value: formatCount(nextRemaining) },
    });
  };

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    if (pending.kind === "resetPrayer") {
      return {
        title: t("qaza.confirmResetPrayerTitle"),
        message: t("qaza.confirmResetPrayerMsg", { prayer: t(`prayers.${pending.prayerId}`) }),
      };
    }
    return {
      title: t("qaza.confirmResetAllTitle"),
      message: t("qaza.confirmResetAllMsg", {
        remaining: summary.remaining,
        completed: summary.completed,
      }),
    };
  }, [pending, summary.completed, summary.remaining, t]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    triggerHaptic("warning");
    if (pending.kind === "resetPrayer") void resetQazaCounter(pending.prayerId);
    else void resetAllQazaCounters();
  }, [pending, resetAllQazaCounters, resetQazaCounter]);

  const toolActions = useMemo<QuickActionItem[]>(
    () => [
      {
        id: "calculator",
        label: t("qaza.calculator"),
        icon: { ios: "plus.forwardslash.minus", android: "calculate", web: "calculate" },
        tint: colors.accent,
        onPress: () => router.push("/qaza/calculator"),
      },
      {
        id: "planner",
        label: t("qaza.planner"),
        icon: { ios: "calendar.badge.clock", android: "event", web: "event" },
        tint: tokens.status.info.color,
        onPress: () => router.push("/qaza/planner"),
      },
      {
        id: "roza",
        label: t("qaza.roza"),
        icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
        tint: tokens.status.warning.color,
        onPress: () => router.push("/qaza/roza"),
      },
      {
        id: "history",
        label: t("qaza.history"),
        icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
        tint: tokens.status.success.color,
        onPress: () => router.push("/qaza/history"),
      },
    ],
    [colors.accent, router, t, tokens],
  );

  const resetAllButton = (
    <Button
      label={t("qaza.resetAll")}
      variant="ghost"
      size="sm"
      icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
      disabled={!hasAnyCounts}
      onPress={() => setPending({ kind: "resetAll" })}
      style={styles.resetAll}
    />
  );

  const summaryCard = (
    <Card
      style={styles.summaryCard}
      accessibilityLabel={t("home.qazaA11y", {
        remaining: summary.remaining,
        completed: summary.completed,
        pct: progressPct,
      })}
    >
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}>
          <ThemedText type="header" style={[styles.statValue, { color: info.text }]}>
            {formatCount(summary.remaining)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.remaining")}
          </ThemedText>
        </View>
        <View
          style={[styles.statBox, { backgroundColor: success.soft, borderColor: success.border }]}
        >
          <ThemedText type="header" style={[styles.statValue, { color: success.text }]}>
            {formatCount(summary.completed)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("stats.madeUp")}
          </ThemedText>
        </View>
      </View>

      {totalTracked > 0 ? (
        <View style={styles.progressBlock}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("home.qazaProgress", { pct: progressPct })}
          </ThemedText>
          <ProgressBar
            value={progress}
            accessibilityLabel={t("a11yProgress.qazaMadeUp")}
            height={6}
            color={success.color}
          />
        </View>
      ) : null}

      {eta ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.etaCaption}>
          {t("qazaPlan.etaCaption", {
            count: summary.remaining,
            date: formatShortDate(eta.date),
          })}
        </ThemedText>
      ) : null}
    </Card>
  );

  const perPrayerCard = (
    <Card>
      <SectionHeader
        title={t("qaza.perPrayer")}
        icon={{ ios: "list.bullet", android: "list", web: "list" }}
      />
      {/* TV: 2-column grid uses the landscape width; D-pad moves within a row's
        controls horizontally and between prayers vertically. */}
      <View style={[styles.rows, (tv || rowsGrid) && styles.rowsTv]}>
        {counters.map((counter) => {
          const target = schedule.targets[counter.prayerId] ?? 0;
          const doneToday = dailyProgress.completed[counter.prayerId] ?? 0;
          const prayer = t(`prayers.${counter.prayerId}`);

          return (
            <View
              key={counter.prayerId}
              style={[
                styles.row,
                (tv || rowsGrid) && styles.rowTv,
                { backgroundColor: colors.muted },
              ]}
            >
              <View style={styles.rowTop}>
                <IconWell icon={PRAYER_ICONS[counter.prayerId]} />
                <View style={styles.rowBody}>
                  <ThemedText type="smallBold">{prayer}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {target > 0
                      ? t("qaza.rowDoneWithDaily", {
                          completed: formatCount(counter.completed),
                          done: doneToday,
                          target,
                        })
                      : t("qaza.rowDone", { completed: formatCount(counter.completed) })}
                  </ThemedText>
                </View>
                <ThemedText
                  type="header"
                  style={[styles.rowRemaining, { color: info.text }]}
                  accessibilityLabel={t("qaza.rowRemainingA11y", {
                    prayer,
                    value: formatCount(counter.remaining),
                  })}
                >
                  {formatCount(counter.remaining)}
                </ThemedText>
              </View>
              <View style={styles.rowActions}>
                <Button
                  label={t("qaza.madeUpButton")}
                  accessibilityHint={t("qaza.markPerformed", { prayer })}
                  variant="secondary"
                  icon={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  disabled={counter.remaining === 0}
                  onPress={() => madeUp(counter.prayerId)}
                  style={styles.madeUp}
                />
                <IconButton
                  accessibilityLabel={t("qaza.editCountA11y", { prayer })}
                  onPress={() => setEditPrayer(counter.prayerId)}
                  name={{ ios: "pencil", android: "edit", web: "edit" }}
                  size={20}
                  tintColor={colors.mutedForeground}
                />
              </View>
            </View>
          );
        })}
      </View>
      {tv && undoToast.undoAvailable ? (
        <Button
          label={t("uiFeedback.undo")}
          variant="secondary"
          size="sm"
          onPress={() => undoToast.undo()}
          style={styles.resetAll}
        />
      ) : null}
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {tTv(t, "qaza.hint", "qaza.hintTv")}
      </ThemedText>
    </Card>
  );

  const tools = <QuickActionGrid items={toolActions} columns={twoPane ? 2 : 4} />;

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qaza.eyebrow")}
      title={t("qaza.title")}
      subtitle={t("qaza.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/qaza"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("qaza.title"), path: "/qaza" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qaza",
            name: "Qaza Salah Tracker",
            description: "Track and clear missed (qaza) prayers, one make-up at a time.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
            ],
          }),
          faqSchema(getRouteFaq("/qaza") ?? []),
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
              <View style={styles.primary}>
                {summaryCard}
                {perPrayerCard}
              </View>
              <View style={styles.aside}>
                {tools}
                <WitrQazaInfo />
                {resetAllButton}
              </View>
            </View>
          ) : (
            <>
              {summaryCard}
              {perPrayerCard}
              {tools}
              <WitrQazaInfo />
              {resetAllButton}
            </>
          )}
        </Stagger>
      </ContentState>

      <ConfirmDialog
        visible={pending != null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={pending?.kind === "resetAll" ? t("qaza.resetAll") : t("common.reset")}
        destructive
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />

      <QazaCountEditModal
        visible={editPrayer != null}
        prayerLabel={editPrayer ? t(`prayers.${editPrayer}`) : ""}
        initialValue={editCounter?.remaining ?? 0}
        onStep={(next) => {
          if (editCounter) void adjustQaza(editCounter.prayerId, next, editCounter.completed);
        }}
        onSubmit={(next) => {
          if (editPrayer) setExact(editPrayer, next);
        }}
        resetLabel={t("qaza.resetPrayer", {
          prayer: editPrayer ? t(`prayers.${editPrayer}`) : "",
        })}
        canReset={(editCounter?.remaining ?? 0) > 0 || (editCounter?.completed ?? 0) > 0}
        onReset={() => {
          if (!editPrayer) return;
          const prayerId = editPrayer;
          setEditPrayer(null);
          setPending({ kind: "resetPrayer", prayerId });
        }}
        onClose={() => setEditPrayer(null)}
      />
    </ScreenLayout>
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
  summaryCard: {
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
  progressBlock: {
    gap: Spacing.oneHalf,
  },
  etaCaption: {
    textAlign: "center",
  },
  statValue: {
    fontVariant: ["tabular-nums"],
  },
  resetAll: {
    alignSelf: "center",
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  rowsTv: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rowTv: {
    flexBasis: "45%",
    flexGrow: 1,
  },
  row: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  rowRemaining: {
    fontVariant: ["tabular-nums"],
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  madeUp: {
    flexShrink: 1,
  },
  hint: {
    marginTop: Spacing.three,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza");
