import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ListIndexBadgeProps = {
  index: number;
  /** Success tint when today's target is already met. */
  completed?: boolean;
};

/** Compact ordinal badge for scannable lists (duas, adhkar, names, etc.). */
export function ListIndexBadge({ index, completed }: ListIndexBadgeProps) {
  const { tokens } = useThemeTokens();
  const backgroundColor = completed ? tokens.status.success.soft : tokens.accentSoft;
  const foreground = completed ? tokens.status.success.onSoft : tokens.accentOnSoft;

  return (
    <View
      style={[styles.badge, { backgroundColor }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ThemedText type="caption" maxFontSizeMultiplier={1.2} style={{ color: foreground }}>
        {index}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: tvDp(26),
    minHeight: tvDp(26),
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
