/** Metrics for the persistent desktop-web navigation rail (see WebGlobalRail). */

/** Window width at which the rail shows the brand + full-width labelled rows. */
export const WEB_RAIL_EXPANDED_BREAKPOINT = 1280;
export const WEB_RAIL_EXPANDED_WIDTH = 248;
export const WEB_RAIL_COMPACT_WIDTH = 88;

export function webRailWidthFor(windowWidth: number): number {
  return windowWidth >= WEB_RAIL_EXPANDED_BREAKPOINT
    ? WEB_RAIL_EXPANDED_WIDTH
    : WEB_RAIL_COMPACT_WIDTH;
}
