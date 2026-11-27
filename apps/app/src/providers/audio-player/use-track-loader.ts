import type { AudioPlayer } from "expo-audio";
import { type RefObject, useCallback } from "react";
import { Platform } from "react-native";

import {
  invalidateCachedAudioUri,
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  peekNativeCachedAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
import {
  isLocalPlaybackUri,
  preloadTrackUri,
  resolveTrackSource,
  waitForPlayerReady,
  warmUpcomingTrackUris,
} from "@/lib/audio-track-source";
import { isTtsPlaybackTrack } from "@/lib/tts-audio-tracks";
import type { AudioTrack } from "@/providers/audio-player-types";

import type { DoubleBufferedPlayers } from "./use-double-buffered-players";

/**
 * How long a local (file:// / blob:) source may take to report `isLoaded` before
 * we treat the cache entry as corrupt and fall back to the remote URL.
 */
const LOCAL_SOURCE_READY_MS = 4000;

type PlaybackSource = number | { uri: string };

/**
 * Loads expo-audio sources into the double-buffered players: `stageNext`
 * preloads the idle player for a gapless hand-off; `loadFileTrack` starts a
 * file / remote track on the active player, preferring a local cache copy.
 */
export function useTrackLoader({
  engine,
  applyRateVolume,
  syncLockScreenForTrack,
  pendingSeekRef,
}: {
  engine: DoubleBufferedPlayers;
  applyRateVolume: (player: AudioPlayer) => void;
  syncLockScreenForTrack: (
    player: AudioPlayer,
    track: AudioTrack,
    trackIndex: number,
    tracks: AudioTrack[],
  ) => void;
  pendingSeekRef: RefObject<number | null>;
}) {
  const { playersRef, activeSlotRef, stagedTrackIdRef, preloadTokenRef, playbackEpochRef } = engine;
  const { getIdleSlot } = engine;

  // Stage the next track into the idle (inactive) player and warm the clips
  // after it into the byte cache. Staging = load the source but stay paused, so
  // the finish handler can swap to an already-decoded player with no gap.
  const stageNext = useCallback(
    (tracks: AudioTrack[], nextIndex: number) => {
      const idle = getIdleSlot();
      const track = tracks[nextIndex];

      // Warm this clip plus the next few so their bytes are local before staging.
      warmUpcomingTrackUris(tracks, nextIndex);

      if (!track || isTtsPlaybackTrack(track)) {
        stagedTrackIdRef.current[idle] = null;
        return;
      }
      if (stagedTrackIdRef.current[idle] === track.id) return; // already staged & ready

      const token = ++preloadTokenRef.current;
      stagedTrackIdRef.current[idle] = null; // stale until loaded
      void (async () => {
        let playbackSource: PlaybackSource;
        if (track.source != null) {
          playbackSource = track.source;
        } else if (!isAudioLocalCacheEnabled()) {
          playbackSource = { uri: track.uri };
        } else if (Platform.OS === "web") {
          // Prefer the session blob URL so the idle player does not re-buffer
          // from the network on seamless auto-advance.
          const peek = peekCachedAudioUri(track.uri);
          const uri = peek ?? (await resolveCachedAudioUri(track.uri).catch(() => track.uri));
          await preloadTrackUri(uri);
          playbackSource = { uri };
        } else {
          playbackSource = await resolveTrackSource(track);
        }
        if (token !== preloadTokenRef.current) return;
        const slot = getIdleSlot();
        const p = playersRef.current[slot];
        try {
          p.replace(playbackSource);
          p.pause();
          applyRateVolume(p);
          const ready = await waitForPlayerReady(p);
          if (token !== preloadTokenRef.current) return;
          if (!ready) {
            stagedTrackIdRef.current[slot] = null;
            return;
          }
          stagedTrackIdRef.current[slot] = track.id;
        } catch {
          stagedTrackIdRef.current[slot] = null;
        }
      })();
    },
    [getIdleSlot, applyRateVolume, playersRef, stagedTrackIdRef, preloadTokenRef],
  );

  /**
   * Start `tracks[startIndex]` (a file / remote track) on the active player.
   * `playbackEpoch` is the load's epoch; a newer `playIndex` makes it stale.
   */
  const loadFileTrack = useCallback(
    (tracks: AudioTrack[], startIndex: number, playbackEpoch: number) => {
      const track = tracks[startIndex];
      if (!track) return;

      if (track.clipStart != null && track.clipStart > 0) {
        pendingSeekRef.current = track.clipStart;
      }

      const isStale = () => playbackEpoch !== playbackEpochRef.current;
      const slotAtStart = activeSlotRef.current;

      const startPlayback = (resolved: PlaybackSource) => {
        if (isStale()) return false;
        try {
          const player = playersRef.current[activeSlotRef.current];
          player.replace(resolved);
          applyRateVolume(player);
          player.play();
          stagedTrackIdRef.current[activeSlotRef.current] = track.id;
          syncLockScreenForTrack(player, track, startIndex, tracks);
          // Stage the immediate next track into the idle player for a gapless
          // hand-off, and warm the ones after it.
          stageNext(tracks, startIndex + 1);
          return true;
        } catch {
          return false;
        }
      };

      /** Whether the slot that started this load still holds this track. */
      const stillOwnsSlot = () =>
        !isStale() &&
        activeSlotRef.current === slotAtStart &&
        stagedTrackIdRef.current[slotAtStart] === track.id;

      /**
       * Prefer a local cache hit, but if the engine never reports loaded, drop
       * the bad entry and stream the remote URL. Without this, a truncated or
       * undecodable cache file pins the UI on "Buffering…" until next/prev.
       */
      const startPlaybackPreferringLocal = (localUri: string) => {
        if (!startPlayback({ uri: localUri })) {
          startPlayback({ uri: track.uri });
          return;
        }
        if (!isLocalPlaybackUri(localUri) || !track.uri.startsWith("http")) return;
        void (async () => {
          const player = playersRef.current[slotAtStart];
          const ready = await waitForPlayerReady(player, LOCAL_SOURCE_READY_MS);
          // Slot swapped or a newer track already owns this player — do not
          // tear down whatever is playing now with a stale remote fallback.
          if (!stillOwnsSlot()) return;
          if (ready) return;
          try {
            await invalidateCachedAudioUri(track.uri);
          } catch {
            // Best-effort — still try the remote URL.
          }
          if (!stillOwnsSlot()) return;
          startPlayback({ uri: track.uri });
        })();
      };

      if (track.source != null) {
        if (startPlayback(track.source)) return;
        // Bundled asset rejected — fall through to remote uri when present.
        if (!track.uri) return;
      }

      // Prefer an already-local copy; otherwise stream the remote URL immediately
      // and warm the cache in the background. Waiting for a full download before
      // `play()` left Learn → Adhan stuck on "Buffering…" whenever the native
      // cache path was invalid or the download was slow.
      if (!isAudioLocalCacheEnabled()) {
        startPlayback({ uri: track.uri });
        return;
      }

      if (Platform.OS === "web") {
        const localUri = peekCachedAudioUri(track.uri);
        if (localUri) {
          startPlaybackPreferringLocal(localUri);
          return;
        }
        startPlayback({ uri: track.uri });
        void resolveCachedAudioUri(track.uri).catch(() => {});
        return;
      }

      void (async () => {
        try {
          const localUri = await peekNativeCachedAudioUri(track.uri);
          if (isStale()) return;
          if (localUri) {
            startPlaybackPreferringLocal(localUri);
            return;
          }
        } catch {
          // Fall through to streaming.
        }
        if (isStale()) return;
        startPlayback({ uri: track.uri });
        void resolveCachedAudioUri(track.uri).catch(() => {});
      })();
    },
    [
      applyRateVolume,
      stageNext,
      syncLockScreenForTrack,
      pendingSeekRef,
      playbackEpochRef,
      activeSlotRef,
      playersRef,
      stagedTrackIdRef,
    ],
  );

  return { stageNext, loadFileTrack };
}
