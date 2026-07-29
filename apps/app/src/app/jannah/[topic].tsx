import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer, JannahDuaBlock } from "@/components/jannah/primitives";
import { JannahTopicContent } from "@/components/jannah/topic-content";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureJannahContent,
  getJannahFirdawsDua,
  getJannahTopic,
  isJannahContentReady,
} from "@/lib/jannah";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  const { JANNAH_TOPICS } = await import("@munib-tracker/shared/content/jannah");
  return JANNAH_TOPICS.map((tpc) => ({ topic: tpc.id }));
}

export default function JannahTopicScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureJannahContent,
    isJannahContentReady,
  );
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJannahTopic(topicId);
  const reportRef = useGuideContentReportRef("jannah", topic, "/jannah");
  // Recompute per locale so the localized du'a text renders on language switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const firdawsDua = useMemo(() => getJannahFirdawsDua(), [i18n.language, contentVersion]);

  const detailPath = topic ? `/jannah/${topic.id}` : "/jannah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("jannah.title"), path: "/jannah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={topic?.title ?? t("jannah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/jannah")}
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
          title={t("jannah.notFound")}
          actionLabel={t("jannah.title")}
          onAction={() => router.replace("/jannah")}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <JannahTopicContent topic={topic} />

            {topic.id === "al-firdaws" && firdawsDua ? (
              <JannahDuaBlock
                title={t("jannah.firdawsDuaTitle")}
                arabic={firdawsDua.arabic}
                transliteration={firdawsDua.transliteration}
                translation={firdawsDua.translation}
                reference={firdawsDua.reference}
              />
            ) : null}
          </LearnReadingChrome>

          <JannahDisclaimer contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
