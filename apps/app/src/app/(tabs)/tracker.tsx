import {
  getMilestoneById,
  type MilestoneProgress,
  migrateLegacyAchievementIds,
  syncAchievementIds,
} from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { DevotionAchievementSummary } from "@/components/devotion-achievement-summary";
import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { ThemedText } from "@/components/themed-text";
import {
  type TrackerProgressRingItem,
  TrackerProgressRings,
} from "@/components/tracker-progress-rings";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressRing } from "@/components/ui/progress-ring";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { useAfterSalahAdhkarReminder } from "@/hooks/use-after-salah-adhkar-reminder";
import { useDailyPrayerTimes } from "@/hooks/use-daily-prayer-times";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  afterSalahProgressForPrayer,
  isZikrItemDone,
  totalAfterSalahProgress,
} from "@/lib/after-salah-adhkar-progress";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { triggerHaptic } from "@/lib/haptics";
import { buildAchievementInAppNotification } from "@/lib/in-app-notifications/content";
import { notifyAchievementUnlocked } from "@/lib/notifications/achievements";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { zikrByCategory, zikrCategories } from "@/lib/zikr";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { preferencesStore } from "@/stores/preferences-store";
import {
  type SetPrayerStatusOptions,
  useAchievementStats,
  useDailySummary,
  useDevotionProgress,
  usePrayerJamaMap,
  useStreak,
  useTodayPrayers,
  useTrackerActions,
  useZikrCounts,
} from "@/stores/tracker-store";

function encouragementKey(progress: number): string {
  if (progress >= 1) return "tracker.allDone";
  if (progress === 0) return "tracker.freshStart";
  if (progress < 0.5) return "tracker.keepGoingShort";
  return "tracker.almostThere";
}

const CONFETTI_COLORS = ["#D4AF37", "#4CAF7D", "#5AA9E6", "#F2C94C"];

/**
 * Adhkar tied to the ritual of prayer, ordered as they occur around each salah:
 * the dua after the adhan, the supplication before starting, then the
 * after-salah adhkar. Deep-links straight into the relevant zikr collection so
 * the worshipper can complete them right after logging a prayer.
 */
const SALAH_ADHKAR = (() => {
  const byId = new Map(zikrCategories().map((category) => [category.id, category]));
  return (["after_azan", "before_prayer", "after_prayer"] as const)
    .map((id) => byId.get(id))
    .filter((category): category is NonNullable<typeof category> => category != null);
})();

/**
 * Every around-salah zikr item, flattened across the salah-adhkar categories so
 * we can measure how many were completed today. Cached at module load since the
 * catalog is static.
 */
const SALAH_ADHKAR_ITEMS = SALAH_ADHKAR.flatMap((category) => zikrByCategory(category.id));

/** A zikr counts as done today once its daily target is met (or it was recited when it has no target). */
function isZikrDone(count: number, targetCount?: number): boolean {
  return isZikrItemDone(count, targetCount);
}

