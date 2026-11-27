import { StyleSheet } from "react-native";
import { Radius, Spacing } from "@/constants/theme";

/** Styles shared by the surah reader route's control rows and the extracted reader controls. */
export const readerControlStyles = StyleSheet.create({
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  /** Pushes switches / font controls to the outer edge opposite the label. */
  controlValue: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    minWidth: 0,
  },
  playSurah: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
