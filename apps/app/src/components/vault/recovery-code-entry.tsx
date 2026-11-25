import { useTranslation } from "react-i18next";

import { TextField } from "@/components/ui/text-field";
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
  const count = parseRecoveryWords(value).length;
  const complete = count === VAULT_RECOVERY_WORD_COUNT;
  const valid = complete && isRecoveryCodeWellFormed(value);

  // Progress / "looks right" is helper text; a failed checksum is an announced
  // field error (icon + text, not colour alone).
  return (
    <TextField
      label={t("vault.recoveryEntry.label")}
      helperText={
        valid
          ? t("vault.recoveryEntry.looksRight")
          : t("vault.recoveryEntry.progress", {
              current: count,
              total: VAULT_RECOVERY_WORD_COUNT,
            })
      }
      error={complete && !valid ? t("vault.recoveryEntry.checksumFailed") : undefined}
      value={value}
      onChangeText={onChangeText}
      multiline
      minLines={4}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="off"
      spellCheck={false}
      importantForAutofill="no"
      onSubmitEditing={onSubmitEditing}
      placeholder={t("vault.recoveryEntry.placeholder")}
      accessibilityHint={t("vault.recoveryEntry.hint", { total: VAULT_RECOVERY_WORD_COUNT })}
      inputStyle={{ writingDirection: "ltr" }}
    />
  );
}
