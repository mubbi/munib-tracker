import type { ReadingSurface } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { type Href, useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import type { ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from "react-native";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

const NOT_FOUND_ICON: SymbolViewProps["name"] = {
  ios: "questionmark.circle",
  android: "help",
  web: "help",
};

type ArticleTopic = { id: string; title: string; summary?: string };

/** Home › Module › Topic, used for the visible SEO breadcrumbs and the Article JSON-LD. */
export function learnTopicBreadcrumbs(
  homeLabel: string,
  module: { title: string; path: string },
  topic: { title: string; path: string },
) {
  return [
    { name: homeLabel, path: "/" },
    { name: module.title, path: module.path },
    { name: topic.title, path: topic.path },
  ];
}

/**
 * The shell every Learn topic route shared by copy-paste: screen chrome with a
 * back-to-hub fallback, article SEO (breadcrumbs + Article JSON-LD), loading /
 * not-found states, the ≥1200 split layout with an "in this module" aside, the
 * reading-typography surface and the module disclaimer (with its content-report
 * reference). Routes now supply only the topic, aside and body.
 *
 * Body states go through `LearnContentGate`: skeleton while `ready` is false,
 * `RetryCard` when `error` is set (pass `useEnsureContent().error` / `.retry`),
 * `EmptyState` back to the hub when the topic id is unknown. Audio-follow
 * screens pass `scrollRef` / `onScroll`; `headerTrailing` adds up to two header
 * `IconButton`s (save, share) — see `AppHeader`.
 */
export function LearnTopicArticle<T extends ArticleTopic>({
  ns,
  basePath,
  topic,
  ready = true,
  error,
  onRetry,
  surface,
  aside,
  children,
  afterContent,
  disclaimerKey = `${ns}.disclaimer`,
  contentRef,
  // Articles opt in to the reading-progress bar (P4-07 made it opt-in so hubs,
  // quizzes and flash cards no longer get one).
  readingProgress = true,
  scrollRef,
  onScroll,
  headerTrailing,
}: {
  /** i18n namespace owning `.title`, `.eyebrow`, `.notFound`, `.disclaimer`. */
  ns: string;
  /** Hub route; the topic lives at `${basePath}/${topic.id}`. */
  basePath: string;
  topic: T | undefined;
  /** False while a lazily loaded corpus is still arriving (shows the loading state). */
  ready?: boolean;
  /** Load failure from `useEnsureContent().error` — renders "Try again" instead of a loader. */
  error?: unknown;
  /** Retry for `error` (`useEnsureContent().retry`). */
  onRetry?: () => void;
  surface: ReadingSurface;
  aside: (topic: T) => ReactNode;
  /** Article body, inside the reading-typography surface. */
  children: (topic: T) => ReactNode;
  /** Extra blocks after the reading surface, before the disclaimer. */
  afterContent?: (topic: T) => ReactNode;
  disclaimerKey?: string;
  contentRef?: ContentReportReference;
  /** Forwarded to `ScreenLayout` (top reading-progress bar). */
  readingProgress?: boolean;
  /** Forwarded to `ScreenLayout` — e.g. audio follow scrolling to the playing step. */
  scrollRef?: RefObject<ScrollViewInstance | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Header trailing actions (at most two `IconButton`s). */
  headerTrailing?: ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const moduleTitle = t(`${ns}.title`);

  const detailPath = topic ? `${basePath}/${topic.id}` : basePath;
  const crumbs = topic
    ? learnTopicBreadcrumbs(
        t("tabs.home"),
        { title: moduleTitle, path: basePath },
        { title: topic.title, path: detailPath },
      )
    : undefined;

  return (
    <ScreenLayout
      readingProgress={readingProgress}
      eyebrow={t(`${ns}.eyebrow`)}
      title={topic?.title ?? moduleTitle}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, basePath as Href)}
      maxContentWidth={maxContentWidth}
      scrollRef={scrollRef}
      onScroll={onScroll}
      trailing={headerTrailing}
    >
      <Seo
        path={detailPath}
        title={topic?.title}
        description={topic?.summary}
        type={topic ? "article" : undefined}
        index={!!topic}
        breadcrumbs={crumbs}
        jsonLd={
          topic
            ? [
                articleSchema({
                  path: detailPath,
                  headline: topic.title,
                  description: topic.summary ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
      <LearnContentGate ready={ready} error={error} onRetry={onRetry}>
        {!topic ? (
          <EmptyState
            icon={NOT_FOUND_ICON}
            title={t(`${ns}.notFound`)}
            actionLabel={moduleTitle}
            onAction={() => router.replace(basePath as Href)}
          />
        ) : (
          <LearnSplitLayout aside={aside(topic)}>
            <Stagger>
              <LearnReadingChrome surface={surface}>{children(topic)}</LearnReadingChrome>
              {afterContent?.(topic)}
              <JannahDisclaimer textKey={disclaimerKey} contentRef={contentRef} />
            </Stagger>
          </LearnSplitLayout>
        )}
      </LearnContentGate>
    </ScreenLayout>
  );
}
