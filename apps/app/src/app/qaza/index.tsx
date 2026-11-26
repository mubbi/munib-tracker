import type { QazaPrayer } from "@munib-tracker/shared/types";
import {
  computeQazaEta,
  formatShortDate,
  getLocalDateString,
  sumQazaScheduleTargets,
} from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { Divider } from "@/components/ui/divider";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { Durations, Springs } from "@/constants/motion";
import { BorderWidth, Breakpoints, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useFormatCount } from "@/hooks/use-format-count";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
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

/** The remaining count, with a small spring "tick" whenever it changes (skipped under Reduce Motion). */
function TickingCount({ value, label, color }: { value: number; label: string; color: string }) {
  const formatCount = useFormatCount();
  const reducedMotion = useHydrationSafeReducedMotion();
  const scale = useSharedValue(1);
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    if (reducedMotion) return;
    scale.value = withSequence(
      withTiming(1.18, { duration: Durations.fast }),
      withSpring(1, Springs.pop),
    );
  }, [reducedMotion, scale, value]);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animated}>
      <ThemedText
        type="subtitle"
        accessibilityLabel={label}
        style={[styles.rowRemaining, { color }]}
      >
        {formatCount(value)}
      </ThemedText>
    </Animated.View>
  );
}

type QazaPrayerRowProps = {
  prayerId: QazaPrayer;
  remaining: number;
  completed: number;
  doneToday: number;
  target: number;
  onMadeUp: () => void;
  onEdit: () => void;
};

/**
 * One compact prayer row: icon, name, "N made up · today x/y", the remaining
 * count in the theme colour, and a round check on the trailing edge that logs
 * one make-up. Tapping (or long-pressing) the row opens the exact-count editor;
 * a thin line under it shows this prayer's progress. The check is a sibling of
 * the row's pressable — never nested (web `<button>` rule) — so a D-pad reaches
 * both.
 */
