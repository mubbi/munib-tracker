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
import {
  ensureBattlesContent,
  getBattlesLessonCount,
  getBattlesSectionOrder,
  getBattlesTopicsBySection,
  isBattlesContentReady,
} from "@/lib/battles";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useBattlesCompletedCount,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "why-battles": { ios: "questionmark.circle.fill", android: "help", web: "help" },
  "ethics-of-warfare": { ios: "shield.fill", android: "shield", web: "shield" },
  badr: { ios: "flag.fill", android: "flag", web: "flag" },
  uhud: { ios: "mountain.2.fill", android: "landscape", web: "landscape" },
  trench: { ios: "square.grid.3x3.fill", android: "grid_on", web: "grid_on" },
  khaybar: { ios: "building.2.fill", android: "castle", web: "castle" },
  mutah: { ios: "arrow.left.arrow.right", android: "swap_horiz", web: "swap_horiz" },
  "conquest-makkah": {
    ios: "building.columns.fill",
    android: "account_balance",
    web: "account_balance",
  },
  hunayn: { ios: "wind", android: "air", web: "air" },
  tabuk: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  "ghazawat-and-saraya": { ios: "map.fill", android: "map", web: "map" },
  "battles-after-prophet": { ios: "clock.fill", android: "schedule", web: "schedule" },
  "leadership-lessons": { ios: "person.3.fill", android: "groups", web: "groups" },
  "hadith-on-battles": {
    ios: "text.book.closed.fill",
    android: "auto_stories",
    web: "auto_stories",
  },
  references: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
};

export default function BattlesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureBattlesProgressLoaded();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureBattlesContent,
    isBattlesContentReady,
  );
  const completedCount = useBattlesCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const lessonTotal = useMemo(() => getBattlesLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const TOPICS_BY_SECTION = useMemo(
    () => getBattlesTopicsBySection(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const SECTION_ORDER = useMemo(() => getBattlesSectionOrder(), [i18n.language, contentVersion]);

  const quickLinks = useMemo(
    () => [
      {
        id: "timeline",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon,
        title: t("battles.quickTimeline"),
        subtitle: t("battles.quickTimelineHint"),
        tint: colors.accent,
        onPress: () => router.push("/battles/timeline" as Href),
      },
      {
        id: "badr",
        icon: { ios: "flag.fill", android: "flag", web: "flag" } as AppIcon,
        title: t("battles.quickBadr"),
        subtitle: t("battles.quickBadrHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push({ pathname: "/battles/[topic]", params: { topic: "badr" } }),
      },
      {
        id: "lessons",
        icon: { ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" } as AppIcon,
        title: t("battles.quickLessons"),
        subtitle: t("battles.quickLessonsHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/battles/lessons" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("battles.quickProgress"),
        subtitle: t("battles.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/battles/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.title")}
      subtitle={t("battles.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/battles" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.intro")}</JannahCallout>

          <LearnQuizNavRow
            quizPath={"/battles/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />

          <Card padding="three">
            <SectionHeader
              title={t("battles.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <JannahNavRow
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
            title={t("battles.progressCardTitle")}
            subtitle={t("battles.progressCardHint", {
              completed: completedCount,
              total: lessonTotal,
            })}
            badge={`${completedCount}/${lessonTotal}`}
            tint={colors.accent}
            onPress={() => router.push("/battles/progress" as Href)}
          />

          {SECTION_ORDER.map((section) => {
            const topics = TOPICS_BY_SECTION[section];
            if (!topics?.length) return null;
            return (
              <Card key={section} padding="three">
                <SectionHeader
                  title={t(`battles.section.${section}`)}
                  icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                  {t(`battles.section.${section}Hint`)}
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
                        topic.importance ? t(`battles.importance.${topic.importance}`) : undefined
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/battles/[topic]",
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
              title={t("battles.exploreTitle")}
              icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
            />
            <View style={styles.rows}>
              <JannahNavRow
                icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
                title={t("battles.timelineTitle")}
                subtitle={t("battles.timelineHint")}
                onPress={() => router.push("/battles/timeline" as Href)}
              />
              <JannahNavRow
                icon={{ ios: "person.2.fill", android: "people", web: "people" }}
                title={t("battles.figuresTitle")}
                subtitle={t("battles.figuresHint")}
                onPress={() => router.push("/battles/figures" as Href)}
              />
              <JannahNavRow
                icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                title={t("battles.versesTitle")}
                subtitle={t("battles.versesHint")}
                onPress={() => router.push("/battles/verses" as Href)}
              />
              <JannahNavRow
                icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
                title={t("battles.glossaryTitle")}
                subtitle={t("battles.glossaryHint")}
                onPress={() => router.push("/battles/glossary" as Href)}
              />
            </View>
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("battles.relatedTitle")}
              icon={{ ios: "link", android: "link", web: "link" }}
            />
            <View style={styles.rows}>
              <JannahNavRow
                icon={{ ios: "book.pages.fill", android: "history_edu", web: "history_edu" }}
                title={t("seerah.title")}
                subtitle={t("battles.seerahPointer")}
                onPress={() => router.push("/seerah")}
              />
              <JannahNavRow
                icon={{ ios: "leaf.fill", android: "park", web: "park" }}
                title={t("actions.jannah")}
                subtitle={t("battles.jannahPointer")}
                onPress={() => router.push("/jannah")}
              />
            </View>
          </Card>

          <View style={styles.pillRow}>
            <Pill
              label={t("battles.phaseV1")}
              compact
              color={colors.mutedForeground}
              background={colors.muted}
            />
          </View>

          <JannahDisclaimer textKey="battles.disclaimer" />
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
