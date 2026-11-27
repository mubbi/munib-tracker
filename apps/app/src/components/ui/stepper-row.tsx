import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Stepper } from "@/components/ui/stepper";
import { Opacity, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

type StepperRowProps = {
  title: string;
  subtitle?: string;
  /** Inline node after the title (e.g. a "New" badge or info button). */
  accessory?: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Display + spoken text for the value, e.g. `(m) => "+5 min"`. */
  format: (value: number) => string;
  onChange: (value: number) => void;
  disabled?: boolean;
};

/**
 * Title / subtitle + bounded `Stepper` on a muted block (§4.5.5) — masjid
 * offsets, reminder timing, bedtime minutes, Hijri offset, tasbeeh appearance.
 * Accessibility comes from `Stepper`: one `adjustable` element named `title`
 * with `{ min, max, now, text }` on iOS / Android; on TV a bound is dimmed,
 * never disabled, so D-pad focus never drops.
 */
export function StepperRow({
  title,
  subtitle,
  accessory,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled = false,
}: StepperRowProps) {
  const { colors } = useThemeTokens();
  const tv = isTV();

  return (
    <View
      style={[
        styles.block,
        tv && styles.blockTv,
        { backgroundColor: colors.muted },
        disabled && styles.locked,
      ]}
    >
      <View style={styles.line}>
        <View style={[styles.copy, disabled && styles.dimmed]}>
          <View style={styles.titleLine}>
            <ThemedText type="small" style={styles.title}>
              {title}
            </ThemedText>
            {accessory}
          </View>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <View style={styles.control}>
          <Stepper
            value={value}
            label={title}
            min={min}
            max={max}
            step={step}
            formatValue={format}
            onChange={onChange}
            disabled={disabled}
            valueMinWidth={tv ? styles.valueTv.minWidth : styles.value.minWidth}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  blockTv: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  /**
   * Wraps on narrow rows: when the copy (≥ 55% so the title + badge stay on one
   * line) and the stepper can't share a line, the stepper drops below and stays
   * on the trailing edge instead of squeezing the title or clipping its value.
   */
  line: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: Spacing.three,
    rowGap: Spacing.two,
  },
  copy: { flexGrow: 1, flexShrink: 1, flexBasis: 0, gap: Spacing.half, minWidth: "55%" },
  titleLine: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  title: { flexShrink: 1 },
  control: { flexShrink: 0, marginStart: "auto" },
  value: { minWidth: tvDp(72) },
  valueTv: { minWidth: tvDp(140) },
  dimmed: { opacity: Opacity.disabled },
  // A disabled row ignores touches entirely (the stepper dims itself).
  locked: { pointerEvents: "none" },
});
