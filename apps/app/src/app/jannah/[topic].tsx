import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahDuaBlock } from "@/components/jannah/primitives";
import { JannahTopicContent } from "@/components/jannah/topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureJannahContent,
  getJannahFirdawsDua,
  getJannahTopic,
  getJannahTopics,
  isJannahContentReady,
} from "@/lib/jannah";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  const { JANNAH_TOPICS } = await import("@munib-tracker/shared/content/jannah");
  return JANNAH_TOPICS.map((tpc) => ({ topic: tpc.id }));
}

export default function JannahTopicScreen() {
  const { t, i18n } = useTranslation();
  const { version: contentVersion, ready } = useEnsureContent(
    ensureJannahContent,
    isJannahContentReady,
  );
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJannahTopic(topicId);
  const reportRef = useGuideContentReportRef("jannah", topic, "/jannah");
  // Recompute per locale so the localized du'a text renders on language switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const firdawsDua = useMemo(() => getJannahFirdawsDua(), [i18n.language, contentVersion]);

  return (
    <LearnTopicArticle
      ns="jannah"
      basePath="/jannah"
      topic={topic}
      ready={ready}
      surface="jannah"
      contentRef={reportRef}
      aside={(current) => (
        <ModuleTopicAside
          title={t("jannah.title")}
          basePath="/jannah"
          topics={getJannahTopics()}
          currentId={current.id}
        />
      )}
    >
      {(current) => (
        <>
          <JannahTopicContent topic={current} />
          {current.id === "al-firdaws" && firdawsDua ? (
            <JannahDuaBlock
              title={t("jannah.firdawsDuaTitle")}
              arabic={firdawsDua.arabic}
              transliteration={firdawsDua.transliteration}
              translation={firdawsDua.translation}
              reference={firdawsDua.reference}
            />
          ) : null}
        </>
      )}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jannah/[topic]");
