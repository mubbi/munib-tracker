import type { ZikrItem } from "@munib-tracker/shared/types";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";

import { contentAudioTrack } from "@/lib/audio-tracks";
import { DEFAULT_RECITER_DIR, singleAyahTrack } from "@/lib/quran-audio";
import { getSurahByNumber } from "@/lib/quran-meta";
import { zikrQuranRanges } from "@/lib/zikr-quran";
import {
  AudioContext,
  type AudioContextValue,
  SSR_AUDIO_CONTEXT,
} from "@/providers/audio-player-context";
import type { AudioTrack } from "@/providers/audio-player-types";
import { useQuranPrefs } from "@/stores/quran-store";

type AudioZikr = Pick<ZikrItem, "id" | "title" | "audioUri">;

/**
 * The recitation a zikr can play through the shared player: its own recorded
 * `audioUri` (some adhkar), or — for Qur'anic adhkar (Ayat al-Kursi, the Quls)
 * — one everyayah track per ayah of its range(s) in the user's reciter. Empty
 * when the zikr has no audio, so callers hide Play instead of implying any.
 */
export function zikrAudioTracks(item: AudioZikr, reciterDir: string): AudioTrack[] {
  const ranges = zikrQuranRanges(item.id);
  if (ranges) {
    const tracks: AudioTrack[] = [];
    for (const range of ranges) {
      const surahName = getSurahByNumber(range.surah)?.nameTransliteration ?? item.title;
      for (let ayah = range.ayahFrom; ayah <= range.ayahTo; ayah += 1) {
        tracks.push(singleAyahTrack(reciterDir, surahName, range.surah, ayah));
      }
    }
    return tracks;
  }
  const own = contentAudioTrack(item as ZikrItem);
  return own ? [own] : [];
}

/** Whether a zikr has any recitation to play (list rows / dock Play). */
export function zikrHasAudio(item: Pick<ZikrItem, "id" | "audioUri">): boolean {
  return Boolean(item.audioUri) || zikrQuranRanges(item.id) != null;
}

export type ZikrAudioControl = {
  /** The zikr has a recitation (otherwise hide Play). */
  available: boolean;
  /** This zikr's recitation is playing (or loading) right now. */
  playing: boolean;
  /** Play from the start, or pause / resume this zikr's recitation. */
  toggle: () => void;
  /** Stop it if it is the one in the player. */
  stop: () => void;
};

/** The shared player, or an idle stand-in where none is mounted (embeds, SSR, tests). */
function useAudioPlayer(): AudioContextValue {
  return useContext(AudioContext) ?? SSR_AUDIO_CONTEXT;
}

function useReciterDir(): string {
  return useQuranPrefs().preferredReciterDir || DEFAULT_RECITER_DIR;
}

/**
 * Play / pause one zikr's recitation through the shared audio player. Moving
 * to another zikr (a new `item`) stops the previous one's recitation, so a
 * guided session never reads one zikr aloud while another is on screen.
 */
export function useZikrAudio(
  item: AudioZikr | null | undefined,
  sourceHref?: string,
): ZikrAudioControl {
  const audio = useAudioPlayer();
  const reciterDir = useReciterDir();
  const tracks = useMemo(() => (item ? zikrAudioTracks(item, reciterDir) : []), [item, reciterDir]);
  // Keyed by the track ids, so a re-created item object for the same zikr is not a "change".
  const idsKey = tracks.map((track) => track.id).join("|");
  const ids = useMemo(() => new Set(idsKey ? idsKey.split("|") : []), [idsKey]);
  const mine = audio.current != null && ids.has(audio.current.id);
  const playing = mine && (audio.isPlaying || audio.isBuffering) && !audio.isQueueFinished;

  const audioRef = useRef(audio);
  audioRef.current = audio;
  const idsRef = useRef(ids);
  idsRef.current = ids;

  const stop = useCallback(() => {
    const live = audioRef.current;
    if (live.current && idsRef.current.has(live.current.id)) live.stop();
  }, []);

  const toggle = useCallback(() => {
    const live = audioRef.current;
    if (tracks.length === 0) return;
    if (live.current && idsRef.current.has(live.current.id) && !live.isQueueFinished) {
      live.toggle();
      return;
    }
    live.play(tracks, 0, sourceHref ? { sourceHref } : undefined);
  }, [sourceHref, tracks]);

  // A different zikr on screen: stop the one that was reading (its own track ids,
  // captured per zikr — the refs already point at the next zikr by cleanup time).
  useEffect(
    () => () => {
      const live = audioRef.current;
      if (live.current && ids.has(live.current.id)) live.stop();
    },
    [ids],
  );

  return { available: tracks.length > 0, playing, toggle, stop };
}

/**
 * List variant: which row's zikr is playing, and play / pause by item. One
 * hook for the whole list keeps memoized rows cheap (they get plain props).
 */
export function useZikrListAudio(sourceHref?: string): {
  playingId: string | null;
  toggle: (item: AudioZikr) => void;
} {
  const audio = useAudioPlayer();
  const reciterDir = useReciterDir();
  const owner = useRef<{ id: string; trackIds: Set<string> } | null>(null);
  const active = audio.isPlaying || audio.isBuffering;
  const playingId =
    active &&
    !audio.isQueueFinished &&
    audio.current &&
    owner.current?.trackIds.has(audio.current.id)
      ? owner.current.id
      : null;

  const audioRef = useRef(audio);
  audioRef.current = audio;

  const toggle = useCallback(
    (item: AudioZikr) => {
      const live = audioRef.current;
      const current = owner.current;
      if (current?.id === item.id && live.current && current.trackIds.has(live.current.id)) {
        if (!live.isQueueFinished) {
          live.toggle();
          return;
        }
      }
      const tracks = zikrAudioTracks(item, reciterDir);
      if (tracks.length === 0) return;
      owner.current = { id: item.id, trackIds: new Set(tracks.map((track) => track.id)) };
      live.play(tracks, 0, sourceHref ? { sourceHref } : undefined);
    },
    [reciterDir, sourceHref],
  );

  return { playingId, toggle };
}
