import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";

import { IconButton } from "@/components/ui/icon-button";
import { Radius, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type VoiceInputSize = "sm" | "md";

/** Compact circular equalizer — sample VoiceRainbowVisualizer math, solid accent. */
const SIZE_PRESETS: Record<
  VoiceInputSize,
  {
    barCount: number;
    barWidth: number;
    barBase: number;
    barExtra: number;
    ringGap: number;
    discSize: number;
    iconSize: number;
  }
> = {
  sm: {
    barCount: 20,
    barWidth: 2,
    barBase: 2.5,
    barExtra: 8,
    ringGap: 3,
    discSize: 28,
    iconSize: 16,
  },
  md: {
    barCount: 28,
    barWidth: 2.75,
    barBase: 4,
    barExtra: 16,
    ringGap: 6,
    discSize: 36,
    iconSize: 18,
  },
};

function frac(x: number): number {
  return x - Math.floor(x);
}

/** Deterministic per-bar onset/gain so one loudness value draws a jagged beat. */
function barProfile(i: number): { onset: number; gain: number } {
  const a = frac(Math.sin(i * 12.9898) * 43758.5453);
  const b = frac(Math.sin(i * 78.233) * 12345.6789);
  return { onset: a * 0.18, gain: 0.85 + b * 1.25 };
}

function EqualizerBar({
  index,
  angleDeg,
  color,
  innerRadius,
  level,
  active,
  amplitude,
  barWidth,
  barBase,
  barExtra,
}: {
  index: number;
  angleDeg: string;
  color: string;
  innerRadius: number;
  level: SharedValue<number>;
  active: SharedValue<number>;
  amplitude: number;
  barWidth: number;
  barBase: number;
  barExtra: number;
}) {
  const { onset, gain } = useMemo(() => barProfile(index), [index]);

  const style = useAnimatedStyle(() => {
    const lvl = active.value > 0.5 ? level.value : 0;
    const e = (lvl - onset) * gain;
    const eff = e < 0 ? 0 : e > 1 ? 1 : e;
    const len = barBase + barExtra * eff * amplitude;
    const dist = innerRadius + len / 2;
    return {
      height: len,
      opacity: active.value > 0.5 ? 0.5 + eff * 0.5 : 0,
      transform: [{ rotate: angleDeg }, { translateY: -dist }],
    };
  });

  return (
    <View pointerEvents="none" style={styles.barCenter}>
      <Animated.View
        style={[{ width: barWidth, borderRadius: barWidth / 2, backgroundColor: color }, style]}
      />
    </View>
  );
}

type VoiceInputButtonProps = {
  listening: boolean;
  /** 0→1 smoothed loudness from STT volume metering. */
  level: SharedValue<number>;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  /** `sm` fits a 44pt search field; `md` is the adhkar form default. */
  size?: VoiceInputSize;
};

/**
 * Mic / stop control with a solid-accent equalizer that beats with voice loudness
 * (sample VoiceRainbowVisualizer pattern, monochrome theme accent).
 */
export function VoiceInputButton({
  listening,
  level,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled,
  size = "md",
}: VoiceInputButtonProps) {
  const { colors } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const amplitude = reducedMotion ? 0.45 : 1;
  const active = useSharedValue(listening ? 1 : 0);
  const preset = SIZE_PRESETS[size];

  useEffect(() => {
    active.value = listening ? 1 : 0;
  }, [listening, active]);

  const innerRadius = preset.discSize / 2 + preset.ringGap;
  const fieldSize = (innerRadius + preset.barBase + preset.barExtra) * 2 + 6;

  const bars = useMemo(
    () =>
      Array.from({ length: preset.barCount }, (_, i) => ({
        key: i,
        angleDeg: `${(i / preset.barCount) * 360}deg`,
      })),
    [preset.barCount],
  );

  const glowStyle = useAnimatedStyle(() => {
    const on = active.value > 0.5;
    const lvl = on ? level.value : 0;
    return {
      opacity: on ? 0.14 + lvl * 0.55 : 0,
      transform: [{ scale: 1 + (on ? lvl * 0.35 : 0) }],
    };
  });

  const discStyle = useAnimatedStyle(() => {
    const on = active.value > 0.5;
    const lvl = on ? level.value : 0;
    return {
      transform: [{ scale: 1 + (on ? lvl * 0.12 : 0) }],
    };
  });

  const tint = listening ? colors.accent : colors.mutedForeground;
  const well = listening ? withAlpha(colors.accent, 0.18) : undefined;

  return (
    <View style={[styles.wrap, { width: fieldSize, height: fieldSize }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: preset.discSize * 1.55,
            height: preset.discSize * 1.55,
            borderRadius: (preset.discSize * 1.55) / 2,
            backgroundColor: colors.accent,
          },
          glowStyle,
        ]}
      />
      {bars.map((b) => (
        <EqualizerBar
          key={b.key}
          index={b.key}
          angleDeg={b.angleDeg}
          color={colors.accent}
          innerRadius={innerRadius}
          level={level}
          active={active}
          amplitude={amplitude}
          barWidth={preset.barWidth}
          barBase={preset.barBase}
          barExtra={preset.barExtra}
        />
      ))}
      <Animated.View style={discStyle}>
        <IconButton
          name={
            listening
              ? { ios: "stop.fill", android: "stop", web: "stop" }
              : { ios: "mic.fill", android: "mic", web: "mic" }
          }
          size={preset.iconSize}
          tintColor={tint}
          background={well}
          wellRadius={Radius.pill}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ selected: listening }}
          haptic={listening ? "medium" : "light"}
          disabled={disabled}
          onPress={onPress}
          hitTarget={preset.discSize}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  barCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
  },
});
