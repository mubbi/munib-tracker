import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { JahannamTopicContent } from "@/components/jahannam/topic-content";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureJahannamContent,
  getJahannamTopic,
  getJahannamTopics,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams(): Array<{ topic: string }> {
  return getJahannamTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function JahannamTopicScreen() {
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const topic = getJahannamTopic(topicId);

  return (
    <LearnTopicArticle
      ns="jahannam"
      basePath="/jahannam"
      topic={topic}
      ready={ready}
      surface="jahannam"
      aside={(current) => (
        <ModuleTopicAside
          title={t("jahannam.title")}
          basePath="/jahannam"
          topics={getJahannamTopics()}
          currentId={current.id}
        />
      )}
    >
      {(current) => <JahannamTopicContent topic={current} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/[topic]");
