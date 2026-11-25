import { type Href, usePathname } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahDuaBlock } from "@/components/jannah/primitives";
import {
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { buildContentReportRef } from "@/lib/content-report-ref";
import {
  ensureLearnDuaContent,
  getLearnDuaLessonCount,
  getLearnDuaTopics,
  getLearnDuaTopicsBySection,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLearnDuaProgressLoaded,
  useLearnDuaCompletedCount,
} from "@/stores/learn-dua-progress-store";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "morning-evening": { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  "dua-etiquette": {
    ios: "hands.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  "quranic-duas": { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
};

/**
 * Learn Dua hub on the Learn kit (P5-40): intro → progress → topic sections →
 * Tools (duas by occasion, quiz) → featured dua + related → disclaimer. The
 * quick links / "Explore" card that repeated occasions, progress and two topics
 * (C-16) and the "V1" pill (C-15) are gone.
 */
export default function LearnDuaScreen() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  useEnsureLearnDuaProgressLoaded();
  const content = useEnsureContent(ensureLearnDuaContent, isLearnDuaContentReady);
  const contentVersion = content.version;
  const completedCount = useLearnDuaCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getLearnDuaLessonCount(), [contentVersion]);

  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sections = useMemo<LearnHubSection[]>(() => {
    const bySection = getLearnDuaTopicsBySection();
    return (Object.keys(bySection) as Array<keyof typeof bySection>).map((section) => ({
      id: String(section),
      title: t(`learnDua.section.${section}`),
      hint: t(`learnDua.section.${section}Hint`),
      items: (bySection[section] ?? []).map((topic) => ({
        id: topic.id,
        icon: TOPIC_ICONS[topic.id] ?? TOPIC_ICON,
        title: topic.title,
        subtitle: topic.summary,
        badge: topic.importance ? t(`learnDua.importance.${topic.importance}`) : undefined,
        href: { pathname: "/learn-dua/[topic]", params: { topic: topic.id } } as Href,
      })),
    }));
  }, [i18n.language, contentVersion, t]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const featuredTopic = useMemo(
    () => getLearnDuaTopics().find((topic) => topic.phrases?.length),
    [i18n.language, contentVersion],
  );
  const featuredPhrase = featuredTopic?.phrases?.[0];

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "occasions",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
        title: t("learnDua.occasionsTitle"),
        subtitle: t("learnDua.occasionsHint"),
        href: "/learn-dua/occasions" as Href,
        hue: "dawn",
      },
    ],
    [t],
  );

  // The hub keeps its "report an issue" link (it used ScreenLayout `reportKind`).
  const contentRef = useMemo(
    () =>
      buildContentReportRef(
        "learn_dua",
        pathname || "/learn-dua",
        pathname || "/learn-dua",
        i18n.language?.split("-")[0] ?? "en",
        { snapshot: { title: t("learnDua.title"), translation: t("learnDua.subtitle") } },
      ),
    [pathname, i18n.language, t],
  );

  const footer = (
    <>
      {featuredPhrase ? (
        <JannahDuaBlock
          title={
            featuredTopic
              ? t("learnDua.featuredPhraseTitleWithTopic", { topic: featuredTopic.title })
              : t("learnDua.featuredPhraseTitle")
          }
          arabic={featuredPhrase.arabic}
          transliteration={featuredPhrase.transliteration}
          translation={featuredPhrase.translation}
          reference={featuredPhrase.reference}
        />
      ) : null}
    </>
  );

  return (
    <LearnHubScreen
      ns="learnDua"
      basePath="/learn-dua"
      content={content}
      contentRef={contentRef}
      progress={{
        title: t("learnDua.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("learnDua.lessonsHint"),
        href: "/learn-dua/progress" as Href,
      }}
      sections={sections}
      tools={tools}
      quiz
      related={{
        title: t("learnDua.relatedTitle"),
        items: [
          {
            id: "dua-library",
            icon: {
              ios: "hands.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            },
            title: t("dua.title"),
            subtitle: t("learnDua.duaLibraryPointer"),
            href: "/dua",
          },
        ],
      }}
      footer={footer}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-dua");
