import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

/**
 * D-pad "reading stop" for long-form prose on TV.
 *
 * TV scroll views are not focus targets, so a remote can only scroll as far as
 * the next focusable control — paragraphs between controls get skipped and the
 * tail of an article is unreachable. On TV this wraps a prose block in a
 * focusable (no-op) `PressableScale` so Down/Up step through the text and the
 * scroller keeps it in view, with the standard focus ring as the cue.
 *
 * Phone / tablet / web: renders `children` unchanged (no wrapper).
 *
 * Never wrap content that already contains focusable controls (buttons, links)
 * — nested focusables are unreachable on tvOS.
 */
export function TvReadableBlock({
  children,
  accessibilityLabel,
  preferredFocus,
  style,
}: {
  children: ReactNode;
  accessibilityLabel?: string;
  /** TV: request initial D-pad focus (e.g. a deep-linked item). */
  preferredFocus?: boolean;
  /** TV-only extra style for the focus host (padding is applied by default). */
  style?: StyleProp<ViewStyle>;
}) {
  if (!isTV()) return <>{children}</>;
  return (
    <PressableScale
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      ripple={false}
      scaleTo={1}
      // Reading stops keep text still — the ring alone marks focus (no zoom jitter).
      tvFocusScale={1}
      {...(preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[styles.block, style]}
    >
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  // Room for the focus ring so it does not sit on top of the glyphs. No
  // horizontal margins here: PressableScale grows the ring via `margin`, and an
  // edge-specific margin would override it and reflow the text on focus.
  block: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
