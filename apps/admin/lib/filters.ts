/** Shared filter helpers for server-rendered list pages (`?from=&to=&period=…`). */

import {
  CLIENT_PLATFORMS,
  type ClientPlatform,
  DATE_PRESETS,
  type DatePreset,
} from "./filter-options";

/** Parse a `<input type="date">` value (YYYY-MM-DD) to the start of that day. */
export function parseDateStart(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const d = new Date(`${raw}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Parse a `<input type="date">` value to the end of that day (inclusive `to`). */
export function parseDateEnd(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const d = new Date(`${raw}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Normalize a search-param string: trims and treats "" as "no filter". */
export function cleanParam(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  return v ? v : undefined;
}

/** True if any of the given params is set — used to show the "Clear" control. */
export function hasActiveFilters(...values: (string | undefined)[]): boolean {
  return values.some((v) => Boolean(v?.trim()));
}

export function parseOptionalInt(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.floor(n) : undefined;
}

export function parseOptionalBool(raw: string | undefined): boolean | undefined {
  if (!raw) return undefined;
  if (raw === "1" || raw === "true" || raw === "yes") return true;
  if (raw === "0" || raw === "false" || raw === "no") return false;
  return undefined;
}

export function parseClientPlatform(raw: string | undefined): ClientPlatform | undefined {
  const value = cleanParam(raw);
  if (value && (CLIENT_PLATFORMS as readonly string[]).includes(value)) {
    return value as ClientPlatform;
  }
  return undefined;
}

/** Resolve `period` preset or explicit `from`/`to` into a date range. */
export function resolveDateRange(
  period: string | undefined,
  fromRaw: string | undefined,
  toRaw: string | undefined,
): { from?: Date; to?: Date; preset?: DatePreset } {
  const fromParam = parseDateStart(fromRaw);
  const toParam = parseDateEnd(toRaw);

  if (fromParam || toParam) {
    return { from: fromParam, to: toParam ?? new Date(), preset: "custom" };
  }

  if (period && period !== "custom" && DATE_PRESETS.includes(period as DatePreset)) {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : null;
    if (days) {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - days);
      from.setHours(0, 0, 0, 0);
      return { from, to, preset: period as DatePreset };
    }
  }

  return {};
}

/** Build query-string params for pagination links — drops empty values and `page`. */
export function filterParamsForPagination(
  params: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" && value) continue;
    const cleaned = cleanParam(value);
    if (cleaned) out[key] = cleaned;
  }
  return out;
}

export type DateRangeParams = {
  period?: string;
  from?: string;
  to?: string;
};

export function parseDateRangeParams(params: DateRangeParams): {
  from?: Date;
  to?: Date;
  preset?: DatePreset;
} {
  return resolveDateRange(
    cleanParam(params.period),
    cleanParam(params.from),
    cleanParam(params.to),
  );
}
