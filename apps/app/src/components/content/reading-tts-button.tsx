import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTtsAvailable, resolveTtsVoice, speakLong, stopTts } from "@/lib/tts";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

type ReadingTtsButtonProps = {
  /** Text to speak (Arabic preferred for adhkar). */
  text: string;
  /** BCP-47 language for voice filtering and speech. */
  lang: string;
};

/**
 * Play / stop control that opens a voice-picker sheet before speaking.
 * Used when a reading card has no recorded audio (e.g. custom adhkar).
 */
export function ReadingTtsButton({ text, lang }: ReadingTtsButtonProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const quranPrefs = useQuranPrefs();
  const { updatePrefs } = useQuranActions();
  const [speaking, setSpeaking] = useState(false);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const speakingRef = useRef(false);
  const sessionId = useId();
  const activeSessionRef = useRef<string | null>(null);
  const preferredVoiceId = quranPrefs.ttsVoiceByLang?.[lang];
  const trimmed = text.trim();

  useEffect(() => {
    return () => {
      if (activeSessionRef.current === sessionId) {
        void stopTts();
      }
    };
  }, [sessionId]);

  if (!trimmed) return null;

  const stop = () => {
    void (async () => {
      await stopTts();
      speakingRef.current = false;
      activeSessionRef.current = null;
      setSpeaking(false);
    })();
  };

  const startWithVoice = (voiceId: string | undefined) => {
    void (async () => {
      const available = await isTtsAvailable();
      if (!available) {
        Alert.alert(t("reading.listenUnavailableTitle"), t("reading.listenUnavailableBody"));
        return;
      }

      const nextVoices = { ...(quranPrefs.ttsVoiceByLang ?? {}) };
      if (voiceId) nextVoices[lang] = voiceId;
      else delete nextVoices[lang];
      void updatePrefs({ ttsVoiceByLang: nextVoices });

      const voice = await resolveTtsVoice(lang, voiceId);
      speakingRef.current = true;
      activeSessionRef.current = sessionId;
      setSpeaking(true);
      await speakLong(trimmed, {
        lang,
        voice,
        onDone: () => {
          if (activeSessionRef.current !== sessionId) return;
          speakingRef.current = false;
          activeSessionRef.current = null;
          setSpeaking(false);
        },
        onError: () => {
          if (activeSessionRef.current !== sessionId) return;
          speakingRef.current = false;
          activeSessionRef.current = null;
          setSpeaking(false);
        },
      });
    })();
  };

  return (
    <>
      <LabeledIconButton
        name={
          speaking
            ? { ios: "stop.fill", android: "stop", web: "stop" }
            : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }
        }
        label={speaking ? t("reading.listenStopLabel") : t("reading.listenLabel")}
        iconSize={16}
        tintColor={colors.accent}
        background={tokens.accentSoft}
        accessibilityLabel={speaking ? t("reading.listenStop") : t("reading.listen")}
        accessibilityHint={t("reading.listenHint")}
        accessibilityState={{ selected: speaking }}
        onPress={() => {
          if (speaking) stop();
          else setVoiceSheetOpen(true);
        }}
      />
      <TtsVoiceSheet
        visible={voiceSheetOpen}
        onClose={() => setVoiceSheetOpen(false)}
        lang={lang}
        selectedVoiceId={preferredVoiceId}
        onSelectVoice={startWithVoice}
      />
    </>
  );
}
