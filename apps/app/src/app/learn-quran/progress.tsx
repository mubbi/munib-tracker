import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentLinkList } from "@/components/content/content-inline-link";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideLessonCount,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { buildQuranGuideProgress } from "@/lib/quran-guide-progress";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideCompletedCount,
} from "@/stores/quran-guide-progress-store";

export default function LearnQuranProgressScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  useEnsureQuranGuideProgressLoaded();
  const completedCount = useQuranGuideCompletedCount();

  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildQuranGuideProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getQuranGuideLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.progressTitle")}
      subtitle={t("learnQuran.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/progress" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.progressIntro")}</JannahCallout>

            <Card>
              <SectionHeader
                title={t("learnQuran.lessonsTitle")}
                icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
                {t("learnQuran.lessonsHint")}
              </ThemedText>
              <View style={styles.lessonRow}>
                <ThemedText type="title">
                  {t("learnQuran.lessonsCount", {
                    completed: snapshot.lessonsCompleted,
                    total: snapshot.lessonsTotal,
                  })}
                </ThemedText>
                <ProgressBar
                  value={snapshot.lessonProgress}
                  accessibilityLabel={t("learnQuran.lessonsTitle")}
                />
              </View>
            </Card>

            <Card>
              <SectionHeader
                title={t("learnQuran.exploreTitle")}
                icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
                {t("learnQuran.progressExploreHint")}
              </ThemedText>
              <ContentLinkList
                style={styles.links}
                links={[
                  {
                    label: t("learnQuran.dailyTitle"),
                    onPress: () => router.push("/learn-quran/daily" as Href),
                  },
                  {
                    label: t("learnQuran.vocabTitle"),
                    onPress: () => router.push("/learn-quran/vocabulary" as Href),
                  },
                  {
                    label: t("learnQuran.themesTitle"),
                    onPress: () => router.push("/learn-quran/themes" as Href),
                  },
                  { label: t("actions.quran"), onPress: () => router.push("/quran") },
                ]}
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
  hint: { marginTop: Spacing.one },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/progress");
