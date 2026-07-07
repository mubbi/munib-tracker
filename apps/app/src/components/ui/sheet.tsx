import { type ReactNode, useEffect, useMemo, useRef } from "react";
import {
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
  children,
  contentStyle,
}: SheetProps) {
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

  const dragY = useSharedValue(0);

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
      {children}
    </ScrollView>
  ) : (
    children
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
      accessibilityLabel="Drag down to close"
    >
      <View style={[styles.handle, { backgroundColor: tokens.track }]} />
    </View>
  );

  const backdrop = (
    <Pressable
      style={isBottom ? styles.backdropBottom : StyleSheet.absoluteFill}
      onPress={onClose}
      accessibilityLabel="Close"
      // react-native-web renders a real <button> for role="button"; the backdrop
      // is a sibling of the dialog card so nested-button DOM errors do not apply.
      accessibilityRole={Platform.OS === "web" ? undefined : "button"}
    />
  );

  const bottomCard = (
    <Animated.View accessibilityViewIsModal style={[bottomCardStyle, bottomCardDragStyle]}>
      {!solid ? (
        <>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
          </View>
          {/* A card wash for text legibility. On iOS 26 keep it light so the real
              Liquid Glass material reads through; the blur fallback needs more
              opacity to stay legible over busy content. */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: withAlpha(
                  colors.card,
                  hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.5 : 0.62,
                ),
                pointerEvents: "none",
              },
            ]}
          />
        </>
      ) : null}
      {dragHandle}
      {cardBody}
    </Animated.View>
  );

  const centerCard = (
    <View
      accessibilityViewIsModal
      style={[
        styles.centerCard,
        { backgroundColor: colors.card, borderColor: colors.border, zIndex: 1 },
        contentStyle,
      ]}
    >
      {cardBody}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <View
        pointerEvents="box-none"
        style={[
          styles.scrim,
          isBottom ? styles.scrimBottom : styles.scrimCenter,
          { backgroundColor: tokens.scrim },
        ]}
      >
        {/*
          Bottom sheets: an absolute-fill backdrop behind the card so taps on
          the dimmed region always dismiss. Center dialogs: same pattern behind
          the centred card. The card is never a wrapping Pressable so nested
          buttons receive touches on iOS (stopPropagation is web-only).
        */}
        {backdrop}
        {isBottom ? bottomCard : centerCard}
      </View>
    </Modal>
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
  /** Full-screen tappable scrim behind a bottom sheet card. */
  backdropBottom: {
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
});
