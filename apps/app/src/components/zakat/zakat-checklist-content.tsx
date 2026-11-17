import { ZAKAT_CHECKLIST_COUNT } from "@munib-tracker/shared/content/zakat-guide";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout } from "@/components/jannah/primitives";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export function ZakatChecklistContent() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const wide = useLearnHubLayout();
  // Wide web / tablets: checklist items flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 300, max: 3 });

  const checklist = useMemo(
    () =>
      Array.from({ length: ZAKAT_CHECKLIST_COUNT }, (_, index) => ({
        id: `checklist-${index}`,
        title: t(`zakat.checklist.${index}.title`),
        body: t(`zakat.checklist.${index}.body`),
      })),
    [t],
  );

  return (
    <>
      <JannahCallout tone="warning">{t("zakat.checklistIntro")}</JannahCallout>

      <Card padding="three">
        <SectionHeader
          title={t("zakat.checklistTitle")}
          icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
        />
        <LearnColumnsGrid columns={columns} style={styles.list}>
          {checklist.map((item, index) => (
            <TvReadableBlock key={item.id}>
              <View style={[styles.item, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
                <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {index + 1}
                  </ThemedText>
                </View>
                <View style={styles.copy}>
                  <LearnProseText proseRole="title">{item.title}</LearnProseText>
                  <LearnProseText proseRole="caption" themeColor="mutedForeground">
                    {item.body}
                  </LearnProseText>
                </View>
              </View>
            </TvReadableBlock>
          ))}
        </LearnColumnsGrid>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  item: {
    flexDirection: "row",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  badge: {
    width: tvDp(28),
    height: tvDp(28),
    borderRadius: tvDp(14),
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: Spacing.half },
});
