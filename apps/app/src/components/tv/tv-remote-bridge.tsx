import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, BackHandler, Platform } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  isTvKeyDown,
  isTvMenuOrBackEvent,
  isTvPlayPauseEvent,
  type TvHwEvent,
  useTvEventHandler,
} from "@/hooks/use-tv-event-handler";
import { isTV } from "@/lib/platform/is-tv";
import { tryExpandTvRailOnBack } from "@/lib/tv/tv-rail-back";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

/**
 * TV remote bridge: Play/Pause → audio toggle; Menu/Back ladder
 * (stack pop → expand rail → confirm exit). Mount once under AudioPlayerProvider.
 */
export function TvRemoteBridge() {
  const tv = isTV();
  const router = useRouter();
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const [exitVisible, setExitVisible] = useState(false);
  const audioRef = useRef(audio);
  const backLockUntilRef = useRef(0);
  audioRef.current = audio;

  const handleHardwareBack = useCallback((): boolean => {
    if (!tv) return false;

    const now = Date.now();
    if (now < backLockUntilRef.current) return true;
    backLockUntilRef.current = now + 350;

    // 1) Nested stack → pop
    if (router.canDismiss()) {
      router.back();
      return true;
    }

    // 2) Content focus → expand side rail (Leanback)
    if (tryExpandTvRailOnBack()) {
      return true;
    }

    // 3) Root with rail focused → confirm exit
    setExitVisible(true);
    return true;
  }, [tv, router]);

  const onRemoteEvent = useCallback(
    (event: TvHwEvent) => {
      if (!isTvKeyDown(event)) return;

      if (isTvPlayPauseEvent(event)) {
        const player = audioRef.current;
        if (player.current) {
          player.toggle();
        }
        return;
      }

      // Android Back is handled via BackHandler to avoid double-firing with HW events.
      if (Platform.OS === "android" && event.eventType.toLowerCase() === "back") {
        return;
      }

      if (isTvMenuOrBackEvent(event)) {
        handleHardwareBack();
      }
    },
    [handleHardwareBack],
  );

  useTvEventHandler(onRemoteEvent);

  // Android TV Back arrives via BackHandler.
  useEffect(() => {
    if (!tv || Platform.OS !== "android") return;
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

  if (!tv) return null;

  return (
    <ConfirmDialog
      visible={exitVisible}
      title={t("tv.exitTitle")}
      message={t("tv.exitMessage")}
      confirmLabel={t("tv.exitConfirm")}
      cancelLabel={t("common.cancel")}
      destructive
      onClose={() => setExitVisible(false)}
      onConfirm={() => {
        setExitVisible(false);
        if (Platform.OS === "android") {
          BackHandler.exitApp();
        }
      }}
    />
  );
}
