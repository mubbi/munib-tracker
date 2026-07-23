import { type BlurTint, BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { hasLiquidGlass } from "@/components/ui/glass-surface";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Durations } from "@/constants/motion";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useAnimatedKeyboardHeight } from "@/hooks/use-animated-keyboard-height";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useBlurTarget } from "@/providers/blur-target-provider";

/** Drag distance (px) before a bottom sheet dismisses. */
const DISMISS_DRAG_PX = 72;
/** Downward flick velocity that dismisses even below {@link DISMISS_DRAG_PX}. */
const DISMISS_VELOCITY = 0.75;
/** Brief hold so the frost material can mount before the reveal cover eases out. */
const FROST_FADE_DELAY_MS = 48;
/** Soft reveal — a solid cover fades out (never animate opacity on the frost node). */
const FROST_FADE_MS = Durations.base;

/** CSS frost — applied as a plain style object so web gets both prefixes. */
const WEB_BACKDROP_FROST = {
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
} as ViewStyle;

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  /** "center" for dialogs, "bottom" for action sheets. */
  variant?: "center" | "bottom";
  /** Skip frosted glass — use a solid card (better for content-heavy sheets). */
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
 * Frosted look is bottom-sheet only (non-`solid`):
 * - iOS 26+ Liquid Glass → real `GlassView` material
 * - older iOS / Android → native `BlurView` (Android captures the root blur target)
 * - web → CSS `backdrop-filter`
 * A translucent card sits on top. Center dialogs stay opaque.
 */
export function Sheet({
  visible,
  onClose,
  variant = "center",
  solid = false,
  scrollable = true,
  children,
  contentStyle,
}: SheetProps) {
  const { t } = useTranslation();
  const { colors, tokens, scheme } = useThemeTokens();
  const blurTarget = useBlurTarget();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const tv = isTV();
  const isBottom = variant === "bottom";
  const useSheetFrost = isBottom && !solid;
  const bottomMaxHeight = windowHeight * 0.88;
  /** Handle zone + horizontal padding — subtracted from maxHeight for the scroll area. */
  const bottomSheetChrome = 64 + insets.bottom;
  const bottomScrollMaxHeight = bottomMaxHeight - bottomSheetChrome;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
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
            return;
          }
          dragY.value = withSpring(0, { damping: 20, stiffness: 300 });
        },
        onPanResponderTerminate: () => {
          dragY.value = withSpring(0, { damping: 20, stiffness: 300 });
        },
      }),
    [dragY],
  );

  const bottomCardDragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const cardBody = (
    <TvFocusGuide autoFocus={tv}>
      {isBottom ? (
        scrollable ? (
          // minHeight: 0 is required so flex can shrink the scroll view inside a
          // maxHeight-bounded card; without it tall content overflows and is clipped.
          <ScrollView
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
          </ScrollView>
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
  const cardChrome = useSheetFrost
    ? { backgroundColor: glassCardWash }
    : { backgroundColor: colors.card };

  const bottomCardStyle = [
    styles.bottomCard,
    { maxHeight: bottomMaxHeight, borderColor: colors.border },
    cardChrome,
    tvPad,
    contentStyle,
  ];

  const dragHandle = (
    <View
      style={styles.handleZone}
      {...(isBottom ? panResponder.panHandlers : undefined)}
      accessibilityRole="adjustable"
      accessibilityLabel={t("common.dragToClose")}
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
      accessibilityViewIsModal
      collapsable={false}
      style={[
        bottomCardStyle,
        styles.bottomCardDock,
        bottomCardDragStyle,
        keyboardInsetStyle,
        { pointerEvents: "auto" },
      ]}
    >
      {dragHandle}
      {cardBody}
    </Animated.View>
  );

  const centerCardBody = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
      style={styles.centerKeyboard}
    >
      {cardBody}
    </KeyboardAvoidingView>
  );

  const centerCard = (
    <View
      accessibilityViewIsModal
      // collapsable={false}: keeps a real host view on Android so the card (and
      // its buttons) stay hittable when overlapping the scrim.
      collapsable={false}
      style={[
        styles.centerCard,
        { borderColor: colors.border, elevation: centerCardElevation, pointerEvents: "auto" },
        cardChrome,
        tvPad,
        contentStyle,
      ]}
    >
      {centerCardBody}
    </View>
  );

  // Scrim color lives on the Pressable so Android Fabric always builds a real
  // hit target (transparent pressables without paint often drop taps).
  const backdropA11y = {
    accessibilityLabel: t("common.close"),
    // react-native-web renders a real <button> for role="button"; the backdrop
    // is a sibling of the dialog card so nested-button DOM errors do not apply.
    accessibilityRole: Platform.OS === "web" ? undefined : ("button" as const),
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

  // Outer View wrapper: Fabric + Reanimated bug — a Modal that shares a React
  // tree with useAnimatedStyle siblings (e.g. tasbeeh ring / PressableScale)
  // can mount visually but ignore all touches. Wrapping Modal in a plain View
  // restores hit-testing (see reanimated#6659 / #7199).
  return (
    <View>
      <Modal
        visible={visible}
        transparent
        // Web: `fade` animates opacity on the Modal root, which kills CSS
        // `backdrop-filter`. Native keeps fade; web uses none + frost cover.
        animationType={Platform.OS === "web" ? "none" : "fade"}
        onRequestClose={onClose}
        statusBarTranslucent
        // Keep the host screen in the view hierarchy so glass/blur can sample
        // it through the transparent modal (iOS).
        {...(Platform.OS === "ios" ? { presentationStyle: "overFullScreen" as const } : null)}
      >
        {isBottom ? (
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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.two,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
    zIndex: 2,
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
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    overflow: "hidden",
    zIndex: 2,
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
    minHeight: 44,
    zIndex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
