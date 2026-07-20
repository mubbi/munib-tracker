import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { prefetchAudioUri } from "@/lib/audio-cache";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureSalahGuideContent,
  getSalahGuidePhrases,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { salahGuidePhraseAudio } from "@/lib/salah-how-to-pray-audio";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useQuranPrefs } from "@/stores/quran-store";

function PhraseCard({
  id,
  title,
  when,
  arabic,
  transliteration,
  translation,
  meaning,
  reference,
}: {
  id: string;
  title: string;
  when: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  reference?: string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const audio = useAudioPlayerContext();
  const prefs = useQuranPrefs();
  const tracks = useMemo(
    () => salahGuidePhraseAudio(id, prefs.preferredReciterDir ?? "Alafasy_128kbps"),
    [id, prefs.preferredReciterDir],
  );

  const firstId = tracks?.[0]?.id;
  const isActive = Boolean(firstId && audio.current?.id?.startsWith(`salah-phrase:${id}:`));
  const isPlaying = isActive && audio.isPlaying;

  useEffect(() => {
    for (const track of tracks ?? []) {
      if (track.uri) prefetchAudioUri(track.uri);
    }
  }, [tracks]);

  const onPlay = useCallback(() => {
    if (!tracks?.length) return;
    if (isActive && isPlaying) {
      audio.toggle();
      return;
    }
    // Always replay from the start (clipEnd leaves the engine paused mid-file).
    audio.play(tracks, 0, { sourceHref: "/salah-guide/phrases" });
  }, [audio, isActive, isPlaying, tracks]);

  return (
    <Card padding="three">
      <View style={styles.phraseHeader}>
        <View style={styles.phraseTitle}>
          <SectionHeader
            title={title}
            icon={{ ios: "text.quote", android: "format_quote", web: "format_quote" }}
          />
        </View>
        {tracks?.length ? (
          <LabeledIconButton
            name={isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
            label={isPlaying ? t("common.pause") : t("common.play")}
            onPress={onPlay}
            tintColor={colors.accent}
            labelColor={colors.accent}
            background={isActive ? tokens.accentSoft : undefined}
            accessibilityLabel={isPlaying ? t("common.pause") : t("common.play")}
          />
        ) : null}
      </View>
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        style={[
          styles.when,
          { fontSize: sizes.transliteration, lineHeight: sizes.transliteration * 1.35 },
        ]}
      >
        {when}
      </ThemedText>
      <ReligiousTextStack
        arabic={arabic}
        transliteration={transliteration}
        translation={translation}
      />
      <View style={[styles.meaning, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.meaningLabel}>
          {t("salahGuide.meaningLabel")}
        </ThemedText>
        <ThemedText
          type="small"
          style={{
            color: colors.foreground,
            fontSize: sizes.translation,
            lineHeight: sizes.translation * 1.45,
          }}
        >
          {meaning}
        </ThemedText>
      </View>
      {reference ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={[styles.reference, { fontSize: sizes.transliteration }]}
        >
          {reference}
        </ThemedText>
      ) : null}
    </Card>
  );
}

export default function SalahGuidePhrasesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureSalahGuideContent,
    isSalahGuideContentReady,
  );
  // Recompute per locale so translated phrases render on language switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const phrases = useMemo(() => getSalahGuidePhrases(), [i18n.language, contentVersion]);

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={t("salahGuide.phrasesTitle")}
      subtitle={t("salahGuide.phrasesSubtitle")}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
    >
      <Seo path="/salah-guide/phrases" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="salah_guide">
            <JannahCallout tone="accent">{t("salahGuide.phrasesIntro")}</JannahCallout>

            {phrases.map((phrase) => (
              <PhraseCard key={phrase.id} {...phrase} />
            ))}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="salahGuide.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  phraseHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  phraseTitle: { flex: 1, minWidth: 0, overflow: "hidden" },
  when: { marginTop: Spacing.two },
  meaning: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
  meaningLabel: { textTransform: "uppercase", letterSpacing: 0.5 },
  reference: { marginTop: Spacing.two, lineHeight: 18 },
});
