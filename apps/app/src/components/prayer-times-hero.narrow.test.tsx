import { act, screen } from "@testing-library/react-native";

import { type PrayerTime, PrayerTimesHero } from "@/components/prayer-times-hero";
import { skyPalette } from "@/lib/sky";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// fontScale 1 (RN's jest default is 2, which always takes the large-text wrap path).
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("react", () => {
  const React = jest.requireActual("react");
  return { ...React, lazy: () => () => null };
});
jest.mock("@/components/moon-phase-sheet", () => ({ MoonPhaseSheet: () => null }));
jest.mock("@/components/weather/hero-weather-effects", () => ({ HeroWeatherEffects: () => null }));
jest.mock("@/components/ui/glass-surface", () => ({
  ...require("@/test-support/mocks/glass-surface").glassSurfaceMock,
  GlassControl: ({ children }: { children: unknown }) => children,
}));

const PRAYERS: PrayerTime[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
  (name, index) => ({
    name,
    time: `${String(5 + index * 3).padStart(2, "0")}:00`,
    icon: "sun.max",
  }),
);

/** The strip row: the only `space-between` row that measures itself. */
const strip = () =>
  screen.container.queryAll(
    (node) =>
      typeof node.props.onLayout === "function" &&
      node.props.style != null &&
      flattenStyle(node.props.style).justifyContent === "space-between",
  )[0];

const layoutStrip = (width: number) =>
  act(() => strip().props.onLayout({ nativeEvent: { layout: { width, height: 80 } } }));

describe("PrayerTimesHero strip width (no mid-word breaks)", () => {
  beforeEach(async () => {
    await renderWithTheme(
      <PrayerTimesHero
        location="Makkah"
        displayDates={{ primary: "Thursday 26 November", secondary: "16 Jumada al-Akhira 1448" }}
        currentTime="09:41"
        countdown="Dhuhr is 2 hr away"
        prayers={PRAYERS}
        activeIndex={1}
        topInset={20}
        sky={skyPalette("noon")}
        now={new Date(2026, 10, 26, 9, 41)}
        moonLabel="Waxing gibbous"
        celestial={{ body: "sun", x: 30, y: 30 }}
        dayProgress={0.4}
      />,
    );
  });

  it("keeps one row when every slot fits a full-size name", async () => {
    await layoutStrip(390); // phone: 65dp per slot
    expect(flattenStyle(strip().props.style).flexWrap).toBeUndefined();
  });

  it("wraps when slots are too narrow (iPad home column)", async () => {
    await layoutStrip(300); // 50dp per slot: "Maghrib" would split mid-word
    expect(flattenStyle(strip().props.style).flexWrap).toBe("wrap");
  });
});