function QazaPrayerRow({
  prayerId,
  remaining,
  completed,
  doneToday,
  target,
  onMadeUp,
  onEdit,
}: QazaPrayerRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const formatCount = useFormatCount();
  const tv = isTV();
  const prayer = t(`prayers.${prayerId}`);
  const allMadeUp = remaining === 0 && completed > 0;
  const tracked = remaining + completed;
  const progress = tracked > 0 ? completed / tracked : 0;
  const detail =
    target > 0
      ? t("qaza.rowDoneWithDaily", { completed: formatCount(completed), done: doneToday, target })
      : t("qaza.rowDone", { completed: formatCount(completed) });
  const remainingLabel = t("qaza.rowRemainingA11y", { prayer, value: formatCount(remaining) });
  const editLabel = t("qaza.editCountA11y", { prayer });

  return (
    <View style={styles.prayer}>
      <View style={styles.prayerTop}>
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={[remainingLabel, detail, allMadeUp ? t("qaza.allMadeUp") : undefined]
            .filter(Boolean)
            .join(", ")}
          accessibilityHint={editLabel}
          accessibilityActions={[{ name: "activate", label: editLabel }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "activate") onEdit();
          }}
          onPress={onEdit}
          onLongPress={onEdit}
          style={[styles.prayerMain, tv && styles.prayerMainTv]}
        >
          <IconWell
            icon={PRAYER_ICONS[prayerId]}
            well={tv ? 44 : 36}
            size={tv ? IconSize.lg : IconSize.md}
            radius={Radius.sm}
            tint={tokens.accentOnSoft}
          />
          <View style={styles.rowBody}>
            <ThemedText type="smallBold">{prayer}</ThemedText>
            {allMadeUp ? (
              <View style={styles.allDone}>
                <AppIcon
                  icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
                  size={IconSize.xs}
                  tintColor={tokens.status.success.text}
                />
                <ThemedText type="caption" style={{ color: tokens.status.success.text }}>
                  {t("qaza.allMadeUp")}
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="caption" themeColor="mutedForeground">
                {detail}
              </ThemedText>
            )}
          </View>
          {allMadeUp ? null : (
            <TickingCount
              value={remaining}
              label={remainingLabel}
              color={remaining > 0 ? colors.accentText : colors.mutedForeground}
            />
          )}
        </PressableScale>
        <PressableScale
          haptic={false}
          accessibilityRole="button"
          accessibilityLabel={t("qaza.madeUpOneA11y", { prayer })}
          accessibilityHint={t("qaza.markPerformed", { prayer })}
          disabled={remaining === 0}
          onPress={onMadeUp}
          rippleBorderless
          scaleTo={0.9}
          hitSlop={tv ? undefined : 4}
          style={[
            styles.check,
            tv && styles.checkTv,
            remaining > 0
              ? { backgroundColor: colors.accent, borderColor: colors.accent }
              : { backgroundColor: tokens.status.success.soft, borderColor: tokens.hairline },
          ]}
        >
          <AppIcon
            icon={{ ios: "checkmark", android: "check", web: "check" }}
            size={tv ? IconSize.xl : IconSize.lg}
            tintColor={remaining > 0 ? colors.accentForeground : tokens.status.success.onSoft}
          />
        </PressableScale>
      </View>
      {tracked > 0 ? (
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={[styles.progressTrack, { backgroundColor: tokens.track }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: allMadeUp ? tokens.status.success.color : colors.accent,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

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
        <View
          style={[
            styles.statBox,
            { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
          ]}
        >
          <ThemedText type="header" style={[styles.statValue, { color: tokens.accentOnSoft }]}>
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
      {/* Tablet / desktop / TV: a 2-column grid; D-pad moves between a row's
        edit target and its check horizontally, and between prayers vertically. */}
      <View style={[styles.rows, (tv || rowsGrid) && styles.rowsGrid]}>
        {counters.map((counter, index) => {
          const target = schedule.targets[counter.prayerId] ?? 0;
          const doneToday = dailyProgress.completed[counter.prayerId] ?? 0;
          return (
            <View
              key={counter.prayerId}
              style={
                tv || rowsGrid ? [styles.rowCellGrid, { borderColor: tokens.hairline }] : undefined
              }
            >
              {index > 0 && !(tv || rowsGrid) ? <Divider /> : null}
              <QazaPrayerRow
                prayerId={counter.prayerId}
                remaining={counter.remaining}
                completed={counter.completed}
                doneToday={doneToday}
                target={target}
                onMadeUp={() => madeUp(counter.prayerId)}
                onEdit={() => setEditPrayer(counter.prayerId)}
              />
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

  // Compact 4-up row of the Qaza tools (calculator, planner, fasting, history).
  const tools = (
    <Card padding="two">
      <QuickActionGrid items={toolActions} columns={4} singleRow />
    </Card>
  );

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
                {perPrayerCard}
                {resetAllButton}
              </View>
              <View style={styles.aside}>
                {summaryCard}
                {tools}
                <WitrQazaInfo />
              </View>
            </View>
          ) : (
            <>
              {summaryCard}
              {tools}
              <WitrQazaInfo />
              {perPrayerCard}
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
    marginTop: Spacing.two,
  },
  rowsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  rowCellGrid: {
    flexBasis: "45%",
    flexGrow: 1,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  hint: {
    marginTop: Spacing.three,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  rowRemaining: {
    fontVariant: ["tabular-nums"],
  },
  prayer: {
    paddingVertical: Spacing.two,
    gap: Spacing.oneHalf,
  },
  prayerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  prayerMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    minHeight: Control.md,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  prayerMainTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
  },
  allDone: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  check: {
    width: Control.md,
    height: Control.md,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
  checkTv: {
    width: TvLayout.minFocusTarget,
    height: TvLayout.minFocusTarget,
  },
  progressTrack: {
    height: tvDp(3),
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginStart: tvDp(36) + Spacing.twoHalf,
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza");
