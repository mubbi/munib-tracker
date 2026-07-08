import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { MaxContentWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
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

/** Card horizontal padding (`padding="three"`) on both sides. */
const CARD_HORIZONTAL_PADDING = Spacing.three * 2;

function compactWellSize(viewportWidth: number, itemCount: number): number {
  const contentWidth = Math.min(viewportWidth, MaxContentWidth) - CARD_HORIZONTAL_PADDING;
  const slotWidth = contentWidth / itemCount;
  return Math.max(40, Math.min(56, Math.floor(slotWidth * 0.82)));
}

export function QuickActionGrid({
  items,
  columns,
  singleRow = false,
}: {
  items: QuickActionItem[];
  /** Override the responsive column count; omit to reflow with viewport width. */
  columns?: number;
  /** Keep every item on one line and scale icon wells to fit narrow viewports. */
  singleRow?: boolean;
}) {
  const { width } = useWindowDimensions();
  const columnCount = singleRow ? items.length : (columns ?? responsiveColumns(width));
  const wellSize = singleRow ? compactWellSize(width, items.length) : 58;
  const iconSize = singleRow ? Math.round(wellSize * 0.45) : 26;

  return (
    <View style={[styles.grid, singleRow && styles.gridSingleRow]}>
      {items.map((item) => (
        <View
          key={item.id}
          style={singleRow ? styles.tileSlotSingleRow : { width: `${100 / columnCount}%` }}
        >
          <QuickAction item={item} wellSize={wellSize} iconSize={iconSize} compact={singleRow} />
        </View>
      ))}
    </View>
  );
}

function QuickAction({
  item,
  wellSize,
  iconSize,
  compact,
}: {
  item: QuickActionItem;
  wellSize: number;
  iconSize: number;
  compact: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const tint = item.tint ?? colors.accent;
  const wellBackground = withAlpha(tint, tokens.isDark ? 0.2 : 0.12);
  const wellBorder = withAlpha(tint, tokens.isDark ? 0.34 : 0.22);

  const wellRadius = wellSize < 50 ? Radius.md : Radius.lg;

  return (
    <View style={[styles.tileWrap, compact && styles.tileWrapCompact]}>
      {/* Tinted wells on opaque cards — not Liquid Glass. GlassView on a solid
          card + inside Stagger's opacity animation intermittently drops tint and
          symbols until the tile remounts (tab switch / scroll back). */}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={item.label}
        onPress={item.onPress}
        scaleTo={0.92}
        haptic="light"
        style={[
          styles.iconWell,
          {
            width: wellSize,
            height: wellSize,
            borderRadius: wellRadius,
            backgroundColor: wellBackground,
            borderColor: wellBorder,
          },
        ]}
      >
        <AppIcon icon={item.icon} size={iconSize} tintColor={tint} />
      </PressableScale>
      <ThemedText
        type="caption"
        style={[styles.label, compact && styles.labelCompact, { color: colors.foreground }]}
        numberOfLines={1}
        adjustsFontSizeToFit={compact}
        minimumFontScale={0.75}
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
  gridSingleRow: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  tileSlotSingleRow: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  tileWrap: {
    alignItems: "center",
    gap: Spacing.two,
  },
  tileWrapCompact: {
    gap: Spacing.one,
    width: "100%",
  },
  iconWell: {
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
  labelCompact: {
    width: "100%",
    paddingHorizontal: Spacing.half,
  },
});
