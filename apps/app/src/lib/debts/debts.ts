import type {
  DebtDirection,
  DebtPayment,
  DebtRecord,
  DebtStatus,
  DebtsVaultItem,
  VowRecord,
} from "@munib-tracker/shared/types";
import { addDays, diffInDays } from "@munib-tracker/shared/utils";

import type { VaultRecord } from "@/lib/vault";

/**
 * Pure rules for the debts & trusts record (NF-3.8). The UI and the reminder
 * builder only call these; storage is the encrypted vault doc `debts`.
 */

export type DebtTab = "i_owe" | "owed_to_me" | "trusts";

export const DEBT_TABS: readonly DebtTab[] = ["i_owe", "owed_to_me", "trusts"];

/** Money is kept to 2 decimal places so float sums never leave a 0.0000001 balance. */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function isLoan(direction: DebtDirection): boolean {
  return direction === "i_owe" || direction === "owed_to_me";
}

export function tabForDirection(direction: DebtDirection): DebtTab {
  return direction === "i_owe" || direction === "owed_to_me" ? direction : "trusts";
}

export function paidTotal(record: Pick<DebtRecord, "payments">): number {
  return roundMoney(record.payments.reduce((sum, p) => sum + Math.max(0, p.amount), 0));
}

/** `amount − Σ payments`, never below 0. `null` when there is no principal (non-cash trust). */
export function outstanding(record: Pick<DebtRecord, "amount" | "payments">): number | null {
  if (record.amount == null || !Number.isFinite(record.amount)) return null;
  return Math.max(0, roundMoney(record.amount - paidTotal(record)));
}

/**
 * Status after a change: forgiven stays forgiven; otherwise a record with a
 * principal moves to `settled` when outstanding ≤ 0 (and back to `open` if a
 * payment is removed). Trusts without an amount keep the status the user set.
 */
export function deriveStatus(
  record: Pick<DebtRecord, "amount" | "payments" | "status">,
): DebtStatus {
  if (record.status === "forgiven") return "forgiven";
  const left = outstanding(record);
  if (left == null) return record.status;
  return left <= 0 && (record.amount ?? 0) > 0 ? "settled" : "open";
}

/** Normalises a record before it's written (trims, drops blanks, re-derives status). */
export function normalizeDebt<T extends Omit<DebtRecord, "id" | "updatedAt" | "deletedAt">>(
  record: T,
): T {
  const witnesses = (record.witnesses ?? []).map((w) => w.trim()).filter(Boolean);
  const amount =
    record.amount != null && Number.isFinite(record.amount) && record.amount > 0
      ? roundMoney(record.amount)
      : undefined;
  const next: T = {
    ...record,
    counterparty: record.counterparty.trim(),
    amount,
    currency: amount != null ? record.currency?.trim().toUpperCase() || undefined : record.currency,
    item: record.item?.trim() || undefined,
    notes: record.notes?.trim() || undefined,
    witnesses: witnesses.length ? witnesses : undefined,
    payments: record.payments
      .filter((p) => Number.isFinite(p.amount) && p.amount > 0)
      .map((p) => ({ ...p, amount: roundMoney(p.amount), note: p.note?.trim() || undefined })),
  };
  return { ...next, status: deriveStatus(next) };
}

export function addPayment<T extends Pick<DebtRecord, "amount" | "payments" | "status">>(
  record: T,
  payment: DebtPayment,
): T {
  if (!Number.isFinite(payment.amount) || payment.amount <= 0) return record;
  const next = {
    ...record,
    payments: [...record.payments, { ...payment, amount: roundMoney(payment.amount) }],
  };
  return { ...next, status: deriveStatus(next) };
}

export function removePayment<
  T extends Pick<DebtRecord, "amount" | "payments" | "status" | "removedPaymentIds">,
>(record: T, paymentId: string): T {
  const next = {
    ...record,
    payments: record.payments.filter((p) => p.id !== paymentId),
    removedPaymentIds: [...new Set([...(record.removedPaymentIds ?? []), paymentId])],
  };
  return { ...next, status: deriveStatus(next) };
}

/** "I forgive this debt" — a sadaqah (Qur'an 2:280). Only for money owed to me. */
export function forgiveDebt<T extends Pick<DebtRecord, "direction" | "status" | "forgivenOn">>(
  record: T,
  today: string,
): T {
  if (record.direction !== "owed_to_me") return record;
  return { ...record, status: "forgiven", forgivenOn: today };
}

/** Undo forgive / reopen a settled trust. */
export function reopenDebt<
  T extends Pick<DebtRecord, "amount" | "payments" | "status" | "forgivenOn">,
