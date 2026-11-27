import { act, fireEvent, screen } from "@testing-library/react-native";

import AppTabs, { TabButton } from "@/components/app-tabs.web";
import { WEB_TAB_MIN_HEIGHT, webBottomTabBarHeight } from "@/components/web/web-tab-bar-metrics";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { pressableProps } from "@/test-support/fiber";
import {
  mockTabNavigate,
  resetExpoRouterUiMock,
  setMockActiveTab,
} from "@/test-support/mocks/expo-router-ui";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router/ui", () => require("@/test-support/mocks/expo-router-ui").expoRouterUiMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

type PressableStyleFn = { style: (s: { pressed: boolean }) => unknown };
type HoverProps = { onHoverIn: () => void; onHoverOut: () => void };

const link = (label: string) => screen.getByRole("link", { name: label });
const labelStyle = (label: string) => flattenStyle(screen.getByText(label).props.style);
const tabStyle = (label: string, pressed = false) =>
  flattenStyle(pressableProps<PressableStyleFn>(link(label)).style({ pressed }));
/** The pill around the icon is the label's previous sibling. */
const indicatorStyle = (label: string) => {
  const siblings = link(label).children;
  return flattenStyle((siblings[0] as { props: { style: unknown } }).props.style);
};

async function themeTokens() {
  const { result } = await renderHookWithTheme(() => useThemeTokens());
  return result.current;
}

beforeEach(resetExpoRouterUiMock);
afterEach(resetMockWindowSize);

describe("AppTabs (web, narrow)", () => {
  it("renders a labelled navigation landmark with a link per tab", async () => {
    await renderWithTheme(<AppTabs />);

    expect(screen.getByLabelText("Primary").props.role).toBe("navigation");
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.queryByRole("tab")).toBeNull();
  });

  it.each(["Home", "Tracker", "Library", "Settings"])(
    "gives %s a ≥ 48px target and a ≥ 12px label",
    async (label) => {
      await renderWithTheme(<AppTabs />);

      expect(tabStyle(label).minHeight).toBeGreaterThanOrEqual(48);
      expect(labelStyle(label).fontSize).toBeGreaterThanOrEqual(12);
      expect(screen.getByText(label).props.maxFontSizeMultiplier).toBe(1.3);
    },
  );

  it("marks the active tab as the current page in accentText", async () => {
    const { colors, tokens } = await themeTokens();
    setMockActiveTab("tracker");
    await renderWithTheme(<AppTabs />);

    expect(link("Tracker").props["aria-current"]).toBe("page");
    expect(link("Home").props["aria-current"]).toBeUndefined();
    expect(labelStyle("Tracker")).toMatchObject({
      color: colors.accentText,
      fontWeight: "700",
    });
    expect(labelStyle("Home").color).toBe(colors.mutedForeground);
    expect(indicatorStyle("Tracker").backgroundColor).toBe(tokens.accentSoft);
  });

  it("washes the indicator on hover", async () => {
    const { tokens } = await themeTokens();
    await renderWithTheme(<AppTabs />);

    expect(indicatorStyle("Library").backgroundColor).toBe("transparent");
    await act(async () => pressableProps<HoverProps>(link("Library")).onHoverIn());
    expect(indicatorStyle("Library").backgroundColor).toBe(tokens.hover);
    await act(async () => pressableProps<HoverProps>(link("Library")).onHoverOut());
    expect(indicatorStyle("Library").backgroundColor).toBe("transparent");
  });

  it("navigates when a tab is pressed", async () => {
    await renderWithTheme(<AppTabs />);

    await fireEvent.press(link("Library"));

    expect(mockTabNavigate).toHaveBeenCalledWith("/library");
  });

  it("dims a pressed tab", async () => {
    await renderWithTheme(<AppTabs />);

    expect(tabStyle("Home", true).opacity).toBe(0.88);
  });
});

describe("TabButton", () => {
  it("forwards the trigger's href so the tab renders as an <a href>", async () => {
    await renderWithTheme(
      <TabButton
        label="Library"
        icon={{ ios: "books.vertical.fill", android: "local_library", web: "local_library" }}
        href="/library"
        isFocused={false}
      />,
    );

    expect(link("Library").props.href).toBe("/library");
  });
});

describe("webBottomTabBarHeight", () => {
  it("is the tab row plus the bar padding", () => {
    expect(webBottomTabBarHeight(0)).toBe(Spacing.one + WEB_TAB_MIN_HEIGHT + Spacing.one);
    expect(webBottomTabBarHeight(34)).toBe(Spacing.one + WEB_TAB_MIN_HEIGHT + 34);
  });
});

describe("AppTabs (web, wide)", () => {
  it("keeps the triggers mounted in a hidden tab list", async () => {
    setMockWindowSize(1200);
    await renderWithTheme(<AppTabs />);

    expect(
      flattenStyle(screen.getByTestId("tab-list", { includeHiddenElements: true }).props.style)
        .display,
    ).toBe("none");
    expect(screen.getAllByText("Settings", { includeHiddenElements: true })).toHaveLength(1);
  });
});
