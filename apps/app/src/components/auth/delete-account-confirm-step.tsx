import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type DeleteAccountConfirmStepProps = {
  typed: string;
  onTypedChange: (typed: string) => void;
  acknowledged: boolean;
  onToggleAcknowledged: () => void;
  disabled: boolean;
};

/** Step 3: type the confirmation word and tick the "this is permanent" acknowledgement. */
export function DeleteAccountConfirmStep({
  typed,
  onTypedChange,
  acknowledged,
  onToggleAcknowledged,
  disabled,
}: DeleteAccountConfirmStepProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <>
      <ThemedText type="small" style={styles.blockTitle}>
        {t("profile.deleteAccountStep3Title")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.step3Body}>
        {t("profile.deleteAccountStep3Body")}
      </ThemedText>
      <TextInput
        value={typed}
        onChangeText={onTypedChange}
        placeholder={t("profile.deleteAccountTypePlaceholder")}
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!disabled}
        style={[styles.confirmInput, tokens.inputSurface, { color: colors.foreground }]}
      />
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: acknowledged }}
        haptic="selection"
        onPress={onToggleAcknowledged}
        style={styles.ackRow}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: acknowledged ? colors.accent : colors.border,
              backgroundColor: acknowledged ? colors.accent : "transparent",
            },
          ]}
        >
          {acknowledged ? (
            <ThemedText type="caption" style={{ color: colors.accentForeground }}>
              ✓
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" style={styles.ackLabel}>
          {t("profile.deleteAccountAcknowledge")}
        </ThemedText>
      </PressableScale>
    </>
  );
}

const styles = StyleSheet.create({
  blockTitle: {
    fontWeight: "700",
  },
  step3Body: {
    marginBottom: Spacing.one,
  },
  confirmInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    fontWeight: "600",
  },
  ackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ackLabel: {
    flex: 1,
    lineHeight: 20,
  },
});
