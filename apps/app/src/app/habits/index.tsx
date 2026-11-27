import {
  DEFAULT_SUNNAH_HABIT_SELECTION,
  getSunnahHabit,
  SUNNAH_HABITS_PRINCIPLE_REF,
} from "@munib-tracker/shared/content/sunnah-habits";
import type { SunnahHabitsState } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ToggleRow } from "@/components/seasonal/toggle-row";
import { Seo } from "@/components/seo/seo";
import { HabitDetailSheet } from "@/components/sunnah-habits/habit-detail-sheet";
import { HabitRow, habitTitle } from "@/components/sunnah-habits/habit-row";
import { HabitsWeekStrip } from "@/components/sunnah-habits/habits-week-strip";
import { ManageHabitsSheet } from "@/components/sunnah-habits/manage-habits-sheet";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Control, Radius, Spacing } from "@/constants/theme";
import { useHabitContext } from "@/hooks/use-habit-context";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import {
  canAddHabit,
  dayProgressSummary,
  habitsDoneLast,
  mostConsistentHabit,
  pickSpotlight,
  resolveHabit,
  weekSummary,
} from "@/lib/sunnah-habits";
import { habitIcon, SUNNAH_HABITS_ICON } from "@/lib/sunnah-habits-ui";
import {
  sunnahHabitsStore,
  useEnsureSunnahHabitsLoaded,
  useSunnahHabits,
  useSunnahHabitsActions,
  useSunnahHabitsReady,
} from "@/stores/sunnah-habits-store";
import { useDayExcused, useTrackerDate } from "@/stores/tracker-store";

const EDIT = { ios: "slider.horizontal.3", android: "tune", web: "tune" } as const;

/**
 * Undo for a removed habit (P5-08 / B-85): puts it back at its old position and
 * re-adds a custom habit's definition (its day checks were never removed).
 */
function restoreHabit(snapshot: SunnahHabitsState, id: string) {
  return (data: SunnahHabitsState): SunnahHabitsState => {
    if (data.selected.includes(id)) return data;
    const selected = [...data.selected];
    const index = Math.max(0, snapshot.selected.indexOf(id));
    selected.splice(Math.min(index, selected.length), 0, id);
    const custom = snapshot.custom.find((entry) => entry.id === id);
    return {
      ...data,
      selected,
      custom:
        custom && !data.custom.some((entry) => entry.id === id)
          ? [...data.custom, custom]
          : data.custom,
      listUpdatedAt: new Date().toISOString(),
    };
  };
}

/**
 * Sunnah habits (NF-3.5): a calm checklist for today (done habits settle at the
 * bottom), one "This week" strip, a one-line spotlight, and the list managed in
 * an "Edit list" sheet. Evidence and 30-day history live in each habit's sheet.
 */
