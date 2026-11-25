import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { SessionCountingMode } from "@/lib/tasbeeh-voice/mode";
import type { VoiceStopReason } from "@/lib/tasbeeh-voice/session";
import type { VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";

const MIC_ICON = { ios: "mic.fill", android: "mic", web: "mic" } as const;
const CHECK_ICON = { ios: "checkmark", android: "check", web: "check" } as const;

type Props = {
  zikr: VoiceZikr;
  /** How this session counts (taught pattern, pauses, or the model spotter). */
  countingMode: SessionCountingMode | null;
  listening: boolean;
  preparing: boolean;
  /** 0–1 */
  level: number;
  stuck: boolean;
  /** Bumps on every voice count. */
  flashKey: number;
  /** Shown when listening stopped on its own (silence, background, …). */
  stopReason: VoiceStopReason | null;
  /** Suggest the calm Focus / Night designs (not shown when one is already in use). */
  showFocusTip: boolean;
  /**
   * Inline under a step that already shows its text (guided session, sequence):
   * no Arabic / translation / tip — just the status, the meter and the honest
   * counting label (D51).
   */
  compact?: boolean;
};

const STOP_COPY: Partial<Record<VoiceStopReason, string>> = {
  silence: "tasbeehVoice.stopped.silence",
  background: "tasbeehVoice.stopped.background",
  interrupted: "tasbeehVoice.stopped.interrupted",
  target: "tasbeehVoice.stopped.target",
  error: "tasbeehVoice.stopped.error",
};

/**
 * Hands-free status under the counter (NF-3.20): a pulsing mic chip, a small
 * level meter, the zikr being listened for (Arabic from the dataset + its
 * translation; a custom tasbeeh shows its own title), how this session counts
 * (D51: honest labels, "tap to correct"), a soft ✓ flash per count, and the
 * gentle "stuck" hint.
 */
export function VoiceListeningPanel({
  zikr,
  countingMode,
  listening,
  preparing,
  level,
  stuck,
  flashKey,
  stopReason,
  showFocusTip,
  compact = false,
}: Props) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reduceMotion = useReducedMotion();
  const translation = useScriptureTranslation(zikr.entry ?? { translation: "" });
  const arabic = compact ? null : (zikr.entry?.arabic ?? null);

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (!listening || reduceMotion) {
      cancelAnimation(pulse);
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(
      withSequence(withTiming(1.12, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
    );
    return () => cancelAnimation(pulse);
  }, [listening, reduceMotion, pulse]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const flash = useSharedValue(0);
  useEffect(() => {
    if (flashKey === 0) return;
    flash.value = 1;
    flash.value = withTiming(0, { duration: reduceMotion ? 0 : 650 });
  }, [flashKey, flash, reduceMotion]);
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  const active = listening || preparing;
  const stopCopy = !active && stopReason ? STOP_COPY[stopReason] : undefined;
  if (!active && !stopCopy) return null;

  if (!active && stopCopy) {
    return (
      <View
        accessibilityLiveRegion="polite"
        style={[styles.notice, { backgroundColor: colors.muted, borderColor: tokens.hairline }]}
      >
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
          {t(stopCopy)}
        </ThemedText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.panel,
        compact && styles.panelCompact,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.4 : 0.25),
        },
      ]}
    >
      <View style={styles.chipRow}>
        <Animated.View
          style={[styles.micDot, { backgroundColor: colors.accent }, pulseStyle]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <SymbolView name={MIC_ICON} size={14} tintColor={colors.accentForeground} />
        </Animated.View>
        <ThemedText
          type="smallBold"
          style={{ color: colors.accentText }}
          accessibilityLiveRegion="polite"
        >
          {preparing ? t("tasbeehVoice.preparing") : t("tasbeehVoice.listening")}
        </ThemedText>
        <View
          style={[styles.meterTrack, { backgroundColor: withAlpha(colors.accent, 0.18) }]}
          accessibilityRole="progressbar"
          accessibilityLabel={t("tasbeehVoice.levelA11y")}
          accessibilityValue={{ min: 0, max: 100, now: Math.round(level * 100) }}
        >
          <View
            style={[
              styles.meterFill,
              { width: `${Math.round(level * 100)}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
        <Animated.View
          style={[styles.check, { backgroundColor: tokens.status.success.soft }, flashStyle]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <SymbolView name={CHECK_ICON} size={14} tintColor={tokens.status.success.color} />
        </Animated.View>
      </View>

      {zikr.label && !compact ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
          {t("tasbeehVoice.listeningFor", { phrase: zikr.label })}
        </ThemedText>
      ) : null}
      {arabic ? (
        <ThemedText type="arabic" style={styles.arabic} numberOfLines={2}>
          {arabic}
        </ThemedText>
      ) : null}
      {arabic && translation ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={styles.center}
          numberOfLines={2}
        >
          {translation}
        </ThemedText>
      ) : null}
      {countingMode === "template" || countingMode === "pause" ? (
        <ThemedText
          type="caption"
          style={[
            styles.center,
            {
              color:
                countingMode === "pause" ? tokens.status.warning.color : colors.mutedForeground,
            },
          ]}
        >
          {t(
            countingMode === "template"
              ? "tasbeehVoice.teach.countsTaught"
              : "tasbeehVoice.teach.countsPauses",
          )}
        </ThemedText>
      ) : null}

      {stuck ? (
        <ThemedText
          type="caption"
          accessibilityLiveRegion="polite"
          style={[styles.center, { color: colors.accentText }]}
        >
          {t("tasbeehVoice.stuck")}
        </ThemedText>
      ) : null}
      {showFocusTip && !compact ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
          {t("tasbeehVoice.focusTip")}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  panelCompact: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  notice: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  micDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  meterTrack: {
    flex: 1,
    height: 6,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    textAlign: "center",
  },
  arabic: {
    textAlign: "center",
    writingDirection: "rtl",
  },
});
