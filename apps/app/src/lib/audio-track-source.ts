/**
 * Track → playable source resolution for the global audio player
 * (`providers/audio-player-provider.tsx`): local-cache preference, expo-audio
 * preload warming, and the loaded-state poll used by the double-buffer.
 */
import { type AudioPlayer, preload as preloadExpoAudio } from "expo-audio";
import { Platform } from "react-native";
import {
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  prefetchAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
import type { AudioTrack } from "@/providers/audio-player-types";

/**
 * How many upcoming tracks to warm into the byte cache alongside the current
 * one. The very next track is fully staged into the idle player (see
 * double-buffering in the provider); the rest are only fetched into the cache so
 * their bytes are local by the time they are staged.
 */
export const PREFETCH_AHEAD = 3;

/** True when `uri` is a local playback source (not http(s)). */
export function isLocalPlaybackUri(uri: string): boolean {
  return (
    uri.startsWith("file:") ||
    uri.startsWith("blob:") ||
    uri.startsWith("content:") ||
    uri.startsWith("asset:") ||
    uri.startsWith("/")
  );
}

/**
 * Resolve a track to a playable source, preferring a fully-local copy so the
 * staged player can start instantly with no network round-trip. On web this
 * returns a `blob:` object URL (downloading the bytes first if needed); on
 * native a cached `file://` path. Falls back to the remote URL on any failure.
 */
export async function resolveTrackSource(track: AudioTrack): Promise<number | { uri: string }> {
  if (track.source != null) return track.source;
  if (Platform.OS === "web") {
    const local = peekCachedAudioUri(track.uri);
    if (local) return { uri: local };
  }
  try {
    const uri = await resolveCachedAudioUri(track.uri);
    return { uri };
  } catch {
    return { uri: track.uri };
  }
}

/**
 * Kick off expo-audio's own preload for a remote clip. The web build of
 * `preload()` returns `void` (fire-and-forget) while native returns a Promise,
 * so we can't blindly `.catch()` the result — normalize both here.
 */
export function preloadTrackUri(uri: string): Promise<void> {
  try {
    const result = preloadExpoAudio({ uri }) as Promise<void> | void;
    return result && typeof result.then === "function" ? result.catch(() => {}) : Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

/** Warm the byte cache (and expo-audio's web preload cache) for upcoming clips. */
export function warmUpcomingTrackUris(tracks: AudioTrack[], fromIndex: number): void {
  if (!isAudioLocalCacheEnabled()) return;
  const end = Math.min(fromIndex + PREFETCH_AHEAD + 1, tracks.length);
  for (let i = fromIndex; i < end; i++) {
    const track = tracks[i];
    if (!track || track.source != null || track.ttsPlayback || !track.uri) continue;
    prefetchAudioUri(track.uri);
    void preloadTrackUri(track.uri);
  }
}

/** Poll until the player's media element has fired `loadeddata` (or timeout). */
export async function waitForPlayerReady(player: AudioPlayer, timeoutMs = 12000): Promise<boolean> {
  try {
    if (player.isLoaded) return true;
  } catch {
    // player not ready
  }
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 25));
    try {
      if (player.isLoaded) return true;
    } catch {
      // player not ready
    }
  }
  try {
    return player.isLoaded;
  } catch {
    return false;
  }
}
