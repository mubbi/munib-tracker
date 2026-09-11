import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ListIndexBadgeProps = {
  index: number;
  /** Success tint when today's target is already met. */
  completed?: boolean;
};

/** Compact ordinal badge for scannable lists (duas, adhkar, names, etc.). */
export function ListIndexBadge({ index, completed }: ListIndexBadgeProps) {
  const { colors, tokens } = useThemeTokens();
  const backgroundColor = completed ? tokens.status.success.soft : tokens.accentSoft;
  const foreground = completed ? tokens.status.success.color : colors.accentText;

  return (
    <View
      style={[styles.badge, { backgroundColor }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ThemedText type="caption" style={{ color: foreground }}>
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
