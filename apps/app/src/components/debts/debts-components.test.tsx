import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { debtsActions, debtsVault } from "@/lib/debts/debts-store";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithTheme } from "@/test-support/render";

import { DebtDetailBody } from "./debt-detail-body";
import { DebtsScreenBody } from "./debts-screen-body";

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

beforeEach(async () => {
  resetToastMock();
  await resetVaultTestState();
  debtsVault.store.setState({
    isReady: false,
    items: [],
    doc: { v: 1, items: {} },
    status: "idle",
  });
});

describe("DebtsScreenBody", () => {
  it("shows tabs, empty states, the obligations card and the evidence", async () => {
    await renderWithTheme(<DebtsScreenBody />);
    await waitFor(() =>
      expect(screen.getByText("Nothing recorded. Add a loan you need to repay.")).toBeTruthy(),
    );
    expect(screen.getByText("Religious obligations")).toBeTruthy();
    expect(screen.getByText("Write debts down, with witnesses — Qur'an 2:282")).toBeTruthy();
    await fireEvent.press(screen.getByText("Trusts"));
    expect(screen.getByText(/No trusts recorded/)).toBeTruthy();
  });

  it("lists a saved record with its outstanding balance", async () => {
    await debtsVault.actions.put("d1", {
      kind: "debt",
      direction: "i_owe",
      counterparty: "Yusuf",
      amount: 100,
      currency: "USD",
      createdOn: "2026-11-01",
      payments: [{ id: "p", date: "2026-11-02", amount: 40 }],
      status: "open",
    });
    await renderWithTheme(<DebtsScreenBody />);
    await waitFor(() => expect(screen.getByText("Yusuf")).toBeTruthy());
    expect(screen.getByText("$60 left of $100")).toBeTruthy();
  });
});

describe("DebtDetailBody", () => {
  it("validates, then creates a record", async () => {
    await renderWithTheme(<DebtDetailBody id="new" initialDirection="i_owe" />);
    await fireEvent.press(screen.getByText("Save"));
    expect(screen.getByText("Add who this record is with.")).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText("Person or organization"), "Bilal");
    await fireEvent.changeText(screen.getByLabelText("Amount"), "250");
    await fireEvent.press(screen.getByText("Save"));
    await waitFor(() => expect(debtsVault.store.getState().items).toHaveLength(1));
    const [saved] = debtsVault.store.getState().items;
    expect(saved).toMatchObject({
      kind: "debt",
      counterparty: "Bilal",
      amount: 250,
      status: "open",
    });
  });

  it("shows the riba info card when a repayment would exceed the principal", async () => {
    await debtsVault.actions.put("d1", {
      kind: "debt",
      direction: "i_owe",
      counterparty: "Yusuf",
      amount: 100,
      currency: "USD",
      createdOn: "2026-11-01",
      payments: [],
      status: "open",
    });
    await renderWithTheme(<DebtDetailBody id="d1" />);
    await waitFor(() => expect(screen.getByText("Repayments")).toBeTruthy());
    await fireEvent.changeText(screen.getByLabelText("Repayment amount"), "120");
    expect(screen.getByText(/An increase agreed on a loan is riba/)).toBeTruthy();
  });

  it("creates one record on a double tap and stores the day picked from the calendar", async () => {
    await renderWithTheme(<DebtDetailBody id="new" initialDirection="i_owe" />);
    await fireEvent.changeText(screen.getByLabelText("Person or organization"), "Bilal");
    await fireEvent.changeText(screen.getByLabelText("Amount"), "250");
    // The date is chosen from the calendar sheet (no typed YYYY-MM-DD) and stored as the same ISO day.
    await fireEvent.press(screen.getByLabelText(/^Date,/));
    await fireEvent.press(screen.getByLabelText(/ 15, \d{4}/));
    await fireEvent.press(screen.getByText("Save"));
    await fireEvent.press(screen.getByText("Save"));
    await waitFor(() => expect(debtsVault.store.getState().items).toHaveLength(1));
    expect(debtsVault.store.getState().items[0]?.createdOn).toMatch(/^\d{4}-\d{2}-15$/);
  });

  it("picks a due date from the quick presets and stores it as an ISO day", async () => {
    await renderWithTheme(<DebtDetailBody id="new" initialDirection="i_owe" />);
    await fireEvent.changeText(screen.getByLabelText("Person or organization"), "Bilal");
    await fireEvent.changeText(screen.getByLabelText("Amount"), "250");
    await fireEvent.press(screen.getByLabelText(/^Due date \(optional\),/));
    await fireEvent.press(screen.getByText("In 1 week"));
    await fireEvent.press(screen.getByText("Save"));
    await waitFor(() => expect(debtsVault.store.getState().items).toHaveLength(1));
    expect(debtsVault.store.getState().items[0]?.dueOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("explains a missing repayment amount and confirms before removing a repayment", async () => {
    await debtsVault.actions.put("d1", {
      kind: "debt",
      direction: "i_owe",
      counterparty: "Yusuf",
      amount: 100,
      currency: "USD",
      createdOn: "2026-11-01",
      payments: [{ id: "p1", date: "2026-11-02", amount: 40 }],
      status: "open",
    });
    await renderWithTheme(<DebtDetailBody id="d1" />);
    await waitFor(() => expect(screen.getByText("Repayments")).toBeTruthy());
    await fireEvent.press(screen.getByText("Add repayment"));
    expect(screen.getByText("Enter the amount repaid.")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Remove repayment"));
    expect(screen.getByText("Remove this repayment?")).toBeTruthy();
    // Nothing is removed until the person confirms.
    expect(debtsVault.store.getState().items[0]).toMatchObject({ payments: [{ id: "p1" }] });
  });
  it("shows a toast (not an unhandled rejection) when a record change can't be stored", async () => {
    await debtsVault.actions.put("t1", {
      kind: "debt",
      direction: "trust_held",
      counterparty: "Yusuf",
      item: "Watch",
      createdOn: "2026-11-01",
      payments: [],
      status: "open",
    });
    const failing = jest
      .spyOn(debtsActions, "markSettled")
      .mockRejectedValueOnce(new Error("vault-key-unavailable"));
    await renderWithTheme(<DebtDetailBody id="t1" />);
    await waitFor(() => expect(screen.getByText("Mark as returned")).toBeTruthy());
    await fireEvent.press(screen.getByText("Mark as returned"));
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledTimes(1));
    failing.mockRestore();
  });
});
