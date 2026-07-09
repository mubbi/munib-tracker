import type { AudioMetadata } from "expo-audio";
import { type AudioPlayer, requestNotificationPermissionsAsync } from "expo-audio";
import { Image, Platform } from "react-native";

import i18n from "@/i18n";

const APP_ICON = require("../../assets/images/icon.png");

export type LockScreenTrackInfo = {
  title: string;
  subtitle?: string;
  playlistPrimary?: string;
};

let cachedArtworkUrl: string | undefined;
let androidNotificationPermissionRequested = false;

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
  queueIndex?: number,
  queueLength?: number,
): AudioMetadata {
  const artist =
    track.subtitle?.trim() || track.playlistPrimary?.trim() || i18n.t("common.appName");
  let albumTitle = i18n.t("player.nowPlaying");
  if (queueLength != null && queueLength > 1 && queueIndex != null) {
    albumTitle = i18n.t("player.trackOf", { current: queueIndex + 1, total: queueLength });
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

/** Register the active player with OS lock-screen / notification media controls. */
export function activateLockScreenControls(
  player: AudioPlayer,
  track: LockScreenTrackInfo,
  queueIndex: number,
  queueLength: number,
): void {
  if (Platform.OS === "web") return;
  try {
    player.setActiveForLockScreen(true, buildLockScreenMetadata(track, queueIndex, queueLength), {
      showSeekForward: false,
      showSeekBackward: false,
    });
  } catch {
    // Non-fatal: in-app playback still works.
  }
}

/** Refresh title/artist on the lock screen when the track changes on the same player. */
export function updateLockScreenControls(
  player: AudioPlayer,
  track: LockScreenTrackInfo,
  queueIndex: number,
  queueLength: number,
): void {
  if (Platform.OS === "web") return;
  try {
    player.updateLockScreenMetadata(buildLockScreenMetadata(track, queueIndex, queueLength));
  } catch {
    // Non-fatal
  }
}

/** Tear down lock-screen controls when playback stops. */
export function deactivateLockScreenControls(player: AudioPlayer): void {
  if (Platform.OS === "web") return;
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
 * Safe to call repeatedly; only prompts once per app session.
 */
export async function ensureAndroidMediaNotificationPermission(): Promise<void> {
  if (Platform.OS !== "android" || androidNotificationPermissionRequested) return;
  androidNotificationPermissionRequested = true;
  try {
    await requestNotificationPermissionsAsync();
  } catch {
    // Playback may still work; controls can be limited without permission.
  }
}
