import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";
import { ACCOUNT_CLOSURE_CONFIRMATION } from "@/lib/auth/account-closure-reasons";

type DeleteAccountConfirmStepProps = {
  typed: string;
  onTypedChange: (typed: string) => void;
  acknowledged: boolean;
  onToggleAcknowledged: () => void;
  disabled: boolean;
  /** Guest copy: erase this device instead of closing an account (F-22). */
  guest?: boolean;
};

/**
 * Step 3: type the confirmation word (kept as "DELETE" — D-UX6) into a labelled
 * field and tick the "this is permanent" acknowledgement (D-44 / F-30).
 */
export function DeleteAccountConfirmStep({
  typed,
  onTypedChange,
  acknowledged,
  onToggleAcknowledged,
  disabled,
  guest = false,
}: DeleteAccountConfirmStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <ThemedText type="smallBold" heading={3}>
        {t(guest ? "profile.eraseStep3Title" : "profile.deleteAccountStep3Title")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.step3Body}>
        {t(guest ? "profile.eraseStep3Body" : "profile.deleteAccountStep3Body")}
      </ThemedText>
      <TextField
        label={t("profile.deleteAccountTypeLabel", { word: ACCOUNT_CLOSURE_CONFIRMATION })}
        value={typed}
        onChangeText={onTypedChange}
        placeholder={t("profile.deleteAccountTypePlaceholder")}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
      />
      <Checkbox
        label={t(guest ? "profile.eraseAcknowledge" : "profile.deleteAccountAcknowledge")}
        checked={acknowledged}
        onChange={() => onToggleAcknowledged()}
        disabled={disabled}
        style={styles.ack}
      />
    </>
  );
}

const styles = StyleSheet.create({
  step3Body: {
    marginBottom: Spacing.one,
  },
  ack: {
    marginTop: Spacing.two,
  },
});
