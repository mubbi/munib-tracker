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
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { AdhkarCountBeads, showsBeads } from "@/components/zikr/adhkar-count-beads";
import type { AdhkarCounterControls } from "@/components/zikr/adhkar-counter-panel";
import { Springs } from "@/constants/motion";
import { MaxContentWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
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

/**
 * Session counter dock: a wide tap pad within thumb reach (the whole pad
 * counts), flanked by previous / next, with Undo and a quick "Mark complete"
 * for adhkar already recited away from the app.
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
  voiceToggle,
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
  const { width } = useWindowDimensions();
  const padHeight = width >= 768 ? PAD_HEIGHT_TABLET : PAD_HEIGHT;
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
        {voicePanel}
        <View style={styles.padRow}>
          <IconButton
            name={chevronBack}
            size={18}
            hitTarget={tv ? TvLayout.minFocusTargetDp : 44}
            tintColor={canPrev ? colors.foreground : colors.mutedForeground}
            background={withAlpha(colors.foreground, 0.06)}
            disabled={!canPrev}
            accessibilityLabel={t("zikrSession.previous")}
            onPress={onPrev}
          />

          <PressableScale
            haptic={false}
            scaleTo={0.97}
            onPress={handleTap}
            onLayout={(event: LayoutChangeEvent) => setPadWidth(event.nativeEvent.layout.width)}
            accessibilityRole="button"
            accessibilityLabel={single ? t("zikrSession.tapWhenRecited") : t("common.count")}
            accessibilityValue={{ now: shown, min: 0, max: target }}
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
                  <ThemedText style={[styles.count, { color: accent }]}>{shown}</ThemedText>
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

          <IconButton
            name={chevronForward}
            size={18}
            hitTarget={tv ? TvLayout.minFocusTargetDp : 44}
            tintColor={canNext ? colors.foreground : colors.mutedForeground}
            background={withAlpha(colors.foreground, 0.06)}
            disabled={!canNext}
            accessibilityLabel={t("zikrSession.next")}
            onPress={onNext}
          />
        </View>

        <View style={styles.actions}>
          <PressableScale
            haptic="light"
            disabled={shown <= 0}
            accessibilityRole="button"
            accessibilityLabel={t("tasbeehUi.undo")}
            onPress={onUndo}
            style={[styles.action, { opacity: shown > 0 ? 1 : 0.45 }]}
          >
            <SymbolView
              name={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
              size={14}
              tintColor={colors.mutedForeground}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehUi.undo")}
            </ThemedText>
          </PressableScale>

          {voiceToggle}

          {done ? (
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityHint={t("zikrSession.resetHint")}
              onPress={onReset}
              style={styles.action}
            >
              <SymbolView
                name={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
                size={14}
                tintColor={colors.mutedForeground}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zikrSession.markNotDone")}
              </ThemedText>
            </PressableScale>
          ) : (
            <PressableScale
              haptic="success"
              accessibilityRole="button"
              accessibilityHint={t("zikrSession.markCompleteHint")}
              onPress={onComplete}
              style={[styles.action, styles.completeAction, { backgroundColor: tokens.accentSoft }]}
            >
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={13}
                tintColor={colors.accentText}
              />
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("zikrSession.markComplete")}
              </ThemedText>
            </PressableScale>
          )}
        </View>
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
    borderTopWidth: StyleSheet.hairlineWidth,
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
  nextLabel: { textAlign: "center", paddingHorizontal: Spacing.five },
  pad: {
    flex: 1,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
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
  countBlock: { flexDirection: "row", alignItems: "baseline", gap: 2, minWidth: 56 },
  count: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  of: { fontVariant: ["tabular-nums"] },
  padCopy: { flex: 1, minWidth: 0, gap: 1 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.one,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 2,
    minHeight: 36,
    borderRadius: 999,
  },
  completeAction: { paddingHorizontal: Spacing.three },
});
