import { JANNAH_FIRDAWS_DUA } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer, JannahDuaBlock } from "@/components/jannah/primitives";
import { JannahTopicContent } from "@/components/jannah/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getJannahTopic } from "@/lib/jannah";

export default function JannahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJannahTopic(topicId);
  const reportRef = useGuideContentReportRef("jannah", topic, "/jannah");

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={topic?.title ?? t("jannah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/jannah"))}
    >
      <Seo path="/jannah" />
      {!topic ? (
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

            {topic.id === "al-firdaws" ? (
              <JannahDuaBlock
                title={t("jannah.firdawsDuaTitle")}
                arabic={JANNAH_FIRDAWS_DUA.arabic}
                transliteration={JANNAH_FIRDAWS_DUA.transliteration}
                translation={JANNAH_FIRDAWS_DUA.translation}
                reference={JANNAH_FIRDAWS_DUA.reference}
              />
            ) : null}
          </LearnReadingChrome>

          <JannahDisclaimer contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
