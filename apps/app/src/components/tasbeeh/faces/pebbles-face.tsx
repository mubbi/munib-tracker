import type { TasbeehPebbleItem } from "@munib-tracker/shared/types";
import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";

import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { gradientBackground } from "@/lib/gradient";
import { isRTL } from "@/lib/rtl";
import {
  type Dish,
  PEBBLE_TONES,
  type PebbleSlot,
  type PebbleTone,
  pebbleArc,
  pebbleBox,
  pebbleGeometry,
  pebbleOccupancy,
  pebbleSlot,
} from "@/lib/tasbeeh/pebble-layout";
import { roundSizeFor, roundState } from "@/lib/tasbeeh/rounds";

import { RoundReadout } from "./round-readout";
import type { TasbeehFaceProps } from "./types";
import { useForwardStep } from "./use-forward-step";

/** Each dish gets a different spiral twist so the two never look copied. */
const SOURCE_SALT = 1;
const COUNTED_SALT = 2;

/**
 * Date pits / pebbles (D16): each count moves one pit or pebble from the dish
 * at the reading start to the dish at the reading end, in rounds of 33 (or the
 * target, when smaller). Tap only — the shell owns counting. The evidence and
 * the differing gradings show in the always-visible "About this design" note
 * (`TasbeehDesignNote`), outside the tap target.
 */
