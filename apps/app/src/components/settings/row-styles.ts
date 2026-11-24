import { StyleSheet } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";

/** Shared surface for settings rows that aren't plain `SettingsRow`s. */
export const rowStyles = StyleSheet.create({
  block: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  blockTv: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  copy: { flex: 1, gap: 2, minWidth: "40%" },
  titleLine: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  minTv: { minHeight: TvLayout.minFocusTarget },
});
