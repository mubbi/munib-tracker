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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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

  const bottomCardStyle = [
    styles.bottomCard,
    { maxHeight: bottomMaxHeight, borderColor: colors.border },
    solid ? { backgroundColor: colors.card } : null,
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

  // Scrim color lives on the Pressable (not a box-none parent) so Android
  // always builds a real hit target. Transparent pressables without a paint
  // often drop taps on Fabric.
  const backdrop = (
    <Pressable
      style={[styles.backdrop, { backgroundColor: tokens.scrim }]}
      onPress={onClose}
      accessibilityLabel={t("common.close")}
      // react-native-web renders a real <button> for role="button"; the backdrop
      // is a sibling of the dialog card so nested-button DOM errors do not apply.
      accessibilityRole={Platform.OS === "web" ? undefined : "button"}
    />
  );

  /**
   * Frosted-glass fill (blur + a translucent card wash for text legibility).
   * Shared by both variants so every sheet reads the same. On iOS 26 keep the
   * wash light so the real Liquid Glass material reads through; the blur
   * fallback needs more opacity to stay legible over busy content unless Android
   * backdrop capture is active (real blur under the wash).
   */
  const androidBackdropBlur = Platform.OS === "android";
  const glassFill = (
    <View style={[StyleSheet.absoluteFill, styles.glassFill, { pointerEvents: "none" }]}>
      <GlassSurface
        backdropCapture={androidBackdropBlur}
        style={StyleSheet.absoluteFill}
        intensity={50}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: withAlpha(
              colors.card,
              hasLiquidGlass
                ? tokens.isDark
                  ? 0.28
                  : 0.4
                : androidBackdropBlur
                  ? tokens.isDark
                    ? 0.3
                    : 0.42
                  : tokens.isDark
                    ? 0.5
                    : 0.62,
            ),
          },
        ]}
      />
    </View>
  );

  const bottomCard = (
    <Animated.View
      accessibilityViewIsModal
      style={[bottomCardStyle, bottomCardDragStyle, isBottom ? keyboardInsetStyle : null]}
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
        { borderColor: colors.border },
        solid ? { backgroundColor: colors.card } : null,
        contentStyle,
      ]}
    >
      {!solid ? glassFill : null}
      {centerCardBody}
    </View>
  );

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
        <View
          style={[styles.scrim, isBottom ? styles.scrimBottom : styles.scrimCenter]}
          pointerEvents="box-none"
        >
          {/*
            Absolute-fill backdrop behind the card so taps on the dimmed region
            dismiss. The card is never a wrapping Pressable so nested buttons
            receive touches on iOS (stopPropagation is web-only).
          */}
          {backdrop}
          {isBottom ? bottomCard : centerCard}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
  },
  scrimBottom: {
    justifyContent: "flex-end",
  },
  scrimCenter: {
    justifyContent: "center",
    padding: Spacing.four,
  },
  /** Full-screen tappable dimmer behind the sheet card. */
  backdrop: {
    ...StyleSheet.absoluteFill,
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
    zIndex: 1,
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
    zIndex: 1,
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
  /** Sits behind the card content so the blur/wash never covers inputs on web. */
  glassFill: {
    zIndex: -1,
  },
});
