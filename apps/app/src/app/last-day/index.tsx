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
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getLastDayLessonCount, getLastDayTopicsBySection } from "@/lib/last-day";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCompletedCount,
} from "@/stores/last-day-progress-store";

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "why-believe": { ios: "star.circle.fill", android: "stars", web: "stars" },
  death: { ios: "leaf.fill", android: "eco", web: "eco" },
  barzakh: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
  "signs-overview": { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  "minor-signs": { ios: "clock.fill", android: "schedule", web: "schedule" },
  "major-signs": { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  trumpet: { ios: "speaker.wave.3.fill", android: "campaign", web: "campaign" },
  resurrection: { ios: "arrow.up.circle.fill", android: "north", web: "north" },
  gathering: { ios: "person.3.fill", android: "groups", web: "groups" },
  intercession: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  "record-of-deeds": { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  scale: { ios: "scalemass.fill", android: "balance", web: "balance" },
  accountability: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  hawd: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  sirat: { ios: "road.lanes", android: "alt_route", web: "alt_route" },
  paradise: { ios: "leaf.fill", android: "park", web: "park" },
  hell: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  "without-reckoning": { ios: "heart.fill", android: "favorite", web: "favorite" },
  preparing: { ios: "figure.walk", android: "directions_walk", web: "directions_walk" },
};

export default function LastDayScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureLastDayProgressLoaded();
  const completedCount = useLastDayCompletedCount();
  const lessonTotal = getLastDayLessonCount();
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes
  const TOPICS_BY_SECTION = useMemo(() => getLastDayTopicsBySection(), [i18n.language]);
  const SECTION_ORDER = useMemo(
    () => Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>,
    [TOPICS_BY_SECTION],
  );

  const quickLinks = useMemo(
    () => [
      {
        id: "timeline",
        icon: { ios: "arrow.down.circle.fill", android: "south", web: "south" } as AppIcon,
        title: t("lastDay.quickTimeline"),
        subtitle: t("lastDay.quickTimelineHint"),
        tint: colors.accent,
        onPress: () => router.push("/last-day/timeline" as Href),
      },
      {
        id: "preparation",
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" } as AppIcon,
        title: t("lastDay.quickPreparation"),
        subtitle: t("lastDay.quickPreparationHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/last-day/preparation" as Href),
      },
      {
        id: "verses",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("lastDay.quickVerses"),
        subtitle: t("lastDay.quickVersesHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/last-day/verses" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("lastDay.quickProgress"),
        subtitle: t("lastDay.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/last-day/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.title")}
      subtitle={t("lastDay.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/last-day" />
      <Stagger>
        <JannahCallout tone="info">{t("lastDay.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("lastDay.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahNavRow
          icon={{ ios: "arrow.down.circle.fill", android: "south", web: "south" }}
          title={t("lastDay.timelineCardTitle")}
          subtitle={t("lastDay.timelineCardHint")}
          tint={colors.accent}
          onPress={() => router.push("/last-day/timeline" as Href)}
        />

        <JannahNavRow
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          title={t("lastDay.progressCardTitle")}
          subtitle={t("lastDay.progressCardHint", {
            completed: completedCount,
            total: lessonTotal,
          })}
          badge={`${completedCount}/${lessonTotal}`}
          tint={colors.accent}
          onPress={() => router.push("/last-day/progress" as Href)}
        />

        {SECTION_ORDER.map((section) => {
          const topics = TOPICS_BY_SECTION[section];
          if (!topics.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`lastDay.section.${section}`)}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                {t(`lastDay.section.${section}Hint`)}
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
                      topic.importance ? t(`lastDay.importance.${topic.importance}`) : undefined
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/last-day/[topic]",
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
            title={t("lastDay.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              title={t("lastDay.versesTitle")}
              subtitle={t("lastDay.versesHint")}
              onPress={() => router.push("/last-day/verses" as Href)}
            />
            <JannahNavRow
              icon={{ ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" }}
              title={t("lastDay.hadithTitle")}
              subtitle={t("lastDay.hadithHint")}
              onPress={() => router.push("/last-day/hadith" as Href)}
            />
            <JannahNavRow
              icon={{ ios: "questionmark.circle.fill", android: "quiz", web: "quiz" }}
              title={t("lastDay.quizTitle")}
              subtitle={t("lastDay.quizHint")}
              onPress={() => router.push("/last-day/quiz" as Href)}
            />
            <JannahNavRow
              icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
              title={t("lastDay.referencesTitle")}
              subtitle={t("lastDay.referencesHint")}
              onPress={() => router.push("/last-day/references" as Href)}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("lastDay.relatedTitle")}
            icon={{ ios: "link", android: "link", web: "link" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "leaf.fill", android: "park", web: "park" }}
              title={t("actions.jannah")}
              subtitle={t("lastDay.jannahPointer")}
              onPress={() => router.push("/jannah")}
            />
            <JannahNavRow
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              title={t("actions.aqeedah")}
              subtitle={t("lastDay.aqeedahPointer")}
              onPress={() => router.push("/aqeedah" as Href)}
            />
            <JannahNavRow
              icon={{ ios: "figure.stand", android: "self_improvement", web: "self_improvement" }}
              title={t("actions.salahGuide")}
              subtitle={t("lastDay.salahPointer")}
              onPress={() => router.push("/salah-guide")}
            />
          </View>
        </Card>

        <View style={styles.pillRow}>
          <Pill
            label={t("lastDay.phaseV1")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
        </View>

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
