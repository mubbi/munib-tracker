import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { ExcusedReason, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { sumQazaScheduleTargets } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View, type ViewInstance } from "react-native";

import { TakbirTashriqTrackerSection } from "@/components/dhul-hijjah/takbir-tracker-section";
import { BloodPeriodStatus } from "@/components/excused/blood-period-status";
import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { FridayTrackerSection } from "@/components/friday-tracker-section";
import { KhatmDailyChecklist } from "@/components/khatm-daily-checklist";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { useRawatibDay } from "@/components/rawatib/use-rawatib-day";
import { useWitrStatusLabel } from "@/components/rawatib/witr-status";
import { SunnahHabitsSection } from "@/components/sunnah-habits/sunnah-habits-section";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { IconWell } from "@/components/ui/icon-well";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { WhiteDaysTrackerSection } from "@/components/white-days-tracker-section";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { scrollChildIntoView } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { afterSalahProgressForPrayer } from "@/lib/after-salah-adhkar-progress";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { FRIDAY_CHECKLIST_FOCUS, isFridayDateString } from "@/lib/friday";
import { isTV } from "@/lib/platform/is-tv";
import type { PrayerCombined } from "@/lib/prayer-combining";
import { RAWATIB_TRACKER_FOCUS } from "@/lib/rawatib";
import { useChevronForward } from "@/lib/rtl";
import { isWhiteDayDateString, WHITE_DAYS_CHECKLIST_FOCUS } from "@/lib/white-days";
import { ZIKR_CORPUS, zikrCategories } from "@/lib/zikr";
import { zikrCategoryBadge } from "@/lib/zikr-list-progress";
import { useKhatm } from "@/stores/khatm-store";
import { useDayExcused, useQazaSchedule } from "@/stores/tracker-store";

function salahAdhkarCategories() {
  const byId = new Map(zikrCategories().map((category) => [category.id, category]));
  return (["after_azan", "before_prayer", "after_prayer"] as const)
    .map((id) => byId.get(id))
    .filter((category): category is NonNullable<typeof category> => category != null);
}

function countCompleted(
  prayerIds: readonly PrayerId[],
  status: Record<string, PrayerStatus>,
): number {
  return prayerIds.reduce((count, id) => count + (status[id] === "completed" ? 1 : 0), 0);
}

const FRIDAY_ICON = {
  ios: "sun.max.fill",
  android: "wb_sunny",
  web: "wb_sunny",
} as const;

const WHITE_DAYS_ICON = {
  ios: "moon.circle.fill",
  android: "brightness_3",
  web: "brightness_3",
} as const;

const EXCUSED_ICON = { ios: "pause.circle", android: "pause_circle", web: "pause_circle" } as const;

export type TrackerDayChecklistProps = {
  date: string;
  isToday: boolean;
  status: Record<string, PrayerStatus>;
  notes: Record<string, string | undefined>;
  jama: Record<string, boolean>;
  /** Prayed-at-the-masjid flags keyed by prayer id (NF-3.11); shown on the fard rows. */
  atMasjid?: Record<string, boolean>;
  /** Jam' (combined) flags keyed by prayer id (NF-3.0a); shown on the fard rows. */
  combined?: Record<string, PrayerCombined>;
  /** Pre-localized preferred-time hints keyed by prayer id (today only, NF-3.0a). */
  preferredHints?: Record<string, string>;
  zikrCounts: Record<string, number>;
  excusedReason?: ExcusedReason | null;
  prayerTimes: Record<PrayerId, string>;
  onPrayerPress: (prayerId: PrayerId) => void;
  /**
   * One-tap mark from a row's status toggle (P5-02). Omit to keep rows
   * sheet-only (calendar days).
   */
  onPrayerQuickSelect?: (prayerId: PrayerId, status: PrayerStatus) => void;
  /** When omitted, excused chips use the tracker store and guide flow (today tab). */
  onExcusedChange?: (reason: ExcusedReason | null) => void;
  /** Parent ScreenLayout scroll — used to jump to the Jumu'ah checklist. */
  scrollRef?: RefObject<ScrollViewInstance | null>;
  getScrollY?: () => number;
  /** Deep-link registration for `?focus=friday` (Tracker tab). */
  registerFocus?: (key: string) => (node: ViewInstance | null) => void;
  fridayFocused?: boolean;
  whiteDaysFocused?: boolean;
  /** TV: request initial D-pad focus on the first obligatory Salah row. */
  preferredFocusFirstPrayer?: boolean;
};

