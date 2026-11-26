import type { ExcusedReason, SunnahHabitsState } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ThemedText } from "@/components/themed-text";
import { ChecklistRow } from "@/components/tracker/checklist-row";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stepper } from "@/components/ui/stepper";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import {
  type HabitContext,
  type HabitDayProgress,
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
  excusedReason?: ExcusedReason | null;
  /**
   * Habits screen: the row body opens the habit's detail sheet and the trailing
   * circle ticks it (a sibling, never nested). Without it (home card, Tracker)
   * the whole row ticks a yes/no habit and shows its hint.
   */
  onOpenDetail?: () => void;
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

/** How a habit is kept on a day: ticked by hand, stepped, or only derived from its source. */
export type HabitControl = "tick" | "step" | "derived";

export function habitControl(habit: ResolvedHabit): HabitControl {
  const def = habit.def;
  if (def?.kind === "linked") return def.manualTick ? "tick" : "derived";
  return habit.isCount ? "step" : "tick";
}

/**
 * Short progress line: "from tasbeeh · 27/100", "7/10", "from adhkar" — never
 * evidence or history (those live in the habit's detail sheet).
 */
export function habitProgressLine(t: TFunction, progress: HabitDayProgress): string | undefined {
  const parts = [
    progress.derivedFrom ? t(habitSourceLabelKey(progress.derivedFrom)) : null,
    progress.target > 1
      ? t("sunnahHabits.countProgress", {
          value: Math.min(progress.value, progress.target),
          target: progress.target,
        })
      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

/**
 * One habit on one day (NF-3.5). Yes/no habits (and tickable linked ones like
 * salawat) tick; custom count habits step; linked habits show their derived
 * state ("from adhkar") and open the source. Gentle copy only — there is no
 * "missed" state, just today's progress.
 */
export function HabitRow({ state, habit, date, ctx, excusedReason, onOpenDetail }: HabitRowProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const actions = useSunnahHabitsActions();
  const tv = isTV();
  const progress = habitProgress(state, habit, date, ctx);
  const title = habitTitle(t, habit);
  const def = habit.def;
  const control = habitControl(habit);
  const link = def?.link;
  const showRecitationNote = excusedReason === "hayd" && isQuranRecitationHabit(habit.id);
  // Ayat al-Kursi / al-Mulk: recite along on this device (D68) until today's is ticked;
  // the take's summary offers "Mark habit done" (D74), never ticks it by itself.
  const recitePassage = progress.done ? null : habitRecitePassage(def);
  // Done through its source (the tasbeeh reached the target): the tick is not the user's to undo.
  const doneBySource = progress.done && control === "tick" && !!def?.source && !progress.ticked;
  const canTick = control === "tick" && !doneBySource;

  const toggle = () => void actions.toggle(habit.id, date);
  const open = link ? () => router.push(habitLinkHref(link)) : undefined;
  const progressLine = habitProgressLine(t, progress);
  const hitTarget = tv ? TvLayout.minFocusTargetDp : undefined;
  const openButton = open ? (
    <IconButton
      name={chevronForward}
      size={IconSize.md}
      tintColor={tokens.accentOnSoft}
      accessibilityLabel={t("sunnahHabits.openA11y", { title })}
      onPress={open}
      haptic="light"
      hitTarget={hitTarget}
    />
  ) : null;
  const stepper =
    control === "step" ? (
      <Stepper
        value={progress.value}
        label={title}
        size="sm"
        onIncrement={() => void actions.setValue(habit.id, date, progress.value + 1)}
        onDecrement={() => void actions.setValue(habit.id, date, Math.max(0, progress.value - 1))}
      />
    ) : null;
  const doneGlyph = (
    <SymbolView
      name={progress.done ? CHECKED : UNCHECKED}
      size={IconSize.lg + 2}
      tintColor={progress.done ? tokens.status.success.color : colors.mutedForeground}
      accessibilityLabel={progress.done ? t("sunnahHabits.doneA11y") : t("sunnahHabits.notYetA11y")}
    />
  );

  if (onOpenDetail) {
    // Habits screen: a calm checklist line — body opens the detail sheet, the circle ticks.
    const tickButton = canTick ? (
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: progress.done }}
        aria-checked={progress.done}
        accessibilityLabel={title}
        accessibilityHint={progressLine}
        onPress={toggle}
        haptic={progress.done ? "selection" : "success"}
        scaleTo={0.92}
        style={styles.tick}
      >
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <SymbolView
            name={progress.done ? CHECKED : UNCHECKED}
            size={IconSize.lg + 4}
            tintColor={progress.done ? tokens.status.success.color : colors.mutedForeground}
          />
        </View>
      </PressableScale>
    ) : null;
    const trailing =
      stepper ??
      tickButton ??
      (progress.done ? <View style={styles.tick}>{doneGlyph}</View> : (openButton ?? doneGlyph));
    return (
      <View
        style={[
          styles.screenRow,
          {
            backgroundColor: progress.done ? colors.muted : colors.card,
            borderColor: tokens.hairline,
          },
        ]}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("sunnahHabits.detailA11y", { title })}
          accessibilityHint={progressLine}
          onPress={onOpenDetail}
          haptic="selection"
          scaleTo={0.98}
          style={styles.screenBody}
        >
          <IconWell
            icon={habitIcon(habit.id)}
            size={IconSize.sm + 2}
            well={30}
            radius={Radius.sm}
            {...(progress.done && {
              tint: colors.mutedForeground,
              background: tokens.hairline,
            })}
          />
          <View style={styles.text}>
            <ThemedText
              type="smallBold"
              numberOfLines={2}
              themeColor={progress.done ? "mutedForeground" : undefined}
            >
              {title}
            </ThemedText>
            {progressLine ? (
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {progressLine}
              </ThemedText>
            ) : null}
          </View>
        </PressableScale>
        {trailing}
      </View>
    );
  }

  const sectionSubtitle =
    [def ? t(`sunnahHabits.items.${habit.id}.hint`) : null, progressLine]
      .filter(Boolean)
      .join(" · ") || undefined;

  return (
    <View style={[styles.card, { borderColor: tokens.hairline, backgroundColor: colors.card }]}>
      {canTick ? (
        // P5-08: the whole row toggles a yes/no habit (one `checkbox`, B-79).
        <ChecklistRow
          checked={progress.done}
          onToggle={toggle}
          title={title}
          subtitle={sectionSubtitle}
          trailing={openButton}
        />
      ) : (
        <View style={styles.row}>
          <IconWell icon={habitIcon(habit.id)} size={IconSize.md} well={32} radius={Radius.sm} />
          <View style={styles.text}>
            <ThemedText type="smallBold">{title}</ThemedText>
            {sectionSubtitle ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {sectionSubtitle}
              </ThemedText>
            ) : null}
          </View>
          {stepper ?? doneGlyph}
          {openButton}
        </View>
      )}
      {recitePassage ? (
        <ReciteAlongButton
          passage={recitePassage}
          habitId={habit.id}
          size="sm"
          variant="ghost"
          style={styles.recite}
        />
      ) : null}
      {showRecitationNote ? <MadhhabNote id="hayd.quranRecitation" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two,
    gap: Spacing.one,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  text: { flex: 1, minWidth: 0, gap: Spacing.half },
  recite: { alignSelf: "flex-start" },
  screenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingEnd: Spacing.one,
  },
  screenBody: {
    flex: 1,
    minWidth: 0,
    minHeight: Control.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingStart: Spacing.two,
  },
  tick: {
    minWidth: Control.md,
    minHeight: Control.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
