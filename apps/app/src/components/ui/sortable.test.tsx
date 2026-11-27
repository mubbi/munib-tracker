import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { SortableGrid, SortableList } from "@/components/ui/sortable";
import {
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
} from "@/components/ui/sortable-logic";
import { triggerHaptic } from "@/lib/haptics";
import { useIsRTL } from "@/lib/rtl";
import { usePlatform } from "@/test-support/platform";
import { captureAnimatedStyles } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";

type PanConfig = {
  enabled?: boolean;
  activateAfterLongPress?: number;
  onActivate?: () => void;
  onUpdate?: (event: { translationX: number; translationY: number }) => void;
  onFinalize?: () => void;
};

/** Every `usePanGesture` config, in call order (one per item per render). */
const panConfigs: PanConfig[] = [];
jest.mock("react-native-gesture-handler", () => {
  const { View: RNView } = require("react-native");
  return {
    __esModule: true,
    GestureDetector: ({ children }: { children: unknown }) => children,
    GestureHandlerRootView: RNView,
    usePanGesture: (config: PanConfig) => {
      panConfigs.push(config);
      return { kind: "pan" };
    },
  };
});
jest.mock("@/lib/haptics", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/lib/rtl", () => ({
  ...jest.requireActual("@/lib/rtl"),
  useIsRTL: jest.fn(() => false),
}));
let keyHandler: { handler: (event: { key: string }) => unknown; enabled: boolean } | null = null;
jest.mock("@/hooks/use-web-key-handler", () => ({
  useWebKeyHandler: (handler: (event: { key: string }) => unknown, enabled: boolean) => {
    keyHandler = { handler, enabled };
  },
}));

/** The latest config for each of the `count` items (render order = id order). */
const latestPans = (count: number) => panConfigs.slice(-count);

const labelFor = (id: string) => id.toUpperCase();

