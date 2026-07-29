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
  /**
   * Soft content column cap for landscape TV when a screen still needs a number
   * (list–detail overrides). Prefer leaving ScreenLayout uncapped on TV so the
   * tab pane fills after overscan padding.
   */
  contentMaxWidth: 1720,
  /** List–detail shells (Qur’an, Hadith, …) when an explicit cap is needed. */
  listDetailMaxWidth: 1720,
  /** Minimum width for the secondary/detail pane in list–detail layouts. */
  detailPaneMinWidth: 420,
  /** Soft ceiling for the detail pane so the primary list keeps room. */
  detailPaneMaxWidth: 720,
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
