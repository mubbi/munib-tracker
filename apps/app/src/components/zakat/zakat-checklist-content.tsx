import { ZAKAT_CHECKLIST_COUNT } from "@munib-tracker/shared/content/zakat-guide";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout } from "@/components/jannah/primitives";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export function ZakatChecklistContent() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

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
        <View style={styles.list}>
          {checklist.map((item, index) => (
            <View
              key={item.id}
              style={[styles.item, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}
            >
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
          ))}
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
  item: {
    flexDirection: "row",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: Spacing.half },
});
