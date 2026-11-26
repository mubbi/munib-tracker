import { SymbolView } from "expo-symbols";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  AccessibilityInfo,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Durations } from "@/constants/motion";
import { Control, IconSize, Spacing } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWebKeyHandler } from "@/hooks/use-web-key-handler";
import { triggerHaptic } from "@/lib/haptics";
import { useIsRTL } from "@/lib/rtl";

import {
  type GridMetrics,
  gridHeight,
  gridSlotAt,
  gridSlotOrigin,
  gridStep,
  indexMap,
  listHeight,
  listOffsets,
  listSlotAt,
  movePosition,
  moveTo,
  orderFromPositions,
} from "./sortable-logic";

export { moveTo } from "./sortable-logic";

/** What `renderItem` gets for each id. */
export type SortableItemInfo = {
  index: number;
  count: number;
  /** True while this item is being dragged. */
  active: boolean;
  /**
   * List variant: the drag handle (≡) to place in the row (trailing). Touch /
   * mouse drag starts on it; on web it is also the keyboard handle (focus it,
   * then ↑ / ↓). Null for the grid, where the whole item drags.
   */
  handle: ReactNode;
  /**
   * Spread onto the item's own accessible element: "Move up / down" (list) or
   * "Move earlier / later" (grid), plus "Remove" when `onRemove` is set.
   */
  accessibility: {
    accessibilityActions: AccessibilityActionInfo[];
    onAccessibilityAction: (event: AccessibilityActionEvent) => void;
  };
  /** Grid on web: spread onto the focusable tile so arrow keys reorder it. */
  focusProps: { onFocus: () => void; onBlur: () => void };
};

type CommonProps = {
  ids: readonly string[];
  renderItem: (id: string, info: SortableItemInfo) => ReactNode;
  /** Called once per drop / keyboard / accessibility move with the full new order. */
  onReorder: (next: string[]) => void;
  /** Spoken name of an item (move announcements, handle label). */
  itemLabel: (id: string) => string;
  /** Adds a "Remove" accessibility action. */
  onRemove?: (id: string) => void;
  /** Dragging + keyboard reorder on/off (default on). */
  enabled?: boolean;
  /** Estimated item height until each item is measured (dp). */
  estimatedItemHeight?: number;
  onDragStateChange?: (dragging: boolean) => void;
  testID?: string;
};

export type SortableListProps = CommonProps & {
  /** Space between rows. Default 0 (grouped rows draw their own dividers). */
  gap?: number;
};

export type SortableGridProps = CommonProps & {
  columns: number;
  rowGap?: number;
  /** Hold before a drag picks the tile up, so the page still scrolls (ms). */
  activateAfterLongPress?: number;
};

type Variant = "list" | "grid";

type Shared = {
  positions: SharedValue<Record<string, number>>;
  heights: SharedValue<Record<string, number>>;
  activeId: SharedValue<string | null>;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  startX: SharedValue<number>;
  startY: SharedValue<number>;
  animating: SharedValue<boolean>;
  metrics: SharedValue<GridMetrics & { fallback: number; gap: number }>;
};

/** Vertical drag-to-reorder list (drag handle per row). */
export function SortableList({ gap = 0, ...props }: SortableListProps) {
  return <Sortable variant="list" columns={1} gap={gap} rowGap={gap} {...props} />;
}

/**
 * Drag-to-reorder grid: a short hold picks a tile up, the others slide aside
 * (RTL-aware), one haptic tick per slot crossed, the order commits on drop.
 */
export function SortableGrid({
  columns,
  rowGap = 0,
  activateAfterLongPress = 150,
  ...props
}: SortableGridProps) {
  return (
    <Sortable
      variant="grid"
      columns={Math.max(1, columns)}
      gap={rowGap}
      rowGap={rowGap}
      activateAfterLongPress={activateAfterLongPress}
      {...props}
    />
  );
}

