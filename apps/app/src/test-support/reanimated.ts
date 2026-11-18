import { useRef } from "react";
import * as Reanimated from "react-native-reanimated";

/**
 * The global Reanimated mock never runs `useAnimatedStyle` worklets and recreates
 * shared values every render. This makes shared values stable per component and
 * records each worklet so a test can evaluate the style after an interaction.
 * Call in `beforeEach`; undo with `jest.restoreAllMocks()`.
 */
export function captureAnimatedStyles() {
  const worklets: (() => Record<string, unknown>)[] = [];
  jest
    .spyOn(Reanimated, "useSharedValue")
    // biome-ignore lint/correctness/useHookAtTopLevel: runs inside the component's render
    .mockImplementation((initial) => useRef({ value: initial }).current as never);
  jest.spyOn(Reanimated, "useAnimatedStyle").mockImplementation((worklet) => {
    worklets.push(worklet as () => Record<string, unknown>);
    return {};
  });

  /** Evaluates the most recently registered worklet against current shared values. */
  return { latest: () => worklets.at(-1)?.() ?? {} };
}

/**
 * The global Reanimated mock has no `Keyframe`; modules that build keyframes at
 * import time need this stub installed first — so `require()` such a module
 * after calling it rather than importing it statically.
 */
export function installKeyframeStub(): void {
  const reanimated = require("react-native-reanimated") as Record<string, unknown>;
  if (reanimated.Keyframe) return;
  reanimated.Keyframe = class {
    duration() {
      return this;
    }
    delay() {
      return this;
    }
  };
}
