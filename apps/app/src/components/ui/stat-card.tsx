import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type StatCardProps = {
  label: string;
  value: string;
  icon: SymbolViewProps["name"];
};

export function StatCard({ label, value, icon }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <ThemedView type="card" style={[styles.card, { borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
        <SymbolView name={icon} size={18} tintColor={colors.accent} />
      </View>
      <ThemedText type="smallBold" style={{ color: colors.accent }}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
    borderCurve: "continuous",
  },
});
