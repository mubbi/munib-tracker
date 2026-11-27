import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from "react-native-svg";

import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { isRTL } from "@/lib/rtl";
import { SKY_PALETTES } from "@/lib/sky";
import { backgroundStars, constellation } from "@/lib/tasbeeh/constellation";
import { roundSizeFor, roundState } from "@/lib/tasbeeh/rounds";

import { RoundReadout } from "./round-readout";
import type { TasbeehFaceProps } from "./types";
import { useForwardStep } from "./use-forward-step";

/** The home hero's night sky (lib/sky.ts) — scene data, like bead materials. */
const NIGHT = SKY_PALETTES.night;
const STARLIGHT = "#F4F1E6";
const BACKGROUND_STARS = backgroundStars(36);

/**
 * Night sky: each count lights one star of a simple constellation that
 * completes at the end of the round (33, or the target when smaller). Uses the
 * home hero's night palette and a crescent; nothing living. Phone and web only
 * until TV QA (plan: TV behaviour).
 */
export default function StarsFace({
  count,
  target,
  complete,
  size,
  reduceMotion,
  appearance,
  preview = false,
}: TasbeehFaceProps) {
  const rtl = isRTL();
  const roundSize = roundSizeFor("stars", target, appearance) ?? 33;
  const round = roundState(count, roundSize);
  const lit = complete ? round.size : round.done;

  const width = size;
  const height = Math.round(size * (preview ? 1 : 0.62));
  const stars = useMemo(() => constellation(round.size, rtl), [round.size, rtl]);
  const points = (n: number) =>
    stars
      .slice(0, n)
      .map((s) => `${(s.x * width).toFixed(1)},${(s.y * height).toFixed(1)}`)
      .join(" ");
  const starRadius = Math.max(1.2, width * 0.009);

  // The newest star brightens in (instant under reduced motion).
  const glow = useForwardStep(count, { animate: !reduceMotion });
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 1 - glow.value,
    transform: [{ scale: 0.5 + glow.value * 1.5 }],
  }));
  const newest = lit > 0 && !complete ? stars[lit - 1] : undefined;
  const halo = starRadius * 7;

  // Crescent in the top end corner: a disc with an offset sky-coloured disc over it.
  const moonR = width * 0.06;
  const moonX = rtl ? width * 0.12 : width * 0.88;
  const moonY = height * 0.16;

  return (
    <View
      testID="tasbeeh-face-stars"
      style={[styles.stage, { width, borderRadius: Radius.lg }]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.sky,
          chartCoordinateStyle,
          { width, height, borderRadius: preview ? Radius.md : Radius.lg },
        ]}
      >
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={NIGHT.top} />
              <Stop offset="0.55" stopColor={NIGHT.mid} />
              <Stop offset="1" stopColor={NIGHT.bottom} />
            </LinearGradient>
          </Defs>
          <Path d={`M0 0 H${width} V${height} H0 Z`} fill="url(#night-sky)" />
          {BACKGROUND_STARS.map((s, i) => (
            <Circle
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative starfield
              key={`b${i}`}
              cx={s.x * width}
              cy={s.y * height}
              r={s.r * starRadius * 0.6}
              fill={STARLIGHT}
              fillOpacity={0.22}
            />
          ))}
          <Circle cx={moonX} cy={moonY} r={moonR * 1.9} fill={NIGHT.glow} fillOpacity={0.12} />
          <Circle cx={moonX} cy={moonY} r={moonR} fill={NIGHT.accent} fillOpacity={0.9} />
          <Circle
            cx={moonX + (rtl ? -1 : 1) * moonR * 0.42}
            cy={moonY - moonR * 0.18}
            r={moonR * 0.86}
            fill={NIGHT.top}
          />
          {lit > 1 ? (
            <Polyline
              points={points(lit)}
              fill="none"
              stroke={complete ? NIGHT.accent : STARLIGHT}
              strokeOpacity={complete ? 0.7 : 0.35}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          ) : null}
          {stars.map((s, i) => {
            const on = i < lit;
            const next = i === lit && !complete;
            const r = starRadius * (on ? 1.3 + s.magnitude * 0.35 : 0.8);
            return (
              <Circle
                // biome-ignore lint/suspicious/noArrayIndexKey: star order is fixed per round size
                key={i}
                cx={s.x * width}
                cy={s.y * height}
                r={r}
                fill={on ? (complete ? NIGHT.accent : STARLIGHT) : "none"}
                stroke={on ? "none" : STARLIGHT}
                strokeOpacity={next ? 0.85 : 0.35}
                strokeWidth={next ? 1.2 : 0.7}
              />
            );
          })}
        </Svg>
        {newest ? (
          <Animated.View
            style={[
              styles.halo,
              {
                width: halo,
                height: halo,
                borderRadius: halo / 2,
                backgroundColor: withAlpha(STARLIGHT, 0.5),
                top: newest.y * height - halo / 2,
                left: newest.x * width - halo / 2,
              },
              glowStyle,
            ]}
          />
        ) : null}
      </View>
      {preview ? null : (
        <RoundReadout count={count} target={target} complete={complete} round={round} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    gap: Spacing.two,
  },
  sky: {
    overflow: "hidden",
    borderCurve: "continuous",
  },
  halo: {
    position: "absolute",
  },
});
