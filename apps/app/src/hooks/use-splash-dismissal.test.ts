import { act, renderHook } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";

import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { setPlatform } from "@/test-support/platform";

import { useSplashDismissal } from "./use-splash-dismissal";

/** Animations complete immediately (or are interrupted when `mockFadeFinishes` is false). */
jest.mock("react-native-reanimated", () => ({
  Easing: { out: (fn: unknown) => fn, cubic: () => 0 },
  useSharedValue: (initial: unknown) => require("react").useRef({ value: initial }).current,
  withTiming: (toValue: number, _config: unknown, callback?: (finished: boolean) => void) => {
    callback?.(mockFade.finishes);
    return toValue;
  },
}));
jest.mock("@/lib/boot/cold-start", () => ({ useColdStartReady: () => mockReady.painted }));
jest.mock("@/lib/seo/is-indexing-bot", () => ({ isIndexingBot: jest.fn(() => false) }));
jest.mock("@/stores/preferences-store", () => ({ usePreferencesReady: () => mockReady.prefs }));

const mockFade = { finishes: true };
const mockReady = { prefs: false, painted: false };

let restorePlatform: () => void = () => {};

async function setup() {
  return renderHook(() => useSplashDismissal());
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockFade.finishes = true;
  mockReady.prefs = false;
  mockReady.painted = false;
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("useSplashDismissal", () => {
  it("hides the native splash and holds the overlay until ready", async () => {
    const { result } = await setup();
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
    expect(result.current.dismissed).toBe(false);
    expect(result.current.opacity.value).toBe(1);
  });

  it("fades out once preferences are hydrated and the first screen painted", async () => {
    const { result, rerender } = await setup();
    mockReady.prefs = true;
    await rerender({});
    expect(result.current.dismissed).toBe(false);
    mockReady.painted = true;
    await rerender({});
    expect(result.current.opacity.value).toBe(0);
    expect(result.current.dismissed).toBe(true);
  });

  it("stays visible when the fade is interrupted", async () => {
    mockFade.finishes = false;
    mockReady.prefs = true;
    mockReady.painted = true;
    const { result } = await setup();
    expect(result.current.opacity.value).toBe(0);
    expect(result.current.dismissed).toBe(false);
  });

  it.each([
    ["phone", false, 5000],
    ["TV", true, 3500],
  ])("fades out after the %s failsafe", async (_label, isTV, ms) => {
    restorePlatform = setPlatform({ isTV });
    const { result } = await setup();
    await act(async () => {
      jest.advanceTimersByTime(ms - 1);
    });
    expect(result.current.dismissed).toBe(false);
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.dismissed).toBe(true);
  });

  it("fades only once when readiness arrives after the failsafe", async () => {
    const { result, rerender } = await setup();
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    mockReady.prefs = true;
    mockReady.painted = true;
    await rerender({});
    expect(result.current.dismissed).toBe(true);
  });

  it("skips the overlay for indexing bots on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    (isIndexingBot as jest.Mock).mockReturnValue(true);
    const { result } = await setup();
    expect(result.current.dismissed).toBe(true);
    expect(result.current.opacity.value).toBe(0);
  });
});
