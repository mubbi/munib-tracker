import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type LearnHubItem, LearnHubScreen, type LearnHubSection } from "@/components/learn-guide";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import { buildContentReportRef } from "@/lib/content-report-ref";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import {
  ensureQuranGuideContent,
  getQuranGuideJourneyOrder,
  getQuranGuideLessonCount,
  getQuranGuideTopicRoute,
  getQuranGuideTopicsByJourney,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideCompletedCount,
} from "@/stores/quran-guide-progress-store";
import { useDueQueue, useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";

const DEFAULT_TOPIC_ICON: AppIcon = {
  ios: "text.book.closed",
  android: "article",
  web: "article",
};

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  revelation: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  structure: { ios: "square.stack.3d.up.fill", android: "layers", web: "layers" },
  "learn-to-read": { ios: "character.book.closed", android: "menu_book", web: "menu_book" },
  tajweed: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
  "arabic-letters": { ios: "textformat.abc", android: "abc", web: "abc" },
  pronunciation: { ios: "mouth.fill", android: "record_voice_over", web: "record_voice_over" },
  vocabulary: { ios: "character.book.closed", android: "translate", web: "translate" },
  tafsir: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
  themes: { ios: "tag.fill", android: "label", web: "label" },
  stories: { ios: "person.3.fill", android: "groups", web: "groups" },
  miracles: { ios: "star.fill", android: "star", web: "star" },
  memorization: { ios: "brain.head.profile", android: "psychology", web: "psychology" },
  "daily-lessons": { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  tadabbur: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
  "apply-the-quran": { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  references: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
};

export default function LearnQuranScreen() {
  const { t, i18n } = useTranslation();
  useEnsureQuranGuideProgressLoaded();
  // Same report reference the screen layout derived from `reportKind="learn_quran"`.
  const contentRef = useMemo(
    () =>
      buildContentReportRef(
        "learn_quran",
        "/learn-quran",
        "/learn-quran",
        i18n.language?.split("-")[0] ?? "en",
        { snapshot: { title: t("learnQuran.title"), translation: t("learnQuran.subtitle") } },
      ),
    [i18n.language, t],
  );
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureQuranGuideContent, isQuranGuideContentReady);
  const completedCount = useQuranGuideCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getQuranGuideLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsByJourney = useMemo(
    () => getQuranGuideTopicsByJourney(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const journeyOrder = useMemo(() => getQuranGuideJourneyOrder(), [i18n.language, contentVersion]);

  // D68: recitation practice tile (hidden on TV / unsupported runtimes).
  const reciteAvailable = useReciteAlongAvailable();
  useEnsureMemorizationLoaded();
  const dueCount = useDueQueue().length;

  const sections = useMemo<LearnHubSection[]>(
    () => [
      ...journeyOrder.flatMap((phase): LearnHubSection[] => {
        // The quiz topic is the hub's Tools "Review quiz" row, listed once.
        const topics = (topicsByJourney[phase] ?? []).filter((topic) => topic.id !== "quiz");
        if (!topics.length) return [];
        return [
          {
            id: phase,
            title: t(`learnQuran.journey.${phase}`),
            hint: t(`learnQuran.journey.${phase}Hint`),
            items: topics.map((topic) =>
              topic.comingSoon
                ? {
                    id: topic.id,
                    icon: TOPIC_ICONS[topic.id] ?? DEFAULT_TOPIC_ICON,
                    title: topic.title,
                    subtitle: topic.summary,
                    badge: t("learnQuran.comingSoon"),
                    href: getQuranGuideTopicRoute(topic.id) as Href,
                    disabled: true,
                  }
                : {
                    id: topic.id,
                    icon: TOPIC_ICONS[topic.id] ?? DEFAULT_TOPIC_ICON,
                    title: topic.title,
                    subtitle: topic.summary,
                    badge: topic.importance
                      ? t(`learnQuran.importance.${topic.importance}`)
                      : undefined,
                    href: getQuranGuideTopicRoute(topic.id) as Href,
                  },
            ),
          },
        ];
      }),
      {
        id: "related",
        title: t("learnQuran.relatedTitle"),
        icon: { ios: "link", android: "link", web: "link" },
        items: [
          {
            id: "related-quran",
            icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
            title: t("actions.quran"),
            subtitle: t("learnQuran.quranReaderPointer"),
            href: "/quran",
          },
          {
            id: "related-salah",
            icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
            title: t("actions.salahGuide"),
            subtitle: t("learnQuran.salahPointer"),
            href: "/salah-guide",
          },
          {
            id: "related-jannah",
            icon: { ios: "leaf.fill", android: "park", web: "park" },
            title: t("actions.jannah"),
            subtitle: t("learnQuran.jannahPointer"),
            href: "/jannah",
          },
        ],
      },
    ],
    [journeyOrder, topicsByJourney, t],
  );

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "read",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
        title: t("learnQuran.quickRead"),
        subtitle: t("learnQuran.quickReadHint"),
        href: "/quran" as Href,
      },
      ...(reciteAvailable
        ? [
            {
              id: "practise",
              icon: { ios: "mic.fill", android: "mic", web: "mic" } as AppIcon,
              title: t("learnQuran.quickPractise"),
              // Revision due today → straight to the due queue; otherwise the practice hub.
              subtitle:
                dueCount > 0
                  ? t("quranCompanion.entry.toRevise", { count: dueCount })
                  : t("learnQuran.quickPractiseHint"),
              href: (dueCount > 0 ? "/quran/revision" : "/quran/practice") as Href,
            },
          ]
        : []),
    ],
    [t, reciteAvailable, dueCount],
  );

  return (
    <LearnHubScreen
      ns="learnQuran"
      basePath="/learn-quran"
      sections={sections}
      tools={tools}
      quiz={"/learn-quran/quiz" as Href}
      contentRef={contentRef}
      progress={{
        title: t("learnQuran.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("learnQuran.quickProgressHint"),
        href: "/learn-quran/progress" as Href,
      }}
      content={{ ready: contentReady, error: contentError, retry: retryContent }}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran");
