/** Offset pagination helpers for server-rendered list pages (`?page=N`). */

export const PAGE_SIZE = 25;

export function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function pageOffset(page: number, size: number = PAGE_SIZE): number {
  return (page - 1) * size;
}

/**
 * Slice a "peeked" result (queried with `PAGE_SIZE + 1`) into the page rows and
 * whether a next page exists — avoids a separate COUNT query.
 */
export function takePage<T>(rows: T[], size: number = PAGE_SIZE): { rows: T[]; hasNext: boolean } {
  return { rows: rows.slice(0, size), hasNext: rows.length > size };
}
