import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureLastDayContent, getLastDayReferences, isLastDayContentReady } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";

export default function LastDayReferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const references = getLastDayReferences();
  const wide = useLearnHubLayout();
  // Wide web / tablets: references flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 280, max: 3 });

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.referencesTitle")}
      subtitle={t("lastDay.referencesSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/last-day/references" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("lastDay.referencesIntro")}</JannahCallout>

          <Card padding="three">
            <SectionHeader
              title={t("lastDay.referencesListTitle")}
              icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
            />
            <LearnColumnsGrid columns={columns} gap={Spacing.four} style={styles.list}>
              {references.map((ref) => (
                <TvReadableBlock key={ref.id}>
                  <View style={styles.item}>
                    <ThemedText type="smallBold">{ref.title}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
                      {ref.note}
                    </ThemedText>
                  </View>
                </TvReadableBlock>
              ))}
            </LearnColumnsGrid>
          </Card>

          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  item: { gap: Spacing.one },
  note: { lineHeight: 18 },
});
