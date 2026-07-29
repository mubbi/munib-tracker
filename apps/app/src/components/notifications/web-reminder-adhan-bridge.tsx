import { useEffect } from "react";

import { adhanTrack, DEFAULT_ADHAN_STYLE } from "@/lib/adhan-audio";
import { setWebAdhanPlaybackHandler } from "@/lib/notifications/web-adhan-playback";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Registers web adhan playback with the reminder scheduler. Lives under
 * `AudioPlayerProvider` because `NotificationProvider` sits above it in the tree.
 */
export function WebReminderAdhanBridge() {
  const audio = useAudioPlayerContext();
  const adhanStyleId = useStore(preferencesStore, (s) => s.prefs.adhanStyleId);

  useEffect(() => {
    setWebAdhanPlaybackHandler(() => {
      audio.play([adhanTrack(adhanStyleId ?? DEFAULT_ADHAN_STYLE)], 0, {
        sourceHref: "/tracker",
      });
    });
    return () => setWebAdhanPlaybackHandler(null);
  }, [audio, adhanStyleId]);

  return null;
}
