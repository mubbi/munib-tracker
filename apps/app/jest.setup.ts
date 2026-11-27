import type { ReactNode } from "react";

process.env.RNTL_SKIP_DEPS_CHECK = "1";

// No test reaches a real network: `fetch` defaults to a rejecting `jest.fn`
// (which also replaces Expo's lazy `fetch` getter — touching it after a suite
// tears down throws), WebSocket/XHR throw, Node sockets refuse non-loopback
// hosts, and any attempt fails the test that made it. Mock the boundary with
// `mockFetch` / `mockFetchByUrl` (`@/test-support/fetch`) or a module mock.
// See `src/test-support/no-network.ts`.
(
  require("./src/test-support/no-network") as typeof import("./src/test-support/no-network")
).installNoNetworkGuard();

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
  };
});

// The worklets runtime is native-only. `scheduleOnRN` (the replacement for
// Reanimated's deprecated `runOnJS`) just calls straight through under Jest.
jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
  scheduleOnUI: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
}));

// Gesture Handler's native module (installUIRuntimeBindings) isn't available
// under Jest. Shared UI primitives (ui/sortable → settings lists, Explore grid)
// import it, so stub it globally with the shared hook mock; suites that drive
// gestures still `jest.mock` it themselves.
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);

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

jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {
    isRecognitionAvailable: jest.fn(() => false),
    supportsOnDeviceRecognition: jest.fn(() => false),
    requestPermissionsAsync: jest.fn(async () => ({
      granted: false,
      canAskAgain: true,
      status: "denied",
    })),
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  useSpeechRecognitionEvent: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

// AsyncStorage 3's official in-memory mock exposes plain methods. Wrap them in
// jest.fn (still backed by the mock's storage) so tests can stub failures with
// `mockRejectedValueOnce` and assert calls.
jest.mock("@react-native-async-storage/async-storage", () => {
  const actual = require("@react-native-async-storage/async-storage/jest");
  const storage = actual.default as Record<string, unknown>;
  for (const method of [
    "getItem",
    "setItem",
    "removeItem",
    "getMany",
    "setMany",
    "removeMany",
    "getAllKeys",
    "clear",
  ]) {
    const impl = storage[method] as (...args: unknown[]) => unknown;
    storage[method] = jest.fn((...args: unknown[]) => impl.apply(storage, args));
  }
  return { ...actual, __esModule: true, default: storage };
});

// Default: an empty on-device file store for the class-based `expo-file-system`
// API (`File` / `Directory` / `Paths`, wrapped by `src/lib/native-file-store.ts`).
// Nothing exists, writes/downloads are accepted but not persisted, and listings
// are empty. Tests that exercise a store (audio-cache.test.ts) or a specific call
// (read-uri-bytes.test.ts) provide their own mock, which overrides this one.
jest.mock("expo-file-system", () => {
  const withSlash = (uri: string) => (uri.endsWith("/") ? uri : `${uri}/`);
  const joinUris = (parts: unknown[]) =>
    parts
      .map((p) => (typeof p === "string" ? p : (p as { uri: string }).uri))
      .reduce((acc, part) => (acc ? `${withSlash(acc)}${part.replace(/^\/+/, "")}` : part), "");
  const lastSegment = (uri: string) => uri.replace(/\/+$/, "").split("/").pop() ?? "";

  class MockFile {
    readonly uri: string;
    constructor(...uris: unknown[]) {
      this.uri = joinUris(uris);
    }
    get name() {
      return lastSegment(this.uri);
    }
    exists = false;
    size: number | null = null;
    md5: string | null = null;
    type = "";
    info = jest.fn(() => ({ exists: false, uri: this.uri }));
    digest = jest.fn(async () => "");
    text = jest.fn(async () => "");
    base64 = jest.fn(async () => "");
    bytes = jest.fn(async () => new Uint8Array());
    write = jest.fn(async () => undefined);
    writeSync = jest.fn();
    create = jest.fn();
    delete = jest.fn();
    copy = jest.fn(async () => undefined);
    copySync = jest.fn();
    move = jest.fn(async () => undefined);
    moveSync = jest.fn();
    static downloadFileAsync = jest.fn(
      async (_url: string, destination: MockFile | MockDirectory) => destination,
    );
    static createDownloadTask = jest.fn(
      (_url: string, destination: MockFile | MockDirectory, _options?: unknown) => ({
        downloadAsync: jest.fn(async () => destination),
        cancel: jest.fn(),
        release: jest.fn(),
      }),
    );
  }

  class MockDirectory {
    readonly uri: string;
    constructor(...uris: unknown[]) {
      this.uri = withSlash(joinUris(uris));
    }
    get name() {
      return lastSegment(this.uri);
    }
    exists = false;
    size: number | null = null;
    info = jest.fn(() => ({ exists: false, uri: this.uri }));
    create = jest.fn();
    delete = jest.fn();
    list = jest.fn(() => [] as (MockFile | MockDirectory)[]);
  }

  return {
    __esModule: true,
    File: MockFile,
    Directory: MockDirectory,
    Paths: {
      get document() {
        return new MockDirectory("file:///document/");
      },
      get cache() {
        return new MockDirectory("file:///cache/");
      },
      totalDiskSpace: 64 * 1024 * 1024 * 1024,
      availableDiskSpace: 10 * 1024 * 1024 * 1024,
      info: jest.fn(() => ({ exists: false, isDirectory: null })),
    },
  };
});

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
    navigate: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    dismiss: jest.fn(),
    dismissTo: jest.fn(),
    setParams: jest.fn(),
    canGoBack: () => false,
    canDismiss: () => false,
  }),
  useCanGoBack: () => false,
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useNavigationContainerRef: () => ({ addListener: () => () => {}, isReady: () => true }),
  usePathname: () => "/",
  useSegments: () => ["(tabs)"],
  Redirect: () => null,
}));

