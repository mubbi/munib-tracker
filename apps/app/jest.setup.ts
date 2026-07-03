process.env.RNTL_SKIP_DEPS_CHECK = "1";

// Reanimated 4's bundled mock pulls in the native worklets runtime, which isn't
// available under Jest. This self-contained stub renders animated components as
// plain views, no-ops worklets/animations, and makes layout-animation builders
// (FadeIn.delay().duration()...) chainable, so motion-driven UI unit-tests cleanly.
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");

  // Chainable stand-in for entering/exiting animation builders.
  const chain: unknown = new Proxy(() => chain, {
    get: () => () => chain,
    apply: () => chain,
  });

  const AnimatedView = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(View, { ...props, ref }),
  );

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => false,
    withSpring: (toValue: unknown) => toValue,
    withTiming: (toValue: unknown) => toValue,
    withRepeat: (animation: unknown) => animation,
    withDelay: (_delay: unknown, animation: unknown) => animation,
    withSequence: (...animations: unknown[]) => animations[animations.length - 1],
    cancelAnimation: () => {},
    interpolate: () => 0,
    interpolateColor: () => "#000000",
    runOnJS: (fn: unknown) => fn,
    Easing: new Proxy({}, { get: () => () => 0 }),
    FadeIn: chain,
    FadeInDown: chain,
  };
});

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-system-ui", () => ({
  setBackgroundColorAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));

// Initialise i18n (English) so `t()` returns real strings in component tests.
require("./src/i18n");
