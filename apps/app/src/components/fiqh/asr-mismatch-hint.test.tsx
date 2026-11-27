import { act, fireEvent, screen } from "@testing-library/react-native";

import { AsrMismatchHint } from "@/components/fiqh/asr-mismatch-hint";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/notifications/scheduler",
  () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock,
);

const asr = () => locationStore.getState().location.madhab;

beforeEach(async () => {
  resetToastMock();
  await resetSettingsStores();
});

describe("AsrMismatchHint", () => {
  it("stays hidden in all-views mode and when the Asr matches", async () => {
    await act(async () => preferencesStore.getState().update({ madhhab: "hanbali" }));
    const view = await renderWithTheme(<AsrMismatchHint />);
    expect(view.toJSON()).toBeNull();
  });

  it("explains a mismatch neutrally and switches only on tap", async () => {
    await renderWithTheme(<AsrMismatchHint />);
    await act(async () => preferencesStore.getState().update({ madhhab: "hanafi" }));
    expect(
      screen.getByText(
        "Your madhhab is Hanafi, while Asr uses the Standard calculation. That's fine if you follow your masjid's timetable.",
      ),
    ).toBeTruthy();
    expect(asr()).toBe("shafi");
    await fireEvent.press(screen.getByText("Use Hanafi Asr"));
    expect(asr()).toBe("hanafi");
    expect(mockToast.success).toHaveBeenCalledWith("Asr time updated");
  });
});
