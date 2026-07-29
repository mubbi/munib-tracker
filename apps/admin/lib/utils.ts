import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * Tally a list into `{ label, value }[]` (descending) for BarList/DonutChart —
 * lets pages chart already-fetched rows without an extra query.
 */
export function countBy<T>(
  items: readonly T[],
  key: (item: T) => string,
): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Compact duration for SLA stats (median first-response / resolution): minutes
 * under an hour, hours under two days, then days. Returns "—" for null/invalid.
 */
export function formatDurationShort(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "—";
  const hours = seconds / 3600;
  if (hours < 1) return `${Math.round(seconds / 60)}m`;
  if (hours < 48) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Intentionally a dependency-free local copy of the tombstone check. The canonical
// implementation lives in `@munib-tracker/db/accountClosure`, but that module pulls
// in node:crypto + drizzle (server-only) — importing it here would drag those into
// the client bundle, since this utils module is shared by client components. Keep
// the regex in sync with accountClosure.ts if the tombstone format ever changes.
const TOMBSTONE_RE = /^deleted_[a-f0-9]{32}_/i;

export function isTombstoneEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return TOMBSTONE_RE.test(email);
}

export function maskEmail(email: string | null | undefined): string {
  if (!email || isTombstoneEmail(email)) return "—";
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
