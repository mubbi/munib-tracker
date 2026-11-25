import { useTranslation } from "react-i18next";

import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

type PlayButtonProps = {
  /** Id of the `AudioTrack` this control starts — playback state is read by this id. */
  trackId: string;
  /** Starts playback (the caller builds the queue). Not called while this track is current. */
  onPlay: () => void;
  /** Accessible name; defaults to the "Play" / "Pause" label for the current state. */
  accessibilityLabel?: string;
  /** TV: request initial D-pad focus. */
  preferredFocus?: boolean;
  disabled?: boolean;
  /**
   * Show a short caption under the glyph ("Play" / "Pause" / "Loading…") — for
   * action rows whose other actions are labelled too (reading cards, hadith).
   */
  labelled?: boolean;
};

/**
 * The play · pause · buffering rule shared by every scripture play control:
 * reads the audio context by track id, so only the item whose track is current
 * shows Pause (and a spinner while that track buffers).
 */
export function useTrackPlayback(trackId: string, onPlay: () => void) {
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const mine = audio.current?.id === trackId;
  const playing = mine && audio.isPlaying;
  const buffering = mine && audio.isBuffering && !audio.isLoaded;
  const label = buffering ? t("player.loading") : playing ? t("common.pause") : t("common.play");
  return {
    mine,
    playing,
    buffering,
    label,
    icon: playing ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON,
    onPress: mine ? audio.toggle : onPlay,
  };
}

/**
 * One play control for every scripture item: shows Pause while its own track
 * plays and a spinner while that track is buffering. 44pt target (56 on TV)
 * via `IconButton` / `LabeledIconButton`.
 */
export function PlayButton({
  trackId,
  onPlay,
  accessibilityLabel,
  preferredFocus,
  disabled,
  labelled,
}: PlayButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const state = useTrackPlayback(trackId, onPlay);
  const a11yLabel = accessibilityLabel && !state.playing ? accessibilityLabel : state.label;

  if (labelled) {
    return (
      <LabeledIconButton
        name={state.icon}
        label={state.label}
        tintColor={colors.accentText}
        labelColor={colors.accentText}
        background={tokens.accentSoft}
        accessibilityLabel={a11yLabel}
        accessibilityState={{ selected: state.playing, disabled }}
        haptic="selection"
        loading={state.buffering}
        loadingLabel={state.label}
        disabled={disabled}
        preferredFocus={preferredFocus}
        onPress={state.onPress}
      />
    );
  }

  return (
    <IconButton
      name={state.icon}
      size={22}
      tintColor={colors.accentText}
      background={tokens.accentSoft}
      accessibilityLabel={a11yLabel}
      accessibilityState={{ selected: state.playing, disabled }}
      haptic="selection"
      loading={state.buffering}
      disabled={disabled}
      preferredFocus={preferredFocus}
      onPress={state.onPress}
    />
  );
}