function Sortable({
  variant,
  ids,
  renderItem,
  onReorder,
  itemLabel,
  onRemove,
  enabled = true,
  estimatedItemHeight,
  onDragStateChange,
  testID,
  columns,
  gap,
  rowGap,
  activateAfterLongPress,
}: CommonProps & {
  variant: Variant;
  columns: number;
  gap: number;
  rowGap: number;
  activateAfterLongPress?: number;
}) {
  const { t } = useTranslation();
  const rtl = useIsRTL();
  const reducedMotion = useHydrationSafeReducedMotion() === true;
  const fallback = estimatedItemHeight ?? (variant === "list" ? Control.row : 96);
  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const positions = useSharedValue<Record<string, number>>(indexMap(ids));
  const heightsSV = useSharedValue<Record<string, number>>({});
  const activeId = useSharedValue<string | null>(null);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const animating = useSharedValue(false);

  const rowHeight = useMemo(() => {
    let max = 0;
    for (const id of ids) max = Math.max(max, heights[id] ?? 0);
    return max > 0 ? max : fallback;
  }, [fallback, heights, ids]);
  const metricsValue = useMemo(
    () => ({
      columns,
      cellWidth: width > 0 ? width / columns : 0,
      rowHeight,
      columnGap: 0,
      rowGap,
      fallback,
      gap,
    }),
    [columns, fallback, gap, rowGap, rowHeight, width],
  );
  const metrics = useSharedValue(metricsValue);
  useEffect(() => {
    metrics.value = metricsValue;
  }, [metrics, metricsValue]);

  // External order changes (a drop the parent accepted, an add / remove) re-seed
  // the slots. The dropped order already matches, so nothing jumps.
  // Keyed on the id list *contents*: parents rebuild the array every render, and
  // re-seeding mid-drag would drop the lifted item.
  const idsKey = ids.join("\u0000");
  useLayoutEffect(() => {
    positions.value = indexMap(idsKey.length > 0 ? idsKey.split("\u0000") : []);
    animating.value = false;
  }, [animating, idsKey, positions]);

  // Absolute layout only once the container and every item are measured; until
  // then (first frame, Jest) the items flow normally, which looks identical.
  const measured = width > 0 && ids.every((id) => heights[id] != null);

  const onItemLayout = useCallback(
    (id: string, height: number) => {
      setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
      heightsSV.value = { ...heightsSV.value, [id]: height };
    },
    [heightsSV],
  );

  const commit = useCallback(
    (next: string[], announce: boolean) => {
      const changed = next.length === ids.length && next.some((id, i) => id !== ids[i]);
      if (!changed) return;
      onReorder(next);
      if (announce) {
        const moved = next.find((id, i) => id !== ids[i]);
        if (moved) {
          AccessibilityInfo.announceForAccessibility(
            t("sortable.movedTo", {
              item: itemLabel(moved),
              position: next.indexOf(moved) + 1,
              total: next.length,
            }),
          );
        }
      }
    },
    [ids, itemLabel, onReorder, t],
  );

  const onDragStart = useCallback(
    (id: string) => {
      setActiveKey(id);
      triggerHaptic("medium");
      onDragStateChange?.(true);
    },
    [onDragStateChange],
  );
  const onDragEnd = useCallback(
    (next: string[]) => {
      setActiveKey(null);
      triggerHaptic("light");
      onDragStateChange?.(false);
      commit(next, false);
    },
    [commit, onDragStateChange],
  );
  const onSlotChange = useCallback(() => triggerHaptic("selection"), []);

  // Web keyboard: the focused handle / tile moves with the arrow keys; focus is
  // restored after React moves the node.
  const refocus = useRef<HTMLElement | null>(null);
  const moveBy = useCallback(
    (id: string, to: (index: number) => number) => {
      const index = ids.indexOf(id);
      if (index < 0) return;
      const target = to(index);
      if (target === index) return;
      if (Platform.OS === "web" && typeof document !== "undefined") {
        refocus.current = document.activeElement as HTMLElement | null;
      }
      triggerHaptic("selection");
      commit(moveTo(ids, index, target), true);
    },
    [commit, ids],
  );
  useLayoutEffect(() => {
    const el = refocus.current;
    refocus.current = null;
    if (el && typeof document !== "undefined" && document.activeElement !== el) el.focus?.();
  });
  useWebKeyHandler(
    (event) => {
      if (!focusedId) return undefined;
      const count = ids.length;
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const backward = rtl ? "ArrowRight" : "ArrowLeft";
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowUp") dy = -1;
      else if (event.key === "ArrowDown") dy = 1;
      else if (variant === "grid" && event.key === forward) dx = 1;
      else if (variant === "grid" && event.key === backward) dx = -1;
      else return undefined;
      moveBy(focusedId, (index) =>
        variant === "grid" ? gridStep(index, count, columns, dx, dy) : index + dy,
      );
      return true;
    },
    enabled && focusedId != null && Platform.OS === "web",
  );

  const shared: Shared = {
    positions,
    heights: heightsSV,
    activeId,
    dragX,
    dragY,
    startX,
    startY,
    animating,
    metrics,
  };

  const containerHeight =
    variant === "grid"
      ? gridHeight(ids.length, metricsValue)
      : listHeight(ids, heights, fallback, gap);

  return (
    <View
      testID={testID}
      onLayout={(event: LayoutChangeEvent) => {
        const next = event.nativeEvent.layout.width;
        if (next !== width) setWidth(next);
      }}
      style={[
        measured ? { height: containerHeight } : variant === "grid" ? styles.flowGrid : null,
        !measured && { gap: variant === "grid" ? undefined : gap, rowGap },
      ]}
    >
      {ids.map((id, index) => (
        <SortableItem
          key={id}
          id={id}
          index={index}
          count={ids.length}
          variant={variant}
          measured={measured}
          cellWidth={metricsValue.cellWidth}
          columns={columns}
          rtl={rtl}
          reducedMotion={reducedMotion}
          enabled={enabled}
          active={activeKey === id}
          activateAfterLongPress={activateAfterLongPress}
          shared={shared}
          label={itemLabel(id)}
          removable={onRemove != null}
          renderItem={renderItem}
          onLayout={onItemLayout}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onSlotChange={onSlotChange}
          onMove={(to) => moveBy(id, to)}
          onRemove={onRemove ? () => onRemove(id) : undefined}
          onFocusChange={(focused) =>
            setFocusedId((current) => (focused ? id : current === id ? null : current))
          }
        />
      ))}
    </View>
  );
}

