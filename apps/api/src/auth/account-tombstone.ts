import { randomBytes } from "node:crypto";

/** A closed account's `users.email`: `deleted_<32 hex>_…`. */
const TOMBSTONE_RE = /^deleted_[a-f0-9]{32}_/i;

export function isTombstoneValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return TOMBSTONE_RE.test(value);
}

/**
 * `users.email` for a closed account: a random marker that contains **no
 * personal data** (right to erasure — GDPR Art. 17, Apple 5.1.1(v), Google
 * Play account deletion). It still matches `isTombstoneValue`, so sign-in and
 * session checks keep rejecting the closed row, and the original email is
 * free for a new account. The original email is not kept in any form.
 */
export function buildTombstoneEmail(): string {
  return `deleted_${randomBytes(16).toString("hex")}_closed`;
}
