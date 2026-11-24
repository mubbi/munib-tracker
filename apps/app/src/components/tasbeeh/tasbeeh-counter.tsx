import { SymbolView } from "expo-symbols";
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  AccessibilityInfo,
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
  withSpring,
} from "react-native-reanimated";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TasbeehFace } from "@/components/tasbeeh/faces/tasbeeh-face";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { TasbeehDesignNote } from "@/components/tasbeeh/tasbeeh-design-note";
import { TasbeehStyleSheet } from "@/components/tasbeeh/tasbeeh-style-sheet";
import { VoiceListeningPanel } from "@/components/tasbeeh/voice/voice-listening-panel";
import { VoiceTasbeehSheet } from "@/components/tasbeeh/voice/voice-tasbeeh-sheet";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { NO_VOICE, useVoiceTasbeeh, type VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import {
  chartCoordinateStyle,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
} from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { useHingePosture } from "@/lib/platform/hinge";
import { isTV } from "@/lib/platform/is-tv";
import { isRTL, ltrControlViewProps } from "@/lib/rtl";
import { getDesign, resolveSoundPack, strandModelFor } from "@/lib/tasbeeh/designs";
import {
  countEventFor,
  feedbackFor,
  HAPTIC_PULSE_GAP_MS,
  type TasbeehFeedbackEvent,
} from "@/lib/tasbeeh/feedback";
import { materialFor } from "@/lib/tasbeeh/materials";
import { roundSizeFor } from "@/lib/tasbeeh/rounds";
import { useTasbeehAppearance } from "@/lib/tasbeeh/use-tasbeeh-appearance";
import { useTasbeehSound } from "@/lib/tasbeeh/use-tasbeeh-sound";
import type { PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import { effectiveAnnouncements } from "@/lib/tasbeeh-voice/session";
import { AudioContext } from "@/providers/audio-player-context";
import { usePreferences } from "@/stores/preferences-store";

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
const TAP_PADDING = 48;
const TAP_PADDING_TV = 32;
/** After a face gesture counts, ignore the stage tap it may also produce (web click). */
const GESTURE_TAP_GUARD_MS = 350;
/** While listening, the spotter ignores audio for this long after a screen-reader announcement. */
const ANNOUNCE_MUTE_MS = 1800;

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
  /**
   * Hands-free counting (NF-3.20): the catalog phrase this counter listens for.
   * Null/absent → no voice toggle (unless `voiceChoosable`).
   */
  voicePhrase?: PhraseKey | null;
  /** Free counter: the user picks a catalog phrase in the hands-free sheet. */
  voiceChoosable?: boolean;
};

type PendingConfirm = "decrement" | "reset" | "startAgain";

/**
 * The tasbeeh counter shell (NF-3.19): everything that is not visual — mode
 * bar, controls, confirm dialogs, completion, the target limit, web Space /
 * Enter, TV focus, tabletop pad, accessibility, and haptic + sound dispatch.
 * The look comes from the chosen face (`faces/*`); Ring is the default (D10).
 * Every count — tap, Select, keyboard, screen-reader action or a face gesture —
 * goes through one `countOnce()` path (NF-3.20 voice counting will too).
 */
export function TasbeehCounter(props: TasbeehCounterProps) {
  // Hands-free counting (NF-3.20) only mounts the microphone / model plumbing on
  // counters that can listen; every other counter renders without it (and TV
  // never has a microphone path).
  const voiceWanted = (props.voicePhrase != null || props.voiceChoosable === true) && !isTV();
  return voiceWanted ? <VoiceTasbeehCounter {...props} /> : <CounterView {...props} />;
}

function VoiceTasbeehCounter(props: TasbeehCounterProps) {
  const { count, target, voicePhrase = null, voiceChoosable = false } = props;
  const [chosenPhrase, setChosenPhrase] = useState<PhraseKey | null>(null);
  const activePhrase = voicePhrase ?? (voiceChoosable ? chosenPhrase : null);
  const countOnceRef = useRef<() => void>(() => {});
  const voice = useVoiceTasbeeh({
    phrase: activePhrase,
    atLimit: target > 0 && count >= target,
    onVoiceCount: () => countOnceRef.current(),
  });
  return (
    <CounterView
      {...props}
      voice={voice}
      activePhrase={activePhrase}
      onChoosePhrase={setChosenPhrase}
      countOnceRef={countOnceRef}
    />
  );
}

type CounterViewProps = TasbeehCounterProps & {
  voice?: VoiceTasbeeh;
  activePhrase?: PhraseKey | null;
  onChoosePhrase?: (phrase: PhraseKey) => void;
  /** Filled with the shell's countOnce() so a recognised phrase counts like a tap. */
  countOnceRef?: { current: () => void };
};

function CounterView({
  count,
  target,
  onIncrement,
  onDecrement,
  onReset,
  modes = TASBEEH_MODES,
  onSelectMode,
  onCustom,
  keyboardShortcuts = true,
  voicePhrase = null,
  voiceChoosable = false,
  voice = NO_VOICE,
  activePhrase = null,
  onChoosePhrase,
  countOnceRef,
}: CounterViewProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [styleOpen, setStyleOpen] = useState(false);
  const tv = isTV();
  const reduceMotion = useReducedMotion();
  const appearance = useTasbeehAppearance();
  const design = getDesign(appearance.design);
  // Foldables (iPhone Duo, Android foldables) in tabletop posture: the count stays
  // readable on the upper half and a full-width tap pad fills the lower half. The
  // hinge drives this interaction only — layout still follows window size.
  const tabletop = useHingePosture() === "halfOpen" && !tv;
  // TV: the stage is the one big Select target (preferred focus). A landscape
  // layout puts modes / undo / reset in a side column so the card fits the
  // 540dp viewport and Reset is never the next thing below the counter.
  const ringSize = tv ? tvDp(RING_SIZE_TV) : RING_SIZE;
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

  // Feedback: one table for every design (lib/tasbeeh/feedback.ts).
  const strand = useMemo(
    () => (design.id === "misbaha" ? strandModelFor(appearance.misbaha, target) : undefined),
    [design.id, appearance.misbaha, target],
  );
  // Round-based v2 designs (pebbles, fingers, rosette, night sky) mark each finished round.
  const roundSize = roundSizeFor(design.id, target, appearance);
  const sharedPlaying = useContext(AudioContext)?.isPlaying ?? false;
  const playSound = useTasbeehSound({
    enabled: appearance.sound.enabled,
    pack: resolveSoundPack(
      appearance,
      materialFor(appearance.misbaha.material, colors.accent).sound,
    ),
    volume: appearance.sound.volume,
    sharedPlaying,
  });
  // Counter sounds are muted while hands-free listening (the mic would hear
  // them); haptics stay on.
  const voiceListeningRef = useRef(false);
  const dispatch = useCallback(
    (event: TasbeehFeedbackEvent) => {
      const feedback = feedbackFor(design.id, event, appearance.haptics);
      feedback.haptics.forEach((haptic, index) => {
        if (index === 0) triggerHaptic(haptic);
        else setTimeout(() => triggerHaptic(haptic), index * HAPTIC_PULSE_GAP_MS);
      });
      if (feedback.sound && appearance.sound.enabled && !voiceListeningRef.current) {
        playSound(feedback.sound);
      }
    },
    [design.id, appearance.haptics, appearance.sound.enabled, playSound],
  );

  // Hands-free counting (NF-3.20): recognised phrases go through countOnce() too.
  const { tasbeehAnnouncements } = usePreferences();
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  voiceListeningRef.current = voice.listening;
  const voiceOffered = voice.platformAvailable && (voicePhrase != null || voiceChoosable);
  // Screen-reader speech must not be counted: the spotter ignores audio meanwhile.
  const muteVoiceRef = useRef<((durationMs: number) => void) | null>(null);
  muteVoiceRef.current = voice.listening ? voice.muteFor : null;
  const announce = useCallback((message: string) => {
    muteVoiceRef.current?.(ANNOUNCE_MUTE_MS);
    AccessibilityInfo.announceForAccessibility?.(message);
  }, []);
  const handleVoicePress = async () => {
    if (voice.listening || voice.preparing) {
      voice.stop("user");
      return;
    }
    if (!activePhrase) {
      setVoiceSheetOpen(true);
      return;
    }
    const result = await voice.start();
    if (result !== "started") setVoiceSheetOpen(true);
  };

  useEffect(() => {
    if (complete && !prevComplete.current) {
      dispatch("complete");
      if (design.celebrates) setCelebrationKey((key) => key + 1);
      if (tasbeehAnnouncements !== "off") announce(t("tasbeehUi.targetReached"));
    }
    prevComplete.current = complete;
  }, [complete, dispatch, design.celebrates, t, tasbeehAnnouncements, announce]);

  // The single counting path (tap, Select, Space / Enter, a11y action, face gesture, voice).
  const gestureActive = useRef(false);
  const tapGuardUntil = useRef(0);
  const countOnce = () => {
    if (atLimit) {
      dispatch("limit");
      return;
    }
    const next = displayCount + 1;
    const event = countEventFor(
      design.id,
      next,
      strand,
      roundSize ? { size: roundSize, target } : undefined,
    );
    dispatch(event);
    const frequency = effectiveAnnouncements(tasbeehAnnouncements ?? "milestones", voice.listening);
    if (event !== "bead" && frequency !== "off") {
      announce(t("tasbeehDesigns.a11y.milestone", { number: next }));
    } else if (frequency === "every") {
      announce(t("tasbeehVoice.a11y.count", { number: next }));
    }
    onIncrement();
  };
  if (countOnceRef) countOnceRef.current = countOnce;
  const handleTap = () => {
    if (gestureActive.current || Date.now() < tapGuardUntil.current) return;
    countOnce();
  };
  const handleFaceCount = () => {
    tapGuardUntil.current = Date.now() + GESTURE_TAP_GUARD_MS;
    countOnce();
  };
  const handleGestureActive = (active: boolean) => {
    gestureActive.current = active;
    if (!active) tapGuardUntil.current = Math.max(tapGuardUntil.current, Date.now() + 120);
  };
  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    const action = event.nativeEvent.actionName;
    if (action === "increment" || action === "activate") countOnce();
  };

  // Desktop web: Space / Enter count. A focused button / chip keeps its own
  // Space / Enter (so nothing fires twice); held keys don't auto-repeat counts.
  const { width: windowWidth } = useWindowDimensions();
  const keyboardHint = Platform.OS === "web" && !tv && windowWidth >= 768;
  useWebScreenKeyHandler(
    (event) => {
      if (event.key !== " " && event.key !== "Enter") return undefined;
      if (isWebInteractiveTarget(event.target)) return undefined;
      if (!event.repeat) countOnce();
      return true;
    },
    !tv && keyboardShortcuts && pending === null && !styleOpen,
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

  const ring = design.id === "ring";
  let hint: string;
  if (ring) {
    hint = keyboardHint
      ? t("tasbeehUi.tapToCountKeyboard")
      : tTv(t, "tasbeehUi.tapToCount", "tasbeehUi.tapToCountTv");
  } else if (keyboardHint) {
    hint = t("tasbeehDesigns.hint.keyboard");
  } else if (tv) {
    hint = t("tasbeehUi.tapToCountTv");
  } else {
    hint =
      design.id === "misbaha" ? t("tasbeehDesigns.hint.misbaha") : t("tasbeehDesigns.hint.tap");
  }

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
        {hint}
      </ThemedText>
    </View>
  );

  const controls = (
    <ControlBar
      count={displayCount}
      onDecrement={() => setPending("decrement")}
      onReset={() => setPending("reset")}
      onStyle={() => setStyleOpen(true)}
      voice={
        voiceOffered
          ? { active: voice.listening || voice.preparing, onPress: () => void handleVoicePress() }
          : undefined
      }
    />
  );

  const voicePanel =
    voiceOffered && activePhrase ? (
      <VoiceListeningPanel
        phrase={activePhrase}
        listening={voice.listening}
        preparing={voice.preparing}
        level={voice.level}
        stuck={voice.stuck}
        flashKey={voice.flashKey}
        stopReason={voice.session.stopReason}
        showFocusTip={design.id !== "minimal"}
      />
    ) : null;

  const fullWidth = design.id === "minimal";
  let stageStyle: StyleProp<ViewStyle>;
  if (ring) stageStyle = { width: ringSize, height: ringSize, borderRadius: ringSize / 2 };
  else if (fullWidth) stageStyle = { alignSelf: "stretch", borderRadius: Radius.lg };
  else stageStyle = { width: ringSize, borderRadius: Radius.lg };

  return (
    <Fragment>
      <View style={[styles.root, tv && styles.rootTv]}>
        {tv ? null : modeBar}

        <View
          style={[
            styles.counterStage,
            ring && { minHeight: tapSize },
            tv && { width: tapSize },
            fullWidth && styles.counterStageFull,
          ]}
        >
          {design.celebrates ? (
            <PartyPopper burstKey={celebrationKey} colors={celebrationColors} />
          ) : null}
          <PressableScale
            haptic={false}
            onPress={handleTap}
            scaleTo={ring ? 0.96 : 0.99}
            hitSlop={ring ? tapHitSlop : undefined}
            accessibilityRole="button"
            accessibilityLabel={t("common.count")}
            accessibilityHint={ring ? undefined : hint}
            accessibilityValue={{ now: displayCount, min: 0, max: target > 0 ? target : undefined }}
            accessibilityActions={[{ name: "increment", label: t("common.count") }]}
            onAccessibilityAction={handleAccessibilityAction}
            {...(tv ? { hasTVPreferredFocus: true } : {})}
            style={[styles.tapZone, stageStyle]}
          >
            <TasbeehFace
              count={displayCount}
              target={target}
              complete={complete}
              size={ringSize}
              tv={tv}
              reduceMotion={reduceMotion}
              appearance={appearance}
              onCount={handleFaceCount}
              onGestureActive={handleGestureActive}
              tabletop={tabletop}
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
            {voicePanel}
            {controls}
            <TasbeehDesignNote design={design.id} />
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
      <TasbeehStyleSheet visible={styleOpen} onClose={() => setStyleOpen(false)} />
      {voiceOffered ? (
        <VoiceTasbeehSheet
          visible={voiceSheetOpen}
          onClose={() => setVoiceSheetOpen(false)}
          voice={voice}
          choosable={voiceChoosable && voicePhrase == null}
          phrase={activePhrase}
          onChoosePhrase={(phrase) => onChoosePhrase?.(phrase)}
        />
      ) : null}
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

const PALETTE_ICON = { ios: "paintpalette.fill", android: "palette", web: "palette" } as const;

function ControlBar({
  count,
  onDecrement,
  onReset,
  onStyle,
  voice,
}: {
  count: number;
  onDecrement: () => void;
  onReset: () => void;
  /** Opens the "Counter style" sheet (NF-3.19). */
  onStyle?: () => void;
  /** Hands-free toggle (NF-3.20); never offered on TV (no microphone path). */
  voice?: { active: boolean; onPress: () => void };
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
        {onStyle ? (
          <ControlButton
            icon={PALETTE_ICON}
            label={t("tasbeehDesigns.styleButton")}
            onPress={onStyle}
            style={pill}
          />
        ) : null}
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
      {onStyle ? (
        <>
          <ControlButton
            icon={PALETTE_ICON}
            label={t("tasbeehDesigns.styleButton")}
            onPress={onStyle}
          />
          <View style={[styles.controlDivider, { backgroundColor: tokens.hairline }]} />
        </>
      ) : null}
      {voice ? (
        <>
          <ControlButton
            icon={
              voice.active
                ? { ios: "mic.slash.fill", android: "mic_off", web: "mic_off" }
                : { ios: "mic.fill", android: "mic", web: "mic" }
            }
            label={voice.active ? t("tasbeehVoice.toggle.stop") : t("tasbeehVoice.toggle.start")}
            accessibilityLabel={
              voice.active ? t("tasbeehVoice.toggle.a11yStop") : t("tasbeehVoice.toggle.a11yStart")
            }
            selected={voice.active}
            onPress={voice.onPress}
          />
          <View style={[styles.controlDivider, { backgroundColor: tokens.hairline }]} />
        </>
      ) : null}
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
  accessibilityLabel,
  onPress,
  disabled = false,
  selected,
  style,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  disabled?: boolean;
  /** Toggle buttons (hands-free) report their on/off state. */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useThemeTokens();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={selected === undefined ? { disabled } : { disabled, selected }}
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
  counterStageFull: {
    alignSelf: "stretch",
    alignItems: "stretch",
  },
  tapZone: {
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
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
