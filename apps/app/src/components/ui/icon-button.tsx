import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

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
  style,
}: IconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      disabled={disabled}
      onPress={onPress}
      haptic={haptic}
      hitSlop={8}
      style={[
        styles.base,
        { minWidth: hitTarget, minHeight: hitTarget, opacity: disabled ? 0.4 : 1 },
        background ? { backgroundColor: background, borderRadius: Radius.md } : null,
        style,
      ]}
    >
      <View style={styles.glyph}>
        <SymbolView name={name} size={size} tintColor={tintColor} />
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
