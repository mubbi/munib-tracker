import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BottomTabInset, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { AUDIO_SPEEDS, useAudioPlayerContext } from "@/providers/audio-player-provider";

/** A single global mini-player that persists across navigation while audio is queued. */
export function MiniPlayer() {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { current, isPlaying, rate, toggle, next, setRate, stop, position, duration } =
    useAudioPlayerContext();

  if (!current) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const cycleRate = () => {
    const idx = AUDIO_SPEEDS.indexOf(rate);
    setRate(AUDIO_SPEEDS[(idx + 1) % AUDIO_SPEEDS.length] ?? 1);
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
        <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={18}
            tintColor={colors.accent}
          />
        </View>
        <View style={styles.body}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {current.title}
          </ThemedText>
          {current.subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {current.subtitle}
            </ThemedText>
          ) : null}
        </View>

        <Pressable
          accessibilityLabel="Playback speed"
          hitSlop={6}
          onPress={cycleRate}
          style={styles.speed}
        >
          <ThemedText type="caption" style={{ color: colors.accent }}>
            {rate}×
          </ThemedText>
        </Pressable>
        <PressableScale
          haptic="light"
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
          onPress={toggle}
        >
          <SymbolView
            name={
              isPlaying
                ? { ios: "pause.fill", android: "pause", web: "pause" }
                : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
            }
            size={24}
            tintColor={colors.foreground}
          />
        </PressableScale>
        <PressableScale haptic="light" accessibilityLabel="Next" onPress={next}>
          <SymbolView
            name={{ ios: "forward.fill", android: "skip_next", web: "skip_next" }}
            size={20}
            tintColor={colors.foreground}
          />
        </PressableScale>
        <Pressable accessibilityLabel="Close player" hitSlop={6} onPress={stop}>
          <SymbolView
            name={{ ios: "xmark", android: "close", web: "close" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
        </Pressable>
      </View>
    </View>
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
    gap: Spacing.three,
    padding: Spacing.two + 2,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  speed: {
    minWidth: 30,
    alignItems: "center",
  },
});
