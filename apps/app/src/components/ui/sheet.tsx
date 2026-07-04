import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  /** "center" for dialogs, "bottom" for action sheets. */
  variant?: "center" | "bottom";
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
  children,
  contentStyle,
}: SheetProps) {
  const { colors, tokens } = useThemeTokens();
  const { height: windowHeight } = useWindowDimensions();
  const isBottom = variant === "bottom";
  const bottomMaxHeight = windowHeight * 0.88;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <Pressable
        // Intentionally NOT accessibilityRole="button": on react-native-web a
        // button role renders a real <button>, which would wrap the dialog's
        // own buttons and trigger a nested-<button> DOM error. This is just a
        // tap-to-dismiss backdrop; keyboard users close via Escape (handled by
        // Modal's onRequestClose).
        style={[
          styles.scrim,
          isBottom ? styles.scrimBottom : styles.scrimCenter,
          { backgroundColor: tokens.scrim },
        ]}
        onPress={onClose}
      >
        <Pressable
          accessibilityViewIsModal
          style={[
            isBottom ? styles.bottomCard : styles.centerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            isBottom ? { maxHeight: bottomMaxHeight } : null,
            contentStyle,
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          {isBottom ? <View style={[styles.handle, { backgroundColor: tokens.track }]} /> : null}
          {children}
        </Pressable>
      </Pressable>
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
    paddingBottom: Spacing.five,
    gap: Spacing.two,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.two,
  },
});
