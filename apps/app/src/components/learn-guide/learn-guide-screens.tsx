import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
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
  /** Adds the "Test yourself" row linking to `${basePath}/quiz`. */
  showQuiz?: boolean;
  /** Guide-specific rows between the intro / quiz row and the topic sections. */
  children?: ReactNode;
}) {
  const { ns, basePath, guide } = config;
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const wide = useLearnHubLayout();
  // Wide web / tablets: topic rows flow into 2–3 columns inside each section card.
  const navCols = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 280, max: 3 });
  // Topic list is sync; the overlay version re-localizes titles when a locale pack lands.
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => guide.getTopicsBySection(),
    [guide, i18n.language, overlayVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t(`${ns}.eyebrow`)}
      title={t(`${ns}.title`)}
      subtitle={t(`${ns}.subtitle`)}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path={basePath} />
      <Stagger>
        <JannahCallout tone="info">{t(`${ns}.intro`)}</JannahCallout>

        {showQuiz ? (
          <LearnQuizNavRow
            quizPath={`${basePath}/quiz` as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />
        ) : null}

        {children}

        {guide.getSectionOrder().map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`${ns}.section.${String(section)}` as string)}
                icon={sectionIcons[section] ?? FALLBACK_SECTION_ICON}
              />
              <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
                {topics.map((topic) => (
                  <JannahNavRow
                    key={topic.id}
                    icon={TOPIC_ICON}
                    title={topic.title}
                    subtitle={topic.summary}
                    onPress={() =>
                      router.push({
                        pathname: `${basePath}/[topic]`,
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </LearnColumnsGrid>
            </Card>
          );
        })}

        <JannahDisclaimer textKey={`${ns}.disclaimer`} />
      </Stagger>
    </ScreenLayout>
  );
}

export function LearnGuideTopicScreen<S extends string>({
  config,
}: {
  config: LearnGuideConfig<S>;
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
      surface="jannah"
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

const styles = StyleSheet.create({
  gridTop: { marginTop: Spacing.three },
});
