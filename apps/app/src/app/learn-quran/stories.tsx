import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnSplitLayout,
  LearnTopicGrid,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideStories,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranStoriesScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const stories = getQuranGuideStories();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.storiesTitle")}
      subtitle={t("learnQuran.storiesSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/stories" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="stories" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.storiesIntro")}</JannahCallout>

            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.storiesListTitle")}
                icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
              />
              <LearnTopicGrid
                style={styles.rows}
                maxColumns={2}
                items={stories.map((story) => ({
                  id: story.id,
                  icon: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
                  title: story.prophetName,
                  subtitle: story.summary,
                  onPress: () =>
                    router.push({ pathname: "/learn-quran/story/[id]", params: { id: story.id } }),
                }))}
              />
            </Card>

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/stories");
