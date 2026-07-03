import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BottomTabInset, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  AUDIO_SPEEDS,
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

/** A single global mini-player that persists across navigation while audio is queued. */
export function MiniPlayer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const {
    current,
    queue,
    index,
    isPlaying,
    rate,
    loopMode,
    sourceHref,
    toggle,
    next,
    previous,
    setRate,
    cycleLoopMode,
    stop,
    position,
    duration,
  } = useAudioPlayerContext();

  if (!current) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const hasQueue = queue.length > 1;
  const loopActive = loopMode !== "off";

  const cycleRate = () => {
    const idx = AUDIO_SPEEDS.indexOf(rate);
    setRate(AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1);
  };

  const openSource = () => {
    if (sourceHref) router.push(sourceHref as Href);
  };

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
        {/* Tap the artwork/title to return to what's playing. */}
        <PressableScale
          haptic="light"
          disabled={!sourceHref}
          accessibilityRole="button"
          accessibilityLabel={current.title}
          onPress={openSource}
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
            <View style={styles.subRow}>
              {current.subtitle ? (
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {current.subtitle}
                </ThemedText>
              ) : null}
              {hasQueue ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  · {index + 1}/{queue.length}
                </ThemedText>
              ) : (
                <ThemedText type="caption" themeColor="mutedForeground">
                  · {formatTime(position)}
                </ThemedText>
              )}
            </View>
          </View>
          {sourceHref ? (
            <SymbolView
              name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
              size={14}
              tintColor={colors.mutedForeground}
            />
          ) : null}
        </PressableScale>

        <View style={styles.controls}>
          <IconButton
            label={`Loop: ${loopMode}`}
            icon={LOOP_ICON[loopMode]}
            size={18}
            tint={loopActive ? colors.accent : colors.mutedForeground}
            onPress={cycleLoopMode}
          />
          {hasQueue ? (
            <IconButton
              label="Previous"
              icon={{ ios: "backward.fill", android: "skip_previous", web: "skip_previous" }}
              size={18}
              tint={colors.foreground}
              onPress={previous}
            />
          ) : null}

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
            <IconButton
              label="Next"
              icon={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
              size={18}
              tint={colors.foreground}
              onPress={next}
            />
          ) : null}

          <Pressable accessibilityLabel="Playback speed" hitSlop={6} onPress={cycleRate}>
            <View style={[styles.speed, { backgroundColor: colors.muted }]}>
              <ThemedText type="caption" style={{ color: colors.accent }}>
                {rate}×
              </ThemedText>
            </View>
          </Pressable>

          <Pressable
            accessibilityLabel="Close player"
            hitSlop={6}
            onPress={stop}
            style={styles.close}
          >
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={15}
              tintColor={colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
    </View>
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
  progress: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two + 2,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  speed: {
    minWidth: 32,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
  },
  close: {
    marginLeft: 2,
  },
});
