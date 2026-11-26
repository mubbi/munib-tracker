import {
  getMilestoneById,
  type MilestoneProgress,
  syncAchievementIds,
} from "@munib-tracker/shared/achievements";
import { SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { DevotionAchievementSummary } from "@/components/devotion-achievement-summary";
import { FocusActiveChip } from "@/components/focus-lock/focus-active-chip";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { ThemedText } from "@/components/themed-text";
import { usePrayerStatusController } from "@/components/tracker/use-prayer-status-controller";
import { useSalahTrackingSession } from "@/components/tracker/use-salah-tracking-session";
import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
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
import { RetryCard } from "@/components/ui/retry-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { Breakpoints, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useReviewDailyTrackingInteraction } from "@/features/reviews/hooks/useReviewDailyTrackingInteraction";
import { useReviewPerfectDayTrigger } from "@/features/reviews/hooks/useReviewPerfectDayTrigger";
import { useReviewQazaClearedTrigger } from "@/features/reviews/hooks/useReviewQazaClearedTrigger";
import { useReviewRouteTrigger } from "@/features/reviews/hooks/useReviewRouteTrigger";
import { emitReviewTrigger } from "@/features/reviews/lib/reviewTriggerBus";
import { useDailyPrayerTimes } from "@/hooks/use-daily-prayer-times";
import { useHomeHero } from "@/hooks/use-home-hero";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  claimAchievementAnnouncement,
  releaseLapsedAchievementAnnouncements,
} from "@/lib/achievement-announcements";
import { milestoneTitle } from "@/lib/achievements-i18n";
import { readPersistedAchievementIds } from "@/lib/achievements-persistence";
import {
  afterSalahProgressForPrayer,
  isZikrItemDone,
  totalAfterSalahProgress,
} from "@/lib/after-salah-adhkar-progress";
import { FRIDAY_CHECKLIST_FOCUS } from "@/lib/friday";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { buildAchievementInAppNotification } from "@/lib/in-app-notifications/content";
import { khatmTodayProgress } from "@/lib/khatm";
import { notifyAchievementUnlocked } from "@/lib/notifications/achievements";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { WHITE_DAYS_CHECKLIST_FOCUS } from "@/lib/white-days";
import { ensureZikrCorpus, zikrByCategory, zikrCategories } from "@/lib/zikr";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";
import { useLocationStatus } from "@/stores/location-store";
import { preferencesStore, usePreferences } from "@/stores/preferences-store";
import {
  trackerStore,
  useAchievementStats,
  useDailySummary,
  useDevotionProgress,
  usePrayerAtMasjidMap,
  usePrayerCombinedMap,
  usePrayerJamaMap,
  useStreak,
  useTodayPrayers,
  useTrackerLoadError,
  useTrackerReady,
  useZikrCounts,
} from "@/stores/tracker-store";

function encouragementKey(progress: number): string {
  if (progress >= 1) return "tracker.allDone";
  if (progress === 0) return "tracker.freshStart";
  if (progress < 0.5) return "tracker.keepGoingShort";
  return "tracker.almostThere";
}

const SALAH_ADHKAR_CATEGORY_IDS = ["after_azan", "before_prayer", "after_prayer"] as const;

function buildSalahAdhkar() {
  const byId = new Map(zikrCategories().map((category) => [category.id, category]));
  return SALAH_ADHKAR_CATEGORY_IDS.map((id) => byId.get(id)).filter(
    (category): category is NonNullable<typeof category> => category != null,
  );
}

/** Before-Salah / after-adhan adhkar counted by the glance ring (after-Salah has its own totals). */
function buildGlanceAdhkarItems() {
  return buildSalahAdhkar()
    .flatMap((category) => zikrByCategory(category.id))
    .filter((item) => item.categoryId !== "after_prayer");
}

/** Window width at/above which the tracker uses a dashboard (main + aside) layout. */
const TRACKER_DASHBOARD_BREAKPOINT = 1200;

