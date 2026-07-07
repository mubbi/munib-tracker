import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getTaharahChecklist } from "@/lib/taharah";

export default function TaharahChecklistScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const items = getTaharahChecklist();

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={t("taharah.checklistTitle")}
      subtitle={t("taharah.checklistSubtitle")}
      onBack={() => goBackOrReplace(router, "/taharah" as Href)}
    >
      <Seo path="/taharah/checklist" />
      <Stagger>
        <JannahCallout tone="info">{t("taharah.checklistIntro")}</JannahCallout>

        <LearnReadingChrome surface="taharah">
          <Card padding="three">
            <SectionHeader
              title={t("taharah.checklistListTitle")}
              icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
            />
            <View style={styles.list}>
              {items.map((item, index) => (
                <View key={item.id} style={[styles.row, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold">{`${index + 1}. ${item.title}`}</ThemedText>
                  <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
                    {item.hint}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>
        </LearnReadingChrome>

        <JannahDisclaimer textKey="taharah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  hint: { lineHeight: 20 },
});
