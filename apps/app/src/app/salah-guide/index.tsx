import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahDuaBlock } from "@/components/jannah/primitives";
import { LearnHubScreen, type LearnHubSection } from "@/components/learn-guide";
import { FatihahCheckCard } from "@/components/quran/recite-along-fatihah-card";
import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import {
  ensureSalahGuideContent,
  getPrayerRakats,
  getSalahGuideLessonCount,
  getSalahGuidePhrases,
  getSalahGuideTopicsByJourney,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureSalahGuideProgressLoaded,
  useSalahGuideCompletedCount,
} from "@/stores/salah-guide-progress-store";

const JOURNEY_ORDER = ["why", "prepare", "learn", "practice", "perfect", "consistency"] as const;

const DEFAULT_TOPIC_ICON: AppIcon = {
  ios: "text.book.closed",
  android: "article",
  web: "article",
};

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "why-salah": { ios: "heart.fill", android: "favorite", web: "favorite" },
  importance: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  "who-must-pray": { ios: "person.3.fill", android: "groups", web: "groups" },
  conditions: { ios: "checklist", android: "checklist", web: "checklist" },
  taharah: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  wudu: { ios: "hands.sparkles.fill", android: "volunteer_activism", web: "volunteer_activism" },
  tayammum: { ios: "hand.raised.fill", android: "back_hand", web: "back_hand" },
  clothing: { ios: "tshirt.fill", android: "checkroom", web: "checkroom" },
  "prayer-times": { ios: "clock.fill", android: "schedule", web: "schedule" },
  qiblah: { ios: "location.north.fill", android: "explore", web: "explore" },
  adhan: { ios: "speaker.wave.3.fill", android: "campaign", web: "campaign" },
  "how-to-pray": { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  "jahri-sirri": { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" },
  positions: { ios: "figure.walk", android: "directions_walk", web: "directions_walk" },
  "common-mistakes": { ios: "xmark.circle.fill", android: "cancel", web: "cancel" },
  "sunnah-practices": { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  khushu: { ios: "brain.head.profile", android: "psychology", web: "psychology" },
  "pillars-nullifiers": {
    ios: "building.columns.fill",
    android: "account_balance",
    web: "account_balance",
  },
  "prayer-types": { ios: "square.grid.2x2.fill", android: "apps", web: "apps" },
  congregational: { ios: "person.2.fill", android: "groups", web: "groups" },
  qada: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
  "after-salah": {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
};

export default function SalahGuideScreen() {
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  useEnsureSalahGuideProgressLoaded();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureSalahGuideContent, isSalahGuideContentReady);
  const completedCount = useSalahGuideCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getSalahGuideLessonCount(), [contentVersion]);
  // Recompute when locale changes or the lazy content chunk finishes loading.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsByJourney = useMemo(
    () => getSalahGuideTopicsByJourney(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const featuredPhrase = useMemo(() => getSalahGuidePhrases()[0], [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const rakats = useMemo(() => getPrayerRakats(), [contentVersion]);

  const sections = useMemo<LearnHubSection[]>(() => {
    const journeys = JOURNEY_ORDER.flatMap((phase): LearnHubSection[] => {
      const topics = topicsByJourney[phase];
      if (!topics?.length) return [];
      return [
        {
          id: phase,
          title: t(`salahGuide.journey.${phase}`),
          hint: t(`salahGuide.journey.${phase}Hint`),
          items: topics.map((topic) => ({
            id: topic.id,
            icon: TOPIC_ICONS[topic.id] ?? DEFAULT_TOPIC_ICON,
            title: topic.title,
            subtitle: topic.summary,
            badge: topic.importance ? t(`salahGuide.importance.${topic.importance}`) : undefined,
            href: (topic.id === "adhan"
              ? "/salah-guide/adhan"
              : { pathname: "/salah-guide/[topic]", params: { topic: topic.id } }) as Href,
          })),
        },
      ];
    });
    const extras: LearnHubSection[] = [];
    if (featuredPhrase) {
      extras.push({
        id: "featured-phrase",
        title: t("salahGuide.featuredPhraseTitle"),
        icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
        children: (
          <JannahDuaBlock
            title={t("salahGuide.featuredPhraseTitle")}
            arabic={featuredPhrase.arabic}
            transliteration={featuredPhrase.transliteration}
            translation={featuredPhrase.translation}
            reference={featuredPhrase.reference}
          />
        ),
      });
    }
    extras.push(
      {
        id: "rakats",
        title: t("salahGuide.rakatsTitle"),
        icon: { ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" },
        children: (
          <View>
            <View style={styles.tableHead}>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colName}>
                {t("salahGuide.prayer")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
                {t("salahGuide.fard")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
                {t("salahGuide.sunnah")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
                {t("salahGuide.optional")}
              </ThemedText>
            </View>
            {rakats.map((row) => (
              <View
                key={row.prayerId}
                style={[styles.tableRow, { borderTopColor: tokens.hairline }]}
              >
                <ThemedText type="small" style={styles.colName}>
                  {t(`prayers.${row.prayerId}`)}
                </ThemedText>
                <ThemedText type="small" style={styles.colNum}>
                  {row.fard || "—"}
                </ThemedText>
                <ThemedText type="small" style={styles.colNum}>
                  {row.sunnahBefore + row.sunnahAfter || "—"}
                </ThemedText>
                <ThemedText type="small" themeColor="mutedForeground" style={styles.colNum}>
                  {row.optionalBefore + row.optionalAfter || "—"}
                </ThemedText>
              </View>
            ))}
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              style={[styles.tableNote, { borderTopColor: tokens.hairline }]}
            >
              {t("salahGuide.rakatsNote")}
            </ThemedText>
          </View>
        ),
      },
      {
        id: "related",
        title: t("salahGuide.relatedTitle"),
        icon: { ios: "link", android: "link", web: "link" },
        items: [
          {
            id: "related-travel",
            icon: { ios: "airplane", android: "flight", web: "flight" },
            title: t("travel.title"),
            subtitle: t("salahGuide.travelPointer"),
            href: "/travel",
          },
          {
            id: "related-qaza",
            icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
            title: t("salahGuide.qazaLink"),
            subtitle: t("salahGuide.qazaLinkHint"),
            href: "/qaza",
          },
          {
            id: "related-duas",
            icon: {
              ios: "hands.and.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            },
            title: t("salahGuide.duasLink"),
            subtitle: t("salahGuide.duasLinkHint"),
            href: "/dua/prayer",
          },
        ],
      },
    );
    return [...journeys, ...extras];
  }, [topicsByJourney, featuredPhrase, rakats, tokens.hairline, t]);

  return (
    <LearnHubScreen
      ns="salahGuide"
      basePath="/salah-guide"
      sections={sections}
      tools={[
        {
          id: "phrases",
          icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
          title: t("salahGuide.quickPhrases"),
          subtitle: t("salahGuide.quickPhrasesHint"),
          href: "/salah-guide/phrases" as Href,
        },
      ]}
      quiz
      progress={{
        title: t("salahGuide.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("salahGuide.quickProgressHint"),
        href: "/salah-guide/progress" as Href,
      }}
      // D68: on-device al-Fatihah check (hidden on TV).
      continueSlot={<FatihahCheckCard />}
      content={{ ready: contentReady, error: contentError, retry: retryContent }}
    />
  );
}

const styles = StyleSheet.create({
  tableHead: { flexDirection: "row", paddingBottom: Spacing.two },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.twoHalf,
    borderTopWidth: BorderWidth.hairline,
  },
  colName: { flex: 1 },
  colNum: { width: tvDp(64), textAlign: "center" },
  tableNote: {
    paddingTop: Spacing.twoHalf,
    borderTopWidth: BorderWidth.hairline,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/salah-guide");
