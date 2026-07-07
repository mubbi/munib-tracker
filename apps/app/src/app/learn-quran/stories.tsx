import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideStories } from "@/lib/quran-guide";

export default function LearnQuranStoriesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const stories = getQuranGuideStories();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.storiesTitle")}
      subtitle={t("learnQuran.storiesSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/stories" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.storiesIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("learnQuran.storiesListTitle")}
            icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
          />
          <View style={styles.rows}>
            {stories.map((story) => (
              <JannahNavRow
                key={story.id}
                icon={{ ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" }}
                title={story.prophetName}
                subtitle={story.summary}
                onPress={() =>
                  router.push({
                    pathname: "/learn-quran/story/[id]",
                    params: { id: story.id },
                  })
                }
              />
            ))}
          </View>
        </Card>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
