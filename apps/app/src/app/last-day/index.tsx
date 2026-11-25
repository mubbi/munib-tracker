import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  type LearnHubItem,
  type LearnHubRelated,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { tTv } from "@/lib/i18n/t-tv";
import {
  ensureLastDayContent,
  getLastDayLessonCount,
  getLastDayTopicsBySection,
  isLastDayContentReady,
} from "@/lib/last-day";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCompletedCount,
} from "@/stores/last-day-progress-store";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
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
  "heavy-on-the-scale": { ios: "scalemass.fill", android: "balance", web: "balance" },
};

export default function LastDayScreen() {
  const { t, i18n } = useTranslation();
  useEnsureLastDayProgressLoaded();
  const content = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const contentVersion = content.version;
  const completedCount = useLastDayCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getLastDayLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getLastDayTopicsBySection(),
    [i18n.language, contentVersion],
  );

  const sections = useMemo<LearnHubSection[]>(
    () =>
      (Object.keys(topicsBySection) as Array<keyof typeof topicsBySection>).map((section) => ({
        id: String(section),
        title: t(`lastDay.section.${String(section)}`),
        hint: t(`lastDay.section.${String(section)}Hint`),
        items: (topicsBySection[section] ?? []).map((topic) => ({
          id: topic.id,
          icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
          title: topic.title,
          subtitle: topic.summary,
          badge: topic.importance ? t(`lastDay.importance.${topic.importance}`) : undefined,
          href: { pathname: "/last-day/[topic]", params: { topic: topic.id } } as Href,
        })),
      })),
    [t, topicsBySection],
  );

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "/last-day/timeline",
        icon: { ios: "arrow.down.circle.fill", android: "south", web: "south" },
        title: t("lastDay.timelineCardTitle"),
        subtitle: tTv(t, "lastDay.timelineCardHint", "lastDay.timelineCardHintTv"),
        href: "/last-day/timeline" as Href,
        hue: "violet",
      },
      {
        id: "/last-day/preparation",
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
        title: t("lastDay.preparationTitle"),
        subtitle: t("lastDay.quickPreparationHint"),
        href: "/last-day/preparation" as Href,
        hue: "sage",
      },
      {
        id: "/last-day/verses",
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        title: t("lastDay.versesTitle"),
        subtitle: t("lastDay.versesHint"),
        href: "/last-day/verses" as Href,
        hue: "accent",
      },
      {
        id: "/last-day/hadith",
        icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
        title: t("lastDay.hadithTitle"),
        subtitle: t("lastDay.hadithHint"),
        href: "/last-day/hadith" as Href,
        hue: "sky",
      },
      {
        id: "/last-day/references",
        icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
        title: t("lastDay.referencesTitle"),
        subtitle: t("lastDay.referencesHint"),
        href: "/last-day/references" as Href,
        hue: "dawn",
      },
    ],
    [t],
  );

  const related: LearnHubRelated = {
    title: t("lastDay.relatedTitle"),
    items: [
      {
        id: "jannah",
        icon: { ios: "leaf.fill", android: "park", web: "park" },
        title: t("actions.jannah"),
        subtitle: t("lastDay.jannahPointer"),
        href: "/jannah" as Href,
      },
      {
        id: "aqeedah",
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        title: t("actions.aqeedah"),
        subtitle: t("lastDay.aqeedahPointer"),
        href: "/aqeedah" as Href,
      },
      {
        id: "salah-guide",
        icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
        title: t("actions.salahGuide"),
        subtitle: t("lastDay.salahPointer"),
        href: "/salah-guide" as Href,
      },
    ],
  };

  return (
    <LearnHubScreen
      ns="lastDay"
      basePath="/last-day"
      content={content}
      progress={{
        title: t("lastDay.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        href: "/last-day/progress" as Href,
      }}
      sections={sections}
      tools={tools}
      quiz
      related={related}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day");
