import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LastDayTopicContent } from "@/components/last-day/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getLastDayTopic } from "@/lib/last-day";
import { useEnsureLastDayProgressLoaded } from "@/stores/last-day-progress-store";

export default function LastDayTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getLastDayTopic(topicId);
  useEnsureLastDayProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={topic?.title ?? t("lastDay.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/last-day" as Href))}
    >
      <Seo path="/last-day" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("lastDay.notFound")}
          actionLabel={t("lastDay.title")}
          onAction={() => router.replace("/last-day" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="last_day">
            <LastDayTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
