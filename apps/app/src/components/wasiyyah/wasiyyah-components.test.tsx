import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { debtsVault } from "@/lib/debts/debts-store";
import { emptyWasiyyahData } from "@/lib/wasiyyah/wasiyyah";
import { wasiyyahVault } from "@/lib/wasiyyah/wasiyyah-store";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithTheme } from "@/test-support/render";

import { WasiyyahOverview } from "./wasiyyah-overview";
import { WASIYYAH_STEPS, WasiyyahWizard } from "./wasiyyah-wizard";

jest.mock("expo-audio", () => ({ __esModule: true }));
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock("@/lib/quran-companion/reschedule", () => ({ requestReminderReschedule: jest.fn() }));

const idle = {
  isReady: false,
  items: [],
  doc: { v: 1 as const, items: {} },
  status: "idle" as const,
};

beforeEach(async () => {
  await resetVaultTestState();
  debtsVault.store.setState(idle);
  wasiyyahVault.store.setState(idle);
});

async function goToReview() {
  for (let i = 1; i < WASIYYAH_STEPS.length; i += 1) {
    await fireEvent.press(screen.getByText("Next"));
  }
}

describe("WasiyyahWizard", () => {
  const base = {
    ...emptyWasiyyahData("2026-11-23", "USD"),
    testator: { name: "Aminah", date: "2026-11-23" },
    witnesses: ["Ali", "Umar"] as [string, string],
  };

  it("blocks saving a bequest to an heir until it is acknowledged", async () => {
    await renderWithTheme(
      <WasiyyahWizard
        initialData={{
          ...base,
          bequests: [
            { id: "b", beneficiary: "Zayd", kind: "person", isHeir: true, heirType: "son" },
          ],
        }}
      />,
    );
    await goToReview();
    expect(screen.getByText(/Zayd is marked as an heir/)).toBeTruthy();
    expect(screen.getByText("Resolve the highlighted points before saving.")).toBeTruthy();
  });

  it("blocks bequests above one-third (majority-view explanation)", async () => {
    await renderWithTheme(
      <WasiyyahWizard
        initialData={{
          ...base,
          estimatedEstate: 900,
          bequests: [
            { id: "b", beneficiary: "Masjid", kind: "charity", isHeir: false, amount: 400 },
          ],
        }}
      />,
    );
    await goToReview();
    expect(
      screen.getByText(/The excess needs the heirs' consent after death \(majority view\)/),
    ).toBeTruthy();
  });

  it("saves a valid will as a version", async () => {
    await wasiyyahVault.actions.load();
    await renderWithTheme(<WasiyyahWizard initialData={base} />);
    await goToReview();
    await fireEvent.press(screen.getByText("Save this version"));
    await waitFor(() =>
      expect(wasiyyahVault.store.getState().items.some((i) => i.kind === "version")).toBe(true),
    );
  });

  it("requires the testator's name before moving on", async () => {
    await renderWithTheme(
      <WasiyyahWizard initialData={{ ...base, testator: { name: "", date: "2026-11-23" } }} />,
    );
    await fireEvent.press(screen.getByText("Next"));
    expect(screen.getByText("1. About you")).toBeTruthy();
  });
});

describe("WasiyyahOverview", () => {
  it("invites the user to start and shows the legal disclaimer and evidence", async () => {
    await renderWithTheme(<WasiyyahOverview />);
    await waitFor(() =>
      expect(screen.getByText("You haven't written your wasiyyah yet.")).toBeTruthy(),
    );
    expect(screen.getByText(/Not legally binding in many jurisdictions/)).toBeTruthy();
    expect(screen.getByText(/Sahih al-Bukhari 2742/)).toBeTruthy();
  });
});