/**
 * The day's checklist (P5-01): the Obligatory card leads (Excused day folds
 * into its footer), with a single Jumu'ah / White Days banner above it. Day-only
 * sections (rawatib, Friday, White Days, Takbir) and Witr follow, then three
 * collapsible groups — Remembrance, Make-up & reading, Voluntary — each
 * collapsed once complete. Calendar day views reuse it unchanged.
 */
export function TrackerDayChecklist({
  date,
  isToday,
  status,
  notes,
  jama,
  atMasjid,
  combined,
  preferredHints,
  zikrCounts,
  excusedReason,
  prayerTimes,
  onPrayerPress,
  onPrayerQuickSelect,
  onExcusedChange,
  scrollRef,
  getScrollY,
  registerFocus,
  fridayFocused = false,
  whiteDaysFocused = false,
  preferredFocusFirstPrayer = false,
}: TrackerDayChecklistProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  // Re-render once the zikr corpus lands (the adhkar sets below read it).
  useContentCorpus(ZIKR_CORPUS);
  const fridaySectionRef = useRef<ViewInstance>(null);
  const [fridayHighlight, setFridayHighlight] = useState(false);
  const showFriday = isFridayDateString(date);
  const whiteDaysSectionRef = useRef<ViewInstance>(null);
  const [whiteDaysHighlight, setWhiteDaysHighlight] = useState(false);
  const showWhiteDays = isWhiteDayDateString(date);
  const tv = isTV();

  const obligatoryDone = useMemo(() => countCompleted(OBLIGATORY_PRAYERS, status), [status]);
  // NF-3.1 rawatib chips + header card. Today's excused reason lives in the store;
  // calendar days pass theirs explicitly.
  const storeExcused = useDayExcused();
  const dayExcused = onExcusedChange ? (excusedReason ?? null) : (excusedReason ?? storeExcused);
  const rawatib = useRawatibDay({
    date,
    isToday,
    status,
    excusedReason: onExcusedChange ? excusedReason : (excusedReason ?? storeExcused),
  });
  const witrSubtitle = useWitrStatusLabel();
  const setRawatibRef = useCallback(
    (node: ViewInstance | null) => registerFocus?.(RAWATIB_TRACKER_FOCUS)(node),
    [registerFocus],
  );
  const witrDone = status[WITR_PRAYER] === "completed" ? 1 : 0;
  const sunnahDone = useMemo(() => countCompleted(SUNNAH_PRAYERS, status), [status]);
  // Excused day lives behind the Obligatory card's footer toggle; an active
  // excuse keeps it open so the state (and how to clear it) stays visible.
  const [excusedOpen, setExcusedOpen] = useState(false);
  const excusedVisible = excusedOpen || dayExcused != null;

  // Make-up & reading only groups when today has a Qaza target or a khatm plan
  // (both cards hide themselves otherwise; past days keep the plain stack).
  const qazaSchedule = useQazaSchedule();
  const { plan: khatmPlan } = useKhatm();
  const makeUpGroup = isToday && (sumQazaScheduleTargets(qazaSchedule) > 0 || khatmPlan != null);

  const adhkarCategories = salahAdhkarCategories();
  const adhkarBadges = adhkarCategories.map((category) =>
    zikrCategoryBadge(category.id, zikrCounts, t("zikr.done")),
  );
  const adhkarComplete =
    adhkarBadges.length > 0 && adhkarBadges.every((badge) => badge?.completed !== false);

  useEffect(() => {
    if (!fridayFocused) return;
    setFridayHighlight(true);
    const clear = setTimeout(() => setFridayHighlight(false), 2800);
    return () => clearTimeout(clear);
  }, [fridayFocused]);

  useEffect(() => {
    if (!whiteDaysFocused) return;
    setWhiteDaysHighlight(true);
    const clear = setTimeout(() => setWhiteDaysHighlight(false), 2800);
    return () => clearTimeout(clear);
  }, [whiteDaysFocused]);

  const openAfterSalah = (prayerId: Parameters<typeof afterSalahAdhkarRoute>[0]) => {
    if (!isToday) return;
    router.push(afterSalahAdhkarRoute(prayerId));
  };

  const setFridaySectionRef = useCallback(
    (node: ViewInstance | null) => {
      fridaySectionRef.current = node;
      registerFocus?.(FRIDAY_CHECKLIST_FOCUS)(node);
    },
    [registerFocus],
  );

  const jumpToFridayChecklist = useCallback(() => {
    setFridayHighlight(true);
    if (scrollRef) {
      scrollChildIntoView(scrollRef, fridaySectionRef, getScrollY?.() ?? 0, 80);
    }
    setTimeout(() => setFridayHighlight(false), 2800);
  }, [getScrollY, scrollRef]);

  const setWhiteDaysSectionRef = useCallback(
    (node: ViewInstance | null) => {
      whiteDaysSectionRef.current = node;
      registerFocus?.(WHITE_DAYS_CHECKLIST_FOCUS)(node);
    },
    [registerFocus],
  );

  const jumpToWhiteDaysChecklist = useCallback(() => {
    setWhiteDaysHighlight(true);
    if (scrollRef) {
      scrollChildIntoView(scrollRef, whiteDaysSectionRef, getScrollY?.() ?? 0, 80);
    }
    setTimeout(() => setWhiteDaysHighlight(false), 2800);
  }, [getScrollY, scrollRef]);

  const quickSelectFor = (prayerId: PrayerId) =>
    onPrayerQuickSelect ? (next: PrayerStatus) => onPrayerQuickSelect(prayerId, next) : undefined;

  // TV: the Jumu'ah / White Days sections are the next D-pad stops below — a
  // scroll-jump shortcut would strand focus off-screen.
  const dayLinks = tv
    ? []
    : [
        showFriday
          ? {
              key: "friday",
              icon: FRIDAY_ICON,
              title: t("tracker.friday.jumpTitle"),
              hint: t("tracker.friday.jumpHint"),
              a11y: t("tracker.friday.jumpA11y"),
              onPress: jumpToFridayChecklist,
            }
          : null,
        showWhiteDays
          ? {
              key: "white-days",
              icon: WHITE_DAYS_ICON,
              title: t("tracker.whiteDays.jumpTitle"),
              hint: t("tracker.whiteDays.jumpHint"),
              a11y: t("tracker.whiteDays.jumpA11y"),
              onPress: jumpToWhiteDaysChecklist,
            }
          : null,
      ].filter((link) => link != null);

  const qazaAndKhatm = (
    <>
      <QazaDailyChecklist date={date} />
      <KhatmDailyChecklist />
    </>
  );

  return (
    <View style={styles.stack}>
      {dayLinks.length > 0 ? (
        <View
          testID="tracker-day-banner"
          style={[
            styles.dayBanner,
            { backgroundColor: tokens.accentSoft, borderColor: colors.border },
          ]}
        >
          {dayLinks.map((link) => (
            <PressableScale
              key={link.key}
              accessibilityRole="button"
              accessibilityLabel={link.a11y}
              onPress={link.onPress}
              haptic="selection"
              scaleTo={0.98}
              style={styles.dayLink}
            >
              <IconWell icon={link.icon} size={IconSize.md} well={32} radius={Radius.sm} />
              <View style={styles.dayLinkCopy}>
                <ThemedText type="smallBold">{link.title}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {link.hint}
                </ThemedText>
              </View>
              <AppIcon icon={chevronForward} size={IconSize.md} tintColor={tokens.accentOnSoft} />
            </PressableScale>
          ))}
        </View>
      ) : null}

      <View testID="tracker-obligatory">
        <Card>
          <SectionHeader
            title={t("tracker.obligatory")}
            icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
            badge={
              <Pill
                label={t("tracker.sectionProgress", {
                  completed: obligatoryDone,
                  total: OBLIGATORY_PRAYERS.length,
                })}
                compact
              />
            }
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId, prayerIndex) => {
              const afterSalahProgress = afterSalahProgressForPrayer(prayerId, zikrCounts);
              return (
                <View key={prayerId} style={styles.rowGroup}>
                  <PrayerTrackerRow
                    prayerId={prayerId}
                    status={status[prayerId] ?? "pending"}
                    time={prayerTimes[prayerId]}
                    hasNotes={!!notes[prayerId]}
                    isJama={jama[prayerId] ?? false}
                    atMasjid={atMasjid?.[prayerId] ?? false}
                    combinedWith={combined?.[prayerId]?.with}
                    preferredHint={preferredHints?.[prayerId]}
                    afterSalahProgress={afterSalahProgress}
                    onPressAfterSalah={
                      isToday && afterSalahProgress.total > 0
                        ? () => openAfterSalah(prayerId)
                        : undefined
                    }
                    onPress={() => onPrayerPress(prayerId)}
                    onSelect={quickSelectFor(prayerId)}
                    preferredFocus={tv && preferredFocusFirstPrayer && prayerIndex === 0}
                  />
                  {rawatib.chipsFor(prayerId)}
                </View>
              );
            })}
          </View>

          {dayExcused == null ? (
            <Button
              variant="ghost"
              size="md"
              icon={EXCUSED_ICON}
              trailingIcon={
                excusedOpen
                  ? { ios: "chevron.up", android: "expand_less", web: "expand_less" }
                  : { ios: "chevron.down", android: "expand_more", web: "expand_more" }
              }
              label={t("tracker.excusedTitle")}
              accessibilityHint={t("tracker.excusedHint")}
              onPress={() => setExcusedOpen((open) => !open)}
              style={styles.excusedToggle}
            />
          ) : null}
          {/* B-20: post-period prompts stay visible while the picker is collapsed. */}
          {!excusedVisible && isToday && !onExcusedChange ? <BloodPeriodStatus /> : null}
          {excusedVisible ? (
            <ExcusedDayPicker
              variant="inline"
              {...(onExcusedChange
                ? { excusedReason: excusedReason ?? null, onExcusedChange }
                : {})}
            />
          ) : null}
        </Card>
      </View>

      {rawatib.headerCard ? (
        <View ref={setRawatibRef} testID="rawatib-card">
          {rawatib.headerCard}
        </View>
      ) : null}

      {showFriday ? (
        <FocusHighlight ref={setFridaySectionRef} active={fridayHighlight || fridayFocused}>
          <FridayTrackerSection date={date} />
        </FocusHighlight>
      ) : null}

      {showWhiteDays ? (
        <FocusHighlight
          ref={setWhiteDaysSectionRef}
          active={whiteDaysHighlight || whiteDaysFocused}
        >
          <WhiteDaysTrackerSection date={date} />
        </FocusHighlight>
      ) : null}

      {/* NF-3.3: Takbir al-Tashriq chips (only inside the window; none during hayd). */}
      <TakbirTashriqTrackerSection date={date} status={status} hidden={excusedReason === "hayd"} />

      <Card>
        <SectionHeader
          title={t("tracker.witr")}
          subtitle={witrSubtitle}
          icon={{ ios: "moon.fill", android: "dark_mode", web: "dark_mode" }}
          badge={
            <Pill
              label={t("tracker.sectionProgress", {
                completed: witrDone,
                total: 1,
              })}
              compact
            />
          }
        />
        <View style={styles.rows}>
          <PrayerTrackerRow
            prayerId={WITR_PRAYER}
            status={status[WITR_PRAYER] ?? "pending"}
            time={prayerTimes[WITR_PRAYER]}
            hasNotes={!!notes[WITR_PRAYER]}
            afterSalahProgress={afterSalahProgressForPrayer(WITR_PRAYER, zikrCounts)}
            onPressAfterSalah={isToday ? () => openAfterSalah(WITR_PRAYER) : undefined}
            onPress={() => onPrayerPress(WITR_PRAYER)}
            onSelect={quickSelectFor(WITR_PRAYER)}
          />
        </View>
      </Card>

      <CollapsibleSection
        title={t("tracker.groupRemembrance")}
        icon={{
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        }}
        defaultOpen={!adhkarComplete}
      >
        <View style={styles.group}>
          <Card>
            <SectionHeader
              title={t("tracker.salahAdhkar")}
              subtitle={t("tracker.salahAdhkarSubtitle")}
            />
            <View style={styles.rows}>
              {adhkarCategories.map((category, index) => {
                const progress = adhkarBadges[index];
                return (
                  <NavRow
                    key={category.id}
                    icon={category.icon}
                    label={t(`zikrCat.${category.id}`)}
                    badge={progress?.label}
                    completed={progress?.completed}
                    count={progress ? undefined : category.count}
                    onPress={() =>
                      router.push({
                        pathname: "/zikr/[category]",
                        params: { category: category.id },
                      })
                    }
                  />
                );
              })}
            </View>
          </Card>
          {/* NF-3.5: Sunnah habits under the zikr section. */}
          <SunnahHabitsSection date={date} />
        </View>
      </CollapsibleSection>

      {makeUpGroup ? (
        <CollapsibleSection
          title={t("tracker.groupMakeUp")}
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          defaultOpen
        >
          <View style={styles.group}>{qazaAndKhatm}</View>
        </CollapsibleSection>
      ) : (
        qazaAndKhatm
      )}

      <CollapsibleSection
        title={t("tracker.groupVoluntary")}
        icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
        defaultOpen={sunnahDone < SUNNAH_PRAYERS.length}
      >
        <View style={styles.group}>
          <Card>
            <SectionHeader
              title={t("tracker.sunnahOptional")}
              subtitle={t("tracker.sunnahSubtitle")}
              badge={
                <Pill
                  label={t("tracker.sectionProgress", {
                    completed: sunnahDone,
                    total: SUNNAH_PRAYERS.length,
                  })}
                  compact
                />
              }
            />
            <View style={styles.rows}>
              {SUNNAH_PRAYERS.map((prayerId) => (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={status[prayerId] ?? "pending"}
                  time={prayerTimes[prayerId]}
                  hasNotes={!!notes[prayerId]}
                  onPress={() => onPrayerPress(prayerId)}
                  onSelect={quickSelectFor(prayerId)}
                />
              ))}
              <NavRow
                icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
                label={t("tahajjud.streakRow")}
                onPress={() => router.push("/tahajjud")}
              />
            </View>
          </Card>
          <Card>
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
        </View>
      </CollapsibleSection>
      {rawatib.sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  // Match Stagger's stack gap so nested cards sit apart the same way top-level ones do.
  stack: {
    width: "100%",
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.four,
    marginTop: Spacing.three,
  },
  dayBanner: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  dayLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: Control.md,
    paddingVertical: Spacing.one,
  },
  dayLinkCopy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  rowGroup: {
    gap: Spacing.two,
  },
  excusedToggle: {
    alignSelf: "flex-start",
    marginTop: Spacing.two,
  },
});
