import type { QuranGuideAyahAudio } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  examplePhraseTrack,
  glyphPronunciationTrack,
  guideAyahRangeTracks,
  guideAyahTrack,
  letterPronunciationTrack,
  vocabWordTrack,
} from "@/lib/quran-guide-audio";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import type { AudioTrack } from "@/providers/audio-player-types";
import { useQuranPrefs } from "@/stores/quran-store";

type PlayButtonProps = {
  tracks: AudioTrack[];
  sourceHref?: string;
  /** Compact icon-only control (evidence cards, example rows). */
  compact?: boolean;
  accessibilityLabel?: string;
};

function PlayTracksButton({ tracks, sourceHref, compact, accessibilityLabel }: PlayButtonProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const label = accessibilityLabel ?? t("common.play");

  if (tracks.length === 0) return null;

  const onPress = () => {
    audio.play(tracks, 0, sourceHref ? { sourceHref } : undefined);
  };

  if (compact) {
    return (
      <IconButton
        name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
        onPress={onPress}
        tintColor={colors.accent}
        accessibilityLabel={label}
        hitTarget={40}
        size={18}
      />
    );
  }

  return (
    <LabeledIconButton
      name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
      label={t("common.play")}
      onPress={onPress}
      tintColor={colors.accent}
      labelColor={colors.accent}
      accessibilityLabel={label}
    />
  );
}

export function QuranAyahPlayButton({
  surah,
  ayahFrom,
  ayahTo,
  sourceHref,
  compact,
}: {
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  sourceHref?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const prefs = useQuranPrefs();
  const tracks = guideAyahRangeTracks(prefs.preferredReciterDir, surah, ayahFrom, ayahTo);
  const range =
    ayahTo && ayahTo !== ayahFrom ? `${surah}:${ayahFrom}-${ayahTo}` : `${surah}:${ayahFrom}`;
  return (
    <PlayTracksButton
      tracks={tracks}
      sourceHref={sourceHref}
      compact={compact}
      accessibilityLabel={t("learnQuran.playAyahA11y", { ref: range })}
    />
  );
}

export function QuranGuideClipPlayButton({
  audio,
  sourceHref,
  compact,
  title,
}: {
  audio: QuranGuideAyahAudio;
  sourceHref?: string;
  compact?: boolean;
  title?: string;
}) {
  const prefs = useQuranPrefs();
  const track = guideAyahTrack(prefs.preferredReciterDir, audio, title);
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} compact={compact} />;
}

export function QuranExamplePlayButton({
  example,
  sourceHref,
  compact = true,
}: {
  example: string;
  sourceHref?: string;
  compact?: boolean;
}) {
  const prefs = useQuranPrefs();
  const track = examplePhraseTrack(prefs.preferredReciterDir, example);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} compact={compact} />;
}

/** Plays a single timed vocab headword (not the citation ayah). */
export function QuranVocabPlayButton({
  vocabId,
  title,
  sourceHref,
  compact = true,
}: {
  vocabId: string;
  title?: string;
  sourceHref?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const prefs = useQuranPrefs();
  const track = vocabWordTrack(prefs.preferredReciterDir, vocabId, title);
  if (!track) return null;
  return (
    <PlayTracksButton
      tracks={[track]}
      sourceHref={sourceHref}
      compact={compact}
      accessibilityLabel={t("quran.wordByWord.playWord")}
    />
  );
}

export function QuranLetterPlayButton({
  letterId,
  title,
  sourceHref,
  compact = true,
}: {
  letterId: string;
  title: string;
  sourceHref?: string;
  compact?: boolean;
}) {
  const track = letterPronunciationTrack(letterId, title);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} compact={compact} />;
}

export function QuranGlyphPlayButton({
  glyph,
  title,
  sourceHref,
  compact = true,
}: {
  glyph: string;
  title: string;
  sourceHref?: string;
  compact?: boolean;
}) {
  const track = glyphPronunciationTrack(glyph, title);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} compact={compact} />;
}
