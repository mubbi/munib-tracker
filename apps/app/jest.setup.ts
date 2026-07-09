import type { ReactNode } from "react";

process.env.RNTL_SKIP_DEPS_CHECK = "1";

// Expo installs `fetch` as a lazy global getter backed by its "winter" runtime.
// Once Jest tears down a suite's module registry, touching that getter throws
// ("Cannot read properties of undefined (reading 'get')" from
// ExpoModulesCoreJSLogger). Background store work started during a test
// (weather sync, location refresh) can outlive the test and trip it, surfacing
// as "Cannot log after tests are done" and flipping the run's exit code even
// though every test passed. Install a benign default so that never happens;
// tests that assert on the network still override `global.fetch` themselves.
Object.defineProperty(globalThis, "fetch", {
  configurable: true,
  writable: true,
  value: jest.fn(async () => ({
    ok: false,
    status: 503,
    json: async () => ({}),
    text: async () => "",
  })),
});

// `runWhenIdle` polyfills `requestIdleCallback` with `setTimeout`, which defers
// work off the current tick. In tests that lets deferred state updates (e.g. the
// Qur'an ayah search in the search screen) fire after the test has finished,
// producing "not wrapped in act(...)" warnings and leaking timers past teardown.
// Run idle tasks synchronously so they settle within the test's act() scope.
jest.mock("@/lib/run-when-idle", () => ({
  runWhenIdle: (task: () => void) => {
    task();
    return { cancel: () => {} };
  },
}));

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

// Default: an empty on-device audio store. Tests that exercise the store
// (audio-cache.test.ts) provide their own functional mock, which overrides this.
jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///document/",
  cacheDirectory: "file:///cache/",
  downloadAsync: jest.fn(async (_remote: string, local: string) => ({ uri: local })),
  getInfoAsync: jest.fn(async (uri: string) => ({ exists: false, uri })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readDirectoryAsync: jest.fn(async () => [] as string[]),
  deleteAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-system-ui", () => ({
  setBackgroundColorAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en", languageTag: "en-US" }],
}));

jest.mock("expo", () => {
  const actual = jest.requireActual("expo") as Record<string, unknown>;
  return {
    ...actual,
    reloadAppAsync: jest.fn(async () => undefined),
  };
});

// Navigation and safe-area are ambient concerns for every screen under test:
// stub the router with no-op navigation and collapse insets to zero so component
// tests render without a real navigator or device frame.
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: () => false,
    canDismiss: () => false,
  }),
  useFocusEffect: jest.fn(),
  usePathname: () => "/",
  useSegments: () => ["(tabs)"],
}));

// `<Seo>` uses the vendored Helmet, which needs a document head context absent in Jest.
jest.mock("expo-router/vendor/react-helmet-async/lib", () => ({
  Helmet: ({ children }: { children?: ReactNode }) => children ?? null,
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Initialise i18n (English) so `t()` returns real strings in component tests.
require("./src/i18n");
