import type { QazaPrayer } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { StatPair } from "@/components/ui/stat-pair";
import { Stepper } from "@/components/ui/stepper";
import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
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
      kind: "decrement" | "increment";
      prayerId: QazaPrayer;
      nextRemaining: number;
      completed: number;
    }
  | { kind: "perform"; prayerId: QazaPrayer }
  | { kind: "resetPrayer"; prayerId: QazaPrayer }
  | { kind: "resetAll" };

export default function QazaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const counters = useQazaCounters();
  const schedule = useQazaSchedule();
  const dailyProgress = useQazaDailyProgress();
  const summary = useQazaSummary();
  const { adjustQaza, performQaza, resetQazaCounter, resetAllQazaCounters } = useTrackerActions();
  const [pending, setPending] = useState<QazaConfirmAction | null>(null);

  const hasAnyCounts = summary.remaining > 0 || summary.completed > 0;

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
        void adjustQaza(pending.prayerId, pending.nextRemaining, pending.completed);
        break;
      case "perform":
        void performQaza(pending.prayerId);
        break;
      case "resetPrayer":
        void resetQazaCounter(pending.prayerId);
        break;
      case "resetAll":
        void resetAllQazaCounters();
        break;
    }
  }, [adjustQaza, pending, performQaza, resetAllQazaCounters, resetQazaCounter]);

  return (
    <ScreenLayout
      eyebrow={t("qaza.eyebrow")}
      title={t("qaza.title")}
      subtitle={t("qaza.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
            name: "Qaza Namaz Tracker",
            description: "Track and clear missed (qaza) prayers, one make-up at a time.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
            ],
          }),
          faqSchema([
            {
              question: "What is qaza (qadha) namaz?",
              answer:
                "Qaza (qadha) namaz is a prayer performed after its prescribed time has passed. The majority of scholars hold that missed obligatory prayers must be made up.",
            },
            {
              question: "How do I make up missed prayers?",
              answer:
                "Track how many prayers you owe per type, then pray extra make-up prayers alongside your daily prayers at a steady pace until the backlog is cleared.",
            },
            {
              question: "Is missed Witr counted as qaza?",
              answer:
                "It depends on your madhhab: the Hanafi school treats Witr as wajib and requires making it up, while the Shafi'i, Maliki, and Hanbali schools treat it as a strongly emphasized sunnah for which make-up is recommended.",
            },
          ]),
        ]}
      />
      <Stagger>
        <Card>
          <StatPair
            divider
            primary={{
              value: summary.remaining,
              label: t("stats.remaining"),
              color: tokens.status.info.color,
            }}
            secondary={{
              value: summary.completed,
              label: t("stats.madeUp"),
              color: tokens.status.success.color,
            }}
          />
          <Button
            label={t("qaza.resetAll")}
            variant="ghost"
            icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
            disabled={!hasAnyCounts}
            onPress={() => setPending({ kind: "resetAll" })}
            style={styles.resetAll}
          />
        </Card>

        <View style={styles.tools}>
          <Button
            label={t("qaza.calculator")}
            variant="secondary"
            icon={{ ios: "function", android: "calculate", web: "calculate" }}
            onPress={() => router.push("/qaza/calculator")}
            style={styles.tool}
          />
          <Button
            label={t("qaza.planner")}
            variant="secondary"
            icon={{ ios: "calendar.badge.clock", android: "event", web: "event" }}
            onPress={() => router.push("/qaza/planner")}
            style={styles.tool}
          />
          <Button
            label={t("qaza.roza")}
            variant="secondary"
            icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            onPress={() => router.push("/qaza/roza")}
            style={styles.tool}
          />
        </View>

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
                    <ThemedText type="small">{t(`prayers.${counter.prayerId}`)}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {target > 0
                        ? t("qaza.rowMetaWithDaily", {
                            remaining: counter.remaining,
                            completed: counter.completed,
                            done: doneToday,
                            target,
                          })
                        : t("qaza.rowMeta", {
                            remaining: counter.remaining,
                            completed: counter.completed,
                          })}
                    </ThemedText>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("qaza.resetPrayer", {
                      prayer: t(`prayers.${counter.prayerId}`),
                    })}
                    disabled={!hasCounts}
                    hitSlop={6}
                    onPress={() => setPending({ kind: "resetPrayer", prayerId: counter.prayerId })}
                    style={{ opacity: hasCounts ? 1 : 0.3 }}
                  >
                    <SymbolView
                      name={{
                        ios: "arrow.counterclockwise",
                        android: "restart_alt",
                        web: "restart_alt",
                      }}
                      size={20}
                      tintColor={colors.mutedForeground}
                    />
                  </Pressable>

                  <Stepper
                    value={counter.remaining}
                    label={t(`prayers.${counter.prayerId}`)}
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

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("qaza.markPerformed", {
                      prayer: t(`prayers.${counter.prayerId}`),
                    })}
                    disabled={counter.remaining === 0}
                    hitSlop={6}
                    onPress={() => setPending({ kind: "perform", prayerId: counter.prayerId })}
                    style={{ opacity: counter.remaining === 0 ? 0.3 : 1 }}
                  >
                    <SymbolView
                      name={{
                        ios: "checkmark.circle.fill",
                        android: "check_circle",
                        web: "check_circle",
                      }}
                      size={26}
                      tintColor={tokens.status.success.color}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("qaza.hint")}
          </ThemedText>
        </Card>
      </Stagger>

      {confirmCopy ? (
        <ConfirmDialog
          visible={pending != null}
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmLabel={t("common.confirm")}
          destructive={pending?.kind === "resetPrayer" || pending?.kind === "resetAll"}
          onConfirm={handleConfirm}
          onClose={() => setPending(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  resetAll: {
    marginTop: Spacing.three,
    alignSelf: "center",
  },
  tools: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tool: {
    flex: 1,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  hint: {
    marginTop: Spacing.three,
  },
});
