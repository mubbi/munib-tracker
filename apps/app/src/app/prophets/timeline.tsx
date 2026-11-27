import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnTimeline,
  type LearnTimelineEvent,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureProphetsContent, getProphetsTimeline, isProphetsContentReady } from "@/lib/prophets";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function ProphetsTimelineScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const { maxContentWidth } = useLearnWideLayout();
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const events = useMemo<LearnTimelineEvent[]>(
    () =>
      getProphetsTimeline().map((event) => ({
        id: event.id,
        badges: [event.era],
        title: event.title,
        body: event.body,
        link: event.prophetId
          ? {
              label: t("prophets.readTopic"),
              onPress: () =>
                router.push({
                  pathname: "/prophets/[topic]",
                  params: { topic: event.prophetId ?? "" },
                }),
            }
          : undefined,
      })),
    [router, t, i18n.language, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.timelineTitle")}
      subtitle={t("prophets.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/prophets/timeline" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <LearnReadingChrome surface="prophets">
          <Stagger>
            <JannahCallout tone="info">{t("prophets.timelineIntro")}</JannahCallout>
            <LearnTimeline events={events} />
            <JannahDisclaimer textKey="prophets.disclaimer" />
          </Stagger>
        </LearnReadingChrome>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/prophets/timeline");
