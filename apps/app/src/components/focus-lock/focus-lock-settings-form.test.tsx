import { act, fireEvent, screen } from "@testing-library/react-native";

import i18n from "@/i18n";
import { preferencesStore } from "@/stores/preferences-store";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

import { FocusLockSettingsForm } from "./focus-lock-settings-form";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

const t = i18n.t.bind(i18n);

beforeEach(async () => {
  await resetSettingsStores();
});

describe("FocusLockSettingsForm", () => {
  it("shows the six Salah windows as one chip group and toggles a window off", async () => {
    await renderWithProviders(<FocusLockSettingsForm iqamahAvailable={false} />);
    const fajr = screen.getByRole("checkbox", { name: t("prayers.fajr") });
    expect(fajr.props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByRole("checkbox", { name: t("focusLock.jumuah") })).toBeTruthy();

    await act(async () => {
      fireEvent.press(fajr);
    });
    expect(preferencesStore.getState().prefs.focusLock?.prayers).not.toContain("fajr");
  });

  it("read-only (TV): chips can't change the plan", async () => {
    await renderWithProviders(<FocusLockSettingsForm iqamahAvailable={false} readOnly />);
    expect(
      screen.getByRole("checkbox", { name: t("prayers.isha") }).props.accessibilityState,
    ).toMatchObject({ disabled: true });
  });
});
