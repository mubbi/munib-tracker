import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahDuaBlock,
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
import {
  getLearnDuaLessonCount,
  getLearnDuaTopics,
  getLearnDuaTopicsBySection,
} from "@/lib/learn-dua";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useEnsureLearnDuaProgressLoaded,
  useLearnDuaCompletedCount,
} from "@/stores/learn-dua-progress-store";

const TOPICS_BY_SECTION = getLearnDuaTopicsBySection();
const SECTION_ORDER = Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>;
const FEATURED_TOPIC = getLearnDuaTopics().find((topic) => topic.phrases?.length);
const FEATURED_PHRASE = FEATURED_TOPIC?.phrases?.[0];

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "morning-evening": { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  "dua-etiquette": {
    ios: "hands.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  occasions: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  "quranic-duas": { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
};

export default function LearnDuaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureLearnDuaProgressLoaded();
  const completedCount = useLearnDuaCompletedCount();
  const lessonTotal = getLearnDuaLessonCount();

  const quickLinks = useMemo(
    () => [
      {
        id: "morning-evening",
        icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" } as AppIcon,
        title: t("learnDua.quickMorningEvening"),
        subtitle: t("learnDua.quickMorningEveningHint"),
        tint: colors.accent,
        onPress: () =>
          router.push({
            pathname: "/learn-dua/[topic]",
            params: { topic: "morning-evening" },
          }),
      },
      {
        id: "dua-etiquette",
        icon: {
          ios: "hands.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        } as AppIcon,
        title: t("learnDua.quickEtiquette"),
        subtitle: t("learnDua.quickEtiquetteHint"),
        tint: tokens.status.info.color,
        onPress: () =>
          router.push({
            pathname: "/learn-dua/[topic]",
            params: { topic: "dua-etiquette" },
          }),
      },
      {
        id: "occasions",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon,
        title: t("learnDua.quickOccasions"),
        subtitle: t("learnDua.quickOccasionsHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/learn-dua/occasions" as Href),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("learnDua.quickProgress"),
        subtitle: t("learnDua.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/learn-dua/progress" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("learnDua.eyebrow")}
      title={t("learnDua.title")}
      subtitle={t("learnDua.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/learn-dua" />
      <Stagger>
        <JannahCallout tone="info">{t("learnDua.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("learnDua.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahNavRow
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          title={t("learnDua.progressCardTitle")}
          subtitle={t("learnDua.progressCardHint", {
            completed: completedCount,
            total: lessonTotal,
          })}
          badge={`${completedCount}/${lessonTotal}`}
          tint={colors.accent}
          onPress={() => router.push("/learn-dua/progress" as Href)}
        />

        {SECTION_ORDER.map((section) => {
          const topics = TOPICS_BY_SECTION[section];
          if (!topics.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`learnDua.section.${section}`)}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                {t(`learnDua.section.${section}Hint`)}
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
                      topic.importance ? t(`learnDua.importance.${topic.importance}`) : undefined
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/learn-dua/[topic]",
                        params: { topic: topic.id },
                      })
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        {FEATURED_PHRASE ? (
          <JannahDuaBlock
            title={
              FEATURED_TOPIC
                ? t("learnDua.featuredPhraseTitleWithTopic", { topic: FEATURED_TOPIC.title })
                : t("learnDua.featuredPhraseTitle")
            }
            arabic={FEATURED_PHRASE.arabic}
            transliteration={FEATURED_PHRASE.transliteration}
            translation={FEATURED_PHRASE.translation}
            reference={FEATURED_PHRASE.reference}
          />
        ) : null}

        <Card padding="three">
          <SectionHeader
            title={t("learnDua.exploreTitle")}
            icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
          />
          <View style={styles.rows}>
            <JannahNavRow
              icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
              title={t("learnDua.occasionsTitle")}
              subtitle={t("learnDua.occasionsHint")}
              onPress={() => router.push("/learn-dua/occasions" as Href)}
            />
            <JannahNavRow
              icon={{
                ios: "hands.sparkles.fill",
                android: "volunteer_activism",
                web: "volunteer_activism",
              }}
              title={t("dua.title")}
              subtitle={t("learnDua.duaLibraryPointer")}
              onPress={() => router.push("/dua")}
            />
          </View>
        </Card>

        <View style={styles.pillRow}>
          <Pill
            label={t("learnDua.phaseV1")}
            compact
            color={colors.mutedForeground}
            background={colors.muted}
          />
        </View>

        <JannahDisclaimer textKey="learnDua.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
