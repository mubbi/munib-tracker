import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export function ShareProofSectionTitle({ title }: { title: string }) {
  const { colors } = useThemeTokens();

  return (
    <View style={styles.row}>
      <SymbolView
        name={{ ios: "text.quote", android: "format_quote", web: "format_quote" }}
        size={20}
        tintColor={colors.accent}
      />
      <ThemedText type="smallBold">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
});
