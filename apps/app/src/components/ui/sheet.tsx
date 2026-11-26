import { type BlurTint, BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  findNodeHandle,
  KeyboardAvoidingView,
  Modal,
  type ModalProps,
  PanResponder,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/themed-text";
import { hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import {
  captureTvFocusOrigin,
  restoreTvFocus,
  type TvFocusHandle,
} from "@/components/ui/tv-focus-memory";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Durations } from "@/constants/motion";
import {
  BorderWidth,
  Breakpoints,
  Control,
  IconSize,
  Radius,
  Spacing,
  withAlpha,
  ZIndex,
} from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAnimatedKeyboardHeight } from "@/hooks/use-animated-keyboard-height";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getCurrentPathname } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useBlurTarget } from "@/providers/blur-target-provider";
import { ToastHost, useToastOutlet } from "@/providers/toast-provider";

/** Drag distance (px) before a bottom sheet dismisses. */
const DISMISS_DRAG_PX = 72;
/** Downward flick velocity that dismisses even below {@link DISMISS_DRAG_PX}. */
const DISMISS_VELOCITY = 0.75;
/** Brief hold so the frost material can mount before the reveal cover eases out. */
const FROST_FADE_DELAY_MS = 48;
/** Soft reveal — a solid cover fades out (never animate opacity on the frost node). */
const FROST_FADE_MS = Durations.base;
/** A released drag that doesn't dismiss eases back to the dock — no spring bounce. */
const DOCK_TIMING = { duration: Durations.fast, easing: Easing.out(Easing.cubic) } as const;

/** CSS frost — applied as a plain style object so web gets both prefixes. */
const WEB_BACKDROP_FROST = {
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
} as ViewStyle;

export type SheetVariant = "center" | "bottom" | "fullscreen";

/** Anything that can take focus back when the sheet closes (a `View` / `PressableScale` ref). */
type FocusableRef = RefObject<{ focus?: () => void } | null>;

