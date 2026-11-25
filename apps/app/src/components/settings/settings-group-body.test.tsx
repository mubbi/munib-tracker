import { act, fireEvent, screen } from "@testing-library/react-native";

import { SettingsGroupBody } from "@/components/settings/settings-group-body";
import { locationStore } from "@/stores/location-store";
import { renderWithTheme } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

beforeEach(resetSettingsStores);

const sunriseStepper = () => screen.queryByLabelText(/^Sunrise, /);

describe("SettingsGroupBody — folded sections (progressive disclosure)", () => {
  it("starts long per-prayer sections folded and opens them from the header", async () => {
    await renderWithTheme(<SettingsGroupBody group="prayer-times" />);
    const header = screen.getByRole("button", { name: "Masjid offsets" });
    expect(header.props.accessibilityState).toEqual(expect.objectContaining({ expanded: false }));
    expect(sunriseStepper()).toBeNull();
    await fireEvent.press(header);
    expect(sunriseStepper()).toBeTruthy();
  });

  it("says how many folded settings are customized", async () => {
    await act(() => locationStore.getState().setPrayerAdjustment("fajr", 4));
    await renderWithTheme(<SettingsGroupBody group="prayer-times" />);
    expect(screen.getByText("1 customized")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Masjid offsets, 1 customized" })).toBeTruthy();
  });

  it("opens a folded section when a deep link / search result targets one of its rows", async () => {
    await renderWithTheme(
      <SettingsGroupBody group="prayer-times" focusId="prayer-times.offset.sunrise" />,
    );
    expect(sunriseStepper()).toBeTruthy();
  });

  it("leaves other sections open", async () => {
    await renderWithTheme(<SettingsGroupBody group="prayer-times" />);
    expect(screen.queryByRole("button", { name: "Salah time calculation" })).toBeNull();
    expect(screen.getByText("Calculation method")).toBeTruthy();
  });
});
