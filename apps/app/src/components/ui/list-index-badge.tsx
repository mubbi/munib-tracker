import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ListIndexBadgeProps = {
  index: number;
};

/** Compact ordinal badge for scannable lists (duas, adhkar, names, etc.). */
export function ListIndexBadge({ index }: ListIndexBadgeProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View
      style={[styles.badge, { backgroundColor: tokens.accentSoft }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ThemedText type="caption" style={{ color: colors.accentText }}>
        {index}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
