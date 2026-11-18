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
  getQuranGuideThemes,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranThemesScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const themes = getQuranGuideThemes();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.themesTitle")}
      subtitle={t("learnQuran.themesSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/themes" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="themes" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.themesIntro")}</JannahCallout>

            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.themesListTitle")}
                icon={{ ios: "tag.fill", android: "label", web: "label" }}
              />
              <LearnTopicGrid
                style={styles.rows}
                maxColumns={2}
                items={themes.map((theme) => ({
                  id: theme.id,
                  icon: { ios: "leaf.fill", android: "park", web: "park" },
                  title: theme.title,
                  subtitle: theme.summary,
                  onPress: () =>
                    router.push({ pathname: "/learn-quran/theme/[id]", params: { id: theme.id } }),
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
export const generateMetadata = routeMetadata("/learn-quran/themes");
