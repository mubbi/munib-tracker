import { act, render, screen } from "@testing-library/react-native";
import { AppState, Platform } from "react-native";

import {
  HeroWeatherEffects,
  IOS_WEATHER_EFFECTS_SETTLE_MS,
  weatherEffectsMountDelayMs,
} from "@/components/weather/hero-weather-effects";

describe("weatherEffectsMountDelayMs", () => {
  it("waits out iOS 26 NativeTabs / stack springs before mounting particles", () => {
    expect(weatherEffectsMountDelayMs("ios")).toBe(IOS_WEATHER_EFFECTS_SETTLE_MS);
    expect(weatherEffectsMountDelayMs("android")).toBe(0);
    expect(weatherEffectsMountDelayMs("web")).toBe(0);
  });

  it("defaults to the current Platform.OS", () => {
    const originalOS = Platform.OS;
    Platform.OS = "ios";
    expect(weatherEffectsMountDelayMs()).toBe(IOS_WEATHER_EFFECTS_SETTLE_MS);
    Platform.OS = originalOS;
  });
});

describe("HeroWeatherEffects", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(AppState, "currentState", {
      configurable: true,
      value: "active",
    });
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(() => cb(Date.now()), 0) as unknown as number;
    });
    jest.spyOn(global, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    Platform.OS = originalOS;
  });

  it("does not mount particle trees while the home screen is covered", () => {
    Platform.OS = "android";
    render(<HeroWeatherEffects effects={["clear"]} enabled={false} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();
  });

  it("defers iOS mount until after the navigation spring settle window", () => {
    Platform.OS = "ios";
    render(<HeroWeatherEffects effects={["clear"]} />);

    act(() => {
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(IOS_WEATHER_EFFECTS_SETTLE_MS - 1);
    });
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("hero-weather-effects")).toBeTruthy();
  });

  it("unmounts when home loses focus so a stack pop does not relayout rain", () => {
    Platform.OS = "android";
    const { rerender } = render(<HeroWeatherEffects effects={["clear"]} enabled />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId("hero-weather-effects")).toBeTruthy();

    rerender(<HeroWeatherEffects effects={["clear"]} enabled={false} />);
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();
  });

  it("does not mount when there are no weather effects", () => {
    Platform.OS = "android";
    render(<HeroWeatherEffects effects={[]} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();
  });

  it("unmounts particles when the app leaves the foreground", () => {
    Platform.OS = "android";
    let onChange: ((status: string) => void) | undefined;
    jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
      onChange = handler as (status: string) => void;
      return { remove: jest.fn() };
    });

    render(<HeroWeatherEffects effects={["clear"]} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId("hero-weather-effects")).toBeTruthy();

    act(() => {
      onChange?.("background");
    });
    expect(screen.queryByTestId("hero-weather-effects")).toBeNull();
  });
});
