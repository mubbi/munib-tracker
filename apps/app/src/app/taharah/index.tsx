import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LearnHubScreen, type LearnHubSection } from "@/components/learn-guide";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { tTv } from "@/lib/i18n/t-tv";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  ensureTaharahContent,
  getTaharahLessonCount,
  getTaharahTopicsBySection,
  isTaharahContentReady,
} from "@/lib/taharah";
import {
  useEnsureTaharahProgressLoaded,
  useTaharahCompletedCount,
} from "@/stores/taharah-progress-store";

const DEFAULT_TOPIC_ICON: AppIcon = {
  ios: "text.book.closed",
  android: "article",
  web: "article",
};

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "wudu-steps": { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  "ghusl-steps": { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  tayammum: { ios: "hands.sparkles.fill", android: "pan_tool", web: "pan_tool" },
  "najasah-basics": { ios: "shield.fill", android: "shield", web: "shield" },
};

export default function TaharahScreen() {
  const { t, i18n } = useTranslation();
  useEnsureTaharahProgressLoaded();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureTaharahContent, isTaharahContentReady);
  const completedCount = useTaharahCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getTaharahLessonCount(), [contentVersion]);
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getTaharahTopicsBySection(),
    [i18n.language, contentVersion],
  );

  const sections = useMemo<LearnHubSection[]>(
    () => [
      ...(Object.keys(topicsBySection) as Array<keyof typeof topicsBySection>).flatMap(
        (section): LearnHubSection[] => {
          const topics = topicsBySection[section];
          if (!topics?.length) return [];
          return [
            {
              id: String(section),
              title: t(`taharah.section.${section}`),
              hint: t(`taharah.section.${section}Hint`),
              items: topics.map((topic) => ({
                id: topic.id,
                icon: TOPIC_ICONS[topic.id] ?? DEFAULT_TOPIC_ICON,
                title: topic.title,
                subtitle: topic.summary,
                badge: topic.importance ? t(`taharah.importance.${topic.importance}`) : undefined,
                href: { pathname: "/taharah/[topic]", params: { topic: topic.id } } as Href,
              })),
            },
          ];
        },
      ),
      {
        id: "related",
        title: t("taharah.relatedTitle"),
        icon: { ios: "link", android: "link", web: "link" },
        items: [
          {
            id: "related-salah",
            icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
            title: t("salahGuide.title"),
            subtitle: t("taharah.salahGuidePointer"),
            href: "/salah-guide",
          },
          {
            id: "related-dua",
            icon: {
              ios: "hands.and.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            },
            title: t("learnDua.title"),
            subtitle: t("taharah.learnDuaPointer"),
            href: "/learn-dua" as Href,
          },
          {
            id: "related-hayd",
            icon: {
              ios: "calendar.badge.exclamationmark",
              android: "event_busy",
              web: "event_busy",
            },
            title: t("hayd.title"),
            subtitle: t("taharah.haydPointer"),
            href: "/hayd",
          },
        ],
      },
    ],
    [topicsBySection, t],
  );

  return (
    <LearnHubScreen
      ns="taharah"
      basePath="/taharah"
      sections={sections}
      tools={[
        {
          id: "checklist",
          icon: { ios: "checklist", android: "checklist", web: "checklist" },
          title: t("taharah.checklistTitle"),
          subtitle: tTv(t, "taharah.checklistHint", "taharah.checklistHintTv"),
          href: "/taharah/checklist" as Href,
        },
      ]}
      quiz
      progress={{
        title: t("taharah.progressCardTitle"),
        completed: completedCount,
        total: lessonTotal,
        hint: t("taharah.quickProgressHint"),
        href: "/taharah/progress" as Href,
      }}
      content={{ ready: contentReady, error: contentError, retry: retryContent }}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/taharah");
