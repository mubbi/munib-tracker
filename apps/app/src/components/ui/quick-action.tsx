import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";

export type QuickActionItem = {
  id: string;
  label: string;
  icon: AppIconType;
  tint?: string;
  onPress?: () => void;
};

/** Derive a column count from viewport width so wide web/tablet fills the row. */
function responsiveColumns(width: number): number {
  if (width >= 900) return 6;
  if (width >= 600) return 5;
  return 4;
}

export function QuickActionGrid({
  items,
  columns,
}: {
  items: QuickActionItem[];
  /** Override the responsive column count; omit to reflow with viewport width. */
  columns?: number;
}) {
  const { width } = useWindowDimensions();
  const columnCount = columns ?? responsiveColumns(width);

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={{ width: `${100 / columnCount}%` }}>
          <QuickAction item={item} />
        </View>
      ))}
    </View>
  );
}

function QuickAction({ item }: { item: QuickActionItem }) {
  const { colors, tokens } = useThemeTokens();
  const tint = item.tint ?? colors.accent;
  const wellBackground = withAlpha(tint, tokens.isDark ? 0.2 : 0.12);
  const wellBorder = withAlpha(tint, tokens.isDark ? 0.34 : 0.22);

  return (
    <View style={styles.tileWrap}>
      {/* Tinted wells on opaque cards — not Liquid Glass. GlassView on a solid
          card + inside Stagger's opacity animation intermittently drops tint and
          symbols until the tile remounts (tab switch / scroll back). */}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={item.label}
        onPress={item.onPress}
        scaleTo={0.92}
        haptic="light"
        style={[styles.iconWell, { backgroundColor: wellBackground, borderColor: wellBorder }]}
      >
        <AppIcon icon={item.icon} size={26} tintColor={tint} />
      </PressableScale>
      <ThemedText
        type="caption"
        style={[styles.label, { color: colors.foreground }]}
        numberOfLines={1}
      >
        {item.label}
      </ThemedText>
    </View>
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
