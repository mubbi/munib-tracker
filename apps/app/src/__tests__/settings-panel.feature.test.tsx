import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ComponentType } from "react";

import SettingsHub from "@/app/(tabs)/settings";
import QuranSettingsScreen from "@/app/settings/quran";
import { LEGACY_SETTINGS_REDIRECTS, settingHref } from "@/lib/settings/routes";
import { preferencesStore } from "@/stores/preferences-store";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

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

beforeEach(async () => {
  resetExpoRouterMock();
  await resetSettingsStores();
});
afterEach(resetMockWindowSize);

/** Route file of every old settings path (§4.5.6). */
const LEGACY_ROUTE_MODULES: Record<keyof typeof LEGACY_SETTINGS_REDIRECTS, () => ComponentType> = {
  "/settings/time-format": () => require("@/app/settings/time-format").default,
  "/settings/default-calendar": () => require("@/app/settings/default-calendar").default,
  "/settings/weather": () => require("@/app/settings/weather").default,
  "/settings/bedtime": () => require("@/app/settings/bedtime").default,
  "/settings/reminder-offsets": () => require("@/app/settings/reminder-offsets").default,
  "/settings/prayer-tuning": () => require("@/app/settings/prayer-tuning").default,
  "/location": () => require("@/app/location/index").default,
};

describe("old settings routes", () => {
  it.each(Object.entries(LEGACY_ROUTE_MODULES))(
    "%s redirects into its group",
    async (path, load) => {
      const Screen = load();
      await renderWithProviders(<Screen />);
      const target = settingHref(
        LEGACY_SETTINGS_REDIRECTS[path as keyof typeof LEGACY_ROUTE_MODULES],
      );
      expect(screen.getByText(`redirect:${target}`)).toBeTruthy();
      expect(target).toMatch(/^\/settings\/[a-z-]+\?focus=/);
    },
  );
});

describe("settings hub", () => {
  it("shows search, the five clusters and group rows with summaries", async () => {
    await renderWithProviders(<SettingsHub />);
    expect(screen.getByLabelText("Search settings")).toBeTruthy();
    for (const cluster of [
      "Daily worship",
      "Reading & listening",
      "Personalize",
      "Privacy & data",
      "Help",
    ]) {
      // "Personalize" is also the hub eyebrow, so allow more than one match.
      expect(screen.getAllByText(cluster).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("Reminders & notifications")).toBeTruthy();
    // Group rows carry a value summary, e.g. the calculation method.
    expect(screen.getByText(/Muslim World League/)).toBeTruthy();
  });

  it("opens a group screen from its row (phones)", async () => {
    await renderWithProviders(<SettingsHub />);
    await fireEvent.press(screen.getByText("Text & fonts"));
    expect(mockRouter.push).toHaveBeenCalledWith("/settings/fonts");
  });

  it("shows 'Finish setting up' while location is the default and reminders are off", async () => {
    await renderWithProviders(<SettingsHub />);
    expect(screen.getByText("Finish setting up")).toBeTruthy();
    await fireEvent.press(screen.getByText("Turn on reminders"));
    expect(mockRouter.push).toHaveBeenCalledWith(settingHref("notifications.master"));
  });

  it("searches settings and toggles a switch straight from a result", async () => {
    // The Friday reminder is gated on the notifications master switch; a disabled
    // row no longer toggles (the whole row is the switch now — D-15).
    await act(async () => {
      const { prefs } = preferencesStore.getState();
      preferencesStore.setState({
        prefs: {
          ...prefs,
          notificationPrefs: { ...prefs.notificationPrefs, masterEnabled: true },
        },
      });
    });
    await renderWithProviders(<SettingsHub />);
    await fireEvent.changeText(screen.getByLabelText("Search settings"), "Friday reminder");
    await waitFor(() => expect(screen.getByText("Friday reminder")).toBeTruthy());
    expect(preferencesStore.getState().prefs.notificationPrefs.friday).toBe(false);
    await act(async () => {
      // D-15: the whole row is the switch — pressing it (label included) toggles.
      fireEvent.press(screen.getByRole("switch", { name: "Friday reminder" }));
    });
    await waitFor(() =>
      expect(preferencesStore.getState().prefs.notificationPrefs.friday).toBe(true),
    );
  });

  it("is list–detail on wide windows (D-UX11): the hub shows the first group, picking one opens its route", async () => {
    setMockWindowSize(1280);
    await renderWithProviders(<SettingsHub />);
    // Detail pane: the first group (Salah times) beside the list.
    expect(screen.getAllByText("Salah times & location").length).toBeGreaterThan(1);
    await fireEvent.press(screen.getByText("Language & region"));
    // The selection is the route — exactly the phone's push.
    expect(mockRouter.push).toHaveBeenCalledWith("/settings/language");
  });

  it("a group route on a wide window keeps the list beside the selected group", async () => {
    setMockWindowSize(1280);
    const LanguageSettings = require("@/app/settings/language").default as ComponentType;
    await renderWithProviders(<LanguageSettings />);
    // List pane (every group) + detail pane (Language & region's sections).
    expect(screen.getByText("Appearance & home")).toBeTruthy();
    expect(screen.getByText("Region & format")).toBeTruthy();
    const row = screen.getByRole("button", { name: /^Language & region/ });
    expect(row.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    // Another group swaps the route in place, so Back still leaves Settings as on a phone.
    await fireEvent.press(screen.getByText("Appearance & home"));
    expect(mockRouter.replace).toHaveBeenCalledWith("/settings/appearance");
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("a wide-window ?focus= deep link lands on the row in the detail pane", async () => {
    setMockWindowSize(1280);
    setMockSearchParams({ focus: "quran.recitation.reciter" });
    await renderWithProviders(<QuranSettingsScreen />);
    expect(screen.getByText("Reciter")).toBeTruthy();
    expect(screen.getByText("Appearance & home")).toBeTruthy();
  });
});

describe("a group screen", () => {
  it("renders its sections and rows from the registry", async () => {
    await renderWithProviders(<QuranSettingsScreen />);
    expect(screen.getByText("Reading")).toBeTruthy();
    expect(screen.getByText("Recitation")).toBeTruthy();
    expect(screen.getByText("Reader layout")).toBeTruthy();
    expect(screen.getByText("Practice settings")).toBeTruthy();
  });

  it("writes through the row control", async () => {
    await renderWithProviders(<QuranSettingsScreen />);
    // First "Mushaf" is the reader layout row (the practice view row repeats the label).
    await fireEvent.press(screen.getAllByText("Mushaf")[0]);
    const { quranStore } = await import("@/stores/quran-store");
    await waitFor(() => expect(quranStore.getState().prefs.readerLayout).toBe("mushaf"));
  });

  it("accepts a ?focus= deep link", async () => {
    setMockSearchParams({ focus: "quran.recitation.reciter" });
    await renderWithProviders(<QuranSettingsScreen />);
    expect(screen.getByText("Reciter")).toBeTruthy();
  });
});
