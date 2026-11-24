import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";

import OnboardingIntroScreen from "@/app/(onboarding)/intro";
import SetupScreen from "@/app/(onboarding)/setup";
import { requestNotificationPermission } from "@/lib/notifications/permissions";
import { devicePreferencesStore, setDevicePreferences } from "@/stores/device-preferences-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { mockFetch } from "@/test-support/fetch";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));
jest.mock("@/lib/notifications/permissions", () => ({
  ...jest.requireActual("@/lib/notifications/permissions"),
  canEnableLocalReminders: jest.fn(() => true),
  requestNotificationPermission: jest.fn(async () => ({ granted: true })),
}));

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
// The tasbeeh design editor (extras step) uses gesture handler.
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);

const requestPermission = jest.mocked(requestNotificationPermission);

const press = (label: string) => fireEvent.press(screen.getByRole("button", { name: label }));

beforeEach(async () => {
  resetExpoRouterMock();
  mockRouterCanDismiss.mockReturnValue(false);
  requestPermission.mockClear();
  resetToastMock();
  // Weather / editions / geocoding are offline in tests (finishing setup boots home services).
  mockFetch(new Error("offline"));
  // No location permission yet → the silent boot refresh leaves the Makkah default.
  jest.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue({
    status: "undetermined",
  } as never);
  await resetSettingsStores();
});

describe("first-run setup wizard", () => {
  it("walks language → location → madhhab → reminders → extras → summary, then opens the app", async () => {
    await renderWithProviders(<SetupScreen />);
    expect(screen.getByText("Step 1 of 5")).toBeTruthy();
    expect(screen.getByText("Choose your language")).toBeTruthy();
    await press("Next");

    // Location: why first, then Continue opens the system dialog (no skip on iOS).
    expect(screen.getByText("Step 2 of 5")).toBeTruthy();
    expect(screen.getByText("Where do you pray?")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Search for my city instead" })).toBeNull();
    await press("Continue");
    await waitFor(() => expect(screen.getByText("Salah times & location")).toBeTruthy());
    expect(locationStore.getState().location.source).toBe("device");
    expect(screen.getByText("Prayer calculation")).toBeTruthy();
    await press("Next");
    expect(devicePreferencesStore.getState().prefs.methodReviewedAt).toEqual(expect.any(String));
    expect(devicePreferencesStore.getState().prefs.languageConfirmedAt).toEqual(expect.any(String));

    // Madhhab: Continue waits for a choice; picking offers the Asr time, no toast mid-setup.
    expect(screen.getByText("Your madhhab")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next" }).props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
    await fireEvent.press(screen.getByTestId("madhhab-option-hanafi"));
    expect(preferencesStore.getState().prefs.madhhab).toBe("hanafi");
    expect(screen.getByText("Also use the Hanafi Asr time?")).toBeTruthy();
    expect(mockToast.success).not.toHaveBeenCalled();
    expect(devicePreferencesStore.getState().prefs.setupProgress).toEqual({ step: "madhhab" });
    await press("Next");

    // Reminders: explained, then the system prompt.
    expect(screen.getByText("Never miss a Salah")).toBeTruthy();
    expect(preferencesStore.getState().prefs.hasCompletedOnboarding).toBe(false);
    await press("Continue");
    await waitFor(() => expect(screen.getByText("Reminders are on")).toBeTruthy());
    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(preferencesStore.getState().prefs.notificationPrefs.masterEnabled).toBe(true);
    await press("Next");

    // Core steps done: the app is ready and nothing is left to resume.
    expect(screen.getByText("Make it yours")).toBeTruthy();
    expect(preferencesStore.getState().prefs.hasCompletedOnboarding).toBe(true);
    expect(devicePreferencesStore.getState().prefs.setupProgress).toBeUndefined();
    await press("Next");

    expect(screen.getByText("You're all set")).toBeTruthy();
    expect(screen.getByText("Setup complete")).toBeTruthy();
    expect(screen.getByText("Hanafi")).toBeTruthy();
    await press("Begin");
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });

  it("goes to sign-in at the end when the welcome screen chose it", async () => {
    setMockSearchParams({ step: "done", next: "/login" });
    await renderWithProviders(<SetupScreen />);
    await press("Sign in to sync");
    expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    expect(preferencesStore.getState().prefs.hasCompletedOnboarding).toBe(true);
  });

  it('"Decide later" leaves the madhhab unset for the checklist and home card', async () => {
    setMockSearchParams({ step: "madhhab" });
    await renderWithProviders(<SetupScreen />);
    await press("Decide later");
    expect(preferencesStore.getState().prefs.madhhab).toBeUndefined();
    expect(screen.getByText("Never miss a Salah")).toBeTruthy();
  });

  it("resumes at the saved step after a restart", async () => {
    await act(async () =>
      setDevicePreferences({ setupProgress: { step: "madhhab", next: "/login" } }),
    );
    await renderWithProviders(<SetupScreen />);
    expect(screen.getByText("Your madhhab")).toBeTruthy();
    expect(screen.getByText("Step 3 of 5")).toBeTruthy();
  });

  it("Back walks the steps, then returns to the welcome screen's last page", async () => {
    setMockSearchParams({ step: "location" });
    await renderWithProviders(<SetupScreen />);
    await press("Back");
    expect(screen.getByText("Choose your language")).toBeTruthy();
    await press("Back");
    expect(mockRouter.replace).toHaveBeenCalledWith({ pathname: "/intro", params: { at: "end" } });
  });

  it("a summary row opens its step and Next comes back to the summary", async () => {
    setMockSearchParams({ step: "done" });
    await renderWithProviders(<SetupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: /^My madhhab/ }));
    expect(screen.getByText("Your madhhab")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("madhhab-option-maliki"));
    await press("Next");
    expect(screen.getByText("You're all set")).toBeTruthy();
    expect(screen.getByText("Maliki")).toBeTruthy();
  });

  it("lists what's still unset on the summary and jumps to that step", async () => {
    setMockSearchParams({ step: "done" });
    await renderWithProviders(<SetupScreen />);
    expect(screen.getByText("Finish setting up")).toBeTruthy();
    await fireEvent.press(screen.getByText("Turn on reminders"));
    expect(screen.getByText("Never miss a Salah")).toBeTruthy();
  });
});