>(record: T): T {
  const next = { ...record, status: "open" as DebtStatus, forgivenOn: undefined };
  return { ...next, status: deriveStatus(next) };
}

/** Marks a trust (or principal-less record) returned / settled by hand. */
export function markSettled<T extends Pick<DebtRecord, "status">>(record: T): T {
  return { ...record, status: "settled" };
}

/**
 * Riba guard (NF-3.8): a total repayment above the principal on a loan is an
 * increase on a loan. Returns the excess (> 0) so the UI can show an
 * informational card; never blocks. `repayTotal` defaults to paid-so-far + `nextPayment`.
 */
export function ribaExcess(
  record: Pick<DebtRecord, "direction" | "amount" | "payments">,
  nextPayment = 0,
): number {
  if (!isLoan(record.direction) || record.amount == null || record.amount <= 0) return 0;
  const total = roundMoney(paidTotal(record) + Math.max(0, nextPayment));
  return Math.max(0, roundMoney(total - record.amount));
}

// ── Collections ─────────────────────────────────────────────────────────────

export type DebtItem = VaultRecord<DebtsVaultItem>;
export type DebtEntry = VaultRecord<Extract<DebtsVaultItem, { kind: "debt" }>>;
export type VowEntry = VaultRecord<Extract<DebtsVaultItem, { kind: "vow" }>>;

export function debtEntries(items: readonly DebtItem[]): DebtEntry[] {
  return items.filter((i): i is DebtEntry => i.kind === "debt");
}

export function vowEntries(items: readonly DebtItem[]): VowEntry[] {
  return items.filter((i): i is VowEntry => i.kind === "vow");
}

/** As the plan's `DebtRecord` (id + updatedAt from the vault item). */
export function toDebtRecord(entry: DebtEntry): DebtRecord {
  const { kind: _kind, ...rest } = entry;
  return rest;
}

export function toVowRecord(entry: VowEntry): VowRecord {
  const { kind: _kind, ...rest } = entry;
  return rest;
}

/**
 * Records for one tab: open first (soonest due first, undated after), then
 * settled / forgiven, most recently edited first.
 */
export function debtsForTab<
  T extends Pick<DebtRecord, "direction" | "status" | "dueOn" | "updatedAt">,
>(records: readonly T[], tab: DebtTab): T[] {
  return records
    .filter((r) => tabForDirection(r.direction) === tab)
    .sort((a, b) => {
      const aOpen = a.status === "open" ? 0 : 1;
      const bOpen = b.status === "open" ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      if (aOpen === 0) {
        const ad = a.dueOn ?? "9999-12-31";
        const bd = b.dueOn ?? "9999-12-31";
        if (ad !== bd) return ad.localeCompare(bd);
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

/** Outstanding totals of open records per currency (records without an amount are skipped). */
export function outstandingByCurrency(
  records: readonly Pick<DebtRecord, "direction" | "status" | "amount" | "currency" | "payments">[],
  direction: DebtDirection,
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const r of records) {
    if (r.direction !== direction || r.status !== "open") continue;
    const left = outstanding(r);
    if (left == null || left <= 0) continue;
    const code = r.currency ?? "";
    totals[code] = roundMoney((totals[code] ?? 0) + left);
  }
  return totals;
}

export function isOverdue(record: Pick<DebtRecord, "status" | "dueOn">, today: string): boolean {
  return record.status === "open" && !!record.dueOn && record.dueOn < today;
}

/** Days until due (negative when overdue); `null` without a due date. */
export function daysUntilDue(record: Pick<DebtRecord, "dueOn">, today: string): number | null {
  return record.dueOn ? diffInDays(record.dueOn, today) : null;
}

// ── Reminders (NF-3.8: on `dueOn` and 3 days before) ─────────────────────────

export const DEBT_REMINDER_LEAD_DAYS = 3;

/**
 * Local dates (YYYY-MM-DD) a "A payment is due" reminder should fire on, from
 * `today` up to `horizonDays` ahead: each open record's due date and the day
 * 3 days before. Deduped — one generic reminder per day, whatever the count.
 */
export function debtReminderDates(
  records: readonly Pick<DebtRecord, "status" | "dueOn">[],
  today: string,
  horizonDays: number,
): string[] {
  const last = addDays(today, horizonDays);
  const dates = new Set<string>();
  for (const r of records) {
    if (r.status !== "open" || !r.dueOn) continue;
    for (const day of [addDays(r.dueOn, -DEBT_REMINDER_LEAD_DAYS), r.dueOn]) {
      if (day >= today && day <= last) dates.add(day);
    }
  }
  return [...dates].sort();
}
