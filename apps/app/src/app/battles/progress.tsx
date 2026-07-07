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
import { getBattlesLessonCount } from "@/lib/battles";
import { buildBattlesProgress } from "@/lib/battles-progress";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useBattlesCompletedCount,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";

export default function BattlesProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureBattlesProgressLoaded();
  const completedCount = useBattlesCompletedCount();

  const snapshot = useMemo(
    () =>
      buildBattlesProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getBattlesLessonCount(),
      }),
    [completedCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.progressTitle")}
      subtitle={t("battles.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("battles.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("battles.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("battles.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("battles.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("battles.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("battles.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("battles.timelineTitle"),
                onPress: () => router.push("/battles/timeline" as Href),
              },
              {
                label: t("battles.lessonsTitle"),
                onPress: () => router.push("/battles/lessons" as Href),
              },
              {
                label: t("battles.versesTitle"),
                onPress: () => router.push("/battles/verses" as Href),
              },
              {
                label: t("battles.glossaryTitle"),
                onPress: () => router.push("/battles/glossary" as Href),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="battles.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
