import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  isRecoveryCodeWellFormed,
  parseRecoveryWords,
  VAULT_RECOVERY_WORD_COUNT,
} from "@/lib/vault/keyring";

type RecoveryCodeEntryProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
};

/** Multi-line entry for the 24-word code; counts words and checks the built-in checksum. */
export function RecoveryCodeEntry({
  value,
  onChangeText,
  onSubmitEditing,
}: RecoveryCodeEntryProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const count = parseRecoveryWords(value).length;
  const complete = count === VAULT_RECOVERY_WORD_COUNT;
  const valid = complete && isRecoveryCodeWellFormed(value);

  return (
    <View style={styles.wrap}>
      <ThemedText type="label" themeColor="mutedForeground">
        {t("vault.recoveryEntry.label")}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        importantForAutofill="no"
        onSubmitEditing={onSubmitEditing}
        placeholder={t("vault.recoveryEntry.placeholder")}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={t("vault.recoveryEntry.label")}
        accessibilityHint={t("vault.recoveryEntry.hint", { total: VAULT_RECOVERY_WORD_COUNT })}
        style={[styles.input, tokens.inputSurface, { color: colors.foreground }]}
      />
      <ThemedText
        type="caption"
        accessibilityLiveRegion="polite"
        style={{
          color: valid
            ? tokens.status.success.text
            : complete
              ? tokens.status.danger.text
              : colors.mutedForeground,
        }}
      >
        {valid
          ? t("vault.recoveryEntry.looksRight")
          : complete
            ? t("vault.recoveryEntry.checksumFailed")
            : t("vault.recoveryEntry.progress", {
                current: count,
                total: VAULT_RECOVERY_WORD_COUNT,
              })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  input: {
    minHeight: 112,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    textAlignVertical: "top",
    writingDirection: "ltr",
  },
});
