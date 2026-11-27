import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnTimeline,
  type LearnTimelineEvent,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureSeerahContent, getSeerahEvents, isSeerahContentReady } from "@/lib/seerah";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Seerah — the shared Learn timeline (C-37): reading chrome (A−/A+, listen),
 * the one `LearnTimeline`, the review quiz after the content it tests, and the
 * standard Learn disclaimer.
 */
export default function SeerahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureSeerahContent, isSeerahContentReady);
  const { maxContentWidth } = useLearnWideLayout();
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const rawEvents = useMemo(() => getSeerahEvents(), [i18n.language, contentVersion]);
  const events = useMemo<LearnTimelineEvent[]>(
    () =>
      rawEvents.map((event) => ({
        id: event.id,
        badges: [
          t("seerah.ceBadge", { year: event.year }),
          ...(event.ah != null ? [t("seerah.ahBadge", { ah: event.ah })] : []),
        ],
        location: event.location,
        title: event.title,
        body: event.body,
      })),
    [rawEvents, t],
  );
  const listenText = useMemo(
    () => rawEvents.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [rawEvents],
  );

  return (
    <ScreenLayout
      eyebrow={t("seerah.eyebrow")}
      title={t("seerah.title")}
      subtitle={t("seerah.subtitle")}
      readingProgress
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/seerah" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <LearnReadingChrome surface="battles" listenText={listenText}>
          <Stagger>
            <LearnTimeline events={events} />
            <LearnQuizNavRow
              quizPath={"/seerah/quiz" as Href}
              titleKey="common.learnQuiz.title"
              subtitleKey="common.learnQuiz.hint"
            />
            <JannahDisclaimer textKey="seerah.disclaimer" />
          </Stagger>
        </LearnReadingChrome>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/seerah");
