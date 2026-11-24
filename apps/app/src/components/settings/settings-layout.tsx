import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { LIST_DETAIL_BREAKPOINT } from "@/hooks/use-large-screen-layout";
import { isTV } from "@/lib/platform/is-tv";

/**
 * The ONE settings breakpoint source (§4.5.5). Replaces the old duplicated
 * `SETTINGS_TWO_COLUMN_MIN_WIDTH` (rows), `SETTINGS_COLUMNS_MIN_WIDTH`,
 * `APPEARANCE_TWO_COLUMN_MIN_WIDTH` and `PROFILE_TWO_COLUMN_MIN_WIDTH` constants.
 */
/** Wide web / tablets: readable form column for single-purpose settings pages. */
export const SETTINGS_FORM_MAX_WIDTH = 720;
/** Window width at which a form column cap kicks in (side rail visible). */
const SETTINGS_FORM_MIN_WIDTH = 768;
/** Window width at which card-heavy settings pages / row groups split into two columns. */
export const SETTINGS_TWO_COLUMN_MIN_WIDTH = 1024;
/** Hub becomes master–detail (groups left, selected group right) — the list-detail tier. */
export const SETTINGS_MASTER_DETAIL_MIN_WIDTH = LIST_DETAIL_BREAKPOINT;

/**
 * `maxContentWidth` for `ScreenLayout` on form-style settings pages: caps the
 * column (and the header aligned to it) at ~720px on wide windows so toggles,
 * inputs and buttons aren't stretched across a 1300px desktop canvas. Phones
 * and TV keep the default layout (undefined).
 */
export function useSettingsFormMaxWidth(): number | undefined {
  const { width } = useWindowDimensions();
  if (isTV() || width < SETTINGS_FORM_MIN_WIDTH) return undefined;
  return SETTINGS_FORM_MAX_WIDTH;
}

/** True when a card-heavy settings page should use `SettingsColumns` (never on TV). */
export function useSettingsTwoColumn(): boolean {
  const { width } = useWindowDimensions();
  return !isTV() && width >= SETTINGS_TWO_COLUMN_MIN_WIDTH;
}

/** Wide web / tablets: the hub shows groups and the selected group side by side. */
export function useSettingsMasterDetail(): boolean {
  const { width } = useWindowDimensions();
  return !isTV() && width >= SETTINGS_MASTER_DETAIL_MIN_WIDTH;
}

/**
 * Two independent card columns (start / end) for wide windows — avoids the
 * equal-height row gaps a grid would leave between cards of different heights.
 */
export function SettingsColumns({ start, end }: { start: ReactNode; end: ReactNode }) {
  return (
    <View style={styles.columns}>
      <View style={styles.column}>{start}</View>
      <View style={styles.column}>{end}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  column: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.four,
  },
});
