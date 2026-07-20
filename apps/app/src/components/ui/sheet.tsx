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
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useAnimatedKeyboardHeight } from "@/hooks/use-animated-keyboard-height";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Drag distance (px) before a bottom sheet dismisses. */
const DISMISS_DRAG_PX = 72;
/** Downward flick velocity that dismisses even below {@link DISMISS_DRAG_PX}. */
const DISMISS_VELOCITY = 0.75;

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
  const { colors, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isBottom = variant === "bottom";
  const bottomMaxHeight = windowHeight * 0.88;
  /** Handle zone + horizontal padding — subtracted from maxHeight for the scroll area. */
  const bottomSheetChrome = 64 + insets.bottom;
  const bottomScrollMaxHeight = bottomMaxHeight - bottomSheetChrome;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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
  const keyboardHeight = useAnimatedKeyboardHeight();
  const keyboardInsetStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboardHeight.value,
  }));

  useEffect(() => {
    if (visible) {
      dragY.value = 0;
    }
  }, [visible, dragY]);

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

  const cardBody = isBottom ? (
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
  );

  /**
   * Corner radii for the frosted fill. BlurView / GlassView ignore parent
   * `overflow: "hidden"` — radii must live on the glass surface itself or a
   * square plate peeks above the rounded sheet (see GlassSurface docs).
   */
  const bottomGlassRadii = {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderCurve: "continuous" as const,
    overflow: "hidden" as const,
  };
  const centerGlassRadii = {
    borderRadius: Radius.lg,
    borderCurve: "continuous" as const,
    overflow: "hidden" as const,
  };
  const glassRadii = isBottom ? bottomGlassRadii : centerGlassRadii;

  /**
   * Base chrome on the rounded card view (not only on absolute children).
   * Android elevation / outline follow this background; without it a square
   * material plate shows behind top-only radii. Off Liquid Glass the wash is
   * nearly opaque — Modal cannot blur the host screen, so a light translucency
   * is enough without stacking a non-clipping BlurView.
   */
  const glassCardWash = withAlpha(
    colors.card,
    hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.94 : 0.97,
  );
  const cardChrome = solid ? { backgroundColor: colors.card } : { backgroundColor: glassCardWash };

  const bottomCardStyle = [
    styles.bottomCard,
    { maxHeight: bottomMaxHeight, borderColor: colors.border },
    cardChrome,
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

  /**
   * Frosted fill only where Liquid Glass can actually read through. Elsewhere
   * Modal cannot blur the host screen (backdropCapture is off), and BlurView
   * overdraws a square plate above the rounded sheet — the card chrome wash
   * alone is the visible surface.
   */
  const glassFill = hasLiquidGlass ? (
    <View style={[StyleSheet.absoluteFill, glassRadii, { pointerEvents: "none" }]}>
      <GlassSurface
        // Never capture the Android blur target inside Modal — the native
        // BlurView layer can sit above descendants and eat Cancel/Save taps
        // while scrim presses still work.
        backdropCapture={false}
        style={[StyleSheet.absoluteFill, glassRadii, { pointerEvents: "none" }]}
        intensity={50}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: glassCardWash,
            pointerEvents: "none",
          },
        ]}
      />
    </View>
  ) : null;

  // elevation + zIndex: on Android Fabric, absolute-fill painted Pressables
  // beat in-flow siblings without elevation — center-card chrome then loses
  // hits to the scrim. Bottom sheets stack the scrim above the card in a
  // column (no overlap), so elevation must stay off — Android draws a square
  // elevated plate behind top-only border radii.
  const centerCardElevation = Platform.OS === "android" ? 24 : 0;

  const bottomCard = (
    <Animated.View
      accessibilityViewIsModal
      collapsable={false}
      style={[bottomCardStyle, bottomCardDragStyle, keyboardInsetStyle, { pointerEvents: "auto" }]}
    >
      {!solid ? glassFill : null}
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
      // its buttons) stay hittable when a frosted fill sits behind the content.
      collapsable={false}
      style={[
        styles.centerCard,
        { borderColor: colors.border, elevation: centerCardElevation, pointerEvents: "auto" },
        cardChrome,
        contentStyle,
      ]}
    >
      {!solid ? glassFill : null}
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

  // Outer View wrapper: Fabric + Reanimated bug — a Modal that shares a React
  // tree with useAnimatedStyle siblings (e.g. tasbeeh ring / PressableScale)
  // can mount visually but ignore all touches. Wrapping Modal in a plain View
  // restores hit-testing (see reanimated#6659 / #7199).
  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType={isBottom ? "slide" : "fade"}
        onRequestClose={onClose}
        statusBarTranslucent
      >
        {isBottom ? (
          // Bottom: flex Pressable fills space above the card. Avoids relying on
          // box-none pass-through (broken/unreliable on web + some Fabric builds)
          // while keeping the card as a non-Pressable sibling so nested buttons work.
          <View style={styles.scrimRoot}>
            <Pressable
              collapsable={false}
              style={[styles.backdropFlex, { backgroundColor: tokens.scrim }]}
              onPress={onClose}
              {...backdropA11y}
            />
            {bottomCard}
          </View>
        ) : (
          // Center: absolute-fill dimmer under a box-none overlay that centers
          // the card — taps in the padded margin hit the dimmer Pressable.
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
  },
  scrimCenter: {
    justifyContent: "center",
    padding: Spacing.four,
  },
  /** Full-screen tappable dimmer behind a centered dialog card. */
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  /** Grows into the space above a bottom sheet card; tap dismisses. */
  backdropFlex: {
    flex: 1,
    // Ensure a hit target even if the card is nearly full-height.
    minHeight: 48,
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
