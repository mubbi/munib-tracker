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
import { getAqeedahLessonCount, getAqeedahTopicsBySection } from "@/lib/aqeedah";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import {
  useAqeedahCompletedCount,
  useEnsureAqeedahProgressLoaded,
} from "@/stores/aqeedah-progress-store";

const TOPICS_BY_SECTION = getAqeedahTopicsBySection();
const SECTION_ORDER = Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>;

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "six-articles": { ios: "star.circle.fill", android: "stars", web: "stars" },
  "tawheed-explained": { ios: "circle.hexagongrid.fill", android: "hub", web: "hub" },
  "names-and-attributes": {
    ios: "text.book.closed.fill",
    android: "auto_stories",
    web: "auto_stories",
  },
};

export default function AqeedahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureAqeedahProgressLoaded();
  const completedCount = useAqeedahCompletedCount();
  const lessonTotal = getAqeedahLessonCount();

  const quickLinks = useMemo(
    () => [
      {
        id: "six-articles",
        icon: { ios: "star.circle.fill", android: "stars", web: "stars" } as AppIcon,
        title: t("aqeedah.quickSixArticles"),
        subtitle: t("aqeedah.quickSixArticlesHint"),
        tint: colors.accent,
        onPress: () =>
          router.push({
            pathname: "/aqeedah/[topic]",
            params: { topic: "six-articles" },
          }),
      },
      {
        id: "tawheed-explained",
        icon: { ios: "circle.hexagongrid.fill", android: "hub", web: "hub" } as AppIcon,
        title: t("aqeedah.quickTawheed"),
        subtitle: t("aqeedah.quickTawheedHint"),
        tint: tokens.status.info.color,
        onPress: () =>
          router.push({
            pathname: "/aqeedah/[topic]",
            params: { topic: "tawheed-explained" },
          }),
      },
      {
        id: "glossary",
        icon: { ios: "character.book.closed", android: "translate", web: "translate" } as AppIcon,
        title: t("aqeedah.quickGlossary"),
        subtitle: t("aqeedah.quickGlossaryHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/aqeedah/glossary" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("aqeedah.quickProgress"),
        subtitle: t("aqeedah.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/aqeedah/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={t("aqeedah.title")}
      subtitle={t("aqeedah.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/aqeedah" />
      <Stagger>
        <JannahCallout tone="info">{t("aqeedah.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("aqeedah.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahNavRow
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          title={t("aqeedah.progressCardTitle")}
          subtitle={t("aqeedah.progressCardHint", {
            completed: completedCount,
            total: lessonTotal,
          })}
          badge={`${completedCount}/${lessonTotal}`}
          tint={colors.accent}
          onPress={() => router.push("/aqeedah/progress" as Href)}
        />

        {SECTION_ORDER.map((section) => {
          const topics = TOPICS_BY_SECTION[section];
          if (!topics.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`aqeedah.section.${section}`)}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                {t(`aqeedah.section.${section}Hint`)}
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
                      topic.importance ? t(`aqeedah.importance.${topic.importance}`) : undefined
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/aqeedah/[topic]",
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
            title={t("aqeedah.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "star.circle.fill", android: "stars", web: "stars" }}
              title={t("aqeedah.sixArticlesTitle")}
              subtitle={t("aqeedah.sixArticlesHint")}
              onPress={() =>
                router.push({
                  pathname: "/aqeedah/[topic]",
                  params: { topic: "six-articles" },
                })
              }
            />
            <JannahNavRow
              icon={{ ios: "circle.hexagongrid.fill", android: "hub", web: "hub" }}
              title={t("aqeedah.tawheedTitle")}
              subtitle={t("aqeedah.tawheedHint")}
              onPress={() =>
                router.push({
                  pathname: "/aqeedah/[topic]",
                  params: { topic: "tawheed-explained" },
                })
              }
            />
            <JannahNavRow
              icon={{ ios: "character.book.closed", android: "translate", web: "translate" }}
              title={t("aqeedah.glossaryTitle")}
              subtitle={t("aqeedah.glossaryHint")}
              onPress={() => router.push("/aqeedah/glossary" as Href)}
            />
          </View>
        </Card>

        <View style={styles.pillRow}>
          <Pill
            label={t("aqeedah.phaseV1")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
        </View>

        <JannahDisclaimer textKey="aqeedah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
