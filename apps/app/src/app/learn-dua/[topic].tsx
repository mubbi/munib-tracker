import { useLocalSearchParams } from "expo-router";
import { LearnDuaTopicAside } from "@/components/learn-dua/learn-dua-aside";
import { LearnDuaTopicContent } from "@/components/learn-dua/topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureLearnDuaContent,
  getLearnDuaTopic,
  getLearnDuaTopics,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureLearnDuaProgressLoaded } from "@/stores/learn-dua-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getLearnDuaTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LearnDuaTopicScreen() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready, error, retry } = useEnsureContent(ensureLearnDuaContent, isLearnDuaContentReady);
  const topic = getLearnDuaTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_dua", topic, "/learn-dua");
  useEnsureLearnDuaProgressLoaded();

  return (
    <LearnTopicArticle
      ns="learnDua"
      basePath="/learn-dua"
      topic={topic}
      ready={ready}
      error={error}
      onRetry={retry}
      surface="learn_dua"
      contentRef={reportRef}
      readingProgress
      aside={(current) => <LearnDuaTopicAside currentId={current.id} />}
    >
      {(current) => <LearnDuaTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-dua/[topic]");
