import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LastDayTopicContent } from "@/components/last-day/topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureLastDayContent,
  getLastDayTopic,
  getLastDayTopics,
  isLastDayContentReady,
} from "@/lib/last-day";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useStore } from "@/stores/create-store";
import {
  lastDayProgressStore,
  useEnsureLastDayProgressLoaded,
} from "@/stores/last-day-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getLastDayTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LastDayTopicScreen() {
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const completedIds = useStore(lastDayProgressStore, (s) => s.completedTopicIds);
  const { ready, error, retry } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const topic = getLastDayTopic(topicId);
  const reportRef = useGuideContentReportRef("last_day", topic, "/last-day");
  useEnsureLastDayProgressLoaded();

  return (
    <LearnTopicArticle
      ns="lastDay"
      basePath="/last-day"
      topic={topic}
      ready={ready}
      error={error}
      onRetry={retry}
      contentRef={reportRef}
      surface="last_day"
      aside={(current) => (
        <ModuleTopicAside
          title={t("lastDay.title")}
          basePath="/last-day"
          topics={getLastDayTopics()}
          currentId={current.id}
          completedIds={completedIds}
        />
      )}
    >
      {(current) => <LastDayTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/[topic]");
