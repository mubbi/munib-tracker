import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollViewInstance } from "react-native";
import { LearnTopicArticle } from "@/components/learn-guide";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { FatihahCheckCard } from "@/components/quran/recite-along-fatihah-card";
import { SalahGuideTopicAside } from "@/components/salah-guide/salah-guide-aside";
import { SalahGuideTopicContent } from "@/components/salah-guide/topic-content";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
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
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureSalahGuideContent, isSalahGuideContentReady);
  const topic = getSalahGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("salah_guide", topic, "/salah-guide");
  useEnsureSalahGuideProgressLoaded();
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

  return (
    <LearnTopicArticle
      ns="salahGuide"
      basePath="/salah-guide"
      topic={topic}
      ready={contentReady}
      error={contentError}
      onRetry={retryContent}
      surface="salah_guide"
      contentRef={reportRef}
      scrollRef={isHowToPray ? scrollRef : undefined}
      onScroll={isHowToPray ? onScroll : undefined}
      aside={(tpc) => <SalahGuideTopicAside currentId={tpc.id} />}
      // An array (not a fragment) so `Stagger` spaces the cards apart.
      afterContent={(tpc) => [
        // D68: on-device al-Fatihah check beside the how-to-pray steps (hidden on TV).
        isHowToPray ? <FatihahCheckCard key="fatihah" compact /> : null,
        // D68: Ayat al-Kursi and the three Quls, recited after each fard Salah.
        tpc.id === AFTER_SALAH_TOPIC_ID ? (
          <ReciteAlongCard
            key="recite"
            passages={afterSalahPassages()}
            title={t("reciteAlong.afterSalah.title")}
            body={t("reciteAlong.afterSalah.body")}
          />
        ) : null,
      ]}
    >
      {(tpc) => <SalahGuideTopicContent topic={tpc} stepsAudio={stepsAudio} />}
    </LearnTopicArticle>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/salah-guide/[topic]");
