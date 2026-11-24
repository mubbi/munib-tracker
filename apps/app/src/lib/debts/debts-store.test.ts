import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { vaultDocMerge } from "@/lib/vault/vault-docs";
import { emptyWasiyyahData } from "@/lib/wasiyyah/wasiyyah";
import { wasiyyahActions, wasiyyahVault } from "@/lib/wasiyyah/wasiyyah-store";
import { resetVaultTestState } from "@/test-support/mocks/vault";

import { debtEntries } from "./debts";
import { debtsActions, debtsVault } from "./debts-store";
import { mergeDebtsDocs } from "./merge";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
const mockReschedule = jest.fn();
jest.mock("@/lib/quran-companion/reschedule", () => ({
  requestReminderReschedule: () => mockReschedule(),
}));

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
  mockReschedule.mockClear();
});

describe("debts vault store", () => {
  it("registers the repayment-summing merge", () => {
    expect(vaultDocMerge("debts")).toBe(mergeDebtsDocs);
  });

  it("saves encrypted, settles on full repayment and reschedules reminders", async () => {
    await debtsVault.actions.load();
    const id = await debtsActions.saveDebt({
      direction: "i_owe",
      counterparty: "Bilal Secret",
      amount: 200,
      currency: "USD",
      createdOn: "2026-11-01",
      dueOn: "2026-12-01",
      payments: [],
      status: "open",
    });
    await debtsActions.addPayment(id, { amount: 200, date: "2026-11-20" });
    const [debt] = debtEntries(debtsVault.store.getState().items);
    expect(debt).toMatchObject({ counterparty: "Bilal Secret", status: "settled" });
    expect(JSON.stringify(await readJSON(DB_KEYS.vaultDebts, null))).not.toContain("Bilal");
    expect(mockReschedule).toHaveBeenCalled();
  });

  it("keeps vows in the same document", async () => {
    await debtsVault.actions.load();
    await debtsActions.addVow("  Feed ten people ");
    const vow = debtsVault.store.getState().items.find((i) => i.kind === "vow");
    expect(vow).toMatchObject({ text: "Feed ten people", fulfilled: false });
    await debtsActions.setVowFulfilled(vow?.id ?? "", true);
    expect(debtsVault.store.getState().items.find((i) => i.kind === "vow")).toMatchObject({
      fulfilled: true,
    });
  });

  it("flags the wasiyyah for review when open debts move by more than 20%", async () => {
    await debtsVault.actions.load();
    await wasiyyahVault.actions.load();
    await wasiyyahActions.saveVersion(
      { ...emptyWasiyyahData("2026-11-01", "USD"), testator: { name: "A", date: "2026-11-01" } },
      [],
    );
    await debtsActions.saveDebt({
      direction: "i_owe",
      counterparty: "Yusuf",
      amount: 50,
      currency: "USD",
      createdOn: "2026-11-02",
      payments: [],
      status: "open",
    });
    const settings = wasiyyahVault.store.getState().items.find((i) => i.kind === "settings");
    expect(settings?.kind === "settings" && settings.debtsChangeNoticedOn).toBeTruthy();
  });

  it("reschedules the wasiyyah review reminder after a save and an interval change (NF-3.9)", async () => {
    await wasiyyahVault.actions.load();
    await wasiyyahActions.saveVersion(
      { ...emptyWasiyyahData("2026-11-01", "USD"), testator: { name: "A", date: "2026-11-01" } },
      [],
    );
    expect(mockReschedule).toHaveBeenCalledTimes(1);
    mockReschedule.mockClear();
    await wasiyyahActions.setReviewInterval(6);
    expect(mockReschedule).toHaveBeenCalledTimes(1);
    mockReschedule.mockClear();
    await wasiyyahActions.markReviewed([]);
    expect(mockReschedule).toHaveBeenCalledTimes(1);
  });
});