describe("setup on other platforms", () => {
  const onPlatform = usePlatformSwitch();

  it("Android offers city search and 'Set up later' instead of the system prompts", async () => {
    onPlatform({ OS: "android" });
    setMockSearchParams({ step: "location" });
    await renderWithProviders(<SetupScreen />);
    await press("Search for my city instead");
    expect(screen.getByText("Salah times & location")).toBeTruthy();
    expect(locationStore.getState().location.source).toBe("default");
    expect(screen.getByText("Salah times use Makkah until you choose your place.")).toBeTruthy();
    await press("Next");
    await press("Decide later");
    await press("Set up later");
    expect(requestPermission).not.toHaveBeenCalled();
    expect(screen.getByText("Make it yours")).toBeTruthy();
  });

  it("TV skips reminders and phone extras", async () => {
    onPlatform({ OS: "android", isTV: true });
    await renderWithProviders(<SetupScreen />);
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    await press("Next");
    // No GPS on TV: straight to the place and calculation.
    expect(screen.getByText("Salah times & location")).toBeTruthy();
    await press("Next");
    await press("Decide later");
    expect(screen.getByText("You're all set")).toBeTruthy();
    expect(preferencesStore.getState().prefs.hasCompletedOnboarding).toBe(true);
  });
});

describe('"Run setup again"', () => {
  beforeEach(async () => {
    await act(async () => {
      await preferencesStore.getState().update({ hasCompletedOnboarding: true, madhhab: "shafii" });
      await locationStore.getState().setManualLocation({
        id: "lahore",
        name: "Lahore",
        country: "Pakistan",
        label: "Lahore, Pakistan",
        latitude: 31.55,
        longitude: 74.34,
      } as never);
    });
  });

  it("shows the current values and never re-asks or overwrites them", async () => {
    setMockSearchParams({ step: "location" });
    await renderWithProviders(<SetupScreen />);
    // The manual city stays: no permission pre-prompt, no GPS fix.
    expect(screen.getByText("Salah times & location")).toBeTruthy();
    expect(screen.getAllByText("Lahore, Pakistan").length).toBeGreaterThan(0);
    await press("Next");
    expect(screen.getByTestId("madhhab-option-shafii").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(locationStore.getState().location.source).toBe("manual");
    expect(devicePreferencesStore.getState().prefs.setupProgress).toBeUndefined();
  });

  it("Back from the first step and Done return to Settings", async () => {
    await renderWithProviders(<SetupScreen />);
    await press("Back");
    expect(mockRouter.replace).toHaveBeenCalledWith("/settings/about");
  });
});

describe("welcome screen", () => {
  it("resumes an interrupted first run at its saved step", async () => {
    await act(async () => setDevicePreferences({ setupProgress: { step: "reminders" } }));
    await renderWithProviders(<OnboardingIntroScreen />);
    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/setup",
      params: { step: "reminders" },
    });
  });

  it("doesn't bounce back when the user returned from setup on purpose", async () => {
    await act(async () => setDevicePreferences({ setupProgress: { step: "language" } }));
    setMockSearchParams({ at: "end" });
    await renderWithProviders(<OnboardingIntroScreen />);
    expect(mockRouter.replace).not.toHaveBeenCalled();
    await press("Continue as guest");
    expect(mockRouter.replace).toHaveBeenCalledWith({ pathname: "/setup", params: {} });
  });
});
