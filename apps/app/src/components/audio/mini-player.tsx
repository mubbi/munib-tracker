import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  ActivityIndicator,
  FlatList,
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Fonts, Radius, Shadows, Spacing } from "@/constants/theme";
import { useSetMiniPlayerInset, useTabBarOffset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  queuePosition as computeQueuePosition,
  queueDurationForProgress,
} from "@/lib/audio-queue-timing";
import { supportsProgrammaticVolume } from "@/lib/audio-volume";
import { triggerHaptic } from "@/lib/haptics";
import {
  AUDIO_SPEEDS,
  type AudioTrack,
  type LoopMode,
  useAudioPlayerContext,
} from "@/providers/audio-player-provider";

const LOOP_ICON: Record<LoopMode, SymbolViewProps["name"]> = {
  off: { ios: "repeat", android: "repeat", web: "repeat" },
  all: { ios: "repeat", android: "repeat", web: "repeat" },
  one: { ios: "repeat.1", android: "repeat_one", web: "repeat_one" },
};

/** i18n key for the current loop mode's accessibility label. */
const LOOP_LABEL_KEY: Record<LoopMode, string> = {
  off: "player.loopOff",
  all: "player.loopAll",
  one: "player.loopOne",
};

const REPLAY_ICON: SymbolViewProps["name"] = {
  ios: "arrow.counterclockwise",
  android: "replay",
  web: "replay",
};

/** How far a keyboard/AT increment or decrement nudges the position, in seconds. */
const SEEK_STEP = 10;

/** Volume slider step for keyboard/AT adjustments (0–1). */
const VOLUME_STEP = 0.1;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function nextPlaybackRate(rate: number): number {
  const idx = AUDIO_SPEEDS.indexOf(rate);
  return AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1;
}

/** rAF-driven progress from the engine clock — smooth without status polling. */
function useLivePlaybackUi({
  readSeconds,
  isPlaying,
  isTransitioning,
  hasQueue,
  queue,
  index,
  trackDurations,
  heldPosition,
  heldProgress,
  trackDuration,
}: {
  readSeconds: () => number;
  isPlaying: boolean;
  isTransitioning: boolean;
  hasQueue: boolean;
  queue: AudioTrack[];
  index: number;
  trackDurations: Record<string, number>;
  heldPosition: number;
  heldProgress: number;
  trackDuration: number;
}) {
  const frozen = !isPlaying || isTransitioning;
  const [live, setLive] = useState({ position: heldPosition, progress: heldProgress });

  useEffect(() => {
    if (frozen) {
      setLive({ position: heldPosition, progress: heldProgress });
      return;
    }

    let frame = 0;
    const tick = () => {
      const trackPos = Math.max(0, readSeconds());
      if (hasQueue) {
        const position = computeQueuePosition(queue, index, trackPos, trackDurations);
        const duration = queueDurationForProgress(queue, index, trackPos, trackDurations);
        const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
        setLive({ position, progress });
      } else {
        const progress = trackDuration > 0 ? Math.min(trackPos / trackDuration, 1) : 0;
        setLive({ position: trackPos, progress });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [
    frozen,
    readSeconds,
    hasQueue,
    queue,
    index,
    trackDurations,
    heldPosition,
    heldProgress,
    trackDuration,
  ]);

  return frozen ? { position: heldPosition, progress: heldProgress } : live;
}

const BUFFER_SWEEP_MS = 1200;

/** Continuous dual-band shimmer while audio is loading — runs on the UI thread. */
function BufferingBand({ color, active }: { color: string; active: boolean }) {
  const trackWidth = useSharedValue(0);
  const phase = useSharedValue(0);
  const fade = useSharedValue(0);

  // Keep the sweep running even when hidden so re-showing never restarts cold.
  useEffect(() => {
    phase.value = 0;
    phase.value = withRepeat(
      withTiming(1, { duration: BUFFER_SWEEP_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(phase);
  }, [phase]);

  useEffect(() => {
    fade.value = withTiming(active ? 1 : 0, {
      duration: active ? 140 : 90,
      easing: Easing.out(Easing.quad),
    });
  }, [active, fade]);

  const band1Style = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) {
      return { opacity: 0, width: 0, transform: [{ translateX: 0 }] };
    }
    const bandW = Math.max(18, w * 0.28);
    const travel = w + bandW * 2;
    const p = phase.value % 1;
    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: bandW,
      backgroundColor: color,
      opacity: fade.value * 0.5,
      transform: [{ translateX: -bandW + p * travel }],
    };
  });

  const band2Style = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) {
      return { opacity: 0, width: 0, transform: [{ translateX: 0 }] };
    }
    const bandW = Math.max(18, w * 0.28);
    const travel = w + bandW * 2;
    const p = (phase.value + 0.5) % 1;
    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: bandW,
      backgroundColor: color,
      opacity: fade.value * 0.35,
      transform: [{ translateX: -bandW + p * travel }],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <Reanimated.View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={onLayout}>
      <Reanimated.View style={band1Style} />
      <Reanimated.View style={band2Style} />
    </Reanimated.View>
  );
}

