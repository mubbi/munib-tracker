import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

type TrackerRowProps = {
  label: string;
  sublabel?: string;
  icon?: SymbolViewProps["name"];
  time?: string;
  completed?: boolean;
  onPress?: () => void;
};

export function TrackerRow({
  label,
  sublabel,
  icon,
  time,
  completed = false,
  onPress,
}: TrackerRowProps) {
  const { colors, tokens } = useThemeTokens();
  const done = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    done.value = withSpring(completed ? 1 : 0, Springs.pop);
  }, [completed, done]);

  const handlePress = () => {
    // Completing an act of worship earns a success cue; un-checking is a light tick.
    triggerHaptic(completed ? "light" : "success");
    onPress?.();
  };

  // Completed tint + accent border fade up as an overlay (avoids color interpolation).
  const highlightStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, done.value) }));
  // The accent circle pops in behind the checkmark.
  const fillStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, done.value),
    transform: [{ scale: done.value }],
  }));
  // Checkmark scales in from small.
  const checkStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, done.value),
    transform: [{ scale: 0.4 + done.value * 0.6 }],
  }));

  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      accessibilityLabel={label}
      onPress={handlePress}
      scaleTo={0.98}
      style={[
        styles.row,
        { backgroundColor: colors.card, borderColor: tokens.hairline },
        Shadows.sm,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.highlight,
          { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
          highlightStyle,
        ]}
      />

      {icon ? (
        <View style={[styles.iconWell, { backgroundColor: tokens.track }]}>
          <SymbolView name={icon} size={17} tintColor={colors.accent} />
        </View>
      ) : null}

      <View style={styles.labelWrap}>
        <ThemedText type="default" style={{ fontWeight: "600" }}>
          {label}
        </ThemedText>
        {sublabel ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {sublabel}
          </ThemedText>
        ) : null}
      </View>

      {time ? (
        <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.time}>
          {time}
        </ThemedText>
      ) : null}

      <View style={[styles.status, { borderColor: colors.border }]}>
        <Animated.View style={[styles.statusFill, { backgroundColor: colors.accent }, fillStyle]} />
        <Animated.View style={checkStyle}>
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={13}
            tintColor={colors.accentForeground}
          />
        </Animated.View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrap: {
    flex: 1,
    gap: 2,
  },
  time: {
    marginRight: Spacing.one,
  },
  status: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    overflow: "hidden",
  },
  statusFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.pill,
  },
});
