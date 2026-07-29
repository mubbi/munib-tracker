import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import {
  isTtsAvailable,
  type ReadingTtsTarget,
  resolveReadingTtsTarget,
  resolveTtsVoice,
} from "@/lib/tts";
import { buildReadingTtsQueue } from "@/lib/tts-audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

type ReadingTtsButtonProps = {
  id: string;
  title: string;
  subtitle?: string;
  sourceHref?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
};

/**
 * Play / stop control that opens a voice-picker sheet, then queues TTS into the
 * mini-player (pause, speed, next/prev). Used when a reading card has no
 * recorded audio (e.g. custom adhkar).
 */
export function ReadingTtsButton({
  id,
  title,
  subtitle,
  sourceHref,
  arabic,
  transliteration,
  translation,
}: ReadingTtsButtonProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { locale } = usePreferences();
  const audio = useAudioPlayerContext();
  const quranPrefs = useQuranPrefs();
  const { updatePrefs } = useQuranActions();
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [openingSheet, setOpeningSheet] = useState(false);
  const [target, setTarget] = useState<ReadingTtsTarget | null>(null);
  const fallbackLang = localeToBcp47(locale);
  const sheetLang = target?.lang ?? fallbackLang;
  const preferredVoiceId = quranPrefs.ttsVoiceByLang?.[sheetLang];

  const trackPrefix = `${id}:tts:`;
  const isThisQueue = Boolean(audio.current?.id.startsWith(trackPrefix));
  const isActive = isThisQueue && !audio.isQueueFinished;

  const hasAnyText = Boolean(arabic?.trim() || transliteration?.trim() || translation?.trim());

  if (!hasAnyText) return null;

  const stop = () => {
    if (isThisQueue) audio.stop();
  };

  const openVoiceSheet = () => {
    void (async () => {
      setOpeningSheet(true);
      try {
        const resolved = await resolveReadingTtsTarget({
          arabic,
          transliteration,
          translation,
          fallbackLang,
        });
        if (!resolved) return;
        setTarget(resolved);
        setVoiceSheetOpen(true);
      } finally {
        setOpeningSheet(false);
      }
    })();
  };

  const startWithVoice = (voiceId: string | undefined) => {
    void (async () => {
      const available = await isTtsAvailable();
      if (!available) {
        Alert.alert(t("reading.listenUnavailableTitle"), t("reading.listenUnavailableBody"));
        return;
      }

      const resolved =
        target ??
        (await resolveReadingTtsTarget({
          arabic,
          transliteration,
          translation,
          fallbackLang,
        }));
      if (!resolved) return;

      const nextVoices = { ...(quranPrefs.ttsVoiceByLang ?? {}) };
      if (voiceId) nextVoices[resolved.lang] = voiceId;
      else delete nextVoices[resolved.lang];
      void updatePrefs({ ttsVoiceByLang: nextVoices });

      const voice = await resolveTtsVoice(resolved.lang, voiceId);
      const queue = buildReadingTtsQueue({
        id,
        title: title.trim() || t("reading.listenLabel"),
        subtitle,
        text: resolved.text,
        lang: resolved.lang,
        voice,
      });
      if (queue.length === 0) return;

      audio.play(queue, 0, sourceHref ? { sourceHref } : undefined);
    })();
  };

  return (
    <>
      <LabeledIconButton
        name={
          isActive
            ? { ios: "stop.fill", android: "stop", web: "stop" }
            : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }
        }
        label={isActive ? t("reading.listenStopLabel") : t("reading.listenLabel")}
        iconSize={16}
        tintColor={colors.accent}
        background={tokens.accentSoft}
        accessibilityLabel={isActive ? t("reading.listenStop") : t("reading.listen")}
        accessibilityHint={t("reading.listenHint")}
        accessibilityState={{ selected: isActive }}
        disabled={openingSheet}
        onPress={() => {
          if (isActive) stop();
          else openVoiceSheet();
        }}
      />
      <TtsVoiceSheet
        visible={voiceSheetOpen}
        onClose={() => setVoiceSheetOpen(false)}
        lang={sheetLang}
        selectedVoiceId={preferredVoiceId}
        onSelectVoice={startWithVoice}
      />
    </>
  );
}