export default function PebblesFace({
  count,
  target,
  complete,
  size,
  reduceMotion,
  appearance,
  preview = false,
}: TasbeehFaceProps) {
  const { colors, tokens } = useThemeTokens();
  const rtl = isRTL();
  const item = appearance.pebbles.item;
  const roundSize = roundSizeFor("pebbles", target, appearance) ?? 33;
  const round = roundState(count, roundSize);
  const occupancy = pebbleOccupancy(round.size, round.done);

  const width = size;
  const height = Math.round(size * (preview ? 0.6 : 0.5));
  const geometry = useMemo(
    () => pebbleGeometry(width, height, round.size, rtl),
    [width, height, round.size, rtl],
  );
  const tones = PEBBLE_TONES[item];

  // The last item to move travels from the source dish to the counted dish.
  const move = useForwardStep(count, { animate: !reduceMotion, curve: "cubic" });

  const sourceSlots = useMemo(
    () =>
      Array.from({ length: occupancy.source }, (_, i) =>
        pebbleSlot(geometry.source, i, round.size, item, SOURCE_SALT),
      ),
    [geometry.source, occupancy.source, round.size, item],
  );
  const countedSlots = useMemo(
    () =>
      Array.from({ length: occupancy.counted }, (_, i) =>
        pebbleSlot(geometry.counted, i, round.size, item, COUNTED_SALT),
      ),
    [geometry.counted, occupancy.counted, round.size, item],
  );
  const moving = occupancy.moving;
  const movingFrom = moving
    ? pebbleSlot(geometry.source, moving.from, round.size, item, SOURCE_SALT)
    : null;

  return (
    <View
      testID="tasbeeh-face-pebbles"
      style={[styles.stage, { width, borderRadius: Radius.lg }]}
      pointerEvents="none"
    >
      <View style={[{ width, height }, chartCoordinateStyle]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="pebble-dish" cx="50%" cy="45%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={colors.card} stopOpacity={1} />
              <Stop offset="70%" stopColor={colors.muted} stopOpacity={1} />
              <Stop
                offset="100%"
                stopColor={colors.foreground}
                stopOpacity={tokens.isDark ? 0.22 : 0.12}
              />
            </RadialGradient>
          </Defs>
          {[geometry.source, geometry.counted].map((dish, index) => (
            <DishShape
              key={index === 0 ? "source" : "counted"}
              dish={dish}
              rim={withAlpha(colors.foreground, tokens.isDark ? 0.3 : 0.2)}
              glow={
                complete && index === 1 ? withAlpha(tokens.status.success.color, 0.5) : undefined
              }
            />
          ))}
        </Svg>
        {sourceSlots.map((slot, i) => (
          <PebbleItem
            // biome-ignore lint/suspicious/noArrayIndexKey: slots are fixed positions in a dish
            key={`s${i}`}
            slot={slot}
            item={item}
            length={geometry.item}
            tone={tones[slot.tone % tones.length] as PebbleTone}
          />
        ))}
        {countedSlots.map((slot, i) =>
          moving && i === moving.to && movingFrom ? (
            <MovingPebble
              // biome-ignore lint/suspicious/noArrayIndexKey: slots are fixed positions in a dish
              key={`c${i}`}
              from={movingFrom}
              to={slot}
              progress={move}
              item={item}
              length={geometry.item}
              tone={tones[movingFrom.tone % tones.length] as PebbleTone}
              lift={height * 0.28}
            />
          ) : (
            <PebbleItem
              // biome-ignore lint/suspicious/noArrayIndexKey: slots are fixed positions in a dish
              key={`c${i}`}
              slot={slot}
              item={item}
              length={geometry.item}
              tone={
                tones[
                  pebbleSlot(geometry.source, round.size - 1 - i, round.size, item, SOURCE_SALT)
                    .tone % tones.length
                ] as PebbleTone
              }
            />
          ),
        )}
      </View>
      {preview ? null : (
        <RoundReadout count={count} target={target} complete={complete} round={round} />
      )}
    </View>
  );
}

function DishShape({ dish, rim, glow }: { dish: Dish; rim: string; glow?: string }) {
  // Usable half-axes are 80% of the dish (see pebbleGeometry); the rim sits just outside.
  const rx = dish.rx / 0.8;
  const ry = dish.ry / 0.8;
  return (
    <>
      {glow ? (
        <Ellipse cx={dish.cx} cy={dish.cy} rx={rx} ry={ry} stroke={glow} strokeWidth={4} />
      ) : null}
      <Ellipse
        cx={dish.cx}
        cy={dish.cy}
        rx={rx * 0.97}
        ry={ry * 0.97}
        fill="url(#pebble-dish)"
        stroke={rim}
        strokeWidth={1.5}
      />
      <Ellipse
        cx={dish.cx}
        cy={dish.cy}
        rx={rx * 0.86}
        ry={ry * 0.86}
        fill="none"
        stroke={rim}
        strokeWidth={0.75}
        strokeOpacity={0.6}
      />
    </>
  );
}

function itemStyle(item: TasbeehPebbleItem, length: number, scale: number, tone: PebbleTone) {
  const box = pebbleBox(item, length * scale);
  return {
    box,
    style: [
      styles.item,
      {
        width: box.width,
        height: box.height,
        borderRadius: box.height / 2,
        backgroundColor: tone.base,
        borderColor: tone.shadow,
      },
      gradientBackground(
        `radial-gradient(circle at 35% 30%, ${tone.highlight} 0%, ${tone.base} 48%, ${tone.shadow} 100%)`,
      ),
    ],
  };
}

const PebbleItem = memo(function PebbleItem({
  slot,
  item,
  length,
  tone,
}: {
  slot: PebbleSlot;
  item: TasbeehPebbleItem;
  length: number;
  tone: PebbleTone;
}) {
  const { box, style } = itemStyle(item, length, slot.scale, tone);
  return (
    <View
      style={[
        style,
        {
          transform: [
            { translateX: slot.x - box.width / 2 },
            { translateY: slot.y - box.height / 2 },
            { rotate: `${slot.rotate}deg` },
          ],
        },
      ]}
    >
      {item === "pits" ? <View style={[styles.groove, { backgroundColor: tone.shadow }]} /> : null}
    </View>
  );
});

function MovingPebble({
  from,
  to,
  progress,
  item,
  length,
  tone,
  lift,
}: {
  from: PebbleSlot;
  to: PebbleSlot;
  progress: SharedValue<number>;
  item: TasbeehPebbleItem;
  length: number;
  tone: PebbleTone;
  lift: number;
}) {
  const { box, style } = itemStyle(item, length, to.scale, tone);
  const animated = useAnimatedStyle(() => {
    const p = pebbleArc(from, to, progress.value, lift);
    const rotate = from.rotate + (to.rotate - from.rotate) * progress.value;
    return {
      transform: [
        { translateX: p.x - box.width / 2 },
        { translateY: p.y - box.height / 2 },
        { rotate: `${rotate}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[style, animated]}>
      {item === "pits" ? <View style={[styles.groove, { backgroundColor: tone.shadow }]} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  item: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  groove: {
    width: "62%",
    height: 1,
    opacity: 0.75,
    borderRadius: 1,
  },
});
