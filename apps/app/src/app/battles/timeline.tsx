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
import { ensureBattlesContent, getBattlesTimeline, isBattlesContentReady } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function BattlesTimelineScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const { maxContentWidth } = useLearnWideLayout();
  const twoColumn = useLearnTimelineTwoColumn();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const events = useMemo<LearnTimelineEvent[]>(
    () =>
      getBattlesTimeline().map((event) => ({
        id: event.id,
        badges: [
          t("seerah.ceBadge", { year: event.year }),
          ...(event.ah != null ? [t("seerah.ahBadge", { ah: event.ah })] : []),
        ],
        location: event.location,
        title: event.title,
        body: event.body,
        link: event.topicId
          ? {
              label: t("battles.readBattle"),
              onPress: () =>
                router.push({
                  pathname: "/battles/[topic]",
                  params: { topic: event.topicId ?? "" },
                }),
            }
          : undefined,
      })),
    [router, t, i18n.language, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.timelineTitle")}
      subtitle={t("battles.timelineSubtitle")}
      readingProgress
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/battles/timeline" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <LearnReadingChrome surface="battles">
          <Stagger>
            <JannahCallout tone="info">{t("battles.timelineIntro")}</JannahCallout>
            <LearnTimeline events={events} />
            <JannahDisclaimer textKey="battles.disclaimer" />
          </Stagger>
        </LearnReadingChrome>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/timeline");
