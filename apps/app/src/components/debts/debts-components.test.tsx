import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { debtsVault } from "@/lib/debts/debts-store";
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
jest.mock("@/lib/quran-companion/reschedule", () => ({ requestReminderReschedule: jest.fn() }));

beforeEach(async () => {
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

    await fireEvent.changeText(screen.getByLabelText("Person or organisation"), "Bilal");
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
});
