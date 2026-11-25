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
import {
  ensureBattlesContent,
  getBattlesLessonCount,
  getBattlesSectionOrder,
  getBattlesTopicsBySection,
  isBattlesContentReady,
} from "@/lib/battles";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useBattlesCompletedCount,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
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

/**
 * Battles hub on the Learn kit (P5-40): intro → progress → topic sections →
 * Tools (timeline, lesson cards, companions, verses, glossary, quiz) → related
 * guides → disclaimer. The quick links / "Explore" card that repeated the
 * timeline, Badr and progress (C-16) and the "V1" pill (C-15) are gone.
 */
export default function BattlesScreen() {
  const { t, i18n } = useTranslation();
  useEnsureBattlesProgressLoaded();
  const content = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const contentVersion = content.version;
  const completedCount = useBattlesCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getBattlesLessonCount(), [contentVersion]);

  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sections = useMemo<LearnHubSection[]>(() => {
    const bySection = getBattlesTopicsBySection();
    return getBattlesSectionOrder().map((section) => ({
      id: String(section),
      title: t(`battles.section.${section}`),
      hint: t(`battles.section.${section}Hint`),
      items: (bySection[section] ?? []).map((topic) => ({
        id: topic.id,
        icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
        title: topic.title,
        subtitle: topic.summary,
        badge: topic.importance ? t(`battles.importance.${topic.importance}`) : undefined,
        href: { pathname: "/battles/[topic]", params: { topic: topic.id } } as Href,
      })),
    }));
  }, [i18n.language, contentVersion, t]);

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "timeline",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
        title: t("battles.timelineTitle"),
        subtitle: t("battles.timelineHint"),
        href: "/battles/timeline" as Href,
        hue: "dawn",
      },
      {
        id: "lessons",
        icon: { ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" },
        title: t("battles.quickLessons"),
        subtitle: t("battles.quickLessonsHint"),
        href: "/battles/lessons" as Href,
        hue: "sage",
      },
      {
        id: "figures",
        icon: { ios: "person.2.fill", android: "people", web: "people" },
        title: t("battles.figuresTitle"),
        subtitle: t("battles.figuresHint"),
        href: "/battles/figures" as Href,
        hue: "rose",
      },
      {
        id: "verses",
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        title: t("battles.versesTitle"),
        subtitle: t("battles.versesHint"),
        href: "/battles/verses" as Href,
        hue: "sky",
      },
      {
        id: "glossary",
        icon: { ios: "character.book.closed", android: "translate", web: "translate" },
        title: t("battles.glossaryTitle"),
        subtitle: t("battles.glossaryHint"),
        href: "/battles/glossary" as Href,
        hue: "violet",
      },
    ],
    [t],
  );

  const related: LearnHubRelated = {
    title: t("battles.relatedTitle"),
    items: [
      {
        id: "seerah",
        icon: { ios: "book.pages.fill", android: "history_edu", web: "history_edu" },
        title: t("seerah.title"),
        subtitle: t("battles.seerahPointer"),
        href: "/seerah",
      },
      {
        id: "jannah",
        icon: { ios: "leaf.fill", android: "park", web: "park" },
        title: t("actions.jannah"),
        subtitle: t("battles.jannahPointer"),
        href: "/jannah",
      },
    ],
  };

  return (
    <LearnHubScreen
      ns="battles"
      basePath="/battles"
      content={content}
      progress={{
        title: t("battles.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("battles.lessonsHint"),
        href: "/battles/progress" as Href,
      }}
      sections={sections}
      tools={tools}
      quiz
      related={related}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles");