type SheetProps = {
  visible: boolean;
  /** Scrim tap, Escape (web), Back (Android / TV), the VoiceOver escape gesture and the close button. */
  onClose: () => void;
  /**
   * `center` for dialogs, `bottom` for action sheets, `fullscreen` for PIN,
   * media viewers and night surfaces (opaque, no scrim, always has a close button).
   */
  variant?: SheetVariant;
  /**
   * Visible sheet title, rendered as a heading. It also names the dialog for
   * assistive tech (unless `accessibilityLabel` overrides it) and brings a close
   * button on web, TV and every sheet without a drag grabber.
   */
  title?: string;
  /** Accessible name of the dialog; defaults to `title`. */
  accessibilityLabel?: string;
  /**
   * Force the header close button on (`true`) or off (`false`). Default: shown
   * with a `title` whenever the grabber is not the close affordance (web, TV,
   * center and fullscreen variants).
   */
  showCloseButton?: boolean;
  /**
   * The control that opened the sheet. Focus (web / TV) or screen-reader focus
   * (iOS / Android) returns to it after the sheet closes. Without it, web
   * restores the element that had focus when the sheet opened and TV the
   * control that last had D-pad focus (`tv-focus-memory`) — unless the route
   * changed or something else took focus meanwhile.
   */
  returnFocusRef?: FocusableRef;
  /** Opaque card instead of the translucent glass card (content-heavy sheets). The frosted backdrop stays. */
  solid?: boolean;
  /**
   * Bottom sheets scroll their body by default. Pass `false` when children bring
   * their own scroller (e.g. FlatList) so VirtualizedLists are not nested.
   */
  scrollable?: boolean;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * The shared modal shell: a dimmed scrim that closes on tap and a card that
 * swallows taps. Used by the confirm dialog, notes editor, status sheet, and
 * custom-target modal so scrim/stop-propagation logic lives in one place.
 *
 * Accessibility: the card is `accessibilityViewIsModal` (iOS) / `role="dialog"`
 * + `aria-modal` (web) and is named by `title`. On web react-native-web's Modal
 * traps Tab inside the card and closes on Escape; the scrim is not a tab stop.
 * Focus returns to the trigger on close (see `returnFocusRef`).
 *
 * Motion: every sheet simply fades in (native: the Modal fade; web: the card
 * fades) — no slide or spring bounce. A released drag eases back to the dock.
 * Reduced motion: no animation.
 *
 * Toasts: while open, the sheet hosts the app's toasts inside its modal layer
 * (an RN `Modal` is its own window / portal, so the root toast host would sit
 * underneath it and an **Undo** could not be reached — B-01).
 *
 * Frosted backdrop on every bottom sheet and centered dialog (one look app-wide):
 * - iOS 26+ Liquid Glass → real `GlassView` material
 * - older iOS / Android → native `BlurView` (Android captures the root blur target)
 * - web → CSS `backdrop-filter`
 * A translucent card sits on top (`solid` → opaque card on the same frost).
 */
export function Sheet({
  visible,
  onClose,
  variant = "center",
  title,
  accessibilityLabel,
  showCloseButton,
  returnFocusRef,
  solid = false,
  scrollable = true,
  children,
  contentStyle,
}: SheetProps) {
  const { t } = useTranslation();
  const { colors, tokens, scheme } = useThemeTokens();
  const blurTarget = useBlurTarget();
  const insets = useAppSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const tv = isTV();
  const web = Platform.OS === "web";
  const reducedMotion = useHydrationSafeReducedMotion();
  const toastOutletId = useToastOutlet(visible);
  const isFullscreen = variant === "fullscreen";
  const dialogLabel = accessibilityLabel ?? title;
  // The grabber is the close affordance only on touch-first native bottom sheets.
  const hasGrabber = variant === "bottom" && !tv && !web;
  const closeButtonShown =
    showCloseButton ?? (isFullscreen || (title != null && (web || tv || !hasGrabber)));
  const hasHeader = title != null || closeButtonShown;
  // Large screens (tablet / desktop web): Material 3 caps bottom sheets at 640dp
  // and centers them instead of spanning a 1,900px window.
  const wideBottomSheet = !tv && windowWidth >= Breakpoints.tablet;
  const wideSheetInset = wideBottomSheet
    ? Math.max(0, (windowWidth - WIDE_BOTTOM_SHEET_MAX) / 2)
    : 0;
  const isBottom = variant === "bottom";
  // One look everywhere: every bottom sheet and centered dialog sits on the same
  // frosted-glass backdrop. `solid` only makes the CARD opaque (content-heavy
  // sheets read better on a solid card); it never drops the frost.
  const useSheetFrost = !isFullscreen;
  const bottomMaxHeight = windowHeight * 0.88;
  /** Handle zone + horizontal padding — subtracted from maxHeight for the scroll area. */
  const bottomSheetChrome = 64 + insets.bottom + (hasHeader ? Control.md + Spacing.two : 0);
  const bottomScrollMaxHeight = bottomMaxHeight - bottomSheetChrome;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const tvPad = tv
    ? { paddingHorizontal: TvLayout.contentPaddingX, paddingVertical: TvLayout.contentPaddingY }
    : null;

  // Freeze the content shown during the close animation. React Native's Modal
  // keeps rendering its children while it animates out; callers commonly clear
  // the backing state (selected item, confirm copy, …) in the same tick they
  // call onClose, which would blank the card mid-animation. Caching the last
  // children rendered while visible keeps the text/content stable until the
  // sheet has fully dismissed.
  const lastVisibleChildren = useRef<ReactNode>(children);
  if (visible) {
    lastVisibleChildren.current = children;
  }
  const renderedChildren = visible ? children : lastVisibleChildren.current;

  const dragY = useSharedValue(0);
  /** Web-only card fade-in (native fades through the Modal). Never applied to the frost node. */
  const cardOpacity = useSharedValue(1);
  const cardFadeStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));
  /**
   * Cover over the frost layer (1 → 0). Never animate opacity on the frost node
   * itself — CSS `backdrop-filter` (and some native blur paths) cannot sample
   * the host through an ancestor with opacity < 1.
   */
  const frostCoverOpacity = useSharedValue(1);
  const keyboardHeight = useAnimatedKeyboardHeight();
  const keyboardInsetStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboardHeight.value,
  }));
  const frostCoverStyle = useAnimatedStyle(() => ({
    opacity: frostCoverOpacity.value,
  }));

  useEffect(() => {
    if (visible) {
      dragY.value = 0;
      if (useSheetFrost) {
        frostCoverOpacity.value = 1;
        frostCoverOpacity.value = withDelay(
          FROST_FADE_DELAY_MS,
          withTiming(0, { duration: FROST_FADE_MS, easing: Easing.out(Easing.cubic) }),
        );
      } else {
        frostCoverOpacity.value = 0;
      }
    } else {
      frostCoverOpacity.value = 1;
    }
  }, [visible, dragY, frostCoverOpacity, useSheetFrost]);

  // Sheets simply fade in — no slide, no spring overshoot, so the content is
  // still and readable from the first frame. Native gets the fade from the
  // Modal (`animationType="fade"`); web's Modal can't fade without killing CSS
  // `backdrop-filter`, so the card fades itself there. Reduced motion: instant.
  useEffect(() => {
    if (!visible) {
      cardOpacity.value = web && !reducedMotion ? 0 : 1;
      return;
    }
    if (!web || reducedMotion) {
      cardOpacity.value = 1;
      return;
    }
    cardOpacity.value = 0;
    cardOpacity.value = withTiming(1, {
      duration: Durations.base,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, web, reducedMotion, cardOpacity]);

  // Focus restoration. Web: remember the element focused when the sheet opened
  // (layout effect — before react-native-web's focus trap moves focus inside)
  // and put focus back once the Modal has unmounted if it would otherwise be
  // lost to <body>. Native: move screen-reader / TV focus to `returnFocusRef`.
  // TV: no API reports the focused view, so the opener comes from the focus
  // memory fed by PressableScale (captured before the sheet's autoFocus moves
  // D-pad focus inside).
  const openerRef = useRef<HTMLElement | null>(null);
  const tvOpenerRef = useRef<{ origin: TvFocusHandle | null; path: string | null } | null>(null);
  const wasVisible = useRef(visible);
  useLayoutEffect(() => {
    if (!visible) return;
    if (web && typeof document !== "undefined") {
      const active = document.activeElement;
      openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    }
    if (tv) tvOpenerRef.current = { origin: captureTvFocusOrigin(), path: getCurrentPathname() };
  }, [visible, web, tv]);

  const restoreFocus = useCallback(() => {
    const target = returnFocusRef?.current;
    if (web) {
      if (typeof document === "undefined") return;
      const active = document.activeElement;
      const lost = active == null || active === document.body;
      if (target?.focus) {
        target.focus();
      } else if (lost && openerRef.current && document.contains(openerRef.current)) {
        openerRef.current.focus();
      }
      openerRef.current = null;
      return;
    }
    if (tv) {
      const opener = tvOpenerRef.current;
      if (target) target.focus?.();
      else if (opener) restoreTvFocus(opener.origin, opener.path);
      return;
    }
    if (!target) return;
    const node = findNodeHandle(target as never);
    if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
  }, [returnFocusRef, web, tv]);

  useEffect(() => {
    if (wasVisible.current && !visible && !web) {
      // Native: wait for the Modal's exit fade so the trigger is in the
      // accessibility tree again.
      const timer = setTimeout(restoreFocus, Durations.base);
      wasVisible.current = visible;
      return () => clearTimeout(timer);
    }
    wasVisible.current = visible;
  }, [visible, web, restoreFocus]);

  // Callers that unmount an open sheet (`{open && <Sheet visible …/>}`) never
  // flip `visible`: restore TV focus from the unmount instead.
  const restoreFocusRef = useRef(restoreFocus);
  restoreFocusRef.current = restoreFocus;
  useEffect(
    () => () => {
      if (tv && wasVisible.current) setTimeout(restoreFocusRef.current, Durations.base);
    },
    [tv],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dy > 1 && Math.abs(gesture.dy) >= Math.abs(gesture.dx),
        // Keep the handle drag from being stolen by the scroll view below.
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            dragY.value = gesture.dy;
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > DISMISS_DRAG_PX || gesture.vy > DISMISS_VELOCITY) {
            onCloseRef.current();
            // A dirty-form guard ("Keep editing?") can keep the sheet open:
            // dock the card again instead of leaving it dragged down (B-29).
            setTimeout(() => {
              if (visibleRef.current) dragY.value = withTiming(0, DOCK_TIMING);
            }, 0);
            return;
          }
          dragY.value = withTiming(0, DOCK_TIMING);
        },
        onPanResponderTerminate: () => {
          dragY.value = withTiming(0, DOCK_TIMING);
        },
      }),
    [dragY],
  );

  const bottomCardDragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const header = hasHeader ? (
    <View style={[styles.header, !title && styles.headerCloseOnly]}>
      {title != null ? (
        <ThemedText type="subtitle" heading={2} style={styles.headerTitle}>
          {title}
        </ThemedText>
      ) : null}
      {closeButtonShown ? (
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          size={IconSize.lg}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("common.close")}
          onPress={onClose}
          haptic={false}
        />
      ) : null}
    </View>
  ) : null;

  /** Names the card as a modal dialog (VoiceOver escape closes it). */
  const dialogA11y = {
    accessibilityViewIsModal: true,
    onAccessibilityEscape: onClose,
    accessibilityLabel: dialogLabel,
    ...(web ? { role: "dialog" as const, "aria-modal": true } : null),
  };

  const cardBody = (
    <TvFocusGuide autoFocus={tv} style={isFullscreen ? styles.fullscreenBody : undefined}>
      {isBottom ? (
        scrollable ? (
          // minHeight: 0 is required so flex can shrink the scroll view inside a
          // maxHeight-bounded card; without it tall content overflows and is clipped.
          <TvScrollView
            style={[styles.bottomScroll, { maxHeight: bottomScrollMaxHeight }]}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.bottomScrollContent,
              { paddingBottom: Spacing.two + insets.bottom },
            ]}
          >
            {renderedChildren}
          </TvScrollView>
        ) : (
          <View
            style={[
              styles.bottomScroll,
              styles.bottomScrollContent,
              { maxHeight: bottomScrollMaxHeight, paddingBottom: Spacing.two + insets.bottom },
            ]}
          >
            {renderedChildren}
          </View>
        )
      ) : (
        renderedChildren
      )}
    </TvFocusGuide>
  );

  /**
   * Translucent card over the frost layer. Liquid Glass needs a lighter wash so
   * the material reads; blur platforms share one wash so iOS / Android / web
   * look aligned.
   */
  const glassCardWash = withAlpha(
    colors.card,
    hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.38) : tokens.isDark ? 0.48 : 0.58,
  );
  const cardChrome =
    useSheetFrost && !solid ? { backgroundColor: glassCardWash } : { backgroundColor: colors.card };

  const bottomCardStyle = [
    styles.bottomCard,
    { maxHeight: bottomMaxHeight, borderColor: colors.border },
    cardChrome,
    tvPad,
    contentStyle,
  ];

  // The grabber used to announce "adjustable" with no actions, so VoiceOver /
  // TalkBack users heard a control that did nothing. Swipe-down (decrement) or
  // double-tap now closes the sheet, mirroring the drag gesture. Web has no
  // slider semantics to offer (and Escape / the scrim already close), so it is
  // hidden from assistive tech there.
  const dragHandleA11y =
    Platform.OS === "web"
      ? { accessibilityElementsHidden: true, importantForAccessibility: "no" as const }
      : {
          accessibilityRole: "adjustable" as const,
          accessibilityLabel: t("common.dragToClose"),
          accessibilityActions: [{ name: "decrement" as const }, { name: "activate" as const }],
          onAccessibilityAction: () => onCloseRef.current(),
        };

  const dragHandle = (
    <View
      style={styles.handleZone}
      {...(isBottom ? panResponder.panHandlers : undefined)}
      {...dragHandleA11y}
    >
      <View style={[styles.handle, { backgroundColor: tokens.track }]} />
    </View>
  );

  // elevation + zIndex: on Android Fabric, absolute-fill painted Pressables
  // beat overlapping siblings without elevation — card chrome then loses hits
  // to the scrim. Bottom card uses zIndex (not elevation) so Android does not
  // draw a square elevated plate behind top-only border radii.
  const centerCardElevation = Platform.OS === "android" ? 24 : 0;

  const bottomCard = (
    <Animated.View
      // iOS VoiceOver "escape" (two-finger Z) dismisses, like any modal view.
      {...dialogA11y}
      collapsable={false}
      style={[
        bottomCardStyle,
        styles.bottomCardDock,
        // Size from both insets: the base card is `width: "100%"`, which would
        // otherwise win and push the centered card off the end edge.
        wideBottomSheet && {
          left: wideSheetInset,
          right: wideSheetInset,
          width: "auto",
        },
        bottomCardDragStyle,
        cardFadeStyle,
        keyboardInsetStyle,
        { pointerEvents: "auto" },
      ]}
    >
      {/* TV remotes cannot drag: a grabber implies a gesture that doesn't exist
          there (Back closes the sheet). Keep the top breathing room instead. */}
      {tv ? <View style={styles.tvTopInset} /> : dragHandle}
      {header}
      {cardBody}
    </Animated.View>
  );

  const centerCardBody = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
      style={styles.centerKeyboard}
    >
      {header}
      {cardBody}
    </KeyboardAvoidingView>
  );

  const centerCard = (
    <Animated.View
      {...dialogA11y}
      // collapsable={false}: keeps a real host view on Android so the card (and
      // its buttons) stay hittable when overlapping the scrim.
      collapsable={false}
      style={[
        styles.centerCard,
        { borderColor: colors.border, elevation: centerCardElevation, pointerEvents: "auto" },
        cardChrome,
        tvPad,
        contentStyle,
        cardFadeStyle,
      ]}
    >
      {centerCardBody}
    </Animated.View>
  );

  // Scrim color lives on the Pressable so Android Fabric always builds a real
  // hit target (transparent pressables without paint often drop taps).
  const backdropA11y = {
    accessibilityLabel: t("common.close"),
    // react-native-web renders a real <button> for role="button"; the backdrop
    // is a sibling of the dialog card so nested-button DOM errors do not apply.
    accessibilityRole: web ? undefined : ("button" as const),
    // TV: the scrim is not a D-pad target (no focus ring; remote Back closes).
    // Web: pointer users click it, but it is never a Tab stop (Escape closes).
    focusable: !tv && !web,
    ...(web ? { tabIndex: -1 as const } : null),
  };

  /**
   * Full-viewport frost behind bottom sheets only.
   * - Liquid Glass (iOS 26+): real `GlassView`
   * - older iOS / Android: `BlurView` (Android captures the root blur target)
   * - web: CSS `backdrop-filter`
   * Reveal by fading a solid cover off the frost — never animate frost opacity.
   */
  const androidBackdropCapture = Platform.OS === "android" && blurTarget != null;
  const blurTint: BlurTint =
    scheme === "dark" ? "systemChromeMaterialDark" : "systemChromeMaterialLight";

  let frostMaterial: ReactNode = null;
  if (useSheetFrost) {
    if (hasLiquidGlass) {
      frostMaterial = (
        <GlassView
          glassEffectStyle="regular"
          colorScheme={scheme}
          style={StyleSheet.absoluteFill}
        />
      );
    } else if (Platform.OS === "web") {
      frostMaterial = (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: withAlpha(scheme === "dark" ? "#000000" : "#ffffff", 0.08),
              ...WEB_BACKDROP_FROST,
            },
          ]}
        />
      );
    } else {
      frostMaterial = (
        <BlurView
          tint={blurTint}
          intensity={90}
          blurMethod={androidBackdropCapture ? "dimezisBlurViewSdk31Plus" : undefined}
          blurTarget={androidBackdropCapture ? blurTarget : undefined}
          style={StyleSheet.absoluteFill}
        />
      );
    }
  }

  const frostedBackdrop = useSheetFrost ? (
    <>
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>{frostMaterial}</View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          frostCoverStyle,
          { backgroundColor: withAlpha(colors.background, 0.94), pointerEvents: "none" },
        ]}
      />
    </>
  ) : null;

  // Web: `fade` animates opacity on the Modal root, which kills CSS
  // `backdrop-filter`, so web uses none + the frost cover. Native fades the
  // scrim and card together (no slide — see the fade effect above); a
  // fullscreen surface slides up unless reduced motion asks for a fade.
  const modalAnimation: "none" | "fade" | "slide" = web
    ? "none"
    : isFullscreen && !reducedMotion
      ? "slide"
      : "fade";

  // Outer View wrapper: Fabric + Reanimated bug — a Modal that shares a React
  // tree with useAnimatedStyle siblings (e.g. tasbeeh ring / PressableScale)
  // can mount visually but ignore all touches. Wrapping Modal in a plain View
  // restores hit-testing (see reanimated#6659 / #7199).
  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType={modalAnimation}
        onRequestClose={onClose}
        // Web only: runs after the Modal (and its focus trap) has unmounted.
        {...(web ? { onDismiss: restoreFocus } : null)}
        statusBarTranslucent
        // iOS defaults a Modal to portrait only: an iPad / landscape phone
        // would rotate under any sheet (B-12, night surface).
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        // Keep the host screen in the view hierarchy so glass/blur can sample
        // it through the transparent modal (iOS).
        {...(Platform.OS === "ios" ? { presentationStyle: "overFullScreen" as const } : null)}
      >
        {/* The surface sits in its own layer so the toast outlet below is not a
            sibling of the `accessibilityViewIsModal` view (iOS VoiceOver hides
            a modal view's siblings). */}
        <View style={styles.modalLayer} collapsable={false}>
          {isFullscreen ? (
            <View
              {...dialogA11y}
              collapsable={false}
              style={[
                styles.fullscreen,
                {
                  backgroundColor: colors.background,
                  paddingTop: insets.top + Spacing.two,
                  paddingBottom: insets.bottom + Spacing.two,
                },
                tvPad,
                contentStyle,
              ]}
            >
              {header}
              {cardBody}
            </View>
          ) : isBottom ? (
            <View style={styles.scrimRoot}>
              {frostedBackdrop}
              <Pressable
                collapsable={false}
                style={[styles.backdrop, { backgroundColor: tokens.scrim }]}
                onPress={onClose}
                {...backdropA11y}
              />
              {bottomCard}
            </View>
          ) : (
            <View style={styles.scrimRoot}>
              {frostedBackdrop}
              <Pressable
                collapsable={false}
                style={[styles.backdrop, { backgroundColor: tokens.scrim }]}
                onPress={onClose}
                {...backdropA11y}
              />
              <View
                style={[StyleSheet.absoluteFill, styles.scrimCenter, { pointerEvents: "box-none" }]}
              >
                {centerCard}
              </View>
            </View>
          )}
        </View>
        {toastOutletId ? <ToastHost outletId={toastOutletId} /> : null}
      </Modal>
    </View>
  );
}

