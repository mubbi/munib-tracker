import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  ActivityIndicator,
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BottomTabInset, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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

/** How far a keyboard/AT increment or decrement nudges the position, in seconds. */
const SEEK_STEP = 10;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Global audio player: a compact bar that expands into a full player. */
export function MiniPlayer() {
  const { current } = useAudioPlayerContext();
  const [expanded, setExpanded] = useState(false);

  if (!current) return null;
  return expanded ? (
    <ExpandedPlayer onCollapse={() => setExpanded(false)} />
  ) : (
    <CompactPlayer onExpand={() => setExpanded(true)} />
  );
}

// ── Compact bar ──────────────────────────────────────────────────────────────

function CompactPlayer({ onExpand }: { onExpand: () => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { current, isPlaying, isBuffering, toggle, next, stop, position, duration, queue } =
    useAudioPlayerContext();
  if (!current) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const hasQueue = queue.length > 1;
  const showSpinner = isBuffering && !isPlaying;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: BottomTabInset + insets.bottom * 0 + Spacing.two,
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...Shadows.lg,
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
                : `${formatTime(position)} / ${formatTime(duration)}`}
            </ThemedText>
          </View>
          <SymbolView
            name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>

        <View style={styles.compactControls}>
          <PressableScale
            haptic="medium"
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
            accessibilityState={{ busy: showSpinner }}
            onPress={toggle}
            style={[styles.playButton, { backgroundColor: colors.accent }]}
          >
            {showSpinner ? (
              <ActivityIndicator size="small" color={colors.accentForeground} />
            ) : (
              <SymbolView
                name={
                  isPlaying
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
}: {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
  trackColor: string;
  fillColor: string;
  thumbColor: string;
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
      </View>
    </View>
  );
}

// ── Expanded full player ─────────────────────────────────────────────────────

function ExpandedPlayer({ onCollapse }: { onCollapse: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();

  const {
    current,
    queue,
    index,
    isPlaying,
    isBuffering,
    rate,
    loopMode,
    sourceHref,
    position,
    duration,
    toggle,
    next,
    previous,
    jumpTo,
    seekTo,
    setRate,
    cycleLoopMode,
    stop,
  } = audio;
  if (!current) return null;

  const remainingTracks = Math.max(0, queue.length - (index + 1));
  const hasQueue = queue.length > 1;
  const loopActive = loopMode !== "off";
  const showSpinner = isBuffering && !isPlaying;

  const cycleRate = () => {
    const idx = AUDIO_SPEEDS.indexOf(rate);
    setRate(AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1);
  };
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
        position={position}
        duration={duration}
        onSeek={seekTo}
        trackColor={tokens.track}
        fillColor={colors.accent}
        thumbColor={colors.accent}
      />
      <View style={styles.times}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {formatTime(position)}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          -{formatTime(Math.max(0, duration - position))}
        </ThemedText>
      </View>

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
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
          accessibilityState={{ busy: showSpinner }}
          onPress={toggle}
          style={[styles.bigPlay, { backgroundColor: colors.accent }]}
        >
          {showSpinner ? (
            <ActivityIndicator size="small" color={colors.accentForeground} />
          ) : (
            <SymbolView
              name={
                isPlaying
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
          <ScrollView
            style={styles.playlist}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}
            showsVerticalScrollIndicator={false}
          >
            {queue.map((track, i) => (
              <PlaylistRow
                key={track.id}
                track={track}
                position={i + 1}
                active={i === index}
                onPress={() => jumpTo(i)}
              />
            ))}
          </ScrollView>
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={track.subtitle ?? track.title}
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
          type="small"
          numberOfLines={1}
          style={active ? { color: colors.accentText } : undefined}
        >
          {track.subtitle || track.title}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.three,
    right: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    maxWidth: 760,
    alignSelf: "center",
    width: "auto",
  },
  progress: { height: 3, width: "100%" },
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
  seekTrack: { height: 6, borderRadius: 3 },
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
  times: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.four },
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
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  plIndex: { width: 24, alignItems: "center" },
  plBody: { flex: 1 },
});
