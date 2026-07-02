import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SectionHeaderProps = {
  title: string;
  icon: SymbolViewProps["name"];
};

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <SymbolView name={icon} size={16} tintColor={colors.accent} />
      <ThemedText type="smallBold" style={{ color: colors.accent, textTransform: "capitalize" }}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
});