export default function TrackerScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const locationStatus = useLocationStatus();
  const { salahTrackingSession } = usePreferences();
  const summary = useDailySummary();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const stats = useAchievementStats();
  const trackerReady = useTrackerReady();
  const trackerLoadError = useTrackerLoadError();
  const { status, notes } = useTodayPrayers();
  const zikrCounts = useZikrCounts();
  const jamaMap = usePrayerJamaMap();
  const atMasjidMap = usePrayerAtMasjidMap();
  const combinedMap = usePrayerCombinedMap();
  const prayerTimes = useDailyPrayerTimes();
  const homeHero = useHomeHero();
  const { isListDetail, width } = useLargeScreenLayout();
  // Desktop / wide tablet (never TV): checklist + summary in the main column,
  // schedule, devotion and secondary cards in a side column.
  const dashboard = !isTV() && width >= TRACKER_DASHBOARD_BREAKPOINT;
  // Status sheet, one-tap mark and Missed / Qaza undo — shared with Home.
  const prayerStatus = usePrayerStatusController();
  // Preferred-time hints (NF-3.0a) come pre-localized on the home schedule items.
  const preferredHints = useMemo(() => {
    const hints: Record<string, string> = {};
    for (const item of homeHero.schedule) if (item.preferred) hints[item.id] = item.preferred;
    return hints;
  }, [homeHero.schedule]);
  useEnsureKhatmLoaded();
  const { plan: khatmPlan, ayahsRead: khatmRead } = useKhatm();
  const khatmToday = khatmPlan ? khatmTodayProgress(khatmPlan, khatmRead) : null;
  const [zikrReady, setZikrReady] = useState(false);
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const scrollYRef = useRef(0);
  const onTrackerScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = event.nativeEvent.contentOffset.y;
      onScroll(event);
    },
    [onScroll],
  );

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setZikrReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const {
    active: trackingActive,
    start: startTrackingSalah,
    stop: stopTrackingSalah,
  } = useSalahTrackingSession();

  const progress = summary.salahTotal ? summary.salahCompleted / summary.salahTotal : 0;
  const isComplete = progress >= 1;

  useReviewRouteTrigger("tracker");
  useReviewPerfectDayTrigger(isComplete);
  useReviewQazaClearedTrigger(summary.qazaCompletedToday, summary.qazaTargetToday);
  useReviewDailyTrackingInteraction(summary.salahCompleted);

  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;

  // The adhkar catalog is static once loaded — build the ring's item list once,
  // not on every Salah mark.
  const otherAdhkarItems = useMemo(() => (zikrReady ? buildGlanceAdhkarItems() : []), [zikrReady]);

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
    const otherAdhkarCompleted = otherAdhkarItems.filter((item) =>
      isZikrItemDone(zikrCounts[item.id] ?? 0, item.targetCount),
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

    // Khatm glance ring — only while a reading plan is active.
    if (khatmToday) {
      items.push(
        makeItem("khatm", t("tracker.rings.khatm"), khatmToday.done, khatmToday.target, {
          color:
            khatmToday.pace === "behind" ? tokens.status.warning.color : tokens.status.info.color,
          onPress: () => router.push("/quran/khatm"),
        }),
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
  const knownAchievementsRef = useRef<string[]>([]);
  const [achievementsSeeded, setAchievementsSeeded] = useState(false);

  const showAchievementCelebration = useCallback(
    (milestone: MilestoneProgress, achievementId: string) => {
      triggerHaptic("success");
      setCelebrationKey((k) => k + 1);
      toast.success(t("notif.reminders.achievementTitle"), milestoneTitle(milestone));
      const notification = buildAchievementInAppNotification(milestone);
      void deliver({
        kind: "achievement",
        id: `achievement:${achievementId}`,
        title: notification.title,
        body: notification.body,
        route: "/achievements",
      });
      void notifyAchievementUnlocked(
        achievementId,
        milestoneTitle(milestone),
        preferencesStore.getState().prefs,
      );
    },
    [deliver, t, toast],
  );

  // Seed the unlocked set only after tracker hydration (which also persists
  // achievements from stats) so a reload never re-announces "First Step".
  useEffect(() => {
    if (!trackerReady) return;
    let active = true;
    void readPersistedAchievementIds().then((known) => {
      if (!active) return;
      knownAchievementsRef.current = known;
      setAchievementsSeeded(true);
    });
    return () => {
      active = false;
    };
  }, [trackerReady]);

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
    if (!achievementsSeeded) return;
    const known = knownAchievementsRef.current;
    const { synced, newlyUnlocked: unlocked } = syncAchievementIds(stats, known);
    knownAchievementsRef.current = synced;
    releaseLapsedAchievementAnnouncements(synced);

    const first = unlocked[0];
    // Claimed process-wide: a second mounted tracker must not celebrate it again.
    if (first && claimAchievementAnnouncement(first)) {
      const milestone = getMilestoneById(first, stats);
      if (milestone) {
        showAchievementCelebration(milestone, first);
        emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.achievement_unlock, { deferRoute: "tracker" });
      }
    }
  }, [achievementsSeeded, stats, showAchievementCelebration]);

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

  const tv = isTV();
  const summaryRing = (
    <ProgressRing
      progress={progress}
      accessibilityLabel={t("a11yProgress.todaySalah")}
      size={tv ? tvDp(96) : 64}
      stroke={tv ? tvDp(10) : 7}
      color={isComplete ? tokens.status.success.color : undefined}
    />
  );

  const summaryCopy = (
    <View style={styles.summaryCopy}>
      <ThemedText type="smallBold">{t(encouragementKey(progress))}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tracker.summaryLogged", {
          completed: summary.salahCompleted,
          total: summary.salahTotal,
        })}
      </ThemedText>
    </View>
  );

  // P5-01: a compact strip (ring · encouragement · streak) so the Obligatory
  // card — the screen's task — starts in the first viewport.
  const summaryCard = (
    <View testID="tracker-summary">
      <Card padding="three">
        <View style={styles.summaryRow}>
          {/* Yoga flips row order under RTL — keep a single LTR child order. */}
          {summaryRing}
          {summaryCopy}
          <View accessible accessibilityLabel={t("tracker.streakLabel", { count: streak })}>
            <Pill
              icon={{
                ios: "flame.fill",
                android: "local_fire_department",
                web: "local_fire_department",
              }}
              label={formatCount(streak)}
              color={tokens.status.warning.onSoft}
              background={tokens.status.warning.soft}
            />
          </View>
        </View>
      </Card>

      {/* Confetti overlays the summary card on a completion / unlock edge. */}
      <PartyPopper burstKey={celebrationKey} colors={tokens.celebration} />
    </View>
  );

  // The rest of the day at a glance — part of the tail, after the checklist.
  const glanceCard =
    glanceItems.length > 0 ? (
      <Card>
        <SectionHeader
          title={t("tracker.glanceTitle")}
          icon={{ ios: "chart.pie.fill", android: "donut_large", web: "donut_large" }}
        />
        <View style={styles.glanceSection}>
          <TrackerProgressRings items={glanceItems} />
        </View>
      </Card>
    ) : null;

  // Before the tracker store hydrates, rows would flash "0/5" and Pending (B-09).
  const loadingCard = trackerLoadError ? (
    <View testID="tracker-load-error">
      <RetryCard onRetry={() => void trackerStore.getState().load()} />
    </View>
  ) : (
    <View testID="tracker-loading">
      <Card>
        <SkeletonPlaceholder preset="rows" count={5} />
      </Card>
    </View>
  );

  const achievementCard = (
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
      <Card style={styles.achievementCard}>
        <DevotionAchievementSummary milestonePillBackground={colors.muted} />
      </Card>
    </PressableScale>
  );

  const checklist = (
    <TrackerDayChecklist
      date={getLocalDateString()}
      isToday
      status={status}
      notes={notes}
      jama={jamaMap}
      atMasjid={atMasjidMap}
      combined={combinedMap}
      preferredHints={preferredHints}
      zikrCounts={zikrCounts}
      prayerTimes={prayerTimes}
      onPrayerPress={(prayerId) => prayerStatus.open(prayerId)}
      onPrayerQuickSelect={(prayerId, next) => void prayerStatus.quickSelect(prayerId, next)}
      scrollRef={scrollRef}
      getScrollY={() => scrollYRef.current}
      registerFocus={register}
      // TV: land on the first Salah row — marking prayers is the primary task.
      preferredFocusFirstPrayer={tv}
      fridayFocused={isFocused(FRIDAY_CHECKLIST_FOCUS)}
      whiteDaysFocused={isFocused(WHITE_DAYS_CHECKLIST_FOCUS)}
    />
  );

  const trackSalahCard =
    !tv && (Platform.OS === "android" || Platform.OS === "web") && locationStatus !== "denied" ? (
      <Card>
        <SectionHeader
          title={t("notif.trackSalah.title")}
          icon={{
            ios: "lock.iphone",
            android: "notifications_active",
            web: "notifications_active",
          }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.salahAdhkarHint}>
          {trackingActive
            ? t("notif.trackSalah.activeHint")
            : Platform.OS === "web"
              ? t("notif.trackSalah.hintWeb")
              : t("notif.trackSalah.hint")}
        </ThemedText>
        <View style={styles.rows}>
          <NavRow
            icon={{
              ios: trackingActive ? "stop.circle" : "play.circle",
              android: trackingActive ? "stop_circle" : "play_circle",
              web: trackingActive ? "stop_circle" : "play_circle",
            }}
            label={
              trackingActive
                ? t("notif.trackSalah.active", {
                    prayer: salahTrackingSession?.prayerName ?? "",
                  })
                : t("notif.trackSalah.start")
            }
            onPress={trackingActive ? stopTrackingSalah : startTrackingSalah}
          />
        </View>
      </Card>
    ) : null;

  const journeyCard = (
    <Card>
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
  );

  const keepGoingCard = (
    <Card>
      <SectionHeader
        title={t("tracker.keepGoing")}
        icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
      />
      <View style={styles.shortcuts}>
        <QuickActionGrid
          items={shortcuts}
          columns={dashboard ? (width >= Breakpoints.xwide ? 6 : 5) : 4}
        />
      </View>
    </Card>
  );

  const scheduleCard = (
    <PrayerScheduleCard
      schedule={homeHero.schedule}
      nextIn={homeHero.nextIn}
      nextScheduleId={homeHero.nextScheduleId}
    />
  );

  return (
    <ScreenLayout
      eyebrow={t("tracker.eyebrow")}
      title={t("tracker.title")}
      subtitle={tTv(t, "tracker.subtitle", "tracker.tvSubtitle")}
      scrollRef={scrollRef}
      onScroll={onTrackerScroll}
    >
      <Seo path="/tracker" />
      <FocusActiveChip />
      {dashboard ? (
        <View style={styles.listDetailRoot}>
          <View style={styles.listDetailPrimary}>
            <Stagger>
              {summaryCard}
              {trackerReady ? checklist : loadingCard}
              {keepGoingCard}
            </Stagger>
          </View>
          <View style={[styles.dashboardAside, { width: width >= 1440 ? 400 : 360 }]}>
            <Stagger entranceKey="tracker-aside">
              {scheduleCard}
              {glanceCard}
              {achievementCard}
              {trackSalahCard}
              {journeyCard}
            </Stagger>
          </View>
        </View>
      ) : (
        <View style={isListDetail ? styles.listDetailRoot : undefined}>
          <View style={isListDetail ? styles.listDetailPrimary : undefined}>
            <Stagger>
              {summaryCard}
              {trackerReady ? checklist : loadingCard}
              {glanceCard}
              {achievementCard}
              {trackSalahCard}
              {journeyCard}
              {keepGoingCard}
            </Stagger>
          </View>

          {isListDetail ? (
            <View style={[styles.listDetailSecondary, tv && styles.listDetailSecondaryTv]}>
              {scheduleCard}
            </View>
          ) : null}
        </View>
      )}

      {prayerStatus.sheet}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  glanceSection: {
    marginTop: Spacing.three,
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
  listDetailRoot: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  listDetailPrimary: {
    flex: 1,
    minWidth: 0,
  },
  listDetailSecondary: {
    width: 340,
    maxWidth: "38%",
  },
  dashboardAside: {
    flexShrink: 0,
  },
  // A definite, non-growing detail pane: with `flex: 1` the schedule's content
  // width won the flex negotiation and squeezed the summary column to ~160dp on
  // a 1080p TV (word-per-line copy, truncated Excused Day chips).
  listDetailSecondaryTv: {
    width: TvLayout.detailPaneMinWidth,
    flexGrow: 0,
    flexShrink: 0,
    maxWidth: TvLayout.detailPaneMaxWidth,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/tracker");
