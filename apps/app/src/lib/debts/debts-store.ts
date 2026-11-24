import type { DebtPayment, DebtRecord, DebtsVaultItem } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { createId } from "@/db/id";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { createVaultStore } from "@/lib/vault";
import { wasiyyahActions } from "@/lib/wasiyyah/wasiyyah-store";

import { type DebtPhotoMime, deleteDebtPhoto, storeDebtPhoto } from "./debt-photo";
import {
  addPayment,
  type DebtEntry,
  debtEntries,
  forgiveDebt,
  markSettled,
  normalizeDebt,
  removePayment,
  reopenDebt,
  vowEntries,
} from "./debts";
import { mergeDebtsDocs } from "./merge";

/**
 * Debts & trusts vault document (`debts`, D2): one item per record and per vow,
 * merged with {@link mergeDebtsDocs} so offline repayments on two devices add up.
 */
export const debtsVault = createVaultStore<DebtsVaultItem>("debts", { merge: mergeDebtsDocs });

export type DebtInput = Omit<DebtRecord, "id" | "updatedAt" | "deletedAt">;

export function useDebts() {
  debtsVault.useEnsureLoaded();
  const items = debtsVault.useItems();
  const { status, error } = debtsVault.useStatus();
  return useMemo(
    () => ({ debts: debtEntries(items), vows: vowEntries(items), status, error }),
    [items, status, error],
  );
}

export function useDebt(id: string | undefined): DebtEntry | undefined {
  const item = debtsVault.useItem(id ?? "");
  return item?.kind === "debt" ? (item as DebtEntry) : undefined;
}

function getDebt(id: string): DebtEntry | undefined {
  const item = debtsVault.store.getState().doc.items[id];
  return item && !item.deletedAt && item.kind === "debt" ? (item as DebtEntry) : undefined;
}

/** Reminders (due dates) and the wasiyyah review nudge follow every debts change. */
async function afterDebtsChange(): Promise<void> {
  requestReminderReschedule();
  await wasiyyahActions
    .noteDebtsChange(debtEntries(debtsVault.store.getState().items))
    .then((noticed) => {
      if (noticed) requestReminderReschedule();
    })
    .catch(() => {
      // Wasiyyah vault locked / unavailable — the next debts change retries.
    });
}

async function putDebt(id: string, record: DebtInput): Promise<void> {
  const {
    id: _id,
    updatedAt: _u,
    deletedAt: _d,
    ...rest
  } = record as DebtInput & Partial<Pick<DebtRecord, "id" | "updatedAt" | "deletedAt">>;
  await debtsVault.actions.put(id, { kind: "debt", ...normalizeDebt(rest) });
  await afterDebtsChange();
}

async function updateDebt(id: string, change: (record: DebtEntry) => DebtEntry): Promise<void> {
  const current = getDebt(id);
  if (!current) return;
  const { kind: _kind, ...next } = change(current);
  await putDebt(id, next);
}

export const debtsActions = {
  /** Creates (no `id`) or replaces a record; returns its id. */
  async saveDebt(input: DebtInput, id?: string): Promise<string> {
    const recordId = id ?? createId("debt");
    await putDebt(recordId, input);
    return recordId;
  },

  async deleteDebt(id: string): Promise<void> {
    const photo = getDebt(id)?.documentUri;
    await debtsVault.actions.remove(id);
    await deleteDebtPhoto(photo);
    await afterDebtsChange();
  },

  /**
   * Attaches (or replaces) the document photo: encrypted on this device only,
   * the record keeps just the reference (NF-3.8).
   */
  async setDocumentPhoto(id: string, bytes: Uint8Array, mimeType: DebtPhotoMime): Promise<void> {
    const current = getDebt(id);
    if (!current) return;
    const ref = await storeDebtPhoto(createId("dphoto"), bytes, mimeType);
    await updateDebt(id, (r) => ({ ...r, documentUri: ref }));
    if (current.documentUri && current.documentUri !== ref)
      await deleteDebtPhoto(current.documentUri);
  },

  async removeDocumentPhoto(id: string): Promise<void> {
    const current = getDebt(id);
    if (!current?.documentUri) return;
    await updateDebt(id, (r) => {
      const { documentUri: _drop, ...rest } = r;
      return rest as DebtEntry;
    });
    await deleteDebtPhoto(current.documentUri);
  },

  async addPayment(id: string, payment: Omit<DebtPayment, "id">): Promise<void> {
    await updateDebt(id, (r) => addPayment(r, { ...payment, id: createId("pay") }));
  },

  async removePayment(id: string, paymentId: string): Promise<void> {
    await updateDebt(id, (r) => removePayment(r, paymentId));
  },

  async forgive(id: string, today = getLocalDateString()): Promise<void> {
    await updateDebt(id, (r) => forgiveDebt(r, today));
  },

  async reopen(id: string): Promise<void> {
    await updateDebt(id, (r) => reopenDebt(r));
  },

  async markSettled(id: string): Promise<void> {
    await updateDebt(id, (r) => markSettled(r));
  },

  async addVow(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;
    await debtsVault.actions.put(createId("vow"), { kind: "vow", text: trimmed, fulfilled: false });
  },

  async setVowFulfilled(id: string, fulfilled: boolean): Promise<void> {
    const item = debtsVault.store.getState().doc.items[id];
    if (!item || item.deletedAt || item.kind !== "vow") return;
    await debtsVault.actions.put(id, { kind: "vow", text: item.text, fulfilled });
  },

  async deleteVow(id: string): Promise<void> {
    await debtsVault.actions.remove(id);
  },
};
