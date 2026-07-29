import { SymbolView } from "expo-symbols";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { MaxContentWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { ltrControlViewProps } from "@/lib/rtl";

const RING_SIZE = 64;
const RING_STROKE = 5;

type TasbeehCounterBarProps = {
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onHeightChange?: (height: number) => void;
};

/**
 * Sticky bottom chrome so tasbeeh counting stays reachable while long
 * Arabic/reading text pushes the main counter below the fold — same glass
 * material language as {@link ZakatSummaryBar}.
 */
export function TasbeehCounterBar({
  count,
  target,
  onIncrement,
  onDecrement,
  onHeightChange,
}: TasbeehCounterBarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const [confirmUndo, setConfirmUndo] = useState(false);
  const displayCount = target > 0 ? Math.min(count, target) : count;
  const atLimit = target > 0 && count >= target;
  const complete = atLimit;
  const remaining = target > 0 ? Math.max(target - displayCount, 0) : 0;
  const accent = complete ? tokens.status.success.color : colors.accent;

  const onLayout = (event: LayoutChangeEvent) => {
    onHeightChange?.(event.nativeEvent.layout.height);
  };

  const handleTap = () => {
    if (atLimit) {
      triggerHaptic("light");
      return;
    }
    triggerHaptic("light");
    onIncrement();
  };

  return (
    <Fragment>
      <View
        onLayout={onLayout}
        accessibilityRole="text"
        style={[
          styles.shell,
          {
            borderTopColor: tokens.hairline,
            paddingBottom: Math.max(insets.bottom, Spacing.two),
          },
        ]}
      >
        {/* No `backdropCapture`: bar lives inside the root BlurTargetView — same
            as zakat-summary-bar / page-reader-footer. */}
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
                hasLiquidGlass ? (tokens.isDark ? 0.28 : 0.4) : tokens.isDark ? 0.55 : 0.7,
              ),
            },
          ]}
        />

        <View style={styles.inner}>
          <View style={[styles.iconWell, { backgroundColor: withAlpha(accent, 0.14) }]}>
            <SymbolView
              name={{
                ios: complete ? "checkmark.seal.fill" : "hand.tap.fill",
                android: complete ? "verified" : "touch_app",
                web: complete ? "verified" : "touch_app",
              }}
              size={18}
              tintColor={accent}
            />
          </View>

          <View style={styles.copy}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehUi.dockLabel")}
            </ThemedText>
            <View style={[styles.countRow, ltrControlViewProps().style]}>
              <ThemedText type="smallBold" style={[styles.countText, { color: accent }]}>
                {displayCount}
              </ThemedText>
              {target > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.targetSuffix}>
                  / {target}
                </ThemedText>
              ) : null}
            </View>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {complete
                ? t("tasbeehUi.targetReached")
                : target > 0
                  ? t("tasbeehUi.remaining", { count: remaining })
                  : t("tasbeehUi.unlimited")}
            </ThemedText>
          </View>

          <IconButton
            name={{
              ios: "minus",
              android: "remove",
              web: "remove",
            }}
            size={18}
            hitTarget={44}
            tintColor={displayCount > 0 ? colors.foreground : colors.mutedForeground}
            background={
              displayCount > 0
                ? withAlpha(colors.foreground, 0.08)
                : withAlpha(colors.mutedForeground, 0.08)
            }
            disabled={displayCount <= 0}
            accessibilityLabel={t("tasbeehUi.undo")}
            onPress={() => setConfirmUndo(true)}
          />

          <MiniCounterRing
            count={displayCount}
            target={target}
            complete={complete}
            atLimit={atLimit}
            onPress={handleTap}
          />
        </View>
      </View>

      <ConfirmDialog
        visible={confirmUndo}
        title={t("tasbeehUi.confirmUndoTitle")}
        message={t("tasbeehUi.confirmUndoMessage")}
        confirmLabel={t("tasbeehUi.undo")}
        onConfirm={() => {
          triggerHaptic("light");
          onDecrement();
        }}
        onClose={() => setConfirmUndo(false)}
      />
    </Fragment>
  );
}

function MiniCounterRing({
  count,
  target,
  complete,
  atLimit,
  onPress,
}: {
  count: number;
  target: number;
  complete: boolean;
  atLimit: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const progressTarget = target > 0 ? Math.min(count / target, 1) : 0;
  const countPop = useSharedValue(1);
  const prevCount = useRef(count);
  const fill = complete ? tokens.status.success.color : colors.accent;

  useEffect(() => {
    if (count !== prevCount.current) {
      if (!reducedMotion) {
        countPop.value = withSequence(withSpring(1.12, Springs.pop), withSpring(1, Springs.gentle));
      }
      prevCount.current = count;
    }
  }, [count, countPop, reducedMotion]);

  const countAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countPop.value }],
  }));

  return (
    <PressableScale
      haptic={false}
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      accessibilityLabel={t("common.count")}
      accessibilityState={{ disabled: atLimit }}
      accessibilityValue={{ now: count, min: 0, max: target > 0 ? target : undefined }}
      style={[styles.miniTap, { opacity: atLimit && !complete ? 0.7 : 1 }]}
    >
      <View
        style={[styles.miniRing, chartCoordinateStyle, { width: RING_SIZE, height: RING_SIZE }]}
      >
        {target > 0 ? (
          <ArcProgressRing
            size={RING_SIZE}
            stroke={RING_STROKE}
            progress={progressTarget}
            fillColor={fill}
            trackColor={tokens.track}
            surfaceColor={colors.card}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: RING_SIZE / 2,
                borderWidth: RING_STROKE,
                borderColor: withAlpha(colors.accent, 0.4),
                backgroundColor: colors.card,
              },
            ]}
          />
        )}
        <View style={styles.miniCenter}>
          {complete ? (
            <SymbolView
              name={{ ios: "checkmark", android: "check", web: "check" }}
              size={22}
              tintColor={fill}
            />
          ) : (
            <Animated.View style={countAnimStyle}>
              <ThemedText type="smallBold" style={[styles.miniCount, { color: colors.foreground }]}>
                {count}
              </ThemedText>
            </Animated.View>
          )}
        </View>
      </View>
    </PressableScale>
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
    paddingTop: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, minWidth: 0, gap: 1 },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.one,
  },
  countText: {
    fontVariant: ["tabular-nums"],
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  targetSuffix: {
    fontVariant: ["tabular-nums"],
    opacity: 0.6,
  },
  miniTap: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  miniRing: {
    alignItems: "center",
    justifyContent: "center",
  },
  miniCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  miniCount: {
    fontVariant: ["tabular-nums"],
    fontSize: 16,
    lineHeight: 20,
  },
});
