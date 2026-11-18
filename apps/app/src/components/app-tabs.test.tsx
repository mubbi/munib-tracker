import { screen } from "@testing-library/react-native";
import { Platform } from "react-native";

import AppTabs from "@/components/app-tabs";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("@/components/app-tabs-wide", () => ({
  WideAppTabs: require("@/test-support/mocks/stub-component").stubComponent("wide-rail"),
}));
jest.mock("@/components/navigation/screen-error-boundary", () => ({
  ScreenErrorBoundary: () => null,
}));
jest.mock("expo-router/native-tabs", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  const NativeTabs = ({
    children,
    backgroundColor,
  }: {
    children: unknown;
    backgroundColor?: string;
  }) => React.createElement(View, { testID: "native-tabs", backgroundColor }, children);
  const Trigger = ({ children }: { children: unknown }) =>
    React.createElement(View, null, children);
  Trigger.Label = ({ children }: { children: unknown }) =>
    React.createElement(Text, null, children);
  Trigger.Icon = () => null;
  NativeTabs.Trigger = Trigger;
  return { NativeTabs };
});

const nativeTabs = () => screen.queryByTestId("native-tabs");

describe("AppTabs", () => {
  let restorePlatform = () => {};
  afterEach(() => {
    restorePlatform();
    resetMockWindowSize();
    jest.restoreAllMocks();
  });

  it("uses system tabs with every label on iPhone, even on wide windows", async () => {
    setMockWindowSize(1000);
    await renderWithTheme(<AppTabs />);

    expect(nativeTabs()).toBeTruthy();
    expect(["Home", "Tracker", "Library", "Settings"].map((l) => screen.getByText(l))).toHaveLength(
      4,
    );
  });

  it("lets iOS adopt the system bar material", async () => {
    await renderWithTheme(<AppTabs />);

    expect(nativeTabs()!.props.backgroundColor).toBeUndefined();
  });

  it("uses the side rail on wide iPads", async () => {
    jest.spyOn(Platform, "isPad", "get").mockReturnValue(true);
    setMockWindowSize(1000);
    await renderWithTheme(<AppTabs />);

    expect(screen.getByText("wide-rail")).toBeTruthy();
  });

  it.each([
    ["wide Android", { OS: "android" as const }, 1000],
    ["TV", { isTV: true }, 390],
  ])("uses the side rail on %s", async (_case, platform, width) => {
    restorePlatform = setPlatform(platform);
    setMockWindowSize(width);
    await renderWithTheme(<AppTabs />);

    expect(screen.getByText("wide-rail")).toBeTruthy();
  });

  it("paints the themed Material surface on narrow Android", async () => {
    restorePlatform = setPlatform({ OS: "android" });
    await renderWithTheme(<AppTabs />);

    expect(nativeTabs()!.props.backgroundColor).toEqual(expect.any(String));
  });
});
