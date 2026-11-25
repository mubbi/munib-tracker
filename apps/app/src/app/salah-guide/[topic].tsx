import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollViewInstance } from "react-native";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { FatihahCheckCard } from "@/components/quran/recite-along-fatihah-card";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { SalahGuideTopicAside } from "@/components/salah-guide/salah-guide-aside";
import { SalahGuideTopicContent } from "@/components/salah-guide/topic-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { goBackOrReplace } from "@/lib/navigation";
import { AFTER_SALAH_TOPIC_ID, afterSalahPassages } from "@/lib/recite-along/guides";
import {
  ensureSalahGuideContent,
  getSalahGuideTopic,
  getSalahGuideTopics,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import {
  howToPrayClipsByStep,
  howToPrayPhraseQueue,
  howToPrayStepIndexFromId,
  isHowToPrayTrack,
} from "@/lib/salah-how-to-pray-audio";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useQuranPrefs } from "@/stores/quran-store";
import { useEnsureSalahGuideProgressLoaded } from "@/stores/salah-guide-progress-store";

const ACTIVE_STEP_SCROLL_OFFSET = 112;

function stepScrollKey(index: number): string {
  return `how-to-pray-step:${index}`;
}

export function generateStaticParams(): Array<{ topic: string }> {
  return getSalahGuideTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function SalahGuideTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(
    ensureSalahGuideContent,
    isSalahGuideContentReady,
  );
  const topic = getSalahGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("salah_guide", topic, "/salah-guide");
  useEnsureSalahGuideProgressLoaded();
  const { maxContentWidth } = useLearnWideLayout();
  const audio = useAudioPlayerContext();
  const prefs = useQuranPrefs();

  const isHowToPray = topic?.id === "how-to-pray";
  const sourceHref = topic ? `/salah-guide/${topic.id}` : "/salah-guide";

  const clipsByStep = useMemo(
    () => (isHowToPray ? howToPrayClipsByStep(prefs.preferredReciterDir) : null),
    [isHowToPray, prefs.preferredReciterDir],
  );
  const phraseQueue = useMemo(
    () => (isHowToPray ? howToPrayPhraseQueue(prefs.preferredReciterDir) : []),
    [isHowToPray, prefs.preferredReciterDir],
  );

  const phrasesActive = isHowToPrayTrack(audio.current?.id);
  const activeStepIndex = phrasesActive
    ? (howToPrayStepIndexFromId(audio.current?.id) ?? null)
    : null;

  const scrollRef = useRef<ScrollViewInstance>(null);
  const activeScrollKey =
    isHowToPray && phrasesActive && activeStepIndex != null ? stepScrollKey(activeStepIndex) : null;
  const { register, onScroll } = useScrollToActive(
    scrollRef,
    activeScrollKey,
    ACTIVE_STEP_SCROLL_OFFSET,
  );
  const registerStep = useCallback((index: number) => register(stepScrollKey(index)), [register]);

  const onPressPlayAll = useCallback(() => {
    if (!isHowToPray || phraseQueue.length === 0) return;
    if (phrasesActive) {
      audio.toggle();
      return;
    }
    audio.play(phraseQueue, 0, { sourceHref });
  }, [audio, isHowToPray, phraseQueue, phrasesActive, sourceHref]);

  const onPressStep = useCallback(
    (index: number) => {
      if (!clipsByStep) return;
      const clips = clipsByStep.get(index);
      if (!clips?.length) return;

      if (phrasesActive && howToPrayStepIndexFromId(audio.current?.id) === index) {
        audio.toggle();
        return;
      }

      if (phrasesActive) {
        const firstId = clips[0]?.id;
        const queueIndex = phraseQueue.findIndex((track) => track.id === firstId);
        if (queueIndex >= 0) {
          audio.jumpTo(queueIndex);
          return;
        }
      }

      // Play from this step through the end of the mapped phrase queue.
      const startId = clips[0]?.id;
      const start = phraseQueue.findIndex((track) => track.id === startId);
      if (start >= 0) {
        audio.play(phraseQueue, start, { sourceHref });
      } else {
        audio.play(clips, 0, { sourceHref });
      }
    },
    [audio, clipsByStep, phraseQueue, phrasesActive, sourceHref],
  );

  const stepsAudio =
    isHowToPray && clipsByStep
      ? {
          activeStepIndex,
          isPlaying: audio.isPlaying && phrasesActive,
          onPressStep,
          onPressPlayAll,
          phrasesActive,
          hasAudioAtStep: (index: number) => (clipsByStep.get(index)?.length ?? 0) > 0,
          registerStep,
        }
      : undefined;

  const detailPath = topic ? `/salah-guide/${topic.id}` : "/salah-guide";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("salahGuide.title"), path: "/salah-guide" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={topic?.title ?? t("salahGuide.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
      maxContentWidth={maxContentWidth}
      scrollRef={isHowToPray ? scrollRef : undefined}
      onScroll={isHowToPray ? onScroll : undefined}
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
          title={t("salahGuide.notFound")}
          actionLabel={t("salahGuide.title")}
          onAction={() => router.replace("/salah-guide")}
        />
      ) : (
        <LearnSplitLayout aside={<SalahGuideTopicAside currentId={topic.id} />}>
          <Stagger>
            <LearnReadingChrome surface="salah_guide">
              <SalahGuideTopicContent topic={topic} stepsAudio={stepsAudio} />
            </LearnReadingChrome>
            {/* D68: on-device al-Fatihah check beside the how-to-pray steps (hidden on TV). */}
            {isHowToPray ? <FatihahCheckCard compact /> : null}
            {/* D68: Ayat al-Kursi and the three Quls, recited after each fard Salah. */}
            {topic.id === AFTER_SALAH_TOPIC_ID ? (
              <ReciteAlongCard
                passages={afterSalahPassages()}
                title={t("reciteAlong.afterSalah.title")}
                body={t("reciteAlong.afterSalah.body")}
              />
            ) : null}
            <JannahDisclaimer textKey="salahGuide.disclaimer" contentRef={reportRef} />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/salah-guide/[topic]");
