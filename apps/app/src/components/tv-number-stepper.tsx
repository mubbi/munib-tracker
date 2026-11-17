import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";

type TvNumberStepperProps = {
  value: number;
  onChange: (next: number) => void;
  /** Accessible name of the quantity, e.g. "Current age". */
  label: string;
  min?: number;
  max?: number;
  /** Step sizes offered on each side, smallest first (e.g. `[1, 10, 100]`). */
  steps?: readonly number[];
  /** TV: take initial D-pad focus on the "+smallest" button. */
  preferredFocus?: boolean;
  /** Fill for the step buttons — defaults to the card color. */
  buttonBackground?: string;
};

/**
 * TV replacement for numeric `TextInput`s: a row of large D-pad targets
 * (−100 · −10 · −1 · value · +1 · +10 · +100) so counts and ages can be set
 * with Select alone — no on-screen keyboard and no long-press repeat needed.
 * Buttons stay focusable at the bounds (dimmed, no-op) so focus never drops
 * when a limit is reached.
 */
export function TvNumberStepper({
  value,
  onChange,
  label,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  steps = [1, 10],
  preferredFocus,
  buttonBackground,
}: TvNumberStepperProps) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const locale = i18n.language?.split("-")[0];
  const ordered = [...steps].sort((a, b) => a - b);
  const smallest = ordered[0];
  const background = buttonBackground ?? colors.card;

  const apply = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };

  const renderButton = (step: number, sign: 1 | -1) => {
    const atBound = sign < 0 ? value <= min : value >= max;
    const stepLabel = step.toLocaleString(locale);
    return (
      <PressableScale
        key={`${sign}-${step}`}
        accessibilityRole="button"
        accessibilityLabel={
          sign < 0
            ? tTv(t, "common.decrease", "common.decreaseByTv", { label, step: stepLabel })
            : tTv(t, "common.increase", "common.increaseByTv", { label, step: stepLabel })
        }
        accessibilityState={{ disabled: atBound }}
        scaleTo={0.92}
        onPress={() => apply(sign * step)}
        {...(preferredFocus && sign > 0 && step === smallest ? { hasTVPreferredFocus: true } : {})}
        style={[styles.button, { backgroundColor: background, opacity: atBound ? 0.4 : 1 }]}
      >
        <ThemedText type="smallBold" style={styles.buttonLabel}>
          {`${sign < 0 ? "−" : "+"}${stepLabel}`}
        </ThemedText>
      </PressableScale>
    );
  };

  return (
    <View style={styles.row}>
      {[...ordered].reverse().map((step) => renderButton(step, -1))}
      <View style={styles.valueWell} accessibilityLabel={`${label}: ${value}`}>
        <ThemedText type="header" style={styles.value}>
          {value.toLocaleString(locale)}
        </ThemedText>
      </View>
      {ordered.map((step) => renderButton(step, 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  button: {
    minWidth: TvLayout.minFocusTarget,
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  valueWell: {
    minWidth: TvLayout.minFocusTarget * 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  value: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
