import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { habitTitle } from "@/components/sunnah-habits/habit-row";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { creditableAyahs } from "@/lib/quran-companion/reading-credit";
import type { PracticeSummary } from "@/lib/quran-companion/types";
import { resolveHabit } from "@/lib/sunnah-habits";
import { canOfferHabitDone } from "@/lib/sunnah-habits-ui";
import { useToast } from "@/providers/toast-provider";
import {
  sunnahHabitsStore,
  useEnsureSunnahHabitsLoaded,
  useSunnahHabits,
  useSunnahHabitsActions,
  useSunnahHabitsReady,
} from "@/stores/sunnah-habits-store";

/**
 * D74: "Mark habit done" on a practice summary when the take came from a Sunnah
 * habit's recite-along (`habit` route param), at least one ayah was credited and
 * today's habit isn't ticked yet. Pressing it ticks today's habit through the
 * habit store's normal action — it never ticks on its own. Hidden once ticked.
 */
export function PracticeHabitDoneButton({
  habitId,
  summary,
}: {
  habitId: string | undefined;
  summary: PracticeSummary;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  useEnsureSunnahHabitsLoaded();
  const ready = useSunnahHabitsReady();
  const state = useSunnahHabits();
  const actions = useSunnahHabitsActions();
  const today = getLocalDateString();
  const credited = creditableAyahs(summary).length;

  if (!ready || !habitId) return null;
  if (!canOfferHabitDone({ state, habitId, date: today, creditedAyahs: credited })) return null;
  const habit = resolveHabit(state, habitId);
  if (!habit) return null;
  const title = habitTitle(t, habit);

  const onPress = async () => {
    // Re-check against the latest data: `toggle` would untick a habit ticked meanwhile.
    const latest = sunnahHabitsStore.getState().data;
    if (!canOfferHabitDone({ state: latest, habitId, date: today, creditedAyahs: credited })) {
      return;
    }
    await actions.toggle(habitId, today);
    toast.success(t("practiceReadingCredit.habitDoneToast", { habit: title }));
  };

  return (
    <View style={styles.center}>
      <Button
        label={t("practiceReadingCredit.habitDone")}
        variant="secondary"
        size="sm"
        icon={{ ios: "checkmark.circle", android: "check_circle", web: "check_circle" }}
        accessibilityHint={t("practiceReadingCredit.habitDoneHint", { habit: title })}
        onPress={() => void onPress()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", marginTop: Spacing.three },
});
