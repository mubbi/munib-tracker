import { addDays } from "@munib-tracker/shared/utils";

/**
 * First ISO date on/after `from` that satisfies `predicate` — pick "a Friday",
 * "a White Day" etc. without hard-coding calendar facts into tests.
 */
export function firstDateWhere(
  predicate: (isoDate: string) => boolean,
  from = "2026-07-01",
): string {
  let date = from;
  for (let i = 0; i < 400; i += 1) {
    if (predicate(date)) return date;
    date = addDays(date, 1);
  }
  throw new Error(`No date within 400 days of ${from} matched`);
}
