import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

type PassphraseFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  /** `newPassword` lets password managers offer to save; `password` autofills. */
  purpose?: "newPassword" | "password";
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  /** Inline error (announced) — e.g. the confirmation doesn't match. */
  error?: string;
  testID?: string;
};

/** Secure text field with a show/hide toggle. Never logs or persists its value. */
export function PassphraseField({
  label,
  value,
  onChangeText,
  purpose = "password",
  autoFocus,
  onSubmitEditing,
  error,
  testID,
}: PassphraseFieldProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      testID={testID}
      label={label}
      error={error}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete={purpose === "newPassword" ? "new-password" : "current-password"}
      textContentType={purpose}
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      trailing={
        <Button
          label={visible ? t("vault.passphrase.hide") : t("vault.passphrase.show")}
          variant="ghost"
          size="sm"
          onPress={() => setVisible((v) => !v)}
        />
      }
    />
  );
}
