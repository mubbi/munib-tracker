import type { TasbeehStrandLayout } from "@munib-tracker/shared/types";
import { memo, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Line, Path } from "react-native-svg";

import { Springs } from "@/constants/motion";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle } from "@/lib/chart-rtl";
import { gradientBackground } from "@/lib/gradient";
import { isRTL } from "@/lib/rtl";
import {
  type DragState,
  dragStep,
  edgeScale,
  itemKind,
  itemOffset,
  itemProgress,
  lapOf,
  outwardSide,
  pathPoint,
  projectDrag,
  type StrandGeometry,
  type StrandItemKind,
  type StrandModel,
  strandCountEvent,
  strandGeometry,
  threadPath,
  visibleItems,
} from "@/lib/tasbeeh/bead-layout";
import { misbahaLayoutFor, strandModelFor } from "@/lib/tasbeeh/designs";
import {
  beadEdgeColor,
  type MaterialRecipe,
  materialFor,
  spacerMaterialFor,
} from "@/lib/tasbeeh/materials";

import { Bead, beadBox } from "./bead";
import { CountReadout } from "./round-readout";
import type { TasbeehFaceProps } from "./types";

/** Bead diameter as a share of the stage. */
const BEAD_RATIO = 0.085;

/**
 * Sliding-bead misbaha: each count slides the next bead down the thread into
 * the counted group. Tap anywhere (the shell) or drag the next bead past the
 * detent; dragging the last counted bead back past the same detent undoes it
 * (never below 0). One gesture acts at most once. Positions come from one
 * `progress` shared value through the worklet math in `bead-layout.ts`; at most
 * ~20 beads are drawn, and they stay solid — at the open ends they slide out
 * under the stage clip instead of fading.
 */
