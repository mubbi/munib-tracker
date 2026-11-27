/**
 * Desktop / large-screen layout helpers for the Jannah-primitives module family
 * (Jannah, Jahannam, Last Day, Battles, Taharah, Hajj, Zakat, Fidyah and the
 * guide hubs): hub two-pane layouts, container-aware grid columns and
 * calculator asides.
 *
 * Everything is **width-gated** and returns the phone layout below 768px. TV
 * never takes the wide paths (`isTV()` short-circuits first) so D-pad layouts
 * stay exactly as they were. Topic articles use the shared Learn split layout
 * (`@/components/learn-guide/learn-wide-layout`) instead.
 */
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useStickyHeaderOffset } from "@/components/screen-layout";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Breakpoints, MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useGlobalRail } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

/** Mirrors `ScreenLayout`'s wide caps (non-prose routes). */
const WIDE_BREAKPOINT = 1024;
const XWIDE_BREAKPOINT = 1600;
const WIDE_CAP = 1120;
const XWIDE_CAP = 1320;
/** Side column width for hub / calculator asides. */
export const HUB_ASIDE_WIDTH = 340;
/** Minimum content column at which a side column is laid out beside the main one. */
const TWO_PANE_MIN_CONTENT = 960;
const PANE_GAP = Spacing.four;
/** Sticky aside offset on web before the floating header is measured. */
const STICKY_TOP = 88;

export type LearnHubLayout = {
  /** Window ≥768 and not TV. */
  isWide: boolean;
  /**
   * `maxContentWidth` for `ScreenLayout` on hubs / grids / calculators: lifts the
   * Learn prose cap (880) to the regular wide cap so grids and asides fit.
   * `undefined` below 1024 and on TV (ScreenLayout default applies).
   */
  maxContentWidth: number | undefined;
  /** Approximate width of the content column (after the web rail + gutters); 0 when not wide. */
  contentWidth: number;
  /** Lay a side column beside the main column. */
  twoPane: boolean;
  /** Width left for the main column when `twoPane` (else `contentWidth`). */
  mainWidth: number;
};

/**
 * Width-derived layout for Learn hubs, list grids and calculators. Memoized on
 * window width so resizing only recomputes when the inputs change.
 */
export function useLearnHubLayout(asideWidth: number = HUB_ASIDE_WIDTH): LearnHubLayout {
  const { width } = useWindowDimensions();
  const rail = useGlobalRail();
  const tv = isTV();
  return useMemo(() => {
    if (tv || width < Breakpoints.tablet) {
      // Phones and TV: zero widths so every derived column count / threshold
      // falls back to the original single-column layout.
      return {
        isWide: false,
        maxContentWidth: undefined,
        contentWidth: 0,
        twoPane: false,
        mainWidth: 0,
      };
    }
    const cap =
      width >= XWIDE_BREAKPOINT ? XWIDE_CAP : width >= WIDE_BREAKPOINT ? WIDE_CAP : MaxContentWidth;
    const contentWidth = Math.max(0, Math.min(cap, width - rail.width - Spacing.four * 2));
    const twoPane = contentWidth >= TWO_PANE_MIN_CONTENT;
    return {
      isWide: true,
      maxContentWidth: width >= WIDE_BREAKPOINT ? cap : undefined,
      contentWidth,
      twoPane,
      mainWidth: twoPane ? contentWidth - asideWidth - PANE_GAP : contentWidth,
    };
  }, [tv, width, rail.width, asideWidth]);
}

/**
 * Column count for cells of at least `minCell` px inside `available` px.
 * Always 1 on TV and on phone-width containers.
 */
export function learnColumnsFor(
  available: number,
  {
    minCell = 300,
    max = 3,
    gap = Spacing.three,
  }: { minCell?: number; max?: number; gap?: number } = {},
): number {
  if (isTV()) return 1;
  const cols = Math.floor((available + gap) / (minCell + gap));
  return Math.max(1, Math.min(max, cols));
}

/**
 * Main column + side column (only rendered when `useLearnHubLayout().twoPane`).
 * On web the aside is sticky while it fits in the viewport, so summaries and
 * shortcuts stay in view as the main column scrolls.
 */
export function LearnTwoPane({
  main,
  aside,
  asideWidth = HUB_ASIDE_WIDTH,
  gap = Spacing.four,
}: {
  main: ReactNode;
  aside: ReactNode;
  asideWidth?: number;
  /** Vertical gap between stacked children inside each column. */
  gap?: number;
}) {
  const { height } = useWindowDimensions();
  const [asideHeight, setAsideHeight] = useState(0);
  // Settle beneath the floating header — including a scroll-revealed toolbar
  // (e.g. the zakat filters) — not under it.
  const stickyTop = useStickyHeaderOffset(STICKY_TOP);
  // A taller-than-viewport sticky aside would hide its lower half until the
  // page ends — only pin it while it fits.
  const sticky =
    Platform.OS === "web" && asideHeight > 0 && asideHeight <= height - stickyTop - Spacing.four;
  return (
    <View style={styles.paneRow}>
      <View style={[styles.paneMain, { gap }]}>{main}</View>
      <View
        {...(Platform.OS === "web" ? { role: "complementary" as const } : {})}
        onLayout={(event) => setAsideHeight(event.nativeEvent.layout.height)}
        style={[styles.paneAside, { width: asideWidth, gap }, sticky ? webSticky(stickyTop) : null]}
      >
        {aside}
      </View>
    </View>
  );
}

/**
 * Grid wrapper with an explicit column count (from `learnColumnsFor`). One
 * column renders a plain stack, identical to the phone layout. Don't pass
 * `gap` inside `style` — the grid manages its own gutters.
 */
export function LearnColumnsGrid({
  columns,
  gap = Spacing.two,
  stackGap,
  style,
  children,
}: {
  columns: number;
  /** Gutter between cells (and between stacked rows unless `stackGap` is set). */
  gap?: number;
  /** Gap for the single-column stack — e.g. 0 for hairline-separated phone lists. */
  stackGap?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  if (columns <= 1) {
    return <View style={[{ gap: stackGap ?? gap }, style]}>{children}</View>;
  }
  return (
    <ResponsiveGrid columns={columns} gap={gap} style={style}>
      {children}
    </ResponsiveGrid>
  );
}

/**
 * Tile chrome for list rows rendered as grid cells: replaces hairline
 * separators with a muted card that fills the row height.
 */
export function useLearnTileStyle(): ViewStyle {
  const { colors } = useThemeTokens();
  return useMemo<ViewStyle>(
    () => ({
      flexGrow: 1,
      backgroundColor: colors.muted,
      borderRadius: Radius.md,
      borderCurve: "continuous",
      paddingHorizontal: Spacing.three,
    }),
    [colors.muted],
  );
}

/**
 * Wraps a separator-style list row in tile chrome when it sits in a
 * multi-column grid; renders the row untouched otherwise (phone / TV).
 */
export function LearnTile({ tiled, children }: { tiled: boolean; children: ReactNode }) {
  const tileStyle = useLearnTileStyle();
  if (!tiled) return <>{children}</>;
  return <View style={tileStyle}>{children}</View>;
}

// `position: sticky` is valid CSS on react-native-web but missing from RN's types.
const webSticky = (top: number) => ({ position: "sticky", top }) as unknown as ViewStyle;

const styles = StyleSheet.create({
  paneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: PANE_GAP,
    width: "100%",
  },
  paneMain: { flex: 1, minWidth: 0 },
  paneAside: { flexShrink: 0, alignSelf: "flex-start" },
});
