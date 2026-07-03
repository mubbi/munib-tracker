import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type StatCardProps = {
  label: string;
  value: string;
  icon: SymbolViewProps["name"];
  tint?: string;
};

export function StatCard({ label, value, icon, tint }: StatCardProps) {
  const { colors, tokens } = useThemeTokens();
  const accent = tint ?? colors.accent;

  return (
    <Card variant="elevated" padding="three" style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: tokens.accentSoft }]}>
        <SymbolView name={icon} size={18} tintColor={accent} />
      </View>
      <ThemedText type="subtitle" style={{ color: colors.foreground }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    gap: Spacing.one,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
});
