import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { ExcusedReason, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Fragment, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollView, StyleSheet, View } from "react-native";

import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { FridayTrackerSection } from "@/components/friday-tracker-section";
import { KhatmDailyChecklist } from "@/components/khatm-daily-checklist";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { IconWell } from "@/components/ui/icon-well";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { scrollChildIntoView } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { afterSalahProgressForPrayer } from "@/lib/after-salah-adhkar-progress";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { FRIDAY_CHECKLIST_FOCUS, isFridayDateString } from "@/lib/friday";
import { useChevronForward } from "@/lib/rtl";
import { ensureZikrCorpus, zikrCategories } from "@/lib/zikr";

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

export type TrackerDayChecklistProps = {
  date: string;
  isToday: boolean;
  status: Record<string, PrayerStatus>;
  notes: Record<string, string | undefined>;
  jama: Record<string, boolean>;
  zikrCounts: Record<string, number>;
  excusedReason?: ExcusedReason | null;
  prayerTimes: Record<PrayerId, string>;
  onPrayerPress: (prayerId: PrayerId) => void;
  /** When omitted, excused chips use the tracker store and guide flow (today tab). */
  onExcusedChange?: (reason: ExcusedReason | null) => void;
  /** Parent ScreenLayout scroll — used to jump to the Jumu'ah checklist. */
  scrollRef?: RefObject<ScrollView | null>;
  getScrollY?: () => number;
  /** Deep-link registration for `?focus=friday` (Tracker tab). */
  registerFocus?: (key: string) => (node: View | null) => void;
  fridayFocused?: boolean;
};

export function TrackerDayChecklist({
  date,
  isToday,
  status,
  notes,
  jama,
  zikrCounts,
  excusedReason,
  prayerTimes,
  onPrayerPress,
  onExcusedChange,
  scrollRef,
  getScrollY,
  registerFocus,
  fridayFocused = false,
}: TrackerDayChecklistProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const [, setZikrReady] = useState(false);
  const fridaySectionRef = useRef<View>(null);
  const [fridayHighlight, setFridayHighlight] = useState(false);
  const showFriday = isFridayDateString(date);

  const obligatoryDone = useMemo(() => countCompleted(OBLIGATORY_PRAYERS, status), [status]);
  const witrDone = status[WITR_PRAYER] === "completed" ? 1 : 0;
  const sunnahDone = useMemo(() => countCompleted(SUNNAH_PRAYERS, status), [status]);

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setZikrReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!fridayFocused) return;
    setFridayHighlight(true);
    const clear = setTimeout(() => setFridayHighlight(false), 2800);
    return () => clearTimeout(clear);
  }, [fridayFocused]);

  const openAfterSalah = (prayerId: Parameters<typeof afterSalahAdhkarRoute>[0]) => {
    if (!isToday) return;
    router.push(afterSalahAdhkarRoute(prayerId));
  };

  const setFridaySectionRef = useCallback(
    (node: View | null) => {
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

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <ExcusedDayPicker
          {...(onExcusedChange ? { excusedReason: excusedReason ?? null, onExcusedChange } : {})}
        />
      </Card>

      <View
        style={[
          styles.tipBanner,
          { backgroundColor: tokens.accentSoft, borderColor: colors.border },
        ]}
        accessibilityRole="text"
        accessibilityLabel={t("tracker.cardTip")}
      >
        <SymbolView
          name={{ ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" }}
          size={14}
          tintColor={colors.accent}
        />
        <ThemedText type="caption" style={[styles.tipText, { color: colors.accent }]}>
          {t("tracker.cardTip")}
        </ThemedText>
      </View>

      <Card padding="three">
        <SectionHeader
          title={t("tracker.obligatory")}
          subtitle={t("tracker.obligatorySubtitle")}
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
          {OBLIGATORY_PRAYERS.map((prayerId) => {
            const afterSalahProgress = afterSalahProgressForPrayer(prayerId, zikrCounts);
            return (
              <Fragment key={prayerId}>
                <PrayerTrackerRow
                  prayerId={prayerId}
                  status={status[prayerId] ?? "pending"}
                  time={prayerTimes[prayerId]}
                  hasNotes={!!notes[prayerId]}
                  isJama={jama[prayerId] ?? false}
                  afterSalahProgress={afterSalahProgress}
                  onPressAfterSalah={
                    isToday && afterSalahProgress.total > 0
                      ? () => openAfterSalah(prayerId)
                      : undefined
                  }
                  onPress={() => onPrayerPress(prayerId)}
                />
                {prayerId === "fajr" && showFriday ? (
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={t("tracker.friday.jumpA11y")}
                    onPress={jumpToFridayChecklist}
                    haptic="selection"
                    scaleTo={0.98}
                    style={[
                      styles.fridayJump,
                      {
                        backgroundColor: tokens.accentSoft,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <IconWell icon={FRIDAY_ICON} size={16} well={32} radius={Radius.sm} />
                    <View style={styles.fridayJumpCopy}>
                      <ThemedText type="smallBold">{t("tracker.friday.jumpTitle")}</ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                        {t("tracker.friday.jumpHint")}
                      </ThemedText>
                    </View>
                    <AppIcon icon={chevronForward} size={16} tintColor={colors.accent} />
                  </PressableScale>
                ) : null}
              </Fragment>
            );
          })}
        </View>
      </Card>

      {showFriday ? (
        <FocusHighlight ref={setFridaySectionRef} active={fridayHighlight || fridayFocused}>
          <FridayTrackerSection date={date} />
        </FocusHighlight>
      ) : null}

      <Card padding="three">
        <SectionHeader
          title={t("tracker.witr")}
          subtitle={t("tracker.witrSubtitle")}
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
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("tracker.salahAdhkarSubtitle")}
        </ThemedText>
        <View style={styles.rows}>
          {salahAdhkarCategories().map((category) => (
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

      <QazaDailyChecklist date={date} />
      <KhatmDailyChecklist />

      <Card padding="three">
        <SectionHeader
          title={t("tracker.sunnahOptional")}
          subtitle={t("tracker.sunnahSubtitle")}
          icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
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
            />
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  // Match Stagger's stack gap so nested cards sit apart the same way top-level ones do.
  stack: {
    width: "100%",
    gap: Spacing.four,
  },
  tipBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  tipText: {
    flex: 1,
    minWidth: 0,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  hint: {
    marginTop: Spacing.two,
  },
  fridayJump: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  fridayJumpCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
});
