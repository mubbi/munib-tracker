import { Children, type ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { Durations, Stagger as StaggerTokens } from "@/constants/motion";

type StaggerProps = {
  children: ReactNode;
  /** Delay before the first child animates in (ms). */
  delay?: number;
  /** Delay added per successive child (ms). */
  step?: number;
  /** Vertical offset each child rises from (px). */
  distance?: number;
};

/**
 * Wraps a vertical stack so its children settle in one-by-one on mount — a small
 * top-to-bottom cascade that makes a screen feel composed and intentional rather
 * than snapping in all at once.
 *
 * Deliberately avoids Reanimated's layout `entering` animations: those measure a
 * view's absolute screen position when they start, which produces residual
 * offsets when they fire mid tab-transition (items appearing shifted) and reflow
 * siblings as each one animates (visible "jerk/reorder"). Instead each item
 * animates a purely *local* opacity + translateY, so it always slides into its
 * own layout slot regardless of where the screen is. `width: "100%"` keeps every
 * wrapper stretched to the parent. No-ops under reduced motion.
 */
export function Stagger({
  children,
  delay = StaggerTokens.base,
  step = StaggerTokens.step,
  distance = 12,
}: StaggerProps) {
  const items = Children.toArray(children);

  return (
    <>
      {items.map((child, index) => (
        <StaggerItem
          // biome-ignore lint/suspicious/noArrayIndexKey: stack order is stable
          key={index}
          index={index}
          delay={delay}
          step={step}
          distance={distance}
        >
          {child}
        </StaggerItem>
      ))}
    </>
  );
}

function StaggerItem({
  index,
  delay,
  step,
  distance,
  children,
}: {
  index: number;
  delay: number;
  step: number;
  distance: number;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(
      delay + index * step,
      withTiming(1, { duration: Durations.slow, easing: Easing.out(Easing.cubic) }),
    );
  }, [reducedMotion, delay, index, step, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  return <Animated.View style={[styles.item, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  item: {
    width: "100%",
  },
});
