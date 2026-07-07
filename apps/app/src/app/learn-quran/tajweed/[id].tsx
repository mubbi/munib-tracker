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
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideTajweedLesson, getQuranGuideTajweedLessons } from "@/lib/quran-guide";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ id: string }> {
  return getQuranGuideTajweedLessons().map((item) => ({ id: item.id }));
}

export default function LearnQuranTajweedDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getQuranGuideTajweedLesson(id);

  const detailPath = lesson ? `/learn-quran/tajweed/${lesson.id}` : "/learn-quran/tajweed";
  const crumbs = lesson
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("learnQuran.title"), path: "/learn-quran" },
        { name: lesson.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={lesson?.title ?? t("learnQuran.tajweedTitle")}
      subtitle={lesson?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/learn-quran/tajweed" as Href)}
    >
      <Seo
        path={detailPath}
        title={lesson?.title}
        description={lesson?.summary}
        type={lesson ? "article" : undefined}
        index={!!lesson}
        breadcrumbs={crumbs}
        jsonLd={
          lesson
            ? [
                articleSchema({
                  path: detailPath,
                  headline: lesson.title,
                  description: lesson.summary ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
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
