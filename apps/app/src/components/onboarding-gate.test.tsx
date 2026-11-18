import { render, screen } from "@testing-library/react-native";

import { OnboardingGate } from "@/components/onboarding-gate";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { preferencesStore } from "@/stores/preferences-store";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";

jest.mock("expo-router", () => {
  const { expoRouterMock, MockRedirect } = require("@/test-support/mocks/expo-router");
  return { ...expoRouterMock, Redirect: MockRedirect };
});
jest.mock("@/lib/seo/is-indexing-bot", () => ({ isIndexingBot: jest.fn(() => false) }));

const setState = async (ready: boolean, hasCompletedOnboarding: boolean) => {
  await setPreferences({ hasCompletedOnboarding });
  preferencesStore.setState({ isReady: ready });
};

beforeEach(resetExpoRouterMock);
afterEach(async () => {
  await setPreferences();
  preferencesStore.setState({ isReady: false });
  jest.mocked(isIndexingBot).mockReturnValue(false);
});

describe("OnboardingGate", () => {
  it("waits for preferences before deciding", async () => {
    await setState(false, false);
    await render(<OnboardingGate />);

    expect(screen.toJSON()).toBeNull();
  });

  it("sends first-time users to the intro", async () => {
    await setState(true, false);
    await render(<OnboardingGate />);

    expect(screen.getByText("redirect:/intro")).toBeTruthy();
  });

  it("leaves onboarding routes alone", async () => {
    await setState(true, false);
    setMockPathname("/intro", ["(onboarding)", "intro"]);
    await render(<OnboardingGate />);

    expect(screen.toJSON()).toBeNull();
  });

  it("lets onboarded users through", async () => {
    await setState(true, true);
    await render(<OnboardingGate />);

    expect(screen.toJSON()).toBeNull();
  });
});

describe("OnboardingGate on web", () => {
  usePlatform({ OS: "web" });

  it("keeps crawlers on the requested URL", async () => {
    jest.mocked(isIndexingBot).mockReturnValue(true);
    await setState(true, false);
    await render(<OnboardingGate />);

    expect(screen.toJSON()).toBeNull();
  });

  it("still redirects real first-time visitors", async () => {
    await setState(true, false);
    await render(<OnboardingGate />);

    expect(screen.getByText("redirect:/intro")).toBeTruthy();
  });
});
