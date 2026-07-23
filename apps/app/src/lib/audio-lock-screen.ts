import type { AudioMetadata } from "expo-audio";
import { type AudioPlayer, requestNotificationPermissionsAsync } from "expo-audio";
import { Image, Platform } from "react-native";

import i18n from "@/i18n";

import { isTV } from "@/lib/platform/is-tv";

const APP_ICON = require("../../assets/images/icon.png");

export type LockScreenTrackInfo = {
  title: string;
  subtitle?: string;
  playlistPrimary?: string;
  /** When set, lock screen shows one grouped track (e.g. full surah) instead of per-ayah. */
  lockScreenGroupId?: string;
};

export type LockScreenQueueContext = {
  queueIndex: number;
  queueLength: number;
  /** Elapsed seconds across the whole queue (for grouped Qur'an recitation). */
  queuePosition?: number;
  /** Total seconds across the whole queue. */
  queueDuration?: number;
};

let cachedArtworkUrl: string | undefined;
let androidNotificationPermissionRequested = false;

/** True when track id looks like a Qur'an ayah reference (`surah:ayah`). */
function isQuranAyahTrackId(id?: string): boolean {
  return id != null && /^\d+:\d+$/.test(id);
}

/** Resolve the bundled app icon to a URI the native lock-screen APIs can load. */
export function getLockScreenArtworkUrl(): string | undefined {
  if (cachedArtworkUrl) return cachedArtworkUrl;
  const resolved = Image.resolveAssetSource(APP_ICON);
  if (resolved?.uri) cachedArtworkUrl = resolved.uri;
  return cachedArtworkUrl;
}

/** Build Now Playing / media-notification metadata for a track. */
export function buildLockScreenMetadata(
  track: LockScreenTrackInfo,
  queue?: LockScreenQueueContext,
): AudioMetadata {
  const grouped =
    track.lockScreenGroupId != null &&
    queue != null &&
    queue.queueLength > 1 &&
    queue.queueDuration != null &&
    queue.queueDuration > 0;

  let artist = track.subtitle?.trim() || track.playlistPrimary?.trim() || i18n.t("common.appName");
  let albumTitle = i18n.t("player.nowPlaying");

  if (grouped) {
    // Present the full surah (or other grouped queue) as a single lock-screen item.
    albumTitle = i18n.t("player.nowPlaying");
    if (track.subtitle && !/^ayah\s/i.test(track.subtitle)) {
      artist = track.subtitle;
    }
  } else if (queue != null && queue.queueLength > 1) {
    albumTitle = i18n.t("player.trackOf", {
      current: queue.queueIndex + 1,
      total: queue.queueLength,
    });
  }

  const metadata: AudioMetadata = {
    title: track.title,
    artist,
    albumTitle,
  };
  const artworkUrl = getLockScreenArtworkUrl();
  if (artworkUrl) metadata.artworkUrl = artworkUrl;
  return metadata;
}

export type LockScreenControlOptions = {
  showSeekForward?: boolean;
  showSeekBackward?: boolean;
};

/** Register the active player with OS lock-screen / notification media controls. */
export function activateLockScreenControls(
  player: AudioPlayer,
  track: LockScreenTrackInfo,
  queue: LockScreenQueueContext,
  trackId?: string,
): void {
  if (Platform.OS === "web" || isTV()) return;
  const hasQueue = queue.queueLength > 1;
  const groupedQuran = hasQueue && isQuranAyahTrackId(trackId);
  const trackInfo: LockScreenTrackInfo = groupedQuran
    ? { ...track, lockScreenGroupId: trackId?.split(":")[0] }
    : track;

  const options: LockScreenControlOptions = {
    // expo-audio 57 maps skip ±10s to next/prev on web; on native this at least
    // enables adjacent transport buttons when OS track skip is unavailable.
    showSeekForward: hasQueue,
    showSeekBackward: hasQueue,
  };

  try {
    player.setActiveForLockScreen(true, buildLockScreenMetadata(trackInfo, queue), options);
  } catch {
    // Non-fatal: in-app playback still works.
  }
}

/** Refresh title/artist on the lock screen when the track changes on the same player. */
export function updateLockScreenControls(
  player: AudioPlayer,
  track: LockScreenTrackInfo,
  queue: LockScreenQueueContext,
  trackId?: string,
): void {
  if (Platform.OS === "web" || isTV()) return;
  const hasQueue = queue.queueLength > 1;
  const groupedQuran = hasQueue && isQuranAyahTrackId(trackId);
  const trackInfo: LockScreenTrackInfo = groupedQuran
    ? { ...track, lockScreenGroupId: trackId?.split(":")[0] }
    : track;

  try {
    player.updateLockScreenMetadata(buildLockScreenMetadata(trackInfo, queue));
  } catch {
    // Non-fatal
  }
}

/** Tear down lock-screen controls when playback stops. */
export function deactivateLockScreenControls(player: AudioPlayer): void {
  if (Platform.OS === "web" || isTV()) return;
  try {
    player.setActiveForLockScreen(false);
  } catch {
    try {
      player.clearLockScreenControls();
    } catch {
      // ignore
    }
  }
}

/**
 * Android 13+ needs notification permission for the media playback notification.
 * Only prompts when status is still undetermined — never at cold start, and never
 * after the user already allowed/denied during onboarding or settings.
 */
export async function ensureAndroidMediaNotificationPermission(): Promise<void> {
  if (Platform.OS !== "android" || isTV() || androidNotificationPermissionRequested) return;
  androidNotificationPermissionRequested = true;
  try {
    const { readNotificationPermissionUiState, requestNotificationPermission } = await import(
      "@/lib/notifications/permissions"
    );
    const status = await readNotificationPermissionUiState();
    if (status === "granted" || status === "denied") return;
    await requestNotificationPermission();
  } catch {
    // Fallback for environments where expo-notifications isn't available yet.
    try {
      await requestNotificationPermissionsAsync();
    } catch {
      // Playback may still work; controls can be limited without permission.
    }
  }
}
