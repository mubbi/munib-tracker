import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, PanResponder, Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedText } from "@/components/themed-text";
import { OverlayGlassFill } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Durations, Springs } from "@/constants/motion";
import { BorderWidth, Control, IconSize, Radius, Spacing, ZIndex } from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

export type ToastType = "success" | "error" | "info" | "warning";

/** One optional inline action (e.g. "Undo"); pressing it runs `onPress` and dismisses the toast. */
export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  subtitle?: string;
  /** Not shown on TV (toasts aren't D-pad focusable there); the toast still appears. */
  action?: ToastAction;
  /**
   * Runs once when the toast leaves the screen for any reason (timeout, the
   * dismiss button, a swipe, its action, or being pushed out by newer toasts).
   */
  onDismiss?: () => void;
}

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
  action?: ToastAction;
  onDismiss?: () => void;
  /** Auto-dismiss delay; `null` = stays until dismissed. */
  duration: number | null;
}

export interface ToastContextValue {
  /** Shows a toast and returns its id (for `dismiss`). */
  show: (title: string, options?: ToastOptions) => string;
  success: (title: string, subtitle?: string) => void;
  error: (title: string, subtitle?: string) => void;
  info: (title: string, subtitle?: string) => void;
  warning: (title: string, subtitle?: string) => void;
  /** Removes a toast early (no-op when it has already gone). */
  dismiss: (id: string) => void;
}

type ToastController = {
  toasts: ToastItem[];
  /** Latest announcement for the web live regions (`seq` re-triggers identical text). */
  announcement: { text: string; assertive: boolean; seq: number } | null;
  dismiss: (id: string) => void;
  /** Web: hold the auto-dismiss while keyboard focus is inside the toast. */
  pause: (id: string) => void;
  resume: (id: string) => void;
  /**
   * The outlet that draws the toasts: the id of the top-most open sheet
   * ({@link useToastOutlet}), or `null` for the root {@link ToastHost}.
   */
  activeOutlet: string | null;
  /** Whether a root {@link ToastHost} is mounted (unmounted under the PIN lock — G-92). */
  rootMounted: boolean;
};

