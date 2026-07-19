import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollView, StyleSheet, View } from "react-native";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { SalahGuideTopicContent } from "@/components/salah-guide/topic-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ADHAN_FOLLOW_ALONG_STYLE_ID,
  ADHAN_LEARN_STYLES,
  adhanPhraseIndexFromId,
  adhanPhraseTracks,
  adhanTrack,
  isAdhanPhraseTrack,
} from "@/lib/adhan-audio";
import {
  cueStartSec,
  isAdhanFollowAlongTrack,
  phraseIndexAtCueTime,
} from "@/lib/adhan-phrase-cues";
import { prefetchAudioUri } from "@/lib/audio-cache";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureSalahGuideContent,
  getSalahGuideTopic,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useEnsureSalahGuideProgressLoaded } from "@/stores/salah-guide-progress-store";

const SOURCE_HREF = "/salah-guide/adhan";
/** Clears floating header + progress line when scrolling the active phrase into view. */
const ACTIVE_STEP_SCROLL_OFFSET = 112;

function stepScrollKey(index: number): string {
  return `adhan-step:${index}`;
}

function AdhanStyleRow({
  styleId,
  name,
  location,
  credit,
  uri,
  followAlong,
}: {
  styleId: string;
  name: string;
  location: string;
  credit: string;
  uri?: string;
  followAlong?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const trackId = `adhan:${styleId}`;
  const isActive = audio.current?.id === trackId;
  const isPlaying = isActive && audio.isPlaying;

  useEffect(() => {
    if (uri) prefetchAudioUri(uri);
  }, [uri]);

  const onPress = useCallback(() => {
    if (isActive) {
      audio.toggle();
      return;
    }
    audio.play([adhanTrack(styleId)], 0, { sourceHref: SOURCE_HREF });
  }, [audio, isActive, styleId]);

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={
        isPlaying ? t("salahGuide.adhan.pause", { name }) : t("salahGuide.adhan.play", { name })
      }
      onPress={onPress}
      style={[styles.styleRow, { backgroundColor: colors.muted }]}
    >
      <IconWell
        icon={
          isPlaying
            ? { ios: "pause.fill", android: "pause", web: "pause" }
            : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
        }
        tint={isActive ? colors.accent : colors.mutedForeground}
        background={isActive ? tokens.accentSoft : colors.card}
      />
      <View style={styles.styleCopy}>
        <ThemedText type="smallBold">{name}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {location}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.credit}>
          {credit}
        </ThemedText>
        {followAlong ? (
          <ThemedText type="caption" style={{ color: colors.accent }}>
            {t("salahGuide.adhan.followAlongNote")}
          </ThemedText>
        ) : null}
      </View>
      {isPlaying ? (
        <SymbolView
          name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          size={18}
          tintColor={colors.accent}
        />
      ) : null}
    </PressableScale>
  );
}

export default function SalahGuideAdhanScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  useEnsureSalahGuideProgressLoaded();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureSalahGuideContent,
    isSalahGuideContentReady,
  );
  // Recompute per locale so the translated topic renders on language switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const TOPIC = useMemo(() => getSalahGuideTopic("adhan"), [i18n.language, contentVersion]);

  const phraseTracks = useMemo(() => adhanPhraseTracks(), []);
  const phrasesActive = isAdhanPhraseTrack(audio.current?.id);
  const followAlongActive = isAdhanFollowAlongTrack(audio.current?.id);

  const [followAlongStep, setFollowAlongStep] = useState<number | null>(null);

  useEffect(() => {
    if (!followAlongActive) {
      setFollowAlongStep(null);
      return;
    }
    // Sync once while paused; keep looping while playing.
    const sync = () => {
      const index = phraseIndexAtCueTime(audio.readPlaybackSeconds());
      setFollowAlongStep(index ?? null);
    };
    sync();
    if (!audio.isPlaying) return;
    let frame = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      sync();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [followAlongActive, audio.isPlaying, audio.readPlaybackSeconds]);

  const activeStepIndex = phrasesActive
    ? (adhanPhraseIndexFromId(audio.current?.id) ?? null)
    : followAlongActive
      ? followAlongStep
      : null;

  const scrollRef = useRef<ScrollView>(null);
  const activeScrollKey =
    activeStepIndex != null && (phrasesActive || followAlongActive)
      ? stepScrollKey(activeStepIndex)
      : null;
  const { register, onScroll } = useScrollToActive(
    scrollRef,
    activeScrollKey,
    ACTIVE_STEP_SCROLL_OFFSET,
  );
  const registerStep = useCallback((index: number) => register(stepScrollKey(index)), [register]);

  const onPressPlayAll = useCallback(() => {
    if (phrasesActive) {
      audio.toggle();
      return;
    }
    audio.play(phraseTracks, 0, { sourceHref: SOURCE_HREF });
  }, [audio, phraseTracks, phrasesActive]);

  const onPressStep = useCallback(
    (index: number) => {
      if (followAlongActive) {
        const start = cueStartSec(index);
        if (start != null) {
          if (!audio.isPlaying) audio.toggle();
          audio.seekTo(start);
        }
        return;
      }
      if (phrasesActive && adhanPhraseIndexFromId(audio.current?.id) === index) {
        audio.toggle();
        return;
      }
      if (phrasesActive) {
        audio.jumpTo(index);
        return;
      }
      audio.play(phraseTracks, index, { sourceHref: SOURCE_HREF });
    },
    [audio, followAlongActive, phraseTracks, phrasesActive],
  );

  if (!TOPIC) {
    return null;
  }

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={TOPIC.title}
      subtitle={TOPIC.summary}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/salah-guide/adhan" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="salah_guide">
            <Card padding="three">
              <SectionHeader
                title={t("salahGuide.adhan.listenTitle")}
                icon={{ ios: "speaker.wave.3.fill", android: "campaign", web: "campaign" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.listenHint}>
                {t("salahGuide.adhan.listenHint")}
              </ThemedText>
              <View style={styles.styles}>
                {ADHAN_LEARN_STYLES.map((style) => (
                  <AdhanStyleRow
                    key={style.id}
                    styleId={style.id}
                    name={t(`settings.adhanStyles.${style.id}.name`)}
                    location={t(`settings.adhanStyles.${style.id}.location`)}
                    credit={style.credit}
                    uri={style.uri}
                    followAlong={style.id === ADHAN_FOLLOW_ALONG_STYLE_ID}
                  />
                ))}
              </View>
              <View style={[styles.sourceNote, { backgroundColor: tokens.status.info.soft }]}>
                <ThemedText type="caption" style={styles.sourceText}>
                  {t("salahGuide.adhan.sourceNote")}
                </ThemedText>
              </View>
            </Card>

            <SalahGuideTopicContent
              topic={TOPIC}
              stepsAudio={{
                activeStepIndex,
                isPlaying: audio.isPlaying && (phrasesActive || followAlongActive),
                onPressStep,
                onPressPlayAll,
                phrasesActive,
                registerStep,
              }}
            />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="salahGuide.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listenHint: { marginTop: Spacing.one, lineHeight: 20 },
  styles: { gap: Spacing.two, marginTop: Spacing.three },
  styleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  styleCopy: { flex: 1, gap: 2 },
  credit: { fontStyle: "italic", lineHeight: 16 },
  sourceNote: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  sourceText: { lineHeight: 18 },
});
