/**
 * Open/closed hint from OSM `opening_hours` (NF-3.11). Only the simple subset is
 * evaluated — `24/7`, and `<days> HH:MM-HH:MM[,HH:MM-HH:MM]` rules separated by
 * `;`. Anything else returns `null` so the UI shows no hint rather than a guess.
 */

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const SPAN = /^([01]?\d|2[0-4]):([0-5]\d)\s*-\s*([01]?\d|2[0-4]):([0-5]\d)$/;
const DAY_TOKEN = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/;

function daysOf(selector: string): Set<string> | null {
  const days = new Set<string>();
  for (const part of selector.split(",")) {
    const m = DAY_TOKEN.exec(part.trim());
    if (!m?.[1]) return null;
    const from = ORDER.indexOf(m[1] as (typeof ORDER)[number]);
    const to = m[2] ? ORDER.indexOf(m[2] as (typeof ORDER)[number]) : from;
    for (let i = from; ; i = (i + 1) % 7) {
      days.add(ORDER[i] as string);
      if (i === to) break;
    }
  }
  return days;
}

/**
 * `true` = open, `false` = closed, `null` = unknown/unsupported syntax.
 * `weekday` is 0 (Sunday) … 6 (Saturday); `minutes` is minutes since local midnight.
 */
export function isOpenAt(
  value: string | undefined | null,
  weekday: number,
  minutes: number,
): boolean | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim();
  if (trimmed === "24/7") return true;
  const today = DAYS[weekday];
  if (!today) return null;
  let matchedDay = false;
  let open = false;
  for (const raw of trimmed.split(";")) {
    const rule = raw.trim();
    if (!rule) continue;
    const space = rule.indexOf(" ");
    let days: Set<string> | null = new Set(ORDER);
    let spans = rule;
    if (/^[A-Z][a-z]/.test(rule)) {
      if (space < 0) return null;
      days = daysOf(rule.slice(0, space));
      spans = rule.slice(space + 1);
    }
    if (!days) return null;
    const ranges: Array<[number, number]> = [];
    for (const span of spans.split(",")) {
      const m = SPAN.exec(span.trim());
      if (!m) return null;
      ranges.push([Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])]);
    }
    if (!days.has(today)) continue;
    // A later rule for the same day overrides an earlier one (opening_hours semantics).
    matchedDay = true;
    open = ranges.some(([from, to]) =>
      to > from ? minutes >= from && minutes < to : minutes >= from || minutes < to,
    );
  }
  return matchedDay ? open : false;
}
