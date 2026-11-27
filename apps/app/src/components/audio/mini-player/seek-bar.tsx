import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { Shadows, Spacing } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import { BufferingBand } from "./buffering-band";
import { SEEK_STEP } from "./player-constants";

// ── Draggable seek bar ───────────────────────────────────────────────────────

export function SeekBar({
  position,
  duration,
  onSeek,
  trackColor,
  fillColor,
  thumbColor,
  buffering = false,
}: {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
  trackColor: string;
  fillColor: string;
  thumbColor: string;
  buffering?: boolean;
}) {
  const { t } = useTranslation();
  const [barWidth, setBarWidth] = useState(0);
  // While dragging we scrub optimistically and commit on release. `null` means
  // "not scrubbing — follow the live playback position".
  const [scrub, setScrub] = useState<number | null>(null);

  // Refs keep the gesture handlers reading current values without recreating the
  // PanResponder (which would drop an in-flight drag) on every render.
  const widthRef = useRef(0);
  widthRef.current = barWidth;
  const durationRef = useRef(0);
  durationRef.current = duration;

  const responder = useMemo(() => {
    // Reads refs only, so it lives inside the memo and needs no dependency.
    const ratioFromX = (x: number) => {
      const w = widthRef.current;
      if (w <= 0) return 0;
      return Math.max(0, Math.min(1, x / w));
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        triggerHaptic("selection");
        setScrub(ratioFromX(e.nativeEvent.locationX) * durationRef.current);
      },
      onPanResponderMove: (e) => {
        setScrub(ratioFromX(e.nativeEvent.locationX) * durationRef.current);
      },
      onPanResponderRelease: (e) => {
        const seconds = ratioFromX(e.nativeEvent.locationX) * durationRef.current;
        onSeek(seconds);
        setScrub(null);
      },
      onPanResponderTerminate: () => setScrub(null),
    });
  }, [onSeek]);

  const shown = scrub ?? position;
  const progress = duration > 0 ? Math.min(Math.max(shown / duration, 0), 1) : 0;

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (duration <= 0) return;
    const delta =
      event.nativeEvent.actionName === "increment"
        ? SEEK_STEP
        : event.nativeEvent.actionName === "decrement"
          ? -SEEK_STEP
          : 0;
    if (delta === 0) return;
    onSeek(Math.max(0, Math.min(duration, position + delta)));
  };

  return (
    <View
      // The whole area is the touch target so the thin bar is easy to grab.
      style={styles.seekArea}
      accessibilityRole="adjustable"
      accessibilityLabel={t("player.seek")}
      accessibilityValue={{
        min: 0,
        max: Math.max(0, Math.round(duration)),
        now: Math.round(shown),
      }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={onAccessibilityAction}
      {...responder.panHandlers}
    >
      <View onLayout={onLayout} style={[styles.seekTrack, { backgroundColor: trackColor }]}>
        <View
          style={[styles.seekFill, { width: `${progress * 100}%`, backgroundColor: fillColor }]}
        >
          <View
            style={[
              styles.seekThumb,
              { backgroundColor: thumbColor, transform: [{ scale: scrub != null ? 1.25 : 1 }] },
            ]}
          />
        </View>
        <BufferingBand color={fillColor} active={buffering && scrub == null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tall touch area so the thin bar is easy to grab while dragging.
  seekArea: { paddingVertical: Spacing.two, justifyContent: "center" },
  seekTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  seekFill: { height: "100%", borderRadius: 3, position: "relative" },
  seekThumb: {
    position: "absolute",
    right: -8,
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    ...Shadows.sm,
  },
});
