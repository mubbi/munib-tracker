import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type PassphraseFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  /** `newPassword` lets password managers offer to save; `password` autofills. */
  purpose?: "newPassword" | "password";
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
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
  testID,
}: PassphraseFieldProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrap}>
      <ThemedText type="label" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <View style={[styles.row, tokens.inputSurface]}>
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={purpose === "newPassword" ? "new-password" : "current-password"}
          textContentType={purpose}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={label}
          style={[styles.input, { color: colors.foreground }]}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? t("vault.passphrase.hide") : t("vault.passphrase.show")}
          hitSlop={8}
          style={styles.toggle}
        >
          <ThemedText type="smallBold" themeColor="accent">
            {visible ? t("vault.passphrase.hide") : t("vault.passphrase.show")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.two,
  },
  input: { flex: 1, paddingVertical: Spacing.three, fontSize: 16 },
  toggle: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
});
