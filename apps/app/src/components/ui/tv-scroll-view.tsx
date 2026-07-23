import { forwardRef } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/**
 * ScrollView that does not become a TV focus target.
 *
 * On tvOS / Android TV, a focusable ScrollView steals D-pad / Select from
 * buttons and rows inside it. Keep scrolling enabled so focus moves between
 * children and the view still scrolls to keep them visible; only the chrome
 * itself is removed from the focus engine.
 *
 * Override with `focusable` when a screen intentionally needs a focusable scroller.
 */
export const TvScrollView = forwardRef<ScrollView, ScrollViewProps>(function TvScrollView(
  { focusable, ...rest },
  ref,
) {
  const tv = isTV();
  return <ScrollView ref={ref} focusable={focusable ?? !tv} {...rest} />;
});
