import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ViewStyle } from "react-native";

import { WideAppTabs } from "@/components/app-tabs-wide";
import { isTvRailExpanded, tryExpandTvRailOnBack } from "@/lib/tv/tv-rail-back";
import { pressableProps } from "@/test-support/fiber";
import {
  mockTabNavigate,
  resetExpoRouterUiMock,
  setMockActiveTab,
} from "@/test-support/mocks/expo-router-ui";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router/ui", () => require("@/test-support/mocks/expo-router-ui").expoRouterUiMock);

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

beforeEach(resetExpoRouterUiMock);

describe("WideAppTabs", () => {
  it("lists every tab with its label", async () => {
    await renderTabs();

    expect(LABELS.map((label) => screen.getByText(label))).toHaveLength(4);
  });

  it("marks the active tab as selected", async () => {
    setMockActiveTab("library");
    await renderTabs();

    expect(tab("Library").props.accessibilityState).toEqual({ selected: true });
    expect(tab("Home").props.accessibilityState).toEqual({ selected: false });
  });

  it("navigates when a tab is pressed", async () => {
    await renderTabs();

    await fireEvent.press(tab("Tracker"));

    expect(mockTabNavigate).toHaveBeenCalledWith("/tracker");
  });

  it("dims a pressed tab", async () => {
    await renderTabs();

    expect(tabStyle("Home", { pressed: true }).opacity).toBe(0.75);
  });

  it("ignores rail focus changes off TV", async () => {
    await renderTabs();

    await fireEvent(tab("Home"), "blur");

    expect(screen.getByText("Home")).toBeTruthy();
  });
});

describe("WideAppTabs on web", () => {
  usePlatform({ OS: "web" });

  it("still navigates after releasing DOM focus", async () => {
    await renderTabs();

    await fireEvent.press(tab("Settings"));

    expect(mockTabNavigate).toHaveBeenCalledWith("/settings");
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

  it("lets Back fall through to the system once the rail is open", async () => {
    await renderTabs();
    await fireEvent(tab("Home"), "focus");

    expect(tryExpandTvRailOnBack()).toBe(false);
  });

  it("draws an accent focus ring on the D-pad focused tab", async () => {
    await renderTabs();

    expect(tabStyle("Home", { focused: true }).borderWidth).toBeGreaterThan(0);
    expect(tabStyle("Home", { pressed: true }).opacity).toBeUndefined();
  });

  it("points D-pad right at the content pane once it lays out", async () => {
    await renderTabs();

    await fireEvent(screen.getByTestId("tab-slot").parent!, "layout", {
      nativeEvent: { layout: { width: 800, height: 600 } },
    });

    expect("nextFocusRight" in pressableProps(tab("Home"))).toBe(true);
  });
});
