import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type QuickActionItem = {
  id: string;
  label: string;
  icon: SymbolViewProps["name"];
  tint?: string;
  onPress?: () => void;
};

export function QuickActionGrid({
  items,
  columns = 4,
}: {
  items: QuickActionItem[];
  columns?: number;
}) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={{ width: `${100 / columns}%` }}>
          <QuickAction item={item} />
        </View>
      ))}
    </View>
  );
}

function QuickAction({ item }: { item: QuickActionItem }) {
  const { colors, tokens } = useThemeTokens();
  const tint = item.tint ?? colors.accent;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={item.onPress}
      scaleTo={0.92}
      haptic="light"
      style={styles.tileWrap}
    >
      <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
        <SymbolView name={item.icon} size={24} tintColor={tint} />
      </View>
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        style={styles.label}
        numberOfLines={1}
      >
        {item.label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: Spacing.three,
  },
  tileWrap: {
    alignItems: "center",
    gap: Spacing.two,
  },
  iconWell: {
    width: 58,
    height: 58,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
