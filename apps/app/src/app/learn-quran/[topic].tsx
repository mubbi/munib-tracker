import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { LearnTopicArticle } from "@/components/learn-guide";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { ReciteAlongInlineScope } from "@/components/quran/recite-along-inline";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { QuranGuideTopicContent } from "@/components/quran-guide/topic-content";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureQuranGuideContent,
  getQuranGuideTopic,
  getQuranGuideTopics,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { learnQuranTopicPassages } from "@/lib/recite-along/guides";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureQuranGuideProgressLoaded } from "@/stores/quran-guide-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getQuranGuideTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LearnQuranTopicScreen() {
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureQuranGuideContent, isQuranGuideContentReady);
  const topic = getQuranGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_quran", topic, "/learn-quran");
  useEnsureQuranGuideProgressLoaded();
  const recitePassages = topic ? learnQuranTopicPassages(topic) : [];

  return (
    <LearnTopicArticle
      ns="learnQuran"
      basePath="/learn-quran"
      topic={topic}
      ready={contentReady}
      error={contentError}
      onRetry={retryContent}
      surface="learn_quran"
      contentRef={reportRef}
      aside={(tpc) => <QuranGuideTopicAside currentId={tpc.id} />}
      afterContent={() => (
        // D68: recite the topic's ayahs with the on-device listener (hidden on TV).
        <ReciteAlongCard passages={recitePassages} title={t("reciteAlong.topicTitle")} />
      )}
    >
      {(tpc) => (
        // The card after the article already offers these ayahs — no inline buttons too.
        <ReciteAlongInlineScope enabled={recitePassages.length === 0}>
          <QuranGuideTopicContent topic={tpc} />
        </ReciteAlongInlineScope>
      )}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/[topic]");
