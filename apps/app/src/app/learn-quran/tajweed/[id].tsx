import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahBody, JannahDisclaimer, JannahTakeaway } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getQuranGuideTajweedLesson } from "@/lib/quran-guide";

export default function LearnQuranTajweedDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getQuranGuideTajweedLesson(id);

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={lesson?.title ?? t("learnQuran.tajweedTitle")}
      subtitle={lesson?.summary ?? ""}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/learn-quran/tajweed" as Href)
      }
    >
      <Seo path="/learn-quran/tajweed" />
      {!lesson ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.tajweedTitle")}
          onAction={() => router.replace("/learn-quran/tajweed" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_quran">
            <JannahTakeaway text={lesson.summary} />
            <JannahBody paragraphs={lesson.explanation} />
            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.examplesTitle")}
                icon={{ ios: "textformat.abc", android: "abc", web: "abc" }}
              />
              <View style={styles.examples}>
                {lesson.examples.map((ex) => (
                  <ThemedText key={ex} type="arabic" style={styles.exampleArabic}>
                    {ex}
                  </ThemedText>
                ))}
              </View>
            </Card>
            {lesson.practice ? (
              <Card padding="three">
                <SectionHeader
                  title={t("learnQuran.practiceTitle")}
                  icon={{ ios: "figure.walk", android: "directions_walk", web: "directions_walk" }}
                />
                <ThemedText type="small" themeColor="mutedForeground">
                  {lesson.practice}
                </ThemedText>
              </Card>
            ) : null}
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  examples: { gap: Spacing.two, marginTop: Spacing.three },
  exampleArabic: { fontSize: 22, lineHeight: 36 },
});
