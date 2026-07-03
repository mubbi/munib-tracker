import { ACHIEVEMENTS, newlyUnlocked } from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { ScreenLayout } from "@/components/screen-layout";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { NavRow } from "@/components/ui/nav-row";
import { ProgressRing } from "@/components/ui/progress-ring";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { StatCard } from "@/components/ui/stat-card";
import { Durations } from "@/constants/motion";
import { Radius, Spacing } from "@/constants/theme";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import {
  useAchievementStats,
  useDailySummary,
  useStreak,
  useTodayPrayers,
  useTrackerActions,
} from "@/stores/tracker-store";

function encouragementKey(progress: number): string {
  if (progress >= 1) return "tracker.allDone";
  if (progress === 0) return "tracker.freshStart";
  if (progress < 0.5) return "tracker.keepGoingShort";
  return "tracker.almostThere";
}

const CONFETTI_COLORS = ["#D4AF37", "#4CAF7D", "#5AA9E6", "#F2C94C"];

export default function TrackerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const streak = useStreak();
  const stats = useAchievementStats();
  const { status, notes } = useTodayPrayers();
  const { setPrayerStatus, setPrayerNotes } = useTrackerActions();
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);

  const progress = summary.salahTotal ? summary.salahCompleted / summary.salahTotal : 0;
  const isComplete = progress >= 1;

  // --- Confetti + achievement celebration -----------------------------------
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  // Guards so we only fire on the pending -> complete *edge*, not every render.
  const prevCompleteRef = useRef<boolean | null>(null);
  const knownAchievementsRef = useRef<string[] | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Load the persisted unlocked set once so the first refresh doesn't
  // re-announce badges the user already earned.
  useEffect(() => {
    let active = true;
    void (async () => {
      const known = await readJSON<string[]>(DB_KEYS.achievements, []);
      if (active) knownAchievementsRef.current = known;
    })();
    return () => {
      active = false;
    };
  }, []);

  // Daily obligatory ring crossing to 100% — fire confetti + success haptic
  // only on the pending -> complete edge (bump the celebrationKey once).
  useEffect(() => {
    const prev = prevCompleteRef.current;
    if (prev === false && isComplete) {
      triggerHaptic("success");
      setCelebrationKey((k) => k + 1);
    }
    prevCompleteRef.current = isComplete;
  }, [isComplete]);

  // Newly-unlocked achievements — evaluate against the persisted set, and on a
  // non-empty result celebrate + persist so it isn't announced again.
  useEffect(() => {
    const known = knownAchievementsRef.current;
    if (known == null) return; // wait until the persisted set has loaded
    const unlocked = newlyUnlocked(stats, known);
    if (unlocked.length === 0) return;

    const merged = Array.from(new Set([...known, ...unlocked]));
    knownAchievementsRef.current = merged;
    void writeJSON(DB_KEYS.achievements, merged);

    const first = ACHIEVEMENTS.find((a) => a.id === unlocked[0]);
    triggerHaptic("success");
    setCelebrationKey((k) => k + 1);
    showToast(t("achievements.unlockedToast", { name: first?.title ?? "" }));
  }, [stats, showToast, t]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const shortcuts: QuickActionItem[] = [
    {
      id: "zikr",
      label: t("actions.zikr"),
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      tint: tokens.status.danger.color,
      onPress: () => router.push("/zikr"),
    },
    {
      id: "tasbeeh",
      label: t("actions.tasbeeh"),
      icon: { ios: "hand.tap.fill", android: "touch_app", web: "touch_app" },
      tint: colors.accent,
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "qaza",
      label: t("actions.qaza"),
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      tint: tokens.status.warning.color,
      onPress: () => router.push("/qaza"),
    },
    {
      id: "calendar",
      label: t("actions.calendar"),
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
      tint: tokens.status.info.color,
      onPress: () => router.push("/calendar"),
    },
  ];

  return (
    <ScreenLayout
      eyebrow={t("tracker.eyebrow")}
      title={t("tracker.title")}
      subtitle={t("tracker.subtitle")}
    >
      <Stagger>
        <View>
          <Card>
            <View style={styles.summaryRow}>
              <ProgressRing
                progress={progress}
                size={100}
                stroke={11}
                color={isComplete ? tokens.status.success.color : undefined}
                caption={t("tracker.salahCaption")}
              />
              <View style={styles.summaryCopy}>
                <ThemedText type="subtitle">{t(encouragementKey(progress))}</ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("tracker.summaryLogged", {
                    completed: summary.salahCompleted,
                    total: summary.salahTotal,
                  })}
                </ThemedText>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View
                accessible
                accessibilityLabel={t("tracker.streakLabel", { count: streak })}
                style={styles.statCell}
              >
                <StatCard
                  label={t("tracker.streakLabel", { count: streak })}
                  value={`🔥 ${streak}`}
                  icon={{
                    ios: "flame.fill",
                    android: "local_fire_department",
                    web: "local_fire_department",
                  }}
                  tint={tokens.status.warning.color}
                />
              </View>
            </View>
          </Card>

          {/* Confetti overlays the summary card on a completion / unlock edge. */}
          <PartyPopper burstKey={celebrationKey} colors={CONFETTI_COLORS} />
        </View>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.obligatory")}
            icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => {
              const current = status[prayerId] ?? "pending";
              return (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={current}
                  hasNotes={!!notes[prayerId]}
                  onPress={() => setActivePrayer(prayerId)}
                  onToggleComplete={() =>
                    setPrayerStatus(prayerId, current === "completed" ? "pending" : "completed")
                  }
                />
              );
            })}
          </View>
        </Card>

        <Card padding="three">
          <CollapsibleSection
            title={t("tracker.sunnahOptional")}
            icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
          >
            <View style={styles.rows}>
              {SUNNAH_PRAYERS.map((prayerId) => (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={status[prayerId] ?? "pending"}
                  hasNotes={!!notes[prayerId]}
                  onPress={() => setActivePrayer(prayerId)}
                />
              ))}
            </View>
          </CollapsibleSection>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("settings.achievements")}
            icon={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
          />
          <View style={styles.rows}>
            <NavRow
              icon={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
              label={t("settings.achievements")}
              onPress={() => router.push("/achievements")}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.keepGoing")}
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          />
          <View style={styles.shortcuts}>
            <QuickActionGrid items={shortcuts} columns={4} />
          </View>
        </Card>
      </Stagger>

      {toast ? <AchievementToast message={toast} /> : null}

      {activePrayer ? (
        <PrayerStatusSheet
          visible
          prayerLabel={t(`prayers.${activePrayer}`)}
          currentStatus={status[activePrayer] ?? "pending"}
          currentNotes={notes[activePrayer]}
          onSelect={(next) => setPrayerStatus(activePrayer, next)}
          onSaveNotes={(text) => setPrayerNotes(activePrayer, text)}
          onClose={() => setActivePrayer(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}

/** A lightweight, self-dismissing in-screen snackbar for unlocked badges. */
function AchievementToast({ message }: { message: string }) {
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const enter = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    enter.value = reducedMotion
      ? 1
      : withTiming(1, { duration: Durations.base, easing: Easing.out(Easing.cubic) });
  }, [enter, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 16 }],
  }));

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLabel={message}
      style={[styles.toast, { backgroundColor: colors.foreground }, animatedStyle]}
    >
      <ThemedText type="smallBold" style={{ color: tokens.status.warning.color }}>
        {"🏆  "}
        <ThemedText type="small" style={{ color: colors.background }}>
          {message}
        </ThemedText>
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  summaryCopy: {
    flex: 1,
    gap: Spacing.one + 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  statCell: {
    flex: 1,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  shortcuts: {
    marginTop: Spacing.three,
  },
  toast: {
    position: "absolute",
    left: Spacing.four,
    right: Spacing.four,
    bottom: Spacing.six,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.18)",
    pointerEvents: "none",
    zIndex: 10,
  },
});
