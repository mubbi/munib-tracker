import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { StyleSheet, View } from "react-native";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { Spacing } from "@/constants/theme";

/** Centered report action for screen footers — flag icon with a short label. */
export function ContentReportFooterLink({ contentRef }: { contentRef: ContentReportReference }) {
  return (
    <View style={styles.row}>
      <ContentReportButton contentRef={contentRef} size={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.three,
  },
});
