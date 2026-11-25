import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ComponentType, lazy, type ReactNode, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  useAcceptanceHourActive,
  useAcceptanceHourGoalReminder,
} from "@/components/acceptance-hour-goal-reminder";
import { AppIconOfferCard, useAppIconOffer } from "@/components/app-icon/app-icon-offer-card";
import {
  COACH_HOME_MODULE,
  CoachHomeCard,
  useCoachHomeCard,
} from "@/components/coach/coach-home-card";
import { ContinueCard } from "@/components/continue-card";
import { DefaultLocationBanner } from "@/components/default-location-banner";
import { DevotionAchievementSummary } from "@/components/devotion-achievement-summary";
import { DhulHijjahHomeCard } from "@/components/dhul-hijjah/dhul-hijjah-home-card";
import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { useVoluntaryFastGoalReminder } from "@/components/fasting/voluntary-fast-goal-reminder";
import { MadhhabPromptCard, useShowMadhhabPromptCard } from "@/components/fiqh/madhhab-prompt-card";
import { useFridayGoalReminder } from "@/components/friday-goal-reminder";
import { KhatmCard } from "@/components/khatm-card";
import { useKhatmGoalReminder } from "@/components/khatm-goal-reminder";
import type { PrayerScheduleCardProps } from "@/components/prayer-schedule-card";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { IosPwaInstallBanner } from "@/components/pwa/ios-pwa-install-banner";
import { QazaSummaryCard } from "@/components/qaza-summary-card";
import {
  QuranRevisionHomeCard,
  useQuranRevisionHomeDue,
} from "@/components/quran-revision-home-card";
import { RamadanCard } from "@/components/ramadan-card";
import { RawatibHomeCard, useRawatibHomeVisible } from "@/components/rawatib/rawatib-home-card";
import { useSeasonalBanner } from "@/components/seasonal/use-seasonal-banner";
import { useSeasonalHomeCards } from "@/components/seasonal/use-seasonal-home-cards";
import { SeasonalThemeBanner } from "@/components/seasonal-theme-banner";
import {
  FAMILY_TIES_HOME_MODULE,
  FamilyTiesHomeCard,
  MUHASABAH_HOME_MODULE,
  MuhasabahHomeCard,
  useFamilyTiesDueCount,
  useMuhasabahHomeCard,
} from "@/components/self-review/home-cards";
import { SunnahHabitsSection } from "@/components/sunnah-habits/sunnah-habits-section";
import { ThemedText } from "@/components/themed-text";
import {
  type GoalReminderModel,
  GoalReminderStack,
} from "@/components/tracker/goal-reminder-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { QuickActionGrid } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { UmrahHomeCard, useShowUmrahHomeCard } from "@/components/umrah/umrah-home-card";
import { useWhiteDaysGoalReminder } from "@/components/white-days-goal-reminder";
import {
  BorderWidth,
  Breakpoints,
  Control,
  IconSize,
  Radius,
  Spacing,
  type StatusKey,
} from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useReviewRouteTrigger } from "@/features/reviews/hooks/useReviewRouteTrigger";
import { useReviewStreakTrigger } from "@/features/reviews/hooks/useReviewStreakTrigger";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWeeklyReport } from "@/hooks/use-weekly-report";
import { isFriday } from "@/lib/friday";
import { tTv } from "@/lib/i18n/t-tv";
import { khatmTodayProgress } from "@/lib/khatm";
import { filterDestinationsForDevice, useDestinationScope } from "@/lib/library-menu";
import { isTV } from "@/lib/platform/is-tv";
import {
  buildQuickActionItems,
  DEFAULT_QUICK_ACTION_ORDER,
  orderQuickActions,
} from "@/lib/quick-actions";
import { getRamadanInfo } from "@/lib/ramadan";
import { RAWATIB_HOME_MODULE_ID } from "@/lib/rawatib";
import { useArrowForward } from "@/lib/rtl";
import { formatScheduleShare } from "@/lib/share";
import { isWhiteDay } from "@/lib/white-days";
import { useToast } from "@/providers/toast-provider";
import { useContinueActivity } from "@/stores/continue-store";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";
import { useLocation } from "@/stores/location-store";
import { useEnsureNewFeaturesLoaded, useNewFeatureIds } from "@/stores/new-features-store";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";
import { seasonalBannerStore } from "@/stores/seasonal-banner-store";
import {
  useDailySummary,
  useDayExcused,
  useDevotionProgress,
  useQazaSummary,
  useRoza,
  useStreak,
  useTrackerDate,
} from "@/stores/tracker-store";

