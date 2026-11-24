import type { DebtsVaultItem } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { mergeDebtsDocs } from "@/lib/debts/merge";
import { docOf, makeDebt } from "@/lib/debts/test-fixtures";
import { mergeRelativesDocs } from "@/lib/family-ties/merge";
import { applyRemoteBlob } from "@/sync/blob-sync";
import { resetVaultTestState, TEST_PASSPHRASE } from "@/test-support/mocks/vault";

import type { VaultEnvelope } from "./types";
import { setUpVaultSync, vault } from "./vault";
import { vaultDocMerge } from "./vault-docs";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

const T0 = "2026-11-20T00:00:00.000Z";
const T1 = "2026-11-21T00:00:00.000Z";
const T2 = "2026-11-22T00:00:00.000Z";
const pay = (id: string, amount: number) => ({ id, amount, date: "2026-11-21" });

// The feature stores must never be needed for a correct merge: importing them
// here would fail the suite.
jest.mock("@/lib/debts/debts-store", () => {
  throw new Error("debts-store must not be imported by the sync path");
});
jest.mock("@/lib/family-ties/family-ties-store", () => {
  throw new Error("family-ties-store must not be imported by the sync path");
});

beforeEach(resetVaultTestState);

describe("eager vault domain merges", () => {
  it("registers the debts and relatives merges without importing their stores", () => {
    expect(vaultDocMerge("debts")).toBe(mergeDebtsDocs);
    expect(vaultDocMerge("relatives")).toBe(mergeRelativesDocs);
  });

  it("keeps both offline repayments when a sync runs before the debts store is imported", async () => {
    const base = makeDebt({ amount: 100, updatedAt: T0 });
    await vault.write("debts", docOf(base), T0);
    await setUpVaultSync(TEST_PASSPHRASE, T0);

    // Device B logged a 40 repayment offline (later edit).
    await vault.write<DebtsVaultItem>(
      "debts",
      docOf({ ...base, payments: [pay("b", 40)], updatedAt: T2 }),
      T2,
    );
    const remote = await readJSON<VaultEnvelope | null>(DB_KEYS.vaultDebts, null);

    // This device logged a 60 repayment offline.
    await vault.write<DebtsVaultItem>(
      "debts",
      docOf({ ...base, payments: [pay("a", 60)], updatedAt: T1 }),
      T1,
    );
    expect(await applyRemoteBlob("vault_debts", { value: remote }, T2)).toBe(true);

    const debt = (await vault.read<DebtsVaultItem>("debts")).items[base.id];
    expect(debt?.kind === "debt" && debt.payments.map((p) => p.id).sort()).toEqual(["a", "b"]);
    expect(debt?.kind === "debt" && debt.status).toBe("settled");
  });
});
