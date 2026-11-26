import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/icon-button";
import { NewBadge } from "@/components/ui/new-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SortableGrid } from "@/components/ui/sortable";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Durations } from "@/constants/motion";
import {
  BorderWidth,
  Breakpoints,
  MaxContentWidth,
  Radius,
  Shadows,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
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

/** Caption size the tile labels start from (`ThemedText type="caption"`). */
const LABEL_FONT_SIZE = 12;
/** Shrink floor — slight, so labels stay legible (≈10.5pt). */
const LABEL_MIN_SCALE = 0.875;
/** Conservative average glyph advance for UI text, as a fraction of the font size. */
const GLYPH_ADVANCE = 0.6;

/**
 * Font scale that lets a tile label's longest word fit on one line of
 * `available` width, so labels wrap at word boundaries ("Achievements", not
 * "Achievemen/ts"). Shrinks only slightly (floor {@link LABEL_MIN_SCALE});
 * returns 1 when the width is unknown or the word already fits.
 */
export function labelFontScale(label: string, available: number, fontScale = 1): number {
  if (!(available > 0)) return 1;
  const longest = label.split(/\s+/).reduce((max, word) => Math.max(max, [...word].length), 0);
  const needed = longest * GLYPH_ADVANCE * LABEL_FONT_SIZE * fontScale;
  if (needed <= available) return 1;
  return Math.max(LABEL_MIN_SCALE, available / needed);
}

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

export type QuickActionGridEditProps = {
  /**
   * Edit mode (Home › Explore): tiles wiggle gently, drag to reorder, a small
   * "−" hides one. Ignored on TV (no drag — Manage keeps the settings list).
   */
  editing?: boolean;
  /** Edit mode: the full new order of `items` ids after a drop / move. */
  onReorder?: (ids: string[]) => void;
  /** Edit mode: hide this tile. */
  onRemove?: (id: string) => void;
  /** Long-press on a tile outside edit mode (enters edit mode on Home). */
  onLongPressItem?: (id: string) => void;
};

export function QuickActionGrid({
  items,
  columns,
  singleRow = false,
  overflow = "wrap",
  editing = false,
  onReorder,
  onRemove,
  onLongPressItem,
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
} & QuickActionGridEditProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { width } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);
  const available = contentWidthFor(width);
  const fitSingleRow =
    singleRow && items.length > 0 && available / items.length >= MIN_SINGLE_ROW_SLOT;
  const columnCount = fitSingleRow ? items.length : (columns ?? responsiveColumns(width));
  const wellSize = fitSingleRow ? compactWellSize(available, items.length) : 52;
  const iconSize = fitSingleRow ? Math.round(wellSize * 0.45) : 24;
  const tv = isTV();
  // Label width inside one slot (slot / tile horizontal padding removed).
  const slotWidth = gridWidth > 0 ? gridWidth / columnCount : 0;
  const labelWidth = slotWidth > 0 ? slotWidth - TILE_INSET : 0;
  const longPress = !tv && onLongPressItem ? onLongPressItem : undefined;

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
            <QuickAction
              item={item}
              wellSize={52}
              iconSize={24}
              compact={false}
              labelWidth={SCROLL_SLOT_WIDTH - TILE_INSET}
              onLongPress={longPress}
            />
          </View>
        ))}
      </ScrollView>
    );
  }

  if (editing && !tv && onReorder) {
    const byId = new Map(items.map((item) => [item.id, item]));
    return (
      <View
        testID="quick-action-grid-editing"
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
      >
        <SortableGrid
          ids={items.map((item) => item.id)}
          columns={columnCount}
          rowGap={Spacing.one}
          onReorder={onReorder}
          itemLabel={(id) => byId.get(id)?.label ?? id}
          onRemove={onRemove}
          renderItem={(id, info) => {
            const item = byId.get(id);
            if (!item) return null;
            return (
              <View style={styles.tileSlotEditing}>
                <QuickAction
                  item={item}
                  wellSize={wellSize}
                  iconSize={iconSize}
                  compact={false}
                  labelWidth={labelWidth}
                  editing
                  wiggle={!info.active}
                  wiggleIndex={info.index}
                  lifted={info.active}
                  accessibilityActions={info.accessibility.accessibilityActions}
                  onAccessibilityAction={info.accessibility.onAccessibilityAction}
                  focusProps={info.focusProps}
                />
                {onRemove ? (
                  // A sibling of the tile (never nested — both are <button> on web).
                  <IconButton
                    name={{
                      ios: "minus.circle.fill",
                      android: "remove_circle",
                      web: "remove_circle",
                    }}
                    size={20}
                    accessibilityLabel={t("home.exploreHideTile", { item: item.label })}
                    onPress={() => onRemove(id)}
                    style={styles.removeBadge}
                    tintColor={tokens.status.danger.text}
                  />
                ) : null}
              </View>
            );
          }}
        />
      </View>
    );
  }

  const grid = (
    <View
      style={[styles.grid, fitSingleRow && styles.gridSingleRow]}
      onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
    >
      {items.map((item) => (
        <View
          key={item.id}
          style={
            fitSingleRow
              ? styles.tileSlotSingleRow
              : [styles.tileSlot, { width: `${100 / columnCount}%` }]
          }
        >
          <QuickAction
            item={item}
            wellSize={wellSize}
            iconSize={iconSize}
            compact={fitSingleRow}
            labelWidth={labelWidth}
            onLongPress={longPress}
          />
        </View>
      ))}
    </View>
  );

  return tv ? <TvFocusGuide autoFocus>{grid}</TvFocusGuide> : grid;
}

