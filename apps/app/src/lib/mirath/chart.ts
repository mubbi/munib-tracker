import {
  type HeirType,
  type MirathResult,
  toFractionString,
  toPercent,
} from "@munib-tracker/shared/mirath";
import type { TFunction } from "i18next";

import { heirCountLabel } from "./explain";

/** One slice of the results chart: an inheriting heir group, or the unassigned rest. */
export type MirathChartSegment =
  | {
      kind: "heir";
      heir: HeirType;
      count: number;
      /** Exact group share, e.g. "1/6". */
      fraction: string;
      /** Display percentage (2 dp, from the exact rational). */
      percent: number;
      /** Palette slot: segments cycle through {@link MIRATH_CHART_HUE_COUNT} hues. */
      hue: number;
    }
  | { kind: "unallocated"; fraction: string; percent: number };

/** Number of distinct hues the chart cycles through (accent + the five category hues). */
export const MIRATH_CHART_HUE_COUNT = 6;

/**
 * Segments for the stacked share bar (NF-3.10 results chart), in the same
 * order as the results table: inheriting heirs, then the unassigned rest
 * (treasury / spouse-only remainder). Widths come from the exact rationals,
 * so the bar always sums to 100%.
 */
export function mirathChartSegments(result: MirathResult): MirathChartSegment[] {
  if (result.outcome !== "distributed") return [];
  const segments: MirathChartSegment[] = result.heirs
    .filter((h) => h.inherits)
    .map((h, i) => ({
      kind: "heir",
      heir: h.heir,
      count: h.count,
      fraction: toFractionString(h.share),
      percent: h.percent,
      hue: i % MIRATH_CHART_HUE_COUNT,
    }));
  if (result.unallocated) {
    segments.push({
      kind: "unallocated",
      fraction: toFractionString(result.unallocated.share),
      percent: toPercent(result.unallocated.share),
    });
  }
  return segments;
}

/** Legend / screen-reader label: "Mother: 1/6 (16.67%)". */
export function mirathSegmentLabel(t: TFunction, segment: MirathChartSegment): string {
  const name =
    segment.kind === "heir"
      ? heirCountLabel(t, segment.heir, segment.count)
      : t("mirath.chart.unallocated");
  return t("mirath.result.summaryLine", {
    heir: name,
    fraction: segment.fraction,
    percent: segment.percent,
  });
}

/** One accessibility label for the whole chart (the bar itself is a single element). */
export function mirathChartA11yLabel(
  t: TFunction,
  segments: readonly MirathChartSegment[],
): string {
  return t("mirath.chart.a11y", {
    shares: segments.map((s) => mirathSegmentLabel(t, s)).join(t("mirath.why.listSeparator")),
  });
}
