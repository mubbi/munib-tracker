import { GlassView } from "expo-glass-effect";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { hasLiquidGlass } from "@/components/ui/glass-surface";
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
  /**
   * Render the button as an interactive Liquid Glass well on iOS 26+
   * (per the building-native-ui glass guide). Falls back to `background`
   * elsewhere, so older iOS / Android / web keep the tinted well.
   */
  glass?: boolean;
  /** Corner radius of the glass/background well (defaults to a rounded square). */
  wellRadius?: number;
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
  glass = false,
  wellRadius = Radius.md,
  disabled,
  loading = false,
  style,
}: IconButtonProps) {
  const isDisabled = disabled || loading;
  const useGlass = glass && hasLiquidGlass;

  const button = (
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
      rippleBorderless={!background && !useGlass}
      style={[
        styles.base,
        { minWidth: hitTarget, minHeight: hitTarget, opacity: disabled ? 0.4 : 1 },
        // The glass wrapper supplies the well; only paint a solid background
        // when we're not rendering Liquid Glass.
        !useGlass && background ? { backgroundColor: background, borderRadius: wellRadius } : null,
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

  if (useGlass) {
    return (
      <GlassView
        isInteractive
        glassEffectStyle="regular"
        style={[styles.glassWell, { borderRadius: wellRadius, opacity: disabled ? 0.4 : 1 }]}
      >
        {button}
      </GlassView>
    );
  }

  return button;
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
  glassWell: {
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
