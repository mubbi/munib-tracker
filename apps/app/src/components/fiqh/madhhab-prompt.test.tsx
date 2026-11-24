import { act, fireEvent, screen } from "@testing-library/react-native";

import { MadhhabPromptCard, useShowMadhhabPromptCard } from "@/components/fiqh/madhhab-prompt-card";
import { ThemedText } from "@/components/themed-text";
import { resetMadhhabPromptSessionForTests, useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/notifications/scheduler",
  () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock,
);

const madhhab = () => preferencesStore.getState().prefs.madhhab;
const asr = () => locationStore.getState().location.madhab;

/** Mirrors the home gate: mount the card only while it should show. */
function HomeSlot() {
  return useShowMadhhabPromptCard() ? <MadhhabPromptCard /> : null;
}

function FiqhScreen() {
  const prompt = useMadhhabPrompt();
  return (
    <>
      <ThemedText>{prompt.isUnset ? "unset" : "set"}</ThemedText>
      {prompt.sheet}
    </>
  );
}

beforeEach(async () => {
  resetToastMock();
  resetMadhhabPromptSessionForTests();
  await resetSettingsStores();
  // Device Asr back to the default (an earlier test may have accepted the offer).
  await act(async () => locationStore.getState().setMadhab("shafi"));
});

describe("home card (§4.1.1 item 3)", () => {
  it("shows for never-asked users and records all views on dismiss", async () => {
    await renderWithTheme(<HomeSlot />);
    expect(screen.getByText("Choose your madhhab for rulings")).toBeTruthy();
    await fireEvent.press(screen.getByText("Show all views"));
    expect(madhhab()).toBeNull();
    expect(screen.queryByText("Choose your madhhab for rulings")).toBeNull();
  });

  it("is hidden once a school is chosen", async () => {
    await act(async () => preferencesStore.getState().update({ madhhab: "maliki" }));
    await renderWithTheme(<HomeSlot />);
    expect(screen.queryByText("Choose your madhhab for rulings")).toBeNull();
  });

  it("opens the picker, saves the school, toasts, then offers (not applies) the Asr time", async () => {
    await renderWithTheme(<HomeSlot />);
    await fireEvent.press(screen.getByText("Choose madhhab"));
    await fireEvent.press(screen.getByTestId("madhhab-option-hanafi"));
    expect(madhhab()).toBe("hanafi");
    expect(mockToast.success).toHaveBeenCalledWith("Rulings updated across the app");
    // The sheet stays open on the Asr step even though the card's condition flipped.
    expect(screen.getByText("Also use the Hanafi Asr time?")).toBeTruthy();
    expect(asr()).toBe("shafi");
    await fireEvent.press(screen.getByText("Use Hanafi Asr"));
    expect(asr()).toBe("hanafi");
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("keeps the Asr calculation when the offer is declined", async () => {
    await renderWithTheme(<HomeSlot />);
    await fireEvent.press(screen.getByText("Choose madhhab"));
    await fireEvent.press(screen.getByTestId("madhhab-option-hanafi"));
    await fireEvent.press(screen.getByText("Keep current Asr"));
    expect(asr()).toBe("shafi");
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("closes straight away when the school's Asr already matches", async () => {
    await renderWithTheme(<HomeSlot />);
    await fireEvent.press(screen.getByText("Choose madhhab"));
    await fireEvent.press(screen.getByTestId("madhhab-option-shafii"));
    expect(madhhab()).toBe("shafii");
    expect(screen.queryByTestId("sheet")).toBeNull();
  });
});

describe("lazy sheet (§4.1.1 item 4)", () => {
  it("opens once per session on a fiqh screen while unset; closing records all views", async () => {
    await renderWithTheme(<FiqhScreen />);
    expect(screen.getByText("Which madhhab do you follow?")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(madhhab()).toBeNull();
    expect(screen.getByText("set")).toBeTruthy();
  });

  it("does not open again in the same session", async () => {
    const first = await renderWithTheme(<FiqhScreen />);
    first.unmount();
    await act(async () => preferencesStore.getState().update({ madhhab: undefined }));
    await renderWithTheme(<FiqhScreen />);
    expect(screen.queryByText("Which madhhab do you follow?")).toBeNull();
  });

  it("does not open for users who already answered", async () => {
    await act(async () => preferencesStore.getState().update({ madhhab: null }));
    await renderWithTheme(<FiqhScreen />);
    expect(screen.queryByTestId("sheet")).toBeNull();
  });
});
