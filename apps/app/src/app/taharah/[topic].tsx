import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { TaharahTopicContent } from "@/components/taharah/topic-content";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  ensureTaharahContent,
  getTaharahTopic,
  getTaharahTopics,
  isTaharahContentReady,
} from "@/lib/taharah";
import { useStore } from "@/stores/create-store";
import {
  taharahProgressStore,
  useEnsureTaharahProgressLoaded,
} from "@/stores/taharah-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getTaharahTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function TaharahTopicScreen() {
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const completedIds = useStore(taharahProgressStore, (s) => s.completedTopicIds);
  const { ready } = useEnsureContent(ensureTaharahContent, isTaharahContentReady);
  const topic = getTaharahTopic(topicId);
  const reportRef = useGuideContentReportRef("taharah", topic, "/taharah");
  useEnsureTaharahProgressLoaded();

  return (
    <LearnTopicArticle
      ns="taharah"
      basePath="/taharah"
      topic={topic}
      ready={ready}
      surface="taharah"
      contentRef={reportRef}
      aside={(current) => (
        <ModuleTopicAside
          title={t("taharah.title")}
          basePath="/taharah"
          topics={getTaharahTopics()}
          currentId={current.id}
          completedIds={completedIds}
        />
      )}
    >
      {(current) => <TaharahTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/taharah/[topic]");
