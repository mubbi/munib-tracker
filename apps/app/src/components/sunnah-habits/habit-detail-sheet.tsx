import type { ExcusedReason, SunnahHabitsState } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ConsistencyDots } from "@/components/sunnah-habits/consistency-dots";
import { habitProgressLine, habitTitle } from "@/components/sunnah-habits/habit-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import {
  canAddHabit,
  consistencyDots,
  type HabitContext,
  habitProgress,
  isQuranRecitationHabit,
  resolveHabit,
} from "@/lib/sunnah-habits";
import { habitIcon, habitLinkHref, habitRecitePassage } from "@/lib/sunnah-habits-ui";
import { useSunnahHabitsActions } from "@/stores/sunnah-habits-store";

type HabitDetailSheetProps = {
  /** Habit shown (selected or a catalog preview from the spotlight); `null` closes the sheet. */
  habitId: string | null;
  state: SunnahHabitsState;
  date: string;
  ctx: HabitContext;
  excusedReason?: ExcusedReason | null;
  onClose: () => void;
  /** Remove from the list (the caller offers Undo). */
  onRemove: (id: string, title: string) => void;
};

/**
 * One habit's details (habits screen): hint, evidence, the last 30 days, its
 * Open action, the daily target for user-tuned habits (salawat) and Remove.
 * A catalog habit not on the list (spotlight) shows Add instead of Remove.
 */
export function HabitDetailSheet({
  habitId,
  state,
  date,
  ctx,
  excusedReason,
  onClose,
  onRemove,
}: HabitDetailSheetProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const actions = useSunnahHabitsActions();
  const habit = habitId ? resolveHabit(state, habitId) : null;
  const visible = habit != null;
  const title = habit ? habitTitle(t, habit) : "";
  const def = habit?.def;
  const selected = habit ? state.selected.includes(habit.id) : false;
  const progress = habit ? habitProgress(state, habit, date, ctx) : null;
  const recitePassage = progress && !progress.done ? habitRecitePassage(def) : null;
  const link = def?.link;
  const showRecitationNote =
    excusedReason === "hayd" && habit != null && isQuranRecitationHabit(habit.id);

  const statusParts = progress
    ? [
        progress.done ? t("sunnahHabits.doneA11y") : t("sunnahHabits.notYetA11y"),
        habitProgressLine(t, progress),
      ].filter(Boolean)
    : [];

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" title={title} solid>
      {habit && progress ? (
        <View style={styles.body}>
          <View style={styles.head}>
            <IconWell icon={habitIcon(habit.id)} size={18} well={40} radius={Radius.md} />
            <View style={styles.flex}>
              {def ? (
                <ThemedText type="small">{t(`sunnahHabits.items.${habit.id}.hint`)}</ThemedText>
              ) : null}
              {selected ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {statusParts.join(" · ")}
                </ThemedText>
              ) : null}
            </View>
          </View>

          {def ? <EvidenceLine refs={def.refs} /> : null}

          {selected ? (
            <View>
              <ThemedText type="smallBold">{t("sunnahHabits.detail.history")}</ThemedText>
              <ConsistencyDots dots={consistencyDots(state, habit, date, ctx)} label={title} />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
                {t("sunnahHabits.dotsHint")}
              </ThemedText>
            </View>
          ) : null}

          {selected && def?.userTarget ? (
            <View style={styles.targetRow}>
              <ThemedText type="small" style={styles.flex}>
                {t("sunnahHabits.detail.target")}
              </ThemedText>
              <Stepper
                value={habit.target}
                min={1}
                size="sm"
                label={t("sunnahHabits.targetA11y", { title })}
                onIncrement={() => void actions.setTarget(habit.id, habit.target + 1)}
                onDecrement={() => void actions.setTarget(habit.id, Math.max(1, habit.target - 1))}
              />
            </View>
          ) : null}

          {showRecitationNote ? <MadhhabNote id="hayd.quranRecitation" /> : null}

          <View style={styles.actions}>
            {recitePassage && selected ? (
              <ReciteAlongButton passage={recitePassage} habitId={habit.id} variant="secondary" />
            ) : null}
            {link ? (
              <Button
                label={t("sunnahHabits.detail.open")}
                variant="secondary"
                fullWidth
                onPress={() => {
                  onClose();
                  router.push(habitLinkHref(link));
                }}
              />
            ) : null}
            {selected ? (
              <Button
                label={t("sunnahHabits.detail.remove")}
                variant="ghost"
                fullWidth
                onPress={() => {
                  onClose();
                  onRemove(habit.id, title);
                }}
              />
            ) : (
              <Button
                label={t("sunnahHabits.addToMine")}
                fullWidth
                disabled={!canAddHabit(state)}
                onPress={() => {
                  void actions.add(habit.id);
                  onClose();
                }}
              />
            )}
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three },
  head: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  flex: { flex: 1, minWidth: 0, gap: Spacing.half },
  gapTop: { marginTop: Spacing.one },
  targetRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  actions: { gap: Spacing.two },
});
