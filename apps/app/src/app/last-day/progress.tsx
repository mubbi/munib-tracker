import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentLinkList } from "@/components/content/content-inline-link";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureLastDayContent, getLastDayLessonCount, isLastDayContentReady } from "@/lib/last-day";
import { buildLastDayProgress } from "@/lib/last-day-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCompletedCount,
} from "@/stores/last-day-progress-store";

export default function LastDayProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureLastDayProgressLoaded();
  const wide = useLearnHubLayout();
  // Wide web / tablets: progress + explore cards sit side by side.
  const columns = learnColumnsFor(wide.contentWidth, { minCell: 360, gap: Spacing.four, max: 2 });
  const completedCount = useLastDayCompletedCount();

  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureLastDayContent,
    isLastDayContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildLastDayProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getLastDayLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  const lessonsCard = (
    <Card key="lessons" padding="three">
      <SectionHeader
        title={t("lastDay.lessonsTitle")}
        icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("lastDay.lessonsHint")}
      </ThemedText>
      <View style={styles.lessonRow}>
        <ThemedText type="title">
          {t("lastDay.lessonsCount", {
            completed: snapshot.lessonsCompleted,
            total: snapshot.lessonsTotal,
          })}
        </ThemedText>
        <ProgressBar value={snapshot.lessonProgress} />
      </View>
    </Card>
  );

  const exploreCard = (
    <Card key="explore" padding="three">
      <SectionHeader
        title={t("lastDay.exploreTitle")}
        icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("lastDay.progressExploreHint")}
      </ThemedText>
      <ContentLinkList
        style={styles.links}
        links={[
          {
            label: t("lastDay.timelineTitle"),
            onPress: () => router.push("/last-day/timeline" as Href),
          },
          {
            label: t("lastDay.preparationTitle"),
            onPress: () => router.push("/last-day/preparation" as Href),
          },
          {
            label: t("lastDay.versesTitle"),
            onPress: () => router.push("/last-day/verses" as Href),
          },
          {
            label: t("lastDay.quizTitle"),
            onPress: () => router.push("/last-day/quiz" as Href),
          },
        ]}
      />
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.progressTitle")}
      subtitle={t("lastDay.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
    >
      <Seo path="/last-day/progress" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="warning">{t("lastDay.progressIntro")}</JannahCallout>

          {columns > 1 ? (
            <LearnColumnsGrid columns={columns} gap={Spacing.four}>
              {lessonsCard}
              {exploreCard}
            </LearnColumnsGrid>
          ) : (
            [lessonsCard, exploreCard]
          )}

          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/progress");
