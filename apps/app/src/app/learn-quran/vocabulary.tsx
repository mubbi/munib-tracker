import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnGrid,
  LearnSplitLayout,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { QuranVocabPlayButton } from "@/components/quran-guide/ayah-play-button";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import {
  LearnProseText,
  LearnReadingChrome,
  useReadingTypography,
} from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideVocabulary,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { routeMetadata } from "@/lib/seo/route-metadata";

function VocabWord({ word }: { word: ReturnType<typeof getQuranGuideVocabulary>[number] }) {
  const { sizes } = useReadingTypography();

  return (
    <View style={styles.word}>
      <View style={styles.wordHeader}>
        <ThemedText type="arabic" style={[arabicReadingLayout(sizes.arabic), styles.wordArabic]}>
          {word.arabic}
        </ThemedText>
        <QuranVocabPlayButton
          vocabId={word.id}
          title={word.transliteration}
          sourceHref="/learn-quran/vocabulary"
        />
      </View>
      <LearnProseText proseRole="title">{word.transliteration}</LearnProseText>
      <LearnProseText themeColor="mutedForeground">{word.meaning}</LearnProseText>
      {word.frequency ? (
        <LearnProseText proseRole="caption" themeColor="mutedForeground">
          {word.frequency}
        </LearnProseText>
      ) : null}
      {word.example ? (
        <LearnProseText proseRole="caption" style={styles.example}>
          {word.example}
        </LearnProseText>
      ) : null}
      {word.quranRef ? (
        <LearnProseText proseRole="caption" themeColor="mutedForeground">
          {word.quranRef.label}
        </LearnProseText>
      ) : null}
    </View>
  );
}

export default function LearnQuranVocabularyScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const words = getQuranGuideVocabulary();
  const listenText = useMemo(
    () =>
      [
        t("learnQuran.vocabIntro"),
        ...words.map((word) =>
          [word.transliteration, word.meaning, word.example].filter(Boolean).join(". "),
        ),
      ].join("\n\n"),
    [t, words],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.vocabTitle")}
      subtitle={t("learnQuran.vocabSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/vocabulary" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="vocabulary" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.vocabIntro")}</JannahCallout>

            <LearnReadingChrome surface="learn_quran" listenText={listenText}>
              <Card padding="three">
                <SectionHeader
                  title={t("learnQuran.vocabListTitle")}
                  icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
                />
                <LearnGrid style={styles.list} maxColumns={3} gap={Spacing.four}>
                  {words.map((word) => (
                    <VocabWord key={word.id} word={word} />
                  ))}
                </LearnGrid>
              </Card>
            </LearnReadingChrome>

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.four, marginTop: Spacing.three },
  word: { gap: Spacing.half },
  wordHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  wordArabic: { flex: 1, minWidth: 0 },
  example: { fontStyle: "italic", marginTop: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/vocabulary");
