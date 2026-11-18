import { act, renderHook } from "@testing-library/react-native";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  ViewInstance,
} from "react-native";

import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";

import {
  scrollChildIntoView,
  useScrollFollowViewPosition,
  useScrollToActive,
  useScrollToActiveHorizontal,
  useScrollToActiveIndex,
} from "./use-scroll-to-active";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

jest.mock("@/hooks/use-content-bottom-inset", () => ({
  useObstructedBottomInset: () => mockObstructed,
}));

let mockObstructed = 0;

/** A host node whose `measure` reports the given page position and width. */
function measured(pageX: number, pageY: number, width = 100) {
  return {
    measure: jest.fn((cb: (...args: number[]) => void) => cb(0, 0, width, 40, pageX, pageY)),
  } as unknown as ViewInstance;
}

function scrollView(pageX: number, pageY: number, width = 400) {
  return {
    ...measured(pageX, pageY, width),
    scrollTo: jest.fn(),
  } as unknown as ScrollViewInstance & {
    scrollTo: jest.Mock;
  };
}

function scrollEvent(offset: { x?: number; y?: number } | undefined) {
  return { nativeEvent: { contentOffset: offset } } as NativeSyntheticEvent<NativeScrollEvent>;
}

beforeEach(() => {
  jest.useFakeTimers();
  mockObstructed = 0;
});

afterEach(() => {
  jest.useRealTimers();
  resetMockWindowSize();
});

