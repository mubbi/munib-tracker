import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

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
  const quranPrefs = useQuranPrefs();
  const { updatePrefs } = useQuranActions();
  const [open, setOpen] = useState(false);

  const track = audio.current;
  if (!isTtsPlaybackTrack(track) || !track.ttsPlayback) return null;

  const lang = track.ttsPlayback.lang;
  const selectedVoiceId = track.ttsPlayback.voice ?? quranPrefs.ttsVoiceByLang?.[lang];

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
        style={selectedVoiceId ? { borderWidth: 1.5, borderColor: colors.accent } : undefined}
      />
      <TtsVoiceSheet
        visible={open}
        onClose={() => setOpen(false)}
        lang={lang}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={(voiceId) => {
          const nextVoices = { ...(quranPrefs.ttsVoiceByLang ?? {}) };
          if (voiceId) nextVoices[lang] = voiceId;
          else delete nextVoices[lang];
          void updatePrefs({ ttsVoiceByLang: nextVoices });
          audio.setTtsVoice(voiceId);
        }}
      />
    </>
  );
}
