import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollView, StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuranGlyphPlayButton } from "@/components/quran-guide/ayah-play-button";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuidePronunciationPairs,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import {
  glyphFromTrack,
  isGlyphPronunciationTrack,
  pronunciationGlyphTracks,
} from "@/lib/quran-guide-audio";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

const SOURCE_HREF = "/learn-quran/pronunciation";
const ACTIVE_SCROLL_OFFSET = 96;

export default function LearnQuranPronunciationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { sizes } = useReadingTypography("learn_quran");
  const audio = useAudioPlayerContext();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const pairs = getQuranGuidePronunciationPairs();

  const glyphQueue = useMemo(() => pronunciationGlyphTracks(pairs), [pairs]);
  const glyphsActive = isGlyphPronunciationTrack(audio.current?.id);
  const activeGlyph = glyphsActive ? glyphFromTrack(audio.current?.id) : null;

  /** Resolve the pair that owns the current queue track (handles shared glyphs). */
  const activePairId = useMemo(() => {
    if (!glyphsActive || !audio.current?.id) return null;
    const idx = glyphQueue.findIndex((track) => track.id === audio.current?.id);
    if (idx < 0) return null;
    let cursor = 0;
    for (const pair of pairs) {
      const count = pronunciationGlyphTracks([pair]).length;
      if (count === 0) continue;
      if (idx >= cursor && idx < cursor + count) return pair.id;
      cursor += count;
    }
    return null;
  }, [audio.current?.id, glyphQueue, glyphsActive, pairs]);

  const scrollRef = useRef<ScrollView>(null);
  const { register, onScroll } = useScrollToActive(
    scrollRef,
    glyphsActive ? activePairId : null,
    ACTIVE_SCROLL_OFFSET,
  );

  const onPlayAll = useCallback(() => {
    if (glyphQueue.length === 0) return;
    if (glyphsActive) {
      audio.toggle();
      return;
    }
    audio.play(glyphQueue, 0, { sourceHref: SOURCE_HREF });
  }, [audio, glyphQueue, glyphsActive]);

  const letterSize = Math.max(32, sizes.arabic);
  const tipSize = Math.max(13, sizes.translation);
  const exampleSize = Math.max(12, sizes.transliteration);

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.pronunciationTitle")}
      subtitle={t("learnQuran.pronunciationSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/learn-quran/pronunciation" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.pronunciationIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            {glyphQueue.length > 0 ? (
              <Button
                label={glyphsActive && audio.isPlaying ? t("common.pause") : t("names.playAll")}
                variant="secondary"
                fullWidth
                icon={glyphsActive && audio.isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
                onPress={onPlayAll}
              />
            ) : null}

            {pairs.map((pair) => {
              const cardActive = activePairId === pair.id;
              return (
                <View key={pair.id} ref={register(pair.id)}>
                  <Card
                    padding="three"
                    style={[
                      styles.card,
                      cardActive ? { borderColor: colors.accent, borderWidth: 2 } : null,
                    ]}
                  >
                    <View style={styles.lettersRow}>
                      {pair.letters.map((letter) => {
                        const letterActive = cardActive && activeGlyph === letter;
                        return (
                          <View key={letter} style={styles.letterCell}>
                            <ThemedText
                              type="arabic"
                              style={[
                                styles.letter,
                                {
                                  fontSize: letterSize,
                                  lineHeight: letterSize * 1.4,
                                  color: letterActive ? colors.accent : colors.foreground,
                                },
                              ]}
                            >
                              {letter}
                            </ThemedText>
                            <QuranGlyphPlayButton
                              glyph={letter}
                              title={letter}
                              sourceHref={SOURCE_HREF}
                            />
                          </View>
                        );
                      })}
                    </View>
                    <SectionHeader
                      title={pair.title}
                      icon={{
                        ios: "mouth.fill",
                        android: "record_voice_over",
                        web: "record_voice_over",
                      }}
                    />
                    <ThemedText
                      type="small"
                      themeColor="mutedForeground"
                      style={{ fontSize: tipSize, lineHeight: tipSize * 1.45 }}
                    >
                      {pair.tip}
                    </ThemedText>
                    <View style={styles.examples}>
                      {pair.examples.map((ex) => (
                        <ThemedText
                          key={ex}
                          type="small"
                          style={{
                            fontSize: exampleSize,
                            lineHeight: exampleSize * 1.45,
                            textAlign: "right",
                          }}
                        >
                          {ex}
                        </ThemedText>
                      ))}
                    </View>
                  </Card>
                </View>
              );
            })}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  lettersRow: { flexDirection: "row", gap: Spacing.four, justifyContent: "center" },
  letterCell: { alignItems: "center", gap: Spacing.one },
  letter: { textAlign: "center" },
  examples: { gap: Spacing.one, marginTop: Spacing.two },
});
