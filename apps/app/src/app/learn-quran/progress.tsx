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
import { getQuranGuideLessonCount } from "@/lib/quran-guide";
import { buildQuranGuideProgress } from "@/lib/quran-guide-progress";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideCompletedCount,
} from "@/stores/quran-guide-progress-store";

export default function LearnQuranProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureQuranGuideProgressLoaded();
  const completedCount = useQuranGuideCompletedCount();

  const snapshot = useMemo(
    () =>
      buildQuranGuideProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getQuranGuideLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.progressTitle")}
      subtitle={t("learnQuran.progressSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-quran" as Href))}
    >
      <Seo path="/learn-quran/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("learnQuran.progressIntro")}</JannahCallout>

        <Card padding="three">
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
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("learnQuran.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("learnQuran.progressExploreHint")}
          </ThemedText>
          <View style={styles.links}>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() => router.push("/learn-quran/daily" as Href)}
            >
              {t("learnQuran.dailyTitle")}
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() => router.push("/learn-quran/vocabulary" as Href)}
            >
              {t("learnQuran.vocabTitle")}
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.link}
              onPress={() => router.push("/learn-quran/themes" as Href)}
            >
              {t("learnQuran.themesTitle")}
            </ThemedText>
            <ThemedText type="small" style={styles.link} onPress={() => router.push("/quran")}>
              {t("actions.quran")}
            </ThemedText>
          </View>
        </Card>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
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
