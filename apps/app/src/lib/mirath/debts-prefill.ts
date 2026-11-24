import { debtEntries } from "@/lib/debts/debts";
import { debtsVault } from "@/lib/debts/debts-store";
import { openIOweTotal } from "@/lib/wasiyyah/wasiyyah";

/**
 * Estate deductions from the NF-3.8 debts record: the open "I owe" balance in
 * `currency`. Reads the vault only when the user asks (after the vault lock
 * check); returns `null` when the record can't be read (locked / error).
 */
export async function readOpenDebtsTotal(currency: string): Promise<number | null> {
  await debtsVault.actions.load();
  const state = debtsVault.store.getState();
  if (state.status !== "ready") return null;
  return openIOweTotal(debtEntries(state.items), currency);
}
