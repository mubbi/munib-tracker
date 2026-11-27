import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import type { MicState } from "@/hooks/use-practice-session";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Practice dock (§9.2): Hear, Microphone (primary), Reveal (hide modes only),
 * End — plus "Reveal all" on wide windows. Every control shares one icon-slot
 * height and one label line, so all icons sit on a single centre line. Floats above whatever covers the bottom of the
 * screen (mini-player, home indicator), capped in width and centred so it never
 * stretches edge to edge on wide screens. Listen-only sessions make Hear the
 * primary control.
 */
type PracticeDockProps = {
  showMic: boolean;
  mic: MicState;
  micDisabled?: boolean;
  /** The listener is loading: keep the mic in place with a spinner (no Listen ↔ mic swap). */
  preparing?: boolean;
  isHearing: boolean;
  showReveal: boolean;
  /** Icon-only controls when the window is short (landscape on a small phone). */
  compact: boolean;
  onHear: () => void;
  onMic: () => void;
  onReveal: () => void;
  onRevealAll: () => void;
  onEnd: () => void;
};

const MIC_SIZE = 64;
const SIDE_SIZE = 46;
/** Window width at which "reveal all" gets its own dock button. */
const REVEAL_ALL_BUTTON_MIN_WIDTH = 768;

export function PracticeDock({
  showMic,
  mic,
  micDisabled,
  preparing = false,
  isHearing,
  showReveal,
  compact,
  onHear,
  onMic,
  onReveal,
  onRevealAll,
  onEnd,
}: PracticeDockProps) {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  // Tablet / desktop (mouse users): "reveal the rest" is long-press on Reveal —
  // also offer it as a visible button so it isn't a hidden gesture.
  const showRevealAll = showReveal && windowWidth >= REVEAL_ALL_BUTTON_MIN_WIDTH;
  const { colors, tokens } = useThemeTokens();
  const reduceMotion = useHydrationSafeReducedMotion();
  const recording = mic === "listening" || mic === "starting";
  const busy = mic === "starting" || mic === "settling" || preparing;
  const micLabel = recording ? t("quranCompanion.dock.listening") : t("quranCompanion.dock.start");

  // Soft pulse ring while listening — the visible "recording" indicator (§10).
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (recording && !reduceMotion) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }
  }, [pulse, recording, reduceMotion]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: recording ? 0.45 * (1 - pulse.value) : 0,
    transform: [{ scale: 1 + pulse.value * 0.45 }],
  }));

  const primaryColor = recording ? tokens.status.danger.color : colors.accent;

  const side = (
    key: string,
    icon: SymbolViewProps["name"],
    label: string,
    onPress: () => void,
    options: {
      a11y?: string;
      hint?: string;
      selected?: boolean;
      tint?: string;
      onLongPress?: () => void;
    } = {},
  ) => (
    <PressableScale
      key={key}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={options.a11y ?? label}
      accessibilityHint={options.hint}
      accessibilityState={options.selected != null ? { selected: options.selected } : undefined}
      onPress={onPress}
      onLongPress={options.onLongPress}
      style={styles.column}
    >
      <View style={styles.slot}>
        <View
          style={[
            styles.sideWell,
            {
              backgroundColor: options.selected ? tokens.accentSoft : colors.muted,
              borderColor: options.selected ? colors.accent : colors.border,
            },
          ]}
        >
          <SymbolView name={icon} size={20} tintColor={options.tint ?? colors.foreground} />
        </View>
      </View>
      {compact ? null : (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={[styles.label, options.selected ? { color: colors.accentText } : null]}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      )}
    </PressableScale>
  );

  const hearIcon: SymbolViewProps["name"] = isHearing
    ? { ios: "stop.fill", android: "stop", web: "stop" }
    : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" };

  // Start side: Hear (+ Reveal). End side: (Reveal all +) End. The mic always sits
  // in the middle, whichever controls are showing.
  const startControls = [
    showMic
      ? side("hear", hearIcon, t("quranCompanion.dock.hear"), onHear, {
          a11y: isHearing ? t("quranCompanion.dock.stopHearing") : t("quranCompanion.dock.hear"),
          selected: isHearing,
        })
      : null,
    showReveal
      ? side(
          "reveal",
          { ios: "eye.fill", android: "visibility", web: "visibility" },
          t("quranCompanion.dock.reveal"),
          onReveal,
          { hint: t("quranCompanion.dock.revealHint"), onLongPress: onRevealAll },
        )
      : null,
  ];
  const endControls = [
    showRevealAll
      ? side(
          "revealAll",
          { ios: "eye.circle.fill", android: "select_all", web: "select_all" },
          t("quranCompanion.dock.revealAll"),
          onRevealAll,
        )
      : null,
    side(
      "end",
      { ios: "checkmark.circle", android: "task_alt", web: "task_alt" },
      t("quranCompanion.dock.end"),
      onEnd,
      { tint: colors.accent },
    ),
  ];

  const centerIcon: SymbolViewProps["name"] = showMic
    ? recording
      ? { ios: "stop.fill", android: "stop", web: "stop" }
      : { ios: "mic.fill", android: "mic", web: "mic" }
    : isHearing
      ? { ios: "stop.fill", android: "stop", web: "stop" }
      : { ios: "play.fill", android: "play_arrow", web: "play_arrow" };
  const centerLabel = showMic
    ? micLabel
    : isHearing
      ? t("quranCompanion.dock.stopHearing")
      : t("quranCompanion.dock.listen");
  const centerColor = showMic ? primaryColor : colors.accent;

  return (
    <View
      style={[
        styles.dock,
        Shadows.lg,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.group}>{startControls}</View>

      {/* Centre: the mic, or Listen when there is no listener. */}
      <View style={styles.column}>
        <View style={styles.slot}>
          {showMic ? (
            <Animated.View
              style={[
                styles.ring,
                { backgroundColor: primaryColor, pointerEvents: "none" },
                ringStyle,
              ]}
            />
          ) : null}
          <PressableScale
            haptic={showMic ? "medium" : "light"}
            accessibilityRole="button"
            accessibilityLabel={centerLabel}
            accessibilityHint={
              showMic
                ? recording
                  ? t("quranCompanion.dock.micStopHint")
                  : t("quranCompanion.dock.micStartHint")
                : undefined
            }
            accessibilityState={
              showMic
                ? { selected: recording, disabled: !!micDisabled, busy }
                : { selected: isHearing }
            }
            disabled={showMic ? micDisabled || busy : false}
            onPress={showMic ? onMic : onHear}
            style={[
              styles.mic,
              {
                backgroundColor: centerColor,
                borderColor: withAlpha(centerColor, 0.3),
                opacity: showMic && micDisabled && !preparing ? 0.45 : 1,
              },
            ]}
          >
            {showMic && busy ? (
              <ActivityIndicator color={colors.accentForeground} />
            ) : (
              <SymbolView name={centerIcon} size={28} tintColor={colors.accentForeground} />
            )}
          </PressableScale>
        </View>
        {compact ? null : (
          <ThemedText
            type="caption"
            style={[
              styles.label,
              styles.centerLabel,
              { color: recording ? tokens.status.danger.color : colors.foreground },
            ]}
            numberOfLines={1}
          >
            {centerLabel}
          </ThemedText>
        )}
      </View>

      <View style={styles.group}>{endControls}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  /** Both sides take the same width so the mic is always centred. */
  group: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
  /** One control: a fixed-height icon slot over a single label line. */
  column: { alignItems: "center", gap: Spacing.one, minWidth: 64 },
  slot: { height: MIC_SIZE, minWidth: MIC_SIZE, alignItems: "center", justifyContent: "center" },
  sideWell: {
    width: SIDE_SIZE,
    height: SIDE_SIZE,
    borderRadius: SIDE_SIZE / 2,
    borderWidth: BorderWidth.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
  },
  mic: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { lineHeight: 16, textAlign: "center" },
  centerLabel: { fontWeight: "600" },
});
