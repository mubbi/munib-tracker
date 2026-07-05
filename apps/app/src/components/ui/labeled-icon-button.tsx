import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import type { HapticFeedback } from "@/lib/haptics";

type LabeledIconButtonProps = {
  name: SymbolViewProps["name"];
  /** Short caption shown under the glyph (e.g. "Play", "Save"). */
  label: string;
  onPress?: () => void;
  iconSize?: number;
  tintColor?: string;
  labelColor?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  haptic?: HapticFeedback | false;
  /** Optional filled well behind the icon + label. */
  background?: string;
  disabled?: boolean;
};

/** Icon with a short text label beneath — for actions where glyphs alone are unclear. */
export function LabeledIconButton({
  name,
  label,
  onPress,
  iconSize = 18,
  tintColor,
  labelColor,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  haptic = "light",
  background,
  disabled,
}: LabeledIconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      disabled={disabled}
      onPress={onPress}
      haptic={haptic}
      hitSlop={4}
      style={[
        styles.base,
        background ? { backgroundColor: background, borderRadius: Radius.sm } : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <SymbolView name={name} size={iconSize} tintColor={tintColor} />
      <ThemedText
        type="caption"
        numberOfLines={1}
        style={[styles.label, labelColor ? { color: labelColor } : undefined]}
        themeColor={labelColor ? undefined : "mutedForeground"}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: Spacing.one,
    gap: Spacing.half,
    borderCurve: "continuous",
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});
