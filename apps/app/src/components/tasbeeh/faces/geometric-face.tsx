import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle, progressSweepRtl } from "@/lib/chart-rtl";
import { petalPolygon, ROSETTE_RADII, starPolygon, toSvgPoints } from "@/lib/tasbeeh/rosette";
import { roundSizeFor, roundState } from "@/lib/tasbeeh/rounds";

import { RoundReadout } from "./round-readout";
import type { TasbeehFaceProps } from "./types";

/**
 * Geometric rosette: a twelve-point girih star inside a ring of 33 petals.
 * Each count fills one petal, from 12 o'clock with the reading direction; 99
 * completes the rosette three times and ∞ loops. No motion at all — petals
 * fill in place — so reduced motion needs nothing extra.
 */
export default function GeometricFace({
  count,
  target,
  complete,
  size,
  appearance,
  preview = false,
}: TasbeehFaceProps) {
  const { colors, tokens } = useThemeTokens();
  const rtl = progressSweepRtl();
  const roundSize = roundSizeFor("geometric", target, appearance) ?? 33;
  const round = roundState(count, roundSize);
  const filled = complete ? round.size : round.done;

  const box = preview ? size : Math.round(size * 0.92);
  const c = box / 2;
  const scale = c - 2;
  const petals = useMemo(
    () =>
      Array.from({ length: round.size }, (_, i) =>
        toSvgPoints(petalPolygon(i, round.size, rtl), c, c, scale),
      ),
    [round.size, rtl, c, scale],
  );
  const star = useMemo(
    () => toSvgPoints(starPolygon(12, 5, ROSETTE_RADII.star), c, c, scale),
    [c, scale],
  );
  const innerStar = useMemo(
    () => toSvgPoints(starPolygon(12, 5, ROSETTE_RADII.star * 0.62), c, c, scale),
    [c, scale],
  );

  const ink = withAlpha(colors.foreground, tokens.isDark ? 0.42 : 0.3);
  const fill = complete ? tokens.status.success.color : colors.accent;
  const roundDone = round.done === round.size;

  return (
    <View
      testID="tasbeeh-face-geometric"
      style={[styles.stage, { width: size, borderRadius: Radius.lg }]}
      pointerEvents="none"
    >
      <View style={[{ width: box, height: box }, chartCoordinateStyle]}>
        <Svg width={box} height={box}>
          <Circle
            cx={c}
            cy={c}
            r={scale * ROSETTE_RADII.frame}
            fill={tokens.isDark ? withAlpha(colors.foreground, 0.04) : colors.muted}
            stroke={ink}
            strokeWidth={1}
          />
          {petals.map((points, i) => (
            <Polygon
              // biome-ignore lint/suspicious/noArrayIndexKey: petal order is fixed
              key={i}
              points={points}
              fill={i < filled ? fill : "none"}
              fillOpacity={i < filled ? 0.85 : 0}
              stroke={i < filled ? fill : ink}
              strokeWidth={i === filled && !complete ? 1.6 : 0.9}
              strokeLinejoin="round"
            />
          ))}
          <Polygon
            points={star}
            fill={roundDone ? withAlpha(fill, 0.18) : "none"}
            stroke={roundDone ? fill : ink}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <Polygon
            points={innerStar}
            fill="none"
            stroke={ink}
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        </Svg>
        {preview ? null : (
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            <RoundReadout
              count={count}
              target={target}
              complete={complete}
              round={round}
              compact
              colors={{
                count: colors.foreground,
                caption: colors.mutedForeground,
                complete: tokens.status.success.color,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
