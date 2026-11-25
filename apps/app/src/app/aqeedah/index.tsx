import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureAqeedahContent,
  getAqeedahLessonCount,
  getAqeedahTopicsBySection,
  isAqeedahContentReady,
} from "@/lib/aqeedah";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useAqeedahCompletedCount,
  useEnsureAqeedahProgressLoaded,
} from "@/stores/aqeedah-progress-store";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
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

/**
 * Aqeedah hub on the Learn kit (P5-40): intro → progress → topic sections →
 * Tools (glossary, quiz) → disclaimer. Each destination appears once — the old
 * quick-link grid and "Explore" card repeated the six articles / Tawheed /
 * glossary rows (C-16), and the "V1 — Foundations" pill is gone (C-15).
 */
export default function AqeedahScreen() {
  const { t, i18n } = useTranslation();
  useEnsureAqeedahProgressLoaded();
  const content = useEnsureContent(ensureAqeedahContent, isAqeedahContentReady);
  const contentVersion = content.version;
  const completedCount = useAqeedahCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getAqeedahLessonCount(), [contentVersion]);

  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sections = useMemo<LearnHubSection[]>(() => {
    const bySection = getAqeedahTopicsBySection();
    return (Object.keys(bySection) as Array<keyof typeof bySection>).map((section) => ({
      id: String(section),
      title: t(`aqeedah.section.${section}`),
      hint: t(`aqeedah.section.${section}Hint`),
      items: (bySection[section] ?? []).map((topic) => ({
        id: topic.id,
        icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
        title: topic.title,
        subtitle: topic.summary,
        badge: topic.importance ? t(`aqeedah.importance.${topic.importance}`) : undefined,
        href: { pathname: "/aqeedah/[topic]", params: { topic: topic.id } } as Href,
      })),
    }));
  }, [i18n.language, contentVersion, t]);

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "glossary",
        icon: { ios: "character.book.closed", android: "translate", web: "translate" },
        title: t("aqeedah.glossaryTitle"),
        subtitle: t("aqeedah.glossaryHint"),
        href: "/aqeedah/glossary" as Href,
        hue: "sage",
      },
    ],
    [t],
  );

  return (
    <LearnHubScreen
      ns="aqeedah"
      basePath="/aqeedah"
      content={content}
      progress={{
        title: t("aqeedah.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("aqeedah.lessonsHint"),
        href: "/aqeedah/progress" as Href,
      }}
      sections={sections}
      tools={tools}
      quiz
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/aqeedah");
