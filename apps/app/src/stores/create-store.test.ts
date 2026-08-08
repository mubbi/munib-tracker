import { act, renderHook } from "@testing-library/react-native";

import { createStore, useStore } from "./create-store";

describe("useStore", () => {
  it("does not loop when the selector returns a new object each call", () => {
    const store = createStore<{ count: number; inc: () => void }>((set, get) => ({
      count: 0,
      inc: () => set({ count: get().count + 1 }),
    }));

    const { result, rerender } = renderHook(() => useStore(store, (s) => ({ count: s.count })));

    expect(result.current.count).toBe(0);
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);

    act(() => {
      store.getState().inc();
    });
    expect(result.current.count).toBe(1);
    expect(result.current).not.toBe(first);
  });

  it("re-reads when the selector closes over a new argument", () => {
    const store = createStore<{ items: Record<string, number> }>(() => ({
      items: { a: 1, b: 2 },
    }));

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useStore(store, (s) => s.items[id] ?? 0),
      { initialProps: { id: "a" } },
    );

    expect(result.current).toBe(1);
    rerender({ id: "b" });
    expect(result.current).toBe(2);
  });
});
