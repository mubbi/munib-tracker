import { useTranslation } from "react-i18next";
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
  /** Cancel button; defaults to `onClose` when omitted. */
  onCancel?: () => void;
  /** Backdrop dismiss — does not run when the cancel button is pressed. */
  onClose: () => void;
};

/** A themed, cross-platform confirmation dialog (React Native Alert is flaky on web). */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  const { tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {message ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {message}
        </ThemedText>
      ) : null}
      <View style={styles.actions}>
        <Button
          label={cancelLabel ?? t("common.cancel")}
          variant="ghost"
          fullWidth
          preferredFocus
          onPress={onCancel ?? onClose}
        />
        <Button
          label={confirmLabel ?? t("common.confirm")}
          fullWidth
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
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
