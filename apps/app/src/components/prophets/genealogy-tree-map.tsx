import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getProphetsGenealogyBranchOrder } from "@/lib/prophets-genealogy";
import {
  GENEALOGY_NODE_HEIGHT,
  GENEALOGY_NODE_WIDTH,
  genealogyLineageIds,
  genealogyMonogram,
  layoutProphetsGenealogy,
  parentEdgePath,
  siblingEdgePath,
} from "@/lib/prophets-genealogy-layout";

const MIN_SCALE = 0.38;
const MAX_SCALE = 2.6;
const ZOOM_STEP = 1.22;

type GenealogyTreeMapProps = {
  nodes: ProphetsGenealogyNode[];
  selectedId: string | null;
  highlightIds?: Set<string> | null;
  focusId?: string | null;
  onSelect: (node: ProphetsGenealogyNode) => void;
  height: number;
};

/**
 * Web wheel policy (G-32): the map zooms on Ctrl / ⌘ + wheel (trackpad pinch
 * arrives as a ctrl-wheel) or once the reader has pressed inside the map;
 * every other wheel event is left to scroll the page.
 */
export function shouldMapCaptureWheel(
  event: Pick<WheelEvent, "ctrlKey" | "metaKey">,
  engaged: boolean,
): boolean {
  return event.ctrlKey || event.metaKey || engaged;
}

