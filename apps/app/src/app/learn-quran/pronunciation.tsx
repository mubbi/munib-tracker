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
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureQuranGuideContent, getQuranGuidePronunciationPairs } from "@/lib/quran-guide";

export default function LearnQuranPronunciationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureContent(ensureQuranGuideContent);
  const pairs = getQuranGuidePronunciationPairs();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.pronunciationTitle")}
      subtitle={t("learnQuran.pronunciationSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/pronunciation" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.pronunciationIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          {pairs.map((pair) => (
            <Card key={pair.id} padding="three" style={styles.card}>
              <View style={styles.lettersRow}>
                {pair.letters.map((letter) => (
                  <ThemedText key={letter} type="arabic" style={styles.letter}>
                    {letter}
                  </ThemedText>
                ))}
              </View>
              <SectionHeader
                title={pair.title}
                icon={{ ios: "mouth.fill", android: "record_voice_over", web: "record_voice_over" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.tip}>
                {pair.tip}
              </ThemedText>
              <View style={styles.examples}>
                {pair.examples.map((ex) => (
                  <ThemedText key={ex} type="small">
                    {ex}
                  </ThemedText>
                ))}
              </View>
            </Card>
          ))}
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  lettersRow: { flexDirection: "row", gap: Spacing.four, justifyContent: "center" },
  letter: { fontSize: 40, lineHeight: 56 },
  tip: { lineHeight: 22 },
  examples: { gap: Spacing.one, marginTop: Spacing.two },
});
