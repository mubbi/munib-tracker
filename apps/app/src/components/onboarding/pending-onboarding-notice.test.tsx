import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  PendingOnboardingBar,
  PendingOnboardingCallout,
  useShowSetupBar,
} from "@/components/onboarding/pending-onboarding-notice";
import {
  DEFERRED_SETUP_HREF,
  deferredOnboardingStore,
  resetDeferredOnboarding,
} from "@/lib/onboarding/deferred-onboarding";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { preferencesStore } from "@/stores/preferences-store";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/seo/is-indexing-bot", () => ({ isIndexingBot: jest.fn(() => false) }));
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

/** Persisted (not just seeded): the real theme provider's write-back reloads stored prefs. */
const seedOnboarded = (onboarded: boolean) =>
  act(() => preferencesStore.getState().update({ hasCompletedOnboarding: onboarded }));

function BarProbe() {
  return <Text>{useShowSetupBar() ? "bar:on" : "bar:off"}</Text>;
}

const renderProbe = async ({
  pathname = "/circle/join/AB12",
  onboarded = false,
  deferred = true,
}: {
  pathname?: string;
  onboarded?: boolean;
  deferred?: boolean;
} = {}) => {
  await seedOnboarded(onboarded);
  deferredOnboardingStore.setState({ deferred });
  setMockPathname(pathname);
  return renderWithTheme(<BarProbe />);
};

describe("pending onboarding notices", () => {
  const onPlatform = usePlatformSwitch();

  beforeEach(async () => {
    await resetSettingsStores();
    resetExpoRouterMock();
    resetDeferredOnboarding();
    onPlatform({ OS: "ios" });
  });

  afterEach(() => {
    jest.mocked(isIndexingBot).mockReturnValue(false);
    resetMockWindowSize();
  });

  describe("useShowSetupBar", () => {
    it.each(["/circle/join/AB12", "/khatm-groups/123", "/quran/2", "/zakat", "/library"])(
      "shows on %s after a deep link deferred onboarding",
      async (pathname) => {
        await renderProbe({ pathname });
        expect(screen.getByText("bar:on")).toBeTruthy();
      },
    );

    it("stays on every later screen until onboarding is complete", async () => {
      await renderProbe({ pathname: "/hadith/bukhari" });
      expect(screen.getByText("bar:on")).toBeTruthy();

      await seedOnboarded(true);
      expect(screen.getByText("bar:off")).toBeTruthy();
    });

    it.each(["/", "/setup", "/intro", "/login", "/oauth/google"])(
      "stays off on %s",
      async (pathname) => {
        await renderProbe({ pathname });
        expect(screen.getByText("bar:off")).toBeTruthy();
      },
    );

    it("stays off until the root stack deferred onboarding", async () => {
      await renderProbe({ deferred: false });
      expect(screen.getByText("bar:off")).toBeTruthy();
    });

    it("stays off on TV", async () => {
      onPlatform({ isTV: true });
      await renderProbe();
      expect(screen.getByText("bar:off")).toBeTruthy();
    });

    it("never shows to web crawlers", async () => {
      onPlatform({ OS: "web" });
      jest.mocked(isIndexingBot).mockReturnValue(true);
      await renderProbe();
      expect(screen.getByText("bar:off")).toBeTruthy();
    });
  });

  describe("PendingOnboardingBar", () => {
    const BAR_LABEL =
      "Your setup is pending. Complete it for a better, more personalized experience.";

    it("is one button that opens the setup wizard returning to this page", async () => {
      await renderWithTheme(<PendingOnboardingBar />);

      const bar = screen.getByRole("button", { name: BAR_LABEL });
      expect(screen.getAllByRole("button")).toHaveLength(1);
      fireEvent.press(bar);
      expect(mockRouter.push).toHaveBeenCalledWith(DEFERRED_SETUP_HREF);
    });

    it("shows the message and the 'Complete setup' link on wide windows", async () => {
      setMockWindowSize(1280);
      await renderWithTheme(<PendingOnboardingBar />);

      expect(screen.getByText("Your setup is pending")).toBeTruthy();
      expect(
        screen.getByText(/Complete it for a better, more personalized experience\./),
      ).toBeTruthy();
      expect(screen.getByText("Complete setup")).toBeTruthy();
    });

    it("stacks the message and keeps only a chevron on phones", async () => {
      setMockWindowSize(390);
      await renderWithTheme(<PendingOnboardingBar />);

      expect(screen.getByText("Your setup is pending")).toBeTruthy();
      expect(
        screen.getByText("Complete it for a better, more personalized experience."),
      ).toBeTruthy();
      expect(screen.queryByText("Complete setup")).toBeNull();
    });
  });

  describe("PendingOnboardingCallout", () => {
    const renderCallout = async (onboarded: boolean) => {
      await seedOnboarded(onboarded);
      return renderWithTheme(<PendingOnboardingCallout />);
    };

    it("invites a deep-linked first-time user to finish setup from Home", async () => {
      await renderCallout(false);

      expect(screen.getByText("Finish setting up")).toBeTruthy();
      fireEvent.press(screen.getByRole("button", { name: "Complete setup" }));
      expect(mockRouter.push).toHaveBeenCalledWith(DEFERRED_SETUP_HREF);
    });

    it("disappears once onboarding is complete", async () => {
      await renderCallout(true);

      expect(screen.queryByTestId("pending-onboarding-callout")).toBeNull();
    });
  });
});
