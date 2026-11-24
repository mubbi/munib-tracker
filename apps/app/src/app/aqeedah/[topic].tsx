import { useLocalSearchParams } from "expo-router";
import { AqeedahTopicAside } from "@/components/aqeedah/aqeedah-aside";
import { AqeedahTopicContent } from "@/components/aqeedah/topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureAqeedahContent,
  getAqeedahTopic,
  getAqeedahTopics,
  isAqeedahContentReady,
} from "@/lib/aqeedah";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureAqeedahProgressLoaded } from "@/stores/aqeedah-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getAqeedahTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function AqeedahTopicScreen() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready } = useEnsureContent(ensureAqeedahContent, isAqeedahContentReady);
  const topic = getAqeedahTopic(topicId);
  const reportRef = useGuideContentReportRef("aqeedah", topic, "/aqeedah");
  useEnsureAqeedahProgressLoaded();

  return (
    <LearnTopicArticle
      ns="aqeedah"
      basePath="/aqeedah"
      topic={topic}
      ready={ready}
      surface="aqeedah"
      contentRef={reportRef}
      aside={(current) => <AqeedahTopicAside currentId={current.id} />}
    >
      {(current) => <AqeedahTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/aqeedah/[topic]");
