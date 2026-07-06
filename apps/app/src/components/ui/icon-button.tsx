import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius } from "@/constants/theme";
import type { HapticFeedback } from "@/lib/haptics";

type IconButtonProps = {
  name: SymbolViewProps["name"];
  onPress?: () => void;
  /** Glyph size in points. The tap target stays >= `hitTarget` regardless. */
  size?: number;
  tintColor?: string;
  /** Required so every icon-only control is named for assistive tech. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  haptic?: HapticFeedback | false;
  /** Minimum square tap area (defaults to the 44pt WCAG/HIG minimum). */
  hitTarget?: number;
  /** Optional filled/tinted background well behind the glyph. */
  background?: string;
  disabled?: boolean;
  /** Swaps the glyph for a spinner and blocks presses (e.g. while a share image renders). */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A glyph-only button that always presents at least a `hitTarget` (44pt) square
 * touch area even when the icon is small, closing the systemic sub-44 gaps that
 * bare `SymbolView` + `PressableScale` call sites left open. Centralises the
 * accessibility role/label/state so icon controls are consistent app-wide.
 */
export function IconButton({
  name,
  onPress,
  size = 20,
  tintColor,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  haptic = "light",
  hitTarget = 44,
  background,
  disabled,
  loading = false,
  style,
}: IconButtonProps) {
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
      hitSlop={8}
      // A bare glyph reads best with a circular (borderless) Android ripple; a
      // filled well clips a bounded ripple to its rounded square.
      rippleBorderless={!background}
      style={[
        styles.base,
        { minWidth: hitTarget, minHeight: hitTarget, opacity: disabled ? 0.4 : 1 },
        background ? { backgroundColor: background, borderRadius: Radius.md } : null,
        style,
      ]}
    >
      <View style={styles.glyph}>
        {loading ? (
          <ActivityIndicator size="small" color={tintColor} />
        ) : (
          <SymbolView name={name} size={size} tintColor={tintColor} />
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  glyph: {
    pointerEvents: "none",
  },
});
