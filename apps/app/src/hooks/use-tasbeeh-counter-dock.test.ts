import { renderHook } from "@testing-library/react-native";
import type { ViewInstance } from "react-native";

import { captureAnimationFrames } from "@/test-support/animation-frames";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";

import { useTasbeehCounterDock } from "./use-tasbeeh-counter-dock";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

let frames: ReturnType<typeof captureAnimationFrames>;

/** Mounts the hook with a counter measured at window `y` and height `h`. */
async function setup(y: number, h: number) {
  const hook = await renderHook(() => useTasbeehCounterDock());
  const counter = {
    measureInWindow: jest.fn((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(0, y, 300, h),
    ),
  };
  (hook.result.current.counterRef as { current: unknown }).current =
    counter as unknown as ViewInstance;
  return { ...hook, counter };
}

beforeEach(() => {
  frames = captureAnimationFrames();
});

afterEach(() => {
  jest.restoreAllMocks();
  resetMockWindowSize();
});

describe("useTasbeehCounterDock", () => {
  it("never shows the dock before the first measurement", async () => {
    const { result } = await setup(2000, 200);
    expect(result.current.dockVisible).toBe(false);
  });

  it("shows the dock when less than half the counter is on screen", async () => {
    const { result } = await setup(800, 200);
    result.current.onCounterLayout();
    await frames.flush(16);
    expect(result.current.dockVisible).toBe(true);
  });

  it("hides the dock once the counter is mostly visible", async () => {
    const { result, counter } = await setup(800, 200);
    result.current.onScroll();
    await frames.flush(16);
    counter.measureInWindow.mockImplementation((cb) => cb(0, -50, 300, 200));
    result.current.recompute();
    await frames.flush(32);
    expect(result.current.dockVisible).toBe(false);
  });

  it("coalesces rapid recomputes into one frame", async () => {
    const { result, counter } = await setup(100, 200);
    result.current.onScroll();
    result.current.onScroll();
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
    await frames.flush(16, 32);
    expect(counter.measureInWindow).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["an unmeasured counter", 390, 0],
    ["a zero-height window", 0, 200],
  ])("ignores %s", async (_label, windowHeight, counterHeight) => {
    setMockWindowSize(390, windowHeight);
    const { result } = await setup(2000, counterHeight);
    result.current.recompute();
    await frames.flush(16);
    expect(result.current.dockVisible).toBe(false);
  });

  it("does nothing before the counter is mounted", async () => {
    const { result } = await renderHook(() => useTasbeehCounterDock());
    result.current.recompute();
    await frames.flush(16);
    expect(result.current.dockVisible).toBe(false);
  });
});
