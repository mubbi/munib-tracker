import { act, fireEvent, screen } from "@testing-library/react-native";
import { I18nManager } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { MoonPhaseSheet } from "@/components/moon-phase-sheet";
import { type PrayerTime, PrayerTimesHero } from "@/components/prayer-times-hero";
import { skyPalette } from "@/lib/sky";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Jest cannot run `import()` without VM modules: resolve the lazy moon sheet synchronously.
jest.mock("react", () => {
  const React = jest.requireActual("react");
  return {
    ...React,
    lazy: () => (props: object) =>
      React.createElement(require("@/components/moon-phase-sheet").MoonPhaseSheet, props),
  };
});
jest.mock("@/components/moon-phase-sheet", () => ({ MoonPhaseSheet: jest.fn(() => null) }));
jest.mock("@/components/weather/hero-weather-effects", () => ({ HeroWeatherEffects: () => null }));
jest.mock("@/components/ui/glass-surface", () => ({
  ...require("@/test-support/mocks/glass-surface").glassSurfaceMock,
  GlassControl: ({ children }: { children: unknown }) => children,
}));

const PRAYERS: PrayerTime[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name, index) => ({
  name,
  time: `${String(5 + index * 3).padStart(2, "0")}:00`,
  icon: "sun.max",
}));

type Props = Parameters<typeof PrayerTimesHero>[0];

const renderHero = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <PrayerTimesHero
      location="London"
      displayDates={{ primary: "Monday 6 July", secondary: "21 Muharram 1448" }}
      currentTime="14:05"
      countdown="Asr is 2 hr away"
      prayers={PRAYERS}
      activeIndex={1}
      topInset={20}
      sky={skyPalette("noon")}
      now={new Date(2026, 6, 6, 14, 5)}
      moonLabel="Waxing gibbous"
      celestial={{ body: "sun", x: 30, y: 30 }}
      dayProgress={0.5}
      {...props}
    />,
  );

/** The sun / moon disc (the day-timeline "now" dot also glows, but has no vertical offset). */
const celestialDiscs = () =>
  screen.container.queryAll((node) => {
    const style = flattenStyle(node.props.style);
    return typeof style.boxShadow === "string" && style.marginTop !== undefined;
  });

afterEach(() => {
  setMockLiquidGlass(false);
  jest.restoreAllMocks();
});

describe("PrayerTimesHero", () => {
  it("shows the clock, countdown and each prayer with the active one marked", async () => {
    await renderHero();

    expect(screen.getByLabelText("14:05, Asr is 2 hr away")).toBeTruthy();
    expect(screen.getByLabelText("Dhuhr at 08:00, current prayer")).toBeTruthy();
    expect(screen.getByLabelText("Asr at 11:00")).toBeTruthy();
  });

  it("changes location from the location row", async () => {
    const onLocationPress = jest.fn();
    await renderHero({ onLocationPress });

    await fireEvent.press(screen.getByLabelText("Change location"));

    expect(onLocationPress).toHaveBeenCalled();
  });

  it("includes the weather in the location row", async () => {
    await renderHero({
      weatherSummary: "22° · Sunny",
      weatherAccessibilityLabel: "22 degrees, sunny",
    });

    expect(screen.getByText("22° · Sunny")).toBeTruthy();
    expect(screen.getByLabelText("London, 22 degrees, sunny. Change location")).toBeTruthy();
  });

  it("opens search and notifications with an unread badge", async () => {
    const onSearchPress = jest.fn();
    const onNotificationsPress = jest.fn();
    await renderHero({ onSearchPress, onNotificationsPress, notificationCount: 12 });

    await fireEvent.press(screen.getByLabelText("Search"));
    await fireEvent.press(screen.getByLabelText("Notifications"));

    expect(onSearchPress).toHaveBeenCalled();
    expect(onNotificationsPress).toHaveBeenCalled();
    expect(screen.getByText("9+")).toBeTruthy();
  });

  it("opens and closes the moon phase sheet from the date row", async () => {
    await renderHero();

    await fireEvent.press(screen.getByLabelText(/Monday 6 July\. 21 Muharram 1448/));
    expect(jest.mocked(MoonPhaseSheet).mock.lastCall![0].visible).toBe(true);

    const { onClose } = jest.mocked(MoonPhaseSheet).mock.lastCall![0];
    jest.mocked(MoonPhaseSheet).mockClear();
    await act(async () => onClose());
    expect(MoonPhaseSheet).not.toHaveBeenCalled();
  });

  it("describes a single-calendar date row", async () => {
    await renderHero({ displayDates: { primary: "Monday 6 July", secondary: "" } });

    expect(screen.getByLabelText(/\. Monday 6 July\. Tap for moon details$/)).toBeTruthy();
  });

  it("handles an empty prayer list", async () => {
    await renderHero({ prayers: [] });

    expect(screen.queryByLabelText(/current prayer/)).toBeNull();
  });

  it("hides the sun disc on the phone banner", async () => {
    await renderHero();

    expect(celestialDiscs()).toHaveLength(0);
  });

  it("starts the ambient sky motion", async () => {
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderHero();

    expect(withRepeat).toHaveBeenCalledTimes(2);
  });

  it("keeps the sky still under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderHero();

    expect(withRepeat).not.toHaveBeenCalled();
  });

  it("uses Liquid Glass hero buttons when available", async () => {
    setMockLiquidGlass(true);
    await renderHero({ onSearchPress: jest.fn() });

    expect(screen.getByLabelText("Search")).toBeTruthy();
  });
});

