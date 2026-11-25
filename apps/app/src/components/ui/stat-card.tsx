import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconSize, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
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
  // The well follows `tint`; the default stays the accent soft tint.
  const well = tint ? withAlpha(tint, tokens.isDark ? 0.24 : 0.18) : tokens.accentSoft;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: well }]}>
        <SymbolView name={icon} size={IconSize.lg - 2} tintColor={accent} />
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
    minWidth: tvDp(96),
    gap: Spacing.one,
  },
  iconWrap: {
    width: tvDp(36),
    height: tvDp(36),
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
});
