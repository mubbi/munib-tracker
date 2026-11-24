import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * A labelled text field for the private records screens (debts, wasiyyah).
 * The label doubles as the accessibility label.
 */
export function LabeledInput({
  label,
  hint,
  style,
  ...props
}: TextInputProps & { label: string; hint?: string }) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.block}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={[styles.row, tokens.inputSurface]}>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={hint}
          placeholderTextColor={colors.mutedForeground}
          {...props}
          style={[styles.input, { color: colors.foreground }, style]}
        />
      </View>
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.one },
  row: { borderRadius: 12, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  input: { fontSize: 16, paddingVertical: Spacing.two },
});
