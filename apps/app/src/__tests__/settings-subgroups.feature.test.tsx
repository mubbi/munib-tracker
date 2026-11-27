import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import SetupScreen from "@/app/(onboarding)/setup";
import PrayerTimesSettingsScreen from "@/app/settings/prayer-times";
import { SettingsScreen } from "@/components/settings/settings-screen";
import { getSettingsGroup, subgroupOfSetting } from "@/lib/settings/groups";
import { sectionsForGroup } from "@/lib/settings/registry";
import { SETTINGS_ROUTE_PATHS, settingHref } from "@/lib/settings/routes";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { locationStore } from "@/stores/location-store";
import { buildLocationSearchResult } from "@/test-support/fixtures/location";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithProviders } from "@/test-support/render";
import { PHONE_ANDROID, PHONE_IOS, resetSettingsStores, WEB } from "@/test-support/settings";

jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  Redirect: require("@/test-support/mocks/expo-router").MockRedirect,
}));
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock(
  "@/notifications/scheduler",
  () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock,
);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);

beforeEach(async () => {
  resetExpoRouterMock();
  mockRouterCanDismiss.mockReturnValue(false);
  await resetSettingsStores();
});
afterEach(resetMockWindowSize);

describe("Reminders & notifications sub-screens", () => {
  it("every section lives on exactly one screen (group or one sub-screen)", () => {
    const meta = getSettingsGroup("notifications");
    const subSections = (meta.subgroups ?? []).flatMap((sub) => sub.sections);
    expect(new Set(subSections).size).toBe(subSections.length);
    for (const ctx of [PHONE_IOS, PHONE_ANDROID, WEB]) {
      const onGroupScreen = sectionsForGroup("notifications", ctx)
        .map((section) => section.key)
        .filter((key) => !subSections.includes(key));
      // Only the master switch and the upcoming preview stay on the group screen.
      expect(onGroupScreen).toEqual(["settingsPanel.section.permission", "notif.upcomingTitle"]);
    }
  });

  it("advertises every sub-screen route for deep links", () => {
    for (const sub of getSettingsGroup("notifications").subgroups ?? []) {
      expect(SETTINGS_ROUTE_PATHS).toContain(`/settings/notifications/${sub.id}`);
    }
  });

  it("the group screen keeps the master switch and lists the sub-screens", async () => {
    await renderWithProviders(<SettingsScreen group="notifications" />);
    expect(screen.getByText("All notifications")).toBeTruthy();
    expect(screen.queryByText("Morning adhkar")).toBeNull();
    await fireEvent.press(screen.getByText("Zikr & Qur'an"));
    expect(mockRouter.push).toHaveBeenCalledWith("/settings/notifications/zikr");
  });

  it("a sub-screen shows only its sections and Back returns to the group", async () => {
    await renderWithProviders(<SettingsScreen group="notifications" subgroup="zikr" />);
    expect(screen.getByText("Morning adhkar")).toBeTruthy();
    expect(screen.queryByText("All notifications")).toBeNull();
    expect(screen.queryByText("Daily reflection")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/settings/notifications");
  });

  it("forwards a deep link focus to the sub-screen holding the row", async () => {
    expect(settingHref("notifications.zikr.bedtime")).toBe(
      "/settings/notifications?focus=notifications.zikr.bedtime",
    );
    setMockSearchParams({ focus: "notifications.zikr.bedtime" });
    await renderWithProviders(<SettingsScreen group="notifications" />);
    expect(
      screen.getByText("redirect:/settings/notifications/zikr?focus=notifications.zikr.bedtime"),
    ).toBeTruthy();
  });

  it("keeps a focus on the group screen's own rows there", async () => {
    setMockSearchParams({ focus: "notifications.master" });
    await renderWithProviders(<SettingsScreen group="notifications" />);
    expect(screen.getByText("All notifications")).toBeTruthy();
  });

  it("bounces an unknown sub-screen to the group", async () => {
    await renderWithProviders(<SettingsScreen group="notifications" subgroup="nope" />);
    expect(screen.getByText("redirect:/settings/notifications")).toBeTruthy();
  });

  it("maps settings to their sub-screen", () => {
    expect(subgroupOfSetting("notifications.salah.offset.fajr")?.id).toBe("salah");
    expect(subgroupOfSetting("notifications.content.friday")?.id).toBe("other");
    expect(subgroupOfSetting("notifications.master")).toBeNull();
    expect(subgroupOfSetting("quran.reader.layout")).toBeNull();
  });

  it("list–detail opens sub-screens and search results by route (D-UX11)", async () => {
    setMockWindowSize(1280);
    await renderWithProviders(<SettingsScreen group="notifications" />);
    // The group route on a wide window: list pane + this group's body.
    expect(screen.getByText("Appearance & home")).toBeTruthy();
    await fireEvent.press(await screen.findByText("Salah & Adhan"));
    expect(mockRouter.push).toHaveBeenCalledWith("/settings/notifications/salah");

    await fireEvent.changeText(screen.getByLabelText("Search settings"), "Bedtime");
    const results = await screen.findAllByText("Bedtime");
    await fireEvent.press(results[0]);
    expect(mockRouter.replace).toHaveBeenCalledWith(settingHref("notifications.zikr.bedtime"));
  });

  it("a sub-screen route on a wide window goes back to its group from the detail pane", async () => {
    setMockWindowSize(1280);
    await renderWithProviders(<SettingsScreen group="notifications" subgroup="salah" />);
    await waitFor(() => expect(screen.getByText("Play Adhan at prayer time")).toBeTruthy());
    const back = screen.getAllByRole("button", { name: "Reminders & notifications" });
    // The last one is the detail pane's back link (the first is the group row).
    await fireEvent.press(back[back.length - 1]);
    expect(mockRouter.replace).toHaveBeenCalledWith("/settings/notifications");
  });
});

describe("suggested calculation method", () => {
  const pickLahore = () =>
    act(() =>
      locationStore.getState().setManualLocation(
        buildLocationSearchResult({
          id: "lahore",
          name: "Lahore",
          country: "Pakistan",
          countryCode: "PK",
          label: "Lahore, Pakistan",
          latitude: 31.55,
          longitude: 74.34,
        }),
      ),
    );

  it("offers the country's usual method and applies it in one tap", async () => {
    await pickLahore();
    await renderWithProviders(<PrayerTimesSettingsScreen />);
    expect(screen.getByText("Suggested for Pakistan")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Use this method" }));
    await waitFor(() => expect(locationStore.getState().location.method).toBe("Karachi"));
    expect(screen.queryByText("Suggested for Pakistan")).toBeNull();
    expect(devicePreferencesStore.getState().prefs.methodReviewedAt).toEqual(expect.any(String));
  });

  it('"Keep current" hides it without changing anything', async () => {
    await pickLahore();
    await renderWithProviders(<PrayerTimesSettingsScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Keep current" }));
    await waitFor(() => expect(screen.queryByText("Suggested for Pakistan")).toBeNull());
    expect(locationStore.getState().location.method).toBe("MuslimWorldLeague");
    expect(devicePreferencesStore.getState().prefs.methodSuggestionDismissed).toBe("PK:Karachi");
  });

  it("is never shown for the Makkah default", async () => {
    await renderWithProviders(<PrayerTimesSettingsScreen />);
    expect(screen.queryByText(/^Suggested for/)).toBeNull();
  });

  it("appears in the setup wizard's location step too", async () => {
    await pickLahore();
    setMockSearchParams({ step: "location" });
    await renderWithProviders(<SetupScreen />);
    expect(screen.getByText("Suggested for Pakistan")).toBeTruthy();
  });
});
