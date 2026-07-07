import { type Href, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getLastDayReferences } from "@/lib/last-day";

export default function LastDayReferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const references = getLastDayReferences();

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.referencesTitle")}
      subtitle={t("lastDay.referencesSubtitle")}
      onBack={() => (goBackOrReplace(router, "/last-day" as Href))}
    >
      <Seo path="/last-day/references" />
      <Stagger>
        <JannahCallout tone="info">{t("lastDay.referencesIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("lastDay.referencesListTitle")}
            icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
          />
          <View style={styles.list}>
            {references.map((ref) => (
              <View key={ref.id} style={styles.item}>
                <ThemedText type="smallBold">{ref.title}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
                  {ref.note}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three, gap: Spacing.four },
  item: { gap: Spacing.one },
  note: { lineHeight: 18 },
});