describe("PrayerTimesHero dashboard card", () => {
  it.each([
    ["sun", "noon"],
    ["moon", "night"],
  ] as const)("draws the %s disc in open sky", async (body, phase) => {
    await renderHero({
      variant: "card",
      sky: skyPalette(phase),
      celestial: { body, x: 70, y: 40 },
    });

    expect(celestialDiscs()).toHaveLength(1);
  });

  it("mirrors the disc position under native RTL", async () => {
    jest.replaceProperty(I18nManager, "isRTL", true);
    jest.replaceProperty(I18nManager, "doLeftAndRightSwapInRTL", true);
    await renderHero({ variant: "card", celestial: { body: "sun", x: 20, y: 40 } });

    expect(flattenStyle(celestialDiscs()[0]!.props.style).left).toBe("80%");
  });

  it("hides the disc and stars under heavy cloud", async () => {
    await renderHero({
      variant: "card",
      sky: skyPalette("night"),
      celestial: { body: "moon", x: 70, y: 40 },
      weatherEffects: ["rain"],
    });

    expect(celestialDiscs()).toHaveLength(0);
  });

  it.each([["thunderstorm"], ["snow"], ["fog"], ["clear"]] as const)(
    "accepts %s weather",
    async (effect) => {
      await renderHero({ variant: "card", weatherEffects: [effect], weatherEffectsEnabled: false });

      expect(screen.getByLabelText("14:05, Asr is 2 hr away")).toBeTruthy();
    },
  );

  it("shows only the glow in twilight", async () => {
    await renderHero({ variant: "card", celestial: { body: null, x: 50, y: 80 } });

    expect(celestialDiscs()).toHaveLength(0);
  });
});

describe("PrayerTimesHero on web", () => {
  usePlatform({ OS: "web" });

  it("animates with CSS instead of Reanimated loops", async () => {
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderHero();

    expect(withRepeat).not.toHaveBeenCalled();
  });
});

describe("PrayerTimesHero on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [20, 1],
    [50, 0],
  ])("shows the disc only clear of the date chip (x=%i)", async (x, count) => {
    await renderHero({ celestial: { body: "sun", x, y: 30 } });

    expect(celestialDiscs()).toHaveLength(count);
  });

  it("keeps the sky static", async () => {
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderHero({ onSearchPress: jest.fn(), onNotificationsPress: jest.fn() });

    expect(withRepeat).not.toHaveBeenCalled();
  });
});
