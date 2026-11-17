import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LastDayTopicContent } from "@/components/last-day/topic-content";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureLastDayContent,
  getLastDayTopic,
  getLastDayTopics,
  isLastDayContentReady,
} from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";
import { useStore } from "@/stores/create-store";
import {
  lastDayProgressStore,
  useEnsureLastDayProgressLoaded,
} from "@/stores/last-day-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getLastDayTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LastDayTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const completedIds = useStore(lastDayProgressStore, (s) => s.completedTopicIds);
  const { ready: contentReady } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const topic = getLastDayTopic(topicId);
  useEnsureLastDayProgressLoaded();

  const detailPath = topic ? `/last-day/${topic.id}` : "/last-day";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("lastDay.title"), path: "/last-day" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={topic?.title ?? t("lastDay.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={maxContentWidth}
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
      {!contentReady ? (
        <LearnContentLoading />
      ) : !topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("lastDay.notFound")}
          actionLabel={t("lastDay.title")}
          onAction={() => router.replace("/last-day" as Href)}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("lastDay.title")}
              basePath="/last-day"
              topics={getLastDayTopics()}
              currentId={topic.id}
              completedIds={completedIds}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="last_day">
              <LastDayTopicContent topic={topic} />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="lastDay.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}
