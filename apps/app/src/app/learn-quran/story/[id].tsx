import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  JannahBody,
  JannahDisclaimer,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
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
import { getQuranGuideStory } from "@/lib/quran-guide";

export default function LearnQuranStoryDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = getQuranGuideStory(id);

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={story?.title ?? t("learnQuran.storiesTitle")}
      subtitle={story?.summary ?? ""}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/learn-quran/stories" as Href)
      }
    >
      <Seo path="/learn-quran/stories" />
      {!story ? (
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
