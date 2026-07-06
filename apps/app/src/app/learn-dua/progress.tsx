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
import { getLearnDuaLessonCount } from "@/lib/learn-dua";
import { buildLearnDuaProgress } from "@/lib/learn-dua-progress";
import {
  useEnsureLearnDuaProgressLoaded,
  useLearnDuaCompletedCount,
} from "@/stores/learn-dua-progress-store";

export default function LearnDuaProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureLearnDuaProgressLoaded();
  const completedCount = useLearnDuaCompletedCount();

  const snapshot = useMemo(
    () =>
      buildLearnDuaProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getLearnDuaLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("learnDua.eyebrow")}
      title={t("learnDua.progressTitle")}
      subtitle={t("learnDua.progressSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-dua" as Href))}
    >
      <Seo path="/learn-dua/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("learnDua.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("learnDua.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("learnDua.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("learnDua.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("learnDua.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("learnDua.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("learnDua.morningEveningTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/learn-dua/[topic]",
                    params: { topic: "morning-evening" },
                  }),
              },
              {
                label: t("learnDua.duaEtiquetteTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/learn-dua/[topic]",
                    params: { topic: "dua-etiquette" },
                  }),
              },
              {
                label: t("learnDua.occasionsTitle"),
                onPress: () => router.push("/learn-dua/occasions" as Href),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="learnDua.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