describe("useScrollToActive", () => {
  async function setup(
    activeKey: string | null,
    scroll: ScrollViewInstance | null = scrollView(0, 100),
  ) {
    const scrollRef = { current: scroll };
    const hook = await renderHook(({ key }) => useScrollToActive(scrollRef, key), {
      initialProps: { key: activeKey },
    });
    return { ...hook, scroll: scroll as ReturnType<typeof scrollView> };
  }

  it("scrolls the active card below the offset, accounting for the scroll position", async () => {
    const { result, rerender, scroll } = await setup(null);
    result.current.register("a")(measured(0, 400));
    result.current.onScroll(scrollEvent({ y: 50 }));
    await rerender({ key: "a" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    // 50 + (400 - 100) - 96
    expect(scroll.scrollTo).toHaveBeenCalledWith({ y: 254, animated: true });
  });

  it("clamps the target at the top", async () => {
    const { result, rerender, scroll } = await setup(null);
    result.current.register("a")(measured(0, 110));
    result.current.onScroll(scrollEvent(undefined));
    await rerender({ key: "a" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(scroll.scrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
  });

  it("does nothing for an unregistered card", async () => {
    const { result, rerender, scroll } = await setup(null);
    result.current.register("a")(measured(0, 400));
    result.current.register("a")(null);
    await rerender({ key: "a" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(scroll.scrollTo).not.toHaveBeenCalled();
  });

  it("does nothing without a scroll view", async () => {
    const { result, rerender } = await setup(null, null);
    const node = measured(0, 400);
    result.current.register("a")(node);
    await rerender({ key: "a" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(node.measure).not.toHaveBeenCalled();
  });
});

describe("useScrollToActiveHorizontal", () => {
  it("centres the active chip in the viewport", async () => {
    const scroll = scrollView(10, 0, 400);
    const scrollRef = { current: scroll };
    const { result, rerender } = await renderHook(
      ({ key }) => useScrollToActiveHorizontal(scrollRef, key),
      { initialProps: { key: null as string | null } },
    );
    result.current.register("maghrib")(measured(510, 0, 100));
    result.current.onScroll(scrollEvent({ x: 20 }));
    await rerender({ key: "maghrib" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    // chipLeft = 20 + (510 - 10) = 520; 520 - (400 - 100) / 2 = 370
    expect(scroll.scrollTo).toHaveBeenCalledWith({ x: 370, animated: true });
  });

  it("clamps at the start and ignores missing chips", async () => {
    const scroll = scrollView(0, 0, 400);
    const scrollRef = { current: scroll };
    const { result, rerender } = await renderHook(
      ({ key }) => useScrollToActiveHorizontal(scrollRef, key),
      { initialProps: { key: "missing" as string | null } },
    );
    result.current.register("fajr")(measured(0, 0, 100));
    result.current.onScroll(scrollEvent(undefined));
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(scroll.scrollTo).not.toHaveBeenCalled();
    result.current.register("missing")(null);
    await rerender({ key: "fajr" });
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(scroll.scrollTo).toHaveBeenCalledWith({ x: 0, animated: true });
  });
});

describe("useScrollFollowViewPosition", () => {
  async function positionFor(explicit?: number) {
    const { result } = await renderHook(() => useScrollFollowViewPosition(explicit));
    return result.current;
  }

  it("returns an explicit position unchanged", async () => {
    expect(await positionFor(0.7)).toBe(0.7);
  });

  it("falls back when the window has no height", async () => {
    setMockWindowSize(390, 0);
    expect(await positionFor()).toBe(0.35);
  });

  it.each([
    [0, 0.45],
    [200, 0.5 - 200 / 844 / 2],
    [800, 0.22],
  ])("biases upward for an obstructed inset of %i", async (inset, expected) => {
    mockObstructed = inset;
    expect(await positionFor()).toBeCloseTo(expected);
  });
});

describe("useScrollToActiveIndex", () => {
  type ListMock = { scrollToIndex: jest.Mock; scrollToOffset: jest.Mock };

  function makeList(): ListMock {
    return { scrollToIndex: jest.fn(), scrollToOffset: jest.fn() };
  }

  async function setup(
    activeKey: string | null,
    config: Parameters<typeof useScrollToActiveIndex>[3] = { itemCount: 10, viewPosition: 0.3 },
    list: ListMock | null = makeList(),
  ) {
    const listRef = { current: list as unknown as FlatList };
    const indexForKey = (key: string) => Number(key);
    const hook = await renderHook(
      ({ key }) => useScrollToActiveIndex(listRef, key, indexForKey, config),
      { initialProps: { key: activeKey } },
    );
    return { ...hook, list: list as ListMock, listRef };
  }

  it("scrolls to the active index after a short delay", async () => {
    const { list } = await setup("4");
    expect(list.scrollToIndex).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(list.scrollToIndex).toHaveBeenCalledWith({
      index: 4,
      viewOffset: 96,
      viewPosition: 0.3,
      animated: true,
    });
  });

  it.each([["-1"], ["10"]])("ignores out-of-range index %s", async (key) => {
    const { list } = await setup(key);
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(list.scrollToIndex).not.toHaveBeenCalled();
  });

  it("does nothing without an active key", async () => {
    const { list } = await setup(null);
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(list.scrollToIndex).not.toHaveBeenCalled();
  });

  it("swallows synchronous scrollToIndex errors", async () => {
    const list = makeList();
    list.scrollToIndex.mockImplementation(() => {
      throw new Error("out of range");
    });
    await setup("2", {}, list);
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    expect(list.scrollToIndex).toHaveBeenCalled();
  });

  it("does not scroll once the list has unmounted", async () => {
    const { result, list, listRef } = await setup("2", {});
    (listRef as { current: unknown }).current = null;
    await act(async () => {
      jest.advanceTimersByTime(60);
      result.current.onScrollToIndexFailed({ index: 2, averageItemLength: 50 });
    });
    expect(list.scrollToIndex).not.toHaveBeenCalled();
    expect(list.scrollToOffset).not.toHaveBeenCalled();
  });

  it("recovers from a failed scroll by jumping near the row and retrying", async () => {
    const { result, list } = await setup(null, { numColumns: 2, listHeaderHeight: 30 });
    await act(async () => {
      result.current.onScrollToIndexFailed({ index: 5, averageItemLength: 50 });
      result.current.onScrollToIndexFailed({ index: 5, averageItemLength: 50 });
    });
    // row = floor(5 / 2) = 2 → 30 + 2 * 50
    expect(list.scrollToOffset).toHaveBeenCalledWith({ offset: 130, animated: false });
    await act(async () => {
      jest.advanceTimersByTime(80);
    });
    expect(list.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(list.scrollToIndex).toHaveBeenCalledWith(expect.objectContaining({ index: 5 }));
  });

  it("ignores failures for out-of-range indexes", async () => {
    const { result, list } = await setup(null, { itemCount: 3 });
    await act(async () => {
      result.current.onScrollToIndexFailed({ index: 9, averageItemLength: 50 });
    });
    expect(list.scrollToOffset).not.toHaveBeenCalled();
  });

  it("cancels a pending retry when the active key changes or on unmount", async () => {
    const { result, list, rerender, unmount } = await setup(null, { itemCount: 10 });
    await act(async () => {
      result.current.onScrollToIndexFailed({ index: 5, averageItemLength: 50 });
    });
    await rerender({ key: null });
    await act(async () => {
      result.current.onScrollToIndexFailed({ index: 6, averageItemLength: 50 });
    });
    await rerender({ key: "1" });
    await act(async () => {
      result.current.onScrollToIndexFailed({ index: 7, averageItemLength: 50 });
    });
    await unmount();
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    expect(list.scrollToIndex).not.toHaveBeenCalled();
  });
});

describe("scrollChildIntoView", () => {
  it("scrolls the child below the offset", () => {
    const scroll = scrollView(0, 100);
    scrollChildIntoView({ current: scroll }, { current: measured(0, 500) }, 20, 50);
    expect(scroll.scrollTo).toHaveBeenCalledWith({ y: 370, animated: true });
  });

  it("clamps at the top with the default offset", () => {
    const scroll = scrollView(0, 100);
    scrollChildIntoView({ current: scroll }, { current: measured(0, 120) }, 0);
    expect(scroll.scrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
  });

  it("does nothing when the child is not mounted", () => {
    const scroll = scrollView(0, 100);
    scrollChildIntoView({ current: scroll }, { current: null }, 0);
    expect(scroll.scrollTo).not.toHaveBeenCalled();
  });
});
