import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

/** Wide web / tablets: readable form column for single-purpose settings pages. */
export const SETTINGS_FORM_MAX_WIDTH = 720;
/** Window width at which a form column cap kicks in (side rail visible). */
const SETTINGS_FORM_MIN_WIDTH = 768;
/** Window width at which card-heavy settings pages split into two columns. */
export const SETTINGS_COLUMNS_MIN_WIDTH = 1024;

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
  return !isTV() && width >= SETTINGS_COLUMNS_MIN_WIDTH;
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
