import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { AdhkarActionRow } from "@/components/zikr/adhkar-action-row";
import { AdhkarCountBeads, showsBeads } from "@/components/zikr/adhkar-count-beads";
import type { AdhkarCounterControls } from "@/components/zikr/adhkar-counter-panel";
import { CountNumeral } from "@/components/zikr/count-numeral";
import { Springs } from "@/constants/motion";
import {
  BorderWidth,
  Breakpoints,
  MaxContentWidth,
  Radius,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

const PAD_HEIGHT = 84;
/** Tablets (portrait): a taller pad — still one thumb reach, easier to hit blind. */
const PAD_HEIGHT_TABLET = 100;

type AdhkarSessionDockProps = AdhkarCounterControls & {
  onHeightChange?: (height: number) => void;
};

const MIC = { ios: "mic.fill", android: "mic", web: "mic" } as const;

/**
 * Session counter dock: one status line ("Next: … ×N" + a small hands-free
 * badge), a wide tap pad within thumb reach (the whole pad counts) flanked by
 * previous / next wells, and one row of equal labelled actions — Undo · Play ·
 * Hands-free · Done (Done turns into Reset once the zikr is complete).
 */
export function AdhkarSessionDock({
  count,
  target,
  advancing,
  onTap,
  onUndo,
  onComplete,
  onReset,
  onPrev,
  onNext,
  canPrev,
  canNext,
  nextLabel,
  handsFree,
  audio,
  voicePanel,
  onHeightChange,
}: AdhkarSessionDockProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useAppSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const chevronBack = useChevronBackward();
  const chevronForward = useChevronForward();
  const tv = isTV();
  // While a zikr is being taught, the (compact) teach panel takes the count
  // pad's place instead of pushing the whole dock up over the reading.
  const teaching = handsFree?.voice.teach.status === "recording";
  const { width } = useWindowDimensions();
  const padHeight = width >= Breakpoints.tablet ? PAD_HEIGHT_TABLET : PAD_HEIGHT;
  const shown = Math.min(count, target);
  const done = shown >= target;
  const single = target <= 1;
  const accent = done ? tokens.status.success.color : colors.accent;

  const [padWidth, setPadWidth] = useState(0);
  const fill = useSharedValue(0);
  const pop = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    const next = padWidth * (target > 0 ? shown / target : 0);
    fill.value = reducedMotion ? next : withTiming(next, { duration: 220 });
  }, [fill, padWidth, reducedMotion, shown, target]);

  useEffect(() => {
    if (count !== prevCount.current && !reducedMotion) {
      pop.value = withSequence(withSpring(1.12, Springs.pop), withSpring(1, Springs.gentle));
    }
    prevCount.current = count;
  }, [count, pop, reducedMotion]);

  const fillStyle = useAnimatedStyle(() => ({ width: fill.value }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const handleTap = () => {
    if (advancing) return;
    if (done) {
      triggerHaptic("light");
      return;
    }
    triggerHaptic(shown + 1 >= target ? "success" : "light");
    onTap();
  };

  const onLayout = (event: LayoutChangeEvent) => {
    onHeightChange?.(event.nativeEvent.layout.height);
  };

  // Short labels: the pad shares its row with previous / next on 360pt phones.
  const padLabel = done
    ? t("zikrSession.recited")
    : single
      ? t("zikrSession.padOnce")
      : t("zikrSession.padCount");
  const roomy = width >= 400;
  const well = withAlpha(colors.foreground, 0.06);
  // Small mic state badge beside "Next: …" while hands-free is on (never on TV).
  const handsFreeBadge =
    handsFree?.on && !tv ? (
      <Pill
        compact
        icon={MIC}
        label={
          handsFree.voice.listening
            ? t("zikrSession.dock.listening")
            : t("zikrSession.dock.handsFreeOn")
        }
        color={colors.accentText}
        background={tokens.accentSoft}
      />
    ) : null;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.shell,
        { borderTopColor: tokens.hairline, paddingBottom: Math.max(insets.bottom, Spacing.two) },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: withAlpha(
              colors.card,
              hasLiquidGlass ? (tokens.isDark ? 0.3 : 0.45) : tokens.isDark ? 0.6 : 0.78,
            ),
          },
        ]}
      />

      <View style={styles.inner}>
        {nextLabel || handsFreeBadge ? (
          <View style={styles.statusLine}>
            {nextLabel ? (
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                numberOfLines={1}
                style={styles.nextLabel}
              >
                {nextLabel}
              </ThemedText>
            ) : null}
            {handsFreeBadge}
          </View>
        ) : null}
        {voicePanel}
        <View style={[styles.padRow, teaching && styles.hidden]}>
          <PressableScale
            haptic="selection"
            scaleTo={0.94}
            disabled={!canPrev}
            accessibilityRole="button"
            accessibilityLabel={t("zikrSession.previous")}
            accessibilityState={{ disabled: !canPrev }}
            onPress={onPrev}
            style={[styles.navWell, { height: padHeight, backgroundColor: well }]}
          >
            <SymbolView
              name={chevronBack}
              size={18}
              tintColor={canPrev ? colors.foreground : colors.mutedForeground}
            />
          </PressableScale>

          <PressableScale
            haptic={false}
            scaleTo={0.97}
            onPress={handleTap}
            onLayout={(event: LayoutChangeEvent) => setPadWidth(event.nativeEvent.layout.width)}
            accessibilityRole="button"
            accessibilityLabel={single ? t("zikrSession.tapWhenRecited") : t("common.count")}
            accessibilityValue={{
              now: shown,
              min: 0,
              max: target,
              text: t("zikr.countOfTarget", { current: shown, target }),
            }}
            accessibilityState={{ disabled: done }}
            {...(tv ? { hasTVPreferredFocus: true } : {})}
            style={[
              styles.pad,
              {
                height: padHeight,
                backgroundColor: withAlpha(accent, tokens.isDark ? 0.16 : 0.1),
                borderColor: withAlpha(accent, tokens.isDark ? 0.5 : 0.35),
              },
            ]}
          >
            <Animated.View
              style={[
                styles.padFill,
                { backgroundColor: withAlpha(accent, tokens.isDark ? 0.32 : 0.22) },
                fillStyle,
              ]}
            />
            <View style={styles.padContent}>
              <Animated.View style={[styles.countBlock, popStyle]}>
                {done || single ? (
                  <SymbolView
                    name={
                      done
                        ? {
                            ios: "checkmark.circle.fill",
                            android: "check_circle",
                            web: "check_circle",
                          }
                        : {
                            ios: "checkmark.circle",
                            android: "radio_button_unchecked",
                            web: "radio_button_unchecked",
                          }
                    }
                    size={30}
                    tintColor={accent}
                  />
                ) : (
                  <CountNumeral value={shown} color={accent} />
                )}
                {!single && !done ? (
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.of}>
                    / {target}
                  </ThemedText>
                ) : null}
              </Animated.View>
              <View style={styles.padCopy}>
                <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.foreground }}>
                  {padLabel}
                </ThemedText>
                {!done && showsBeads(target) ? (
                  <AdhkarCountBeads count={shown} target={target} color={accent} size={9} />
                ) : !done && !single ? (
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {t("tasbeehUi.remaining", { count: target - shown })}
                  </ThemedText>
                ) : null}
              </View>
              {!done && roomy ? (
                <SymbolView
                  name={{ ios: "hand.tap.fill", android: "touch_app", web: "touch_app" }}
                  size={20}
                  tintColor={withAlpha(accent, 0.8)}
                />
              ) : null}
            </View>
          </PressableScale>

          <PressableScale
            haptic="selection"
            scaleTo={0.94}
            disabled={!canNext}
            accessibilityRole="button"
            accessibilityLabel={t("zikrSession.next")}
            accessibilityState={{ disabled: !canNext }}
            onPress={onNext}
            style={[styles.navWell, { height: padHeight, backgroundColor: well }]}
          >
            <SymbolView
              name={chevronForward}
              size={18}
              tintColor={canNext ? colors.foreground : colors.mutedForeground}
            />
          </PressableScale>
        </View>

        <AdhkarActionRow
          done={done}
          canUndo={shown > 0}
          onUndo={onUndo}
          onComplete={onComplete}
          onReset={onReset}
          audio={audio}
          handsFree={handsFree}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    borderTopWidth: BorderWidth.hairline,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    gap: Spacing.two,
  },
  padRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  hidden: { display: "none" },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  nextLabel: { flexShrink: 1, textAlign: "center" },
  navWell: {
    width: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  pad: {
    flex: 1,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    overflow: "hidden",
    justifyContent: "center",
  },
  padFill: { position: "absolute", top: 0, bottom: 0, start: 0 },
  padContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  countBlock: { flexDirection: "row", alignItems: "baseline", gap: Spacing.half, minWidth: 56 },
  of: { fontVariant: ["tabular-nums"] },
  padCopy: { flex: 1, minWidth: 0, gap: 1 },
});
