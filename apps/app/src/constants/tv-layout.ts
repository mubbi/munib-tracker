/**
 * 10-foot UI tokens for Apple TV / Android TV.
 * Prefer these over per-screen magic numbers when `isTV()` is true.
 */
export const TvLayout = {
  /** Minimum touch/focus target height for list rows and primary controls. */
  minFocusTarget: 64,
  /** Extra vertical padding inside scroll content. */
  contentPaddingY: 32,
  /** Extra horizontal padding for safe TV overscan. */
  contentPaddingX: 48,
  /** Base body type bump vs phone. */
  bodyFontSize: 18,
  /** Title type bump vs phone. */
  titleFontSize: 30,
  /** Side rail width when labels are visible (focus on rail). */
  sideRailWidthExpanded: 288,
  /** Icon-only rail when D-pad focus is in content. */
  sideRailWidthCollapsed: 96,
  /** @deprecated Prefer sideRailWidthExpanded — kept for wide-layout helpers. */
  sideRailWidth: 288,
  /** Focus ring width (pt). */
  focusRingWidth: 3,
  /** Dense chip / filter row min height on TV. */
  chipMinHeight: 48,
} as const;
