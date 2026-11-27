import { act, screen } from "@testing-library/react-native";

import { type PrayerTime, PrayerTimesHero, prayerRowIndices } from "@/components/prayer-times-hero";
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

type Node = { props: { style?: unknown; onLayout?: unknown }; parent: Node | null };

const ancestor = (node: Node, match: (n: Node) => boolean) => {
  let current: Node | null = node;
  while (current && !match(current)) current = current.parent;
  return current;
};

/** The measured strip container (its rows sit inside). */
const strip = () =>
  ancestor(
    screen.getByText("Fajr") as unknown as Node,
    (n) => typeof n.props.onLayout === "function",
  ) as Node & { props: { onLayout: (e: unknown) => void } };

const rowOf = (name: string) =>
  ancestor(screen.getByText(name) as unknown as Node, (n) => {
    const style = n.props.style ? flattenStyle(n.props.style as never) : {};
    return style.flexDirection === "row" && style.justifyContent === "space-between";
  });

const layoutStrip = (width: number) =>
  act(() => strip().props.onLayout({ nativeEvent: { layout: { width, height: 80 } } }));

const renderHero = (variant: "banner" | "card") =>
  renderWithTheme(
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
      variant={variant}
    />,
  );

/** Wrapped = Fajr (first row) and Maghrib (second row) sit in different rows. */
const wrapped = () => rowOf("Fajr") !== rowOf("Maghrib");

describe("PrayerTimesHero strip width (no mid-word breaks)", () => {
  it("keeps the phone banner on one row when every slot fits", async () => {
    await renderHero("banner");
    await layoutStrip(370); // iPhone: ~62dp per slot
    expect(wrapped()).toBe(false);
  });

  it("wraps the banner when slots are far too narrow", async () => {
    await renderHero("banner");
    await layoutStrip(300); // 50dp per slot
    expect(wrapped()).toBe(true);
  });

  it("wraps the dashboard card at widths that break names and times (iPad home column)", async () => {
    await renderHero("card");
    await layoutStrip(340); // ~57dp per slot: "Maghri / b", "17:3 / 7"
    expect(wrapped()).toBe(true);
    // Cells must not shrink back onto one row (flex: 1 implies flexShrink 1).
  });

  it("keeps a roomy dashboard card on one row", async () => {
    await renderHero("card");
    await layoutStrip(480); // 80dp per slot
    expect(wrapped()).toBe(false);
  });
});

describe("prayerRowIndices", () => {
  it("keeps every cell in one row unless wrapping", () => {
    expect(prayerRowIndices(6, false)).toEqual([[0, 1, 2, 3, 4, 5]]);
    expect(prayerRowIndices(0, false)).toEqual([]);
  });

  it("groups cells three per row when wrapping", () => {
    expect(prayerRowIndices(6, true)).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ]);
    expect(prayerRowIndices(5, true)).toEqual([
      [0, 1, 2],
      [3, 4],
    ]);
  });
});