function SortableItem({
  id,
  index,
  count,
  variant,
  measured,
  cellWidth,
  columns,
  rtl,
  reducedMotion,
  enabled,
  active,
  activateAfterLongPress,
  shared,
  label,
  removable,
  renderItem,
  onLayout,
  onDragStart,
  onDragEnd,
  onSlotChange,
  onMove,
  onRemove,
  onFocusChange,
}: {
  id: string;
  index: number;
  count: number;
  variant: Variant;
  measured: boolean;
  cellWidth: number;
  columns: number;
  rtl: boolean;
  reducedMotion: boolean;
  enabled: boolean;
  active: boolean;
  activateAfterLongPress?: number;
  shared: Shared;
  label: string;
  removable: boolean;
  renderItem: CommonProps["renderItem"];
  onLayout: (id: string, height: number) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (next: string[]) => void;
  onSlotChange: () => void;
  onMove: (to: (index: number) => number) => void;
  onRemove?: () => void;
  onFocusChange: (focused: boolean) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { positions, heights, activeId, dragX, dragY, startX, startY, animating, metrics } = shared;
  const dir = rtl ? -1 : 1;
  const grid = variant === "grid";

  // No spreads in the config: the worklets plugin rejects them in gesture hooks.
  const pan = usePanGesture({
    enabled,
    // Grid: a short hold first, so the page still scrolls over the tiles. List:
    // the handle drags as soon as it moves.
    activateAfterLongPress: grid ? activateAfterLongPress : undefined,
    minDistance: grid ? undefined : 0,
    onActivate: () => {
      "worklet";
      const m = metrics.value;
      const slot = positions.value[id] ?? 0;
      if (grid) {
        const origin = gridSlotOrigin(slot, m);
        startX.value = origin.x;
        startY.value = origin.y;
      } else {
        startX.value = 0;
        startY.value = listOffsets(positions.value, heights.value, m.fallback, m.gap)[id] ?? 0;
      }
      dragX.value = startX.value;
      dragY.value = startY.value;
      animating.value = true;
      activeId.value = id;
      scheduleOnRN(onDragStart, id);
    },
    onUpdate: (event) => {
      "worklet";
      if (activeId.value !== id) return;
      const m = metrics.value;
      const count = Object.keys(positions.value).length;
      if (grid) {
        dragX.value = startX.value + (rtl ? -event.translationX : event.translationX);
        dragY.value = startY.value + event.translationY;
        const slot = gridSlotAt(dragX.value, dragY.value, count, m);
        if (slot !== positions.value[id]) {
          positions.value = movePosition(positions.value, id, slot);
          scheduleOnRN(onSlotChange);
        }
      } else {
        dragY.value = startY.value + event.translationY;
        const slot = listSlotAt(id, dragY.value, positions.value, heights.value, m.fallback, m.gap);
        if (slot !== positions.value[id]) {
          positions.value = movePosition(positions.value, id, slot);
          scheduleOnRN(onSlotChange);
        }
      }
    },
    onFinalize: () => {
      "worklet";
      if (activeId.value !== id) return;
      activeId.value = null;
      scheduleOnRN(onDragEnd, orderFromPositions(positions.value));
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (!measured) return {};
    const m = metrics.value;
    const slot = positions.value[id] ?? 0;
    let x = 0;
    let y = 0;
    if (grid) {
      const origin = gridSlotOrigin(slot, m);
      x = origin.x;
      y = origin.y;
    } else {
      y = listOffsets(positions.value, heights.value, m.fallback, m.gap)[id] ?? 0;
    }
    if (activeId.value === id) {
      return {
        zIndex: 2,
        transform: [
          { translateX: dir * dragX.value },
          { translateY: dragY.value },
          { scale: reducedMotion ? 1 : withTiming(1.04, { duration: Durations.fast }) },
        ],
      };
    }
    const settle = (value: number) =>
      animating.value && !reducedMotion ? withTiming(value, { duration: Durations.fast }) : value;
    return {
      zIndex: 0,
      transform: [{ translateX: settle(dir * x) }, { translateY: settle(y) }, { scale: settle(1) }],
    };
  });

  const actions: AccessibilityActionInfo[] = [
    {
      name: "moveEarlier",
      label: grid ? t("sortable.moveEarlier") : t("zikr.moveUp"),
    },
    {
      name: "moveLater",
      label: grid ? t("sortable.moveLater") : t("zikr.moveDown"),
    },
    ...(removable ? [{ name: "remove", label: t("common.remove") }] : []),
  ].filter(
    (action) =>
      (action.name !== "moveEarlier" || index > 0) &&
      (action.name !== "moveLater" || index < count - 1),
  );
  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case "moveEarlier":
        onMove((i) => i - 1);
        break;
      case "moveLater":
        onMove((i) => i + 1);
        break;
      case "remove":
        onRemove?.();
        break;
    }
  };
  const focusProps = {
    onFocus: () => onFocusChange(true),
    onBlur: () => onFocusChange(false),
  };

  const handle = grid ? null : (
    <GestureDetector gesture={pan}>
      <View
        collapsable={false}
        style={[styles.handle, { cursor: enabled ? "grab" : undefined } as object]}
      >
        <PressableScale
          testID={`sortable-handle-${id}`}
          accessible={Platform.OS === "web"}
          accessibilityRole="button"
          accessibilityLabel={t("sortable.handleLabel", { item: label })}
          accessibilityHint={t("sortable.handleHint")}
          importantForAccessibility={Platform.OS === "web" ? "auto" : "no-hide-descendants"}
          accessibilityElementsHidden={Platform.OS !== "web"}
          haptic={false}
          scaleTo={1}
          disabled={!enabled}
          onFocus={focusProps.onFocus}
          onBlur={focusProps.onBlur}
          style={styles.handleHit}
        >
          <SymbolView
            name={{ ios: "line.3.horizontal", android: "drag_handle", web: "drag_handle" }}
            size={IconSize.lg}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>
      </View>
    </GestureDetector>
  );

  const content = renderItem(id, {
    index,
    count,
    active,
    handle,
    accessibility: { accessibilityActions: actions, onAccessibilityAction },
    focusProps,
  });

  const body = (
    <Animated.View
      onLayout={(event: LayoutChangeEvent) => onLayout(id, event.nativeEvent.layout.height)}
      style={[
        measured ? styles.absolute : null,
        grid ? (measured ? { width: cellWidth } : { width: `${100 / columns}%` }) : styles.full,
        animatedStyle,
      ]}
    >
      {content}
    </Animated.View>
  );

  return grid ? <GestureDetector gesture={pan}>{body}</GestureDetector> : body;
}

const styles = StyleSheet.create({
  flowGrid: { flexDirection: "row", flexWrap: "wrap" },
  absolute: { position: "absolute", top: 0, start: 0 },
  full: { width: "100%" },
  handle: { alignSelf: "stretch", justifyContent: "center" },
  handleHit: {
    minWidth: Control.minTouch,
    minHeight: Control.minTouch,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
});
