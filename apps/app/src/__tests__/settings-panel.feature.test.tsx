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
      "Personalise",
      "Privacy & data",
      "Help",
    ]) {
      expect(screen.getByText(cluster)).toBeTruthy();
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
    await renderWithProviders(<SettingsHub />);
    await fireEvent.changeText(screen.getByLabelText("Search settings"), "Friday reminder");
    await waitFor(() => expect(screen.getByText("Friday reminder")).toBeTruthy());
    expect(preferencesStore.getState().prefs.notificationPrefs.friday).toBe(false);
    await act(async () => {
      fireEvent(screen.getByRole("switch", { name: "Friday reminder" }), "valueChange", true);
    });
    await waitFor(() =>
      expect(preferencesStore.getState().prefs.notificationPrefs.friday).toBe(true),
    );
  });

  it("is master–detail on wide windows: picking a group fills the detail pane", async () => {
    setMockWindowSize(1280);
    await renderWithProviders(<SettingsHub />);
    await fireEvent.press(screen.getByText("Language & region"));
    expect(mockRouter.push).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText("Region & format")).toBeTruthy());
    expect(screen.getAllByText("Time format").length).toBeGreaterThan(0);
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
