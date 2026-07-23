import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { MaxContentWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

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
  return 3;
}

/** Card horizontal padding (`padding="three"`) on both sides. */
const CARD_HORIZONTAL_PADDING = Spacing.three * 2;
/** `ScreenLayout` content padding on both sides. */
const SCREEN_HORIZONTAL_PADDING = Spacing.four * 2;

/** Minimum slot width before a forced single row becomes unreadable. */
const MIN_SINGLE_ROW_SLOT = 64;

function compactWellSize(contentWidth: number, itemCount: number): number {
  const slotWidth = contentWidth / itemCount;
  return Math.max(44, Math.min(56, Math.floor(slotWidth * 0.72)));
}

function contentWidthFor(viewportWidth: number): number {
  return (
    Math.min(viewportWidth, MaxContentWidth) - CARD_HORIZONTAL_PADDING - SCREEN_HORIZONTAL_PADDING
  );
}

export function QuickActionGrid({
  items,
  columns,
  singleRow = false,
}: {
  items: QuickActionItem[];
  /** Override the responsive column count; omit to reflow with viewport width. */
  columns?: number;
  /**
   * Prefer one row when there is room. On narrow widths we fall back to a
   * wrapping grid so labels stay readable instead of clipping.
   */
  singleRow?: boolean;
}) {
  const { width } = useWindowDimensions();
  const available = contentWidthFor(width);
  const fitSingleRow =
    singleRow && items.length > 0 && available / items.length >= MIN_SINGLE_ROW_SLOT;
  const columnCount = fitSingleRow ? items.length : (columns ?? responsiveColumns(width));
  const wellSize = fitSingleRow ? compactWellSize(available, items.length) : 52;
  const iconSize = fitSingleRow ? Math.round(wellSize * 0.45) : 24;
  const tv = isTV();

  const grid = (
    <View style={[styles.grid, fitSingleRow && styles.gridSingleRow]}>
      {items.map((item) => (
        <View
          key={item.id}
          style={
            fitSingleRow
              ? styles.tileSlotSingleRow
              : [styles.tileSlot, { width: `${100 / columnCount}%` }]
          }
        >
          <QuickAction item={item} wellSize={wellSize} iconSize={iconSize} compact={fitSingleRow} />
        </View>
      ))}
    </View>
  );

  return tv ? <TvFocusGuide autoFocus>{grid}</TvFocusGuide> : grid;
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
        numberOfLines={compact ? 1 : 2}
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
    columnGap: 0,
  },
  gridSingleRow: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  tileSlot: {
    alignItems: "center",
    paddingHorizontal: Spacing.one,
  },
  tileSlotSingleRow: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  tileWrap: {
    alignItems: "center",
    gap: Spacing.two,
    width: "100%",
  },
  tileWrapCompact: {
    gap: Spacing.one,
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
