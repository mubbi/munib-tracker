import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { captureAppException } from "@/lib/sentry";
import { setTtsVoice, useTtsVoice } from "@/lib/settings/tts-voice";
import {
  isTtsAvailable,
  type ReadingTtsTarget,
  resolveReadingTtsTarget,
  resolveTtsVoice,
} from "@/lib/tts";
import { buildReadingTtsQueue } from "@/lib/tts-audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

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
  const toast = useToast();
  const { colors, tokens } = useThemeTokens();
  const { locale } = usePreferences();
  const audio = useAudioPlayerContext();
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [openingSheet, setOpeningSheet] = useState(false);
  const [target, setTarget] = useState<ReadingTtsTarget | null>(null);
  const fallbackLang = localeToBcp47(locale);
  const sheetLang = target?.lang ?? fallbackLang;
  const preferredVoiceId = useTtsVoice(sheetLang);

  const trackPrefix = `${id}:tts:`;
  const isThisQueue = Boolean(audio.current?.id.startsWith(trackPrefix));
  const isActive = isThisQueue && !audio.isQueueFinished;

  const hasAnyText = Boolean(arabic?.trim() || transliteration?.trim() || translation?.trim());

  // TV builds have no speech synthesis (expo-speech is stubbed) — hide rather
  // than offer a control that can only show "unavailable".
  if (!hasAnyText || isTV()) return null;

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

  const startSpeaking = async (voiceId: string | undefined) => {
    const available = await isTtsAvailable();
    if (!available) {
      toast.info(t("reading.listenUnavailableTitle"), t("reading.listenUnavailableBody"));
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

    setTtsVoice(resolved.lang, voiceId).catch((error: unknown) => {
      captureAppException(error, { tags: { area: "audio", phase: "tts-voice-save" } });
    });

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
  };

  const startWithVoice = (voiceId: string | undefined) => {
    startSpeaking(voiceId).catch((error: unknown) => {
      // An escaped rejection reaches the root boundary ("Something went wrong").
      captureAppException(error, { tags: { area: "audio", phase: "reading-tts-start" } });
      toast.info(t("reading.listenUnavailableTitle"), t("reading.listenUnavailableBody"));
    });
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
