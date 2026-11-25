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
import { ensureLastDayContent, getLastDayTimeline, isLastDayContentReady } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LastDayTimelineScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const { maxContentWidth } = useLearnWideLayout();
  const twoColumn = useLearnTimelineTwoColumn();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const events = useMemo<LearnTimelineEvent[]>(
    () =>
      getLastDayTimeline().map((event) => ({
        id: event.id,
        badges: [
          t("lastDay.timelineStep", { step: event.order }),
          ...(event.signType ? [t(`lastDay.signType.${event.signType}`)] : []),
        ],
        title: event.title,
        body: event.body,
        link: event.topicId
          ? {
              label: t("lastDay.readTopic"),
              onPress: () =>
                router.push({
                  pathname: "/last-day/[topic]",
                  params: { topic: event.topicId ?? "" },
                }),
            }
          : undefined,
      })),
    [router, t, i18n.language, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.timelineTitle")}
      subtitle={t("lastDay.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/last-day/timeline" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <LearnReadingChrome surface="last_day">
          <Stagger>
            <JannahCallout tone="info">{t("lastDay.timelineIntro")}</JannahCallout>
            <LearnTimeline events={events} />
            <JannahDisclaimer textKey="lastDay.disclaimer" />
          </Stagger>
        </LearnReadingChrome>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/timeline");
