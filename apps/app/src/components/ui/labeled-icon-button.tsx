import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Control, Radius, Spacing } from "@/constants/theme";
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
  accessibilityState?: { selected?: boolean; disabled?: boolean; busy?: boolean };
  haptic?: HapticFeedback | false;
  /** Optional filled well behind the icon + label. */
  background?: string;
  disabled?: boolean;
  /**
   * Swaps the glyph for a spinner, blocks presses and reports `busy` (e.g. while
   * a share image renders). Stays focusable — unlike `disabled`.
   */
  loading?: boolean;
  /** Label shown while `loading` (defaults to `label`). */
  loadingLabel?: string;
  /** Layout overrides — e.g. `flex: 1` / `minWidth: 0` in dense grids. */
  style?: StyleProp<ViewStyle>;
  /** TV: request initial D-pad focus on this control. */
  preferredFocus?: boolean;
};

/**
 * Icon with a short text label beneath — for actions where glyphs alone are
 * unclear. Label uses the `caption` type (12pt; TV ramp on TV), target ≥ 44pt.
 */
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
  preferredFocus,
}: LabeledIconButtonProps) {
  const tv = isTV();
  const resolvedIconSize = iconSize ?? (tv ? 24 : 18);
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ busy: loading, ...accessibilityState }}
      // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
      aria-busy={loading || undefined}
      // Loading is not `disabled`: a disabled web <button> loses focus.
      // PressableScale dims to `Opacity.disabled` and sets the a11y state.
      disabled={disabled}
      onPress={onPress ? () => (loading ? undefined : onPress()) : undefined}
      haptic={loading ? false : haptic}
      hitSlop={tv ? 8 : 4}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      rippleRadius={Radius.sm}
      style={[
        styles.base,
        tv && styles.baseTv,
        { borderRadius: Radius.sm },
        background ? { backgroundColor: background } : null,
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
        style={[styles.label, labelColor ? { color: labelColor } : undefined]}
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
    minWidth: Control.md,
    minHeight: Control.md,
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
    textAlign: "center",
    alignSelf: "stretch",
  },
  spinner: {
    // Match the glyph footprint so the label doesn't shift when toggling.
    transform: [{ scale: 0.8 }],
  },
});
