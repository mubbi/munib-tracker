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
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { ensureTaharahContent, getTaharahChecklist, isTaharahContentReady } from "@/lib/taharah";

export default function TaharahChecklistScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureTaharahContent, isTaharahContentReady);
  const items = getTaharahChecklist();
  const wide = useLearnHubLayout();
  // Wide web / tablets: checklist steps flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 300, max: 3 });

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={t("taharah.checklistTitle")}
      subtitle={t("taharah.checklistSubtitle")}
      onBack={() => goBackOrReplace(router, "/taharah" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/taharah/checklist" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("taharah.checklistIntro")}</JannahCallout>

          <LearnReadingChrome surface="taharah">
            <Card>
              <SectionHeader
                title={t("taharah.checklistListTitle")}
                icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
              />
              <LearnColumnsGrid columns={columns} gap={Spacing.two} style={styles.list}>
                {items.map((item, index) => (
                  <TvReadableBlock key={item.id}>
                    <View style={[styles.row, { backgroundColor: tokens.accentSoft }]}>
                      <LearnProseText proseRole="title">{`${index + 1}. ${item.title}`}</LearnProseText>
                      <LearnProseText themeColor="mutedForeground">{item.hint}</LearnProseText>
                    </View>
                  </TvReadableBlock>
                ))}
              </LearnColumnsGrid>
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="taharah.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  row: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/taharah/checklist");
