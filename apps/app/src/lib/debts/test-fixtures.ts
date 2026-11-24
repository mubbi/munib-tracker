import type { DebtsVaultItem } from "@munib-tracker/shared/types";

import type { VaultDoc } from "@/lib/vault";

import type { DebtEntry, VowEntry } from "./debts";

/** Shared fixtures for the debts / wasiyyah tests (not collected as a suite). */
export function makeDebt(overrides: Partial<DebtEntry> = {}): DebtEntry {
  return {
    kind: "debt",
    id: "d1",
    direction: "i_owe",
    counterparty: "Yusuf",
    amount: 100,
    currency: "USD",
    createdOn: "2026-11-01",
    payments: [],
    status: "open",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeVow(overrides: Partial<VowEntry> = {}): VowEntry {
  return {
    kind: "vow",
    id: "v1",
    text: "Fast three days",
    fulfilled: false,
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

export function docOf(...items: Array<DebtEntry | VowEntry>): VaultDoc<DebtsVaultItem> {
  return { v: 1, items: Object.fromEntries(items.map((i) => [i.id, i])) };
}
