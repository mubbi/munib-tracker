import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle, progressRingKnobStyle } from "@/lib/chart-rtl";
import { ltrControlViewProps } from "@/lib/rtl";

import type { TasbeehFaceProps } from "./types";

/** Phone ring stroke at the 272dp stage; scales with the stage for previews. */
export const RING_STROKE = 14;
const RING_GLOW = 36;
const BASE_RING = 272;

/** Count size inside a preview ring: ~22% of the ring, never below 14. */
export function previewCountSize(ringSize: number): number {
  return Math.max(14, Math.round(ringSize * 0.22));
}

/**
 * Ring (default, D10): the original `ArcProgressRing` donut with the count
 * inside, moved unchanged out of the counter shell.
 */
export function RingFace({
  count,
  target,
  complete,
  size,
  tv,
  reduceMotion,
  preview,
}: TasbeehFaceProps) {
  const ringStroke = preview
    ? Math.max(4, Math.round((size * RING_STROKE) / BASE_RING))
    : tv
      ? tvDp(RING_STROKE)
      : RING_STROKE;
  return (
    <CounterRing
      count={count}
      target={target}
      complete={complete}
      ringSize={size}
      ringStroke={ringStroke}
      reducedMotion={reduceMotion}
      tv={tv}
      preview={preview}
    />
  );
}

function CounterRing({
  count,
  target,
  complete,
  ringSize,
  ringStroke,
  reducedMotion,
  tv,
  preview,
}: {
  count: number;
  target: number;
  complete: boolean;
  ringSize: number;
  ringStroke: number;
  reducedMotion: boolean;
  tv: boolean;
  preview?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const progressTarget = target > 0 ? Math.min(count / target, 1) : 0;
  const progress = useSharedValue(progressTarget);
  const countPop = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    progress.value = reducedMotion ? progressTarget : withSpring(progressTarget, Springs.gentle);
  }, [progress, progressTarget, reducedMotion]);

  useEffect(() => {
    if (count !== prevCount.current) {
      if (!reducedMotion) {
        countPop.value = withSequence(withSpring(1.1, Springs.pop), withSpring(1, Springs.gentle));
      }
      prevCount.current = count;
    }
  }, [count, countPop, reducedMotion]);

  const fill = complete ? tokens.status.success.color : colors.accent;
  const glowOpacity = complete ? 0.28 : 0.12 + progressTarget * 0.14;
  const [displayProgress, setDisplayProgress] = useState(progressTarget);
  const displayRef = useRef(displayProgress);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Previews animate too (the style sheet's demo stage); thumbnails pass reduced motion.
    if (reducedMotion) {
      displayRef.current = progressTarget;
      setDisplayProgress(progressTarget);
      return;
    }

    const from = displayRef.current;
    const delta = progressTarget - from;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = Math.min(1, (timestamp - start) / 420);
      const eased = 1 - (1 - t) ** 3;
      const value = from + delta * eased;
      displayRef.current = value;
      setDisplayProgress(value);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [progressTarget, reducedMotion]);

  const knob = ringStroke + 2;
  const inset = ringStroke;
  const glow = ringSize + (preview ? ringStroke * 2 : tv ? tvDp(RING_GLOW) : RING_GLOW);

  const countAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countPop.value }],
  }));

  return (
    <View style={[styles.ring, chartCoordinateStyle, { width: ringSize, height: ringSize }]}>
      <View
        style={[
          styles.ringGlow,
          {
            width: glow,
            height: glow,
            borderRadius: glow / 2,
            backgroundColor: withAlpha(fill, glowOpacity),
          },
        ]}
      />

      {target > 0 ? (
        <ArcProgressRing
          size={ringSize}
          stroke={ringStroke}
          progress={displayProgress}
          fillColor={fill}
          trackColor={tokens.track}
          surfaceColor={colors.card}
          surfaceShadow
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: ringSize / 2,
              borderWidth: ringStroke,
              borderColor: withAlpha(colors.accent, 0.35),
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: inset,
              left: inset,
              right: inset,
              bottom: inset,
              borderRadius: ringSize / 2,
              backgroundColor: colors.card,
              ...Shadows.sm,
            }}
          />
        </View>
      )}

      {target > 0 && displayProgress > 0 ? (
        <View
          style={[
            progressRingKnobStyle(ringSize, ringStroke, displayProgress, knob),
            styles.knob,
            {
              borderRadius: knob / 2,
              backgroundColor: fill,
              borderColor: colors.card,
            },
          ]}
        />
      ) : null}

      {preview ? (
        // Scales with the preview: legible in a thumbnail, not lost in the demo stage.
        <ThemedText
          type="smallBold"
          style={[
            styles.count,
            {
              fontSize: previewCountSize(ringSize),
              lineHeight: Math.round(previewCountSize(ringSize) * 1.2),
            },
          ]}
        >
          {count}
        </ThemedText>
      ) : (
        <View style={styles.ringCenter}>
          <View style={[styles.countRow, ltrControlViewProps().style]}>
            <Animated.View style={countAnimStyle}>
              <ThemedText type="display" style={styles.count}>
                {count}
              </ThemedText>
            </Animated.View>
            {target > 0 ? (
              <ThemedText type="header" themeColor="mutedForeground" style={styles.targetSuffix}>
                / {target}
              </ThemedText>
            ) : null}
          </View>

          {target > 0 ? (
            complete ? (
              <View style={[styles.completeBadge, { backgroundColor: tokens.status.success.soft }]}>
                <SymbolView
                  name={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
                  size={16}
                  tintColor={tokens.status.success.color}
                />
                <ThemedText type="smallBold" style={{ color: tokens.status.success.color }}>
                  {t("tasbeehUi.complete")}
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tasbeehUi.ofTarget", { target })}
              </ThemedText>
            )
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehUi.unlimited")}
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringGlow: {
    position: "absolute",
    alignSelf: "center",
  },
  knob: {
    position: "absolute",
    borderWidth: 2,
    ...Shadows.sm,
  },
  ringCenter: {
    alignItems: "center",
    gap: Spacing.one,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: Spacing.one,
  },
  count: {
    fontVariant: ["tabular-nums"],
  },
  targetSuffix: {
    fontVariant: ["tabular-nums"],
    opacity: 0.55,
    marginBottom: 6,
  },
  completeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