const SUPPORTED_ORIENTATIONS: ModalProps["supportedOrientations"] = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right",
];

/** Material 3 large-screen bottom sheet width cap. */
const WIDE_BOTTOM_SHEET_MAX = 640;

const styles = StyleSheet.create({
  /** Fills the Modal root like `scrimRoot` (web's Modal content is a fixed full-viewport box). */
  modalLayer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrimRoot: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrimCenter: {
    justifyContent: "center",
    padding: Spacing.four,
  },
  /** Full-screen tappable dimmer behind sheet / dialog cards. */
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  /** Dock the bottom sheet to the bottom edge without a full-screen hit wrapper. */
  bottomCardDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerCard: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    padding: Spacing.four,
    gap: Spacing.two,
    maxWidth: tvDp(520),
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
    zIndex: ZIndex.raised,
  },
  centerKeyboard: {
    width: "100%",
    gap: Spacing.two,
  },
  bottomCard: {
    width: "100%",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    overflow: "hidden",
    zIndex: ZIndex.raised,
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  fullscreenBody: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  headerCloseOnly: {
    justifyContent: "flex-end",
  },
  headerTitle: {
    flex: 1,
  },
  bottomScroll: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  bottomScrollContent: {
    gap: Spacing.two,
  },
  handleZone: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    minHeight: tvDp(44),
    zIndex: ZIndex.raised,
  },
  handle: {
    width: tvDp(40),
    height: 4,
    borderRadius: 2,
  },
  tvTopInset: {
    height: Spacing.four,
  },
});