export default function MisbahaFace({
  count,
  target,
  complete,
  size,
  tv,
  reduceMotion,
  appearance,
  onCount,
  onUndo,
  onGestureActive,
  tabletop = false,
  preview = false,
}: TasbeehFaceProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const window = useWindowDimensions();
  const rtl = isRTL();
  const misbaha = appearance.misbaha;
  const layout: TasbeehStrandLayout = misbahaLayoutFor(misbaha.layout, {
    tv,
    tabletop,
    landscape: !preview && window.width > window.height && window.height < 600,
  });

  const width = size;
  const height = layout === "horizontal" ? Math.round(size * 0.82) : size;
  const bead = Math.max(6, Math.round(size * BEAD_RATIO));
  const model = useMemo(() => strandModelFor(misbaha, target), [misbaha, target]);
  const geometry = useMemo(
    () => strandGeometry(layout, width, height, bead, rtl),
    [layout, width, height, bead, rtl],
  );

  const recipe = materialFor(misbaha.material, colors.accent);
  const spacerRecipe = spacerMaterialFor(misbaha.spacer, misbaha.material, colors.accent);
  const edge = beadEdgeColor(recipe, colors.card);

  // One shared progress (count, animating between integers) + the live drag.
  const progress = useSharedValue(count);
  const drag = useSharedValue(0);
  const prevCount = useRef(count);
  useEffect(() => {
    const delta = count - prevCount.current;
    prevCount.current = count;
    // Reset / big jumps snap: a single step (a count, or one undone) slides.
    if (reduceMotion || Math.abs(delta) !== 1) {
      progress.value = count;
      return;
    }
    progress.value = withSpring(count, Springs.gentle);
  }, [count, progress, reduceMotion]);

  const items = useMemo(() => visibleItems(model, geometry, count), [model, geometry, count]);
  const lap = lapOf(model, count);
  const lapCount = model.loop ? count - lap * model.unitsPerLap : count;

  // Drag: the next bead follows the finger; the detent (60% of a pitch) counts
  // once. Dragging back slides the last counted bead back and undoes it.
  const dragState = useRef<DragState>({ counted: false });
  const canUndo = onUndo != null && count > 0;
  const pan = usePanGesture({
    runOnJS: true,
    // At the target a drag can still take the last bead back.
    enabled: !preview && !tv && (!complete || canUndo),
    minDistance: 6,
    onActivate: () => {
      dragState.current = { counted: false };
      onGestureActive?.(true);
    },
    onUpdate: (event) => {
      const distance = projectDrag(layout, event.translationX, event.translationY, rtl);
      const step = dragStep(dragState.current, distance, geometry, canUndo);
      if (step.count || step.undo) {
        // Hand the visual over to the spring that the new count starts.
        progress.value = progress.value + drag.value;
        drag.value = 0;
        if (step.undo) onUndo?.();
        else onCount(strandCountEvent(model, count + 1) === "spacer" ? "spacer" : "bead");
        return;
      }
      drag.value = step.fraction;
    },
    onFinalize: () => {
      if (!dragState.current.counted) {
        drag.value = reduceMotion ? 0 : withSpring(0, Springs.gentle);
      }
      onGestureActive?.(false);
    },
  });

  const threadColor = misbaha.thread.color ?? withAlpha(colors.mutedForeground, 0.55);
  const tasselSide = useMemo(() => outwardSide(geometry), [geometry]);
  const velvet = misbaha.background === "velvet";

  const strand = (
    <View style={[styles.strand, { width, height }]} pointerEvents={preview ? "none" : "auto"}>
      {misbaha.thread.hidden ? null : (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Path
            d={threadPath(geometry)}
            stroke={threadColor}
            strokeWidth={Math.max(1, bead * 0.08)}
            fill="none"
          />
        </Svg>
      )}
      {items.map((a) => {
        const kind = itemKind(model, a);
        if (!kind) return null;
        if (kind === "spacer" && !spacerRecipe) return null;
        return (
          <StrandItem
            key={a}
            a={a}
            kind={kind}
            model={model}
            geometry={geometry}
            progress={progress}
            drag={drag}
            bead={bead}
            shape={misbaha.shape}
            recipe={kind === "spacer" && spacerRecipe ? spacerRecipe : recipe}
            edge={
              kind === "spacer" && spacerRecipe ? beadEdgeColor(spacerRecipe, colors.card) : edge
            }
            tassel={kind === "imam" ? misbaha.tassel : undefined}
            tasselSide={tasselSide}
            sway={complete && !reduceMotion && !preview}
            threadColor={threadColor}
          />
        );
      })}
    </View>
  );

  const readout = preview ? null : (
    <View
      style={[
        styles.readout,
        layout === "arc" && styles.readoutArc,
        layout === "loop" && styles.readoutLoop,
      ]}
      pointerEvents="none"
    >
      <CountReadout
        count={count}
        target={target}
        complete={complete}
        detail={
          model.loop
            ? t("tasbeehDesigns.misbaha.lap", {
                lap: lap + 1,
                done: lapCount,
                size: model.unitsPerLap,
              })
            : t("tasbeehDesigns.misbaha.strandSize", { beads: model.beads })
        }
      />
    </View>
  );

  const body = (
    <View
      style={[
        styles.stage,
        // Bead coordinates are absolute: lock an LTR plane (RTL is mirrored in the math).
        chartCoordinateStyle,
        { width, minHeight: height, borderRadius: Radius.lg },
        velvet &&
          gradientBackground(
            `radial-gradient(circle at 50% 35%, ${withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.14)} 0%, ${colors.card} 78%)`,
          ),
        layout === "horizontal" && styles.stageColumn,
      ]}
    >
      {strand}
      {readout}
    </View>
  );

  if (preview || tv) return body;
  return <GestureDetector gesture={pan}>{body}</GestureDetector>;
}

type StrandItemProps = {
  a: number;
  kind: StrandItemKind;
  model: StrandModel;
  geometry: StrandGeometry;
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  bead: number;
  shape: TasbeehFaceProps["appearance"]["misbaha"]["shape"];
  recipe: MaterialRecipe;
  edge: string;
  tassel?: TasbeehFaceProps["appearance"]["misbaha"]["tassel"];
  /** Local ±x side facing away from the strand's curve (`outwardSide`). */
  tasselSide: 1 | -1;
  sway: boolean;
  threadColor: string;
};

