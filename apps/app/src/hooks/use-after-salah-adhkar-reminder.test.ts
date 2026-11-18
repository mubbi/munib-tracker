import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";

import { useAfterSalahAdhkarReminder } from "./use-after-salah-adhkar-reminder";

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

async function setup() {
  const { result } = await renderHook(() => useAfterSalahAdhkarReminder());
  return result.current;
}

beforeEach(resetToastMock);

describe("useAfterSalahAdhkarReminder", () => {
  it("reminds about adhkar when an obligatory Salah is completed", async () => {
    (await setup())("maghrib", "pending", "completed");
    expect(mockToast.info).toHaveBeenCalledWith(
      i18n.t("tracker.afterSalahAdhkarReminderTitle", { prayer: i18n.t("prayers.maghrib") }),
      i18n.t("tracker.afterSalahAdhkarReminderBody"),
    );
  });

  it.each([
    ["an already-completed Salah", "maghrib", "completed", "completed"],
    ["a Salah that is not completed", "maghrib", "pending", "missed"],
    ["a non-obligatory prayer", "tahajjud", "pending", "completed"],
  ] as const)("stays quiet for %s", async (_label, prayer, previous, next) => {
    (await setup())(prayer, previous, next);
    expect(mockToast.info).not.toHaveBeenCalled();
  });
});
