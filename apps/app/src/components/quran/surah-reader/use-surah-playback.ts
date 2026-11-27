import { resolveIntlLocale } from "@munib-tracker/shared/i18n";
import type { Ayah, Surah, UserPreferences } from "@munib-tracker/shared/types";
import { type RefObject, useCallback, useEffect, useMemo } from "react";
import type { QuranPrefs } from "@/db/repositories/quran-repository";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { normalizeRepeatPlan } from "@/lib/quran-repeat";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { useTtsVoice } from "@/lib/settings/tts-voice";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useQuranActions } from "@/stores/quran-store";

/**
 * Surah recitation from the ayah reader: builds the queue (reciter + optional
 * translation TTS), pushes the repeat plan to the player, swaps reciter
 * mid-session and resolves the per-ayah / whole-surah play-pause controls.
 * Every returned callback is memoised — they are props of the memoised ayah row.
 */
export function useSurahPlayback({
  surah,
  surahNumber,
  ayahs,
  translation,
  prefs,
  translationLocale,
  tv,
  currentAudioId,
  audioActiveKey,
  topVisibleAyahRef,
}: {
  surah: Surah | undefined;
  surahNumber: number;
  ayahs: Ayah[];
  /** Primary translation map — spoken by translation TTS when enabled. */
  translation: Record<string, string>;
  prefs: Pick<
    QuranPrefs,
    "preferredReciterDir" | "repeatMode" | "repeatRange" | "translationAudio"
  >;
  translationLocale: UserPreferences["translationLocale"];
  tv: boolean;
  currentAudioId: string | undefined;
  /** `currentAudioId` when it belongs to this surah. */
  audioActiveKey: string | undefined;
  /** Top-most ayah on screen — where "play surah" starts when nothing is playing. */
  topVisibleAyahRef: RefObject<number | null>;
}) {
  const audio = useAudioPlayerContext();
  // Stable methods only — never close callbacks over the whole context value
  // (it is a new object on duration / buffering ticks).
  const playAudio = audio.play;
  const toggleAudio = audio.toggle;
  const setRepeatPlan = audio.setRepeatPlan;
  const setTranslationAudio = audio.setTranslationAudio;
  const { setLastRead } = useQuranActions();

  const reciterDir = prefs.preferredReciterDir;
  const reciter = RECITERS.find((r) => r.dir === reciterDir) ?? RECITERS[0];
  const ttsLang = resolveIntlLocale(translationLocale);
  const ttsVoiceId = useTtsVoice(ttsLang);
  const repeatPlan = useMemo(
    () => normalizeRepeatPlan(prefs.repeatMode, prefs.repeatRange, ayahs.length),
    [prefs.repeatMode, prefs.repeatRange, ayahs.length],
  );

  useEffect(() => {
    setRepeatPlan(repeatPlan);
    // TV has no speech synthesis — never queue translation TTS there.
    setTranslationAudio(tv ? "off" : (prefs.translationAudio ?? "off"));
  }, [setRepeatPlan, setTranslationAudio, repeatPlan, prefs.translationAudio, tv]);

  const playFrom = useCallback(
    (index: number, nextReciterDir = reciterDir) => {
      if (!surah) return;
      const tracks = ayahTracks(nextReciterDir, surah.nameTransliteration, surahNumber, ayahs, {
        translations: translation,
        lang: ttsLang,
        voice: ttsVoiceId,
      });
      playAudio(tracks, index, {
        sourceHref: `/quran/${surahNumber}`,
      });
      void setLastRead(surahNumber, index + 1, { isAudio: true });
    },
    [
      playAudio,
      ayahs,
      reciterDir,
      setLastRead,
      surah,
      surahNumber,
      translation,
      ttsLang,
      ttsVoiceId,
    ],
  );

  /** Persist the choice and, if this surah is in the player, swap URIs mid-session. */
  const handleReciterSelect = useCallback(
    (id: string) => {
      // Reader controls are shortcuts to Settings › Qur'an (one write path, §4.5.2).
      void updateQuranPrefs({ preferredReciterDir: id });
      if (id === reciterDir) return;
      if (!currentAudioId?.startsWith(`${surahNumber}:`)) return;
      const ayahNum = Number(currentAudioId.slice(currentAudioId.indexOf(":") + 1));
      const index = ayahs.findIndex((a) => a.ayah === ayahNum);
      if (index < 0) return;
      playFrom(index, id);
    },
    [currentAudioId, ayahs, playFrom, reciterDir, surahNumber],
  );

  /** Per-ayah control: pause/resume when this ayah is already current; otherwise start it. */
  const playOrToggleAyah = useCallback(
    (index: number) => {
      const ayah = ayahs[index];
      if (!ayah) return;
      if (currentAudioId === `${surahNumber}:${ayah.ayah}`) {
        toggleAudio();
        return;
      }
      playFrom(index);
    },
    [ayahs, currentAudioId, playFrom, surahNumber, toggleAudio],
  );

  /** Pause/resume this surah's audio, or start it from the top-most ayah on screen. */
  const playPauseSurah = useCallback(() => {
    if (audioActiveKey != null) {
      toggleAudio();
      return;
    }
    const top = topVisibleAyahRef.current ?? 1;
    playFrom(Math.max(0, Math.min(ayahs.length - 1, top - 1)));
  }, [audioActiveKey, ayahs.length, playFrom, toggleAudio, topVisibleAyahRef]);

  return {
    reciterDir,
    reciter,
    ttsLang,
    ttsVoiceId,
    repeatPlan,
    playFrom,
    handleReciterSelect,
    playOrToggleAyah,
    playPauseSurah,
  };
}
