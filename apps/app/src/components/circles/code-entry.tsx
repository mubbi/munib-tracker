import { isValidInviteCode, normalizeInviteCode } from "@munib-tracker/shared/circles";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, type TextInputInstance } from "react-native";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";

/**
 * Invite-code field + "Join circle" button, shared by the hub and the join screen
 * (a bad or expired link lands on the same field instead of a dead end).
 */
export const CircleCodeEntry = forwardRef<
  TextInputInstance,
  { onSubmit: (code: string) => void; error?: string }
>(function CircleCodeEntry({ onSubmit, error }, ref) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const valid = isValidInviteCode(code);
  const submit = () => {
    if (valid) onSubmit(normalizeInviteCode(code));
  };
  return (
    <>
      <TextField
        ref={ref}
        label={t("circles.hub.codeLabel")}
        helperText={t("circles.hub.codeHint")}
        error={error}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={16}
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <Button
        label={t("circles.hub.join")}
        disabled={!valid}
        onPress={submit}
        style={styles.button}
      />
    </>
  );
});

const styles = StyleSheet.create({
  button: { marginTop: Spacing.one },
});
