import type { ExcusedReason, SunnahHabitsState } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ConsistencyDots } from "@/components/sunnah-habits/consistency-dots";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import {
  consistencyDots,
  type HabitContext,
  habitProgress,
  isQuranRecitationHabit,
  type ResolvedHabit,
} from "@/lib/sunnah-habits";
import {
  habitIcon,
  habitLinkHref,
  habitRecitePassage,
  habitSourceLabelKey,
} from "@/lib/sunnah-habits-ui";
import { useSunnahHabitsActions } from "@/stores/sunnah-habits-store";

type HabitRowProps = {
  state: SunnahHabitsState;
  habit: ResolvedHabit;
  date: string;
  ctx: HabitContext;
  /** Show the 30-day consistency dots (habits screen). */
  showDots?: boolean;
  /** Show the evidence refs line. */
  showEvidence?: boolean;
  excusedReason?: ExcusedReason | null;
  /** Soft highlight ("most consistent"). */
  highlight?: boolean;
};

const CHECKED = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
const UNCHECKED = {
  ios: "circle",
  android: "radio_button_unchecked",
  web: "radio_button_unchecked",
} as const;

export function habitTitle(t: (key: string) => string, habit: ResolvedHabit): string {
  return habit.custom?.title ?? t(`sunnahHabits.items.${habit.id}.title`);
}

/**
 * One habit on one day (NF-3.5). Yes/no habits toggle; count habits step;
 * linked habits show their derived state ("from Adhkar") and open the source.
 * Gentle copy only — there is no "missed" state, just today's progress.
 */
export function HabitRow({
  state,
  habit,
  date,
  ctx,
  showDots = false,
  showEvidence = false,
  excusedReason,
  highlight = false,
}: HabitRowProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const actions = useSunnahHabitsActions();
  const tv = isTV();
  const progress = habitProgress(state, habit, date, ctx);
  const title = habitTitle(t, habit);
  const def = habit.def;
  const isLinkedOnly = def?.kind === "linked";
  const link = def?.link;
  const showRecitationNote = excusedReason === "hayd" && isQuranRecitationHabit(habit.id);
  // Ayat al-Kursi / al-Mulk: recite along on this device (D68) until today's is ticked;
  // the take's summary offers "Mark habit done" (D74), never ticks it by itself.
  const recitePassage = progress.done ? null : habitRecitePassage(def);

  const subtitleParts = [
    def ? t(`sunnahHabits.items.${habit.id}.hint`) : null,
    progress.derivedFrom ? t(habitSourceLabelKey(progress.derivedFrom)) : null,
    habit.isCount || (isLinkedOnly && progress.target > 1)
      ? t("sunnahHabits.countProgress", {
          value: Math.min(progress.value, progress.target),
          target: progress.target,
        })
      : null,
  ].filter(Boolean);

  const toggle = () => void actions.toggle(habit.id, date);
  const open = link ? () => router.push(habitLinkHref(link)) : undefined;

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: highlight ? colors.accent : tokens.hairline,
          backgroundColor: highlight ? tokens.accentSoft : colors.card,
        },
      ]}
    >
      <View style={styles.row}>
        {isLinkedOnly || habit.isCount ? (
          <IconWell icon={habitIcon(habit.id)} size={16} well={32} radius={Radius.sm} />
        ) : (
          <PressableScale
            accessibilityRole="checkbox"
            accessibilityState={{ checked: progress.done }}
            accessibilityLabel={title}
            onPress={toggle}
            haptic="selection"
            scaleTo={0.94}
            style={tv ? styles.checkTv : null}
          >
            <SymbolView
              name={progress.done ? CHECKED : UNCHECKED}
              size={26}
              tintColor={progress.done ? tokens.status.success.color : colors.mutedForeground}
            />
          </PressableScale>
        )}
        <View style={styles.text}>
          <ThemedText type="smallBold">{title}</ThemedText>
          {subtitleParts.length ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitleParts.join(" · ")}
            </ThemedText>
          ) : null}
        </View>
        {habit.isCount && !isLinkedOnly ? (
          <Stepper
            value={progress.value}
            label={title}
            size="sm"
            onIncrement={() => void actions.setValue(habit.id, date, progress.value + 1)}
            onDecrement={() =>
              void actions.setValue(habit.id, date, Math.max(0, progress.value - 1))
            }
          />
        ) : isLinkedOnly ? (
          <SymbolView
            name={progress.done ? CHECKED : UNCHECKED}
            size={22}
            tintColor={progress.done ? tokens.status.success.color : colors.mutedForeground}
            accessibilityLabel={
              progress.done ? t("sunnahHabits.doneA11y") : t("sunnahHabits.notYetA11y")
            }
          />
        ) : null}
        {open ? (
          <PressableScale
            accessibilityRole="link"
            accessibilityLabel={t("sunnahHabits.openA11y", { title })}
            onPress={open}
            haptic="light"
            style={[styles.open, tv ? styles.openTv : null]}
          >
            <AppIcon icon={chevronForward} size={16} tintColor={colors.accent} />
          </PressableScale>
        ) : null}
      </View>
      {recitePassage ? (
        <ReciteAlongButton
          passage={recitePassage}
          habitId={habit.id}
          size="sm"
          variant="ghost"
          style={styles.recite}
        />
      ) : null}
      {showEvidence && def ? <EvidenceLine refs={def.refs} /> : null}
      {showDots ? (
        <ConsistencyDots dots={consistencyDots(state, habit, date, ctx)} label={title} />
      ) : null}
      {showRecitationNote ? <MadhhabNote id="hayd.quranRecitation" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two,
    gap: Spacing.one,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  text: { flex: 1, minWidth: 0, gap: 2 },
  open: { padding: Spacing.one },
  recite: { alignSelf: "flex-start" },
  openTv: { minHeight: TvLayout.minFocusTarget, justifyContent: "center" },
  checkTv: { minHeight: TvLayout.minFocusTarget, justifyContent: "center" },
});
