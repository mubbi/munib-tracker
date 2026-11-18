import { act, renderHook } from "@testing-library/react-native";

import { usePlatform } from "@/test-support/platform";

import { useNow } from "./use-now";

const START = new Date("2026-11-18T10:00:30.000Z");

beforeEach(() => {
  jest.useFakeTimers({ now: START });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useNow on native", () => {
  it("starts at the wall clock", async () => {
    const { result } = await renderHook(() => useNow());
    expect(result.current.getTime()).toBe(START.getTime());
  });

  it("ticks on the minute boundary, then every interval", async () => {
    const { result } = await renderHook(() => useNow());
    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });
    expect(result.current.toISOString()).toBe("2026-11-18T10:01:00.000Z");
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    expect(result.current.toISOString()).toBe("2026-11-18T10:02:00.000Z");
  });

  it("supports a custom cadence and stops ticking on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const { result, unmount } = await renderHook(() => useNow(1_000));
    await act(async () => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.getTime()).toBe(START.getTime() + 1_000);
    await unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("clears a pending boundary timeout on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const clearTimeoutSpy = jest.spyOn(globalThis, "clearTimeout");
    const { unmount } = await renderHook(() => useNow());
    await unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(clearIntervalSpy).not.toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });
});

describe("useNow on web", () => {
  usePlatform({ OS: "web" });

  it("switches from the hydration anchor to real time after mount", async () => {
    const seen: Date[] = [];
    const { result } = await renderHook(() => {
      const now = useNow();
      seen.push(now);
      return now;
    });
    expect(seen[0].toISOString()).toBe("2000-01-01T12:00:00.000Z");
    expect(result.current.getTime()).toBe(START.getTime());
  });
});
