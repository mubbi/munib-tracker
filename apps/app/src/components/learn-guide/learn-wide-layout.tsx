import { SymbolView } from "expo-symbols";
import { type ReactNode, useState } from "react";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { JannahNavRow } from "@/components/jannah/primitives";
import { useStickyHeaderOffset } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid, responsiveColumns } from "@/components/ui/responsive-grid";
import { Breakpoints, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

/**
 * Desktop / large-screen web layout helpers shared by every Learn module (hubs,
 * topic articles, timelines, quizzes). Phones (<768) and TV always fall back to
 * the original single-column markup — these only change wide, non-TV windows.
 */

/** Window width at/above which Learn screens add a side column (aside). */
export const LEARN_ASIDE_BREAKPOINT = 1200;
/** Content cap for Learn screens that render prose + aside side by side. */
export const LEARN_SPLIT_MAX_WIDTH = 1240;
/** Width of the aside column in a Learn split layout. */
export const LEARN_ASIDE_WIDTH = 320;
/**
 * Main (prose) column cap — whatever remains of the split width beside the
 * aside (~900px, ≈ 80–90 characters at body size).
 */
const LEARN_MAIN_MAX_WIDTH = LEARN_SPLIT_MAX_WIDTH - LEARN_ASIDE_WIDTH - Spacing.four;
/**
 * Sticky aside offset on web before the floating header is measured (the live
 * value comes from `useStickyHeaderOffset`).
 */
const STICKY_TOP = 88;

export type LearnWideLayout = {
  /** Width ≥ 768 on a non-TV device (tablet / desktop web). */
  wide: boolean;
  /** Width ≥ 1200 on a non-TV device — prose + aside side by side. */
  split: boolean;
  /** Pass to `ScreenLayout.maxContentWidth` (undefined keeps the default cap). */
  maxContentWidth: number | undefined;
  width: number;
  height: number;
};

/** Breakpoints for Learn screens. TV always reports `wide: false, split: false`. */
export function useLearnWideLayout(): LearnWideLayout {
  const { width, height } = useWindowDimensions();
  const tv = isTV();
  const wide = !tv && width >= Breakpoints.tablet;
  const split = !tv && width >= LEARN_ASIDE_BREAKPOINT;
  return {
    wide,
    split,
    maxContentWidth: split ? LEARN_SPLIT_MAX_WIDTH : undefined,
    width,
    height,
  };
}

/**
 * Width-based column count for Learn grids. TV keeps its existing single
 * column (D-pad lists) regardless of the 960dp TV window.
 */
export function useLearnColumns({ min = 1, max = 4 }: { min?: number; max?: number } = {}) {
  const { width } = useWindowDimensions();
  if (isTV()) return 1;
  return responsiveColumns(width, { min, max });
}

/**
 * `ResponsiveGrid` that never changes TV layouts (always one column there) and
 * renders a plain stacked `View` on phones — so phone markup stays identical.
 */
export function LearnGrid({
  children,
  maxColumns = 2,
  minColumns,
  gap = Spacing.three,
  style,
  passthrough = false,
}: {
  children: ReactNode;
  maxColumns?: number;
  minColumns?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Single column (phones / TV): render children directly into the parent so
   * its own gap / layout applies exactly as before (no wrapper View).
   */
  passthrough?: boolean;
}) {
  const cols = useLearnColumns({ min: minColumns, max: maxColumns });
  if (passthrough && cols <= 1) return <>{children}</>;
  return (
    <ResponsiveGrid columns={cols} gap={gap} style={gridStyle(cols, style)}>
      {children}
    </ResponsiveGrid>
  );
}

/**
 * Callers often pass their phone list style (`{ gap, marginTop }`) straight
 * through. In a multi-column grid a `gap` would add a column gap on top of the
 * grid's own cell padding and wrap the row, so zero the column gap there.
 */
function gridStyle(cols: number, style: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
  return cols > 1 ? [style, styles.noColumnGap] : style;
}

// `position: sticky` is valid CSS on react-native-web but missing from RN's types.
const webSticky = (top: number): ViewStyle | null =>
  Platform.OS === "web" ? ({ position: "sticky", top } as unknown as ViewStyle) : null;

/**
 * Two-column Learn layout at ≥1200 (non-TV): readable main column + a
 * sticky-feeling aside (topic list, progress, related links). Below the
 * breakpoint it renders `children` only, or `fallback` when provided (so hubs
 * can keep their original phone ordering).
 */
export function LearnSplitLayout({
  aside,
  children,
  fallback,
  asideWidth = LEARN_ASIDE_WIDTH,
}: {
  aside: ReactNode;
  children: ReactNode;
  /** Rendered instead of `children` when the split is inactive. */
  fallback?: ReactNode;
  asideWidth?: number;
}) {
  const { split, height } = useLearnWideLayout();
  const [asideHeight, setAsideHeight] = useState(0);
  const stickyTop = useStickyHeaderOffset(STICKY_TOP);
  if (!split) return <>{fallback ?? children}</>;
  // Only pin the aside while it fits in the viewport — a taller aside would
  // otherwise hide its lower half until the end of the page.
  const fits = asideHeight > 0 && asideHeight <= height - stickyTop - Spacing.four;
  return (
    <View style={styles.split}>
      <View style={styles.main}>{children}</View>
      <View
        // Web landmark: complementary navigation beside the article.
        {...(Platform.OS === "web" ? { role: "complementary" as const } : {})}
        onLayout={(event) => setAsideHeight(event.nativeEvent.layout.height)}
        style={[styles.aside, { width: asideWidth }, fits ? webSticky(stickyTop) : null]}
      >
        {aside}
      </View>
    </View>
  );
}

export type LearnTopicGridItem = {
  id: string;
  icon: AppIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  tint?: string;
  /** Not available yet (coming soon): muted, announced as disabled, never pressable. */
  disabled?: boolean;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
  onPress: () => void;
  /** Web: crawlable `<a href>` for the topic page. */
  href?: string;
};

/**
 * Topic list for Learn hubs. Phones / TV: the original stacked `JannahNavRow`
 * list (unchanged). Tablet / desktop: an equal-height 2-column grid of the same
 * rows so section cards don't stretch one row across ~800px.
 */
export function LearnTopicGrid({
  items,
  maxColumns = 2,
  tvColumns = 1,
  style,
}: {
  items: LearnTopicGridItem[];
  maxColumns?: number;
  /** TV: columns used on the landscape canvas (default 1; D-pad moves row by row). */
  tvColumns?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const tv = isTV();
  const gridCols = useLearnColumns({ max: maxColumns });
  const cols = tv ? tvColumns : gridCols;
  if (cols <= 1 || tv) {
    const rows = items.map((item) =>
      item.disabled ? (
        <LearnDisabledRow key={item.id} item={item} />
      ) : (
        <JannahNavRow
          key={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          badge={item.badge}
          tint={item.tint}
          preferredFocus={item.preferredFocus}
          onPress={item.onPress}
          href={item.href}
        />
      ),
    );
    if (cols <= 1) return <View style={style}>{rows}</View>;
    // TV: landscape canvas — wrap rows into columns; D-pad still moves row by row.
    return (
      <View style={[style, styles.tvWrap]}>
        {rows.map((row) => (
          <View key={row.key} style={styles.tvCell}>
            {row}
          </View>
        ))}
      </View>
    );
  }
  return (
    <ResponsiveGrid columns={cols} gap={Spacing.two} style={gridStyle(cols, style)}>
      {items.map((item) =>
        item.disabled ? (
          <LearnDisabledRow key={item.id} item={item} />
        ) : (
          <LearnTopicTile key={item.id} item={item} />
        ),
      )}
    </ResponsiveGrid>
  );
}

/** Unavailable topic (G-60): visibly muted, announced as disabled, never pressable. */
function LearnDisabledRow({ item }: { item: LearnTopicGridItem }) {
  const { colors } = useThemeTokens();
  return (
    <View
      testID={`learn-disabled-${item.id}`}
      accessible
      accessibilityRole="text"
      accessibilityState={{ disabled: true }}
      accessibilityLabel={[item.title, item.subtitle, item.badge].filter(Boolean).join(". ")}
      style={[styles.disabledRow, { backgroundColor: colors.muted }]}
    >
      <ThemedText type="smallBold" themeColor="mutedForeground">
        {item.title}
      </ThemedText>
      {item.subtitle ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {item.subtitle}
        </ThemedText>
      ) : null}
      {item.badge ? (
        <Pill label={item.badge} compact color={colors.mutedForeground} background={colors.card} />
      ) : null}
    </View>
  );
}

/** Grid cell twin of `JannahNavRow` that fills its cell height (equal-height rows). */
function LearnTopicTile({ item }: { item: LearnTopicGridItem }) {
  const { colors } = useThemeTokens();
  const chevronForward = useChevronForward();
  const tint = item.tint ?? colors.accent;
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={[item.title, item.subtitle, item.badge].filter(Boolean).join(". ")}
      onPress={item.onPress}
      href={item.href}
      style={[styles.tile, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={item.icon} tint={tint} background={withAlpha(tint, 0.12)} />
      <View style={styles.tileCopy}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {item.title}
        </ThemedText>
        {item.subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={3}>
            {item.subtitle}
          </ThemedText>
        ) : null}
        {item.badge ? (
          <Pill
            label={item.badge}
            compact
            color={colors.mutedForeground}
            background={colors.card}
            style={styles.tileBadge}
          />
        ) : null}
      </View>
      <SymbolView name={chevronForward} size={16} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tvWrap: { flexDirection: "row", flexWrap: "wrap" },
  tvCell: { flexBasis: "48%", flexGrow: 1 },
  noColumnGap: { columnGap: 0 },
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  main: {
    flex: 1,
    minWidth: 0,
    maxWidth: LEARN_MAIN_MAX_WIDTH,
  },
  aside: {
    flexShrink: 0,
    alignSelf: "flex-start",
    gap: Spacing.three,
  },
  tile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  disabledRow: {
    flex: 1,
    gap: Spacing.one,
    alignItems: "flex-start",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  tileCopy: { flex: 1, gap: Spacing.half, minWidth: 0 },
  tileBadge: { alignSelf: "flex-start", marginTop: Spacing.half },
});
