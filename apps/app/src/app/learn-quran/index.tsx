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
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideJourneyOrder,
  getQuranGuideLessonCount,
  getQuranGuideTopicRoute,
  getQuranGuideTopicsByJourney,
} from "@/lib/quran-guide";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideCompletedCount,
} from "@/stores/quran-guide-progress-store";

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  revelation: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  structure: { ios: "square.stack.3d.up.fill", android: "layers", web: "layers" },
  "learn-to-read": { ios: "character.book.closed", android: "menu_book", web: "menu_book" },
  tajweed: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
  "arabic-letters": { ios: "textformat.abc", android: "abc", web: "abc" },
  pronunciation: { ios: "mouth.fill", android: "record_voice_over", web: "record_voice_over" },
  vocabulary: { ios: "character.book.closed", android: "translate", web: "translate" },
  tafsir: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
  themes: { ios: "tag.fill", android: "label", web: "label" },
  stories: { ios: "person.3.fill", android: "groups", web: "groups" },
  miracles: { ios: "star.fill", android: "star", web: "star" },
  memorization: { ios: "brain.head.profile", android: "psychology", web: "psychology" },
  "daily-lessons": { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  tadabbur: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
  "apply-the-quran": { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  quiz: { ios: "questionmark.circle.fill", android: "quiz", web: "quiz" },
  references: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
};

export default function LearnQuranScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureQuranGuideProgressLoaded();
  const { version: contentVersion } = useEnsureContent(ensureQuranGuideContent);
  const completedCount = useQuranGuideCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const lessonTotal = useMemo(() => getQuranGuideLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const TOPICS_BY_JOURNEY = useMemo(
    () => getQuranGuideTopicsByJourney(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const JOURNEY_ORDER = useMemo(() => getQuranGuideJourneyOrder(), [i18n.language, contentVersion]);

  const quickLinks = useMemo(
    () => [
      {
        id: "daily",
        icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" } as AppIcon,
        title: t("learnQuran.quickDaily"),
        subtitle: t("learnQuran.quickDailyHint"),
        tint: colors.accent,
        onPress: () => router.push("/learn-quran/daily" as Href),
      },
      {
        id: "read",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("learnQuran.quickRead"),
        subtitle: t("learnQuran.quickReadHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/quran"),
      },
      {
        id: "vocabulary",
        icon: { ios: "character.book.closed", android: "translate", web: "translate" } as AppIcon,
        title: t("learnQuran.quickVocab"),
        subtitle: t("learnQuran.quickVocabHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/learn-quran/vocabulary" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("learnQuran.quickProgress"),
        subtitle: t("learnQuran.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/learn-quran/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.title")}
      subtitle={t("learnQuran.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/learn-quran" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("learnQuran.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahNavRow
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          title={t("learnQuran.progressCardTitle")}
          subtitle={t("learnQuran.progressCardHint", {
            completed: completedCount,
            total: lessonTotal,
          })}
          badge={`${completedCount}/${lessonTotal}`}
          tint={colors.accent}
          onPress={() => router.push("/learn-quran/progress" as Href)}
        />

        {JOURNEY_ORDER.map((phase) => {
          const topics = TOPICS_BY_JOURNEY[phase];
          if (!topics?.length) return null;
          return (
            <Card key={phase} padding="three">
              <SectionHeader
                title={t(`learnQuran.journey.${phase}`)}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.phaseHint}>
                {t(`learnQuran.journey.${phase}Hint`)}
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
                      topic.comingSoon
                        ? t("learnQuran.comingSoon")
                        : topic.importance
                          ? t(`learnQuran.importance.${topic.importance}`)
                          : undefined
                    }
                    onPress={() => router.push(getQuranGuideTopicRoute(topic.id) as Href)}
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <Card padding="three">
          <SectionHeader
            title={t("learnQuran.relatedTitle")}
            icon={{ ios: "link", android: "link", web: "link" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              title={t("actions.quran")}
              subtitle={t("learnQuran.quranReaderPointer")}
              onPress={() => router.push("/quran")}
            />
            <JannahNavRow
              icon={{ ios: "figure.stand", android: "self_improvement", web: "self_improvement" }}
              title={t("actions.salahGuide")}
              subtitle={t("learnQuran.salahPointer")}
              onPress={() => router.push("/salah-guide")}
            />
            <JannahNavRow
              icon={{ ios: "leaf.fill", android: "park", web: "park" }}
              title={t("actions.jannah")}
              subtitle={t("learnQuran.jannahPointer")}
              onPress={() => router.push("/jannah")}
            />
          </View>
        </Card>

        <View style={styles.pillRow}>
          <Pill
            label={t("learnQuran.phaseV1")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
          <Pill
            label={t("learnQuran.phaseV2")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
          <Pill
            label={t("learnQuran.phaseV3")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
        </View>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  phaseHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
