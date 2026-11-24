import { useLocalSearchParams } from "expo-router";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { ProphetsTopicAside } from "@/components/prophets/prophets-aside";
import { ProphetsTopicContent } from "@/components/prophets/topic-content";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureProphetsContent,
  getProphetsTopic,
  getProphetsTopics,
  isProphetsContentReady,
} from "@/lib/prophets";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureProphetsProgressLoaded } from "@/stores/prophets-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getProphetsTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function ProphetsTopicScreen() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready } = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const topic = getProphetsTopic(topicId);
  const reportRef = useGuideContentReportRef("prophets", topic, "/prophets");
  useEnsureProphetsProgressLoaded();

  return (
    <LearnTopicArticle
      ns="prophets"
      basePath="/prophets"
      topic={topic}
      ready={ready}
      surface="prophets"
      contentRef={reportRef}
      aside={(current) => <ProphetsTopicAside currentId={current.id} />}
    >
      {(current) => <ProphetsTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/prophets/[topic]");
