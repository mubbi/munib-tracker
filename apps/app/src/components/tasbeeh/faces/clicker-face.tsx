import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Polygon } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { gradientBackground } from "@/lib/gradient";
import { LCD_BACKLIGHTS } from "@/lib/tasbeeh/materials";
import { lcdCells, segmentPolygons, segmentsFor } from "@/lib/tasbeeh/seven-segment";

import type { TasbeehFaceProps } from "./types";

/**
 * Digital clicker: a handheld zikr counter — seven-segment LCD (green, amber
 * or mono backlight) above one big round button that clicks down on each count.
 */
export default function ClickerFace({
  count,
  target,
  complete,
  size,
  reduceMotion,
  appearance,
  preview = false,
}: TasbeehFaceProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const lcd = LCD_BACKLIGHTS[appearance.clicker.backlight];

  const bodyWidth = size * 0.82;
  const lcdWidth = bodyWidth * 0.82;
  const lcdHeight = size * 0.27;
  const button = size * 0.34;

  const press = useSharedValue(1);
  const prev = useRef(count);
  useEffect(() => {
    if (count === prev.current) return;
    const forward = count > prev.current;
    prev.current = count;
    if (reduceMotion || preview || !forward) return;
    press.value = withSequence(
      withTiming(0.92, { duration: 60 }),
      withTiming(1, { duration: 140 }),
    );
  }, [count, press, reduceMotion, preview]);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

  const cells = lcdCells(count, count >= 10000 ? 5 : 4);
  const cellGap = lcdWidth * 0.03;
  const padX = lcdWidth * 0.08;
  const cellWidth = (lcdWidth - padX * 2 - cellGap * (cells.length - 1)) / cells.length;
  const cellHeight = lcdHeight * 0.66;
  const polygons = useMemo(
    () => segmentPolygons(cellWidth * 0.9, cellHeight),
    [cellWidth, cellHeight],
  );

  return (
    <View
      style={[
        styles.body,
        chartCoordinateStyle,
        {
          width: bodyWidth,
          paddingVertical: preview ? Spacing.one : Spacing.three,
          gap: preview ? Spacing.one : Spacing.three,
          borderRadius: bodyWidth * 0.22,
          backgroundColor: colors.muted,
          borderColor: tokens.hairline,
        },
        gradientBackground(
          `linear-gradient(180deg, ${withAlpha(colors.foreground, tokens.isDark ? 0.08 : 0.03)} 0%, ${colors.muted} 60%)`,
        ),
      ]}
    >
      <View
        style={[
          styles.lcd,
          {
            width: lcdWidth,
            height: lcdHeight,
            borderRadius: Radius.sm,
            backgroundColor: lcd.panel,
            borderColor: withAlpha(colors.foreground, 0.25),
          },
        ]}
      >
        <Svg width={lcdWidth} height={cellHeight}>
          {cells.map((char, index) => {
            const mask = segmentsFor(char);
            const x = padX + index * (cellWidth + cellGap) + cellWidth * 0.05;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed LCD cell positions
              <G key={index} transform={`translate(${x.toFixed(2)},0) skewX(-6)`}>
                {polygons.map((points, segment) => (
                  <Polygon
                    // biome-ignore lint/suspicious/noArrayIndexKey: segment order a–g is fixed
                    key={segment}
                    points={points}
                    fill={mask[segment] ? lcd.segmentOn : lcd.segmentOff}
                  />
                ))}
              </G>
            );
          })}
        </Svg>
      </View>

      {preview ? null : (
        <ThemedText type="caption" themeColor="mutedForeground">
          {target > 0
            ? complete
              ? t("tasbeehUi.complete")
              : t("tasbeehUi.ofTarget", { target })
            : t("tasbeehUi.unlimited")}
        </ThemedText>
      )}

      <Animated.View
        style={[
          styles.button,
          {
            width: button,
            height: button,
            borderRadius: button / 2,
            backgroundColor: complete ? tokens.status.success.color : colors.accent,
            borderColor: withAlpha(colors.foreground, 0.2),
          },
          gradientBackground(
            `radial-gradient(circle at 38% 32%, ${withAlpha(colors.accentForeground, 0.35)} 0%, ${complete ? tokens.status.success.color : colors.accent} 55%)`,
          ),
          pressStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    ...Shadows.sm,
  },
  lcd: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    ...Shadows.sm,
  },
});