/** Phone/web only — lazy so TV home never pulls Qur'an/hadith knowledge corpora. */
const KnowledgeFlashCardLazy: ComponentType =
  process.env.NODE_ENV === "test"
    ? // Jest cannot evaluate React.lazy's native `import()` without --experimental-vm-modules.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      (require("@/components/knowledge-flash-card") as { KnowledgeFlashCard: ComponentType })
        .KnowledgeFlashCard
    : lazy(() =>
        import("@/components/knowledge-flash-card").then((mod) => ({
          default: mod.KnowledgeFlashCard,
        })),
      );

const SCHEDULE_SHARE_KEY = "home-today-schedule";

type SymbolName = SymbolViewProps["name"];

function resolveGoalTier(done: number, total: number): { tone: StatusKey; icon: SymbolName } {
  const ratio = total > 0 ? done / total : 0;
  if (ratio >= 1) {
    return {
      tone: "success",
      icon: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
    };
  }
  if (ratio >= 0.5) {
    return {
      tone: "warning",
      icon: { ios: "chart.pie.fill", android: "pie_chart", web: "pie_chart" },
    };
  }
  if (ratio > 0) {
    return {
      tone: "info",
      icon: { ios: "hourglass", android: "hourglass_top", web: "hourglass_top" },
    };
  }
  return {
    tone: "danger",
    icon: { ios: "exclamationmark.circle.fill", android: "error", web: "error" },
  };
}

export type HomeBelowFoldProps = Pick<
  PrayerScheduleCardProps,
  "schedule" | "nextIn" | "nextScheduleId"
> & {
  /** Primary date label for schedule share (matches schedule screen). */
  scheduleDateLabel: string;
  /** Location label for schedule share. */
  scheduleLocationLabel: string;
  /**
   * Wide-screen dashboard: when set, the hero renders at the top of the main
   * column and today's schedule + secondary cards move into an aside beside it.
   * Omitted on phones / TV (stacked layout tucked under the full-bleed hero).
   */
  hero?: ReactNode;
  /**
   * P5-05: the Salah that is due now (its window is running and it is not yet
   * logged). With `onMarkPrayer` the goal card's primary button marks it in one
   * tap ("Mark Asr"); otherwise the button opens the checklist.
   */
  markPrayer?: ObligatoryPrayer | null;
  onMarkPrayer?: () => void;
};

/** Contextual cards shown before "More for today" on phones (B-16). */
const CONTEXTUAL_CARD_LIMIT = 3;

/**
 * Below-fold home content — separate module so web asyncRoutes can parse the
 * hero/shell first without pulling continue/knowledge/ramadan/schedule cards.
 */
