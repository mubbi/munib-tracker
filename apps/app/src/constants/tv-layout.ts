import { tvDp } from "./tv-density";

/**
 * 10-foot UI tokens for Apple TV / Android TV / Fire TV.
 * Prefer these over per-screen magic numbers when `isTV()` is true.
 *
 * Layout tokens are authored in Android TV dp (960×540 canvas) and pre-scaled
 * with {@link tvDp} so tvOS (1920×1080pt) gets the same physical size.
 *
 * Font tokens (`bodyFontSize`, `titleFontSize`) are deliberately **unscaled** dp:
 * `ThemedText` applies the tvOS density to every font size it renders, so
 * scaling here too would double-apply on Apple TV.
 *
 * Sources: Android TV layouts (5% overscan = 48dp × 27dp, 58dp side keylines),
 * Fire TV design guidelines (inner 90% safe zone, ≥14sp body text),
 * tvOS HIG (60pt top/bottom, 80pt side safe area).
 */
export const TvLayout = {
  /** Minimum touch/focus target height for list rows and primary controls. */
  minFocusTarget: tvDp(64),
  /** Extra vertical padding inside scroll content. */
  contentPaddingY: tvDp(32),
  /** Horizontal overscan-safe inset (5% of 960dp; ≥ tvOS 80pt side margin). */
  contentPaddingX: tvDp(48),
  /** Vertical overscan-safe inset (5% of 540dp ≈ 27dp; tvOS 60pt). */
  overscanY: tvDp(28),
  /**
   * Soft content column cap for landscape TV when a screen still needs a number
   * (list–detail overrides). Prefer leaving ScreenLayout uncapped on TV so the
   * tab pane fills after overscan padding.
   */
  contentMaxWidth: tvDp(1720),
  /** Readable prose column (Learn articles) — ~70 characters at TV body size. */
  proseMaxWidth: tvDp(800),
  /** List–detail shells (Qur’an, Hadith, …) when an explicit cap is needed. */
  listDetailMaxWidth: tvDp(1720),
  /** Minimum width for the secondary/detail pane in list–detail layouts. */
  detailPaneMinWidth: tvDp(420),
  /** Soft ceiling for the detail pane so the primary list keeps room. */
  detailPaneMaxWidth: tvDp(720),
  /** Base body type bump vs phone (dp — ThemedText applies tvOS density). */
  bodyFontSize: 18,
  /** Title type bump vs phone (dp — ThemedText applies tvOS density). */
  titleFontSize: 30,
  /** Side rail width when labels are visible (focus on rail). */
  sideRailWidthExpanded: tvDp(288),
  /** Icon-only rail when D-pad focus is in content. */
  sideRailWidthCollapsed: tvDp(96),
  /** @deprecated Prefer sideRailWidthExpanded — kept for wide-layout helpers. */
  sideRailWidth: tvDp(288),
  /** Focus ring width (pt). */
  focusRingWidth: tvDp(3),
  /** Dense chip / filter row min height on TV. */
  chipMinHeight: tvDp(48),
  /** Gap between grid tiles / cards on TV (Android TV 20dp gutter). */
  gridGap: tvDp(20),
} as const;

/**
 * 10-foot type ramp (dp, pre-density). Phone sizes below ~14dp are unreadable
 * from a couch — Fire TV's floor is 14sp for body text; Compose for TV uses
 * 16/14/12 for body large/medium/small. ThemedText multiplies by TV_DENSITY on
 * tvOS (body 16dp → 32pt, close to tvOS HIG body 29pt).
 */
export const TvType = {
  default: { fontSize: 18, lineHeight: 28 },
  small: { fontSize: 16, lineHeight: 24 },
  smallBold: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 13, lineHeight: 18 },
  link: { fontSize: 16, lineHeight: 30 },
  linkPrimary: { fontSize: 16, lineHeight: 30 },
  code: { fontSize: 14, lineHeight: 20 },
  subtitle: { fontSize: 22, lineHeight: 30 },
  header: { fontSize: 28, lineHeight: 36 },
  title: { fontSize: 40, lineHeight: 48 },
  display: { fontSize: 56, lineHeight: 60 },
} as const;
