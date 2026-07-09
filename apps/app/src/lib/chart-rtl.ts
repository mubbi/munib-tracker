import type { ViewStyle } from "react-native";

import { isRTL, ltrControlStyle } from "@/lib/rtl";

/**
 * Charts use a fixed LTR coordinate plane so SVG arcs and absolutely-positioned
 * knobs stay aligned. Without this, Android/iOS mirror `left`/`transform` in RTL
 * while react-native-svg keeps its own non-flipped axis — the knob lands on the
 * opposite side of the ring from the arc head.
 */
export const chartCoordinateStyle = ltrControlStyle;

/**
 * Circular progress sweeps counter-clockwise in RTL so the fill travels with
 * reading direction (12 o'clock → left). Linear bars fill from the reading edge.
 */
export function progressSweepRtl(): boolean {
  return isRTL();
}

/** Horizontal scale origin for a progress fill that grows with reading direction. */
export function progressFillTransformOrigin(): "0% 50%" | "100% 50%" {
  return progressSweepRtl() ? "100% 50%" : "0% 50%";
}

/** Whether a segmented tick at `index` should render filled (LTR layout, reading-direction fill). */
export function segmentProgressFilled(
  index: number,
  total: number,
  completed: number,
  rtl = progressSweepRtl(),
): boolean {
  const clamped = Math.min(Math.max(0, completed), Math.max(0, total));
  return rtl ? index >= total - clamped : index < clamped;
}

/**
 * Segmented controls with a sliding thumb use the same fixed LTR coordinate
 * plane as charts. Pair with {@link chartCoordinateStyle} on the track and
 * {@link segmentedTrackDirection} for segment order.
 */
export function segmentedTrackDirection(): "row" | "row-reverse" {
  return isRTL() ? "row-reverse" : "row";
}

/** Anchor the sliding thumb to the reading-direction start of the track. */
export function segmentedThumbAnchor(pad: number, rtl = isRTL()): ViewStyle {
  return rtl ? { right: pad } : { left: pad };
}

/** Thumb translateX from its anchored edge (see {@link segmentedThumbAnchor}). */
export function segmentedThumbOffset(
  selectedIndex: number,
  segmentWidth: number,
  gap: number,
  rtl = isRTL(),
): number {
  const travel = selectedIndex * (segmentWidth + gap);
  if (travel === 0) return 0;
  return rtl ? -travel : travel;
}

/**
 * Sweep angle (radians) for a ring starting at 12 o'clock. Positive = clockwise
 * (LTR), negative = counter-clockwise (RTL).
 */
export function progressRingSweepAngle(progress: number, rtl = progressSweepRtl()): number {
  const clamped = Math.min(1, Math.max(0, progress));
  const sign = rtl ? -1 : 1;
  return sign * clamped * 2 * Math.PI;
}

/** Offset from ring centre to the arc head (knob anchor). */
export function progressRingKnobOffset(
  size: number,
  stroke: number,
  progress: number,
  rtl = progressSweepRtl(),
): { translateX: number; translateY: number } {
  const orbit = (size - stroke) / 2;
  const angle = progressRingSweepAngle(progress, rtl);
  return {
    translateX: orbit * Math.sin(angle),
    translateY: -orbit * Math.cos(angle),
  };
}

/**
 * Knob layout anchored at the ring centre then translated to the arc head.
 * Pair with {@link chartCoordinateStyle} on the ring root.
 */
export function progressRingKnobStyle(
  size: number,
  stroke: number,
  progress: number,
  knobSize: number,
  rtl = progressSweepRtl(),
): ViewStyle {
  const { translateX, translateY } = progressRingKnobOffset(size, stroke, progress, rtl);
  return {
    position: "absolute",
    left: size / 2 - knobSize / 2,
    top: size / 2 - knobSize / 2,
    width: knobSize,
    height: knobSize,
    transform: [{ translateX }, { translateY }],
  };
}

/** @deprecated Use {@link progressRingKnobOffset} — kept for tests. */
export function progressRingKnobPosition(
  size: number,
  stroke: number,
  progress: number,
  knobSize: number,
  rtl = progressSweepRtl(),
): { left: number; top: number } {
  const { translateX, translateY } = progressRingKnobOffset(size, stroke, progress, rtl);
  return {
    left: size / 2 + translateX - knobSize / 2,
    top: size / 2 + translateY - knobSize / 2,
  };
}

/**
 * SVG path for a partial ring arc from 12 o'clock. Uses standard SVG coords
 * (0 rad = 3 o'clock); sweep flag 1 = clockwise, 0 = counter-clockwise.
 */
export function progressRingArcPath(
  cx: number,
  cy: number,
  radius: number,
  progress: number,
  rtl = progressSweepRtl(),
): string | null {
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped <= 0) return null;

  const sweep = clamped * 2 * Math.PI;
  const startX = cx;
  const startY = cy - radius;
  const endAngle = rtl ? -Math.PI / 2 - sweep : -Math.PI / 2 + sweep;
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);
  const largeArc = sweep > Math.PI ? 1 : 0;
  const sweepFlag = rtl ? 0 : 1;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${endX} ${endY}`;
}

/** Web conic-gradient for a ring starting at 12 o'clock. */
export function progressRingConicGradient(
  fillColor: string,
  trackColor: string,
  progress: number,
  rtl = progressSweepRtl(),
): string {
  const deg = Math.min(1, Math.max(0, progress)) * 360;
  if (rtl) {
    const trackEnd = 360 - deg;
    return `conic-gradient(${trackColor} 0deg ${trackEnd}deg, ${fillColor} ${trackEnd}deg 360deg)`;
  }
  return `conic-gradient(${fillColor} 0deg ${deg}deg, ${trackColor} ${deg}deg 360deg)`;
}
