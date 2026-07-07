import { type Href, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
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
import { getTaharahLessonCount } from "@/lib/taharah";
import { buildTaharahProgress } from "@/lib/taharah-progress";
import {
  useEnsureTaharahProgressLoaded,
  useTaharahCompletedCount,
} from "@/stores/taharah-progress-store";

export default function TaharahProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureTaharahProgressLoaded();
  const completedCount = useTaharahCompletedCount();

  const snapshot = useMemo(
    () =>
      buildTaharahProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getTaharahLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={t("taharah.progressTitle")}
      subtitle={t("taharah.progressSubtitle")}
      onBack={() => (goBackOrReplace(router, "/taharah" as Href))}
    >
      <Seo path="/taharah/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("taharah.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("taharah.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("taharah.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("taharah.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("taharah.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("taharah.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("taharah.checklistTitle"),
                onPress: () => router.push("/taharah/checklist" as Href),
              },
              {
                label: t("taharah.wuduTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/taharah/[topic]",
                    params: { topic: "wudu-steps" },
                  }),
              },
              {
                label: t("taharah.ghuslTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/taharah/[topic]",
                    params: { topic: "ghusl-steps" },
                  }),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="taharah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
