import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
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
  getQuranGuideTajweedLessons,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranTajweedScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t, i18n } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lessons = useMemo(
    () => (contentReady ? getQuranGuideTajweedLessons() : []),
    [i18n.language, contentReady],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.tajweedTitle")}
      subtitle={t("learnQuran.tajweedSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/tajweed" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="tajweed" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.tajweedIntro")}</JannahCallout>

            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.tajweedListTitle")}
                icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
              />
              <LearnTopicGrid
                style={styles.rows}
                maxColumns={2}
                items={lessons.map((lesson) => ({
                  id: lesson.id,
                  icon: { ios: "music.note", android: "music_note", web: "music_note" },
                  title: lesson.title,
                  subtitle: lesson.summary,
                  onPress: () =>
                    router.push({
                      pathname: "/learn-quran/tajweed/[id]",
                      params: { id: lesson.id },
                    }),
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
export const generateMetadata = routeMetadata("/learn-quran/tajweed");
