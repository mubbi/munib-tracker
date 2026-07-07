import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassSurface } from "@/components/ui/glass-surface";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

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

  const cardBody = isBottom ? (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.bottomScrollContent}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.scrim,
          isBottom ? styles.scrimBottom : styles.scrimCenter,
          { backgroundColor: tokens.scrim },
        ]}
      >
        {/* Full-screen dismiss target sits behind the card so nested buttons
            inside the sheet receive touches on iOS (a wrapping Pressable card
            competes with child pressables; stopPropagation is web-only). */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
          accessibilityRole="button"
        />
        <View
          accessibilityViewIsModal
          style={[
            isBottom ? styles.bottomCard : styles.centerCard,
            // Bottom action sheets are frosted glass (native iOS pattern); the
            // card stays transparent so the GlassSurface behind it shows. Centre
            // dialogs keep a solid card for crisp text.
            isBottom
              ? solid
                ? {
                    maxHeight: bottomMaxHeight,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    paddingBottom: Spacing.five + insets.bottom,
                  }
                : {
                    maxHeight: bottomMaxHeight,
                    borderColor: colors.border,
                    paddingBottom: Spacing.five + insets.bottom,
                  }
              : { backgroundColor: colors.card, borderColor: colors.border },
            contentStyle,
          ]}
        >
          {isBottom && !solid ? (
            <>
              <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.5 : 0.62),
                    pointerEvents: "none",
                  },
                ]}
              />
              <View style={[styles.handle, { backgroundColor: tokens.track }]} />
            </>
          ) : null}
          {isBottom && solid ? (
            <View style={[styles.handle, { backgroundColor: tokens.track }]} />
          ) : null}
          {cardBody}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
  },
  scrimCenter: {
    justifyContent: "center",
    padding: Spacing.four,
  },
  scrimBottom: {
    justifyContent: "flex-end",
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
    padding: Spacing.four,
    gap: Spacing.two,
    overflow: "hidden",
  },
  bottomScrollContent: {
    gap: Spacing.two,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.two,
  },
});
