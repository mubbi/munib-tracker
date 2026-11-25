import { Children, type ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { Breakpoints, Spacing } from "@/constants/theme";

/**
 * Column count for card / tile grids by window width (Material window size
 * classes, tuned for the desktop-web rail + capped content column):
 * compact <768 → 1 · medium ≥768 → 2 · expanded ≥1200 → 3 · large ≥1600 → 4.
 * Clamped to [min, max].
 */
export function responsiveColumns(width: number, { min = 1, max = 4 } = {}): number {
  const cols =
    width >= Breakpoints.xwide ? 4 : width >= 1200 ? 3 : width >= Breakpoints.tablet ? 2 : 1;
  return Math.max(min, Math.min(max, cols));
}

export function useResponsiveColumns(options?: { min?: number; max?: number }): number {
  const { width } = useWindowDimensions();
  return responsiveColumns(width, options);
}

type ResponsiveGridProps = {
  children: ReactNode;
  /** Fixed column count — overrides the width-based default (e.g. TV layouts). */
  columns?: number;
  /** Bounds for the width-based column count. */
  minColumns?: number;
  maxColumns?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Wrapping grid for cards / tiles that uses the available width on tablets and
 * desktop web while staying a single column on phones. Rows are equal-height
 * per row (`alignItems: "stretch"`); each cell gets an exact percentage width
 * so the last row keeps alignment with the rows above it.
 */
export function ResponsiveGrid({
  children,
  columns,
  minColumns,
  maxColumns,
  gap = Spacing.three,
  style,
}: ResponsiveGridProps) {
  const auto = useResponsiveColumns({ min: minColumns, max: maxColumns });
  const cols = Math.max(1, columns ?? auto);
  const items = Children.toArray(children).filter(Boolean);

  if (cols === 1) {
    return <View style={[{ gap }, style]}>{items}</View>;
  }

  // Width per cell accounting for (cols - 1) gaps inside the row.
  const cellWidth = `${100 / cols}%` as const;
  return (
    // Cells space themselves with padding — force columnGap 0 even if a caller
    // passes `gap` in `style`, or the row overflows and wraps a column early.
    <View
      style={[styles.grid, { marginHorizontal: -gap / 2, rowGap: gap }, style, styles.noColumnGap]}
    >
      {items.map((child, index) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: children are positional cells
          key={index}
          style={[styles.cell, { width: cellWidth, paddingHorizontal: gap / 2 }]}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  cell: {
    minWidth: 0,
  },
  noColumnGap: {
    columnGap: 0,
  },
});