export default function TrackerScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const summary = useDailySummary();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const stats = useAchievementStats();
  const { status, notes } = useTodayPrayers();
  const zikrCounts = useZikrCounts();
  const jamaMap = usePrayerJamaMap();
  const prayerTimes = useDailyPrayerTimes();
  const { setPrayerStatus, setPrayerNotes, setPrayerJama } = useTrackerActions();
  const remindAfterSalahAdhkar = useAfterSalahAdhkarReminder();
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);
  // Keep the sheet mounted with a valid prayer id after it first opens so it can
  // play its close animation with stable content instead of unmounting instantly.
  const lastActivePrayer = useRef<PrayerId | null>(activePrayer);
  if (activePrayer) lastActivePrayer.current = activePrayer;
  const sheetPrayer = activePrayer ?? lastActivePrayer.current;

  const markPrayerStatus = useCallback(
    async (prayerId: PrayerId, next: PrayerStatus, options?: SetPrayerStatusOptions) => {
      const previous = status[prayerId] ?? "pending";
      await setPrayerStatus(prayerId, next, options);
      remindAfterSalahAdhkar(prayerId, previous, next);
    },
    [remindAfterSalahAdhkar, setPrayerStatus, status],
  );

  const progress = summary.salahTotal ? summary.salahCompleted / summary.salahTotal : 0;
  const isComplete = progress >= 1;
  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;

  // At-a-glance completion rings for every other daily group tracked on this
  // screen, so the top of the tracker summarizes the whole day at once.
  const glanceItems = ((): TrackerProgressRingItem[] => {
    const makeItem = (
      id: string,
      label: string,
      completed: number,
      total: number,
      extra?: Partial<TrackerProgressRingItem>,
    ): TrackerProgressRingItem => {
      const ratio = total > 0 ? Math.min(1, completed / total) : 0;
      return {
        id,
        label,
        progress: ratio,
        detail: `${formatCount(completed)}/${formatCount(total)}`,
        accessibilityLabel: t("tracker.rings.a11y", {
          label,
          percent: Math.round(ratio * 100),
          completed,
          total,
        }),
        ...extra,
      };
    };

    const sunnahCompleted = SUNNAH_PRAYERS.filter(
      (prayerId) => (status[prayerId] ?? "pending") === "completed",
    ).length;
    const witrDone = (status[WITR_PRAYER] ?? "pending") === "completed" ? 1 : 0;
    const afterSalahTotals = totalAfterSalahProgress(zikrCounts);
    const witrAfterSalah = afterSalahProgressForPrayer(WITR_PRAYER, zikrCounts);
    const otherAdhkarItems = SALAH_ADHKAR_ITEMS.filter(
      (item) => item.categoryId !== "after_prayer",
    );
    const otherAdhkarCompleted = otherAdhkarItems.filter((item) =>
      isZikrDone(zikrCounts[item.id] ?? 0, item.targetCount),
    ).length;
    const adhkarCompleted =
      afterSalahTotals.completed + witrAfterSalah.completed + otherAdhkarCompleted;
    const adhkarTotal = afterSalahTotals.total + witrAfterSalah.total + otherAdhkarItems.length;

    const items: TrackerProgressRingItem[] = [
      makeItem("sunnah", t("tracker.rings.sunnah"), sunnahCompleted, SUNNAH_PRAYERS.length),
      makeItem("witr", t("tracker.rings.witr"), witrDone, 1),
      makeItem("adhkar", t("tracker.rings.adhkar"), adhkarCompleted, adhkarTotal, {
        color: tokens.status.info.color,
      }),
    ];

    // Qaza only appears once the user has set a daily make-up target.
    if (summary.qazaTargetToday > 0) {
      items.push(
        makeItem(
          "qaza",
          t("tracker.rings.qaza"),
          summary.qazaCompletedToday,
          summary.qazaTargetToday,
          { color: tokens.status.warning.color, onPress: () => router.push("/qaza") },
        ),
      );
    }

    return items;
  })();

  // --- Confetti + achievement celebration -----------------------------------
  const [celebrationKey, setCelebrationKey] = useState(0);
  const toast = useToast();
  const { deliver } = useInAppNotifications();
  // Guards so we only fire on the pending -> complete *edge*, not every render.
  const prevCompleteRef = useRef<boolean | null>(null);
  const knownAchievementsRef = useRef<string[] | null>(null);

  const showAchievementCelebration = useCallback(
    (milestone: MilestoneProgress, achievementId: string) => {
      triggerHaptic("success");
      setCelebrationKey((k) => k + 1);
      toast.success(t("notif.reminders.achievementTitle"), milestone.title);
      const notification = buildAchievementInAppNotification(milestone);
      void deliver({
        kind: "achievement",
        id: `achievement:${achievementId}`,
        title: notification.title,
        body: notification.body,
        route: "/achievements",
      });
      void notifyAchievementUnlocked(milestone.title, preferencesStore.getState().prefs);
    },
    [deliver, t, toast],
  );

  // Load the persisted unlocked set once so the first refresh doesn't
  // re-announce badges the user already earned.
  useEffect(() => {
    let active = true;
    void (async () => {
      const known = migrateLegacyAchievementIds(await readJSON<string[]>(DB_KEYS.achievements, []));
      if (active) knownAchievementsRef.current = migrateLegacyAchievementIds(known);
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

  // Sync achievements with live stats (including reversals), celebrate new unlocks.
  useEffect(() => {
    const known = knownAchievementsRef.current;
    if (known == null) return; // wait until the persisted set has loaded
    const { synced, newlyUnlocked: unlocked } = syncAchievementIds(stats, known);
    knownAchievementsRef.current = synced;

    const first = unlocked[0];
    if (first) {
      const milestone = getMilestoneById(first, stats);
      if (milestone) showAchievementCelebration(milestone, first);
    }
  }, [stats, showAchievementCelebration]);

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
      icon: TASBEEH_ICON,
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
      <Seo path="/tracker" />
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
                <View
                  accessible
                  accessibilityLabel={t("tracker.streakLabel", { count: streak })}
                  style={styles.streakChip}
                >
                  <Pill
                    icon={{
                      ios: "flame.fill",
                      android: "local_fire_department",
                      web: "local_fire_department",
                    }}
                    label={t("tracker.streakLabel", { count: streak })}
                    color={tokens.status.warning.text}
                    background={tokens.status.warning.soft}
                  />
                </View>
              </View>
            </View>

            {glanceItems.length > 0 ? (
              <View style={styles.glanceSection}>
                <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.glanceHeader}>
                  {t("tracker.glanceTitle")}
                </ThemedText>
                <TrackerProgressRings items={glanceItems} />
              </View>
            ) : null}
          </Card>

          {/* Confetti overlays the summary card on a completion / unlock edge. */}
          <PartyPopper burstKey={celebrationKey} colors={CONFETTI_COLORS} />
        </View>

        <PressableScale
          onPress={() => router.push("/achievements")}
          haptic="light"
          scaleTo={0.98}
          accessibilityRole="button"
          accessibilityLabel={t("home.devotionA11y", {
            level: devotion.level,
            noor: devotion.noor,
            current: devotionLevelProgress,
            next: devotionLevelSpan,
          })}
        >
          <Card padding="three" style={styles.achievementCard}>
            <DevotionAchievementSummary milestonePillBackground={colors.muted} />
          </Card>
        </PressableScale>

        <Card padding="three">
          <ExcusedDayPicker />
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.obligatory")}
            icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => {
              const current = status[prayerId] ?? "pending";
              const afterSalahProgress = afterSalahProgressForPrayer(prayerId, zikrCounts);
              return (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={current}
                  time={prayerTimes[prayerId]}
                  hasNotes={!!notes[prayerId]}
                  isJama={jamaMap[prayerId] ?? false}
                  afterSalahProgress={afterSalahProgress}
                  onPressAfterSalah={() => router.push(afterSalahAdhkarRoute(prayerId))}
                  onPress={() => setActivePrayer(prayerId)}
                />
              );
            })}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.witr")}
            icon={{ ios: "moon.fill", android: "dark_mode", web: "dark_mode" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.salahAdhkarHint}>
            {t("tracker.witrSubtitle")}
          </ThemedText>
          <View style={styles.rows}>
            <PrayerTrackerRow
              prayerId={WITR_PRAYER}
              status={status[WITR_PRAYER] ?? "pending"}
              time={prayerTimes[WITR_PRAYER]}
              hasNotes={!!notes[WITR_PRAYER]}
              afterSalahProgress={afterSalahProgressForPrayer(WITR_PRAYER, zikrCounts)}
              onPressAfterSalah={() => router.push(afterSalahAdhkarRoute(WITR_PRAYER))}
              onPress={() => setActivePrayer(WITR_PRAYER)}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.salahAdhkar")}
            icon={{
              ios: "hands.and.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.salahAdhkarHint}>
            {t("tracker.salahAdhkarSubtitle")}
          </ThemedText>
          <View style={styles.rows}>
            {SALAH_ADHKAR.map((category) => (
              <NavRow
                key={category.id}
                icon={category.icon}
                label={t(`zikrCat.${category.id}`)}
                count={category.count}
                onPress={() =>
                  router.push({ pathname: "/zikr/[category]", params: { category: category.id } })
                }
              />
            ))}
          </View>
        </Card>

        <QazaDailyChecklist />

        <Card padding="three">
          <SectionHeader
            title={t("jannah.journeyTitle")}
            icon={{
              ios: "chart.line.uptrend.xyaxis",
              android: "trending_up",
              web: "trending_up",
            }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.salahAdhkarHint}>
            {t("jannah.journeySummary")}
          </ThemedText>
          <View style={styles.rows}>
            <NavRow
              icon={{ ios: "leaf.fill", android: "park", web: "park" }}
              label={t("jannah.journeySubtitle")}
              onPress={() => router.push("/jannah/journey")}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.sunnahOptional")}
            icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
          />
          <View style={styles.rows}>
            {SUNNAH_PRAYERS.map((prayerId) => {
              const current = status[prayerId] ?? "pending";
              return (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={current}
                  time={prayerTimes[prayerId]}
                  hasNotes={!!notes[prayerId]}
                  onPress={() => setActivePrayer(prayerId)}
                />
              );
            })}
            <NavRow
              icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
              label={t("tahajjud.streakRow")}
              onPress={() => router.push("/tahajjud")}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("journal.title")}
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
          />
          <View style={styles.rows}>
            <NavRow
              icon={{ ios: "square.and.pencil", android: "edit", web: "edit" }}
              label={t("journal.navRow")}
              onPress={() => router.push("/journal")}
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

      {sheetPrayer ? (
        <PrayerStatusSheet
          visible={activePrayer != null}
          prayerId={sheetPrayer}
          prayerLabel={t(`prayers.${sheetPrayer}`)}
          currentStatus={status[sheetPrayer] ?? "pending"}
          currentNotes={notes[sheetPrayer]}
          isJama={jamaMap[sheetPrayer] ?? false}
          onToggleJama={(next) => setPrayerJama(sheetPrayer, next)}
          onSelect={(next, options) => markPrayerStatus(sheetPrayer, next, options)}
          onSaveNotes={(text) => setPrayerNotes(sheetPrayer, text)}
          onClose={() => setActivePrayer(null)}
        />
      ) : null}
    </ScreenLayout>
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
  streakChip: {
    marginTop: Spacing.one,
    alignItems: "flex-start",
  },
  glanceSection: {
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  glanceHeader: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  salahAdhkarHint: {
    marginTop: Spacing.two,
  },
  shortcuts: {
    marginTop: Spacing.three,
  },
  achievementCard: {
    gap: Spacing.three,
  },
});
