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
import { getLastDayLessonCount } from "@/lib/last-day";
import { buildLastDayProgress } from "@/lib/last-day-progress";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCompletedCount,
} from "@/stores/last-day-progress-store";

export default function LastDayProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureLastDayProgressLoaded();
  const completedCount = useLastDayCompletedCount();

  const snapshot = useMemo(
    () =>
      buildLastDayProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getLastDayLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.progressTitle")}
      subtitle={t("lastDay.progressSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/last-day" as Href))}
    >
      <Seo path="/last-day/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("lastDay.progressIntro")}</JannahCallout>

        <Card padding="three">
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

        <Card padding="three">
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

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
