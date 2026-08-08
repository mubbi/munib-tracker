import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import type { HapticFeedback } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

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
  /** Swaps the glyph for a spinner and blocks presses (e.g. while a share image renders). */
  loading?: boolean;
  /** Label shown while `loading` (defaults to `label`). */
  loadingLabel?: string;
  /** Layout overrides — e.g. `flex: 1` / `minWidth: 0` in dense grids. */
  style?: StyleProp<ViewStyle>;
};

/** Icon with a short text label beneath — for actions where glyphs alone are unclear. */
export function LabeledIconButton({
  name,
  label,
  onPress,
  iconSize,
  tintColor,
  labelColor,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  haptic = "light",
  background,
  disabled,
  loading = false,
  loadingLabel,
  style,
}: LabeledIconButtonProps) {
  const tv = isTV();
  const resolvedIconSize = iconSize ?? (tv ? 24 : 18);
  const isDisabled = disabled || loading;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading, ...accessibilityState }}
      disabled={isDisabled}
      onPress={loading ? undefined : onPress}
      haptic={haptic}
      hitSlop={tv ? 8 : 4}
      rippleRadius={Radius.sm}
      style={[
        styles.base,
        tv && styles.baseTv,
        { borderRadius: Radius.sm },
        background ? { backgroundColor: background } : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      <View style={[styles.glyphBox, { width: resolvedIconSize, height: resolvedIconSize }]}>
        {loading ? (
          <ActivityIndicator size="small" color={tintColor} style={styles.spinner} />
        ) : (
          <SymbolView name={name} size={resolvedIconSize} tintColor={tintColor} />
        )}
      </View>
      <ThemedText
        type="caption"
        numberOfLines={1}
        style={[styles.label, tv && styles.labelTv, labelColor ? { color: labelColor } : undefined]}
        themeColor={labelColor ? undefined : "mutedForeground"}
      >
        {loading ? (loadingLabel ?? label) : label}
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
  baseTv: {
    minWidth: TvLayout.minFocusTarget,
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  glyphBox: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: "center",
    alignSelf: "stretch",
  },
  labelTv: {
    fontSize: 13,
    lineHeight: 16,
  },
  spinner: {
    // Match the glyph footprint so the label doesn't shift when toggling.
    transform: [{ scale: 0.8 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
