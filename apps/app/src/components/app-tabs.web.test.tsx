import { fireEvent, screen } from "@testing-library/react-native";

import AppTabs from "@/components/app-tabs.web";
import { pressableProps } from "@/test-support/fiber";
import {
  mockTabNavigate,
  resetExpoRouterUiMock,
  setMockActiveTab,
} from "@/test-support/mocks/expo-router-ui";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router/ui", () => require("@/test-support/mocks/expo-router-ui").expoRouterUiMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const tab = (label: string) => screen.getByRole("tab", { name: label });
const labelStyle = (label: string) => flattenStyle(screen.getByText(label).props.style);

beforeEach(resetExpoRouterUiMock);
afterEach(resetMockWindowSize);

describe("AppTabs (web, narrow)", () => {
  it("renders a floating bottom bar with every tab", async () => {
    await renderWithTheme(<AppTabs />);

    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.queryByTestId("tab-list")).toBeNull();
    expect(labelStyle("Home").fontSize).toBe(12);
  });

  it("highlights the active tab", async () => {
    setMockActiveTab("tracker");
    await renderWithTheme(<AppTabs />);

    expect(tab("Tracker").props.accessibilityState).toEqual({ selected: true });
    expect(labelStyle("Tracker").fontWeight).toBe("700");
  });

  it("navigates when a tab is pressed", async () => {
    await renderWithTheme(<AppTabs />);

    await fireEvent.press(tab("Library"));

    expect(mockTabNavigate).toHaveBeenCalledWith("/library");
  });

  it("dims a pressed tab", async () => {
    await renderWithTheme(<AppTabs />);

    const style = pressableProps<{ style: (s: object) => unknown }>(tab("Home")).style({
      pressed: true,
    });
    expect(flattenStyle(style).opacity).toBe(0.75);
  });
});

describe("AppTabs (web, wide)", () => {
  it("keeps rail triggers mounted in a hidden tab list", async () => {
    setMockWindowSize(1200);
    await renderWithTheme(<AppTabs />);

    expect(
      flattenStyle(screen.getByTestId("tab-list", { includeHiddenElements: true }).props.style)
        .display,
    ).toBe("none");
    expect(
      flattenStyle(screen.getByText("Settings", { includeHiddenElements: true }).props.style)
        .fontSize,
    ).toBe(15);
  });
});
