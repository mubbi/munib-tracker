import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useSetMiniPlayerInset } from "@/hooks/use-content-bottom-inset";
import { isTV } from "@/lib/platform/is-tv";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { CompactPlayer } from "./mini-player/compact-player";
import { ExpandedPlayer } from "./mini-player/expanded-player";

/** Global audio player: a compact bar that expands into a full player. */
export function MiniPlayer() {
  const { current } = useAudioPlayerContext();
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const [expanded, setExpanded] = useState(false);
  /** TV: the expanded sheet held focus — hand it back to the bar on collapse. */
  const [returnFocus, setReturnFocus] = useState(false);

  useEffect(() => {
    if (!current) setMiniPlayerInset(0);
  }, [current, setMiniPlayerInset]);

  // TV: remote Back / Menu collapses the expanded player instead of popping the
  // screen behind it. Registered on expand → runs before expo-router's listener.
  useEffect(() => {
    if (!isTV() || !expanded) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setReturnFocus(true);
      setExpanded(false);
      return true;
    });
    return () => sub.remove();
  }, [expanded]);

  if (!current) return null;
  return expanded ? (
    <ExpandedPlayer
      onCollapse={() => {
        setReturnFocus(true);
        setExpanded(false);
      }}
    />
  ) : (
    <CompactPlayer onExpand={() => setExpanded(true)} focusOnMount={returnFocus} />
  );
}
