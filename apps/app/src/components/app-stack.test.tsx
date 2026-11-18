import { screen } from "@testing-library/react-native";

import { AppStack } from "@/components/app-stack";
import { useWebGlobalRail } from "@/hooks/use-large-screen-layout";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  const { expoRouterMock, MockRedirect } = require("@/test-support/mocks/expo-router");
  const Passthrough = ({ children }: { children?: unknown }) =>
    React.createElement(View, null, children);
  const Stack = Object.assign(Passthrough, {
    Screen: ({ name }: { name: string }) => React.createElement(Text, null, `screen:${name}`),
    Protected: ({ guard, children }: { guard: boolean; children: unknown }) =>
      React.createElement(
        View,
        { testID: guard ? "protected-open" : "protected-closed" },
        children,
      ),
  });
  return { ...expoRouterMock, Stack, ThemeProvider: Passthrough, Redirect: MockRedirect };
});
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("@/components/navigation/screen-error-boundary", () => ({
  ScreenErrorBoundary: () => null,
}));
jest.mock("@/components/web/web-global-rail", () => ({
  WebGlobalRail: require("@/test-support/mocks/stub-component").stubComponent("web-rail"),
}));
jest.mock("@/hooks/use-large-screen-layout", () => ({
  useWebGlobalRail: jest.fn(() => ({ visible: false, width: 0 })),
}));
jest.mock("@/lib/seo/is-indexing-bot", () => ({ isIndexingBot: jest.fn(() => false) }));
jest.mock("@/stores/preferences-store", () => ({
  ...jest.requireActual("@/stores/preferences-store"),
  usePreferencesReady: jest.fn(() => true),
  usePreferences: jest.fn(() => ({ hasCompletedOnboarding: true })),
}));

const setOnboarded = (done: boolean) =>
  jest.mocked(usePreferences).mockReturnValue({ hasCompletedOnboarding: done } as never);

afterEach(() => {
  jest.mocked(usePreferencesReady).mockReturnValue(true);
  jest.mocked(useWebGlobalRail).mockReturnValue({ visible: false, width: 0 });
  jest.mocked(isIndexingBot).mockReturnValue(false);
  setOnboarded(true);
});

describe("AppStack", () => {
  it("shows only a boot shell until preferences hydrate", async () => {
    jest.mocked(usePreferencesReady).mockReturnValue(false);
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("screen:(tabs)")).toBeNull();
  });

  it("opens the tabs for onboarded users", async () => {
    await renderWithTheme(<AppStack />);

    expect(screen.getByTestId("protected-open")).toBeTruthy();
    expect(screen.queryByText("redirect:/intro")).toBeNull();
  });

  it("redirects first-time users to the intro", async () => {
    setOnboarded(false);
    await renderWithTheme(<AppStack />);

    expect(screen.getByText("redirect:/intro")).toBeTruthy();
    expect(screen.getByTestId("protected-closed")).toBeTruthy();
  });

  it("registers onboarding and login routes", async () => {
    await renderWithTheme(<AppStack />);

    expect(screen.getByText("screen:(onboarding)/intro")).toBeTruthy();
    expect(screen.getByText("screen:(auth)/login")).toBeTruthy();
  });

  it("hides the web rail when it is not visible", async () => {
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("web-rail")).toBeNull();
  });
});

describe("AppStack on web", () => {
  usePlatform({ OS: "web" });

  it("shows the global rail beside the stack on wide windows", async () => {
    jest.mocked(useWebGlobalRail).mockReturnValue({ visible: true, width: 232 });
    await renderWithTheme(<AppStack />);

    expect(screen.getByText("web-rail")).toBeTruthy();
  });

  it("lets indexing bots crawl the app without onboarding", async () => {
    setOnboarded(false);
    jest.mocked(isIndexingBot).mockReturnValue(true);
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("redirect:/intro")).toBeNull();
  });

  it("keeps the rail hidden behind the intro redirect", async () => {
    setOnboarded(false);
    jest.mocked(useWebGlobalRail).mockReturnValue({ visible: true, width: 232 });
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("web-rail")).toBeNull();
  });
});
