import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ViewStyle } from "react-native";

import {
  TABLET_RAIL_METRICS,
  TabletRail,
  TV_RAIL_METRICS,
  WideAppTabs,
} from "@/components/app-tabs-wide";
import { Control, IconSize } from "@/constants/theme";
import {
  isTvBackAtSystemRoot,
  isTvRailExpanded,
  tryExpandTvRailOnBack,
} from "@/lib/tv/tv-rail-back";
import { pressableProps } from "@/test-support/fiber";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import {
  mockTabNavigate,
  resetExpoRouterUiMock,
  setMockActiveTab,
} from "@/test-support/mocks/expo-router-ui";
import { loadOnPlatform, usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router/ui", () => require("@/test-support/mocks/expo-router-ui").expoRouterUiMock);
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const LABELS = ["Home", "Tracker", "Library", "Settings"];

const renderTabs = () => renderWithTheme(<WideAppTabs />);
const tab = (label: string) => screen.getByRole("tab", { name: label });
const tabStyle = (label: string, state: { pressed?: boolean; focused?: boolean }) =>
  flattenStyle(
    pressableProps<{ style: (s: object) => ViewStyle[] }>(tab(label)).style({
      pressed: false,
      ...state,
    }),
  );

/** `router.dismissTo` is not in the shared mock; the tablet rail pops back to the tabs with it. */
const mockDismissTo = jest.fn();
Object.assign(mockRouter, { dismissTo: mockDismissTo });

beforeEach(() => {
  resetExpoRouterUiMock();
  resetExpoRouterMock();
  mockDismissTo.mockClear();
});

describe("WideAppTabs on native tablets", () => {
  it("keeps the tab triggers mounted but hidden (the rail lives beside the root stack)", async () => {
    await renderTabs();

    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByLabelText("Library", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId("tab-slot")).toBeTruthy();
  });

  it("registers a trigger for every tab route", async () => {
    await renderTabs();

    await fireEvent.press(screen.getByLabelText("Tracker", { includeHiddenElements: true }));

    expect(mockTabNavigate).toHaveBeenCalledWith("/tracker");
  });

  it("registers no TV back handler", async () => {
    await renderTabs();

    expect(tryExpandTvRailOnBack()).toBe(false);
  });
});

describe("TabletRail", () => {
  const renderRail = (expanded: boolean, width = expanded ? 232 : 96) =>
    renderWithTheme(<TabletRail width={width} expanded={expanded} />);
  const railTab = (label: string) => screen.getByRole("tab", { name: label });

  it("lists the four destinations with visible labels", async () => {
    await renderRail(true);

    expect(LABELS.map((label) => screen.getByText(label))).toHaveLength(4);
    expect(screen.queryByRole("tab", { name: "Search" })).toBeNull();
  });

  it("keeps labels under the icons in the compact rail", async () => {
    await renderRail(false);

    expect(LABELS.map((label) => screen.getByText(label))).toHaveLength(4);
    expect(flattenStyle(screen.getByTestId("tablet-rail").props.style).width).toBe(96);
  });

  it("highlights the section of a pushed route", async () => {
    setMockPathname("/quran/1");
    await renderRail(true);

    expect(railTab("Library").props.accessibilityState).toEqual({ selected: true });
    expect(railTab("Home").props.accessibilityState).toEqual({ selected: false });
  });

  it("pops back to the tabs screen instead of stacking a duplicate", async () => {
    setMockPathname("/settings/fonts");
    await renderRail(true);

    await fireEvent.press(railTab("Tracker"));

    expect(mockDismissTo).toHaveBeenCalledWith("/tracker");
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("pads the start edge for a landscape side inset", async () => {
    await renderWithTheme(<TabletRail width={96 + 24} expanded={false} startInset={24} />);

    const style = flattenStyle(screen.getByTestId("tablet-rail").props.style);
    expect(style.width).toBe(120);
    expect(style.paddingStart).toBeGreaterThan(24);
    expect(style.paddingLeft).toBeUndefined();
  });

  it("uses Material rail sizes above the touch floor", () => {
    expect(TABLET_RAIL_METRICS.compactItemMinHeight).toBeGreaterThanOrEqual(Control.minTouch);
    expect(TABLET_RAIL_METRICS.rowMinHeight).toBe(Control.row);
    expect(TABLET_RAIL_METRICS.icon).toBe(IconSize.xl);
  });
});

describe("WideAppTabs on TV", () => {
  usePlatform({ isTV: true });
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("starts with the rail collapsed to icons", async () => {
    await renderTabs();

    expect(screen.queryByText("Home")).toBeNull();
    expect(isTvRailExpanded()).toBe(false);
  });

  it("expands the rail when a tab gains D-pad focus", async () => {
    await renderTabs();

    await fireEvent(tab("Home"), "focus");

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Munib Tracker", { includeHiddenElements: true })).toBeTruthy();
  });

  it("collapses the rail shortly after focus leaves it", async () => {
    await renderTabs();
    await fireEvent(tab("Home"), "focus");

    await fireEvent(tab("Home"), "blur");
    await act(async () => jest.advanceTimersByTime(200));

    expect(screen.queryByText("Home")).toBeNull();
  });

  it("keeps the rail open while focus moves between tabs", async () => {
    await renderTabs();
    await fireEvent(tab("Home"), "focus");

    await fireEvent(tab("Home"), "blur");
    await fireEvent(tab("Tracker"), "focus");
    await act(async () => jest.advanceTimersByTime(200));

    expect(screen.getByText("Tracker")).toBeTruthy();
  });

  it("opens the rail on Back and focuses the active tab", async () => {
    await renderTabs();

    let handled = false;
    await act(async () => {
      handled = tryExpandTvRailOnBack();
    });

    expect(handled).toBe(true);
    expect(tab("Home").props.hasTVPreferredFocus).toBe(true);
  });

  it("lets Back fall through to the system once the rail is open on Home", async () => {
    await renderTabs();
    await fireEvent(tab("Home"), "focus");

    expect(isTvBackAtSystemRoot()).toBe(true);
    expect(tryExpandTvRailOnBack()).toBe(false);
  });

  it("returns to the Home tab before exiting from another tab", async () => {
    setMockActiveTab("library");
    await renderTabs();
    await fireEvent(tab("Library"), "focus");

    expect(isTvBackAtSystemRoot()).toBe(false);
    let handled = false;
    await act(async () => {
      handled = tryExpandTvRailOnBack();
    });

    expect(handled).toBe(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith("/");
  });

  it("offers Search as the first rail entry", async () => {
    await renderTabs();
    const search = screen.getByRole("button", { name: "Search" });

    await fireEvent.press(search);

    expect(mockRouter.push).toHaveBeenCalledWith("/search");
  });

  it("draws an accent focus ring on the D-pad focused tab", async () => {
    await renderTabs();

    expect(tabStyle("Home", { focused: true }).borderWidth).toBeGreaterThan(0);
    expect(tabStyle("Home", { pressed: true }).opacity).toBeUndefined();
  });

  it("points D-pad right at the content pane once it lays out", async () => {
    await renderTabs();

    await fireEvent(parentOf(screen.getByTestId("tab-slot")), "layout", {
      nativeEvent: { layout: { width: 800, height: 600 } },
    });

    expect("nextFocusRight" in pressableProps(tab("Home"))).toBe(true);
  });
});

describe("TV rail density (E-25)", () => {
  it("keeps the glyph inside its well and sizes everything through tokens", () => {
    expect(TV_RAIL_METRICS.iconWell).toBe(Control.md);
    // IconSize is raw dp: the SymbolView TV shim applies TV_DENSITY to the glyph.
    expect(TV_RAIL_METRICS.icon).toBe(IconSize.hero);
    expect(TV_RAIL_METRICS.icon).toBeLessThan(TV_RAIL_METRICS.iconWell);
  });

  describe("on tvOS (TV_DENSITY = 2)", () => {
    const tvOS = () =>
      loadOnPlatform({ OS: "ios", isTV: true }, () => ({
        rail: require("./app-tabs-wide") as typeof import("./app-tabs-wide"),
        density: require("@/constants/tv-density") as typeof import("@/constants/tv-density"),
        layout: require("@/constants/tv-layout") as typeof import("@/constants/tv-layout"),
      }));

    it("scales the well, brand row, logo and selected bar like Android TV", () => {
      const { rail, density } = tvOS();
      const m = rail.TV_RAIL_METRICS;

      expect(density.TV_DENSITY).toBe(2);
      expect(m.iconWell).toBe(density.tvDp(44));
      expect(m.brandRow).toBe(density.tvDp(72));
      expect(m.logo).toBe(density.tvDp(56));
      expect(m.logoCollapsed).toBe(density.tvDp(64));
      expect(m.selectedBar).toBe(density.tvDp(4));
    });

    it("renders the 28pt glyph at 56pt inside an 88pt well (no overflow)", () => {
      const { rail, density } = tvOS();
      const m = rail.TV_RAIL_METRICS;

      expect(m.icon).toBe(IconSize.hero);
      expect(m.icon * density.TV_DENSITY).toBeLessThan(m.iconWell);
    });

    it("keeps the rail widths on the tvOS canvas", () => {
      const { rail, layout } = tvOS();

      expect(rail.TV_RAIL_METRICS.widthExpanded).toBe(layout.TvLayout.sideRailWidthExpanded);
      expect(rail.TV_RAIL_METRICS.widthCollapsed).toBe(layout.TvLayout.sideRailWidthCollapsed);
      expect(rail.TV_RAIL_METRICS.widthCollapsed).toBe(192);
    });
  });
});