export function HomeBelowFold({
  schedule,
  nextIn,
  nextScheduleId,
  scheduleDateLabel,
  scheduleLocationLabel,
  hero,
  markPrayer = null,
  onMarkPrayer,
}: HomeBelowFoldProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { width } = useWindowDimensions();
  const dashboard = hero != null;
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const summary = useDailySummary();
  const excusedReason = useDayExcused();
  const trackerDate = useTrackerDate();
  const streak = useStreak();
  const devotion = useDevotionProgress();
  const qaza = useQazaSummary();
  const roza = useRoza();
  useEnsureKhatmLoaded();
  const { plan: khatmPlan, ayahsRead: khatmRead } = useKhatm();
  const khatmToday = khatmPlan ? khatmTodayProgress(khatmPlan, khatmRead) : null;
  useWeeklyReport();
  useReviewRouteTrigger("home");
  useReviewStreakTrigger(streak);
  const { quickActionOrder, hiddenHomeModules } = usePreferences();
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [moreForTodayOpen, setMoreForTodayOpen] = useState(false);
  // One goal reminder at a time, highest priority first (B-15 / B-86).
  const acceptanceReminder = useAcceptanceHourGoalReminder();
  const fridayReminder = useFridayGoalReminder();
  const whiteDaysReminder = useWhiteDaysGoalReminder();
  const khatmReminder = useKhatmGoalReminder();
  const voluntaryFastReminder = useVoluntaryFastGoalReminder();
  const goalReminders = [
    acceptanceReminder,
    fridayReminder,
    whiteDaysReminder,
    voluntaryFastReminder,
    khatmReminder,
  ].filter((reminder): reminder is GoalReminderModel => reminder != null);
  // "New" badges (15 days per device) — also adds new tiles once to a customised grid.
  useEnsureNewFeaturesLoaded(usePreferencesReady());
  const newFeatureIds = useNewFeatureIds();
  const destinationScope = useDestinationScope();
  const location = useLocation();
  const continueActivity = useContinueActivity();
  const arrowForward = useArrowForward();
  const hiddenModules = new Set(hiddenHomeModules ?? []);
  const showDefaultLocationBanner = location.source === "default";
  // NF-3.0a: one-time "Choose your madhhab for rulings" for never-asked users.
  const showMadhhabCard = useShowMadhhabPromptCard();
  // NF-2.23: out of season, turned off in Customize home, or hidden for this season → null.
  const seasonalBanner = useSeasonalBanner(hiddenModules);
  // D75: Android-only one-time "use seasonal app icons?" offer while a season is on.
  const appIconOffer = useAppIconOffer();
  const toast = useToast();
  // Gate optional cards before Stagger wraps them — null-returning children still
  // occupy flex `gap` slots (same issue as the banners above).
  const showRamadanCard = getRamadanInfo(location).isRamadan;
  const showKhatmCard = !hiddenModules.has("khatm") && khatmPlan != null;
  const showContinueCard = !hiddenModules.has("continue") && continueActivity != null;
  const showQazaCard = !hiddenModules.has("qaza") && (qaza.remaining > 0 || roza.remaining > 0);
  // NF-3.1 optional module — only while rawatib are on (hideable as `rawatib-progress`).
  const rawatibHomeVisible = useRawatibHomeVisible();
  const showRawatibCard = !hiddenModules.has(RAWATIB_HOME_MODULE_ID) && rawatibHomeVisible;
  const acceptanceHourActive = useAcceptanceHourActive();
  // NF-3.5 Sunnah habits + NF-3.3 Dhul-Hijjah (teaser from 25 Dhul-Qa'dah → 13 Dhul-Hijjah).
  const seasonalCards = useSeasonalHomeCards(hiddenModules);
  // NF-3.4: resume card while an Umrah is in progress.
  const showUmrahCard = useShowUmrahHomeCard(hiddenModules);
  // NF-3.6 / NF-3.7 private self-review cards (vault-backed; hidden on TV).
  const muhasabahCard = useMuhasabahHomeCard(!hiddenModules.has(MUHASABAH_HOME_MODULE));
  const familyTiesDue = useFamilyTiesDueCount(!hiddenModules.has(FAMILY_TIES_HOME_MODULE));
  // NF-3.14 weekly reflection (hidden on TV, after "until next week", or with nothing tracked).
  const coachReport = useCoachHomeCard(!hiddenModules.has(COACH_HOME_MODULE));
  // D68: "N ayahs to revise" while the practice revision queue has ayahs due (not TV).
  const revisionDue = useQuranRevisionHomeDue(hiddenModules);

  const onShareSchedule = async () => {
    const locationLabel = scheduleLocationLabel || undefined;
    const items = schedule.map((item) => ({
      id: item.id,
      name: item.name,
      time: item.time,
      kind: item.kind,
      status: item.status,
    }));

    await share({
      message: formatScheduleShare({
        dateLabel: scheduleDateLabel,
        locationLabel,
        items,
        nextScheduleId,
        nextIn,
      }),
      sectionTitle: t("share.sectionSchedule"),
      contentLabel: locationLabel ? `${scheduleDateLabel} · ${locationLabel}` : scheduleDateLabel,
      filenameSlug: "schedule",
      shareKey: SCHEDULE_SHARE_KEY,
      content: {
        kind: "schedule",
        dateLabel: scheduleDateLabel,
        locationLabel,
        items,
        nextScheduleId,
        nextIn,
      },
    });
  };

  // Khatm contributes one checklist task (not the raw ayah/page count) so a
  // 70-ayah daily goal doesn't swamp Salah/Zikr in the overall progress bar.
  const khatmTaskDone = khatmToday?.complete ? 1 : 0;
  const khatmTaskTotal = khatmToday ? 1 : 0;
  const tasksDone =
    summary.salahCompleted + summary.zikrCompleted + summary.qazaCompletedToday + khatmTaskDone;
  const tasksTotal =
    summary.salahTotal + summary.zikrTotal + summary.qazaTargetToday + khatmTaskTotal;
  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const goalBreakdown = [
    {
      key: "salah",
      label: t("home.prayersStat"),
      done: summary.salahCompleted,
      total: summary.salahTotal,
    },
    {
      key: "zikr",
      label: t("home.dhikrStat"),
      done: summary.zikrCompleted,
      total: summary.zikrTotal,
    },
    {
      key: "qaza",
      label: t("home.qazaStat"),
      done: summary.qazaCompletedToday,
      total: summary.qazaTargetToday,
    },
    ...(khatmToday
      ? [
          {
            key: "khatm",
            label: t("home.khatmStat"),
            done: khatmToday.done,
            total: khatmToday.target,
          },
        ]
      : []),
  ].filter((item) => item.total > 0);
  const isExcused = excusedReason != null;
  const isFreshStart = tasksDone === 0 && streak === 0 && !isExcused;
  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;

  // TV (D-UX5): finance tools stay off Explore unless "Show finance tools" is on.
  const allQuickActions = filterDestinationsForDevice(
    buildQuickActionItems(t, router.push, { colors, tokens }),
    destinationScope,
  ).map((item) =>
    newFeatureIds.has(item.id) ? { ...item, isNew: true, newLabel: t("common.newBadge") } : item,
  );
  const visibleQuickActions = orderQuickActions(
    allQuickActions,
    quickActionOrder?.length ? quickActionOrder : DEFAULT_QUICK_ACTION_ORDER,
  );
  const tv = isTV();

  // Dashboard: more tiles per row in the wider main column.
  const quickActionColumns = tv
    ? 3
    : dashboard
      ? width >= Breakpoints.xwide
        ? 6
        : width >= 1280
          ? 5
          : 4
      : 4;

  // Explore opens on the user's top shortcuts (their saved order) and reveals
  // the rest on demand, so a long grid doesn't bury the cards below it. TV keeps
  // the full grid — a mid-list toggle would break D-pad focus flow.
  const exploreCollapsedCount = quickActionColumns * (quickActionColumns >= 5 ? 2 : 3);
  const exploreCollapsible = !tv && visibleQuickActions.length > exploreCollapsedCount;
  const exploreShowsAll = !exploreCollapsible || exploreExpanded;
  const exploreItems = exploreShowsAll
    ? visibleQuickActions
    : visibleQuickActions.slice(0, exploreCollapsedCount);

  // P5-05: the goal card's one advancing action sits right under the progress
  // row — "Mark {{salah}}" while a Salah is due, else the checklist.
  const markDue = !isExcused && markPrayer != null && onMarkPrayer != null;
  const primaryAction = (
    <Button
      label={
        markDue
          ? t("home.markSalah", { salah: t(`prayers.${markPrayer}`) })
          : !isExcused && isFreshStart
            ? t("home.startTracking")
            : t("home.goToChecklist")
      }
      icon={
        markDue
          ? { ios: "checkmark.circle", android: "check_circle", web: "check_circle" }
          : undefined
      }
      variant={isExcused ? "secondary" : "primary"}
      fullWidth
      trailingIcon={markDue ? undefined : arrowForward}
      onPress={markDue ? onMarkPrayer : () => router.push("/tracker")}
      style={styles.primaryAction}
    />
  );
  // When a Salah is due, the checklist stays one tap away as a quiet link.
  const checklistLink = markDue ? (
    <Button
      variant="ghost"
      size="md"
      label={t("home.goToChecklist")}
      trailingIcon={arrowForward}
      onPress={() => router.push("/tracker")}
      style={styles.checklistLink}
    />
  ) : null;

  const goalCard = (
    <Card padding="four">
      <View style={styles.goalHeader}>
        <View style={styles.goalTitle}>
          <ThemedText type="subtitle">{t("home.todaysGoal")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {isExcused
              ? t("home.excusedGoalHint", {
                  reason: t(`tracker.excusedReason.${excusedReason}`),
                })
              : isFreshStart
                ? t("home.freshStartHint")
                : t("home.checklistHint")}
          </ThemedText>
        </View>
        <View style={styles.goalPills}>
          {acceptanceHourActive ? (
            <Pill
              label={t("home.acceptanceHourCard.badge")}
              compact
              tone="accent"
              icon={{
                ios: "hands.sparkles.fill",
                android: "volunteer_activism",
                web: "volunteer_activism",
              }}
            />
          ) : isFriday() ? (
            <Pill
              label={t("home.fridayCard.badge")}
              compact
              tone="accent"
              icon={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
            />
          ) : isWhiteDay() ? (
            <Pill
              label={t("home.whiteDaysCard.badge")}
              compact
              tone="accent"
              icon={{ ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" }}
            />
          ) : null}
          {khatmToday ? (
            <Pill
              label={t("home.khatmCard.badge")}
              compact
              tone={khatmToday.pace === "behind" ? "warning" : "accent"}
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            />
          ) : null}
          {isExcused ? (
            <Pill
              label={t("home.excusedPausedLabel")}
              tone="info"
              icon={{
                ios: "pause.circle.fill",
                android: "pause_circle",
                web: "pause_circle",
              }}
            />
          ) : (
            <Pill
              label={`${progressPct}%`}
              color={colors.accentForeground}
              background={colors.accent}
            />
          )}
        </View>
      </View>

      {isExcused ? (
        <View
          style={[
            styles.pausedBanner,
            {
              backgroundColor: colors.card,
              borderColor: tokens.status.info.color,
            },
          ]}
        >
          <SymbolView
            name={{
              ios: "pause.circle.fill",
              android: "pause_circle",
              web: "pause_circle",
            }}
            size={IconSize.lg}
            tintColor={tokens.status.info.color}
          />
          <View style={styles.pausedCopy}>
            <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
              {t("home.excusedPausedLabel")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("home.excusedGoalBody")}
            </ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.goalProgress}>
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {t("home.tasksProgress", { done: tasksDone, total: tasksTotal })}
          </ThemedText>
          <SegmentedProgress
            accessibilityLabel={t("a11yProgress.dailyTasks")}
            total={Math.max(tasksTotal, 1)}
            completed={tasksDone}
          />
          {primaryAction}
          {goalBreakdown.length > 0 ? (
            <View style={styles.goalBreakdown}>
              {goalBreakdown.map((item) => {
                const tier = resolveGoalTier(item.done, item.total);
                const status = tokens.status[tier.tone];
                return (
                  <View
                    key={item.key}
                    style={[
                      styles.breakdownChip,
                      {
                        backgroundColor: status.soft,
                        borderColor: status.color,
                      },
                    ]}
                  >
                    <SymbolView name={tier.icon} size={IconSize.sm} tintColor={status.color} />
                    <ThemedText type="caption" style={{ color: status.text }}>
                      {item.label}
                    </ThemedText>
                    <ThemedText weight="bold" type="caption" style={{ color: status.text }}>
                      {t("home.tasksFraction", {
                        done: formatCount(item.done),
                        total: formatCount(item.total),
                      })}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      )}

      {isExcused ? primaryAction : null}

      {goalReminders.length > 0 ? (
        <View style={styles.goalReminders}>
          <GoalReminderStack reminders={goalReminders} />
        </View>
      ) : null}

      <ExcusedDayPicker variant="inline" />

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
        style={[
          styles.achievementBlock,
          {
            backgroundColor: colors.muted,
            borderColor: tokens.hairline,
          },
        ]}
      >
        <DevotionAchievementSummary compact milestonePillBackground={colors.card} />
      </PressableScale>
      {checklistLink}
    </Card>
  );

  const quickActionsCard = !hiddenModules.has("quickActions") ? (
    <Card>
      <SectionHeader
        title={t("home.explore")}
        icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
        actionLabel={t("home.manage")}
        actionAccessibilityLabel={t("home.manageA11y")}
        actionIcon={{
          ios: "slider.horizontal.3",
          android: "tune",
          web: "tune",
        }}
        onActionPress={() => router.push("/settings/home")}
      />
      <View style={styles.quickActions}>
        <QuickActionGrid items={exploreItems} columns={quickActionColumns} />
      </View>
      {exploreCollapsible ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ expanded: exploreExpanded }}
          onPress={() => setExploreExpanded((value) => !value)}
          haptic="light"
          dimOnPress
          style={[styles.exploreToggle, { backgroundColor: tokens.accentSoft }]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {exploreExpanded ? t("reading.showLess") : t("reading.showMore")}
          </ThemedText>
          <SymbolView
            name={
              exploreExpanded
                ? { ios: "chevron.up", android: "expand_less", web: "expand_less" }
                : { ios: "chevron.down", android: "expand_more", web: "expand_more" }
            }
            size={14}
            tintColor={colors.accentText}
          />
        </PressableScale>
      ) : null}
      {/* Shown once the whole grid is visible, so the count matches what's on screen. */}
      {exploreShowsAll ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.exploreHint}>
          {tTv(t, "home.exploreHint", "home.exploreHintTv", {
            shown: visibleQuickActions.length,
            total: allQuickActions.length,
          })}
        </ThemedText>
      ) : null}
    </Card>
  ) : null;

  const seasonalBannerCard = seasonalBanner ? (
    <SeasonalThemeBanner
      banner={seasonalBanner}
      onDismiss={() => {
        void seasonalBannerStore.getState().dismiss(seasonalBanner.dismissKey);
        toast.info(t("seasonalTheme.hiddenToast"), t("seasonalTheme.hiddenToastHint"));
      }}
    />
  ) : null;

  const appIconOfferCard = appIconOffer ? <AppIconOfferCard offer={appIconOffer} /> : null;

  const qazaCard = showQazaCard ? (
    <QazaSummaryCard
      remaining={qaza.remaining}
      completed={qaza.completed}
      rozaRemaining={roza.remaining}
      onPress={() => router.push("/qaza")}
    />
  ) : null;

  const scheduleCard = !hiddenModules.has("schedule") ? (
    <PrayerScheduleCard
      schedule={schedule}
      nextIn={nextIn}
      nextScheduleId={nextScheduleId}
      // Share sheet is phone-only — no share affordance on TV.
      onShare={tv ? undefined : onShareSchedule}
      shareLoading={isSharing(SCHEDULE_SHARE_KEY)}
      shareGesturePending={isGesturePending(SCHEDULE_SHARE_KEY)}
    />
  ) : null;

  const knowledgeCard =
    // TV ~1GB AVDs OOM if home also loads @/lib/quran + hadith for this card.
    !tv && !hiddenModules.has("knowledge") ? (
      <Suspense fallback={null}>
        <KnowledgeFlashCardLazy />
      </Suspense>
    ) : null;

  if (dashboard) {
    // Wide web / tablets: hero + daily goal + discovery on the start side;
    // today's schedule and secondary progress cards in an aside beside the hero.
    return (
      <View style={styles.dashboard}>
        {SnapshotHost}
        <View style={styles.dashboardMain}>
          {hero}
          <IosPwaInstallBanner />
          <Stagger entranceKey="home">
            {showDefaultLocationBanner ? <DefaultLocationBanner /> : null}
            {showMadhhabCard ? <MadhhabPromptCard /> : null}
            {seasonalBannerCard}
            {appIconOfferCard}
            {goalCard}
            {qazaCard}
            {knowledgeCard}
            {quickActionsCard}
          </Stagger>
        </View>
        <View style={[styles.dashboardAside, { width: width >= 1440 ? 400 : 340 }]}>
          <Stagger entranceKey="home-aside">
            {scheduleCard}
            {showRamadanCard ? <RamadanCard /> : null}
            {showUmrahCard ? <UmrahHomeCard /> : null}
            {seasonalCards.showDhulHijjah ? <DhulHijjahHomeCard /> : null}
            {showKhatmCard ? <KhatmCard /> : null}
            {revisionDue ? <QuranRevisionHomeCard due={revisionDue} /> : null}
            {seasonalCards.showHabits ? (
              <SunnahHabitsSection date={trackerDate} variant="home" />
            ) : null}
            {showContinueCard ? <ContinueCard /> : null}
            {muhasabahCard ? <MuhasabahHomeCard state={muhasabahCard} /> : null}
            {familyTiesDue ? <FamilyTiesHomeCard count={familyTiesDue} /> : null}
            {coachReport ? <CoachHomeCard report={coachReport} /> : null}
            {showRawatibCard ? <RawatibHomeCard /> : null}
          </Stagger>
        </View>
      </View>
    );
  }

  // Contextual cards in priority order; phones show the first few and fold the
  // rest under "More for today" (TV shows all — a mid-list toggle breaks D-pad flow).
  const contextualCards = [
    showRamadanCard ? <RamadanCard key="ramadan" /> : null,
    showUmrahCard ? <UmrahHomeCard key="umrah" /> : null,
    seasonalCards.showDhulHijjah ? <DhulHijjahHomeCard key="dhul-hijjah" /> : null,
    showKhatmCard ? <KhatmCard key="khatm" /> : null,
    revisionDue ? <QuranRevisionHomeCard key="revision" due={revisionDue} /> : null,
    seasonalCards.showHabits ? (
      <SunnahHabitsSection key="habits" date={trackerDate} variant="home" />
    ) : null,
    muhasabahCard ? <MuhasabahHomeCard key="muhasabah" state={muhasabahCard} /> : null,
    familyTiesDue ? <FamilyTiesHomeCard key="family-ties" count={familyTiesDue} /> : null,
    coachReport ? <CoachHomeCard key="coach" report={coachReport} /> : null,
  ].filter((card) => card != null);
  const contextualFolded = !tv && contextualCards.length > CONTEXTUAL_CARD_LIMIT;
  const contextualShown =
    contextualFolded && !moreForTodayOpen
      ? contextualCards.slice(0, CONTEXTUAL_CARD_LIMIT)
      : contextualCards;
  const moreForTodayToggle =
    contextualFolded && !moreForTodayOpen ? (
      <Button
        key="more-for-today"
        variant="secondary"
        fullWidth
        label={t("home.moreForToday", {
          count: contextualCards.length - CONTEXTUAL_CARD_LIMIT,
        })}
        trailingIcon={{ ios: "chevron.down", android: "expand_more", web: "expand_more" }}
        onPress={() => setMoreForTodayOpen(true)}
      />
    ) : null;

  return (
    <View style={[styles.body, tv ? { paddingHorizontal: TvLayout.contentPaddingX } : null]}>
      {SnapshotHost}
      <IosPwaInstallBanner />

      <Stagger entranceKey="home">
        {/* Mount only when visible — empty Stagger wrappers still take flex `gap`. */}
        {showDefaultLocationBanner ? <DefaultLocationBanner /> : null}
        {showMadhhabCard ? <MadhhabPromptCard /> : null}
        {seasonalBannerCard}
        {appIconOfferCard}

        {/* TV: Continue owns preferred focus — keep it right under the hero so the
          landing scroll stays shallow and the hero clock remains on screen. */}
        {tv && showContinueCard ? <ContinueCard /> : null}

        {goalCard}

        {qazaCard}

        {contextualShown}
        {moreForTodayToggle}

        {!tv && showContinueCard ? <ContinueCard /> : null}

        {knowledgeCard}

        {quickActionsCard}

        {scheduleCard}
      </Stagger>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tuck into the hero curve without covering the prayer-time row.
  body: { paddingHorizontal: Spacing.four, marginTop: -Spacing.five, gap: Spacing.four, zIndex: 1 },
  dashboard: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  dashboardMain: { flex: 1, minWidth: 0, gap: Spacing.four },
  dashboardAside: { flexShrink: 0, gap: Spacing.four },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  goalTitle: { flex: 1, gap: Spacing.half },
  goalPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.oneHalf,
    maxWidth: "46%",
  },
  goalProgress: { gap: Spacing.two },
  primaryAction: { marginTop: Spacing.two },
  checklistLink: { alignSelf: "center", marginTop: Spacing.one },
  goalReminders: { marginTop: Spacing.three },
  goalBreakdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  breakdownChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  pausedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  pausedCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  achievementBlock: {
    gap: Spacing.three,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  quickActions: { marginTop: Spacing.two },
  exploreToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: Spacing.one,
    minHeight: Control.md,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  exploreHint: { marginTop: Spacing.three, textAlign: "center" },
});