// `<Seo>` renders `expo-router/head`, which needs a document head context absent in
// Jest (it is web-only anyway: `<Seo>` returns null on native).
jest.mock("expo-router/head", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/providers/auth-provider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    session: null,
    user: null,
    isReady: true,
    isGuest: true,
    isAuthenticated: false,
    isSyncing: false,
    signInAsGuest: jest.fn(),
    signInWithProvider: jest.fn(),
    linkProvider: jest.fn(),
    signOut: jest.fn(),
    syncNow: jest.fn(async () => "skipped"),
    deleteAccount: jest.fn(async () => "ok"),
    resetAppData: jest.fn(async () => "ok"),
  }),
}));

jest.mock("@/features/reviews/context/ReviewPromptContext", () => ({
  ReviewPromptProvider: ({ children }: { children: ReactNode }) => children,
  useReviewPrompt: () => ({
    canWriteReview: false,
    openWriteReview: jest.fn(async () => undefined),
    openFeedback: jest.fn(),
  }),
}));

jest.mock("@/features/reviews/hooks/useReviewPromptBlocked", () => ({
  useReviewPromptBlocked: () => false,
}));

jest.mock("@sentry/react-native", () => {
  const noop = jest.fn();
  return {
    __esModule: true,
    init: noop,
    captureException: noop,
    expoRouterIntegration: jest.fn(() => ({})),
    GlobalErrorBoundary: ({ children }: { children?: ReactNode }) => children ?? null,
  };
});

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(async () => "notification-id"),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
}));

// Must be mocked before any suite pulls `@/db` → `location.ts` (e.g. sync-engine).
jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: null,
      accuracy: 10,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  })),
  getLastKnownPositionAsync: jest.fn(async () => null),
  // One empty OS-geocoder hit: `lib/location` stops there instead of falling
  // through to the BigDataCloud HTTP geocoder (the silent GPS refresh runs in
  // every suite that loads the location store). Same {} place, no network.
  reverseGeocodeAsync: jest.fn(async () => [{ city: null, country: null }]),
  Accuracy: { Lowest: 1, Low: 2, Balanced: 3, High: 4, Highest: 5, BestForNavigation: 6 },
}));

// Initialise i18n (English) so `t()` returns real strings in component tests.
require("./src/i18n");
// The preferences store (and its `@/db` / haptics graph) is part of the
// documented preload contract (test-support/README "Gotchas"): suites that
// partially mock `@/db` or `@/lib/haptics` rely on it binding the real ones.
require("./src/stores/preferences-store");

