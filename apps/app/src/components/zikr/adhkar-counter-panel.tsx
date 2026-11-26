import { SymbolView } from "expo-symbols";
import { type ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { AdhkarActionRow } from "@/components/zikr/adhkar-action-row";
import { AdhkarCountBeads, showsBeads } from "@/components/zikr/adhkar-count-beads";
import { CountNumeral } from "@/components/zikr/count-numeral";
import type { ZikrAudioControl } from "@/components/zikr/use-zikr-audio";
import { Springs } from "@/constants/motion";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceSteps } from "@/hooks/use-voice-tasbeeh-steps";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

const RING = 220;
const RING_TV = 200;
const STROKE = 12;

export type AdhkarCounterControls = {
  count: number;
  target: number;
  advancing: boolean;
  onTap: () => void;
  onUndo: () => void;
  onComplete: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  /** "Next: Alhamdulillah ×33" — so the reader can anticipate the next zikr. */
  nextLabel?: string;
  /** Hands-free (D69): drives the action row's Hands-free button; never offered on TV. */
  handsFree?: VoiceSteps;
  /** The zikr's recitation (recorded audio or its Qur'an ayahs): the action row's Play. */
  audio?: ZikrAudioControl;
  /** Hands-free status, inline teach / re-teach (D69). */
  voicePanel?: ReactNode;
};

/**
 * Wide web / tablet landscape / TV counter: a large ring button (the whole
 * ring counts; TV Select), beads for small counts, and the row actions — kept
 * in a fixed side panel so it never scrolls away from the text.
 */
export function AdhkarCounterPanel({
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
}: AdhkarCounterControls) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const chevronBack = useChevronBackward();
  const chevronForward = useChevronForward();
  const tv = isTV();
  const ring = tv ? tvDp(RING_TV) : RING;
  const stroke = tv ? tvDp(STROKE) : STROKE;
  const shown = Math.min(count, target);
  const done = shown >= target;
  const single = target <= 1;
  const accent = done ? tokens.status.success.color : colors.accent;

  const pop = useSharedValue(1);
  const prev = useRef(count);
  useEffect(() => {
    if (count !== prev.current && !reducedMotion) {
      pop.value = withSequence(withSpring(1.1, Springs.pop), withSpring(1, Springs.gentle));
    }
    prev.current = count;
  }, [count, pop, reducedMotion]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const handleTap = () => {
    if (advancing || done) {
      triggerHaptic("light");
      return;
    }
    triggerHaptic(shown + 1 >= target ? "success" : "light");
    onTap();
  };

  const hint = done
    ? t("zikrSession.recited")
    : single
      ? tv
        ? t("zikrSession.selectWhenRecited")
        : t("zikrSession.tapWhenRecited")
      : tv
        ? t("tasbeehUi.tapToCountTv")
        : t("zikrSession.tapRingToCount");

  return (
    <View style={styles.root}>
      <PressableScale
        haptic={false}
        scaleTo={0.96}
        onPress={handleTap}
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
        style={[styles.ringButton, { width: ring, height: ring, borderRadius: ring / 2 }]}
      >
        <View style={[styles.ring, chartCoordinateStyle, { width: ring, height: ring }]}>
          <ArcProgressRing
            size={ring}
            stroke={stroke}
            progress={target > 0 ? shown / target : 0}
            fillColor={accent}
            trackColor={tokens.track}
            surfaceColor={colors.card}
            surfaceShadow
          />
          <Animated.View style={[styles.center, popStyle]}>
            {done || single ? (
              <>
                <SymbolView
                  name={
                    done
                      ? { ios: "checkmark", android: "check", web: "check" }
                      : { ios: "hand.tap.fill", android: "touch_app", web: "touch_app" }
                  }
                  size={tv ? tvDp(48) : 52}
                  tintColor={accent}
                />
                {!done ? (
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.of}>
                    {t("zikrSession.once")}
                  </ThemedText>
                ) : null}
              </>
            ) : (
              <>
                <CountNumeral value={shown} size="hero" color={colors.foreground} />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.of}>
                  {t("tasbeehUi.ofTarget", { target })}
                </ThemedText>
              </>
            )}
          </Animated.View>
        </View>
      </PressableScale>

      {showsBeads(target) ? (
        <AdhkarCountBeads count={shown} target={target} color={accent} size={12} />
      ) : null}

      <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
        {hint}
      </ThemedText>

      {voicePanel}

      <View style={styles.row}>
        <Button
          label={t("zikrSession.previous")}
          variant="ghost"
          icon={chevronBack}
          disabled={!canPrev}
          onPress={onPrev}
          style={styles.flex}
        />
        <Button
          label={t("zikrSession.next")}
          variant="ghost"
          icon={chevronForward}
          disabled={!canNext}
          onPress={onNext}
          style={styles.flex}
        />
      </View>

      {/* TV D-pad order: ring → previous / next → actions. */}
      <View style={styles.actions}>
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

      {nextLabel ? (
        <View style={[styles.next, { backgroundColor: withAlpha(colors.foreground, 0.04) }]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {nextLabel}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: Spacing.three },
  ringButton: { alignItems: "center", justifyContent: "center" },
  ring: { alignItems: "center", justifyContent: "center" },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  of: { fontVariant: ["tabular-nums"] },
  hint: { textAlign: "center" },
  row: { flexDirection: "row", gap: Spacing.two, alignSelf: "stretch" },
  flex: { flex: 1 },
  actions: { alignSelf: "stretch" },
  next: {
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
});
