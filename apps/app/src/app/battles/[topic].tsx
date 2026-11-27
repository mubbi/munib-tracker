import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { BattlesTopicContent } from "@/components/battles/topic-content";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureBattlesContent,
  getBattlesTopic,
  getBattlesTopics,
  isBattlesContentReady,
} from "@/lib/battles";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  battlesProgressStore,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";
import { useStore } from "@/stores/create-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getBattlesTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function BattlesTopicScreen() {
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const completedIds = useStore(battlesProgressStore, (s) => s.completedTopicIds);
  const { ready, error, retry } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const topic = getBattlesTopic(topicId);
  const reportRef = useGuideContentReportRef("battles", topic, "/battles");
  useEnsureBattlesProgressLoaded();

  return (
    <LearnTopicArticle
      ns="battles"
      basePath="/battles"
      topic={topic}
      ready={ready}
      error={error}
      onRetry={retry}
      surface="battles"
      contentRef={reportRef}
      aside={(current) => (
        <ModuleTopicAside
          title={t("battles.title")}
          basePath="/battles"
          topics={getBattlesTopics()}
          currentId={current.id}
          completedIds={completedIds}
        />
      )}
    >
      {(current) => <BattlesTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/[topic]");
