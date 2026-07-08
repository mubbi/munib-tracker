import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { PanResponder, Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { OverlayGlassFill } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
}

export interface ToastContextValue {
  show: (title: string, options?: { type?: ToastType; subtitle?: string }) => void;
  success: (title: string, subtitle?: string) => void;
  error: (title: string, subtitle?: string) => void;
  info: (title: string, subtitle?: string) => void;
  warning: (title: string, subtitle?: string) => void;
}

type ToastController = {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const ToastControllerContext = createContext<ToastController | null>(null);

const TOAST_DURATION_MS = 3500;
const TOAST_TOP_WEB = 72;
/** Upward drag distance (px) before a toast dismisses. */
const SWIPE_DISMISS_PX = 40;
/** Upward flick velocity that dismisses even below {@link SWIPE_DISMISS_PX}. */
const SWIPE_DISMISS_VELOCITY = 0.5;

let counter = 0;
function uid() {
  return `toast-${++counter}`;
}

/**
 * Holds toast state/API. The visible banners render from {@link ToastHost},
 * which must sit in {@link BlurTargetProvider} overlays so Android can capture
 * a real backdrop blur (same as mini-player / sheets).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (title: string, options?: { type?: ToastType; subtitle?: string }) => {
      const id = uid();
      const type: ToastType = options?.type ?? "info";
      const hapticMap: Record<ToastType, Parameters<typeof triggerHaptic>[0]> = {
        success: "success",
        error: "error",
        warning: "warning",
        info: "light",
      };
      triggerHaptic(hapticMap[type]);
      setToasts((prev) => [...prev.slice(-2), { id, type, title, subtitle: options?.subtitle }]);
      timers.current[id] = setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  useEffect(() => {
    return () => {
      for (const timer of Object.values(timers.current)) clearTimeout(timer);
      timers.current = {};
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, subtitle) => show(title, { type: "success", subtitle }),
      error: (title, subtitle) => show(title, { type: "error", subtitle }),
      info: (title, subtitle) => show(title, { type: "info", subtitle }),
      warning: (title, subtitle) => show(title, { type: "warning", subtitle }),
    }),
    [show],
  );

  const controller = useMemo<ToastController>(() => ({ toasts, dismiss }), [toasts, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastControllerContext.Provider value={controller}>
        {children}
      </ToastControllerContext.Provider>
    </ToastContext.Provider>
  );
}

/** Frosted toast banners — mount inside BlurTargetProvider overlays. */
export function ToastHost() {
  const controller = useContext(ToastControllerContext);
  const insets = useSafeAreaInsets();

  if (!controller) return null;

  const { toasts, dismiss } = controller;
  if (toasts.length === 0) return null;

  const topOffset = Platform.OS === "web" ? TOAST_TOP_WEB : insets.top + 8;

  return (
    <View style={[styles.container, { top: topOffset, pointerEvents: "box-none" }]}>
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </View>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { tokens } = useThemeTokens();
  const { t } = useTranslation();
  const statusKey = item.type === "error" ? "danger" : item.type;
  const palette = tokens.status[statusKey];

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const dismissing = useRef(false);
  // When the user swipes it away we run our own slide-up + fade, so the
  // reanimated FadeOut exit must be turned off — otherwise its snapshot
  // renders at the original position and the toast appears to snap back.
  const [swipedAway, setSwipedAway] = useState(false);

  useEffect(() => {
    if (swipedAway) onDismissRef.current();
  }, [swipedAway]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Let taps (e.g. the ✕ button) through; only claim the gesture on an
        // upward drag so pressing dismiss still works.
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dy < -1 && Math.abs(gesture.dy) >= Math.abs(gesture.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gesture) => {
          // Track upward drags 1:1; add light resistance if dragged downward.
          translateY.value = gesture.dy < 0 ? gesture.dy : gesture.dy * 0.2;
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy < -SWIPE_DISMISS_PX || gesture.vy < -SWIPE_DISMISS_VELOCITY) {
            dismissing.current = true;
            opacity.value = withTiming(0, { duration: 140 });
            translateY.value = withTiming(-160, { duration: 160 }, (finished) => {
              if (finished) runOnJS(setSwipedAway)(true);
            });
            return;
          }
          translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        },
        onPanResponderTerminate: () => {
          if (dismissing.current) return;
          translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        },
      }),
    [translateY, opacity],
  );

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Explicit backdrop blur per platform (see OverlayGlassFill).
  const toastCardWash =
    Platform.OS === "android" ? (tokens.isDark ? 0.3 : 0.42) : tokens.isDark ? 0.22 : 0.32;

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={swipedAway ? undefined : FadeOut.duration(160)}
    >
      <Animated.View
        style={[
          styles.toast,
          {
            borderColor: tokens.hairline,
            borderStartColor: palette.color,
          },
          dragStyle,
        ]}
        {...panResponder.panHandlers}
      >
        {/* Frosted glass: explicit backdrop blur on every platform (see OverlayGlassFill). */}
        <OverlayGlassFill cardWashAlpha={toastCardWash} intensity={72} />
        <View style={styles.textWrap}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          {item.subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
              {item.subtitle}
            </ThemedText>
          ) : null}
        </View>
        <PressableScale onPress={onDismiss} accessibilityLabel={t("common.dismiss")}>
          <ThemedText type="caption" themeColor="mutedForeground">
            ✕
          </ThemedText>
        </PressableScale>
      </Animated.View>
    </Animated.View>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    zIndex: 10002,
    elevation: 10002,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderStartWidth: 4,
    overflow: "hidden",
  },
  textWrap: {
    flex: 1,
    gap: 2,
    zIndex: 1,
  },
});
