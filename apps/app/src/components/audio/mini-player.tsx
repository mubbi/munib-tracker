import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BottomTabInset, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  const { colors, tokens } = useThemeTokens();
  const { current, isPlaying, toggle, next, stop, position, duration, queue } =
    useAudioPlayerContext();
  if (!current) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const hasQueue = queue.length > 1;

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
              {formatTime(position)} / {formatTime(duration)}
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
            accessibilityLabel={isPlaying ? "Pause" : "Play"}
            onPress={toggle}
            style={[styles.playButton, { backgroundColor: colors.accent }]}
          >
            <SymbolView
              name={
                isPlaying
                  ? { ios: "pause.fill", android: "pause", web: "pause" }
                  : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
              }
              size={20}
              tintColor={colors.accentForeground}
            />
          </PressableScale>
          {hasQueue ? (
            <PressableScale haptic="light" accessibilityLabel="Next" onPress={next}>
              <SymbolView
                name={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
                size={20}
                tintColor={colors.foreground}
              />
            </PressableScale>
          ) : null}
          <Pressable accessibilityLabel="Close player" hitSlop={6} onPress={stop}>
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={16}
              tintColor={colors.mutedForeground}
            />
          </Pressable>
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
  const [barWidth, setBarWidth] = useState(0);

  const {
    current,
    queue,
    index,
    isPlaying,
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

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const remainingTracks = Math.max(0, queue.length - (index + 1));
  const hasQueue = queue.length > 1;
  const loopActive = loopMode !== "off";

  const cycleRate = () => {
    const idx = AUDIO_SPEEDS.indexOf(rate);
    setRate(AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1);
  };
  const onSeekBar = (e: GestureResponderEvent) => {
    if (barWidth <= 0 || duration <= 0) return;
    const ratio = Math.max(0, Math.min(1, e.nativeEvent.locationX / barWidth));
    seekTo(ratio * duration);
  };
  const onBarLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);
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
        <Pressable accessibilityLabel="Collapse" hitSlop={8} onPress={onCollapse}>
          <SymbolView
            name={{
              ios: "chevron.down",
              android: "keyboard_arrow_down",
              web: "keyboard_arrow_down",
            }}
            size={24}
            tintColor={colors.foreground}
          />
        </Pressable>
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {t("player.nowPlaying")}
        </ThemedText>
        <Pressable accessibilityLabel="Close player" hitSlop={8} onPress={stop}>
          <SymbolView
            name={{ ios: "xmark", android: "close", web: "close" }}
            size={20}
            tintColor={colors.mutedForeground}
          />
        </Pressable>
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
          <ThemedText type="caption" style={[styles.centerText, { color: colors.accent }]}>
            {t("player.trackOf", { current: index + 1, total: queue.length })} ·{" "}
            {t("player.remaining", { count: remainingTracks })}
          </ThemedText>
        ) : null}
      </View>

      {/* Seek bar + times */}
      <Pressable onPress={onSeekBar} style={styles.seekArea}>
        <View onLayout={onBarLayout} style={[styles.seekTrack, { backgroundColor: tokens.track }]}>
          <View
            style={[
              styles.seekFill,
              { width: `${progress * 100}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
      </Pressable>
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
          label={`Loop: ${loopMode}`}
          icon={LOOP_ICON[loopMode]}
          size={22}
          tint={loopActive ? colors.accent : colors.mutedForeground}
          onPress={cycleLoopMode}
        />
        <IconButton
          label="Previous"
          icon={{ ios: "backward.fill", android: "skip_previous", web: "skip_previous" }}
          size={26}
          tint={hasQueue ? colors.foreground : colors.mutedForeground}
          onPress={previous}
        />
        <PressableScale
          haptic="medium"
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
          onPress={toggle}
          style={[styles.bigPlay, { backgroundColor: colors.accent }]}
        >
          <SymbolView
            name={
              isPlaying
                ? { ios: "pause.fill", android: "pause", web: "pause" }
                : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
            }
            size={28}
            tintColor={colors.accentForeground}
          />
        </PressableScale>
        <IconButton
          label="Next"
          icon={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
          size={26}
          tint={hasQueue ? colors.foreground : colors.mutedForeground}
          onPress={next}
        />
        <Pressable accessibilityLabel="Playback speed" hitSlop={8} onPress={cycleRate}>
          <View style={[styles.speed, { backgroundColor: colors.muted }]}>
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
              {rate}×
            </ThemedText>
          </View>
        </Pressable>
      </View>

      {sourceHref ? (
        <Pressable
          onPress={openSource}
          style={[styles.sourceLink, { borderColor: tokens.hairline }]}
        >
          <SymbolView
            name={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
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
          style={active ? { color: colors.accent } : undefined}
        >
          {track.subtitle || track.title}
        </ThemedText>
      </View>
    </Pressable>
  );
}

function IconButton({
  label,
  icon,
  size,
  tint,
  onPress,
}: {
  label: string;
  icon: SymbolViewProps["name"];
  size: number;
  tint: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <SymbolView name={icon} size={size} tintColor={tint} />
    </PressableScale>
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
  compactControls: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
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
  seekArea: { paddingVertical: Spacing.two },
  seekTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  seekFill: { height: "100%" },
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
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
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
