import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
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
  const { tokens } = useThemeTokens();

  return (
    <Sheet visible={visible} onClose={onClose}>
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
    </Sheet>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
