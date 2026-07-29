import { randomBytes } from "node:crypto";

const TOMBSTONE_RE = /^deleted_[a-f0-9]{32}_/i;

export function isTombstoneValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return TOMBSTONE_RE.test(value);
}

/**
 * Irreversible identifier prefix: frees the original value for uniqueness checks
 * while preventing reuse of the closed account's login identity.
 */
export function buildTombstoneValue(original: string | null, fallback: string): string {
  const token = randomBytes(16).toString("hex");
  const base = (original?.trim() || fallback).replace(TOMBSTONE_RE, "");
  return `deleted_${token}_${base}`;
}

export function buildTombstoneEmail(originalEmail: string | null, userId: string): string {
  return buildTombstoneValue(originalEmail, `user_${userId}`);
}
