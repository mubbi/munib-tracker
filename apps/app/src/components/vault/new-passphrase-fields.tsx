import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { assessPassphrase } from "@/lib/vault/passphrase-strength";

import { PassphraseField } from "./passphrase-field";
import { PassphraseStrengthMeter } from "./passphrase-strength-meter";

/**
 * True when a new passphrase may be submitted: it meets the minimum length and
 * the confirmation matches exactly. Shared by every "choose a passphrase" flow.
 */
export function canSubmitNewPassphrase(passphrase: string, confirm: string): boolean {
  return assessPassphrase(passphrase).meetsMinimum && confirm === passphrase;
}

type NewPassphraseFieldsProps = {
  value: string;
  onChangeText: (value: string) => void;
  confirm: string;
  onChangeConfirm: (value: string) => void;
  /** Label of the first field ("Passphrase" when setting up, "New passphrase" when changing). */
  label?: string;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
};

/**
 * New passphrase + strength meter + confirmation (error prevention: a typo in a
 * passphrase nobody can reset would lock the person out of their cloud copy).
 * Used by the sync opt-in, the post-recovery reset and "Change passphrase".
 */
export function NewPassphraseFields({
  value,
  onChangeText,
  confirm,
  onChangeConfirm,
  label,
  autoFocus,
  onSubmitEditing,
}: NewPassphraseFieldsProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const mismatch = confirm.length > 0 && confirm !== value;
  return (
    <>
      <PassphraseField
        label={label ?? t("vault.passphrase.label")}
        value={value}
        onChangeText={onChangeText}
        purpose="newPassword"
        autoFocus={autoFocus}
      />
      <PassphraseStrengthMeter passphrase={value} />
      <PassphraseField
        label={t("vault.passphrase.confirmLabel")}
        value={confirm}
        onChangeText={onChangeConfirm}
        purpose="newPassword"
        onSubmitEditing={onSubmitEditing}
      />
      {mismatch ? (
        <ThemedText
          type="caption"
          accessibilityLiveRegion="polite"
          style={{ color: tokens.status.danger.text }}
        >
          {t("vault.passphrase.mismatch")}
        </ThemedText>
      ) : null}
    </>
  );
}
