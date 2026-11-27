import { act, renderHook } from "@testing-library/react-native";

import { useProgressiveList } from "./use-progressive-list";

/** Manual idle queue so each slice can be stepped (jest.setup runs idle work inline). */
const mockIdleQueue: Array<() => void> = [];
const mockCancel = jest.fn();

jest.mock("@/lib/run-when-idle", () => ({
  runWhenIdle: (task: () => void) => {
    mockIdleQueue.push(task);
    return { cancel: mockCancel };
  },
}));

async function flushIdle() {
  await act(async () => {
    mockIdleQueue.shift()?.();
  });
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

beforeEach(() => {
  mockIdleQueue.length = 0;
  mockCancel.mockClear();
});

describe("useProgressiveList", () => {
  it("returns short lists untouched without scheduling idle work", async () => {
    const items = range(5);
    const { result } = await renderHook(() => useProgressiveList(items, { initial: 10 }));
    expect(result.current).toBe(items);
    expect(mockIdleQueue).toHaveLength(0);
  });

  it("paints the first slice, then grows by batch on each idle callback", async () => {
    const items = range(25);
    const { result } = await renderHook(() => useProgressiveList(items, { initial: 10, batch: 8 }));
    expect(result.current).toEqual(range(10));

    await flushIdle();
    expect(result.current).toEqual(range(18));

    await flushIdle();
    expect(result.current).toBe(items);
    expect(mockIdleQueue).toHaveLength(0);
  });

  it("keeps rows already shown when the list shrinks or grows", async () => {
    const { result, rerender } = await renderHook(
      ({ items }: { items: readonly number[] }) => useProgressiveList(items, { initial: 4 }),
      { initialProps: { items: range(3) } },
    );
    expect(result.current).toEqual(range(3));

    await rerender({ items: range(10) });
    expect(result.current).toEqual(range(4));

    await flushIdle();
    expect(result.current).toEqual(range(10));
  });

  it("cancels pending idle work on unmount", async () => {
    const { unmount } = await renderHook(() => useProgressiveList(range(50), { initial: 5 }));
    await unmount();
    expect(mockCancel).toHaveBeenCalled();
  });
});
