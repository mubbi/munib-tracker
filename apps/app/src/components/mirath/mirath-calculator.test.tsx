import { fireEvent, screen } from "@testing-library/react-native";

import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithTheme } from "@/test-support/render";

import { MirathCalculator } from "./mirath-calculator";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock(
  "@/lib/quran-companion/reschedule",
  () => require("@/test-support/mocks/reminder-reschedule").reminderRescheduleMock,
);
// The PIN provider is app-level; the debts prefill only needs the unlock hook.
jest.mock("@/components/vault", () => ({
  useRequireVaultUnlock: () => ({ requireVaultUnlock: async () => true, unlockPrompt: null }),
}));

beforeEach(async () => {
  await resetVaultTestState();
});

describe("MirathCalculator", () => {
  it("shows the scholar disclaimer and the out-of-scope list up front", async () => {
    await renderWithTheme(<MirathCalculator />);
    expect(screen.getByText(/confirm with a qualified scholar/i)).toBeTruthy();
    expect(screen.getByText("Not covered — consult a scholar")).toBeTruthy();
  });

  it("walks the wizard and shows the four-school comparison in all-views mode", async () => {
    await renderWithTheme(<MirathCalculator />);
    // deceased → spouse
    await fireEvent.press(screen.getByText("Next"));
    expect(screen.getByText("Spouse")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(/increase.*Wife/i));
    // spouse → children → (son's children) → parents …
    await fireEvent.press(screen.getByText("Next"));
    await fireEvent.press(screen.getByLabelText(/increase.*^Son$|increase Son/i));
    for (let i = 0; i < 8 && !screen.queryByText("Before the results"); i += 1) {
      await fireEvent.press(screen.getByText("Next"));
    }
    expect(screen.getByText("Before the results")).toBeTruthy();
    await fireEvent(screen.getByLabelText("I have counted only these heirs"), "valueChange", true);
    await fireEvent.press(screen.getByText("Show shares"));
    expect(screen.getByText("The four schools side by side")).toBeTruthy();
    expect(screen.getAllByText("1/8").length).toBeGreaterThan(0);
    expect(screen.getAllByText("7/8").length).toBeGreaterThan(0);
  });
});
