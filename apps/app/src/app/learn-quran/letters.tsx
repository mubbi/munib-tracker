import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { RECITE_ALONG_ICON } from "@/components/quran/recite-along-button";
import { QuranLetterPlayButton } from "@/components/quran-guide/ayah-play-button";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useTajweedDrillAvailable } from "@/hooks/use-recite-along-available";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  ensureQuranGuideContent,
  getQuranGuideLetters,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import {
  allLetterPronunciationTracks,
  isLetterPronunciationTrack,
  letterIdFromTrack,
} from "@/lib/quran-guide-audio";
import { isQalqalahLetter, QALQALAH_DRILL_LESSON } from "@/lib/recite-along/tajweed";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

const SOURCE_HREF = "/learn-quran/letters";
const ACTIVE_SCROLL_OFFSET = 96;

export default function LearnQuranLettersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography("learn_quran");
  const audio = useAudioPlayerContext();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const letters = getQuranGuideLetters();
  // D68: the qalqalah letters link to the qalqalah sound drill where it can run.
  const qalqalahDrill = useTajweedDrillAvailable(QALQALAH_DRILL_LESSON);
  const tv = isTV();
  // Tablet / desktop: dense 4-up alphabet grid (beside the module aside at ≥1200).
  const { wide, maxContentWidth } = useLearnWideLayout();
  const wideTile = wide ? styles.tileWrapWide : null;

  const letterQueue = useMemo(() => allLetterPronunciationTracks(letters), [letters]);
  const lettersActive = isLetterPronunciationTrack(audio.current?.id);
  const activeLetterId = lettersActive ? letterIdFromTrack(audio.current?.id) : null;

  const scrollRef = useRef<ScrollViewInstance>(null);
  const { register, onScroll } = useScrollToActive(
    scrollRef,
    lettersActive ? activeLetterId : null,
    ACTIVE_SCROLL_OFFSET,
  );

  const onPlayAll = useCallback(() => {
    if (letterQueue.length === 0) return;
    if (lettersActive) {
      audio.toggle();
      return;
    }
    audio.play(letterQueue, 0, { sourceHref: SOURCE_HREF });
  }, [audio, letterQueue, lettersActive]);

  const glyphSize = Math.max(28, sizes.arabic);
  const nameSize = Math.max(13, sizes.translation);
  const metaSize = Math.max(12, sizes.transliteration);

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.lettersTitle")}
      subtitle={t("learnQuran.lettersSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/learn-quran/letters" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="arabic-letters" />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnQuran.lettersIntro")}</JannahCallout>

            <LearnReadingChrome surface="learn_quran">
              {letterQueue.length > 0 ? (
                <Button
                  label={lettersActive && audio.isPlaying ? t("common.pause") : t("names.playAll")}
                  variant="secondary"
                  fullWidth
                  icon={lettersActive && audio.isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
                  onPress={onPlayAll}
                  preferredFocus
                  style={styles.playAll}
                />
              ) : null}

              <View style={styles.grid}>
                {letters.map((letter) => {
                  const isActive = activeLetterId === letter.id;
                  return (
                    <View
                      key={letter.id}
                      ref={register(letter.id)}
                      // TV: 3-up grid uses the landscape width; D-pad moves row by row.
                      style={[styles.tileWrap, tv && styles.tileWrapTv, wideTile]}
                    >
                      <Card
                        padding="three"
                        style={[
                          styles.tile,
                          isActive ? { borderColor: colors.accent, borderWidth: 2 } : null,
                        ]}
                      >
                        <View style={styles.tileHeader}>
                          <ThemedText
                            type="arabic"
                            style={[
                              styles.glyph,
                              {
                                fontSize: glyphSize,
                                lineHeight: glyphSize * 1.4,
                                color: isActive ? colors.accent : colors.foreground,
                              },
                            ]}
                          >
                            {letter.letter}
                          </ThemedText>
                          <QuranLetterPlayButton
                            letterId={letter.id}
                            title={letter.name}
                            sourceHref={SOURCE_HREF}
                          />
                        </View>
                        <ThemedText
                          type="smallBold"
                          style={{ fontSize: nameSize, lineHeight: nameSize * 1.35 }}
                        >
                          {letter.name}
                        </ThemedText>
                        <ThemedText
                          type="caption"
                          themeColor="mutedForeground"
                          style={{ fontSize: metaSize, lineHeight: metaSize * 1.35 }}
                        >
                          {letter.transliteration}
                        </ThemedText>
                        <ThemedText
                          type="caption"
                          style={{ fontSize: metaSize, lineHeight: metaSize * 1.4 }}
                        >
                          {letter.pronunciation}
                        </ThemedText>
                        <View style={[styles.examplesBox, { backgroundColor: tokens.accentSoft }]}>
                          {letter.examples.map((ex) => (
                            <ThemedText
                              key={ex}
                              type="caption"
                              style={{
                                color: colors.accent,
                                fontSize: metaSize,
                                lineHeight: metaSize * 1.45,
                                textAlign: "right",
                              }}
                            >
                              {ex}
                            </ThemedText>
                          ))}
                        </View>
                        {qalqalahDrill && isQalqalahLetter(letter.id) ? (
                          <Button
                            label={t("quranCompanion.pronunciation.practiseSound")}
                            icon={RECITE_ALONG_ICON}
                            variant="ghost"
                            size="sm"
                            accessibilityHint={t("learnQuran.qalqalahDrillHint")}
                            onPress={() =>
                              router.push({
                                pathname: "/learn-quran/tajweed/drill/[id]",
                                params: { id: QALQALAH_DRILL_LESSON },
                              })
                            }
                            style={styles.drillChip}
                          />
                        ) : null}
                      </Card>
                    </View>
                  );
                })}
              </View>
            </LearnReadingChrome>

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  playAll: { marginBottom: Spacing.two },
  drillChip: { alignSelf: "flex-start" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  tileWrap: {
    width: "47%",
    flexGrow: 1,
  },
  tileWrapTv: {
    width: "31%",
  },
  // Fixed fractions (no grow) so the last row keeps the column rhythm.
  tileWrapWide: {
    width: "23.5%",
    flexGrow: 0,
  },
  tile: {
    width: "100%",
    gap: Spacing.one,
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  glyph: { textAlign: "center", flex: 1 },
  examplesBox: {
    marginTop: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/letters");
