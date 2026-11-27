import type { ReadingSurface } from "@munib-tracker/shared/types";
import { type Href, useLocalSearchParams } from "expo-router";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnHubScreen, type LearnHubSection } from "@/components/learn-guide/learn-hub-screen";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import type { LearnGuideConfig } from "@/lib/sectioned-guide";

/**
 * Shared screens for the small, sectioned Learn guides (Janazah, Eid, Ruqyah,
 * Laylat al-Qadr, New Muslim, White Days, Finance, Friday, Fidyah, Hajj).
 *
 * Every guide used to copy the same ~110-line hub and ~100-line topic route;
 * they now pass the guide's `LearnGuideConfig` (exported next to its getters in
 * `src/lib/<guide>.ts`, so each route chunk only pulls its own corpus) and keep
 * only what is genuinely theirs (section icons, extra hub rows, `generateStaticParams` / `generateMetadata`,
 * which Expo Router requires in the route file itself).
 */
const FALLBACK_SECTION_ICON: AppIcon = { ios: "book.fill", android: "menu_book", web: "menu_book" };
const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };

export function LearnGuideHubScreen<S extends string>({
  config,
  sectionIcons,
  showQuiz = false,
  children,
}: {
  config: LearnGuideConfig<S>;
  sectionIcons: Partial<Record<S, AppIcon>>;
  /** Adds "Review quiz" to the hub's Tools (after the lessons it tests). */
  showQuiz?: boolean;
  /** Guide-specific rows between the intro and the topic sections. */
  children?: ReactNode;
}) {
  const { ns, basePath, guide } = config;
  const { t, i18n } = useTranslation();
  // Topic list is sync; the overlay version re-localizes titles when a locale pack lands.
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const sections = useMemo<LearnHubSection[]>(() => {
    const topicsBySection = guide.getTopicsBySection();
    return guide.getSectionOrder().map((section) => ({
      id: String(section),
      title: t(`${ns}.section.${String(section)}` as string),
      icon: sectionIcons[section] ?? FALLBACK_SECTION_ICON,
      maxColumns: 3,
      items: (topicsBySection[section] ?? []).map((topic) => ({
        id: topic.id,
        icon: TOPIC_ICON,
        title: topic.title,
        subtitle: topic.summary,
        href: { pathname: `${basePath}/[topic]`, params: { topic: topic.id } } as Href,
      })),
    }));
  }, [guide, i18n.language, overlayVersion, ns, basePath, sectionIcons, t]);

  return (
    <LearnHubScreen
      ns={ns}
      basePath={basePath}
      sections={sections}
      quiz={showQuiz}
      continueSlot={children}
    />
  );
}

export function LearnGuideTopicScreen<S extends string>({
  config,
  surface = "jannah",
}: {
  config: LearnGuideConfig<S>;
  /**
   * Reading surface for the A−/A+ size (Settings › Per-screen text sizes).
   * Defaults to the shared Learn surface; zakat / finance / fidyah pass "finance" (G-72).
   */
  surface?: ReadingSurface;
}) {
  const { ns, basePath, guide } = config;
  const { t, i18n } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topics = useMemo(() => guide.getTopics(), [guide, i18n.language, overlayVersion]);
  const topic = topicId ? topics.find((item) => item.id === topicId) : undefined;
  const sectionTitle = t(`${ns}.title`);

  return (
    <LearnTopicArticle
      ns={ns}
      basePath={basePath}
      topic={topic}
      surface={surface}
      aside={(current) => (
        <ModuleTopicAside
          title={sectionTitle}
          basePath={basePath}
          topics={topics}
          currentId={current.id}
        />
      )}
    >
      {(current) => <LearnGuideTopicContent topic={current} ns={ns} sectionTitle={sectionTitle} />}
    </LearnTopicArticle>
  );
}
