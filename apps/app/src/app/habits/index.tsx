import {
  DEFAULT_SUNNAH_HABIT_SELECTION,
  getSunnahHabit,
  SUNNAH_HABITS,
  SUNNAH_HABITS_PRINCIPLE_REF,
} from "@munib-tracker/shared/content/sunnah-habits";
import { SUNNAH_HABITS_MAX_SELECTED, type SunnahHabitsState } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ToggleRow } from "@/components/seasonal/toggle-row";
import { Seo } from "@/components/seo/seo";
import { HabitRow, habitTitle } from "@/components/sunnah-habits/habit-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Stepper } from "@/components/ui/stepper";
import { TextField } from "@/components/ui/text-field";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Radius, Spacing } from "@/constants/theme";
import { useHabitContext } from "@/hooks/use-habit-context";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import {
  CUSTOM_TITLE_MAX,
  canAddHabit,
  dayProgressSummary,
  mostConsistentHabit,
  pickSpotlight,
  resolveHabit,
  selectedHabits,
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

const UP = { ios: "chevron.up", android: "expand_less", web: "expand_less" } as const;
const DOWN = { ios: "chevron.down", android: "expand_more", web: "expand_more" } as const;
const REMOVE = {
  ios: "minus.circle",
  android: "remove_circle_outline",
  web: "remove_circle_outline",
} as const;
const ADD = { ios: "plus.circle.fill", android: "add_circle", web: "add_circle" } as const;

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

export default function SunnahHabitsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureSunnahHabitsLoaded();
  const ready = useSunnahHabitsReady();
  const state = useSunnahHabits();
  const actions = useSunnahHabitsActions();
  const ctx = useHabitContext();
  const date = useTrackerDate();
  const excused = useDayExcused();
  const habitsReminder = useSetting<boolean>("notifications.sunnah.habits");
  const [editing, setEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const undoToast = useUndoToast();
  const tv = isTV();

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

  const habits = selectedHabits(state);
  const summary = dayProgressSummary(state, date, ctx);
  const best = useMemo(() => mostConsistentHabit(state, date, ctx), [state, date, ctx]);
  const spotlightId = ready ? pickSpotlight(state, date) : null;
  const spotlight = spotlightId ? getSunnahHabit(spotlightId) : undefined;
  const isNew = ready && habits.length === 0 && !state.listUpdatedAt;
  const unselected = SUNNAH_HABITS.filter((h) => !state.selected.includes(h.id));

  // Record the spotlight once per day so it rotates and respects the 14-day cooldown.
  useEffect(() => {
    if (spotlightId && state.spotlightSeen[spotlightId] !== date) {
      void actions.markSpotlightSeen(spotlightId, date);
    }
  }, [actions, date, spotlightId, state.spotlightSeen]);

  const addCustom = () => {
    const title = customTitle.trim();
    if (!title) return;
    void actions.addCustom(title);
    setCustomTitle("");
  };

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
        <JannahCallout tone="accent">{t("sunnahHabits.principle")}</JannahCallout>
        <EvidenceLine refs={[SUNNAH_HABITS_PRINCIPLE_REF]} />

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

        {habits.length > 0 ? (
          <Card>
            <SectionHeader
              title={t("sunnahHabits.today")}
              icon={SUNNAH_HABITS_ICON}
              badge={
                <Pill
                  label={t("tracker.sectionProgress", {
                    completed: summary.done,
                    total: summary.total,
                  })}
                  compact
                />
              }
            />
            {best ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
                {t("sunnahHabits.mostConsistent", {
                  title: habitTitle(
                    t,
                    resolveHabit(state, best.id) ?? { id: best.id, target: 1, isCount: false },
                  ),
                  days: best.days,
                })}
              </ThemedText>
            ) : null}
            <View style={styles.rows}>
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  state={state}
                  habit={habit}
                  date={date}
                  ctx={ctx}
                  showDots
                  showEvidence
                  excusedReason={excused}
                  highlight={best?.id === habit.id}
                />
              ))}
            </View>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
              {t("sunnahHabits.dotsHint")}
            </ThemedText>
          </Card>
        ) : null}

        {spotlight ? (
          <Card>
            <SectionHeader
              title={t("sunnahHabits.spotlightTitle")}
              icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            />
            <View style={[styles.spotlight, styles.gapTop]}>
              <IconWell icon={habitIcon(spotlight.id)} size={18} well={40} radius={Radius.md} />
              <View style={styles.flex}>
                <ThemedText type="smallBold">
                  {t(`sunnahHabits.items.${spotlight.id}.title`)}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(`sunnahHabits.items.${spotlight.id}.hint`)}
                </ThemedText>
                <EvidenceLine refs={spotlight.refs} />
              </View>
            </View>
            <View style={styles.gapTop}>
              <Button
                label={t("sunnahHabits.addToMine")}
                variant="secondary"
                disabled={!canAddHabit(state)}
                onPress={() => void actions.add(spotlight.id)}
                fullWidth
              />
            </View>
          </Card>
        ) : null}

        <Card>
          <SectionHeader
            title={t("sunnahHabits.manageTitle")}
            subtitle={t("sunnahHabits.manageSubtitle", { max: SUNNAH_HABITS_MAX_SELECTED })}
            icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
            actionLabel={editing ? t("sunnahHabits.doneEditing") : t("sunnahHabits.edit")}
            onActionPress={() => setEditing((v) => !v)}
          />
          {editing ? (
            <View style={styles.rows}>
              {habits.map((habit, index) => (
                <View key={habit.id} style={styles.editRow}>
                  <ThemedText type="small" style={styles.flex} numberOfLines={2}>
                    {habitTitle(t, habit)}
                  </ThemedText>
                  {habit.def?.userTarget ? (
                    <Stepper
                      value={habit.target}
                      min={1}
                      size="sm"
                      label={t("sunnahHabits.targetA11y", { title: habitTitle(t, habit) })}
                      onIncrement={() => void actions.setTarget(habit.id, habit.target + 1)}
                      onDecrement={() =>
                        void actions.setTarget(habit.id, Math.max(1, habit.target - 1))
                      }
                    />
                  ) : null}
                  <IconButton
                    name={UP}
                    disabled={index === 0}
                    accessibilityLabel={t("sunnahHabits.moveUp", { title: habitTitle(t, habit) })}
                    onPress={() => void actions.move(habit.id, -1)}
                  />
                  <IconButton
                    name={DOWN}
                    disabled={index === habits.length - 1}
                    accessibilityLabel={t("sunnahHabits.moveDown", { title: habitTitle(t, habit) })}
                    onPress={() => void actions.move(habit.id, 1)}
                  />
                  <IconButton
                    name={REMOVE}
                    tintColor={tokens.status.danger.color}
                    accessibilityLabel={t("sunnahHabits.remove", { title: habitTitle(t, habit) })}
                    onPress={() => removeHabit(habit.id, habitTitle(t, habit))}
                  />
                </View>
              ))}
              {unselected.length > 0 ? (
                <ThemedText type="smallBold" style={styles.gapTop}>
                  {t("sunnahHabits.catalogTitle")}
                </ThemedText>
              ) : null}
              {unselected.map((habit) => (
                <View key={habit.id} style={styles.editRow}>
                  <IconWell icon={habitIcon(habit.id)} size={14} well={28} radius={Radius.sm} />
                  <ThemedText type="small" style={styles.flex} numberOfLines={2}>
                    {t(`sunnahHabits.items.${habit.id}.title`)}
                  </ThemedText>
                  <IconButton
                    name={ADD}
                    tintColor={colors.accent}
                    disabled={!canAddHabit(state)}
                    accessibilityLabel={t("sunnahHabits.add", {
                      title: t(`sunnahHabits.items.${habit.id}.title`),
                    })}
                    onPress={() => void actions.add(habit.id)}
                  />
                </View>
              ))}
              {/* TV: no free-text entry (D-pad keyboards); catalog habits only. */}
              {!tv ? (
                <View style={[styles.editRow, styles.customRow, styles.gapTop]}>
                  <TextField
                    label={t("sunnahHabits.customLabel")}
                    value={customTitle}
                    onChangeText={setCustomTitle}
                    maxLength={CUSTOM_TITLE_MAX}
                    placeholder={t("sunnahHabits.customPlaceholder")}
                    onSubmitEditing={addCustom}
                    returnKeyType="done"
                    style={styles.input}
                  />
                  <Button
                    label={t("sunnahHabits.customAdd")}
                    size="sm"
                    disabled={!customTitle.trim() || !canAddHabit(state)}
                    onPress={addCustom}
                  />
                </View>
              ) : null}
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("sunnahHabits.customHint")}
              </ThemedText>
            </View>
          ) : null}
        </Card>

        <Card>
          <SectionHeader
            title={t("sunnahHabits.reminderSection")}
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
          />
          <View style={styles.gapTop}>
            <ToggleRow
              title={t("sunnahHabits.reminderToggle")}
              subtitle={t("sunnahHabits.reminderToggleHint")}
              value={habitsReminder.value}
              onValueChange={(on) => void habitsReminder.setValue(on)}
            />
          </View>
        </Card>

        <JannahDisclaimer textKey="sunnahHabits.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gapTop: { marginTop: Spacing.two },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  spotlight: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  flex: { flex: 1, minWidth: 0 },
  editRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  customRow: { alignItems: "flex-end" },
  input: {
    flex: 1,
    minWidth: 0,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/habits");
