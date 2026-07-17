import { usePathname } from "expo-router";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { localeToBcp47 } from "@/lib/locale-bcp47";
import { isTtsAvailable, resolveTtsVoice } from "@/lib/tts";
import { buildReadingTtsQueue } from "@/lib/tts-audio-tracks";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

type SegmentEntry = { order: number; text: string };

type LearnTtsContextValue = {
  /** Register (or update) a named text segment for listen-aloud. */
  setSegment: (id: string, text: string) => void;
  /** Remove a segment when its owner unmounts. */
  clearSegment: (id: string) => void;
  /** Optional explicit full article text that replaces auto-collected segments. */
  setOverrideText: (text: string | null) => void;
  /** True while this screen's learn TTS queue is loaded in the mini-player. */
  speaking: boolean;
  hasText: boolean;
  /** BCP-47 language used for voice filtering and speech. */
  lang: string;
  /** Preferred voice id for {@link lang}, if saved. */
  preferredVoiceId?: string;
  /** Persist a voice preference for the current lang, then play via mini-player. */
  startWithVoice: (voiceId: string | undefined) => void;
  /** Stop in-progress learn TTS (closes the mini-player queue). */
  stop: () => void;
};

const LearnTtsContext = createContext<LearnTtsContextValue | null>(null);

function joinSegments(map: Map<string, SegmentEntry>): string {
  return [...map.values()]
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

/** Provider scoped to one learn screen (mounted by `LearnReadingChrome`). */
export function LearnTtsProvider({
  listenText,
  children,
}: {
  /** When set, speaks this string instead of auto-registered body segments. */
  listenText?: string | null;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const prefs = usePreferences();
  const quranPrefs = useQuranPrefs();
  const { updatePrefs } = useQuranActions();
  const audio = useAudioPlayerContext();
  const [segments, setSegments] = useState(() => new Map<string, SegmentEntry>());
  const [overrideText, setOverrideTextState] = useState<string | null>(null);
  const orderRef = useRef(0);
  const sessionId = useId().replace(/:/g, "");
  const queueId = `learn-${sessionId}`;
  const trackPrefix = `${queueId}:tts:`;

  const setSegment = useCallback((id: string, text: string) => {
    setSegments((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      const trimmed = text.trim();
      if (!trimmed) {
        if (!existing) return prev;
        next.delete(id);
        return next;
      }
      if (existing) {
        if (existing.text === trimmed) return prev;
        next.set(id, { order: existing.order, text: trimmed });
      } else {
        orderRef.current += 1;
        next.set(id, { order: orderRef.current, text: trimmed });
      }
      return next;
    });
  }, []);

  const clearSegment = useCallback((id: string) => {
    setSegments((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setOverrideText = useCallback((text: string | null) => {
    setOverrideTextState(text?.trim() ? text.trim() : null);
  }, []);

  useEffect(() => {
    setOverrideTextState(listenText?.trim() ? listenText.trim() : null);
  }, [listenText]);

  const resolvedText = useMemo(() => {
    if (overrideText) return overrideText;
    return joinSegments(segments);
  }, [overrideText, segments]);

  const hasText = resolvedText.length > 0;
  const lang = localeToBcp47(prefs.locale);
  const preferredVoiceId = quranPrefs.ttsVoiceByLang?.[lang];
  const isThisQueue = Boolean(audio.current?.id.startsWith(trackPrefix));
  const speaking = isThisQueue && !audio.isQueueFinished;

  const stop = useCallback(() => {
    if (isThisQueue) audio.stop();
  }, [audio, isThisQueue]);

  const startWithVoice = useCallback(
    (voiceId: string | undefined) => {
      void (async () => {
        const text = resolvedText;
        if (!text) return;

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
        const queue = buildReadingTtsQueue({
          id: queueId,
          title: t("reading.listenLabel"),
          text,
          lang,
          voice,
        });
        if (queue.length === 0) return;

        const sourceHref = pathname?.startsWith("/")
          ? pathname
          : pathname
            ? `/${pathname}`
            : undefined;
        audio.play(queue, 0, sourceHref ? { sourceHref } : undefined);
      })();
    },
    [audio, lang, pathname, queueId, quranPrefs.ttsVoiceByLang, resolvedText, t, updatePrefs],
  );

  const value = useMemo(
    () => ({
      setSegment,
      clearSegment,
      setOverrideText,
      speaking,
      hasText,
      lang,
      preferredVoiceId,
      startWithVoice,
      stop,
    }),
    [
      setSegment,
      clearSegment,
      setOverrideText,
      speaking,
      hasText,
      lang,
      preferredVoiceId,
      startWithVoice,
      stop,
    ],
  );

  return <LearnTtsContext.Provider value={value}>{children}</LearnTtsContext.Provider>;
}

export function useLearnTts(): LearnTtsContextValue | null {
  return useContext(LearnTtsContext);
}

/**
 * Registers prose for the learn listen button. Safe outside the provider (no-op).
 * Pass a string or string array (paragraphs); empty values clear the segment.
 */
export function useRegisterLearnListenText(text: string | string[] | null | undefined): void {
  const ctx = useLearnTts();
  const id = useId();
  const setSegment = ctx?.setSegment;
  const clearSegment = ctx?.clearSegment;
  const joined = useMemo(() => {
    if (text == null) return "";
    if (Array.isArray(text))
      return text
        .map((p) => p.trim())
        .filter(Boolean)
        .join("\n\n");
    return text.trim();
  }, [text]);

  useEffect(() => {
    if (!setSegment || !clearSegment) return;
    if (joined) setSegment(id, joined);
    else clearSegment(id);
    return () => clearSegment(id);
  }, [setSegment, clearSegment, id, joined]);
}
