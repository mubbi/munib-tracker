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
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideVocabulary } from "@/lib/quran-guide";

export default function LearnQuranVocabularyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const words = getQuranGuideVocabulary();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.vocabTitle")}
      subtitle={t("learnQuran.vocabSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/vocabulary" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.vocabIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          <Card padding="three">
            <SectionHeader
              title={t("learnQuran.vocabListTitle")}
              icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
            />
            <View style={styles.list}>
              {words.map((word) => (
                <View key={word.id} style={styles.word}>
                  <ThemedText type="arabic" style={styles.arabic}>
                    {word.arabic}
                  </ThemedText>
                  <ThemedText type="smallBold">{word.transliteration}</ThemedText>
                  <ThemedText type="small" themeColor="mutedForeground">
                    {word.meaning}
                  </ThemedText>
                  {word.frequency ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {word.frequency}
                    </ThemedText>
                  ) : null}
                  {word.example ? (
                    <ThemedText type="caption" style={styles.example}>
                      {word.example}
                    </ThemedText>
                  ) : null}
                </View>
              ))}
            </View>
          </Card>
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.four, marginTop: Spacing.three },
  word: { gap: Spacing.half },
  arabic: { fontSize: 28, lineHeight: 44 },
  example: { fontStyle: "italic", marginTop: Spacing.one },
});
