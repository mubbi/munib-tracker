import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { Shadows } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle, progressRingKnobStyle } from "@/lib/chart-rtl";

type ProgressRingProps = {
  /** Progress from 0 to 1. */
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  /** Color behind the ring, used to "punch out" the centre. Defaults to card. */
  surfaceColor?: string;
  /** Small caption rendered under the value. */
  caption?: string;
  /** Font size of the centre percentage — scale down for compact rings. */
  valueFontSize?: number;
  style?: ViewStyle;
};

const COUNT_UP_MS = 900;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * A calm, Apple-Watch-flavoured completion ring. Uses an SVG arc on native and a
 * CSS conic gradient on web; a small knob sweeps the ring's circumference and
 * the centre value counts up on mount. Honors reduced motion by snapping to the
 * final value.
 */
export function ProgressRing({
  progress,
  size = 132,
  stroke = 12,
  color,
  trackColor,
  surfaceColor,
  caption,
  valueFontSize,
  style,
}: ProgressRingProps) {
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();

  const fill = color ?? colors.accent;
  const track = trackColor ?? tokens.track;
  const surface = surfaceColor ?? colors.card;
  const target = Math.min(1, Math.max(0, progress));

  const [display, setDisplay] = useState(reducedMotion ? target : 0);
  const rafRef = useRef<number | null>(null);
  // Tracks the latest displayed value so a target change animates from where we
  // currently are, without making `display` an effect dependency.
  const displayRef = useRef(display);

  useEffect(() => {
    if (reducedMotion) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }

    const startValue = displayRef.current;
    const delta = target - startValue;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = Math.min(1, (timestamp - start) / COUNT_UP_MS);
      const value = startValue + delta * easeOutCubic(t);
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, reducedMotion]);

  const knob = stroke + 4;
  const pct = Math.round(display * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(target * 100), min: 0, max: 100 }}
      accessibilityLabel={caption ? `${Math.round(target * 100)}% ${caption}` : undefined}
      style={[styles.root, chartCoordinateStyle, { width: size, height: size }, style]}
    >
      <ArcProgressRing
        size={size}
        stroke={stroke}
        progress={display}
        fillColor={fill}
        trackColor={track}
        surfaceColor={surface}
      />

      {/* Sweeping knob — geometrically exact, carries the motion on every platform. */}
      {target > 0 ? (
        <View
          style={[
            progressRingKnobStyle(size, stroke, display, knob),
            styles.knob,
            {
              borderRadius: knob / 2,
              backgroundColor: fill,
              borderColor: surface,
              ...Shadows.sm,
            },
          ]}
        />
      ) : null}

      {/* Centre value. */}
      <View style={styles.center}>
        <ThemedText
          style={[
            styles.value,
            { color: colors.foreground },
            valueFontSize != null
              ? { fontSize: valueFontSize, lineHeight: valueFontSize + 4 }
              : null,
          ]}
        >
          {pct}%
        </ThemedText>
        {caption ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.caption}>
            {caption}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  knob: {
    borderWidth: 2,
  },
  center: {
    alignItems: "center",
    gap: 1,
  },
  value: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  caption: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