function certaintyTone(
  certainty: ProphetsGenealogyNode["certainty"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  if (certainty === "quran") return tokens.status.success;
  if (certainty === "authentic-hadith") return tokens.status.info;
  return tokens.status.warning;
}

export function GenealogyTreeMap({
  nodes,
  selectedId,
  highlightIds,
  focusId,
  onSelect,
  height,
}: GenealogyTreeMapProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { width: windowW } = useWindowDimensions();
  const branchOrder = getProphetsGenealogyBranchOrder();
  // TV: no touch — the map is a non-focusable overview that recentres on the
  // selection (driven by GenealogyTvNodeList); zoom/fit stay as D-pad buttons.
  const tv = isTV();
  const [viewportW, setViewportW] = useState(Math.min(windowW, 1120));
  const [viewportH, setViewportH] = useState(height);
  // Web touch: until engaged, the canvas leaves one-finger vertical drags to the page.
  const [touchEngaged, setTouchEngaged] = useState(false);

  const layout = useMemo(() => layoutProphetsGenealogy(nodes, branchOrder), [nodes, branchOrder]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const lineageIds = useMemo(
    () => (selectedId ? genealogyLineageIds(selectedId, nodes) : null),
    [selectedId, nodes],
  );

  const scale = useSharedValue(1);
  // Reduced motion: zoom / fit / recentre snap instead of animating.
  const motion = useHydrationSafeReducedMotion() ? 0 : 1;
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    setViewportH(height);
  }, [height]);

  const fitToView = useCallback(() => {
    const pad = 28;
    const sx = (viewportW - pad * 2) / layout.width;
    const sy = (viewportH - pad * 2) / layout.height;
    const next = Math.min(Math.max(Math.min(sx, sy), MIN_SCALE), 1.05);
    const offsetX = (viewportW - layout.width * next) / 2;
    const offsetY = Math.max(20, (viewportH - layout.height * next) / 2);
    scale.value = withTiming(next, { duration: 280 * motion });
    savedScale.value = next;
    translateX.value = withTiming(offsetX, { duration: 280 * motion });
    translateY.value = withTiming(offsetY, { duration: 280 * motion });
    savedTranslateX.value = offsetX;
    savedTranslateY.value = offsetY;
  }, [
    motion,
    layout.height,
    layout.width,
    scale,
    savedScale,
    translateX,
    translateY,
    savedTranslateX,
    savedTranslateY,
    viewportH,
    viewportW,
  ]);

  /** Zoom about a viewport point (centre for buttons, cursor for the mouse wheel). */
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number, duration = 180) => {
      const next = Math.min(Math.max(savedScale.value * factor, MIN_SCALE), MAX_SCALE);
      const worldX = (cx - savedTranslateX.value) / savedScale.value;
      const worldY = (cy - savedTranslateY.value) / savedScale.value;
      const offsetX = cx - worldX * next;
      const offsetY = cy - worldY * next;
      scale.value = withTiming(next, { duration: duration * motion });
      savedScale.value = next;
      translateX.value = withTiming(offsetX, { duration: duration * motion });
      translateY.value = withTiming(offsetY, { duration: duration * motion });
      savedTranslateX.value = offsetX;
      savedTranslateY.value = offsetY;
    },
    [motion, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY],
  );

  const zoomBy = useCallback(
    (factor: number) => zoomAt(factor, viewportW / 2, viewportH / 2),
    [zoomAt, viewportH, viewportW],
  );

  // Web: Ctrl / ⌘ + wheel and trackpad pinch (which browsers report as a
  // ctrl-wheel) zoom about the cursor; a plain wheel zooms only once the reader
  // has engaged the map (pointer pressed inside it, until the pointer leaves).
  // Otherwise the wheel scrolls the page — the map never traps page scroll
  // (G-32). Registered natively as a non-passive listener — React's onWheel is
  // passive, so preventDefault there can't stop the page from scrolling.
  const viewportRef = useRef<ViewInstance>(null);
  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;
  useEffect(() => {
    if (Platform.OS !== "web" || tv) return;
    const node = viewportRef.current as unknown as HTMLElement | null;
    if (!node?.addEventListener) return;
    let engaged = false;
    // Touch: a one-finger drag scrolls the page until the reader taps the map
    // (engages it); a tap outside releases it. Mouse / pen never need this.
    let touchStart: { x: number; y: number; t: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      engaged = true;
      if (event.pointerType === "touch") {
        touchStart = { x: event.clientX, y: event.clientY, t: Date.now() };
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !touchStart) return;
      const moved = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
      if (moved < 10 && Date.now() - touchStart.t < 400) setTouchEngaged(true);
      touchStart = null;
    };
    const onDocPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !node.contains(event.target as Node)) {
        setTouchEngaged(false);
      }
    };
    const onPointerLeave = () => {
      engaged = false;
    };
    const onWheel = (event: WheelEvent) => {
      if (!shouldMapCaptureWheel(event, engaged)) return;
      event.preventDefault();
      // Line/page delta modes (some mice) → approximate pixels.
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
      const dy = Math.max(-120, Math.min(120, event.deltaY * unit));
      // Smooth exponential zoom — trackpads send many small deltas, mice a few big ones.
      const factor = Math.exp(-dy * (event.ctrlKey ? 0.01 : 0.0025));
      const rect = node.getBoundingClientRect();
      zoomAtRef.current(factor, event.clientX - rect.left, event.clientY - rect.top, 60);
    };
    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerdown", onDocPointerDown);
    node.addEventListener("pointerleave", onPointerLeave);
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerdown", onDocPointerDown);
      node.removeEventListener("pointerleave", onPointerLeave);
      node.removeEventListener("wheel", onWheel);
    };
  }, [tv]);

  useEffect(() => {
    fitToView();
  }, [fitToView]);

  useEffect(() => {
    if (!focusId) return;
    const pos = layout.byId[focusId];
    if (!pos) return;
    const s = Math.min(Math.max(savedScale.value, 0.9), 1.4);
    const targetX = viewportW / 2 - (pos.x + pos.width / 2) * s;
    const targetY = viewportH / 2 - (pos.y + pos.height / 2) * s;
    scale.value = withTiming(s, { duration: 320 * motion });
    savedScale.value = s;
    translateX.value = withTiming(targetX, { duration: 320 * motion });
    translateY.value = withTiming(targetY, { duration: 320 * motion });
    savedTranslateX.value = targetX;
    savedTranslateY.value = targetY;
  }, [
    motion,
    focusId,
    layout.byId,
    scale,
    savedScale,
    translateX,
    translateY,
    savedTranslateX,
    savedTranslateY,
    viewportH,
    viewportW,
  ]);

  // Gesture Handler 3 hook API (the v2 `Gesture.*` builders are legacy).
  const pinch = usePinchGesture({
    onUpdate: (event) => {
      const next = Math.min(Math.max(savedScale.value * event.scale, MIN_SCALE), MAX_SCALE);
      const fx = event.focalX;
      const fy = event.focalY;
      const worldX = (fx - savedTranslateX.value) / savedScale.value;
      const worldY = (fy - savedTranslateY.value) / savedScale.value;
      scale.value = next;
      translateX.value = fx - worldX * next;
      translateY.value = fy - worldY * next;
    },
    onDeactivate: () => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  const pan = usePanGesture({
    averageTouches: true,
    minPointers: 1,
    maxPointers: 2,
    activeOffsetX: [-12, 12],
    activeOffsetY: [-12, 12],
    onUpdate: (event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    },
    onDeactivate: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    maxDuration: 280,
    onActivate: () => {
      scheduleOnRN(fitToView);
    },
  });

  const pinchAndPan = useSimultaneousGestures(pinch, pan);
  const composed = useCompetingGestures(doubleTap, pinchAndPan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const edgeStroke = colors.border;
  const edgeMuted = colors.mutedForeground;
  const pathAccent = colors.accent;

  return (
    <View
      style={[
        styles.viewport,
        // Web: hint that the map is draggable (nodes keep their pointer cursor).
        Platform.OS === "web" && !tv ? webGrabCursor : null,
        {
          height: viewportH,
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      ref={viewportRef}
      accessibilityLabel={t("prophets.tree.mapA11y")}
      accessibilityHint={
        tv
          ? undefined
          : Platform.OS === "web"
            ? t("prophets.tree.panHintWeb")
            : t("prophets.tree.panHint")
      }
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setViewportW(w);
      }}
    >
      <Svg width="100%" height="100%" style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <Defs>
          <Pattern
            id="genealogyDots"
            x="0"
            y="0"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.1" fill={colors.border} opacity={0.55} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.muted} opacity={0.45} />
        <Rect width="100%" height="100%" fill="url(#genealogyDots)" />
      </Svg>

      <View style={[styles.toolbar, { pointerEvents: "box-none" }]}>
        <View
          style={[
            styles.toolbarCluster,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <IconButton
            name={{ ios: "minus", android: "remove", web: "remove" }}
            accessibilityLabel={t("prophets.tree.zoomOut")}
            onPress={() => zoomBy(1 / ZOOM_STEP)}
            tintColor={colors.foreground}
            hitTarget={44}
            size={18}
          />
          <View style={[styles.toolbarDivider, { backgroundColor: colors.border }]} />
          <IconButton
            name={{ ios: "plus", android: "add", web: "add" }}
            accessibilityLabel={t("prophets.tree.zoomIn")}
            onPress={() => zoomBy(ZOOM_STEP)}
            tintColor={colors.foreground}
            hitTarget={44}
            size={18}
          />
          <View style={[styles.toolbarDivider, { backgroundColor: colors.border }]} />
          <IconButton
            name={{
              ios: "arrow.up.left.and.arrow.down.right",
              android: "fit_screen",
              web: "fit_screen",
            }}
            accessibilityLabel={t("prophets.tree.fitView")}
            onPress={fitToView}
            tintColor={colors.foreground}
            hitTarget={44}
            size={18}
          />
        </View>
      </View>

      <MaybeGestureDetector
        gesture={tv ? null : composed}
        touchAction={Platform.OS === "web" && !touchEngaged ? "pan-y" : undefined}
      >
        <Animated.View
          style={[styles.canvas, { width: layout.width, height: layout.height }, animatedStyle]}
        >
          <Svg width={layout.width} height={layout.height}>
            {layout.edges.map((edge) => {
              const from = layout.byId[edge.fromId];
              const to = layout.byId[edge.toId];
              if (!from || !to) return null;

              const onLineage = lineageIds?.has(edge.fromId) && lineageIds.has(edge.toId);
              const dimmed =
                highlightIds != null &&
                highlightIds.size > 0 &&
                !highlightIds.has(edge.fromId) &&
                !highlightIds.has(edge.toId);
              const d =
                edge.kind === "parent" ? parentEdgePath(from, to) : siblingEdgePath(from, to);
              const stroke = onLineage
                ? pathAccent
                : edge.kind === "sibling"
                  ? edgeMuted
                  : edgeStroke;

              return (
                <Path
                  key={edge.id}
                  d={d}
                  stroke={stroke}
                  strokeWidth={onLineage ? 3.25 : edge.kind === "sibling" ? 1.75 : 2}
                  strokeDasharray={edge.kind === "sibling" ? "5 6" : undefined}
                  strokeOpacity={dimmed ? 0.12 : onLineage ? 0.95 : 0.55}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {layout.edges
              .filter((e) => e.kind === "parent")
              .map((edge) => {
                const to = layout.byId[edge.toId];
                if (!to) return null;
                const onLineage = Boolean(
                  lineageIds?.has(edge.toId) && lineageIds?.has(edge.fromId),
                );
                const dimmed =
                  highlightIds != null && highlightIds.size > 0 && !highlightIds.has(edge.toId);
                return (
                  <Circle
                    key={`dot-${edge.id}`}
                    cx={to.x + to.width / 2}
                    cy={to.y - 1}
                    r={onLineage ? 4 : 3}
                    fill={onLineage ? pathAccent : edgeStroke}
                    opacity={dimmed ? 0.15 : onLineage ? 1 : 0.7}
                  />
                );
              })}
          </Svg>

          {layout.positions.map((pos) => {
            const node = nodeById[pos.id];
            if (!node) return null;
            const selected = selectedId === node.id;
            const inLineage = Boolean(lineageIds?.has(node.id));
            const dimmed = Boolean(
              highlightIds && highlightIds.size > 0 && !highlightIds.has(node.id),
            );
            const tone = certaintyTone(node.certainty, tokens);
            return (
              <PressableScale
                key={node.id}
                // TV: nodes are not focus targets (clipped/transformed canvas);
                // the TV node list is the D-pad path.
                {...(tv ? { focusable: false } : null)}
                onPress={() => onSelect(node)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${node.name}, ${t(`prophets.tree.certainty.${node.certainty}`)}`}
                style={[
                  styles.node,
                  {
                    left: pos.x,
                    top: pos.y,
                    width: GENEALOGY_NODE_WIDTH,
                    height: GENEALOGY_NODE_HEIGHT,
                    backgroundColor: selected || inLineage ? tone.soft : colors.card,
                    borderColor: selected ? tone.color : inLineage ? colors.accent : colors.border,
                    borderWidth: selected ? 2 : StyleSheet.hairlineWidth * 2,
                    opacity: dimmed ? 0.22 : 1,
                    ...Platform.select({
                      ios: {
                        shadowColor: selected ? tone.color : "#000",
                        shadowOpacity: selected ? 0.22 : 0.07,
                        shadowRadius: selected ? 12 : 8,
                        shadowOffset: { width: 0, height: selected ? 4 : 2 },
                      },
                      android: { elevation: selected ? 5 : 2 },
                      default: {},
                    }),
                  },
                ]}
              >
                <View style={[styles.monogram, { backgroundColor: tone.color }]}>
                  <Text style={styles.monogramText}>{genealogyMonogram(node.name)}</Text>
                </View>
                <View style={styles.nodeCopy}>
                  <ThemedText type="footnote" weight="bold" style={styles.nodeName}>
                    {node.name}
                  </ThemedText>
                  <ThemedText
                    type="caption"
                    numberOfLines={2}
                    style={[styles.nodeMeta, { color: colors.mutedForeground }]}
                  >
                    {t(`prophets.tree.certainty.${node.certainty}`)}
                  </ThemedText>
                </View>
                <View style={[styles.certaintyDot, { backgroundColor: tone.color }]} />
              </PressableScale>
            );
          })}
        </Animated.View>
      </MaybeGestureDetector>

      <View
        style={[
          styles.legend,
          { backgroundColor: colors.card, borderColor: colors.border, pointerEvents: "none" },
        ]}
      >
        <View style={styles.legendRow}>
          <View style={[styles.legendLine, { backgroundColor: colors.accent }]} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("prophets.tree.legendParent")}
          </ThemedText>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendLineDashed, { borderColor: colors.mutedForeground }]} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("prophets.tree.legendSibling")}
          </ThemedText>
        </View>
        <View style={styles.legendCertainty}>
          {(
            [
              ["quran", tokens.status.success.color],
              ["authentic-hadith", tokens.status.info.color],
              ["classical-history", tokens.status.warning.color],
            ] as const
          ).map(([key, color]) => (
            <View key={key} style={styles.legendCertaintyItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`prophets.tree.certainty.${key}`)}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/** `grab` is valid CSS on react-native-web but outside RN's `cursor` union. */
const webGrabCursor = { cursor: "grab" } as unknown as ViewStyle;

/** Gesture handling only where touch exists (skipped on TV). */
function MaybeGestureDetector({
  gesture,
  touchAction,
  children,
}: {
  gesture: ReturnType<typeof useCompetingGestures> | null;
  touchAction?: "pan-y";
  children: ReactElement;
}) {
  if (!gesture) return children;
  return (
    <GestureDetector gesture={gesture} touchAction={touchAction}>
      {children}
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  viewport: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  toolbar: {
    position: "absolute",
    top: Spacing.twoHalf,
    end: Spacing.twoHalf,
    zIndex: 3,
  },
  toolbarCluster: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: Spacing.half,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  toolbarDivider: {
    width: StyleSheet.hairlineWidth * 2,
    height: 18,
    opacity: 0.8,
  },
  canvas: {
    transformOrigin: "0 0",
  },
  node: {
    position: "absolute",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.twoHalf,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  monogram: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  monogramText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  nodeCopy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
    paddingEnd: Spacing.two,
    justifyContent: "center",
  },
  nodeName: {
    lineHeight: 17,
    flexShrink: 1,
  },
  nodeMeta: {
    fontSize: 12,
    lineHeight: 16,
  },
  certaintyDot: {
    position: "absolute",
    top: 8,
    end: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legend: {
    position: "absolute",
    bottom: Spacing.twoHalf,
    start: Spacing.twoHalf,
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendLineDashed: {
    width: 20,
    borderTopWidth: BorderWidth.thick,
    borderStyle: "dashed",
  },
  legendCertainty: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  legendCertaintyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
