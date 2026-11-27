import { act, renderHook } from "@testing-library/react-native";

import { captureAppStateListener } from "@/test-support/app-state";

import { useForegroundInterval } from "./use-foreground-interval";

const appState = captureAppStateListener();

async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useForegroundInterval", () => {
  it("runs on mount, on every interval and again on return to the foreground", async () => {
    const callback = jest.fn();
    await renderHook(() => useForegroundInterval(callback, 1000));
    expect(callback).toHaveBeenCalledTimes(1);

    await advance(2000);
    expect(callback).toHaveBeenCalledTimes(3);

    await act(async () => appState.emit("active"));
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it("stops polling in the background and resumes on foreground", async () => {
    const callback = jest.fn();
    await renderHook(() => useForegroundInterval(callback, 1000, { immediate: false }));
    expect(callback).not.toHaveBeenCalled();

    await act(async () => appState.emit("background"));
    await advance(5000);
    expect(callback).not.toHaveBeenCalled();

    await act(async () => appState.emit("active"));
    expect(callback).toHaveBeenCalledTimes(1);
    await advance(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("with a null interval only re-checks on foreground", async () => {
    const callback = jest.fn();
    await renderHook(() => useForegroundInterval(callback, null));
    await advance(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
    await act(async () => appState.emit("active"));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("does nothing while disabled and cleans up on unmount", async () => {
    const callback = jest.fn();
    const { rerender, unmount } = await renderHook(
      ({ enabled }: { enabled: boolean }) => useForegroundInterval(callback, 1000, { enabled }),
      { initialProps: { enabled: false } },
    );
    await advance(3000);
    expect(callback).not.toHaveBeenCalled();
    expect(appState.isArmed()).toBe(false);

    await rerender({ enabled: true });
    expect(callback).toHaveBeenCalledTimes(1);
    await unmount();
    await advance(3000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(appState.isArmed()).toBe(false);
  });

  it("always calls the latest callback without restarting the timer", async () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = await renderHook(
      ({ cb }: { cb: () => void }) => useForegroundInterval(cb, 1000, { immediate: false }),
      { initialProps: { cb: first } },
    );
    await advance(500);
    await rerender({ cb: second });
    await advance(500);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
