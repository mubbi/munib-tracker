import type { ReactNode } from "react";

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
      addWhitelistedNativeProps: jest.fn(),
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
    FadeOut: chain,
  };
});

jest.mock("@/components/ui/stagger", () => {
  const React = require("react");
  return {
    Stagger: ({ children }: { children?: React.ReactNode }) => children,
  };
});

jest.mock("reanimated-color-picker", () => {
  const React = require("react");
  const { View } = require("react-native");

  const ColorPicker = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, { testID: "color-picker-mock" }, children);

  const SubComponent = () => React.createElement(View, null);

  return {
    __esModule: true,
    default: ColorPicker,
    HueSlider: SubComponent,
    Panel1: SubComponent,
    Preview: SubComponent,
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

// Navigation and safe-area are ambient concerns for every screen under test:
// stub the router with no-op navigation and collapse insets to zero so component
// tests render without a real navigator or device frame.
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: () => false,
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Initialise i18n (English) so `t()` returns real strings in component tests.
require("./src/i18n");