/** Stable registration API (kept apart so sheets don't re-render on every toast). */
type ToastOutletRegistry = {
  /** Pushes an outlet on top of the stack; returns its removal. */
  register: (id: string) => () => void;
  /** Marks a root host as mounted; returns its removal. */
  attachRoot: () => () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const ToastControllerContext = createContext<ToastController | null>(null);
const ToastOutletRegistryContext = createContext<ToastOutletRegistry | null>(null);

export const TOAST_DURATION_MS = 3500;
/** Toasts with an action stay longer so there is time to reach and press it (WCAG 2.2.1). */
export const TOAST_ACTION_DURATION_MS = 7000;
/** At most this many toasts are on screen; older ones are dismissed. */
const MAX_TOASTS = 3;
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
 * Whether VoiceOver / TalkBack is running. Web is always `false`:
 * react-native-web's `isScreenReaderEnabled()` resolves `true` unconditionally,
 * so web relies on pause-on-focus instead.
 */
function useScreenReaderEnabled() {
  const enabled = useRef(false);
  useEffect(() => {
    if (Platform.OS === "web") return;
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (active) enabled.current = value;
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("screenReaderChanged", (value) => {
      enabled.current = value;
    });
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);
  return enabled;
}

/**
 * Holds toast state/API. The visible banners render from {@link ToastHost},
 * which must sit in {@link BlurTargetProvider} overlays so Android can capture
 * a real backdrop blur (same as mini-player / sheets).
 *
 * Accessibility (F-40, F-42):
 * - iOS / Android: every toast is spoken with `announceForAccessibility`
 *   (title + subtitle); cards are also live regions (Android TalkBack).
 * - Web: `ToastHost` keeps two visually hidden live regions mounted (polite +
 *   assertive for errors) and writes each toast's text into them.
 * - Error toasts, and every toast while a screen reader is on, stay until
 *   dismissed; on web the timer pauses while focus is inside the toast.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [announcement, setAnnouncement] = useState<ToastController["announcement"]>(null);
  /** Open sheet outlets, oldest first — the last one is on top (B-01). */
  const [outlets, setOutlets] = useState<string[]>([]);
  const [rootHosts, setRootHosts] = useState(0);
  const toastsRef = useRef<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const screenReader = useScreenReaderEnabled();

  const commit = useCallback((next: ToastItem[]) => {
    toastsRef.current = next;
    setToasts(next);
  }, []);

  const clearTimer = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      const item = toastsRef.current.find((toast) => toast.id === id);
      clearTimer(id);
      if (!item) return;
      commit(toastsRef.current.filter((toast) => toast.id !== id));
      item.onDismiss?.();
    },
    [clearTimer, commit],
  );

  const schedule = useCallback(
    (item: ToastItem) => {
      clearTimer(item.id);
      if (item.duration == null) return;
      timers.current[item.id] = setTimeout(() => dismiss(item.id), item.duration);
    },
    [clearTimer, dismiss],
  );

  const pause = useCallback((id: string) => clearTimer(id), [clearTimer]);
  const resume = useCallback(
    (id: string) => {
      const item = toastsRef.current.find((toast) => toast.id === id);
      if (item) schedule(item);
    },
    [schedule],
  );

  const show = useCallback(
    (title: string, options?: ToastOptions) => {
      const id = uid();
      const type: ToastType = options?.type ?? "info";
      const hapticMap: Record<ToastType, Parameters<typeof triggerHaptic>[0]> = {
        success: "success",
        error: "error",
        warning: "warning",
        info: "light",
      };
      triggerHaptic(hapticMap[type]);
      const action = isTV() ? undefined : options?.action;
      const persistent = type === "error" || screenReader.current;
      const item: ToastItem = {
        id,
        type,
        title,
        subtitle: options?.subtitle,
        onDismiss: options?.onDismiss,
        duration: persistent ? null : action ? TOAST_ACTION_DURATION_MS : TOAST_DURATION_MS,
        ...(action ? { action } : {}),
      };

      const next = [...toastsRef.current, item];
      const evicted = next.slice(0, Math.max(0, next.length - MAX_TOASTS));
      commit(next.slice(-MAX_TOASTS));
      for (const old of evicted) {
        clearTimer(old.id);
        old.onDismiss?.();
      }
      schedule(item);

      const text = options?.subtitle ? `${title}. ${options.subtitle}` : title;
      if (Platform.OS === "web") {
        setAnnouncement((prev) => ({
          text,
          assertive: type === "error",
          seq: (prev?.seq ?? 0) + 1,
        }));
      } else {
        AccessibilityInfo.announceForAccessibility(text);
      }
      return id;
    },
    [clearTimer, commit, schedule, screenReader],
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
      success: (title, subtitle) => {
        show(title, { type: "success", subtitle });
      },
      error: (title, subtitle) => {
        show(title, { type: "error", subtitle });
      },
      info: (title, subtitle) => {
        show(title, { type: "info", subtitle });
      },
      warning: (title, subtitle) => {
        show(title, { type: "warning", subtitle });
      },
      dismiss,
    }),
    [show, dismiss],
  );

  const registry = useMemo<ToastOutletRegistry>(
    () => ({
      register: (id) => {
        // Re-registering (a sheet that hid for a nested prompt and re-opened)
        // moves the outlet back on top.
        setOutlets((prev) => [...prev.filter((item) => item !== id), id]);
        return () => setOutlets((prev) => prev.filter((item) => item !== id));
      },
      attachRoot: () => {
        setRootHosts((n) => n + 1);
        return () => setRootHosts((n) => n - 1);
      },
    }),
    [],
  );

  const activeOutlet = outlets.length > 0 ? (outlets[outlets.length - 1] ?? null) : null;
  const rootMounted = rootHosts > 0;
  const controller = useMemo<ToastController>(
    () => ({ toasts, announcement, dismiss, pause, resume, activeOutlet, rootMounted }),
    [toasts, announcement, dismiss, pause, resume, activeOutlet, rootMounted],
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastOutletRegistryContext.Provider value={registry}>
        <ToastControllerContext.Provider value={controller}>
          {children}
        </ToastControllerContext.Provider>
      </ToastOutletRegistryContext.Provider>
    </ToastContext.Provider>
  );
}

/**
 * Registers a toast outlet while `active` (an open `Sheet`) and returns its id,
 * or `null` when inactive / outside a {@link ToastProvider}. Render
 * `<ToastHost outletId={id} />` inside the sheet's modal layer: an RN `Modal`
 * is its own window on iOS / Android (and a portal above the app on web), so
 * the root host would draw toasts — and their **Undo** — underneath it (B-01).
 * The top-most registered outlet draws the toasts; the root host draws them
 * when no sheet is open.
 */
export function useToastOutlet(active: boolean): string | null {
  const registry = useContext(ToastOutletRegistryContext);
  const id = `toast-outlet-${useId()}`;
  useEffect(() => {
    if (!active || !registry) return;
    return registry.register(id);
  }, [active, registry, id]);
  return active && registry ? id : null;
}

/**
 * Web live regions: mounted before any toast so screen readers register them,
 * then updated with each message (a region inserted together with its text is
 * often not announced). Visually hidden; the visible cards are not live there.
 */
function WebToastLiveRegions({ announcement }: { announcement: ToastController["announcement"] }) {
  // A zero-width suffix that flips with `seq` makes a repeated identical
  // message count as a change, so it is announced again.
  const text = announcement ? `${announcement.text}${announcement.seq % 2 ? "\u200B" : ""}` : "";
  return (
    <View style={styles.visuallyHidden}>
      <Text role="status" aria-live="polite">
        {announcement && !announcement.assertive ? text : ""}
      </Text>
      <Text role="alert" aria-live="assertive">
        {announcement?.assertive ? text : ""}
      </Text>
    </View>
  );
}