// Warm async content caches via sync `require` loaders — lazily. Jest cannot use
// production `import()` without --experimental-vm-modules, so these modules get
// their corpora injected through `__set*ForTests`. Each one is wrapped in a mock
// factory that returns the *real* module, warmed, the first time a suite
// requires it: suites that never touch search/zikr/hadith content skip the
// ~0.5 s corpus + guide graph load, and `jest.resetModules()` re-warms instead of
// starting cold. A suite's own `jest.mock()` of one of these modules still
// replaces the factory. Caveat: inside `jest.isolateModules` Jest reuses the
// outer registry's mocked instance — `jest.requireActual()` the module there for
// a fresh, unwarmed copy (see knowledge-card.test.ts `withPool`).
// Never `require` sync-engine here (it locks `@/db` → `location` before suite
// mocks apply), nor `app/(tabs)/index` (home tests inject below-fold themselves).
function mockWarmedContentModule<T>(path: string, warm: (actual: T) => void): () => T {
  let warming = false;
  return () => {
    // Re-entry through an import cycle gets the (partially initialised) real module.
    if (warming) return jest.requireActual<T>(path);
    warming = true;
    try {
      const actual = jest.requireActual<T>(path);
      warm(actual);
      return actual;
    } finally {
      warming = false;
    }
  };
}

function mockTestCorpora() {
  const corpora =
    require("./src/lib/search-corpora-test-loader") as typeof import("./src/lib/search-corpora-test-loader");
  return {
    duas: corpora.loadDuaItemsSyncForTests(),
    zikr: corpora.loadZikrItemsSyncForTests(),
    duroods: corpora.loadDuroodItemsSyncForTests(),
    names: corpora.loadNamesSyncForTests(),
  };
}

function mockTestQuran() {
  return (
    require("./src/lib/knowledge-card-quran-test-loader") as typeof import("./src/lib/knowledge-card-quran-test-loader")
  ).loadQuranSyncForTests();
}

jest.mock("./src/lib/content-loaders", () =>
  mockWarmedContentModule<typeof import("./src/lib/content-loaders")>(
    "./src/lib/content-loaders",
    (m) => m.__setContentLoaderCachesForTests(mockTestCorpora()),
  )(),
);

jest.mock("./src/lib/zikr", () =>
  mockWarmedContentModule<typeof import("./src/lib/zikr")>("./src/lib/zikr", (m) =>
    m.__setZikrItemsForTests(mockTestCorpora().zikr),
  )(),
);

jest.mock("./src/lib/hadith-bundled", () =>
  mockWarmedContentModule<typeof import("./src/lib/hadith-bundled")>(
    "./src/lib/hadith-bundled",
    (m) => {
      m.__setBundledHadithForTests(
        "nawawi40",
        (
          require("./src/lib/hadith-nawawi-test-loader") as typeof import("./src/lib/hadith-nawawi-test-loader")
        ).loadNawawiSyncForTests(),
      );
      m.__setBundledHadithForTests(
        "riyad_assalihin",
        (
          require("./src/lib/hadith-riyad-test-loader") as typeof import("./src/lib/hadith-riyad-test-loader")
        ).loadRiyadSyncForTests(),
      );
    },
  )(),
);

jest.mock("./src/lib/knowledge-card", () =>
  mockWarmedContentModule<typeof import("./src/lib/knowledge-card")>(
    "./src/lib/knowledge-card",
    (m) => {
      m.__setKnowledgeCardNamesForTests(mockTestCorpora().names);
      m.__setKnowledgeCardQuranForTests(mockTestQuran());
    },
  )(),
);

jest.mock("./src/lib/search", () =>
  mockWarmedContentModule<typeof import("./src/lib/search")>("./src/lib/search", (m) => {
    const { duas, zikr, duroods, names } = mockTestCorpora();
    m.__setSearchCorporaForTests({ duas, zikr, duroods, names });
    m.__setQuranModuleForTests(mockTestQuran());
    m.__setSearchGuideGroupsForTests(
      (require("./src/lib/search-guides") as typeof import("./src/lib/search-guides"))
        .searchGuideGroups,
    );
  })(),
);

jest.mock("./src/lib/run-search-light-with-guides", () =>
  mockWarmedContentModule<typeof import("./src/lib/run-search-light-with-guides")>(
    "./src/lib/run-search-light-with-guides",
    (m) =>
      m.__setLightSearchWithGuidesForTests(
        (require("./src/lib/search-with-guides") as typeof import("./src/lib/search-with-guides"))
          .searchLightWithGuides,
      ),
  )(),
);

// Foldable hinge (iPhone Duo / Android foldables) is native-only: no hinge in tests.
jest.mock("expo-hinge", () => ({
  isAvailable: () => false,
  getHinge: () => null,
  useHinge: () => null,
  addHingeListener: () => ({ remove: () => {} }),
}));

// `expo-audio` touches native classes at import time and throws under Jest; most
// suites only reach it transitively (audio-player-provider → Learn primitives).
// Suites that drive playback still `jest.mock("expo-audio", …)` their own fake.
jest.mock("expo-audio", () => require("./src/test-support/mocks/expo-audio").expoAudioMock);
