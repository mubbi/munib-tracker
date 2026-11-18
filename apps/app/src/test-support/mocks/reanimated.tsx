/**
 * `react-native-reanimated` stand-in that runs worklets eagerly on every render
 * (`useAnimatedStyle(fn)` returns `fn()`, `useDerivedValue(fn)` → `{ value: fn() }`),
 * so animated-style math is exercised by component tests. Otherwise mirrors the
 * global stub in `jest.setup.ts` (plain views, no-op animations, chainable
 * layout-animation builders).
 *
 *   jest.mock("react-native-reanimated", () =>
 *     require("@/test-support/mocks/reanimated").reanimatedWorkletMock);
 */
import { forwardRef } from "react";
import { View } from "react-native";

const chain: unknown = new Proxy(() => chain, {
  get: () => () => chain,
  apply: () => chain,
});

const AnimatedView = forwardRef<View, Record<string, unknown>>((props, ref) => (
  <View {...props} ref={ref} />
));

export const reanimatedWorkletMock = {
  __esModule: true,
  default: {
    View: AnimatedView,
    createAnimatedComponent: (Component: unknown) => Component,
    addWhitelistedNativeProps: jest.fn(),
  },
  useSharedValue: (initial: unknown) => ({ value: initial }),
  useAnimatedStyle: (worklet: () => unknown) => worklet(),
  useDerivedValue: (worklet: () => unknown) => ({ value: worklet() }),
  useAnimatedReaction: () => {},
  useAnimatedKeyboard: () => ({ height: { value: 0 } }),
  useReducedMotion: () => false,
  withSpring: (toValue: unknown) => toValue,
  withTiming: (toValue: unknown) => toValue,
  withRepeat: (animation: unknown) => animation,
  withDelay: (_delay: unknown, animation: unknown) => animation,
  withSequence: (...animations: unknown[]) => animations[animations.length - 1],
  cancelAnimation: () => {},
  interpolate: () => 0,
  interpolateColor: () => "#000000",
  Easing: new Proxy({}, { get: () => () => 0 }),
  FadeIn: chain,
  FadeInDown: chain,
  FadeOut: chain,
  Keyframe: class {
    duration() {
      return this;
    }
  },
};
