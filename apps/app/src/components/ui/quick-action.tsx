import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { NewBadge } from "@/components/ui/new-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import {
  BorderWidth,
  Breakpoints,
  MaxContentWidth,
  Radius,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

export type QuickActionItem = {
  id: string;
  label: string;
  icon: AppIconType;
  tint?: string;
  onPress?: () => void;
  /** Show a "New" pill on the tile (recently released features). */
  isNew?: boolean;
  /** Accessibility label suffix for the badge, e.g. "New". */
  newLabel?: string;
};

/** Derive a column count from viewport width so wide web/tablet fills the row. */
function responsiveColumns(width: number): number {
  if (width >= Breakpoints.listDetail) return 6;
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
  overflow = "wrap",
}: {
  items: QuickActionItem[];
  /** Override the responsive column count; omit to reflow with viewport width. */
  columns?: number;
  /**
   * Prefer one row when there is room. On narrow widths we fall back to a
   * wrapping grid so labels stay readable instead of clipping.
   */
  singleRow?: boolean;
  /**
   * What a `singleRow` does when the tiles don't fit: `"wrap"` (default) falls
   * back to the grid; `"scroll"` keeps one row and scrolls it sideways, with a
   * part-visible tile at the edge hinting there is more. TV always wraps.
   */
  overflow?: "wrap" | "scroll";
}) {
  const { width } = useWindowDimensions();
  const available = contentWidthFor(width);
  const fitSingleRow =
    singleRow && items.length > 0 && available / items.length >= MIN_SINGLE_ROW_SLOT;
  const columnCount = fitSingleRow ? items.length : (columns ?? responsiveColumns(width));
  const wellSize = fitSingleRow ? compactWellSize(available, items.length) : 52;
  const iconSize = fitSingleRow ? Math.round(wellSize * 0.45) : 24;
  const tv = isTV();

  if (singleRow && !fitSingleRow && overflow === "scroll" && !tv) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollRow}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.tileSlotScroll}>
            {/* Not `compact`: labels may wrap to two lines here — the fixed
                tile width can't grow, and one-line labels truncate. */}
            <QuickAction item={item} wellSize={52} iconSize={24} compact={false} />
          </View>
        ))}
      </ScrollView>
    );
  }

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
    // The whole tile (well + label) is one target: a larger hit area than the
    // well alone, a single hover/ripple/TV-focus surface, and no dead zone
    // between the icon and its label.
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        item.isNew && item.newLabel ? `${item.label}, ${item.newLabel}` : item.label
      }
      onPress={item.onPress}
      scaleTo={0.95}
      haptic="light"
      style={[styles.tile, compact && styles.tileCompact]}
    >
      {/* Tinted wells on opaque cards — not Liquid Glass. GlassView on a solid
          card + inside Stagger's opacity animation intermittently drops tint and
          symbols until the tile remounts (tab switch / scroll back). */}
      <View
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
        {/* Anchored to the well's corner (not the slot) so it stays attached to
            its icon at every column width. */}
        {item.isNew ? <NewBadge style={styles.newBadge} /> : null}
      </View>
      <ThemedText
        type="caption"
        style={[styles.label, compact && styles.labelCompact, { color: colors.foreground }]}
        // Wrap to a second line instead of shrinking the label (P9-04: no
        // `adjustsFontSizeToFit` on UI text — it defeats Dynamic Type).
        numberOfLines={2}
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
    // Tiles carry their own vertical padding, so rows only need a hairline gap.
    rowGap: Spacing.one,
    columnGap: 0,
  },
  gridSingleRow: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  tileSlot: {
    paddingHorizontal: Spacing.half,
  },
  tileSlotSingleRow: {
    flex: 1,
    minWidth: 0,
  },
  scrollRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  /** ~4.5 tiles across a phone column — the half tile signals the row scrolls. */
  tileSlotScroll: {
    width: 72,
  },
  tile: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: Spacing.two,
    // Top padding also keeps the "New" pill inside the tile's ripple clip.
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  tileCompact: {
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: 0,
    borderRadius: Radius.md,
  },
  newBadge: {
    position: "absolute",
    top: -Spacing.two,
    end: -Spacing.three,
    alignSelf: "auto",
  },
  iconWell: {
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    alignSelf: "stretch",
    textAlign: "center",
  },
  labelCompact: {
    paddingHorizontal: Spacing.half,
  },
});
