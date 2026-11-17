import { SymbolView } from "expo-symbols";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
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
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import {
  chartCoordinateStyle,
  progressRingKnobStyle,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
} from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { useHingePosture } from "@/lib/platform/hinge";
import { isTV } from "@/lib/platform/is-tv";
import { isRTL, ltrControlViewProps } from "@/lib/rtl";

export type TasbeehMode = { label: string; target: number };

export const TASBEEH_MODES: TasbeehMode[] = [
  { label: "33", target: 33 },
  { label: "99", target: 99 },
  { label: "100", target: 100 },
  { label: "∞", target: 0 },
];

const RING_SIZE = 272;
/** TV: landscape stage beside the controls — sized so the whole card fits 540dp. */
const RING_SIZE_TV = 288;
const RING_STROKE = 14;
const TAP_PADDING = 48;
const TAP_PADDING_TV = 32;
const RING_GLOW = 36;

type TasbeehCounterProps = {
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  modes?: TasbeehMode[];
  onSelectMode?: (target: number) => void;
  onCustom?: () => void;
  /**
   * Desktop web: Space / Enter count while no field or control has focus.
   * Screens pass `false` while one of their own modals is open.
   */
  keyboardShortcuts?: boolean;
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
  keyboardShortcuts = true,
}: TasbeehCounterProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const tv = isTV();
  // Foldables (iPhone Duo, Android foldables) in tabletop posture: the count stays
  // readable on the upper half and a full-width tap pad fills the lower half. The
  // hinge drives this interaction only — layout still follows window size.
  const tabletop = useHingePosture() === "halfOpen" && !tv;
  // TV: the ring is the one big Select target (preferred focus). A landscape
  // layout puts modes / undo / reset in a side column so the card fits the
  // 540dp viewport and Reset is never the next thing below the counter.
  const ringSize = tv ? tvDp(RING_SIZE_TV) : RING_SIZE;
  const ringStroke = tv ? tvDp(RING_STROKE) : RING_STROKE;
  const tapSize = ringSize + (tv ? tvDp(TAP_PADDING_TV) : TAP_PADDING);
  const tapHitSlop = (tapSize - ringSize) / 2;
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

  // Desktop web: Space / Enter count. A focused button / chip keeps its own
  // Space / Enter (so nothing fires twice); held keys don't auto-repeat counts.
  const { width: windowWidth } = useWindowDimensions();
  const keyboardHint = Platform.OS === "web" && !tv && windowWidth >= 768;
  useWebScreenKeyHandler(
    (event) => {
      if (event.key !== " " && event.key !== "Enter") return undefined;
      if (isWebInteractiveTarget(event.target)) return undefined;
      if (!event.repeat) handleTap();
      return true;
    },
    !tv && keyboardShortcuts && pending === null,
  );

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

  const modeBar = onSelectMode ? (
    <TargetModeBar
      modes={modes}
      target={target}
      count={displayCount}
      onSelectMode={onSelectMode}
      onCustom={onCustom}
    />
  ) : null;

  const status = complete ? (
    <CompletionBanner onStartAgain={() => setPending("startAgain")} />
  ) : (
    <View style={[styles.hintRow, tv && styles.hintRowTv]}>
      {target > 0 ? (
        <View style={[styles.remainingPill, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("tasbeehUi.remaining", { count: remaining })}
          </ThemedText>
        </View>
      ) : null}
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        style={[styles.hintText, tv && styles.hintTextTv]}
      >
        {keyboardHint
          ? t("tasbeehUi.tapToCountKeyboard")
          : tTv(t, "tasbeehUi.tapToCount", "tasbeehUi.tapToCountTv")}
      </ThemedText>
    </View>
  );

  const controls = (
    <ControlBar
      count={displayCount}
      onDecrement={() => setPending("decrement")}
      onReset={() => setPending("reset")}
    />
  );

  return (
    <Fragment>
      <View style={[styles.root, tv && styles.rootTv]}>
        {tv ? null : modeBar}

        <View style={[styles.counterStage, { minHeight: tapSize }, tv && { width: tapSize }]}>
          <PartyPopper burstKey={celebrationKey} colors={celebrationColors} />
          <PressableScale
            haptic={false}
            onPress={handleTap}
            scaleTo={0.96}
            hitSlop={tapHitSlop}
            accessibilityRole="button"
            accessibilityLabel={t("common.count")}
            accessibilityValue={{ now: displayCount, min: 0, max: target > 0 ? target : undefined }}
            {...(tv ? { hasTVPreferredFocus: true } : {})}
            style={[
              styles.tapZone,
              { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
            ]}
          >
            <CounterRing
              count={displayCount}
              target={target}
              complete={complete}
              ringSize={ringSize}
              ringStroke={ringStroke}
            />
          </PressableScale>
        </View>

        {tv ? (
          <View style={styles.tvSide}>
            {modeBar}
            {status}
            {controls}
          </View>
        ) : (
          <>
            {status}
            {controls}
            {tabletop ? (
              <PressableScale
                haptic={false}
                onPress={handleTap}
                scaleTo={0.98}
                accessibilityRole="button"
                accessibilityLabel={t("common.count")}
                accessibilityHint={t("tasbeehUi.tapToCount")}
                style={[
                  styles.tabletopPad,
                  {
                    backgroundColor: tokens.accentSoft,
                    borderColor: withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
                  },
                ]}
              >
                <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                  {t("tasbeehUi.tapToCount")}
                </ThemedText>
              </PressableScale>
            ) : null}
          </>
        )}
      </View>

      {/* Sibling of the animated counter tree so Fabric + Reanimated cannot
          zero-out Modal hit-testing after the completion celebration. */}
      <ConfirmDialog
        visible={pending !== null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={confirmCopy?.confirmLabel}
        destructive={confirmCopy?.destructive}
        onConfirm={executePending}
        onClose={() => setPending(null)}
      />
    </Fragment>
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
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
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
            { width: segmentWidth, backgroundColor: tokens.segmentThumb, pointerEvents: "none" },
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
            style={[styles.modeSegment, tv && styles.modeSegmentTv]}
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
          style={[styles.modeSegment, tv && styles.modeSegmentTv]}
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
  ringSize,
  ringStroke,
}: {
  count: number;
  target: number;
  complete: boolean;
  ringSize: number;
  ringStroke: number;
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

  const knob = ringStroke + 2;
  const inset = ringStroke;
  const glow = ringSize + (isTV() ? tvDp(RING_GLOW) : RING_GLOW);

  const countAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countPop.value }],
  }));

  return (
    <View style={[styles.ring, chartCoordinateStyle, { width: ringSize, height: ringSize }]}>
      <View
        style={[
          styles.ringGlow,
          {
            width: glow,
            height: glow,
            borderRadius: glow / 2,
            backgroundColor: withAlpha(fill, glowOpacity),
          },
        ]}
      />

      {target > 0 ? (
        <ArcProgressRing
          size={ringSize}
          stroke={ringStroke}
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
              borderRadius: ringSize / 2,
              borderWidth: ringStroke,
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
              borderRadius: ringSize / 2,
              backgroundColor: colors.card,
              ...Shadows.sm,
            }}
          />
        </View>
      )}

      {target > 0 && displayProgress > 0 ? (
        <View
          style={[
            progressRingKnobStyle(ringSize, ringStroke, displayProgress, knob),
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
        style={[
          styles.startAgain,
          isTV() && styles.startAgainTv,
          { backgroundColor: colors.muted, borderColor: tokens.hairline },
        ]}
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

  if (isTV()) {
    // TV: separate pills stacked vertically — Undo first, Reset last with a
    // gap — so a stray D-pad move off the counter never lands next to Reset.
    // Both still go through the confirm dialog.
    const pill = [
      styles.controlPillTv,
      { backgroundColor: colors.muted, borderColor: tokens.hairline },
    ];
    return (
      <View style={styles.controlColumnTv}>
        <ControlButton
          icon={{ ios: "minus", android: "remove", web: "remove" }}
          label={t("tasbeehUi.undo")}
          onPress={onDecrement}
          disabled={count <= 0}
          style={pill}
        />
        <ControlButton
          icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
          label={t("common.reset")}
          onPress={onReset}
          style={pill}
        />
      </View>
    );
  }

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
  style,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useThemeTokens();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.controlButton, style, disabled && styles.controlDisabled]}
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
  tabletopPad: {
    alignSelf: "stretch",
    minHeight: 160,
    marginTop: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    alignItems: "stretch",
    gap: Spacing.four,
    width: "100%",
  },
  rootTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.five,
  },
  tvSide: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.four,
    justifyContent: "center",
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
  modeSegmentTv: {
    minHeight: TvLayout.chipMinHeight,
  },
  counterStage: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  tapZone: {
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
  hintRowTv: {
    alignItems: "flex-start",
  },
  hintText: {
    textAlign: "center",
  },
  hintTextTv: {
    textAlign: "auto",
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
  startAgainTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.four,
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
  controlColumnTv: {
    gap: Spacing.four,
  },
  controlPillTv: {
    flex: 0,
    minHeight: TvLayout.minFocusTarget,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  controlDisabled: {
    opacity: 0.45,
  },
  controlDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
