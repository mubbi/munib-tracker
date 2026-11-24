import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { debtsVault } from "@/lib/debts/debts-store";
import { emptyWasiyyahData } from "@/lib/wasiyyah/wasiyyah";
import { wasiyyahActions, wasiyyahVault } from "@/lib/wasiyyah/wasiyyah-store";
import { resetToastMock } from "@/test-support/mocks/toast-provider";
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
jest.mock("@/lib/notifications/reschedule", () => ({ requestReminderReschedule: jest.fn() }));
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

const idle = {
  isReady: false,
  items: [],
  doc: { v: 1 as const, items: {} },
  status: "idle" as const,
};

beforeEach(async () => {
  resetToastMock();
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

  it("won't save while the testator's date can't be read, and says why", async () => {
    await wasiyyahVault.actions.load();
    await renderWithTheme(
      <WasiyyahWizard
        initialData={{ ...base, testator: { name: "Aminah", date: "2026-13-40" } }}
      />,
    );
    expect(screen.getByText(/Couldn't read this date/)).toBeTruthy();
    await goToReview();
    expect(screen.getByText("Fix the date in “About you” before saving.")).toBeTruthy();
    await fireEvent.press(screen.getByText("Save this version"));
    expect(wasiyyahVault.store.getState().items.some((i) => i.kind === "version")).toBe(false);
  });

  it("requires the testator's name before moving on", async () => {
    await renderWithTheme(
      <WasiyyahWizard initialData={{ ...base, testator: { name: "", date: "2026-11-23" } }} />,
    );
    await fireEvent.press(screen.getByText("Next"));
    expect(screen.getByText("1. About you")).toBeTruthy();
    expect(screen.getByText("Add your name to continue.")).toBeTruthy();
  });

  it("lists every section on the review step and jumps back to edit one", async () => {
    const onStepChange = jest.fn();
    await renderWithTheme(<WasiyyahWizard initialData={base} onStepChange={onStepChange} />);
    await goToReview();
    expect(screen.getByText("Check each section")).toBeTruthy();
    expect(screen.getByText("Aminah")).toBeTruthy();
    expect(screen.getByText("2 of 2 named")).toBeTruthy();
    // "Edit" on the first row (About you) goes straight back to step 1.
    await fireEvent.press(screen.getAllByText("Edit")[0] as never);
    expect(screen.getByText("1. About you")).toBeTruthy();
    expect(onStepChange).toHaveBeenCalled();
  });

  it("keeps the guardians field as typed while storing clean names", async () => {
    await wasiyyahVault.actions.load();
    await renderWithTheme(<WasiyyahWizard initialData={base} />);
    const people = WASIYYAH_STEPS.indexOf("people");
    for (let i = 0; i < people; i += 1) await fireEvent.press(screen.getByText("Next"));
    const field = screen.getByLabelText(/Guardian\(s\) for minor children/);
    await fireEvent.changeText(field, "Ali, ");
    expect(screen.getByLabelText(/Guardian\(s\) for minor children/).props.value).toBe("Ali, ");
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

  it("asks before discarding a draft", async () => {
    await wasiyyahActions.saveDraft({
      ...emptyWasiyyahData("2026-11-23", "USD"),
      testator: { name: "Aminah", date: "2026-11-23" },
    });
    await renderWithTheme(<WasiyyahOverview />);
    await waitFor(() => expect(screen.getByText("Discard draft")).toBeTruthy());
    await fireEvent.press(screen.getByText("Discard draft"));
    expect(screen.getByText("Discard your draft?")).toBeTruthy();
    expect(wasiyyahVault.store.getState().items.some((i) => i.kind === "draft")).toBe(true);
  });
});
