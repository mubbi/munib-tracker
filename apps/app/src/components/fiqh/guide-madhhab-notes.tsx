import type { FiqhDifferenceId } from "@munib-tracker/shared/fiqh";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { SCHOOLS_DIFFER_ICON } from "@/components/fiqh/schools-differ-icon";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

export { SCHOOLS_DIFFER_ICON };

/**
 * "Where the schools differ" block under a Learn guide topic (NF-3.0a). The
 * topic's prose stays; each linked difference renders as a structured
 * `<MadhhabNote>` — the user's school with "Other views", or the side-by-side
 * comparison in all-views mode. Renders nothing when the topic links none.
 */
export function GuideMadhhabNotes({ ids }: { ids: readonly FiqhDifferenceId[] | undefined }) {
  const { t } = useTranslation();
  if (!ids?.length) return null;
  return (
    <Card>
      <SectionHeader title={t("fiqhRetrofit.guideNotes.title")} icon={SCHOOLS_DIFFER_ICON} />
      <View style={styles.notes} testID="guide-madhhab-notes">
        {ids.map((id) => (
          <MadhhabNote key={id} id={id} />
        ))}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqh.disclaimer")}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  notes: { gap: Spacing.three, marginTop: Spacing.three },
});
