import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  const [viewportW, setViewportW] = useState(Math.min(windowW, 1120));
  const [viewportH, setViewportH] = useState(height);

  const layout = useMemo(() => layoutProphetsGenealogy(nodes, branchOrder), [nodes, branchOrder]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const lineageIds = useMemo(
    () => (selectedId ? genealogyLineageIds(selectedId, nodes) : null),
    [selectedId, nodes],
  );

  const scale = useSharedValue(1);
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
    scale.value = withTiming(next, { duration: 280 });
    savedScale.value = next;
    translateX.value = withTiming(offsetX, { duration: 280 });
    translateY.value = withTiming(offsetY, { duration: 280 });
    savedTranslateX.value = offsetX;
    savedTranslateY.value = offsetY;
  }, [
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

  const zoomBy = useCallback(
    (factor: number) => {
      const next = Math.min(Math.max(savedScale.value * factor, MIN_SCALE), MAX_SCALE);
      const cx = viewportW / 2;
      const cy = viewportH / 2;
      const worldX = (cx - savedTranslateX.value) / savedScale.value;
      const worldY = (cy - savedTranslateY.value) / savedScale.value;
      const offsetX = cx - worldX * next;
      const offsetY = cy - worldY * next;
      scale.value = withTiming(next, { duration: 180 });
      savedScale.value = next;
      translateX.value = withTiming(offsetX, { duration: 180 });
      translateY.value = withTiming(offsetY, { duration: 180 });
      savedTranslateX.value = offsetX;
      savedTranslateY.value = offsetY;
    },
    [
      scale,
      savedScale,
      translateX,
      translateY,
      savedTranslateX,
      savedTranslateY,
      viewportH,
      viewportW,
    ],
  );

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
    scale.value = withTiming(s, { duration: 320 });
    savedScale.value = s;
    translateX.value = withTiming(targetX, { duration: 320 });
    translateY.value = withTiming(targetY, { duration: 320 });
    savedTranslateX.value = targetX;
    savedTranslateY.value = targetY;
  }, [
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

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      const next = Math.min(Math.max(savedScale.value * event.scale, MIN_SCALE), MAX_SCALE);
      const fx = event.focalX;
      const fy = event.focalY;
      const worldX = (fx - savedTranslateX.value) / savedScale.value;
      const worldY = (fy - savedTranslateY.value) / savedScale.value;
      scale.value = next;
      translateX.value = fx - worldX * next;
      translateY.value = fy - worldY * next;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .minPointers(1)
    .maxPointers(2)
    .activeOffsetX([-12, 12])
    .activeOffsetY([-12, 12])
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(280)
    .onEnd(() => {
      "worklet";
      runOnJS(fitToView)();
    });

  const composed = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

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
        {
          height: viewportH,
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      accessibilityLabel={t("prophets.tree.mapA11y")}
      accessibilityHint={t("prophets.tree.panHint")}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setViewportW(w);
      }}
      {...(Platform.OS === "web"
        ? {
            onWheel: (event: { preventDefault?: () => void; deltaY?: number }) => {
              event.preventDefault?.();
              const dy = event.deltaY ?? 0;
              zoomBy(dy > 0 ? 1 / ZOOM_STEP : ZOOM_STEP);
            },
          }
        : null)}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
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

      <View style={styles.toolbar} pointerEvents="box-none">
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
            hitTarget={40}
            size={18}
          />
          <View style={[styles.toolbarDivider, { backgroundColor: colors.border }]} />
          <IconButton
            name={{ ios: "plus", android: "add", web: "add" }}
            accessibilityLabel={t("prophets.tree.zoomIn")}
            onPress={() => zoomBy(ZOOM_STEP)}
            tintColor={colors.foreground}
            hitTarget={40}
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
            hitTarget={40}
            size={18}
          />
        </View>
      </View>

      <GestureDetector gesture={composed}>
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
                  <ThemedText type="smallBold" style={styles.nodeName}>
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
      </GestureDetector>

      <View
        style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}
        pointerEvents="none"
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

const styles = StyleSheet.create({
  viewport: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  toolbar: {
    position: "absolute",
    top: Spacing.two + 2,
    end: Spacing.two + 2,
    zIndex: 3,
  },
  toolbarCluster: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: 2,
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
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.two + 2,
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
    gap: 2,
    paddingEnd: Spacing.two,
    justifyContent: "center",
  },
  nodeName: {
    fontSize: 13,
    lineHeight: 17,
    flexShrink: 1,
  },
  nodeMeta: {
    fontSize: 10,
    lineHeight: 13,
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
    bottom: Spacing.two + 2,
    start: Spacing.two + 2,
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
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
    borderTopWidth: 2,
    borderStyle: "dashed",
  },
  legendCertainty: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: 2,
  },
  legendCertaintyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
