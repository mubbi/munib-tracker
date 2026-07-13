import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentLinkList } from "@/components/content/content-inline-link";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
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
import { ensureProphetsContent, getProphetsLessonCount } from "@/lib/prophets";
import { buildProphetsProgress } from "@/lib/prophets-progress";
import {
  useEnsureProphetsProgressLoaded,
  useProphetsCompletedCount,
} from "@/stores/prophets-progress-store";

export default function ProphetsProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureProphetsProgressLoaded();
  const completedCount = useProphetsCompletedCount();

  const { version: contentVersion } = useEnsureContent(ensureProphetsContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildProphetsProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getProphetsLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.progressTitle")}
      subtitle={t("prophets.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
    >
      <Seo path="/prophets/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("prophets.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("prophets.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("prophets.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("prophets.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("prophets.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("prophets.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("prophets.timelineTitle"),
                onPress: () => router.push("/prophets/timeline" as Href),
              },
              {
                label: t("prophets.muhammadTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/prophets/[topic]",
                    params: { topic: "muhammad" },
                  }),
              },
              {
                label: t("prophets.lessonsTopicTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/prophets/[topic]",
                    params: { topic: "prophets-lessons" },
                  }),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="prophets.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
