import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Labelled, themed text input for the self-review forms (private, never sent anywhere). */
export function TextField({
  label,
  hint,
  multiline,
  style,
  ...input
}: TextInputProps & { label: string; hint?: string }) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          {
            color: colors.foreground,
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
          },
          style,
        ]}
        {...input}
      />
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.one },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
});
