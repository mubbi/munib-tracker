import type { ReactNode } from "react";
import { Modal, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

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
  const isBottom = variant === "bottom";

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.scrim,
          isBottom ? styles.scrimBottom : styles.scrimCenter,
          { backgroundColor: tokens.scrim },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={[
            isBottom ? styles.bottomCard : styles.centerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            contentStyle,
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          {isBottom ? <View style={styles.handle} /> : null}
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
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.4)",
    marginBottom: Spacing.two,
  },
});
