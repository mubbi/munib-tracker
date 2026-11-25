import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import {
  alongFinger,
  type FingerShape,
  type FingerSpot,
  fingerAngle,
  fingerLength,
  fingerSpots,
  fingersFor,
  HAND_BOX,
  type HandSide,
  handsFor,
  JOINT_CREASES,
  palmPath,
} from "@/lib/tasbeeh/finger-layout";
import { roundSizeFor, roundState } from "@/lib/tasbeeh/rounds";

import { RoundReadout } from "./round-readout";
import type { TasbeehFaceProps } from "./types";
import { useForwardStep } from "./use-forward-step";

/** Finger stroke width in hand units. */
const STROKE = 1.6;

/**
 * Finger counting: a visual aid for the Sunnah method (Abu Dawud 1501). A
 * line-art hand — outline only, no skin tones — marks the next fingertip
 * (both hands, 10 a round) or finger joint (right hand, 15 a round) on each
 * count, with a round counter. Hands are physical, so RTL does not mirror
 * them. The note under the counter says any finger method is fine.
 */
export default function FingersFace({
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
  const layout = appearance.fingers.layout;
  const roundSize = roundSizeFor("fingers", target, appearance) ?? 10;
  const round = roundState(count, roundSize);
  const spots = useMemo(() => fingerSpots(layout), [layout]);
  const hands = handsFor(layout);

  const handWidth = hands.length === 2 ? size * 0.48 : size * 0.62;
  const scale = handWidth / HAND_BOX.width;
  const handHeight = HAND_BOX.height * scale;

  // A soft ring spreads from the spot that was just marked (not under reduced motion).
  const pulse = useForwardStep(count, { animate: !reduceMotion });
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: (1 - pulse.value) * 0.6,
    transform: [{ scale: 0.6 + pulse.value * 1.2 }],
  }));

  const lit = complete ? spots.length : round.done;
  const lastIndex = lit - 1;
  const ink = withAlpha(colors.foreground, tokens.isDark ? 0.75 : 0.65);
  const markColor = complete ? tokens.status.success.color : colors.accent;
  const spotRadius = layout === "tips" ? 5.2 : 4.2;

  return (
    <View
      testID="tasbeeh-face-fingers"
      style={[styles.stage, { width: size, borderRadius: Radius.lg }]}
      pointerEvents="none"
    >
      <View style={[styles.hands, chartCoordinateStyle]}>
        {hands.map((side) => {
          const handSpots = spots
            .map((spot, index) => ({ spot, index }))
            .filter(({ spot }) => spot.side === side);
          const last = handSpots.find(({ index }) => index === lastIndex);
          return (
            <View key={side} style={styles.hand}>
              <View style={{ width: handWidth, height: handHeight }}>
                <Svg
                  width={handWidth}
                  height={handHeight}
                  viewBox={`0 0 ${HAND_BOX.width} ${HAND_BOX.height}`}
                >
                  <HandOutline
                    side={side}
                    ink={ink}
                    fill={colors.card}
                    creases={layout === "joints"}
                  />
                  {handSpots.map(({ spot, index }) => (
                    <SpotMark
                      key={`${spot.finger}-${spot.segment}`}
                      spot={spot}
                      radius={spotRadius}
                      state={index < lit ? "lit" : index === lit && !complete ? "next" : "idle"}
                      mark={markColor}
                      ink={ink}
                    />
                  ))}
                </Svg>
                {last ? (
                  <Animated.View
                    style={[
                      styles.pulse,
                      {
                        width: spotRadius * 2 * scale,
                        height: spotRadius * 2 * scale,
                        borderRadius: spotRadius * scale,
                        borderColor: markColor,
                        top: last.spot.y * scale - spotRadius * scale,
                        left: last.spot.x * scale - spotRadius * scale,
                      },
                      pulseStyle,
                    ]}
                  />
                ) : null}
              </View>
              {preview || hands.length < 2 ? null : (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(`tasbeehDesigns.fingers.${side}`)}
                </ThemedText>
              )}
            </View>
          );
        })}
      </View>
      {preview ? null : (
        <RoundReadout count={count} target={target} complete={complete} round={round} compact />
      )}
    </View>
  );
}

function FingerOutline({
  finger,
  ink,
  fill,
  creases,
}: {
  finger: FingerShape;
  ink: string;
  fill: string;
  creases: boolean;
}) {
  const length = fingerLength(finger);
  const cx = (finger.tip.x + finger.base.x) / 2;
  const cy = (finger.tip.y + finger.base.y) / 2;
  const w = finger.width;
  // Extend past the base so the palm covers the join.
  const h = length + w * 1.2;
  const dx = (finger.base.x - finger.tip.x) / length;
  const dy = (finger.base.y - finger.tip.y) / length;
  return (
    <G>
      <Rect
        x={cx - w / 2}
        y={cy - length / 2 - w / 2}
        width={w}
        height={h}
        rx={w / 2}
        fill={fill}
        stroke={ink}
        strokeWidth={STROKE}
        transform={`rotate(${fingerAngle(finger).toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)})`}
      />
      {creases
        ? JOINT_CREASES.map((t) => {
            const p = alongFinger(finger, t);
            const half = w * 0.36;
            return (
              <Line
                key={t}
                x1={p.x - dy * half}
                y1={p.y + dx * half}
                x2={p.x + dy * half}
                y2={p.y - dx * half}
                stroke={ink}
                strokeWidth={STROKE * 0.6}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            );
          })
        : null}
    </G>
  );
}

function HandOutline({
  side,
  ink,
  fill,
  creases,
}: {
  side: HandSide;
  ink: string;
  fill: string;
  creases: boolean;
}) {
  const fingers = fingersFor(side);
  const thumb = fingers.find((f) => f.id === "thumb") as FingerShape;
  const others = fingers.filter((f) => f.id !== "thumb");
  return (
    <G>
      <FingerOutline finger={thumb} ink={ink} fill={fill} creases={creases} />
      {others.map((finger) => (
        <FingerOutline key={finger.id} finger={finger} ink={ink} fill={fill} creases={creases} />
      ))}
      <Path
        d={palmPath(side)}
        fill={fill}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </G>
  );
}

function SpotMark({
  spot,
  radius,
  state,
  mark,
  ink,
}: {
  spot: FingerSpot;
  radius: number;
  state: "lit" | "next" | "idle";
  mark: string;
  ink: string;
}) {
  if (state === "lit") {
    return <Circle cx={spot.x} cy={spot.y} r={radius} fill={mark} fillOpacity={0.85} />;
  }
  if (state === "next") {
    return (
      <Circle
        cx={spot.x}
        cy={spot.y}
        r={radius}
        fill="none"
        stroke={mark}
        strokeWidth={1.4}
        strokeDasharray="2.4 1.6"
      />
    );
  }
  return (
    <Circle
      cx={spot.x}
      cy={spot.y}
      r={radius * 0.55}
      fill="none"
      stroke={ink}
      strokeWidth={0.8}
      strokeOpacity={0.45}
    />
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  hands: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one,
  },
  hand: {
    alignItems: "center",
    gap: Spacing.half,
  },
  pulse: {
    position: "absolute",
    borderWidth: BorderWidth.thick,
  },
});
