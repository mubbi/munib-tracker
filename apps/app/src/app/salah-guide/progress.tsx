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
import { goBackOrReplace } from "@/lib/navigation";
import { getSalahGuideLessonCount } from "@/lib/salah-guide";
import { buildSalahGuideProgress } from "@/lib/salah-guide-progress";
import {
  useEnsureSalahGuideProgressLoaded,
  useSalahGuideCompletedCount,
} from "@/stores/salah-guide-progress-store";

export default function SalahGuideProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureSalahGuideProgressLoaded();
  const completedCount = useSalahGuideCompletedCount();

  const snapshot = useMemo(
    () =>
      buildSalahGuideProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getSalahGuideLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={t("salahGuide.progressTitle")}
      subtitle={t("salahGuide.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
    >
      <Seo path="/salah-guide/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("salahGuide.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("salahGuide.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("salahGuide.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("salahGuide.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("salahGuide.exploreStepByStep"),
                onPress: () =>
                  router.push({
                    pathname: "/salah-guide/[topic]",
                    params: { topic: "how-to-pray" },
                  }),
              },
              {
                label: t("salahGuide.phrasesTitle"),
                onPress: () => router.push("/salah-guide/phrases" as Href),
              },
              {
                label: t("salahGuide.explorePositions"),
                onPress: () =>
                  router.push({
                    pathname: "/salah-guide/[topic]",
                    params: { topic: "positions" },
                  }),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="salahGuide.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