/** Approximate playlist row height for scroll recovery before layout. */
const PLAYLIST_ROW_HEIGHT = 88;

/** Scroll params that keep the active row vertically centered in the playlist. */
const PLAYLIST_CENTER_VIEW = { viewPosition: 0.5 as const };

/** Global audio player: a compact bar that expands into a full player. */
export function MiniPlayer() {
  const { current } = useAudioPlayerContext();
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!current) setMiniPlayerInset(0);
  }, [current, setMiniPlayerInset]);

  if (!current) return null;
  return expanded ? (
    <ExpandedPlayer onCollapse={() => setExpanded(false)} />
  ) : (
    <CompactPlayer onExpand={() => setExpanded(true)} />
  );
}

// ── Compact bar ──────────────────────────────────────────────────────────────

function CompactPlayer({ onExpand }: { onExpand: () => void }) {
  const tabBarOffset = useTabBarOffset();
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const {
    current,
    isPlaying,
    isBuffering,
    isTransitioning,
    toggle,
    next,
    previous,
    replay,
    stop,
    isQueueFinished,
    position,
    duration,
    queuePosition,
    queueDuration,
    queueProgress,
    queue,
    index,
    trackDurations,
    rate,
    setRate,
    readPlaybackSeconds,
  } = useAudioPlayerContext();

  useEffect(() => () => setMiniPlayerInset(0), [setMiniPlayerInset]);

  const hasQueue = queue.length > 1;
  const shownPosition = hasQueue ? queuePosition : position;
  const shownDuration = hasQueue ? (queueDuration > 0 ? queueDuration : duration) : duration;
  const heldProgress = hasQueue
    ? queueProgress
    : shownDuration > 0
      ? Math.min(shownPosition / shownDuration, 1)
      : 0;
  const { position: livePosition, progress } = useLivePlaybackUi({
    readSeconds: readPlaybackSeconds,
    isPlaying: Boolean(current) && isPlaying,
    isTransitioning,
    hasQueue,
    queue,
    index,
    trackDurations,
    heldPosition: shownPosition,
    heldProgress,
    trackDuration: shownDuration,
  });

  const showBufferingBar = isBuffering || isTransitioning;

  if (!current) return null;

  const showSpinner = isBuffering && !isPlaying && !isTransitioning;
  const cycleRate = () => setRate(nextPlaybackRate(rate));

  const onLayout = (event: LayoutChangeEvent) => {
    setMiniPlayerInset(event.nativeEvent.layout.height);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        {
          bottom: tabBarOffset,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.progress, { backgroundColor: tokens.track }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: colors.accent },
          ]}
        />
        <BufferingBand color={colors.accent} active={showBufferingBar} />
      </View>

      <View style={styles.row}>
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={current.title}
          accessibilityHint={t("player.expand")}
          onPress={onExpand}
          style={styles.info}
        >
          <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView
              name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
              size={18}
              tintColor={colors.accent}
            />
          </View>
          <View style={styles.meta}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {current.title}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {current.subtitle ? `${current.subtitle} · ` : ""}
              {showSpinner
                ? t("player.buffering")
                : `${formatTime(livePosition)} / ${formatTime(shownDuration)}`}
            </ThemedText>
          </View>
          <SymbolView
            name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>

        <View style={styles.compactControls}>
          {hasQueue ? (
            <IconButton
              name={{ ios: "backward.fill", android: "skip_previous", web: "skip_previous" }}
              size={20}
              tintColor={colors.foreground}
              accessibilityLabel={t("player.previous")}
              onPress={previous}
            />
          ) : null}
          <PressableScale
            haptic="medium"
            accessibilityRole="button"
            accessibilityLabel={
              isQueueFinished
                ? t("player.replay")
                : isPlaying
                  ? t("player.pause")
                  : t("player.play")
            }
            accessibilityState={{ busy: showSpinner }}
            onPress={isQueueFinished ? replay : toggle}
            style={[styles.playButton, { backgroundColor: colors.accent }]}
          >
            {showSpinner ? (
              <ActivityIndicator size="small" color={colors.accentForeground} />
            ) : (
              <SymbolView
                name={
                  isQueueFinished
                    ? REPLAY_ICON
                    : isPlaying
                      ? { ios: "pause.fill", android: "pause", web: "pause" }
                      : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
                }
                size={20}
                tintColor={colors.accentForeground}
              />
            )}
          </PressableScale>
          {hasQueue ? (
            <IconButton
              name={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
              size={20}
              tintColor={colors.foreground}
              accessibilityLabel={t("player.next")}
              onPress={next}
            />
          ) : null}
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("player.speedValue", { value: rate })}
            onPress={cycleRate}
            style={[styles.compactSpeed, { backgroundColor: colors.muted }]}
          >
            <ThemedText type="caption" style={{ color: colors.accentText, fontWeight: "700" }}>
              {rate}×
            </ThemedText>
          </PressableScale>
          <IconButton
            name={{ ios: "xmark", android: "close", web: "close" }}
            size={16}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("player.close")}
            onPress={stop}
          />
        </View>
      </View>
    </View>
  );
}