describe("sortable-logic", () => {
  it("moves an item and clamps the target", () => {
    expect(moveTo(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveTo(["a", "b", "c"], 2, -5)).toEqual(["c", "a", "b"]);
    expect(moveTo(["a", "b"], 5, 0)).toEqual(["a", "b"]);
  });

  it("round-trips positions and moves within them", () => {
    const positions = indexMap(["a", "b", "c"]);
    expect(orderFromPositions(positions)).toEqual(["a", "b", "c"]);
    expect(orderFromPositions(movePosition(positions, "c", 0))).toEqual(["c", "a", "b"]);
  });

  const grid = { columns: 3, cellWidth: 100, rowHeight: 80, columnGap: 0, rowGap: 10 };

  it("maps grid slots to origins and back", () => {
    expect(gridSlotOrigin(4, grid)).toEqual({ x: 100, y: 90 });
    expect(gridSlotAt(100, 90, 6, grid)).toBe(4);
    // Past the edges clamps to the last row / column.
    expect(gridSlotAt(900, 900, 5, grid)).toBe(4);
    expect(gridSlotAt(-50, -50, 5, grid)).toBe(0);
    expect(gridHeight(5, grid)).toBe(170);
    expect(gridHeight(0, grid)).toBe(0);
  });

  it("lays out list rows with measured and estimated heights", () => {
    const positions = indexMap(["a", "b", "c"]);
    expect(listOffsets(positions, { a: 40 }, 50, 2)).toEqual({ a: 0, b: 42, c: 94 });
    expect(listHeight(["a", "b", "c"], { a: 40 }, 50, 2)).toBe(144);
    expect(listHeight([], {}, 50, 2)).toBe(0);
  });

  it("finds the list slot closest to a dragged row", () => {
    const positions = indexMap(["a", "b", "c"]);
    expect(listSlotAt("a", 120, positions, {}, 52, 0)).toBe(2);
    expect(listSlotAt("a", 30, positions, {}, 52, 0)).toBe(1);
    expect(listSlotAt("c", -20, positions, {}, 52, 0)).toBe(0);
  });

  it("steps through a grid by column and row", () => {
    expect(gridStep(1, 6, 3, 1, 0)).toBe(2);
    expect(gridStep(1, 6, 3, 0, 1)).toBe(4);
    expect(gridStep(5, 6, 3, 0, 1)).toBe(5);
    expect(gridStep(0, 6, 3, -1, 0)).toBe(0);
  });
});

describe("SortableList", () => {
  beforeEach(() => {
    panConfigs.length = 0;
    keyHandler = null;
    jest.mocked(triggerHaptic).mockClear();
  });
  afterEach(() => jest.restoreAllMocks());

  const renderList = (onReorder = jest.fn(), onRemove?: (id: string) => void) =>
    renderWithTheme(
      <SortableList
        ids={["a", "b", "c"]}
        onReorder={onReorder}
        onRemove={onRemove}
        itemLabel={labelFor}
        renderItem={(id, info) => (
          <View
            testID={`row-${id}`}
            accessible
            accessibilityLabel={labelFor(id)}
            {...info.accessibility}
          >
            <Text>{labelFor(id)}</Text>
            {info.handle}
          </View>
        )}
      />,
    );

  const actionNames = (id: string) =>
    (screen.getByTestId(`row-${id}`).props.accessibilityActions as { name: string }[]).map(
      (a) => a.name,
    );

  it("offers only the moves that exist, plus Remove when removable", async () => {
    await renderList(jest.fn(), jest.fn());

    expect(actionNames("a")).toEqual(["moveLater", "remove"]);
    expect(actionNames("b")).toEqual(["moveEarlier", "moveLater", "remove"]);
    expect(actionNames("c")).toEqual(["moveEarlier", "remove"]);
  });

  it("moves a row with its accessibility actions", async () => {
    const onReorder = jest.fn();
    await renderList(onReorder);

    await fireEvent(screen.getByTestId("row-a"), "accessibilityAction", {
      nativeEvent: { actionName: "moveLater" },
    });
    expect(onReorder).toHaveBeenLastCalledWith(["b", "a", "c"]);

    await fireEvent(screen.getByTestId("row-c"), "accessibilityAction", {
      nativeEvent: { actionName: "moveEarlier" },
    });
    expect(onReorder).toHaveBeenLastCalledWith(["a", "c", "b"]);
  });

  it("removes a row from its accessibility action", async () => {
    const onRemove = jest.fn();
    await renderList(jest.fn(), onRemove);

    await fireEvent(screen.getByTestId("row-b"), "accessibilityAction", {
      nativeEvent: { actionName: "remove" },
    });

    expect(onRemove).toHaveBeenCalledWith("b");
  });

  it("drags a row by its handle: one tick per slot, commit on drop", async () => {
    captureAnimatedStyles();
    const onReorder = jest.fn();
    await renderList(onReorder);
    const [panA] = latestPans(3);

    await act(async () => panA?.onActivate?.());
    await act(async () => panA?.onUpdate?.({ translationX: 0, translationY: 60 }));
    await act(async () => panA?.onUpdate?.({ translationX: 0, translationY: 120 }));
    // Not committed until the drop.
    expect(onReorder).not.toHaveBeenCalled();
    await act(async () => panA?.onFinalize?.());

    expect(onReorder).toHaveBeenCalledWith(["b", "c", "a"]);
    expect(
      jest.mocked(triggerHaptic).mock.calls.filter(([type]) => type === "selection"),
    ).toHaveLength(2);
  });

  it("does not commit a drop back in place", async () => {
    captureAnimatedStyles();
    const onReorder = jest.fn();
    await renderList(onReorder);
    const [, panB] = latestPans(3);

    await act(async () => panB?.onActivate?.());
    await act(async () => panB?.onUpdate?.({ translationX: 0, translationY: 10 }));
    await act(async () => panB?.onFinalize?.());

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("disables dragging when not enabled", async () => {
    await renderWithTheme(
      <SortableList
        ids={["a", "b"]}
        enabled={false}
        onReorder={jest.fn()}
        itemLabel={labelFor}
        renderItem={(id, info) => (
          <View>
            <Text>{id}</Text>
            {info.handle}
          </View>
        )}
      />,
    );

    expect(latestPans(2).every((pan) => pan.enabled === false)).toBe(true);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("moves the focused handle's row with the arrow keys", async () => {
      const onReorder = jest.fn();
      await renderList(onReorder);

      await fireEvent(screen.getByTestId("sortable-handle-a"), "focus");
      expect(keyHandler?.enabled).toBe(true);
      await act(async () => keyHandler?.handler({ key: "ArrowDown" }));

      expect(onReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    });

    it("exposes the handle as a named keyboard control", async () => {
      await renderList();

      expect(screen.getByLabelText("Reorder A")).toBeTruthy();
    });
  });
});

describe("SortableGrid", () => {
  beforeEach(() => {
    panConfigs.length = 0;
    jest.mocked(useIsRTL).mockReturnValue(false);
  });
  afterEach(() => jest.restoreAllMocks());

  const renderGrid = async (onReorder = jest.fn()) => {
    await renderWithTheme(
      <SortableGrid
        testID="grid"
        ids={["a", "b", "c", "d"]}
        columns={2}
        onReorder={onReorder}
        itemLabel={labelFor}
        estimatedItemHeight={80}
        renderItem={(id) => <Text>{id}</Text>}
      />,
    );
    await fireEvent(screen.getByTestId("grid"), "layout", {
      nativeEvent: { layout: { width: 200, height: 160, x: 0, y: 0 } },
    });
    return onReorder;
  };

  it("picks tiles up after a short hold", async () => {
    await renderGrid();

    expect(latestPans(4).every((pan) => pan.activateAfterLongPress === 150)).toBe(true);
  });

  it("drops a tile into the slot under it", async () => {
    captureAnimatedStyles();
    const onReorder = await renderGrid();
    const [panA] = latestPans(4);

    await act(async () => panA?.onActivate?.());
    // One column across, one row down → slot 3.
    await act(async () => panA?.onUpdate?.({ translationX: 100, translationY: 80 }));
    await act(async () => panA?.onFinalize?.());

    expect(onReorder).toHaveBeenCalledWith(["b", "c", "d", "a"]);
  });

  it("mirrors horizontal drags in RTL", async () => {
    jest.mocked(useIsRTL).mockReturnValue(true);
    captureAnimatedStyles();
    const onReorder = await renderGrid();
    const [panA] = latestPans(4);

    await act(async () => panA?.onActivate?.());
    // RTL: the next column is to the physical left.
    await act(async () => panA?.onUpdate?.({ translationX: -100, translationY: 0 }));
    await act(async () => panA?.onFinalize?.());

    expect(onReorder).toHaveBeenCalledWith(["b", "a", "c", "d"]);
  });

  it("names grid moves earlier / later", async () => {
    await renderWithTheme(
      <SortableGrid
        ids={["a", "b"]}
        columns={2}
        onReorder={jest.fn()}
        itemLabel={labelFor}
        renderItem={(id, info) => (
          <View testID={`tile-${id}`} accessible {...info.accessibility}>
            <Text>{id}</Text>
          </View>
        )}
      />,
    );

    expect(screen.getByTestId("tile-a").props.accessibilityActions).toEqual([
      { name: "moveLater", label: "Move later" },
    ]);
  });
});
