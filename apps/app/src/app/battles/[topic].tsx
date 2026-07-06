import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { BattlesTopicContent } from "@/components/battles/topic-content";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getBattlesTopic } from "@/lib/battles";
import { useEnsureBattlesProgressLoaded } from "@/stores/battles-progress-store";

export default function BattlesTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getBattlesTopic(topicId);
  const reportRef = useGuideContentReportRef("battles", topic, "/battles");
  useEnsureBattlesProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={topic?.title ?? t("battles.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/battles" as Href))}
    >
      <Seo path="/battles" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("battles.notFound")}
          actionLabel={t("battles.title")}
          onAction={() => router.replace("/battles" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="battles">
            <BattlesTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="battles.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
