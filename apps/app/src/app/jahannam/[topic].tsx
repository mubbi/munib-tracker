import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JahannamTopicContent } from "@/components/jahannam/topic-content";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getJahannamTopic } from "@/lib/jahannam";

export default function JahannamTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJahannamTopic(topicId);

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={topic?.title ?? t("jahannam.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/jahannam" as Href))}
    >
      <Seo path="/jahannam" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("jahannam.notFound")}
          actionLabel={t("jahannam.title")}
          onAction={() => router.replace("/jahannam" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JahannamTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
