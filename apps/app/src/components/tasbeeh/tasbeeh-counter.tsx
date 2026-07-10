import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  chartCoordinateStyle,
  progressRingKnobStyle,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
} from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { isRTL, ltrControlViewProps } from "@/lib/rtl";

export type TasbeehMode = { label: string; target: number };

export const TASBEEH_MODES: TasbeehMode[] = [
  { label: "33", target: 33 },
  { label: "99", target: 99 },
  { label: "100", target: 100 },
  { label: "∞", target: 0 },
];

const RING_SIZE = 272;
const RING_STROKE = 14;
const TAP_SIZE = RING_SIZE + 48;
const TAP_HIT_SLOP = (TAP_SIZE - RING_SIZE) / 2;

type TasbeehCounterProps = {
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  modes?: TasbeehMode[];
  onSelectMode?: (target: number) => void;
  onCustom?: () => void;
};

type PendingConfirm = "decrement" | "reset" | "startAgain";

export function TasbeehCounter({
  count,
  target,
  onIncrement,
  onDecrement,
  onReset,
  modes = TASBEEH_MODES,
  onSelectMode,
  onCustom,
}: TasbeehCounterProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const displayCount = target > 0 ? Math.min(count, target) : count;
  const atLimit = target > 0 && count >= target;
  const complete = atLimit;
  const remaining = target > 0 ? Math.max(target - displayCount, 0) : 0;
  const prevComplete = useRef(complete);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const celebrationColors = useMemo(
    () => [
      colors.accent,
      tokens.status.success.color,
      tokens.status.warning.color,
      colors.foreground,
    ],
    [colors.accent, colors.foreground, tokens.status.success.color, tokens.status.warning.color],
  );

  useEffect(() => {
    if (complete && !prevComplete.current) {
      triggerHaptic("success");
      setCelebrationKey((key) => key + 1);
    }
    prevComplete.current = complete;
  }, [complete]);

  const handleTap = () => {
    if (atLimit) {
      triggerHaptic("light");
      return;
    }
    triggerHaptic("light");
    onIncrement();
  };

  const confirmCopy = useMemo(() => {
    switch (pending) {
      case "decrement":
        return {
          title: t("tasbeehUi.confirmUndoTitle"),
          message: t("tasbeehUi.confirmUndoMessage"),
          confirmLabel: t("tasbeehUi.undo"),
          destructive: false,
        };
      case "reset":
        return {
          title: t("tasbeehUi.confirmResetTitle"),
          message: t("tasbeehUi.confirmResetMessage", { count: displayCount }),
          confirmLabel: t("common.reset"),
          destructive: true,
        };
      case "startAgain":
        return {
          title: t("tasbeehUi.confirmStartAgainTitle"),
          message: t("tasbeehUi.confirmStartAgainMessage"),
          confirmLabel: t("tasbeehUi.startAgain"),
          destructive: true,
        };
      default:
        return null;
    }
  }, [pending, displayCount, t]);

  const executePending = () => {
    if (pending === "decrement") {
      triggerHaptic("light");
      onDecrement();
      return;
    }
    if (pending === "reset" || pending === "startAgain") {
      triggerHaptic("medium");
      onReset();
    }
  };

  return (
    <View style={styles.root}>
      {onSelectMode ? (
        <TargetModeBar
          modes={modes}
          target={target}
          count={displayCount}
          onSelectMode={onSelectMode}
          onCustom={onCustom}
        />
      ) : null}

      <View style={styles.counterStage}>
        <PartyPopper burstKey={celebrationKey} colors={celebrationColors} />
        <PressableScale
          haptic={false}
          onPress={handleTap}
          scaleTo={0.96}
          hitSlop={TAP_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={t("common.count")}
          accessibilityValue={{ now: displayCount, min: 0, max: target > 0 ? target : undefined }}
          style={styles.tapZone}
        >
          <CounterRing count={displayCount} target={target} complete={complete} />
        </PressableScale>
      </View>

      {complete ? (
        <CompletionBanner onStartAgain={() => setPending("startAgain")} />
      ) : (
        <View style={styles.hintRow}>
          {target > 0 ? (
            <View style={[styles.remainingPill, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("tasbeehUi.remaining", { count: remaining })}
              </ThemedText>
            </View>
          ) : null}
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hintText}>
            {t("tasbeehUi.tapToCount")}
          </ThemedText>
        </View>
      )}

      <ControlBar
        count={displayCount}
        onDecrement={() => setPending("decrement")}
        onReset={() => setPending("reset")}
      />

      <ConfirmDialog
        visible={pending !== null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={confirmCopy?.confirmLabel}
        destructive={confirmCopy?.destructive}
        onConfirm={executePending}
        onClose={() => setPending(null)}
      />
    </View>
  );
}

function TargetModeBar({
  modes,
  target,
  count,
  onSelectMode,
  onCustom,
}: {
  modes: TasbeehMode[];
  target: number;
  count: number;
  onSelectMode: (target: number) => void;
  onCustom?: () => void;
}) {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const isCustom =
    onCustom && target > 0 && !modes.some((mode) => mode.target === target && mode.target > 0);

  const segments = onCustom
    ? [...modes, { label: "custom", target: isCustom ? target : -1 }]
    : modes;
  const selectedIndex = Math.max(
    0,
    segments.findIndex((mode) =>
      mode.target === -1 ? isCustom : mode.target === target && (mode.target > 0 || target === 0),
    ),
  );

  const [trackWidth, setTrackWidth] = useState(0);
  const pad = Spacing.half + 2;
  const gap = Spacing.half;
  const countSegments = segments.length;
  const segmentWidth =
    trackWidth > 0 ? (trackWidth - pad * 2 - gap * (countSegments - 1)) / countSegments : 0;
  const rtl = isRTL();
  const thumbTravel = segmentedThumbOffset(selectedIndex, segmentWidth, gap, rtl);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(thumbTravel, Springs.gentle);
  }, [thumbTravel, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <View
      accessibilityRole="tablist"
      {...ltrControlViewProps()}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={[
        styles.modeTrack,
        chartCoordinateStyle,
        { flexDirection: segmentedTrackDirection(), backgroundColor: colors.muted },
      ]}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.modeThumb,
            segmentedThumbAnchor(pad, rtl),
            { width: segmentWidth, backgroundColor: colors.card, pointerEvents: "none" },
            thumbStyle,
          ]}
        />
      ) : null}

      {modes.map((mode) => {
        const active = mode.target === target;
        const modeName = mode.target > 0 ? mode.label : t("tasbeehUi.unlimited");
        return (
          <PressableScale
            key={mode.label}
            haptic="selection"
            accessibilityRole="tab"
            accessibilityLabel={t("tasbeehUi.modeLabel", { mode: modeName, count })}
            accessibilityState={{ selected: active }}
            onPress={() => onSelectMode(mode.target)}
            style={styles.modeSegment}
          >
            <ThemedText
              type="smallBold"
              style={{ color: active ? colors.accentText : colors.mutedForeground }}
            >
              {mode.label}
            </ThemedText>
          </PressableScale>
        );
      })}
      {onCustom ? (
        <PressableScale
          haptic="selection"
          accessibilityRole="tab"
          accessibilityLabel={t("tasbeehUi.modeLabel", {
            mode: isCustom && target > 0 ? String(target) : t("tasbeehUi.custom"),
            count,
          })}
          accessibilityState={{ selected: !!isCustom }}
          onPress={onCustom}
          style={styles.modeSegment}
        >
          <ThemedText
            type="smallBold"
            style={{ color: isCustom ? colors.accentText : colors.mutedForeground }}
          >
            {isCustom && target > 0 ? String(target) : t("tasbeehUi.custom")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  );
}

function CounterRing({
  count,
  target,
  complete,
}: {
  count: number;
  target: number;
  complete: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const progressTarget = target > 0 ? Math.min(count / target, 1) : 0;
  const progress = useSharedValue(progressTarget);
  const countPop = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    progress.value = reducedMotion ? progressTarget : withSpring(progressTarget, Springs.gentle);
  }, [progress, progressTarget, reducedMotion]);

  useEffect(() => {
    if (count !== prevCount.current) {
      if (!reducedMotion) {
        countPop.value = withSequence(withSpring(1.1, Springs.pop), withSpring(1, Springs.gentle));
      }
      prevCount.current = count;
    }
  }, [count, countPop, reducedMotion]);

  const fill = complete ? tokens.status.success.color : colors.accent;
  const glowOpacity = complete ? 0.28 : 0.12 + progressTarget * 0.14;
  const [displayProgress, setDisplayProgress] = useState(progressTarget);
  const displayRef = useRef(displayProgress);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      displayRef.current = progressTarget;
      setDisplayProgress(progressTarget);
      return;
    }

    const from = displayRef.current;
    const delta = progressTarget - from;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = Math.min(1, (timestamp - start) / 420);
      const eased = 1 - (1 - t) ** 3;
      const value = from + delta * eased;
      displayRef.current = value;
      setDisplayProgress(value);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [progressTarget, reducedMotion]);

  const knob = RING_STROKE + 2;
  const inset = RING_STROKE;

  const countAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countPop.value }],
  }));

  return (
    <View style={[styles.ring, chartCoordinateStyle, { width: RING_SIZE, height: RING_SIZE }]}>
      <View
        style={[
          styles.ringGlow,
          {
            width: RING_SIZE + 36,
            height: RING_SIZE + 36,
            borderRadius: (RING_SIZE + 36) / 2,
            backgroundColor: withAlpha(fill, glowOpacity),
          },
        ]}
      />

      {target > 0 ? (
        <ArcProgressRing
          size={RING_SIZE}
          stroke={RING_STROKE}
          progress={displayProgress}
          fillColor={fill}
          trackColor={tokens.track}
          surfaceColor={colors.card}
          surfaceShadow
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: RING_SIZE / 2,
              borderWidth: RING_STROKE,
              borderColor: withAlpha(colors.accent, 0.35),
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: inset,
              left: inset,
              right: inset,
              bottom: inset,
              borderRadius: RING_SIZE / 2,
              backgroundColor: colors.card,
              ...Shadows.sm,
            }}
          />
        </View>
      )}

      {target > 0 && displayProgress > 0 ? (
        <View
          style={[
            progressRingKnobStyle(RING_SIZE, RING_STROKE, displayProgress, knob),
            styles.knob,
            {
              borderRadius: knob / 2,
              backgroundColor: fill,
              borderColor: colors.card,
            },
          ]}
        />
      ) : null}

      <View style={styles.ringCenter}>
        <View style={[styles.countRow, ltrControlViewProps().style]}>
          <Animated.View style={countAnimStyle}>
            <ThemedText type="display" style={styles.count}>
              {count}
            </ThemedText>
          </Animated.View>
          {target > 0 ? (
            <ThemedText type="header" themeColor="mutedForeground" style={styles.targetSuffix}>
              / {target}
            </ThemedText>
          ) : null}
        </View>

        {target > 0 ? (
          complete ? (
            <View style={[styles.completeBadge, { backgroundColor: tokens.status.success.soft }]}>
              <SymbolView
                name={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
                size={16}
                tintColor={tokens.status.success.color}
              />
              <ThemedText type="smallBold" style={{ color: tokens.status.success.color }}>
                {t("tasbeehUi.complete")}
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehUi.ofTarget", { target })}
            </ThemedText>
          )
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("tasbeehUi.unlimited")}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

function CompletionBanner({ onStartAgain }: { onStartAgain: () => void }) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View style={styles.completionBlock}>
      <View style={[styles.successBanner, { backgroundColor: tokens.status.success.soft }]}>
        <SymbolView
          name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          size={18}
          tintColor={tokens.status.success.color}
        />
        <ThemedText type="smallBold" style={{ color: tokens.status.success.color, flex: 1 }}>
          {t("tasbeehUi.targetReached")}
        </ThemedText>
      </View>
      <PressableScale
        haptic="light"
        onPress={onStartAgain}
        style={[styles.startAgain, { backgroundColor: colors.muted, borderColor: tokens.hairline }]}
      >
        <SymbolView
          name={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
          size={16}
          tintColor={colors.foreground}
        />
        <ThemedText type="smallBold">{t("tasbeehUi.startAgain")}</ThemedText>
      </PressableScale>
    </View>
  );
}

function ControlBar({
  count,
  onDecrement,
  onReset,
}: {
  count: number;
  onDecrement: () => void;
  onReset: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View
      style={[styles.controlBar, { backgroundColor: colors.muted, borderColor: tokens.hairline }]}
    >
      <ControlButton
        icon={{ ios: "minus", android: "remove", web: "remove" }}
        label={t("tasbeehUi.undo")}
        onPress={onDecrement}
        disabled={count <= 0}
      />
      <View style={[styles.controlDivider, { backgroundColor: tokens.hairline }]} />
      <ControlButton
        icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
        label={t("common.reset")}
        onPress={onReset}
      />
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useThemeTokens();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.controlButton, disabled && styles.controlDisabled]}
    >
      <SymbolView
        name={icon}
        size={20}
        tintColor={disabled ? colors.mutedForeground : colors.foreground}
      />
      <ThemedText type="smallBold" themeColor={disabled ? "mutedForeground" : "foreground"}>
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "stretch",
    gap: Spacing.four,
    width: "100%",
  },
  modeTrack: {
    position: "relative",
    padding: Spacing.half + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.half,
    overflow: "hidden",
  },
  modeThumb: {
    position: "absolute",
    top: Spacing.half + 2,
    bottom: Spacing.half + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    ...Shadows.sm,
  },
  modeSegment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    minHeight: 40,
    zIndex: 1,
  },
  counterStage: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    minHeight: TAP_SIZE,
  },
  tapZone: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringGlow: {
    position: "absolute",
    alignSelf: "center",
  },
  knob: {
    position: "absolute",
    borderWidth: 2,
    ...Shadows.sm,
  },
  ringCenter: {
    alignItems: "center",
    gap: Spacing.one,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: Spacing.one,
  },
  count: {
    fontVariant: ["tabular-nums"],
  },
  targetSuffix: {
    fontVariant: ["tabular-nums"],
    opacity: 0.55,
    marginBottom: 6,
  },
  completeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  hintRow: {
    alignItems: "center",
    gap: Spacing.two,
  },
  remainingPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  hintText: {
    textAlign: "center",
  },
  completionBlock: {
    alignItems: "center",
    gap: Spacing.two,
    width: "100%",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    width: "100%",
    justifyContent: "center",
  },
  startAgain: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  controlBar: {
    flexDirection: "row",
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  controlDisabled: {
    opacity: 0.45,
  },
  controlDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
