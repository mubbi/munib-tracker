import type { DebtDirection } from "@munib-tracker/shared/types";

import { DEFAULT_NUMBER_FORMAT, parseNumberInput } from "@/lib/format-currency";
import { normalizeDayInput } from "@/lib/records/day";

import { type DebtEntry, isLoan } from "./debts";
import type { DebtInput } from "./debts-store";

/**
 * The debt record form (NF-3.8) as plain text fields, and the pure rules that
 * turn it into a `DebtInput` (validation + the fields carried over from the
 * stored record). The screen only renders and submits.
 */
export interface DebtFormState {
  direction: DebtDirection;
  counterparty: string;
  amount: string;
  currency: string;
  item: string;
  createdOn: string;
  dueOn: string;
  witnesses: string;
  notes: string;
}

/** The form for `record`, or a blank one in `direction` (new record). */
export function debtFormFrom(
  record: DebtEntry | undefined,
  direction: DebtDirection,
  defaults: { currency: string; today: string },
): DebtFormState {
  return {
    direction: record?.direction ?? direction,
    counterparty: record?.counterparty ?? "",
    amount: record?.amount != null ? String(record.amount) : "",
    currency: record?.currency ?? defaults.currency,
    item: record?.item ?? "",
    createdOn: record?.createdOn ?? defaults.today,
    dueOn: record?.dueOn ?? "",
    witnesses: (record?.witnesses ?? []).join(", "),
    notes: record?.notes ?? "",
  };
}

export type DebtFormErrorKey =
  | "debts.form.errorWho"
  | "debts.form.errorAmount"
  | "debts.form.errorDate";

export type DebtFormResult =
  | { ok: true; input: DebtInput }
  | { ok: false; error: DebtFormErrorKey };

/**
 * Validates the form and builds the record to save. Payments, status, the
 * forgiven day and the photo reference come from the stored `record`, which
 * the form never edits.
 */
export function debtInputFromForm(
  form: DebtFormState,
  record: DebtEntry | undefined,
): DebtFormResult {
  const amount = parseNumberInput(form.amount, DEFAULT_NUMBER_FORMAT);
  const createdOn = normalizeDayInput(form.createdOn);
  const dueOn = form.dueOn.trim() ? normalizeDayInput(form.dueOn) : "";
  if (!form.counterparty.trim()) return { ok: false, error: "debts.form.errorWho" };
  if (isLoan(form.direction) && !(amount > 0))
    return { ok: false, error: "debts.form.errorAmount" };
  if (!createdOn || dueOn == null) return { ok: false, error: "debts.form.errorDate" };
  return {
    ok: true,
    input: {
      direction: form.direction,
      counterparty: form.counterparty,
      ...(amount > 0 ? { amount, currency: form.currency } : {}),
      // A loan has no "item"; drop text left over from switching the type.
      item: isLoan(form.direction) ? "" : form.item,
      createdOn,
      ...(dueOn ? { dueOn } : {}),
      witnesses: form.witnesses.split(/[,،]/),
      notes: form.notes,
      payments: record?.payments ?? [],
      ...(record?.removedPaymentIds ? { removedPaymentIds: record.removedPaymentIds } : {}),
      status: record?.status ?? "open",
      ...(record?.forgivenOn ? { forgivenOn: record.forgivenOn } : {}),
      ...(record?.documentUri ? { documentUri: record.documentUri } : {}),
    },
  };
}

export type RepaymentResult =
  | { ok: true; payment: { amount: number; date: string; note?: string } }
  | { ok: false; error: "debts.payments.errorAmount" | "debts.form.errorDate" };

/** Validates a typed repayment (amount > 0, readable day; a blank note is dropped). */
export function repaymentFromForm(
  amountText: string,
  dateText: string,
  note: string,
): RepaymentResult {
  const amount = parseNumberInput(amountText, DEFAULT_NUMBER_FORMAT);
  const date = normalizeDayInput(dateText);
  if (!(amount > 0)) return { ok: false, error: "debts.payments.errorAmount" };
  if (!date) return { ok: false, error: "debts.form.errorDate" };
  return { ok: true, payment: { amount, date, ...(note.trim() ? { note } : {}) } };
}
