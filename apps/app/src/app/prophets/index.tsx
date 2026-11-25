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
import type { AppIcon } from "@/lib/names-of-allah-ui";
import {
  ensureProphetsContent,
  getProphetsLessonCount,
  getProphetsTopicsBySection,
  isProphetsContentReady,
} from "@/lib/prophets";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureProphetsProgressLoaded,
  useProphetsCompletedCount,
} from "@/stores/prophets-progress-store";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  adam: { ios: "person.crop.circle.fill", android: "account_circle", web: "account_circle" },
  nuh: { ios: "ferry.fill", android: "directions_boat", web: "directions_boat" },
  ibrahim: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  musa: { ios: "water.waves", android: "waves", web: "waves" },
  muhammad: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
};

/**
 * Prophets hub on the Learn kit (P5-40): intro → progress → topic sections →
 * Tools (timeline, family tree, quiz) → related guides → disclaimer. The quick
 * links / "Explore" card that repeated Muhammad ﷺ, the timeline and progress
 * (C-16) and the "V1" pill (C-15) are gone.
 */
export default function ProphetsScreen() {
  const { t, i18n } = useTranslation();
  useEnsureProphetsProgressLoaded();
  const content = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const contentVersion = content.version;
  const completedCount = useProphetsCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getProphetsLessonCount(), [contentVersion]);

  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sections = useMemo<LearnHubSection[]>(() => {
    const bySection = getProphetsTopicsBySection();
    return (Object.keys(bySection) as Array<keyof typeof bySection>).map((section) => ({
      id: String(section),
      title: t(`prophets.section.${section}`),
      hint: t(`prophets.section.${section}Hint`),
      items: (bySection[section] ?? []).map((topic) => ({
        id: topic.id,
        icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
        title: topic.title,
        subtitle: topic.summary,
        badge: topic.importance ? t(`prophets.importance.${topic.importance}`) : undefined,
        href: { pathname: "/prophets/[topic]", params: { topic: topic.id } } as Href,
      })),
    }));
  }, [i18n.language, contentVersion, t]);

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "timeline",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
        title: t("prophets.timelineTitle"),
        subtitle: t("prophets.timelineHint"),
        href: "/prophets/timeline" as Href,
        hue: "dawn",
      },
      {
        id: "tree",
        icon: { ios: "arrow.triangle.branch", android: "account_tree", web: "account_tree" },
        title: t("prophets.quickTree"),
        subtitle: t("prophets.quickTreeHint"),
        href: "/prophets/tree" as Href,
        hue: "sky",
      },
    ],
    [t],
  );

  const related: LearnHubRelated = {
    title: t("prophets.relatedTitle"),
    items: [
      {
        id: "seerah",
        icon: { ios: "book.pages.fill", android: "history_edu", web: "history_edu" },
        title: t("seerah.title"),
        subtitle: t("prophets.seerahPointer"),
        href: "/seerah",
      },
      {
        id: "quran",
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        title: t("quran.title"),
        subtitle: t("prophets.quranPointer"),
        href: "/quran",
      },
    ],
  };

  return (
    <LearnHubScreen
      ns="prophets"
      basePath="/prophets"
      content={content}
      progress={{
        title: t("prophets.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("prophets.lessonsHint"),
        href: "/prophets/progress" as Href,
      }}
      sections={sections}
      tools={tools}
      quiz
      related={related}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/prophets");
