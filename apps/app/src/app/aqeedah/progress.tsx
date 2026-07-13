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
import { ensureAqeedahContent, getAqeedahLessonCount } from "@/lib/aqeedah";
import { buildAqeedahProgress } from "@/lib/aqeedah-progress";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useAqeedahCompletedCount,
  useEnsureAqeedahProgressLoaded,
} from "@/stores/aqeedah-progress-store";

export default function AqeedahProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureAqeedahProgressLoaded();
  const completedCount = useAqeedahCompletedCount();

  const { version: contentVersion } = useEnsureContent(ensureAqeedahContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildAqeedahProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getAqeedahLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={t("aqeedah.progressTitle")}
      subtitle={t("aqeedah.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/aqeedah" as Href)}
    >
      <Seo path="/aqeedah/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("aqeedah.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("aqeedah.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("aqeedah.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("aqeedah.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("aqeedah.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("aqeedah.progressExploreHint")}
          </ThemedText>
          <ContentLinkList
            style={styles.links}
            links={[
              {
                label: t("aqeedah.sixArticlesTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/aqeedah/[topic]",
                    params: { topic: "six-articles" },
                  }),
              },
              {
                label: t("aqeedah.tawheedTitle"),
                onPress: () =>
                  router.push({
                    pathname: "/aqeedah/[topic]",
                    params: { topic: "tawheed-explained" },
                  }),
              },
              {
                label: t("aqeedah.glossaryTitle"),
                onPress: () => router.push("/aqeedah/glossary" as Href),
              },
            ]}
          />
        </Card>

        <JannahDisclaimer textKey="aqeedah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  links: { marginTop: Spacing.three },
});
