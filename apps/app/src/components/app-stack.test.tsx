import { screen } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";

import { AppStack, TvFinanceRouteGate } from "@/components/app-stack";
import { useNativeTabletRail, useWebGlobalRail } from "@/hooks/use-large-screen-layout";
import { getCurrentPathname, setCurrentPathname } from "@/lib/navigation";
import {
  deferredOnboardingStore,
  resetDeferredOnboarding,
} from "@/lib/onboarding/deferred-onboarding";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  const { expoRouterMock, MockRedirect } = require("@/test-support/mocks/expo-router");
  const Passthrough = ({ children }: { children?: unknown }) =>
    React.createElement(View, null, children);
  const StackNavigator = (props: { children?: unknown }) => {
    mockStackProps.current = props;
    return React.createElement(View, null, props.children);
  };
  const Stack = Object.assign(StackNavigator, {
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
  useNativeTabletRail: jest.fn(() => mockNoTabletRail),
}));
jest.mock("@/components/app-tabs-wide", () => ({
  TabletRail: ({ width, expanded }: { width: number; expanded: boolean }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(
      Text,
      null,
      `tablet-rail:${width}:${expanded ? "labelled" : "compact"}`,
    );
  },
}));
jest.mock("@/components/screen-layout", () => ({
  ScreenLayout: ({ title, children }: { title: string; children: unknown }) => {
    const React = require("react");
    const { Text, View } = require("react-native");
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, `screen:${title}`),
      children,
    );
  },
}));

const mockStackProps: { current: Record<string, unknown> } = { current: {} };
const mockNoTabletRail = { visible: false, width: 0, expanded: false, startInset: 0 };
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
  jest.mocked(useNativeTabletRail).mockReturnValue(mockNoTabletRail);
  devicePreferencesStore.setState({ prefs: {} });
  jest.mocked(isIndexingBot).mockReturnValue(false);
  setOnboarded(true);
  resetExpoRouterMock();
  resetDeferredOnboarding();
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

  it("tracks the focused pathname for parent-hub back fallbacks", async () => {
    setMockPathname("/hadith/bukhari");
    try {
      await renderWithTheme(<AppStack />);
      expect(getCurrentPathname()).toBe("/hadith/bukhari");
    } finally {
      resetExpoRouterMock();
      setCurrentPathname(null);
    }
  });

  it("redirects first-time users to the intro", async () => {
    setOnboarded(false);
    await renderWithTheme(<AppStack />);

    expect(screen.getByText("redirect:/intro")).toBeTruthy();
    expect(screen.getByTestId("protected-closed")).toBeTruthy();
  });

  it("opens a deep link for first-time users instead of the intro", async () => {
    setOnboarded(false);
    setMockPathname("/circle/join/AB12");
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("redirect:/intro")).toBeNull();
    expect(screen.getByTestId("protected-open")).toBeTruthy();
    expect(deferredOnboardingStore.getState().deferred).toBe(true);
  });

  it("keeps Home open after a deep link deferred onboarding this session", async () => {
    setOnboarded(false);
    deferredOnboardingStore.setState({ deferred: true });
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText("redirect:/intro")).toBeNull();
    expect(screen.getByTestId("protected-open")).toBeTruthy();
  });

  it("doesn't defer onboarding from the onboarding screens themselves", async () => {
    setOnboarded(false);
    setMockPathname("/setup", ["(onboarding)", "setup"]);
    await renderWithTheme(<AppStack />);

    expect(screen.getByTestId("protected-closed")).toBeTruthy();
    expect(deferredOnboardingStore.getState().deferred).toBe(false);
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

describe("AppStack on native tablets (D-UX3)", () => {
  usePlatform({ OS: "android" });

  it("hosts the tablet rail beside the stack so pushed screens keep it", async () => {
    jest
      .mocked(useNativeTabletRail)
      .mockReturnValue({ visible: true, width: 96, expanded: false, startInset: 0 });
    await renderWithTheme(<AppStack />);

    expect(screen.getByText("tablet-rail:96:compact")).toBeTruthy();
    expect(screen.getByText("screen:(tabs)")).toBeTruthy();
  });

  it("keeps the tablet rail hidden behind the intro redirect", async () => {
    setOnboarded(false);
    jest
      .mocked(useNativeTabletRail)
      .mockReturnValue({ visible: true, width: 232, expanded: true, startInset: 0 });
    await renderWithTheme(<AppStack />);

    expect(screen.queryByText(/tablet-rail/)).toBeNull();
  });

  it("adds no screen layout off TV", async () => {
    await renderWithTheme(<AppStack />);

    expect(mockStackProps.current.screenLayout).toBeUndefined();
  });
});

describe("TV finance gate (D-UX5)", () => {
  usePlatform({ isTV: true });

  const renderLayout = (routeName: string) => {
    const layout = mockStackProps.current.screenLayout as (args: {
      route: { name: string };
      children: ReactElement;
    }) => ReactElement;
    return renderWithTheme(layout({ route: { name: routeName }, children: <Text>tool</Text> }));
  };

  it("wraps every stack screen on TV", async () => {
    await renderWithTheme(<AppStack />);

    expect(typeof mockStackProps.current.screenLayout).toBe("function");
  });

  it.each(["zakat/index", "sadaqah/index", "fidyah/index", "finance/index", "mirath/index"])(
    "shows the unavailable state for %s by default",
    async (routeName) => {
      await renderWithTheme(<AppStack />);
      await renderLayout(routeName);

      expect(screen.queryByText("tool")).toBeNull();
      expect(screen.getByText("Finance tools are off on this TV")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Go back" })).toBeTruthy();
    },
  );

  it("opens the tool once Show finance tools is on", async () => {
    devicePreferencesStore.setState({ prefs: { tvShowFinanceTools: true } });
    await renderWithTheme(
      <TvFinanceRouteGate routeName="zakat/index">
        <Text>tool</Text>
      </TvFinanceRouteGate>,
    );

    expect(screen.getByText("tool")).toBeTruthy();
  });

  it("leaves guide topics and other routes alone", async () => {
    for (const routeName of ["zakat/[topic]", "quran/[surah]", "(tabs)"]) {
      await renderWithTheme(
        <TvFinanceRouteGate routeName={routeName}>
          <Text>{routeName}</Text>
        </TvFinanceRouteGate>,
      );
      expect(screen.getByText(routeName)).toBeTruthy();
    }
  });
});
