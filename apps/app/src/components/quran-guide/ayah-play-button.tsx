import type { QuranGuideAyahAudio } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PLAY_CIRCLE_ICON } from "@/constants/media-icons";
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
  accessibilityLabel?: string;
};

function PlayTracksButton({ tracks, sourceHref, accessibilityLabel }: PlayButtonProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const label = accessibilityLabel ?? t("common.play");

  if (tracks.length === 0) return null;

  const onPress = () => {
    audio.play(tracks, 0, sourceHref ? { sourceHref } : undefined);
  };

  return (
    <LabeledIconButton
      name={PLAY_CIRCLE_ICON}
      label={t("common.play")}
      onPress={onPress}
      tintColor={colors.accent}
      labelColor={colors.accent}
      background={tokens.accentSoft}
      accessibilityLabel={label}
    />
  );
}

export function QuranAyahPlayButton({
  surah,
  ayahFrom,
  ayahTo,
  sourceHref,
}: {
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  sourceHref?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
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
      accessibilityLabel={t("learnQuran.playAyahA11y", { ref: range })}
    />
  );
}

export function QuranGuideClipPlayButton({
  audio,
  sourceHref,
  title,
}: {
  audio: QuranGuideAyahAudio;
  sourceHref?: string;
  title?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
  compact?: boolean;
}) {
  const prefs = useQuranPrefs();
  const track = guideAyahTrack(prefs.preferredReciterDir, audio, title);
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} />;
}

export function QuranExamplePlayButton({
  example,
  sourceHref,
}: {
  example: string;
  sourceHref?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
  compact?: boolean;
}) {
  const prefs = useQuranPrefs();
  const track = examplePhraseTrack(prefs.preferredReciterDir, example);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} />;
}

/** Plays a single timed vocab headword (not the citation ayah). */
export function QuranVocabPlayButton({
  vocabId,
  title,
  sourceHref,
}: {
  vocabId: string;
  title?: string;
  sourceHref?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
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
      accessibilityLabel={t("quran.wordByWord.playWord")}
    />
  );
}

export function QuranLetterPlayButton({
  letterId,
  title,
  sourceHref,
}: {
  letterId: string;
  title: string;
  sourceHref?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
  compact?: boolean;
}) {
  const track = letterPronunciationTrack(letterId, title);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} />;
}

export function QuranGlyphPlayButton({
  glyph,
  title,
  sourceHref,
}: {
  glyph: string;
  title: string;
  sourceHref?: string;
  /** @deprecated Ignored — guide play always uses the labeled circled control. */
  compact?: boolean;
}) {
  const track = glyphPronunciationTrack(glyph, title);
  if (!track) return null;
  return <PlayTracksButton tracks={[track]} sourceHref={sourceHref} />;
}
