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
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureBattlesContent, getBattlesGlossary, isBattlesContentReady } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function BattlesGlossaryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const terms = getBattlesGlossary();
  const wide = useLearnHubLayout();
  // Wide web / tablets: glossary terms flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 260, max: 3 });

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.glossaryTitle")}
      subtitle={t("battles.glossarySubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/battles/glossary" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.glossaryIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            <Card padding="three">
              <SectionHeader
                title={t("battles.glossaryListTitle")}
                icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
              />
              <LearnColumnsGrid columns={columns} gap={Spacing.four} style={styles.list}>
                {terms.map((term) => (
                  <TvReadableBlock key={term.id}>
                    <View style={styles.term}>
                      <LearnProseText proseRole="title">{term.term}</LearnProseText>
                      {term.transliteration ? (
                        <LearnProseText proseRole="caption" themeColor="mutedForeground">
                          {term.transliteration}
                        </LearnProseText>
                      ) : null}
                      <LearnProseText themeColor="mutedForeground">
                        {term.definition}
                      </LearnProseText>
                    </View>
                  </TvReadableBlock>
                ))}
              </LearnColumnsGrid>
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  term: { gap: Spacing.half },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/glossary");
