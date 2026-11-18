import type { WeatherEffectKind } from "@munib-tracker/shared/types";
import { act, render, screen } from "@testing-library/react-native";
import { AppState } from "react-native";

import {
  ANDROID_WEATHER_EFFECTS_SETTLE_MS,
  HeroWeatherEffects,
  IOS_WEATHER_EFFECTS_SETTLE_MS,
  weatherEffectsMountDelayMs,
} from "@/components/weather/hero-weather-effects";
import { setPlatform, usePlatform } from "@/test-support/platform";

let mockReducedMotion = false;

jest.mock("react-native-reanimated", () => ({
  ...require("@/test-support/mocks/reanimated").reanimatedWorkletMock,
  useReducedMotion: () => mockReducedMotion,
}));

const ROOT = "hero-weather-effects";

async function renderEffects(effects: WeatherEffectKind[], enabled = true) {
  return render(<HeroWeatherEffects effects={effects} enabled={enabled} />);
}

async function runTimers(ms?: number) {
  await act(() => {
    if (ms == null) jest.runAllTimers();
    else jest.advanceTimersByTime(ms);
  });
}

describe("weatherEffectsMountDelayMs", () => {
  it.each([
    ["ios", IOS_WEATHER_EFFECTS_SETTLE_MS],
    ["android", ANDROID_WEATHER_EFFECTS_SETTLE_MS],
    ["web", 0],
  ] as const)("waits %s-specific settle time", (os, delay) => {
    expect(weatherEffectsMountDelayMs(os)).toBe(delay);
  });

  it("defaults to the current Platform.OS", () => {
    const restore = setPlatform({ OS: "android" });
    expect(weatherEffectsMountDelayMs()).toBe(ANDROID_WEATHER_EFFECTS_SETTLE_MS);
    restore();
  });
});

describe("HeroWeatherEffects", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReducedMotion = false;
    Object.defineProperty(AppState, "currentState", { configurable: true, value: "active" });
    jest
      .spyOn(global, "requestAnimationFrame")
      .mockImplementation((cb) => setTimeout(() => cb(Date.now()), 0) as unknown as number);
    jest.spyOn(global, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("on iOS", () => {
    usePlatform({ OS: "ios" });

    it("defers mount until the navigation spring settles", async () => {
      await renderEffects(["clear"]);
      await act(() => {
        jest.runOnlyPendingTimers();
        jest.runOnlyPendingTimers();
      });
      await runTimers(IOS_WEATHER_EFFECTS_SETTLE_MS - 1);
      expect(screen.queryByTestId(ROOT)).toBeNull();
      await runTimers(1);
      expect(screen.getByTestId(ROOT)).toBeTruthy();
    });
  });

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    it("does not mount while the home screen is covered", async () => {
      await renderEffects(["clear"], false);
      await runTimers();
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });

    it("unmounts when home loses focus", async () => {
      const { rerender } = await renderEffects(["clear"]);
      await runTimers();
      expect(screen.getByTestId(ROOT)).toBeTruthy();
      await rerender(<HeroWeatherEffects effects={["clear"]} enabled={false} />);
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });

    it("does not mount without effects", async () => {
      await renderEffects([]);
      await runTimers();
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });

    it("unmounts particles when the app leaves the foreground", async () => {
      let onChange: ((status: string) => void) | undefined;
      jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
        onChange = handler as (status: string) => void;
        return { remove: jest.fn() };
      });
      await renderEffects(["clear"]);
      await runTimers();
      await act(() => onChange?.("background"));
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });

    it("renders large clouds as medium for overcast skies", async () => {
      await renderEffects(["cloudy"]);
      await runTimers();
      expect(screen.getByTestId(ROOT)).toBeTruthy();
    });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it.each<WeatherEffectKind[]>([
      ["clear"],
      ["partly_cloudy"],
      ["cloudy"],
      ["rain"],
      ["snow"],
      ["fog"],
      ["windy"],
      ["thunderstorm"],
      ["cloudy", "rain", "windy"],
    ])("mounts the %s layers immediately after two frames", async (...effects) => {
      await renderEffects(effects);
      await runTimers();
      expect(screen.getByTestId(ROOT)).toBeTruthy();
    });

    it("stays empty with reduced motion", async () => {
      mockReducedMotion = true;
      await renderEffects(["rain"]);
      await runTimers();
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });

    it("cancels a pending mount on unmount", async () => {
      const utils = await renderEffects(["rain"]);
      await utils.unmount();
      await runTimers();
      expect(screen.queryByTestId(ROOT)).toBeNull();
    });
  });
});
