import { act } from "@testing-library/react-native";

/**
 * Captures `requestAnimationFrame` callbacks so tests step frames manually.
 * Call in `beforeEach`; restore with `jest.restoreAllMocks()`.
 */
export function captureAnimationFrames() {
  const frames: FrameRequestCallback[] = [];
  jest.spyOn(globalThis, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  jest.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});

  /** Runs queued frames (inside `act`), one per timestamp. */
  async function flush(...timestamps: number[]) {
    for (const timestamp of timestamps) {
      const next = frames.shift();
      if (!next) return;
      await act(async () => next(timestamp));
    }
  }

  return { frames, flush };
}
