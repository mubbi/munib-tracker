import { act, renderHook } from "@testing-library/react-native";

import {
  __resetColdStartForTests,
  markColdStartReady,
  useColdStartReady,
  useMarkColdStartReady,
} from "@/lib/boot/cold-start";

describe("cold-start", () => {
  beforeEach(() => {
    __resetColdStartForTests();
  });

  it("starts unpainted", () => {
    const { result } = renderHook(() => useColdStartReady());
    expect(result.current).toBe(false);
  });

  it("becomes painted after markColdStartReady", () => {
    const { result } = renderHook(() => useColdStartReady());
    act(() => {
      markColdStartReady();
    });
    expect(result.current).toBe(true);
  });

  it("useMarkColdStartReady paints on mount", () => {
    const { result } = renderHook(() => {
      useMarkColdStartReady();
      return useColdStartReady();
    });
    expect(result.current).toBe(true);
  });
});
