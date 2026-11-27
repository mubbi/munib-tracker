import type { WasiyyahData } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout } from "@/components/jannah/primitives";
import { Spacing } from "@/constants/theme";
import type { WasiyyahComputation, WasiyyahIssue } from "@/lib/wasiyyah/wasiyyah";

/** Blocking errors (warning tone) then advisory warnings (info tone). */
export function WasiyyahIssues({
  computation,
  data,
  only,
}: {
  computation: WasiyyahComputation;
  data: WasiyyahData;
  /** Restrict to some codes (e.g. the bequests step). */
  only?: readonly WasiyyahIssue["code"][];
}) {
  const { t } = useTranslation();
  const keep = (i: WasiyyahIssue) => !only || only.includes(i.code);
  const text = (issue: WasiyyahIssue) =>
    t(`wasiyyah.issue.${issue.code}`, {
      name: data.bequests.find((b) => b.id === issue.bequestId)?.beneficiary ?? "",
    });
  const errors = computation.errors.filter(keep);
  const warnings = computation.warnings.filter(keep);
  if (!errors.length && !warnings.length) return null;
  return (
    <View style={styles.stack} accessibilityLiveRegion="polite">
      {errors.map((issue) => (
        <JannahCallout key={`e-${issue.code}-${issue.bequestId ?? ""}`} tone="warning">
          {text(issue)}
        </JannahCallout>
      ))}
      {warnings.map((issue) => (
        <JannahCallout key={`w-${issue.code}-${issue.bequestId ?? ""}`} tone="info">
          {text(issue)}
        </JannahCallout>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: Spacing.two } });
