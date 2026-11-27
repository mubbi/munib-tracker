/**
 * Debts & trusts record (NF-3.8, Dayn / Amanah). Stored only in the encrypted
 * vault document `debts` (D2) — never in plain preferences, notifications or
 * Sentry. Each record and each vow is one vault item (per-item last-write-wins,
 * with payments merged by id; see `apps/app/src/lib/debts/merge.ts`).
 */

/** `trust_held`: something entrusted to me (to return); `trust_given`: mine, held by someone else. */
export type DebtDirection = "i_owe" | "owed_to_me" | "trust_held" | "trust_given";

export const DEBT_DIRECTIONS: readonly DebtDirection[] = [
  "i_owe",
  "owed_to_me",
  "trust_held",
  "trust_given",
];

export type DebtStatus = "open" | "settled" | "forgiven";

export interface DebtPayment {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  amount: number;
  note?: string;
}

export interface DebtRecord {
  id: string;
  direction: DebtDirection;
  counterparty: string;
  /** Principal. Optional for trusts / non-cash items. */
  amount?: number;
  /** ISO 4217 code, formatted via `lib/format-currency.ts`. */
  currency?: string;
  /** For trusts / non-cash. */
  item?: string;
  /** YYYY-MM-DD */
  createdOn: string;
  /** YYYY-MM-DD */
  dueOn?: string;
  /** Names only. */
  witnesses?: string[];
  /** Optional document photo: a `vault-file:<id>#<mime>` reference to a device-only file encrypted with the vault key (never synced; see `lib/debts/debt-photo.ts`). */
  documentUri?: string;
  payments: DebtPayment[];
  /** Payment ids deleted on some device — kept so a merge doesn't resurrect them. */
  removedPaymentIds?: string[];
  status: DebtStatus;
  /** YYYY-MM-DD the debt was forgiven as sadaqah (Qur'an 2:280). */
  forgivenOn?: string;
  notes?: string;
  updatedAt: string;
  deletedAt?: string;
}

/** An unfulfilled vow (nadhr) kept in the same vault document. */
export interface VowRecord {
  id: string;
  text: string;
  fulfilled: boolean;
  updatedAt: string;
  deletedAt?: string;
}

/** One vault item of the `debts` document. */
export type DebtsVaultItem =
  | ({ kind: "debt" } & Omit<DebtRecord, "id" | "updatedAt" | "deletedAt">)
  | ({ kind: "vow" } & Omit<VowRecord, "id" | "updatedAt" | "deletedAt">);
