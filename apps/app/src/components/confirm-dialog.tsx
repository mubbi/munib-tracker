import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** A themed, cross-platform confirmation dialog (React Native Alert is flaky on web). */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.scrim, { backgroundColor: tokens.scrim }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={(event) => event.stopPropagation()}
        >
          <ThemedText type="subtitle">{title}</ThemedText>
          {message ? (
            <ThemedText type="small" themeColor="mutedForeground">
              {message}
            </ThemedText>
          ) : null}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="ghost" onPress={onClose} />
            <Button
              label={confirmLabel}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={destructive ? { backgroundColor: tokens.status.danger.color } : undefined}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.four,
  },
  sheet: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.two,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
