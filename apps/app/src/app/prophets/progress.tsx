import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getProphetsLessonCount } from "@/lib/prophets";
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

  const snapshot = useMemo(
    () =>
      buildProphetsProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getProphetsLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.progressTitle")}
      subtitle={t("prophets.progressSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/prophets" as Href))}
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
          <View style={styles.links}>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() => router.push("/prophets/timeline" as Href)}
            >
              {t("prophets.timelineTitle")}
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() =>
                router.push({
                  pathname: "/prophets/[topic]",
                  params: { topic: "muhammad" },
                })
              }
            >
              {t("prophets.muhammadTitle")}
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() =>
                router.push({
                  pathname: "/prophets/[topic]",
                  params: { topic: "prophets-lessons" },
                })
              }
            >
              {t("prophets.lessonsTopicTitle")}
            </ThemedText>
          </View>
        </Card>

        <JannahDisclaimer textKey="prophets.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three, gap: Spacing.two },
  link: { textDecorationLine: "underline" },
});
