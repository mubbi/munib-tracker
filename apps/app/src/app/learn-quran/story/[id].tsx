import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  JannahBody,
  JannahDisclaimer,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideStories,
  getQuranGuideStory,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ id: string }> {
  return getQuranGuideStories().map((item) => ({ id: item.id }));
}

export default function LearnQuranStoryDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const story = getQuranGuideStory(id);

  const detailPath = story ? `/learn-quran/story/${story.id}` : "/learn-quran/stories";
  const crumbs = story
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("learnQuran.title"), path: "/learn-quran" },
        { name: story.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={story?.title ?? t("learnQuran.storiesTitle")}
      subtitle={story?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/learn-quran/stories" as Href)}
    >
      <Seo
        path={detailPath}
        title={story?.title}
        description={story?.summary}
        type={story ? "article" : undefined}
        index={!!story}
        breadcrumbs={crumbs}
        jsonLd={
          story
            ? [
                articleSchema({
                  path: detailPath,
                  headline: story.title,
                  description: story.summary ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
      {!contentReady ? (
        <LearnContentLoading />
      ) : !story ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.storiesTitle")}
          onAction={() => router.replace("/learn-quran/stories" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_quran">
            {story.location ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("learnQuran.storyLocation", { location: story.location })}
              </ThemedText>
            ) : null}
            <JannahTakeaway text={story.summary} />
            <JannahBody paragraphs={story.body} />
            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.lessonsTitle")}
                icon={{ ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" }}
              />
              <View style={styles.lessons}>
                {story.lessons.map((lesson) => (
                  <ThemedText key={lesson} type="small" themeColor="mutedForeground">
                    • {lesson}
                  </ThemedText>
                ))}
              </View>
            </Card>
            {story.quran?.length ? <JannahQuranEvidence refs={story.quran} /> : null}
            {story.appLinks?.length ? (
              <View style={styles.links}>
                {story.appLinks.map((link) => (
                  <Button
                    key={link.route}
                    label={link.label}
                    variant="secondary"
                    fullWidth
                    onPress={() => router.push(link.route as never)}
                  />
                ))}
              </View>
            ) : null}
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  lessons: { gap: Spacing.two, marginTop: Spacing.three },
  links: { gap: Spacing.two },
});