/**
 * Frosted toast banners. The root host (no `outletId`) mounts inside the
 * BlurTargetProvider overlays, below the PIN lock; `Sheet` mounts an outlet
 * host (`outletId` from {@link useToastOutlet}) inside its modal layer.
 *
 * - Only one host draws the banners: the top-most open sheet outlet, else the root.
 * - Outlets draw only while the root host is mounted, so the PIN-lock rule (the
 *   root host unmounts while the gate is up — G-92) holds inside sheets too.
 * - The web live regions stay on the root host (always mounted before a toast).
 */
export function ToastHost({ outletId }: { outletId?: string } = {}) {
  const controller = useContext(ToastControllerContext);
  const registry = useContext(ToastOutletRegistryContext);
  const insets = useAppSafeAreaInsets();
  const isRoot = outletId == null;

  useEffect(() => {
    if (!isRoot || !registry) return;
    return registry.attachRoot();
  }, [isRoot, registry]);

  if (!controller) return null;

  const { toasts, dismiss, pause, resume, announcement, activeOutlet, rootMounted } = controller;
  const web = Platform.OS === "web";
  const liveRegions = web && isRoot ? <WebToastLiveRegions announcement={announcement} /> : null;
  const drawsBanners = isRoot ? activeOutlet == null : activeOutlet === outletId && rootMounted;
  if (toasts.length === 0 || !drawsBanners) return liveRegions;

  const topOffset = web ? TOAST_TOP_WEB : insets.top + 8;

  return (
    <>
      {liveRegions}
      <View style={[styles.container, { top: topOffset, pointerEvents: "box-none" }]}>
        {toasts.map((item) => (
          <ToastCard
            key={item.id}
            item={item}
            onDismiss={() => dismiss(item.id)}
            onFocusWithin={() => pause(item.id)}
            onBlurWithin={() => resume(item.id)}
          />
        ))}
      </View>
    </>
  );
}

function ToastCard({
  item,
  onDismiss,
  onFocusWithin,
  onBlurWithin,
}: {
  item: ToastItem;
  onDismiss: () => void;
  onFocusWithin: () => void;
  onBlurWithin: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const statusKey = item.type === "error" ? "danger" : item.type;
  const palette = tokens.status[statusKey];
  const web = Platform.OS === "web";

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
        // Let taps (e.g. the dismiss button) through; only claim the gesture on
        // an upward drag so pressing dismiss still works.
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
            opacity.value = withTiming(0, { duration: Durations.fast });
            translateY.value = withTiming(-160, { duration: Durations.fast }, (finished) => {
              if (finished) scheduleOnRN(setSwipedAway, true);
            });
            return;
          }
          translateY.value = withSpring(0, Springs.sheet);
        },
        onPanResponderTerminate: () => {
          if (dismissing.current) return;
          translateY.value = withSpring(0, Springs.sheet);
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

  // Native: the card is a live region (TalkBack); web announces through the
  // hidden regions in ToastHost, so the card itself stays quiet there.
  // Native toasts are already spoken via `announceForAccessibility` when shown;
  // a live region on top would make TalkBack read each toast twice (iOS ignores it).
  const liveRegion = "none" as const;

  return (
    <Animated.View
      entering={FadeInDown.duration(Durations.base)}
      exiting={swipedAway ? undefined : FadeOut.duration(Durations.fast)}
    >
      <Animated.View
        accessibilityLiveRegion={liveRegion}
        {...(web ? { onFocus: onFocusWithin, onBlur: onBlurWithin } : null)}
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
        {item.action ? (
          <PressableScale
            onPress={() => {
              item.action?.onPress();
              onDismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel={item.action.label}
            hitSlop={8}
            style={styles.action}
          >
            <ThemedText type="smallBold" style={{ color: palette.text }}>
              {item.action.label}
            </ThemedText>
          </PressableScale>
        ) : null}
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          size={IconSize.sm}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("common.dismiss")}
          onPress={onDismiss}
          haptic={false}
          style={styles.dismiss}
        />
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
  action: { minHeight: Control.minTouch, justifyContent: "center", paddingHorizontal: Spacing.two },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    zIndex: ZIndex.toast,
    elevation: ZIndex.toast,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.three,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.one,
    borderWidth: BorderWidth.hairline,
    borderStartWidth: 4,
    overflow: "hidden",
  },
  textWrap: {
    flex: 1,
    gap: Spacing.half,
    zIndex: ZIndex.raised,
  },
  dismiss: { zIndex: ZIndex.raised },
  /** Off-screen but readable by assistive tech (web live regions). */
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    overflow: "hidden",
    pointerEvents: "none",
  },
});
