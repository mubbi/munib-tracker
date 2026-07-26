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
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Stepper } from "@/components/ui/stepper";
import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { Radius, Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import {
  useQazaCounters,
  useQazaDailyProgress,
  useQazaSchedule,
  useQazaSummary,
  useTrackerActions,
} from "@/stores/tracker-store";

type QazaConfirmAction =
  | {
      kind: "decrement" | "increment" | "setRemaining";
      prayerId: QazaPrayer;
      nextRemaining: number;
      completed: number;
    }
  | { kind: "perform"; prayerId: QazaPrayer }
  | { kind: "resetPrayer"; prayerId: QazaPrayer }
  | { kind: "resetAll" };

type QazaEditTarget = {
  prayerId: QazaPrayer;
  remaining: number;
  completed: number;
};

export default function QazaHomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const counters = useQazaCounters();
  const schedule = useQazaSchedule();
  const dailyProgress = useQazaDailyProgress();
  const summary = useQazaSummary();
  const { adjustQaza, performQaza, resetQazaCounter, resetAllQazaCounters, refresh } =
    useTrackerActions();
  const [pending, setPending] = useState<QazaConfirmAction | null>(null);
  const [editTarget, setEditTarget] = useState<QazaEditTarget | null>(null);

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
  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => {
    const n = Number(value);
    return (Number.isFinite(n) ? n : 0).toLocaleString(locale);
  };
  const info = tokens.status.info;
  const success = tokens.status.success;
  const dailyTotal = useMemo(() => sumQazaScheduleTargets(schedule), [schedule]);
  const eta = useMemo(
    () => computeQazaEta(summary.remaining, dailyTotal, getLocalDateString()),
    [dailyTotal, summary.remaining],
  );

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    const prayerName = (prayerId: QazaPrayer) => t(`prayers.${prayerId}`);

    switch (pending.kind) {
      case "decrement":
        return {
          title: t("qaza.confirmDecrementTitle"),
          message: t("qaza.confirmDecrementMsg", {
            prayer: prayerName(pending.prayerId),
            remaining: pending.nextRemaining,
          }),
        };
      case "increment":
        return {
          title: t("qaza.confirmIncrementTitle"),
          message: t("qaza.confirmIncrementMsg", {
            prayer: prayerName(pending.prayerId),
            remaining: pending.nextRemaining,
          }),
        };
      case "setRemaining":
        return {
          title: t("qaza.confirmSetRemainingTitle"),
          message: t("qaza.confirmSetRemainingMsg", {
            prayer: prayerName(pending.prayerId),
            remaining: pending.nextRemaining,
          }),
        };
      case "perform":
        return {
          title: t("qaza.confirmPerformTitle"),
          message: t("qaza.confirmPerformMsg", { prayer: prayerName(pending.prayerId) }),
        };
      case "resetPrayer":
        return {
          title: t("qaza.confirmResetPrayerTitle"),
          message: t("qaza.confirmResetPrayerMsg", { prayer: prayerName(pending.prayerId) }),
        };
      case "resetAll":
        return {
          title: t("qaza.confirmResetAllTitle"),
          message: t("qaza.confirmResetAllMsg", {
            remaining: summary.remaining,
            completed: summary.completed,
          }),
        };
      default:
        return null;
    }
  }, [pending, summary.completed, summary.remaining, t]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    switch (pending.kind) {
      case "decrement":
      case "increment":
      case "setRemaining":
        void adjustQaza(pending.prayerId, pending.nextRemaining, pending.completed);
        break;
      case "perform":
        void performQaza(pending.prayerId);
        trackReviewInteraction("mark_qaza");
        break;
      case "resetPrayer":
        void resetQazaCounter(pending.prayerId);
        break;
      case "resetAll":
        void resetAllQazaCounters();
        break;
    }
  }, [adjustQaza, pending, performQaza, resetAllQazaCounters, resetQazaCounter]);

  const toolActions = useMemo<QuickActionItem[]>(
    () => [
      {
        id: "calculator",
        label: t("qaza.calculator"),
        icon: {
          ios: "plus.forwardslash.minus",
          android: "calculate",
          web: "calculate",
        },
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

  return (
    <ScreenLayout
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
      <Stagger>
        <Card
          padding="three"
          style={styles.summaryCard}
          accessibilityLabel={t("home.qazaA11y", {
            remaining: summary.remaining,
            completed: summary.completed,
            pct: progressPct,
          })}
        >
          <View style={styles.statsRow}>
            <View
              style={[styles.statBox, { backgroundColor: info.soft, borderColor: info.border }]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: info.text }]}>
                {formatCount(summary.remaining)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("stats.remaining")}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: success.soft, borderColor: success.border },
              ]}
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
              <ProgressBar value={progress} height={6} color={success.color} />
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

          <Button
            label={t("qaza.resetAll")}
            variant="ghost"
            size="sm"
            icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
            disabled={!hasAnyCounts}
            onPress={() => setPending({ kind: "resetAll" })}
            style={styles.resetAll}
          />
        </Card>

        <QuickActionGrid items={toolActions} columns={4} />

        <WitrQazaInfo />

        <Card padding="three">
          <SectionHeader
            title={t("qaza.perPrayer")}
            icon={{ ios: "list.bullet", android: "list", web: "list" }}
          />
          <View style={styles.rows}>
            {counters.map((counter) => {
              const target = schedule.targets[counter.prayerId] ?? 0;
              const doneToday = dailyProgress.completed[counter.prayerId] ?? 0;
              const hasCounts = counter.remaining > 0 || counter.completed > 0;

              return (
                <View
                  key={counter.prayerId}
                  style={[styles.row, { backgroundColor: colors.muted }]}
                >
                  <IconWell icon={PRAYER_ICONS[counter.prayerId]} />
                  <View style={styles.rowBody}>
                    <View style={styles.rowTitle}>
                      <ThemedText type="smallBold" numberOfLines={1} style={styles.rowName}>
                        {t(`prayers.${counter.prayerId}`)}
                      </ThemedText>
                      <ThemedText
                        type="header"
                        style={[styles.rowRemaining, { color: info.text }]}
                        numberOfLines={1}
                      >
                        {formatCount(counter.remaining)}
                      </ThemedText>
                    </View>
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
                      {target > 0
                        ? t("qaza.rowDoneWithDaily", {
                            completed: formatCount(counter.completed),
                            done: doneToday,
                            target,
                          })
                        : t("qaza.rowDone", {
                            completed: formatCount(counter.completed),
                          })}
                    </ThemedText>
                    <View style={styles.rowActions}>
                      <IconButton
                        accessibilityLabel={t("qaza.resetPrayer", {
                          prayer: t(`prayers.${counter.prayerId}`),
                        })}
                        disabled={!hasCounts}
                        onPress={() =>
                          setPending({ kind: "resetPrayer", prayerId: counter.prayerId })
                        }
                        name={{
                          ios: "arrow.counterclockwise",
                          android: "restart_alt",
                          web: "restart_alt",
                        }}
                        size={20}
                        tintColor={colors.mutedForeground}
                      />

                      <Stepper
                        value={counter.remaining}
                        label={t(`prayers.${counter.prayerId}`)}
                        valueAccessibilityLabel={t("qaza.editCountA11y", {
                          prayer: t(`prayers.${counter.prayerId}`),
                        })}
                        onValuePress={() =>
                          setEditTarget({
                            prayerId: counter.prayerId,
                            remaining: counter.remaining,
                            completed: counter.completed,
                          })
                        }
                        onDecrement={() =>
                          setPending({
                            kind: "decrement",
                            prayerId: counter.prayerId,
                            nextRemaining: counter.remaining - 1,
                            completed: counter.completed,
                          })
                        }
                        onIncrement={() =>
                          setPending({
                            kind: "increment",
                            prayerId: counter.prayerId,
                            nextRemaining: counter.remaining + 1,
                            completed: counter.completed,
                          })
                        }
                      />

                      <IconButton
                        accessibilityLabel={t("qaza.markPerformed", {
                          prayer: t(`prayers.${counter.prayerId}`),
                        })}
                        disabled={counter.remaining === 0}
                        onPress={() => setPending({ kind: "perform", prayerId: counter.prayerId })}
                        name={{
                          ios: "checkmark.circle.fill",
                          android: "check_circle",
                          web: "check_circle",
                        }}
                        size={26}
                        tintColor={success.color}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {tTv(t, "qaza.hint", "qaza.hintTv")}
          </ThemedText>
        </Card>
      </Stagger>

      <ConfirmDialog
        visible={pending != null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={t("common.confirm")}
        destructive={pending?.kind === "resetPrayer" || pending?.kind === "resetAll"}
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />

      <QazaCountEditModal
        visible={editTarget != null}
        prayerLabel={editTarget ? t(`prayers.${editTarget.prayerId}`) : ""}
        initialValue={editTarget?.remaining ?? 0}
        onSubmit={(nextRemaining) => {
          const target = editTarget;
          setEditTarget(null);
          if (!target || nextRemaining === target.remaining) return;
          setPending({
            kind: "setRemaining",
            prayerId: target.prayerId,
            nextRemaining,
            completed: target.completed,
          });
        }}
        onClose={() => setEditTarget(null)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  progressBlock: {
    gap: Spacing.one + 2,
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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two + 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  rowTitle: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.two,
  },
  rowName: {
    flex: 1,
    minWidth: 0,
  },
  rowRemaining: {
    fontVariant: ["tabular-nums"],
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.one,
    flexWrap: "wrap",
  },
  hint: {
    marginTop: Spacing.three,
  },
});
