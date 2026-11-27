import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  type DimensionValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Durations } from "@/constants/motion";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** One breathe (in or out) of the placeholder pulse — a slow, calm cadence. */
const PULSE_MS = Durations.slow * 2;

/**
 * A gently pulsing placeholder bone for loading content. Decorative: hidden
 * from assistive tech — wrap bones in {@link SkeletonGroup} (or use a preset)
 * so the loading state is announced once. Static under reduced motion.
 */
export function Skeleton({
  width = "100%",
  height = 16,
  radius = Radius.xs,
  style,
}: SkeletonProps) {
  const { tokens } = useThemeTokens();
  const reducedMotion = useHydrationSafeReducedMotion();
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(pulse);
      pulse.value = 0.5;
      return;
    }
    pulse.value = 0;
    pulse.value = withRepeat(
      withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [reducedMotion, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.4 + pulse.value * 0.4 }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: tokens.track },
        animatedStyle,
        style,
      ]}
    />
  );
}

type SkeletonGroupProps = {
  /** Spoken loading label; defaults to "Loading…". */
  accessibilityLabel?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Container for skeleton bones: one indeterminate `progressbar` with `busy`
 * state and a "Loading…" name, so screen readers hear a single loading stop
 * instead of nothing (or a dozen blank shapes).
 */
export function SkeletonGroup({ accessibilityLabel, children, style }: SkeletonGroupProps) {
  const { t } = useTranslation();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? t("uiFeedback.loading")}
      accessibilityState={{ busy: true }}
      // react-native-web drops `accessibilityState`; ARIA reaches the DOM.
      aria-busy
      style={style}
    >
      {children}
    </View>
  );
}

export type SkeletonPreset = "rows" | "card" | "tiles";

type SkeletonPresetProps = {
  /** `rows` list rows · `card` a content card · `tiles` a grid of tiles. */
  preset?: SkeletonPreset;
  /** Rows / tiles to draw (default 4 rows, 4 tiles, 1 card). */
  count?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Content-shaped loading placeholders used by `ContentState status="loading"`. */
export function SkeletonPlaceholder({
  preset = "rows",
  count,
  accessibilityLabel,
  style,
}: SkeletonPresetProps) {
  const { colors } = useThemeTokens();
  const n = Math.max(1, count ?? (preset === "card" ? 1 : 4));
  const items = Array.from({ length: n }, (_, index) => index);

  if (preset === "tiles") {
    return (
      <SkeletonGroup accessibilityLabel={accessibilityLabel} style={[styles.tiles, style]}>
        {items.map((index) => (
          <View key={index} style={[styles.tile, { backgroundColor: colors.card }]}>
            <Skeleton width={tvDp(36)} height={tvDp(36)} radius={Radius.md} />
            <Skeleton width="70%" height={12} />
          </View>
        ))}
      </SkeletonGroup>
    );
  }

  if (preset === "card") {
    return (
      <SkeletonGroup accessibilityLabel={accessibilityLabel} style={[styles.stack, style]}>
        {items.map((index) => (
          <View key={index} style={[styles.card, { backgroundColor: colors.card }]}>
            <Skeleton width="45%" height={18} />
            <Skeleton height={12} />
            <Skeleton height={12} />
            <Skeleton width="80%" height={12} />
          </View>
        ))}
      </SkeletonGroup>
    );
  }

  return (
    <SkeletonGroup accessibilityLabel={accessibilityLabel} style={[styles.stack, style]}>
      {items.map((index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={tvDp(40)} height={tvDp(40)} radius={Radius.md} />
          <View style={styles.rowText}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="85%" height={12} />
          </View>
        </View>
      ))}
    </SkeletonGroup>
  );
}

const styles = StyleSheet.create({
  base: {
    borderCurve: "continuous",
  },
  stack: { gap: Spacing.three },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  rowText: { flex: 1, gap: Spacing.one },
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.three },
  tile: {
    flexGrow: 1,
    flexBasis: "40%",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
});