/** Horizontal space the slot + tile padding take from the label. */
const TILE_INSET = Spacing.half * 2 + Spacing.half * 2;
const SCROLL_SLOT_WIDTH = 72;
/** Gentle edit-mode wiggle (degrees). */
const WIGGLE_DEG = 1.2;

function QuickAction({
  item,
  wellSize,
  iconSize,
  compact,
  labelWidth = 0,
  onLongPress,
  editing = false,
  wiggle = false,
  wiggleIndex = 0,
  lifted = false,
  accessibilityActions,
  onAccessibilityAction,
  focusProps,
}: {
  item: QuickActionItem;
  wellSize: number;
  iconSize: number;
  compact: boolean;
  /** Width the label can use (0 = unknown) — drives the longest-word fit. */
  labelWidth?: number;
  onLongPress?: (id: string) => void;
  /** Edit mode: the tile sits in a rotating wrapper (kept mounted while `wiggle` toggles). */
  editing?: boolean;
  wiggle?: boolean;
  wiggleIndex?: number;
  lifted?: boolean;
  accessibilityActions?: AccessibilityActionInfo[];
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
  focusProps?: { onFocus: () => void; onBlur: () => void };
}) {
  const { colors, tokens } = useThemeTokens();
  const { fontScale } = useWindowDimensions();
  const reducedMotion = useHydrationSafeReducedMotion() === true;
  const tint = item.tint ?? colors.accent;
  const wellBackground = withAlpha(tint, tokens.isDark ? 0.2 : 0.12);
  const wellBorder = withAlpha(tint, tokens.isDark ? 0.34 : 0.22);
  const scale = labelFontScale(item.label, labelWidth, fontScale);

  const wellRadius = wellSize < 50 ? Radius.md : Radius.lg;

  // Edit mode: a slow, small rocking — staggered per tile so the grid doesn't
  // move in lockstep. Off under reduced motion.
  const rotation = useSharedValue(0);
  const shouldWiggle = wiggle && !reducedMotion;
  useEffect(() => {
    if (!shouldWiggle) {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: Durations.fast });
      return;
    }
    rotation.value = withDelay(
      (wiggleIndex % 4) * 60,
      withRepeat(
        withSequence(
          withTiming(-WIGGLE_DEG, { duration: Durations.fast }),
          withTiming(WIGGLE_DEG, { duration: Durations.fast }),
        ),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(rotation);
  }, [rotation, shouldWiggle, wiggleIndex]);
  const wiggleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const tile = (
    // The whole tile (well + label) is one target: a larger hit area than the
    // well alone, a single hover/ripple/TV-focus surface, and no dead zone
    // between the icon and its label.
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        item.isNew && item.newLabel ? `${item.label}, ${item.newLabel}` : item.label
      }
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      onPress={item.onPress}
      onLongPress={onLongPress ? () => onLongPress(item.id) : undefined}
      onFocus={focusProps?.onFocus}
      onBlur={focusProps?.onBlur}
      scaleTo={0.95}
      haptic="light"
      style={[
        styles.tile,
        compact && styles.tileCompact,
        lifted && [styles.tileLifted, { backgroundColor: colors.card }],
      ]}
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
        style={[
          styles.label,
          compact && styles.labelCompact,
          { color: colors.foreground },
          scale < 1 ? { fontSize: LABEL_FONT_SIZE * scale } : null,
        ]}
        // Wrap to a second line at word boundaries; the longest word shrinks
        // slightly to fit instead of breaking (no `adjustsFontSizeToFit`, P9-04).
        numberOfLines={2}
        textBreakStrategy="balanced"
      >
        {item.label}
      </ThemedText>
    </PressableScale>
  );
  return editing ? <Animated.View style={wiggleStyle}>{tile}</Animated.View> : tile;
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
  tileSlotEditing: {
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
    width: SCROLL_SLOT_WIDTH,
  },
  tile: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: Spacing.two,
    // Top padding also keeps the "New" pill inside the tile's ripple clip.
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.half,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  tileCompact: {
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: 0,
    borderRadius: Radius.md,
  },
  tileLifted: Shadows.lg,
  /** Small, tidy corner pill: hugs the well's top-end corner, inside the tile. */
  newBadge: {
    position: "absolute",
    top: -Spacing.oneHalf,
    end: -Spacing.twoHalf,
    alignSelf: "auto",
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: Spacing.half,
  },
  /** Top-start corner of the slot, over the well's corner. */
  removeBadge: {
    position: "absolute",
    top: -Spacing.two,
    start: -Spacing.one,
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
