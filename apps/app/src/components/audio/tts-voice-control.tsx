import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { BorderWidth } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { captureAppException } from "@/lib/sentry";
import { setTtsVoice, useTtsVoices } from "@/lib/settings/tts-voice";
import { isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

const VOICE_ICON = {
  ios: "waveform",
  android: "record_voice_over",
  web: "record_voice_over",
} as const;

type TtsVoiceControlProps = {
  size?: number;
  wellRadius?: number;
};

/**
 * Mini-/expanded-player control that opens the TTS voice picker when the
 * active queue is spoken text (custom adhkar listen), not file audio.
 */
export function TtsVoiceControl({ size = 18, wellRadius = 20 }: TtsVoiceControlProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const voices = useTtsVoices();
  const [open, setOpen] = useState(false);

  const track = audio.current;
  // TV: no speech synthesis voices to pick (expo-speech is stubbed).
  if (isTV() || !isTtsPlaybackTrack(track) || !track.ttsPlayback) return null;

  const lang = track.ttsPlayback.lang;
  const selectedVoiceId = track.ttsPlayback.voice ?? voices[lang];

  return (
    <>
      <IconButton
        name={VOICE_ICON}
        size={size}
        tintColor={selectedVoiceId ? colors.accent : colors.mutedForeground}
        accessibilityLabel={t("player.ttsVoice")}
        accessibilityHint={t("player.ttsVoiceHint")}
        accessibilityState={{ selected: Boolean(selectedVoiceId) }}
        onPress={() => setOpen(true)}
        glass={!selectedVoiceId}
        background={selectedVoiceId ? tokens.accentSoft : undefined}
        wellRadius={wellRadius}
        style={
          selectedVoiceId
            ? { borderWidth: BorderWidth.thick, borderColor: colors.accent }
            : undefined
        }
      />
      <TtsVoiceSheet
        visible={open}
        onClose={() => setOpen(false)}
        lang={lang}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={(voiceId) => {
          // A storage / player failure must never escape as an unhandled
          // rejection — the root boundary would replace the whole app.
          setTtsVoice(lang, voiceId).catch((error: unknown) => {
            captureAppException(error, { tags: { area: "audio", phase: "tts-voice-save" } });
          });
          try {
            audio.setTtsVoice(voiceId);
          } catch (error) {
            captureAppException(error, { tags: { area: "audio", phase: "tts-voice-apply" } });
          }
        }}
      />
    </>
  );
}
