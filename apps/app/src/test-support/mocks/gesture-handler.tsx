/**
 * Shared `react-native-gesture-handler` mock (Gesture Handler 3 hook API).
 * `GestureDetector` renders its child inside a `gesture-detector` view, and each
 * `use*Gesture(config)` hook records its config so tests can drive callbacks:
 *
 *   jest.mock("react-native-gesture-handler", () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock);
 *   import { mockGestures, resetGestureMocks } from "@/test-support/mocks/gesture-handler";
 *   act(() => mockGestures.pinch?.onUpdate?.({ scale: 2, focalX: 0, focalY: 0 }));
 */
import type { ReactNode } from "react";
import { View } from "react-native";

export type MockGestureConfig = {
  onUpdate?: (event: Record<string, number>) => void;
  onDeactivate?: () => void;
  onActivate?: () => void;
};

/** Last config passed to each gesture hook, keyed by kind. */
export const mockGestures: Partial<Record<"pinch" | "pan" | "tap", MockGestureConfig>> = {};

export function resetGestureMocks(): void {
  for (const key of Object.keys(mockGestures) as (keyof typeof mockGestures)[]) {
    delete mockGestures[key];
  }
}

function record(kind: keyof typeof mockGestures) {
  return (config: MockGestureConfig) => {
    mockGestures[kind] = config;
    return { kind };
  };
}

function GestureDetector({ children }: { children: ReactNode }) {
  return <View testID="gesture-detector">{children}</View>;
}

export const gestureHandlerMock = {
  __esModule: true,
  GestureDetector,
  GestureHandlerRootView: View,
  usePinchGesture: record("pinch"),
  usePanGesture: record("pan"),
  useTapGesture: record("tap"),
  useSimultaneousGestures: (...gestures: unknown[]) => ({ kind: "simultaneous", gestures }),
  useCompetingGestures: (...gestures: unknown[]) => ({ kind: "competing", gestures }),
};