// ── Draggable seek bar ───────────────────────────────────────────────────────

function SeekBar({
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

// ── Volume slider ────────────────────────────────────────────────────────────

function VolumeBar({
  volume,
  onChange,
  trackColor,
  fillColor,
  thumbColor,
}: {
  volume: number;
  onChange: (volume: number) => void;
  trackColor: string;
  fillColor: string;
  thumbColor: string;
}) {
  const { t } = useTranslation();
  const [barWidth, setBarWidth] = useState(0);
  const [scrub, setScrub] = useState<number | null>(null);

  const widthRef = useRef(0);
  widthRef.current = barWidth;

  const responder = useMemo(() => {
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
        setScrub(ratioFromX(e.nativeEvent.locationX));
      },
      onPanResponderMove: (e) => {
        setScrub(ratioFromX(e.nativeEvent.locationX));
      },
      onPanResponderRelease: (e) => {
        onChange(ratioFromX(e.nativeEvent.locationX));
        setScrub(null);
      },
      onPanResponderTerminate: () => setScrub(null),
    });
  }, [onChange]);

  const shown = scrub ?? volume;
  const progress = Math.min(Math.max(shown, 0), 1);
  const percent = Math.round(progress * 100);

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const delta =
      event.nativeEvent.actionName === "increment"
        ? VOLUME_STEP
        : event.nativeEvent.actionName === "decrement"
          ? -VOLUME_STEP
          : 0;
    if (delta === 0) return;
    onChange(Math.max(0, Math.min(1, volume + delta)));
  };

  return (
    <View
      style={styles.volumeBar}
      accessibilityRole="adjustable"
      accessibilityLabel={t("player.volume")}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percent,
        text: t("player.volumeValue", { value: percent }),
      }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={onAccessibilityAction}
      {...responder.panHandlers}
    >
      <View onLayout={onLayout} style={[styles.volumeTrack, { backgroundColor: trackColor }]}>
        <View
          style={[styles.volumeFill, { width: `${progress * 100}%`, backgroundColor: fillColor }]}
        >
          <View
            style={[
              styles.volumeThumb,
              { backgroundColor: thumbColor, transform: [{ scale: scrub != null ? 1.25 : 1 }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ── Expanded full player ─────────────────────────────────────────────────────

function ExpandedPlayer({ onCollapse }: { onCollapse: () => void }) {
  const insets = useSafeAreaInsets();
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const playlistRef = useRef<FlatList<AudioTrack>>(null);
  const playlistHeightRef = useRef(0);
  const [playlistHeight, setPlaylistHeight] = useState(0);

  const {
    current,
    queue,
    index,
    isPlaying,
    isBuffering,
    isTransitioning,
    rate,
    volume,
    loopMode,
    sourceHref,
    position,
    duration,
    queuePosition,
    queueDuration,
    queueProgress,
    trackDurations,
    isQueueFinished,
    toggle,
    next,
    previous,
    replay,
    jumpTo,
    seekTo,
    seekToQueuePosition,
    setRate,
    setVolume,
    cycleLoopMode,
    stop,
    readPlaybackSeconds,
  } = audio;

  const listCenterInset = Math.max(0, playlistHeight / 2 - PLAYLIST_ROW_HEIGHT / 2);

  const scrollActiveToCenter = useCallback((targetIndex: number, animated = true) => {
    try {
      playlistRef.current?.scrollToIndex({
        index: targetIndex,
        ...PLAYLIST_CENTER_VIEW,
        animated,
      });
    } catch {
      // FlatList throws on web when the row is not yet measured.
    }
  }, []);

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      const centerInset = Math.max(0, playlistHeightRef.current / 2 - info.averageItemLength / 2);
      playlistRef.current?.scrollToOffset({
        offset: Math.max(0, info.index * info.averageItemLength - centerInset),
        animated: false,
      });
      setTimeout(() => scrollActiveToCenter(info.index), 80);
    },
    [scrollActiveToCenter],
  );

  const onPlaylistLayout = useCallback((event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    playlistHeightRef.current = height;
    setPlaylistHeight(height);
  }, []);

  // Keep the active playlist row centered when the track changes or the sheet opens.
  useEffect(() => {
    if (!current || queue.length <= 1 || playlistHeight <= 0) return;
    const timer = setTimeout(() => scrollActiveToCenter(index), 60);
    return () => clearTimeout(timer);
  }, [index, current, queue.length, playlistHeight, scrollActiveToCenter]);

  useEffect(() => {
    setMiniPlayerInset(0);
  }, [setMiniPlayerInset]);

  const hasQueue = queue.length > 1;
  const shownPosition = hasQueue ? queuePosition : position;
  const shownDuration = hasQueue ? (queueDuration > 0 ? queueDuration : duration) : duration;
  const heldProgress = hasQueue
    ? queueProgress
    : shownDuration > 0
      ? Math.min(shownPosition / shownDuration, 1)
      : 0;
  const { position: livePosition } = useLivePlaybackUi({
    readSeconds: readPlaybackSeconds,
    isPlaying: Boolean(current) && isPlaying,
    isTransitioning,
    hasQueue,
    queue,
    index,
    trackDurations,
    heldPosition: shownPosition,
    heldProgress,
    trackDuration: shownDuration,
  });

  const showBufferingBar = isBuffering || isTransitioning;

  if (!current) return null;

  const remainingTracks = Math.max(0, queue.length - (index + 1));
  const loopActive = loopMode !== "off";
  const showSpinner = isBuffering && !isPlaying && !isTransitioning;

  const cycleRate = () => setRate(nextPlaybackRate(rate));
  const openSource = () => {
    if (sourceHref) {
      onCollapse();
      router.push(sourceHref as Href);
    }
  };

  return (
    <View
      style={[
        styles.sheet,
        { backgroundColor: colors.background, paddingTop: insets.top + Spacing.two },
      ]}
    >
      <View style={styles.sheetHeader}>
        <IconButton
          name={{
            ios: "chevron.down",
            android: "keyboard_arrow_down",
            web: "keyboard_arrow_down",
          }}
          size={24}
          tintColor={colors.foreground}
          accessibilityLabel={t("player.collapse")}
          onPress={onCollapse}
        />
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {t("player.nowPlaying")}
        </ThemedText>
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          size={20}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("player.close")}
          onPress={stop}
        />
      </View>

      <View style={[styles.artwork, { backgroundColor: tokens.accentSoft }]}>
        <SymbolView
          name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          size={56}
          tintColor={colors.accent}
        />
      </View>

      <View style={styles.titleBlock}>
        <ThemedText type="title" numberOfLines={1} style={styles.centerText}>
          {current.title}
        </ThemedText>
        {current.subtitle ? (
          <ThemedText
            type="small"
            themeColor="mutedForeground"
            numberOfLines={1}
            style={styles.centerText}
          >
            {current.subtitle}
          </ThemedText>
        ) : null}
        {hasQueue ? (
          <ThemedText type="caption" style={[styles.centerText, { color: colors.accentText }]}>
            {t("player.trackOf", { current: index + 1, total: queue.length })} ·{" "}
            {t("player.remaining", { count: remainingTracks })}
          </ThemedText>
        ) : null}
      </View>

      {/* Draggable seek bar + times */}
      <SeekBar
        position={livePosition}
        duration={shownDuration}
        onSeek={hasQueue ? seekToQueuePosition : seekTo}
        trackColor={tokens.track}
        fillColor={colors.accent}
        thumbColor={colors.accent}
        buffering={showBufferingBar}
      />
      <View style={styles.times}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {formatTime(livePosition)}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          -{formatTime(Math.max(0, shownDuration - livePosition))}
        </ThemedText>
      </View>

      {supportsProgrammaticVolume() ? (
        <View style={styles.volumeRow}>
          <SymbolView
            name={{ ios: "speaker.fill", android: "volume_down", web: "volume_down" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
          <VolumeBar
            volume={volume}
            onChange={setVolume}
            trackColor={tokens.track}
            fillColor={colors.accent}
            thumbColor={colors.accent}
          />
          <SymbolView
            name={{ ios: "speaker.wave.3.fill", android: "volume_up", web: "volume_up" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
        </View>
      ) : null}

      {/* Controls */}
      <View style={styles.controls}>
        <IconButton
          name={LOOP_ICON[loopMode]}
          size={22}
          tintColor={loopActive ? colors.accent : colors.mutedForeground}
          accessibilityLabel={t(LOOP_LABEL_KEY[loopMode])}
          accessibilityState={{ selected: loopActive }}
          onPress={cycleLoopMode}
        />
        <IconButton
          name={{ ios: "backward.fill", android: "skip_previous", web: "skip_previous" }}
          size={26}
          tintColor={hasQueue ? colors.foreground : colors.mutedForeground}
          accessibilityLabel={t("player.previous")}
          accessibilityState={{ disabled: !hasQueue }}
          onPress={previous}
        />
        <PressableScale
          haptic="medium"
          accessibilityRole="button"
          accessibilityLabel={
            isQueueFinished ? t("player.replay") : isPlaying ? t("player.pause") : t("player.play")
          }
          accessibilityState={{ busy: showSpinner }}
          onPress={isQueueFinished ? replay : toggle}
          style={[styles.bigPlay, { backgroundColor: colors.accent }]}
        >
          {showSpinner ? (
            <ActivityIndicator size="small" color={colors.accentForeground} />
          ) : (
            <SymbolView
              name={
                isQueueFinished
                  ? REPLAY_ICON
                  : isPlaying
                    ? { ios: "pause.fill", android: "pause", web: "pause" }
                    : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
              }
              size={28}
              tintColor={colors.accentForeground}
            />
          )}
        </PressableScale>
        <IconButton
          name={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
          size={26}
          tintColor={hasQueue ? colors.foreground : colors.mutedForeground}
          accessibilityLabel={t("player.next")}
          accessibilityState={{ disabled: !hasQueue }}
          onPress={next}
        />
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("player.speedValue", { value: rate })}
          onPress={cycleRate}
          style={[styles.speed, { backgroundColor: colors.muted }]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {rate}×
          </ThemedText>
        </PressableScale>
      </View>

      {sourceHref ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("player.goToScreen")}
          onPress={openSource}
          style={[styles.sourceLink, { borderColor: tokens.hairline }]}
        >
          <SymbolView
            name={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("player.goToScreen")}
          </ThemedText>
        </Pressable>
      ) : null}

      {/* Playlist */}
      {hasQueue ? (
        <>
          <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.upNext}>
            {t("player.upNext")}
          </ThemedText>
          <FlatList
            ref={playlistRef}
            data={queue}
            keyExtractor={(track) => track.id}
            style={styles.playlist}
            onLayout={onPlaylistLayout}
            contentContainerStyle={{
              paddingTop: listCenterInset,
              paddingBottom: listCenterInset + insets.bottom + Spacing.four,
            }}
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={onScrollToIndexFailed}
            getItemLayout={(_, i) => ({
              length: PLAYLIST_ROW_HEIGHT,
              offset: PLAYLIST_ROW_HEIGHT * i,
              index: i,
            })}
            renderItem={({ item: track, index: i }) => (
              <PlaylistRow
                track={track}
                position={i + 1}
                active={i === index}
                onPress={() => jumpTo(i)}
              />
            )}
          />
        </>
      ) : null}
    </View>
  );
}

function PlaylistRow({
  track,
  position,
  active,
  onPress,
}: {
  track: AudioTrack;
  position: number;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const primary = track.playlistPrimary ?? track.subtitle ?? track.title;
  const secondary = track.playlistSecondary ?? track.preview;
  const primaryIsArabic = track.playlistPrimaryRtl === true;
  const secondaryIsArabic = track.playlistSecondary == null && Boolean(track.preview);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={secondary ? `${primary}. ${secondary}` : primary}
      onPress={onPress}
      style={[styles.plRow, active ? { backgroundColor: tokens.accentSoft } : null]}
    >
      <View style={styles.plIndex}>
        {active ? (
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={16}
            tintColor={colors.accent}
          />
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground">
            {position}
          </ThemedText>
        )}
      </View>
      <View style={styles.plBody}>
        <ThemedText
          type={primaryIsArabic ? "arabic" : "small"}
          numberOfLines={primaryIsArabic ? 2 : 1}
          style={[
            primaryIsArabic ? styles.plArabic : undefined,
            active && !primaryIsArabic ? { color: colors.accentText } : undefined,
            active && primaryIsArabic ? { color: colors.accentText } : undefined,
          ]}
        >
          {primary}
        </ThemedText>
        {secondary ? (
          <ThemedText
            type="caption"
            numberOfLines={primaryIsArabic ? 2 : 1}
            themeColor="mutedForeground"
            style={secondaryIsArabic ? styles.plPreview : undefined}
          >
            {secondary}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  progress: { height: 3, width: "100%", overflow: "hidden" },
  progressFill: { height: "100%" },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two, padding: Spacing.two + 2 },
  info: { flex: 1, flexDirection: "row", alignItems: "center", gap: Spacing.two + 2 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { flex: 1, gap: 2 },
  compactControls: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  compactSpeed: {
    minWidth: 34,
    minHeight: 34,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },

  // Expanded sheet
  sheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    paddingHorizontal: Spacing.four,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  artwork: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  titleBlock: { gap: Spacing.one, marginBottom: Spacing.four },
  centerText: { textAlign: "center" },
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
  times: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.three },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  volumeBar: { flex: 1, paddingVertical: Spacing.one, justifyContent: "center" },
  volumeTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  volumeFill: { height: "100%", borderRadius: 2, position: "relative" },
  volumeThumb: {
    position: "absolute",
    right: -6,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    ...Shadows.sm,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  bigPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  speed: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  upNext: { marginBottom: Spacing.two },
  playlist: { flex: 1 },
  plRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: PLAYLIST_ROW_HEIGHT,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  plIndex: { width: 24, alignItems: "center" },
  plBody: { flex: 1, gap: 2 },
  plArabic: {
    fontSize: 22,
    lineHeight: 36,
    writingDirection: "rtl",
    textAlign: "right",
  },
  plPreview: {
    fontFamily: Fonts.serif,
    writingDirection: "rtl",
    textAlign: "right",
  },
});
