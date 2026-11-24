import type { DebtPayment, DebtsVaultItem } from "@munib-tracker/shared/types";

import { mergeVaultDocs, type VaultDoc, type VaultRecord } from "@/lib/vault/doc-merge";

import { deriveStatus } from "./debts";

type Item = VaultRecord<DebtsVaultItem>;
type DebtItem = Extract<Item, { kind: "debt" }>;

function isLiveDebt(item: Item | undefined): item is DebtItem {
  return !!item && !item.deletedAt && item.kind === "debt";
}

/**
 * Domain merge for the `debts` vault document (§4.2 "debts that must sum partial
 * repayments"). Per-item last-write-wins decides every field, except that the
 * payments of a debt both devices still hold are the **union by id** minus any
 * id either side deleted — so two devices each logging a repayment offline keep
 * both. Status is re-derived from the merged payments. Pure and deterministic.
 */
export function mergeDebtsDocs(
  local: VaultDoc<unknown>,
  remote: VaultDoc<unknown>,
): VaultDoc<unknown> {
  const merged = mergeVaultDocs(
    local as VaultDoc<DebtsVaultItem>,
    remote as VaultDoc<DebtsVaultItem>,
  );
  const items: Record<string, Item> = { ...merged.items };

  for (const [id, winner] of Object.entries(merged.items)) {
    if (!isLiveDebt(winner)) continue;
    const ours = (local as VaultDoc<DebtsVaultItem>).items[id];
    const theirs = (remote as VaultDoc<DebtsVaultItem>).items[id];
    if (!isLiveDebt(ours) || !isLiveDebt(theirs)) continue;

    const removed = new Set([
      ...(ours.removedPaymentIds ?? []),
      ...(theirs.removedPaymentIds ?? []),
    ]);
    const byId = new Map<string, DebtPayment>();
    for (const p of [...ours.payments, ...theirs.payments]) {
      if (removed.has(p.id)) continue;
      // Same id on both sides: keep the winner's copy (it may carry an edited note).
      if (!byId.has(p.id) || winner.payments.some((w) => w.id === p.id && w === p))
        byId.set(p.id, p);
    }
    const payments = [...byId.values()].sort(
      (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
    );
    const next: DebtItem = {
      ...winner,
      payments,
      ...(removed.size ? { removedPaymentIds: [...removed].sort() } : {}),
    };
    items[id] = { ...next, status: deriveStatus(next) };
  }
  return { v: 1, items };
}