export default function SunnahHabitsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  useEnsureSunnahHabitsLoaded();
  const ready = useSunnahHabitsReady();
  const state = useSunnahHabits();
  const actions = useSunnahHabitsActions();
  const ctx = useHabitContext();
  const date = useTrackerDate();
  const excused = useDayExcused();
  const habitsReminder = useSetting<boolean>("notifications.sunnah.habits");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [showPrincipleEvidence, setShowPrincipleEvidence] = useState(false);
  const undoToast = useUndoToast();

  /** Single-item removal: act now, offer Undo (no confirm dialog). */
  const removeHabit = (id: string, title: string) => {
    const snapshot = sunnahHabitsStore.getState().data;
    void undoToast.run({
      do: () => actions.remove(id),
      undo: () => sunnahHabitsStore.getState().apply(restoreHabit(snapshot, id)),
      messageKey: "sunnahHabits.habitRemoved",
      messageOptions: { title },
      type: "info",
    });
  };

  const habits = habitsDoneLast(state, date, ctx);
  const summary = dayProgressSummary(state, date, ctx);
  const week = useMemo(() => weekSummary(state, date, ctx), [state, date, ctx]);
  const best = useMemo(() => mostConsistentHabit(state, date, ctx), [state, date, ctx]);
  const bestHabit = best ? resolveHabit(state, best.id) : null;
  const spotlightId = ready ? pickSpotlight(state, date) : null;
  const spotlight = spotlightId ? getSunnahHabit(spotlightId) : undefined;
  const isNew = ready && habits.length === 0 && !state.listUpdatedAt;

  // Record the spotlight once per day so it rotates and respects the 14-day cooldown.
  useEffect(() => {
    if (spotlightId && state.spotlightSeen[spotlightId] !== date) {
      void actions.markSpotlightSeen(spotlightId, date);
    }
  }, [actions, date, spotlightId, state.spotlightSeen]);

  return (
    <ScreenLayout
      eyebrow={t("sunnahHabits.eyebrow")}
      title={t("sunnahHabits.title")}
      subtitle={t("sunnahHabits.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} preferredFocus />
      <Seo path="/habits" />
      <Stagger>
        <View style={styles.principle}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
            {t("sunnahHabits.principleShort")}
          </ThemedText>
          <PressableScale
            accessibilityRole="button"
            accessibilityState={{ expanded: showPrincipleEvidence }}
            accessibilityLabel={t("sunnahHabits.evidenceLink")}
            onPress={() => setShowPrincipleEvidence((v) => !v)}
            haptic="selection"
            hitSlop={Spacing.one}
            style={styles.link}
          >
            <ThemedText type="caption" weight="semibold" style={{ color: tokens.accentOnSoft }}>
              {t("sunnahHabits.evidenceLink")}
            </ThemedText>
          </PressableScale>
        </View>
        {showPrincipleEvidence ? <EvidenceLine refs={[SUNNAH_HABITS_PRINCIPLE_REF]} /> : null}

        {isNew ? (
          <Card>
            <SectionHeader title={t("sunnahHabits.startTitle")} icon={SUNNAH_HABITS_ICON} />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.gapTop}>
              {t("sunnahHabits.startBody")}
            </ThemedText>
            <View style={styles.gapTop}>
              <Button
                label={t("sunnahHabits.startButton")}
                onPress={() => {
                  for (const id of DEFAULT_SUNNAH_HABIT_SELECTION) void actions.add(id);
                }}
                fullWidth
              />
            </View>
          </Card>
        ) : null}

        <Card>
          <View style={styles.todayHeader}>
            {habits.length > 0 ? (
              <ProgressRing
                progress={summary.total ? summary.done / summary.total : 0}
                accessibilityLabel={t("sunnahHabits.todayRingA11y")}
                size={40}
                stroke={4}
                valueFontSize={10}
              />
            ) : null}
            <ThemedText type="subtitle" role="heading" style={styles.flex}>
              {habits.length > 0
                ? t("sunnahHabits.todayCount", { done: summary.done, total: summary.total })
                : t("sunnahHabits.today")}
            </ThemedText>
            <Button
              label={t("sunnahHabits.editList")}
              icon={EDIT}
              variant="ghost"
              size="sm"
              onPress={() => setManageOpen(true)}
            />
          </View>
          {habits.length > 0 ? (
            <View style={styles.rows}>
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  state={state}
                  habit={habit}
                  date={date}
                  ctx={ctx}
                  excusedReason={excused}
                  onOpenDetail={() => setDetailId(habit.id)}
                />
              ))}
            </View>
          ) : !isNew && ready ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
              {t("sunnahHabits.emptyHint")}
            </ThemedText>
          ) : null}
        </Card>

        {habits.length > 0 ? (
          <HabitsWeekStrip
            days={week}
            today={date}
            footnote={
              best && bestHabit
                ? t("sunnahHabits.mostConsistent", {
                    title: habitTitle(t, bestHabit),
                    days: best.days,
                  })
                : undefined
            }
          />
        ) : null}

        {spotlight ? (
          <View
            style={[
              styles.spotlight,
              { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
            ]}
          >
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={t("sunnahHabits.spotlightLine", {
                title: t(`sunnahHabits.items.${spotlight.id}.title`),
              })}
              accessibilityHint={t("sunnahHabits.spotlightTitle")}
              onPress={() => setDetailId(spotlight.id)}
              haptic="selection"
              scaleTo={0.98}
              style={styles.spotlightBody}
            >
              <IconWell icon={habitIcon(spotlight.id)} size={14} well={28} radius={Radius.sm} />
              <ThemedText type="small" style={styles.flex} numberOfLines={2}>
                {t("sunnahHabits.spotlightLine", {
                  title: t(`sunnahHabits.items.${spotlight.id}.title`),
                })}
              </ThemedText>
            </PressableScale>
            <Button
              label={t("sunnahHabits.customAdd")}
              accessibilityHint={t("sunnahHabits.add", {
                title: t(`sunnahHabits.items.${spotlight.id}.title`),
              })}
              size="sm"
              variant="secondary"
              disabled={!canAddHabit(state)}
              onPress={() => void actions.add(spotlight.id)}
            />
          </View>
        ) : null}

        <Card>
          <ToggleRow
            title={t("sunnahHabits.reminderToggle")}
            subtitle={t("sunnahHabits.reminderToggleHint")}
            value={habitsReminder.value}
            onValueChange={(on) => void habitsReminder.setValue(on)}
          />
        </Card>

        <JannahDisclaimer textKey="sunnahHabits.disclaimer" />
      </Stagger>

      <HabitDetailSheet
        habitId={detailId}
        state={state}
        date={date}
        ctx={ctx}
        excusedReason={excused}
        onClose={() => setDetailId(null)}
        onRemove={removeHabit}
      />
      <ManageHabitsSheet
        visible={manageOpen}
        onClose={() => setManageOpen(false)}
        state={state}
        onRemove={removeHabit}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gapTop: { marginTop: Spacing.two },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  flex: { flex: 1, minWidth: 0 },
  principle: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  link: { minHeight: Control.sm, justifyContent: "center", paddingHorizontal: Spacing.one },
  todayHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  spotlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingEnd: Spacing.two,
  },
  spotlightBody: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    minHeight: Control.md,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/habits");
