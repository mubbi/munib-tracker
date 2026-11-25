import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahDuaBlock, JannahNavRow } from "@/components/jannah/primitives";
import {
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureJahannamContent,
  getJahannamMajorSinTopics,
  getJahannamRefugeDua,
  getJahannamTopicsBySection,
  isJahannamContentReady,
} from "@/lib/jahannam";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
const TOPIC_ICONS: Record<string, AppIcon> = {
  "destructive-sins": { ios: "shield.lefthalf.filled", android: "shield", web: "shield" },
  "major-sins": { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
};
const MAJOR_SINS_ICON: AppIcon = {
  ios: "exclamationmark.triangle.fill",
  android: "warning",
  web: "warning",
};

export default function JahannamScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const content = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const contentVersion = content.version;
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getJahannamTopicsBySection(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const majorSins = useMemo(() => getJahannamMajorSinTopics(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const refugeDua = useMemo(() => getJahannamRefugeDua(), [i18n.language, contentVersion]);

  const sections = useMemo<LearnHubSection[]>(() => {
    const topicItem = (topic: {
      id: string;
      title: string;
      summary: string;
      importance?: string;
    }): LearnHubItem => ({
      id: topic.id,
      icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
      title: topic.title,
      subtitle: topic.summary,
      badge: topic.importance ? t(`jahannam.importance.${topic.importance}`) : undefined,
      href: { pathname: "/jahannam/[topic]", params: { topic: topic.id } } as Href,
    });
    const seen = new Set<string>();
    const out: LearnHubSection[] = [];
    for (const section of Object.keys(topicsBySection) as Array<keyof typeof topicsBySection>) {
      if (section === "major-sins") continue;
      const topics = topicsBySection[section] ?? [];
      for (const topic of topics) seen.add(topic.id);
      out.push({
        id: String(section),
        title: t(`jahannam.section.${String(section)}`),
        hint: t(`jahannam.section.${String(section)}Hint`),
        items: topics.map(topicItem),
      });
    }
    out.push({
      id: "major-sins",
      title: t("jahannam.majorSinsTitle"),
      hint: t("jahannam.majorSinsHint"),
      icon: MAJOR_SINS_ICON,
      // One entry per destination: a sin already listed in a section above is not repeated.
      items: majorSins.filter((topic) => !seen.has(topic.id)).map(topicItem),
    });
    return out;
  }, [t, topicsBySection, majorSins]);

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "/jahannam/verses",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
        title: t("jahannam.versesTitle"),
        subtitle: t("jahannam.versesSummary"),
        href: "/jahannam/verses" as Href,
        hue: "accent",
      },
      {
        id: "/jahannam/hadith",
        icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
        title: t("jahannam.hadithTitle"),
        subtitle: t("jahannam.hadithSummary"),
        href: "/jahannam/hadith" as Href,
        hue: "sky",
      },
      {
        id: "/jahannam/names",
        icon: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
        title: t("jahannam.namesTitle"),
        subtitle: t("jahannam.namesSummary"),
        href: "/jahannam/names" as Href,
        hue: "dawn",
      },
      {
        id: "/jahannam/gates",
        icon: { ios: "door.left.hand.open", android: "door_front", web: "door_front" },
        title: t("jahannam.gatesTitle"),
        subtitle: t("jahannam.gatesSummary"),
        href: "/jahannam/gates" as Href,
        hue: "violet",
      },
      {
        id: "/jahannam/duas",
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        },
        title: t("jahannam.duasTitle"),
        subtitle: t("jahannam.duasSummary"),
        href: "/jahannam/duas" as Href,
        hue: "sage",
      },
      {
        id: "/jahannam/reflection",
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
        title: t("jahannam.reflectionTitle"),
        subtitle: t("jahannam.reflectionSummary"),
        href: "/jahannam/reflection" as Href,
        hue: "rose",
      },
      {
        id: "/jahannam/journey",
        icon: { ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" },
        title: t("jahannam.journeyTitle"),
        subtitle: t("jahannam.journeySummary"),
        href: "/jahannam/journey" as Href,
        hue: "sage",
      },
      {
        id: "/jahannam/references",
        icon: { ios: "doc.text.fill", android: "description", web: "description" },
        title: t("jahannam.referencesTitle"),
        subtitle: t("jahannam.referencesSummary"),
        href: "/jahannam/references" as Href,
        hue: "accent",
      },
    ],
    [t],
  );

  const footer = (
    <View style={styles.footer}>
      {refugeDua ? (
        <JannahDuaBlock
          title={t("jahannam.refugeDuaTitle")}
          arabic={refugeDua.arabic}
          transliteration={refugeDua.transliteration}
          translation={refugeDua.translation}
          reference={refugeDua.reference}
        />
      ) : null}
      <JannahNavRow
        icon={{ ios: "leaf.fill", android: "park", web: "park" }}
        title={t("jahannam.jannahPairTitle")}
        subtitle={t("jahannam.jannahPairHint")}
        onPress={() => router.push("/jannah" as Href)}
      />
    </View>
  );

  return (
    <LearnHubScreen
      ns="jahannam"
      basePath="/jahannam"
      content={content}
      sections={sections}
      tools={tools}
      quiz
      footer={footer}
    />
  );
}

const styles = StyleSheet.create({
  footer: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam");
