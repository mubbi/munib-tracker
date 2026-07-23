import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahNavRow,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureTaharahContent,
  getTaharahLessonCount,
  getTaharahTopicsBySection,
  isTaharahContentReady,
} from "@/lib/taharah";
import {
  useEnsureTaharahProgressLoaded,
  useTaharahCompletedCount,
} from "@/stores/taharah-progress-store";

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "wudu-steps": { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  "ghusl-steps": { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  tayammum: { ios: "hands.sparkles.fill", android: "pan_tool", web: "pan_tool" },
  "najasah-basics": { ios: "shield.fill", android: "shield", web: "shield" },
};

export default function TaharahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureTaharahProgressLoaded();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureTaharahContent,
    isTaharahContentReady,
  );
  const completedCount = useTaharahCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getTaharahLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const TOPICS_BY_SECTION = useMemo(
    () => getTaharahTopicsBySection(),
    [i18n.language, contentVersion],
  );
  const SECTION_ORDER = useMemo(
    () => Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>,
    [TOPICS_BY_SECTION],
  );

  const quickLinks = useMemo(
    () => [
      {
        id: "wudu-steps",
        icon: { ios: "drop.fill", android: "water_drop", web: "water_drop" } as AppIcon,
        title: t("taharah.quickWudu"),
        subtitle: t("taharah.quickWuduHint"),
        tint: colors.accent,
        onPress: () =>
          router.push({
            pathname: "/taharah/[topic]",
            params: { topic: "wudu-steps" },
          }),
      },
      {
        id: "ghusl-steps",
        icon: {
          ios: "figure.stand",
          android: "self_improvement",
          web: "self_improvement",
        } as AppIcon,
        title: t("taharah.quickGhusl"),
        subtitle: t("taharah.quickGhuslHint"),
        tint: tokens.status.info.color,
        onPress: () =>
          router.push({
            pathname: "/taharah/[topic]",
            params: { topic: "ghusl-steps" },
          }),
      },
      {
        id: "checklist",
        icon: { ios: "checklist", android: "checklist", web: "checklist" } as AppIcon,
        title: t("taharah.quickChecklist"),
        subtitle: t("taharah.quickChecklistHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/taharah/checklist" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("taharah.quickProgress"),
        subtitle: t("taharah.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/taharah/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={t("taharah.title")}
      subtitle={t("taharah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/taharah" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("taharah.intro")}</JannahCallout>

          <LearnQuizNavRow
            quizPath={"/taharah/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />

          <Card padding="three">
            <SectionHeader
              title={t("taharah.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <JannahNavRow
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
            title={t("taharah.progressCardTitle")}
            subtitle={t("taharah.progressCardHint", {
              completed: completedCount,
              total: lessonTotal,
            })}
            badge={`${completedCount}/${lessonTotal}`}
            tint={colors.accent}
            onPress={() => router.push("/taharah/progress" as Href)}
          />

          {SECTION_ORDER.map((section) => {
            const topics = TOPICS_BY_SECTION[section];
            if (!topics?.length) return null;
            return (
              <Card key={section} padding="three">
                <SectionHeader
                  title={t(`taharah.section.${section}`)}
                  icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                  {t(`taharah.section.${section}Hint`)}
                </ThemedText>
                <View style={styles.rows}>
                  {topics.map((topic) => (
                    <JannahNavRow
                      key={topic.id}
                      icon={
                        TOPIC_ICONS[topic.id] ?? {
                          ios: "text.book.closed",
                          android: "article",
                          web: "article",
                        }
                      }
                      title={topic.title}
                      subtitle={topic.summary}
                      badge={
                        topic.importance ? t(`taharah.importance.${topic.importance}`) : undefined
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/taharah/[topic]",
                          params: { topic: topic.id },
                        })
                      }
                    />
                  ))}
                </View>
              </Card>
            );
          })}

          <Card padding="three">
            <SectionHeader
              title={t("taharah.exploreTitle")}
              icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
            />
            <View style={styles.rows}>
              <JannahNavRow
                icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
                title={t("taharah.checklistTitle")}
                subtitle={tTv(t, "taharah.checklistHint", "taharah.checklistHintTv")}
                onPress={() => router.push("/taharah/checklist" as Href)}
              />
              <JannahNavRow
                icon={{ ios: "drop.fill", android: "water_drop", web: "water_drop" }}
                title={t("taharah.wuduTitle")}
                subtitle={t("taharah.wuduHint")}
                onPress={() =>
                  router.push({
                    pathname: "/taharah/[topic]",
                    params: { topic: "wudu-steps" },
                  })
                }
              />
              <JannahNavRow
                icon={{ ios: "figure.stand", android: "self_improvement", web: "self_improvement" }}
                title={t("taharah.ghuslTitle")}
                subtitle={t("taharah.ghuslHint")}
                onPress={() =>
                  router.push({
                    pathname: "/taharah/[topic]",
                    params: { topic: "ghusl-steps" },
                  })
                }
              />
            </View>
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("taharah.relatedTitle")}
              icon={{ ios: "link", android: "link", web: "link" }}
            />
            <View style={styles.rows}>
              <JannahNavRow
                icon={{ ios: "figure.stand", android: "self_improvement", web: "self_improvement" }}
                title={t("salahGuide.title")}
                subtitle={t("taharah.salahGuidePointer")}
                onPress={() => router.push("/salah-guide")}
              />
              <JannahNavRow
                icon={{
                  ios: "hands.and.sparkles.fill",
                  android: "volunteer_activism",
                  web: "volunteer_activism",
                }}
                title={t("learnDua.title")}
                subtitle={t("taharah.learnDuaPointer")}
                onPress={() => router.push("/learn-dua" as Href)}
              />
              <JannahNavRow
                icon={{
                  ios: "calendar.badge.exclamationmark",
                  android: "event_busy",
                  web: "event_busy",
                }}
                title={t("hayd.title")}
                subtitle={t("taharah.haydPointer")}
                onPress={() => router.push("/hayd")}
              />
            </View>
          </Card>

          <View style={styles.pillRow}>
            <Pill
              label={t("taharah.phaseV1")}
              compact
              color={colors.mutedForeground}
              background={colors.muted}
            />
          </View>

          <JannahDisclaimer textKey="taharah.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
