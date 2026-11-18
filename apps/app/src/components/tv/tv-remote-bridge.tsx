import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AppState, BackHandler, Platform } from "react-native";

import {
  isTvKeyDown,
  isTvNextEvent,
  isTvPlayPauseEvent,
  isTvPreviousEvent,
  setTvMenuKeyEnabled,
  type TvHwEvent,
  useTvEventHandler,
} from "@/hooks/use-tv-event-handler";
import { isTV } from "@/lib/platform/is-tv";
import {
  isTvRailExpanded,
  subscribeTvRailExpanded,
  tryExpandTvRailOnBack,
} from "@/lib/tv/tv-rail-back";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

/**
 * TV remote bridge. Mount once under AudioPlayerProvider.
 *
 * Back / Menu ladder (Android TV quality TV-DB, tvOS HIG "Remotes"):
 *   1. nested stack → pop
 *   2. focus in tab content → expand + focus the side rail
 *   3. rail focused on a tab root → hand Back/Menu to the system so the user
 *      lands on the TV home screen. No exit confirmation (Android TV guidance
 *      explicitly forbids it; tvOS requires Menu at root to go Home).
 *
 * On tvOS the Menu key is only captured while there is something in-app to go
 * back to; at the root it is released so the next press reaches the system
 * (react-native-tvos' BackHandler cannot exit the app itself).
 *
 * Media keys: Play/Pause toggles audio; Fast-forward / Rewind (and Next /
 * Previous) step through the audio queue (per-ayah for Qur'an recitation).
 * Fire TV's Menu key is the options key, not Back — it is ignored on Android.
 */
export function TvRemoteBridge() {
  const tv = isTV();
  const router = useRouter();
  const pathname = usePathname();
  const audio = useAudioPlayerContext();
  const audioRef = useRef(audio);
  const backLockUntilRef = useRef(0);
  audioRef.current = audio;

  const railExpanded = useSyncExternalStore(
    subscribeTvRailExpanded,
    isTvRailExpanded,
    isTvRailExpanded,
  );

  // `router.canDismiss()` is imperative — refresh it on every navigation via an
  // effect (React Compiler would otherwise memoize a render-time call).
  const [inNestedStack, setInNestedStack] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the change signal for router.canDismiss()
  useEffect(() => {
    if (!tv) return;
    setInNestedStack(router.canDismiss());
  }, [tv, router, pathname]);
  const passBackToSystem = tv && railExpanded && !inNestedStack;

  // tvOS: capture Menu only when Back means something in-app.
  useEffect(() => {
    if (!tv || Platform.OS !== "ios") return;
    setTvMenuKeyEnabled(!passBackToSystem);
  }, [tv, passBackToSystem]);

  useEffect(() => {
    if (!tv || Platform.OS !== "ios") return;
    return () => setTvMenuKeyEnabled(false);
  }, [tv]);

  /** Returns true when Back was handled in-app; false lets the system exit to Home. */
  const handleHardwareBack = useCallback((): boolean => {
    if (!tv) return false;

    const now = Date.now();
    if (now < backLockUntilRef.current) return true;

    // 1) Nested stack → pop
    if (router.canDismiss()) {
      backLockUntilRef.current = now + 350;
      router.back();
      return true;
    }

    // 2) Content focus → expand side rail (Leanback)
    if (tryExpandTvRailOnBack()) {
      backLockUntilRef.current = now + 350;
      return true;
    }

    // 3) Rail focused at a tab root → system Back (Android TV launcher / tvOS Home).
    return false;
  }, [tv, router]);

  const onRemoteEvent = useCallback((event: TvHwEvent) => {
    if (!isTvKeyDown(event)) return;
    const player = audioRef.current;

    if (isTvPlayPauseEvent(event)) {
      if (player.current) player.toggle();
      return;
    }

    if (isTvNextEvent(event)) {
      if (player.current && player.queue.length > 1) player.next();
      return;
    }

    if (isTvPreviousEvent(event)) {
      if (player.current && player.queue.length > 1) player.previous();
      return;
    }

    // Back / Menu are NOT handled here: react-native-tvos routes the Siri
    // Remote Menu key through BackHandler on tvOS (and Android Back always is),
    // where expo-router's own listener pops stacks first. Handling the raw
    // "menu" event as well would pop twice. Fire TV / Android TV "menu" is the
    // options key, never Back.
  }, []);

  useTvEventHandler(onRemoteEvent);

  // Android Back and tvOS Menu both arrive via BackHandler. Listeners run in
  // reverse registration order, so expo-router's NavigationContainer handler
  // (registered after this child effect) pops nested stacks first; this ladder
  // covers what navigation does not handle (rail expand → system Home).
  useEffect(() => {
    if (!tv) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", handleHardwareBack);
    return () => sub.remove();
  }, [tv, handleHardwareBack]);

  // Pause playback when the TV app becomes inactive (screensaver / app switch).
  useEffect(() => {
    if (!tv) return;
    const onChange = (state: string) => {
      if (state !== "active" && audioRef.current.isPlaying && audioRef.current.current) {
        audioRef.current.toggle();
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [tv]);

  return null;
}
