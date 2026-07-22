/**
 * 10-foot UI tokens for Apple TV / Android TV.
 * Prefer these over per-screen magic numbers when `isTV()` is true.
 */
export const TvLayout = {
  /** Minimum touch/focus target height for list rows and primary controls. */
  minFocusTarget: 56,
  /** Extra vertical padding inside scroll content. */
  contentPaddingY: 28,
  /** Extra horizontal padding for safe TV overscan. */
  contentPaddingX: 40,
  /** Base body type bump vs phone. */
  bodyFontSize: 18,
  /** Title type bump vs phone. */
  titleFontSize: 28,
  /** Side rail width on TV (slightly wider labels). */
  sideRailWidth: 260,
  /** Focus ring width (pt). */
  focusRingWidth: 3,
} as const;
