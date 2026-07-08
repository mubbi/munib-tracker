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
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { getProphetsLessonCount, getProphetsTopicsBySection } from "@/lib/prophets";
import {
  useEnsureProphetsProgressLoaded,
  useProphetsCompletedCount,
} from "@/stores/prophets-progress-store";

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  adam: { ios: "person.crop.circle.fill", android: "account_circle", web: "account_circle" },
  nuh: { ios: "ferry.fill", android: "directions_boat", web: "directions_boat" },
  ibrahim: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  musa: { ios: "water.waves", android: "waves", web: "waves" },
  muhammad: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
};

export default function ProphetsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureProphetsProgressLoaded();
  const completedCount = useProphetsCompletedCount();
  const lessonTotal = getProphetsLessonCount();
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes
  const TOPICS_BY_SECTION = useMemo(() => getProphetsTopicsBySection(), [i18n.language]);
  const SECTION_ORDER = useMemo(
    () => Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>,
    [TOPICS_BY_SECTION],
  );

  const quickLinks = useMemo(
    () => [
      {
        id: "timeline",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon,
        title: t("prophets.quickTimeline"),
        subtitle: t("prophets.quickTimelineHint"),
        tint: colors.accent,
        onPress: () => router.push("/prophets/timeline" as Href),
      },
      {
        id: "muhammad",
        icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" } as AppIcon,
        title: t("prophets.quickMuhammad"),
        subtitle: t("prophets.quickMuhammadHint"),
        tint: tokens.status.info.color,
        onPress: () =>
          router.push({
            pathname: "/prophets/[topic]",
            params: { topic: "muhammad" },
          }),
      },
      {
        id: "prophets-lessons",
        icon: { ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" } as AppIcon,
        title: t("prophets.quickLessons"),
        subtitle: t("prophets.quickLessonsHint"),
        tint: tokens.status.success.color,
        onPress: () =>
          router.push({
            pathname: "/prophets/[topic]",
            params: { topic: "prophets-lessons" },
          }),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("prophets.quickProgress"),
        subtitle: t("prophets.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/prophets/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.title")}
      subtitle={t("prophets.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/prophets" />
      <Stagger>
        <JannahCallout tone="info">{t("prophets.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("prophets.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahNavRow
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          title={t("prophets.progressCardTitle")}
          subtitle={t("prophets.progressCardHint", {
            completed: completedCount,
            total: lessonTotal,
          })}
          badge={`${completedCount}/${lessonTotal}`}
          tint={colors.accent}
          onPress={() => router.push("/prophets/progress" as Href)}
        />

        {SECTION_ORDER.map((section) => {
          const topics = TOPICS_BY_SECTION[section];
          if (!topics.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`prophets.section.${section}`)}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                {t(`prophets.section.${section}Hint`)}
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
                      topic.importance ? t(`prophets.importance.${topic.importance}`) : undefined
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/prophets/[topic]",
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
            title={t("prophets.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
              title={t("prophets.timelineTitle")}
              subtitle={t("prophets.timelineHint")}
              onPress={() => router.push("/prophets/timeline" as Href)}
            />
            <JannahNavRow
              icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
              title={t("prophets.muhammadTitle")}
              subtitle={t("prophets.muhammadHint")}
              onPress={() =>
                router.push({
                  pathname: "/prophets/[topic]",
                  params: { topic: "muhammad" },
                })
              }
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("prophets.relatedTitle")}
            icon={{ ios: "link", android: "link", web: "link" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "book.pages.fill", android: "history_edu", web: "history_edu" }}
              title={t("seerah.title")}
              subtitle={t("prophets.seerahPointer")}
              onPress={() => router.push("/seerah")}
            />
            <JannahNavRow
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              title={t("quran.title")}
              subtitle={t("prophets.quranPointer")}
              onPress={() => router.push("/quran")}
            />
          </View>
        </Card>

        <View style={styles.pillRow}>
          <Pill
            label={t("prophets.phaseV1")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
        </View>

        <JannahDisclaimer textKey="prophets.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
