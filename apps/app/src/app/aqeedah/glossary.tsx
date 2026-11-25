import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  GlossaryNoMatches,
  GlossarySearchField,
  useGlossaryFilter,
} from "@/components/learn-guide/glossary-search";
import { LearnGrid, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureAqeedahContent, getAqeedahGlossary, isAqeedahContentReady } from "@/lib/aqeedah";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function AqeedahGlossaryScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureAqeedahContent, isAqeedahContentReady);
  const terms = getAqeedahGlossary();
  const { query, setQuery, visible, filtering } = useGlossaryFilter(terms);

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={t("aqeedah.glossaryTitle")}
      subtitle={t("aqeedah.glossarySubtitle")}
      onBack={() => goBackOrReplace(router, "/aqeedah" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/aqeedah/glossary" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <JannahCallout tone="info">{t("aqeedah.glossaryIntro")}</JannahCallout>

          <LearnReadingChrome surface="aqeedah">
            <Card>
              <SectionHeader
                title={t("aqeedah.glossaryListTitle")}
                icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
              />
              <GlossarySearchField value={query} onChangeText={setQuery} />
              {filtering && visible.length === 0 ? (
                <GlossaryNoMatches onClear={() => setQuery("")} />
              ) : (
                <LearnGrid style={styles.list} maxColumns={3} gap={Spacing.four}>
                  {visible.map((term) => (
                    // TV: prose-only list — each term is a D-pad stop so it can scroll.
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
                </LearnGrid>
              )}
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="aqeedah.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.four, marginTop: Spacing.three },
  term: { gap: Spacing.half },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/aqeedah/glossary");
