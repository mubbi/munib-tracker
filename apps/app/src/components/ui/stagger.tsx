import { usePathname } from "expo-router";
import {
  Children,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { Durations, Stagger as StaggerTokens } from "@/constants/motion";
import { Spacing } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { registerStaggerLayoutListener } from "@/lib/stagger-entrances";

/** Routes/screens whose stagger entrance has already played this session. */
const completedEntrances = new Set<string>();

type StaggerContextValue = {
  /** Live check — must read the ref, not a frozen boolean captured at first render. */
  hasCompletedEntrance: () => boolean;
  /** React state that flips true once the entrance is done or interrupted. */
  forceVisible: boolean;
  markEntranceComplete: () => void;
  animate: boolean;
};

const StaggerContext = createContext<StaggerContextValue>({
  hasCompletedEntrance: () => false,
  forceVisible: false,
  markEntranceComplete: () => {},
  animate: true,
});

type StaggerProps = {
  children: ReactNode;
  /** Delay before the first child animates in (ms). */
  delay?: number;
  /** Delay added per successive child (ms). */
  step?: number;
  /** Vertical offset each child rises from (px). */
  distance?: number;
  /**
   * When `false`, children render immediately with no entrance animation.
   * Use on live settings screens (e.g. appearance) where content must stay
   * visible while the user toggles theme/accent.
   */
  animate?: boolean;
  /**
   * Stable id for this screen's entrance (e.g. route path). Once the cascade
   * has played for this key, later remounts — including after a theme switch
   * or a native permission dialog — skip the fade-in so content never
   * disappears. Defaults to the current pathname when omitted.
   */
  entranceKey?: string;
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
 *
 * Critical reliability rules:
 * - After the entrance finishes (or fails safe), later-inserted children render
 *   fully visible — never restart from opacity 0.
 * - Leaving the foreground (e.g. system permission dialog) finishes the entrance
 *   so remounts and late children stay visible.
 * - Changing the child count after the first paint finishes the entrance, because
 *   index keys remount later siblings and would otherwise replay from opacity 0.
 */
export function Stagger({
  children,
  delay = StaggerTokens.base,
  step = StaggerTokens.step,
  distance = 12,
  animate = true,
  entranceKey,
}: StaggerProps) {
  const pathname = usePathname();
  const resolvedKey = entranceKey ?? pathname;
  const resolvedKeyRef = useRef(resolvedKey);
  resolvedKeyRef.current = resolvedKey;
  const skipFromKey = !animate || (resolvedKey ? completedEntrances.has(resolvedKey) : false);
  const entranceComplete = useRef(skipFromKey);
  const [forceVisible, setForceVisible] = useState(skipFromKey);
  const items = Children.toArray(children);
  const itemCount = items.length;
  const prevItemCount = useRef(itemCount);
  const hasPaintedRef = useRef(false);

  const markEntranceComplete = useCallback(() => {
    entranceComplete.current = true;
    const key = resolvedKeyRef.current;
    if (key) completedEntrances.add(key);
    setForceVisible(true);
  }, []);

  const hasCompletedEntrance = useCallback(() => entranceComplete.current, []);

  // Synced during render so remounted StaggerItems (index keys) read
  // hasCompletedEntrance() as true on the same pass — not one frame later.
  const childCountChanged = hasPaintedRef.current && prevItemCount.current !== itemCount;
  if (childCountChanged) {
    entranceComplete.current = true;
    const key = resolvedKeyRef.current;
    if (key) completedEntrances.add(key);
  }
  prevItemCount.current = itemCount;

  useEffect(() => {
    hasPaintedRef.current = true;
    // After the first paint, inserting/removing a sibling remounts later
    // StaggerItems (keys are indices). Finish the entrance so remounts stay
    // visible instead of restarting from opacity 0 mid-interaction.
    if (childCountChanged) {
      markEntranceComplete();
    }
  }, [childCountChanged, markEntranceComplete]);

  useEffect(() => {
    return registerStaggerLayoutListener(markEntranceComplete);
  }, [markEntranceComplete]);

  // Dev reload / fast remount can clear in-flight timers before the entrance
  // finishes. Cache the key on unmount so the next mount skips opacity 0.
  useEffect(() => {
    return () => {
      const key = resolvedKeyRef.current;
      if (key && !entranceComplete.current) {
        completedEntrances.add(key);
      }
    };
  }, []);

  // Record completion after the slowest child would have settled, so normal
  // cascades still play once; later remounts of this route skip the fade-in.
  useEffect(() => {
    if (!animate || forceVisible || itemCount === 0) return;

    const lastIndex = itemCount - 1;
    const totalDuration = delay + lastIndex * step + Durations.slow;
    const completeTimer = setTimeout(() => {
      markEntranceComplete();
    }, totalDuration);
    const failsafe = setTimeout(() => {
      markEntranceComplete();
    }, totalDuration + 80);

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(failsafe);
    };
  }, [animate, delay, forceVisible, itemCount, markEntranceComplete, step]);

  // Permission dialogs and other OS interruptions leave the foreground and can
  // freeze in-flight Reanimated entrances at opacity 0. Finish the entrance as
  // soon as we leave the foreground so remounts and late children stay visible.
  useEffect(() => {
    if (!animate || forceVisible) return;

    const onChange = (next: AppStateStatus) => {
      if (next === "inactive" || next === "background") {
        markEntranceComplete();
      }
    };

    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [animate, forceVisible, markEntranceComplete]);

  const contextValue = useMemo(
    () => ({
      hasCompletedEntrance,
      forceVisible,
      markEntranceComplete,
      animate,
    }),
    [animate, forceVisible, hasCompletedEntrance, markEntranceComplete],
  );

  return (
    <StaggerContext.Provider value={contextValue}>
      <View style={styles.stack}>
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
      </View>
    </StaggerContext.Provider>
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
  const { hasCompletedEntrance, forceVisible, animate } = useContext(StaggerContext);
  const reducedMotion = useHydrationSafeReducedMotion();
  // Read completion live on every render so late-mounted siblings (e.g. the
  // Upcoming Reminders card after enabling notifications) skip opacity 0.
  const shouldSkip = !animate || reducedMotion === true || forceVisible || hasCompletedEntrance();
  const [revealed, setRevealed] = useState(shouldSkip);
  const progress = useSharedValue(shouldSkip ? 1 : 0);

  // Sync on the same frame as a skip flip so locale/layout changes never leave
  // a retained tab row stuck at opacity 0 until the async entrance runs.
  useLayoutEffect(() => {
    if (!shouldSkip) return;
    setRevealed(true);
    cancelAnimation(progress);
    progress.value = 1;
  }, [progress, shouldSkip]);

  useEffect(() => {
    if (shouldSkip) {
      setRevealed(true);
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    const entranceDelay = delay + index * step;
    const totalDuration = entranceDelay + Durations.slow;

    progress.value = withDelay(
      entranceDelay,
      withTiming(1, { duration: Durations.slow, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setRevealed)(true);
      }),
    );

    // Per-item failsafe: if Reanimated stalls, snap this row visible without
    // waiting for a parent remount. Parent still owns session-complete state.
    const failsafe = setTimeout(() => {
      cancelAnimation(progress);
      progress.value = 1;
      setRevealed(true);
    }, totalDuration + 80);

    return () => clearTimeout(failsafe);
  }, [delay, index, progress, shouldSkip, step]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  // Outer shell holds layout width. When the entrance is done (or skipped),
  // render a plain View so visibility never depends on a stalled shared value.
  if (shouldSkip || revealed) {
    return <View style={styles.item}>{children}</View>;
  }

  return (
    <View style={styles.item}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    gap: Spacing.four,
  },
  item: {
    width: "100%",
  },
});