const StrandItem = memo(function StrandItem({
  a,
  kind,
  model,
  geometry,
  progress,
  drag,
  bead,
  shape,
  recipe,
  edge,
  tassel,
  tasselSide,
  sway,
  threadColor,
}: StrandItemProps) {
  const itemSize = kind === "imam" ? bead * 1.35 : kind === "spacer" ? bead * 0.72 : bead;
  const itemShape = kind === "spacer" ? "rondelle" : kind === "imam" ? "olive" : shape;
  const box = beadBox(itemShape, itemSize);
  const { unitsPerLap, itemsPerLap, unitStart, unitSize, loop } = model;
  const { layout, width, height, gapStart, gapEnd, pitch, length, rtl } = geometry;

  const style = useAnimatedStyle(() => {
    const Q = itemProgress(
      unitsPerLap,
      itemsPerLap,
      unitStart,
      unitSize,
      loop,
      progress.value + drag.value,
    );
    const s = itemOffset(a, Q, gapStart, gapEnd, pitch);
    const p = pathPoint(layout, s, width, height, bead, rtl);
    // Solid at every position: hidden only once fully out of view.
    const scale = edgeScale(layout, s, length, pitch);
    return {
      opacity: scale > 0 ? 1 : 0,
      transform: [
        { translateX: p.x - box.width / 2 },
        { translateY: p.y - box.height / 2 },
        { rotate: `${(p.angle * 180) / Math.PI - 90}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={[styles.item, { width: box.width, height: box.height }, style]}>
      {/* Under the bead, so the fringe comes out of it rather than lying across it. */}
      {tassel && tassel.style !== "none" ? (
        <Tassel
          style={tassel.style}
          color={tassel.color ?? threadColor}
          size={itemSize}
          box={box}
          side={tasselSide}
          // The loop only has a bead of room between the thread and the stage edge.
          length={layout === "loop" ? bead * 1.3 : itemSize * 1.6}
          sway={sway}
        />
      ) : null}
      <Bead shape={itemShape} recipe={recipe} size={itemSize} edge={edge} />
    </Animated.View>
  );
});

/**
 * Silk fringe or a metal chain hanging from the imam bead, at the end of the
 * strand: it leaves the bead on the side facing away from the strand's curve
 * (perpendicular to the thread), so it never lies back over the neighbouring
 * beads or the count. Sways once on completion.
 */
function Tassel({
  style,
  color,
  size,
  box,
  side,
  length,
  sway,
}: {
  style: "silk" | "chain";
  color: string;
  size: number;
  /** The imam bead's box (the item frame the tassel hangs in). */
  box: { width: number; height: number };
  side: 1 | -1;
  /** From the bead's centre to the fringe ends. */
  length: number;
  sway: boolean;
}) {
  const rotate = useSharedValue(0);
  useEffect(() => {
    if (!sway) return;
    rotate.value = withSequence(
      withTiming(7, { duration: 380 }),
      withTiming(-5, { duration: 420 }),
      withTiming(2, { duration: 380 }),
      withTiming(0, { duration: 420 }),
    );
  }, [sway, rotate]);
  // The tassel's local "down" turned onto the item's outward ±x axis.
  const base = side === 1 ? -90 : 90;
  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${base + rotate.value}deg` }],
  }));
  const w = size;
  return (
    <Animated.View
      pointerEvents="none"
      testID="misbaha-tassel"
      style={[
        styles.tassel,
        // Hung from the bead's centre (top-centre origin), under the bead.
        { left: box.width / 2 - w / 2, top: box.height / 2, width: w, height: length },
        swayStyle,
      ]}
    >
      <Svg width={w} height={length}>
        {style === "silk"
          ? [0.2, 0.35, 0.5, 0.65, 0.8].map((x) => (
              <Line
                key={x}
                x1={w / 2}
                y1={0}
                x2={w * x}
                y2={length}
                stroke={color}
                strokeWidth={Math.max(1, size * 0.08)}
                strokeLinecap="round"
              />
            ))
          : [0.5].map((x) => (
              <Line
                key={x}
                x1={w * x}
                y1={0}
                x2={w * x}
                y2={length}
                stroke={color}
                strokeWidth={Math.max(1.5, size * 0.12)}
                strokeDasharray={`${size * 0.14} ${size * 0.08}`}
                strokeLinecap="round"
              />
            ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  stageColumn: {
    flexDirection: "column",
  },
  strand: {
    position: "relative",
  },
  item: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "center",
  },
  tassel: {
    position: "absolute",
    transformOrigin: "top",
  },
  readout: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Spacing.two,
  },
  readoutArc: {
    position: "absolute",
    end: Spacing.three,
    top: 0,
    bottom: 0,
    width: "50%",
  },
  readoutLoop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
  },
});
