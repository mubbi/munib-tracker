import { median, prepareRows, type Row, type Tok } from "./geometry";
import {
  classifyLabel,
  type DateColumnRole,
  dateColumnRole,
  type LabelInfo,
  monthFromText,
  type QualifierKind,
} from "./labels";
import {
  clockMinutes,
  formatClock,
  type ParsedClock,
  parseClockText,
  parseIntegerText,
} from "./normalise";
import type {
  OcrResult,
  ParsedTimetable,
  ParseTimetableOptions,
  TimetableCell,
  TimetableCellFlag,
  TimetableDateColumn,
  TimetableJumuah,
  TimetableKind,
  TimetablePrayer,
  TimetableRow,
} from "./types";

/**
 * NF-3.12 rule-based timetable parser (plan steps 1–7). Pure: OCR tokens in,
 * reviewable cells out. Nothing here touches the network (D3).
 */

export const TIMETABLE_PRAYERS: readonly TimetablePrayer[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];
/** Prayers saved as iqamah times ("Your times"). */
export const IQAMAH_TIMETABLE_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

const ADHAN_TOLERANCE_MIN = 20;
const IQAMAH_WINDOW_MIN = 90;
const MONTHLY_MIN_ROWS = 7;

type Item =
  | { kind: "time"; tok: Tok; clock: ParsedClock }
  | { kind: "label"; tok: Tok; label: LabelInfo }
  | { kind: "int"; tok: Tok; value: number }
  | { kind: "other"; tok: Tok };

interface ItemRow {
  cy: number;
  items: Item[];
}

/** A time placed in the layout, before AM/PM resolution. */
interface Placed {
  prayer: TimetablePrayer;
  kind: TimetableKind;
  clock: ParsedClock | null;
  raw: string;
  tokenConf: number;
  layoutConf: number;
  assumed: boolean;
  /** The column's header was unclear (possible merge with a neighbour). */
  unclear?: boolean;
}

function classify(tok: Tok): Item {
  const clock = parseClockText(tok.text);
  if (clock) return { kind: "time", tok, clock };
  const value = parseIntegerText(tok.text);
  if (value != null) return { kind: "int", tok, value };
  const label = classifyLabel(tok.text);
  if (label) return { kind: "label", tok, label };
  return { kind: "other", tok };
}

const times = (row: ItemRow) =>
  row.items.filter((i): i is Extract<Item, { kind: "time" }> => i.kind === "time");
const labels = (row: ItemRow) =>
  row.items.filter((i): i is Extract<Item, { kind: "label" }> => i.kind === "label");
const prayerLabels = (row: ItemRow) =>
  labels(row).filter(
    (
      i,
    ): i is Extract<Item, { kind: "label" }> & {
      label: Extract<LabelInfo, { type: "prayer" }>;
    } => i.label.type === "prayer",
  );
const qualifierOf = (label: LabelInfo): QualifierKind | null =>
  label.type === "qualifier" ? label.kind : label.type === "prayer" ? (label.kind ?? null) : null;

function monthHint(rows: ItemRow[]): ParsedTimetable["monthHint"] {
  const hint: ParsedTimetable["monthHint"] = {};
  for (const row of rows) {
    for (const item of row.items) {
      if (hint.month == null) {
        const month = monthFromText(item.tok.text);
        if (month) hint.month = month;
      }
      if (hint.year == null && item.kind === "int" && item.value >= 1990 && item.value <= 2100) {
        hint.year = item.value;
      }
    }
  }
  return hint;
}

// ── Step 5: 12-hour disambiguation by prayer order ──────────────────────────

const ORDER: Array<[TimetablePrayer, TimetableKind]> = TIMETABLE_PRAYERS.flatMap((p) =>
  p === "sunrise"
    ? [[p, "adhan"] as [TimetablePrayer, TimetableKind]]
    : [
        [p, "adhan"] as [TimetablePrayer, TimetableKind],
        [p, "iqamah"] as [TimetablePrayer, TimetableKind],
      ],
);

/**
 * Calculated minutes for a prayer on the day's timeline: an Isha computed
 * after midnight (high-latitude summer, "00:20") sits after Maghrib (1460).
 */
function calcOnTimeline(prayer: TimetablePrayer, value: string | null | undefined): number | null {
  const minutes = clockMinutes(value ?? null);
  if (minutes == null) return null;
  return prayer === "isha" && minutes < 720 ? minutes + 1440 : minutes;
}

/** Candidate minutes for a clock, best first (plan §5 rules + calculated times). */
function candidates(placed: Placed, calc: number | null): number[] {
  const { clock } = placed;
  if (!clock) return [];
  const base = (clock.hour % 12) * 60 + clock.minute;
  // An Isha past midnight stays after Maghrib on the day's timeline.
  const afterMidnight = placed.prayer === "isha" && clock.hour % 12 < 3 ? 1440 : 0;
  if (clock.meridiem === "am") return [base + afterMidnight];
  if (clock.meridiem === "pm") return [base + 720];
  if (clock.hour === 0) return [clock.minute + afterMidnight];
  if (clock.hour > 12) return [clock.hour * 60 + clock.minute];
  const am = base;
  const pm = base + 720;
  let ordered: number[];
  switch (placed.prayer) {
    case "fajr":
    case "sunrise":
      ordered = [am, pm];
      break;
    case "dhuhr":
      // Dhuhr is 11:00–14:00: 11 → AM, 12 / 1 / 2 → PM.
      ordered = am >= 660 && am < 720 ? [am, pm] : [pm, am];
      break;
    case "isha":
      // 12:xx / 1:xx Isha in summer = just after midnight.
      ordered = clock.hour === 12 || clock.hour < 3 ? [am + 1440, pm] : [pm, am + 1440];
      break;
    default:
      ordered = [pm, am];
  }
  if (calc != null && placed.kind === "adhan") {
    ordered.sort((a, b) => Math.abs(a - calc) - Math.abs(b - calc));
  } else if (calc != null) {
    const dist = (v: number) => (v >= calc ? v - calc : (calc - v) * 3);
    ordered.sort((a, b) => dist(a) - dist(b));
  }
  return ordered;
}

/** Picks one candidate per cell so the day stays in prayer order, preferring each cell's first choice. */
function resolveOrder(cells: Array<{ placed: Placed; options: number[] }>): {
  values: Array<number | null>;
  conflicts: Set<number>;
} {
  const n = cells.length;
  let best: number[] | null = null;
  let bestCost = Number.POSITIVE_INFINITY;
  const pick: number[] = new Array(n).fill(-1);
  const visit = (index: number, last: number, cost: number) => {
    if (cost >= bestCost) return;
    if (index === n) {
      best = [...pick];
      bestCost = cost;
      return;
    }
    const cell = cells[index] as { placed: Placed; options: number[] };
    if (cell.options.length === 0) {
      pick[index] = -1;
      visit(index + 1, last, cost);
      return;
    }
    cell.options.forEach((value, rank) => {
      if (value < last) return;
      pick[index] = rank;
      visit(index + 1, value, cost + rank);
    });
  };
  visit(0, Number.NEGATIVE_INFINITY, 0);
  if (best) {
    const chosen: number[] = best;
    return {
      values: cells.map((c, i) => (c.options.length ? (c.options[chosen[i] ?? 0] ?? null) : null)),
      conflicts: new Set<number>(),
    };
  }
  // No consistent assignment: keep first choices, flag only the cells out of order.
  const values = cells.map((c) => c.options[0] ?? null);
  const conflicts = new Set<number>();
  let maxIndex = -1;
  values.forEach((value, index) => {
    if (value == null) return;
    const max = maxIndex >= 0 ? (values[maxIndex] ?? null) : null;
    if (max != null && value < max) {
      conflicts.add(index);
      conflicts.add(maxIndex);
    } else {
      maxIndex = index;
    }
  });
  return { values, conflicts };
}

function finishRow(
  placedCells: Placed[],
  day: number | null,
  dateKey: string | null,
  options: ParseTimetableOptions,
  ensureIqamah: boolean,
): TimetableRow {
  const threshold = options.reviewThreshold ?? 0.8;
  const calcRaw = dateKey ? (options.calculated?.(dateKey) ?? null) : null;
  const calcFor = (prayer: TimetablePrayer) => calcOnTimeline(prayer, calcRaw?.[prayer]);

  const byKey = new Map<string, Placed>();
  for (const placed of placedCells) {
    const key = `${placed.prayer}:${placed.kind}`;
    const existing = byKey.get(key);
    if (!existing || (!existing.clock && placed.clock)) byKey.set(key, placed);
  }
  if (ensureIqamah) {
    for (const prayer of IQAMAH_TIMETABLE_PRAYERS) {
      const key = `${prayer}:iqamah`;
      if (!byKey.has(key)) {
        byKey.set(key, {
          prayer,
          kind: "iqamah",
          clock: null,
          raw: "",
          tokenConf: 0,
          layoutConf: 0,
          assumed: false,
        });
      }
    }
  }
  const ordered = ORDER.map(([p, k]) => byKey.get(`${p}:${k}`)).filter((c): c is Placed => !!c);
  const resolved = resolveOrder(
    ordered.map((placed) => ({ placed, options: candidates(placed, calcFor(placed.prayer)) })),
  );

  const resolvedValue = (prayer: TimetablePrayer, kind: TimetableKind): number | null => {
    const index = ordered.findIndex((c) => c.prayer === prayer && c.kind === kind);
    return index >= 0 ? (resolved.values[index] ?? null) : null;
  };

  const cells: TimetableCell[] = ordered.map((placed, index) => {
    const value = resolved.values[index] ?? null;
    const flags: TimetableCellFlag[] = [];
    if (value == null) flags.push("missing");
    if (placed.assumed) flags.push("kindAssumed");
    if (placed.unclear) flags.push("columnUnclear");
    if (value != null && resolved.conflicts.has(index)) flags.push("orderConflict");
    const calc = calcFor(placed.prayer);
    if (value != null && placed.kind === "adhan" && calc != null) {
      if (Math.abs(value - calc) > ADHAN_TOLERANCE_MIN) flags.push("farFromCalculated");
    }
    if (value != null && placed.kind === "iqamah") {
      const adhan = resolvedValue(placed.prayer, "adhan") ?? calc;
      if (adhan != null && (value < adhan || value > adhan + IQAMAH_WINDOW_MIN)) {
        flags.push("iqamahWindow");
      }
    }
    const confidence = Math.min(placed.tokenConf, placed.layoutConf);
    if (value != null && confidence < threshold) flags.push("lowConfidence");
    return {
      prayer: placed.prayer,
      kind: placed.kind,
      value: value == null ? null : formatClock(value),
      raw: placed.raw,
      confidence: Math.round(confidence * 100) / 100,
      flags,
      needsReview: flags.length > 0 || confidence < threshold,
    };
  });
  return { day, cells };
}

// ── Jumu'ah ─────────────────────────────────────────────────────────────────

function jumuahSlots(items: Item[], threshold: number): TimetableJumuah[] {
  const slots: TimetableJumuah[] = [];
  let pendingKhutbah = false;
  for (const item of items) {
    if (item.kind === "label") {
      if (qualifierOf(item.label) === "khutbah") pendingKhutbah = true;
      else if (qualifierOf(item.label) === "iqamah") pendingKhutbah = false;
      continue;
    }
    if (item.kind !== "time") continue;
    const { clock } = item;
    // Jumu'ah is midday: 11:00–15:30 (12 → noon, 1–3 → PM).
    let minutes = (clock.hour % 12) * 60 + clock.minute;
    if (clock.meridiem === "pm" || (clock.meridiem == null && clock.hour <= 3 && clock.hour > 0)) {
      minutes += 720;
    } else if (clock.meridiem == null && clock.hour === 12) minutes = 720 + clock.minute;
    else if (clock.hour > 12) minutes = clock.hour * 60 + clock.minute;
    const at = formatClock(minutes);
    const confidence = Math.round(item.tok.conf * 100) / 100;
    const plausible = minutes >= 660 && minutes <= 930;
    const last = slots[slots.length - 1];
    if (pendingKhutbah) {
      slots.push({ khutbahAt: at, confidence, needsReview: confidence < threshold || !plausible });
      pendingKhutbah = false;
    } else if (last?.khutbahAt && !last.iqamahAt) {
      last.iqamahAt = at;
      last.confidence = Math.min(last.confidence, confidence);
      last.needsReview = last.needsReview || confidence < threshold || !plausible;
    } else {
      slots.push({ iqamahAt: at, confidence, needsReview: confidence < threshold || !plausible });
    }
  }
  return slots;
}

// ── Layout: one prayer per row (daily boards) ───────────────────────────────

function parseRowsLayout(rows: ItemRow[]): { placed: Placed[]; jumuah: Item[][] } {
  const placed: Placed[] = [];
  const jumuah: Item[][] = [];
  // Column qualifiers: "Begins" / "Iqamah" in rows that hold no times.
  const columnQualifiers = rows
    .filter((row) => times(row).length === 0)
    .flatMap((row) =>
      labels(row)
        .filter((i) => i.label.type === "qualifier" && i.label.kind !== "khutbah")
        .map((i) => ({ kind: qualifierOf(i.label) as TimetableKind, cx: i.tok.cx })),
    );
  const seen = new Set<string>();
  for (const row of rows) {
    const rowPrayers = prayerLabels(row);
    if (rowPrayers.length === 0 || times(row).length === 0) continue;
    // Segment the row by its prayer labels (usually one per row).
    const segments = new Map<Item, Item[]>();
    for (const label of rowPrayers) segments.set(label, []);
    for (const item of row.items) {
      if (item.kind === "label" && item.label.type === "prayer") continue;
      let owner = rowPrayers[0] as Item;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const label of rowPrayers) {
        const d = Math.abs(item.tok.cx - label.tok.cx);
        if (d < bestDistance) {
          bestDistance = d;
          owner = label;
        }
      }
      segments.get(owner)?.push(item);
    }
    for (const [labelItem, items] of segments) {
      if (labelItem.kind !== "label" || labelItem.label.type !== "prayer") continue;
      const prayer = labelItem.label.prayer;
      // Reading order: away from the label (LTR boards: label left; RTL: label right).
      const rtl = items.length > 0 && items.every((i) => i.tok.cx < labelItem.tok.cx);
      const ordered = [...items].sort((a, b) => (rtl ? b.tok.cx - a.tok.cx : a.tok.cx - b.tok.cx));
      if (prayer === "jumuah") {
        jumuah.push(ordered);
        continue;
      }
      if (seen.has(prayer)) continue;
      seen.add(prayer);
      const rowTimes = ordered.filter(
        (i): i is Extract<Item, { kind: "time" }> => i.kind === "time",
      );
      const inline = ordered.some((i) => i.kind === "label" && qualifierOf(i.label));
      let lastQualifier: TimetableKind | null = labelItem.label.kind
        ? labelItem.label.kind === "khutbah"
          ? null
          : labelItem.label.kind
        : null;
      const kinds: Array<{ kind: TimetableKind; conf: number; assumed: boolean }> = [];
      const used = new Set<TimetableKind>();
      if (inline || lastQualifier) {
        for (const item of ordered) {
          if (item.kind === "label") {
            const q = qualifierOf(item.label);
            if (q && q !== "khutbah") lastQualifier = q;
          } else if (item.kind === "time") {
            const kind = lastQualifier ?? (used.has("adhan") ? "iqamah" : "adhan");
            kinds.push({ kind, conf: lastQualifier ? 1 : 0.85, assumed: false });
            used.add(kind);
            lastQualifier = null;
          }
        }
      } else if (columnQualifiers.length > 0) {
        for (const time of rowTimes) {
          let nearest = columnQualifiers[0] as { kind: TimetableKind; cx: number };
          for (const q of columnQualifiers) {
            if (Math.abs(q.cx - time.tok.cx) < Math.abs(nearest.cx - time.tok.cx)) nearest = q;
          }
          kinds.push({ kind: nearest.kind, conf: 1, assumed: false });
        }
        // Two times under the same qualifier ⇒ fall back to order.
        if (kinds.length === 2 && kinds[0]?.kind === kinds[1]?.kind) {
          kinds.splice(
            0,
            2,
            { kind: "adhan", conf: 0.85, assumed: false },
            {
              kind: "iqamah",
              conf: 0.85,
              assumed: false,
            },
          );
        }
      } else if (rowTimes.length >= 2) {
        kinds.push({ kind: "adhan", conf: 0.9, assumed: false });
        kinds.push({ kind: "iqamah", conf: 0.9, assumed: false });
      } else if (rowTimes.length === 1) {
        kinds.push(
          prayer === "sunrise"
            ? { kind: "adhan", conf: 1, assumed: false }
            : { kind: "iqamah", conf: 0.75, assumed: true },
        );
      }
      rowTimes.forEach((time, index) => {
        const info = kinds[index];
        if (!info) return;
        const kind: TimetableKind = prayer === "sunrise" ? "adhan" : info.kind;
        placed.push({
          prayer,
          kind,
          clock: time.clock,
          raw: time.tok.text,
          tokenConf: time.tok.conf,
          layoutConf: time.tok.joined ? Math.min(info.conf, 0.9) : info.conf,
          assumed: info.assumed,
        });
      });
    }
  }
  return { placed, jumuah };
}

// ── Layout: one prayer per column (daily strips + monthly grids) ────────────

interface Column {
  cx: number;
  prayer: TimetablePrayer | "jumuah" | null;
  kind: TimetableKind;
  conf: number;
  assumed: boolean;
  /** Centre of the header label the column was attached to. */
  anchorCx?: number;
  /** Header unclear (more columns under one prayer than it can have) — review. */
  unclear?: boolean;
}

/** A column joins a header label only when it sits within this many pitches of the label's box. */
const LABEL_ATTACH_PITCH = 0.6;
/** Layout confidence of a column kept after an unclear header (below the review threshold). */
const UNCLEAR_CONF = 0.6;

/** 1-D clustering of x-centres by gaps, refined with a few k-means passes. */
function clusterX(values: number[], gap: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const groups: number[][] = [];
  for (const v of sorted) {
    const last = groups[groups.length - 1];
    if (last && v - (last[last.length - 1] ?? v) <= gap) last.push(v);
    else groups.push([v]);
  }
  let centres = groups.map((g) => g.reduce((s, v) => s + v, 0) / g.length);
  for (let pass = 0; pass < 3; pass += 1) {
    const sums = centres.map(() => ({ sum: 0, n: 0 }));
    for (const v of values) {
      let best = 0;
      centres.forEach((c, i) => {
        if (Math.abs(v - c) < Math.abs(v - (centres[best] ?? c))) best = i;
      });
      const slot = sums[best] as { sum: number; n: number };
      slot.sum += v;
      slot.n += 1;
    }
    centres = centres.map((c, i) => {
      const slot = sums[i] as { sum: number; n: number };
      return slot.n ? slot.sum / slot.n : c;
    });
  }
  return centres;
}

function nearestIndex(values: number[], target: number): number {
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  values.forEach((v, i) => {
    const d = Math.abs(v - target);
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return best;
}

function labelColumns(centres: number[], headerRows: ItemRow[], pitch: number): Column[] | null {
  const anchors = headerRows.flatMap((row) =>
    labels(row)
      .filter((i) => i.label.type === "prayer" || i.label.type === "other")
      .map((i) => ({ item: i, x0: i.tok.cx - i.tok.w / 2, x1: i.tok.cx + i.tok.w / 2 })),
  );
  const qualifiers = headerRows.flatMap((row) =>
    labels(row)
      .map((i) => ({ i, q: qualifierOf(i.label) }))
      .filter((x) => x.q === "adhan" || x.q === "iqamah")
      .map((x) => ({
        kind: x.q as TimetableKind,
        cx: x.i.tok.cx,
        glued: x.i.label.type === "prayer",
      })),
  );
  const prayerAnchors = anchors.filter((a) => a.item.label.type === "prayer");
  if (prayerAnchors.length === 0) return null;

  const columns: Column[] = centres.map((cx) => {
    let best = anchors[0] as (typeof anchors)[number];
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const anchor of anchors) {
      const d = cx < anchor.x0 ? anchor.x0 - cx : cx > anchor.x1 ? cx - anchor.x1 : 0;
      if (d < bestDistance - 1e-6) {
        bestDistance = d;
        best = anchor;
      }
    }
    const label = best.item.label;
    // A misread header ("Ase" for "Asr") must not pull its columns under the
    // neighbouring prayer: too far from every label ⇒ the column stays
    // unassigned (its prayer shows as missing, flagged) instead of guessed.
    if (label.type !== "prayer" || bestDistance > LABEL_ATTACH_PITCH * pitch) {
      return { cx, prayer: null, kind: "iqamah", conf: 0, assumed: false };
    }
    return {
      cx,
      prayer: label.prayer,
      kind: label.kind === "adhan" ? "adhan" : "iqamah",
      conf: label.kind === "adhan" || label.kind === "iqamah" ? 1 : 0,
      assumed: false,
      anchorCx: best.item.tok.cx,
    };
  });

  // Reading direction from the header order (Arabic sheets run right → left).
  const fajr = prayerAnchors.find(
    (a) => a.item.label.type === "prayer" && a.item.label.prayer === "fajr",
  );
  const isha = prayerAnchors.find(
    (a) => a.item.label.type === "prayer" && a.item.label.prayer === "isha",
  );
  const rtl = !!fajr && !!isha && fajr.item.tok.cx > isha.item.tok.cx;

  const byPrayer = new Map<string, Column[]>();
  for (const col of columns) {
    if (!col.prayer) continue;
    const list = byPrayer.get(col.prayer) ?? [];
    list.push(col);
    byPrayer.set(col.prayer, list);
  }
  for (const [prayer, all] of byPrayer) {
    all.sort((a, b) => (rtl ? b.cx - a.cx : a.cx - b.cx));
    for (const col of all) {
      if (col.conf === 1) continue;
      const near = qualifiers
        .filter((q) => Math.abs(q.cx - col.cx) <= 0.6 * pitch)
        .sort((a, b) => Math.abs(a.cx - col.cx) - Math.abs(b.cx - col.cx))[0];
      if (near) {
        col.kind = near.kind;
        col.conf = 1;
      }
    }
    if (prayer === "sunrise") {
      // One sunrise column; an extra one belongs to an unreadable neighbour.
      const keep = nearestToAnchor(all);
      for (const col of all) {
        if (col === keep) Object.assign(col, { kind: "adhan", conf: 1 });
        else Object.assign(col, { prayer: null, conf: 0 });
      }
      continue;
    }
    const cols = resolveMerged(all, pitch);
    if (cols.every((c) => c.conf === 1 || c.unclear)) {
      // Unclear columns kept without a qualifier: a single column is a guessed iqamah.
      if (cols.length === 1 && cols[0]?.unclear && cols[0].assumed) cols[0].kind = "iqamah";
      continue;
    }
    if (cols.length >= 2) {
      const known = cols.filter((c) => c.conf === 1);
      const other: TimetableKind | null =
        known.length === 1 ? (known[0]?.kind === "adhan" ? "iqamah" : "adhan") : null;
      cols.forEach((col, index) => {
        if (col.conf < 1) {
          Object.assign(col, { kind: other ?? (index === 0 ? "adhan" : "iqamah"), conf: 0.9 });
        }
      });
    } else {
      const sheetQualifiers = new Set(qualifiers.map((q) => q.kind));
      const only = sheetQualifiers.size === 1 ? [...sheetQualifiers][0] : null;
      Object.assign(cols[0] as Column, {
        kind: only ?? "iqamah",
        conf: only ? 0.9 : 0.75,
        assumed: !only,
      });
    }
  }
  return columns;
}

function nearestToAnchor(cols: Column[]): Column | undefined {
  return [...cols].sort(
    (a, b) => Math.abs(a.cx - (a.anchorCx ?? a.cx)) - Math.abs(b.cx - (b.anchorCx ?? b.cx)),
  )[0];
}

/**
 * M6: one prayer label heads at most one Adhan and one iqamah column. More
 * columns — two the label isn't centred over, or two with the same qualifier —
 * mean a neighbouring header was misread and its column merged in. Keep the
 * column(s) the label really heads (one per qualifier kind, else the one under
 * the label), release the rest (prayer null ⇒ never saved as this prayer), and
 * flag what is kept for review. Returns the columns still on the prayer, in
 * reading order.
 */
function resolveMerged(cols: Column[], pitch: number): Column[] {
  if (cols.length <= 1) return cols;
  const qualified = cols.filter((c) => c.conf === 1);
  const kinds = new Set(qualified.map((c) => c.kind));
  if (cols.length === 2 && qualified.length === 2 && kinds.size === 2) return cols;
  const first = cols[0] as Column;
  const last = cols[cols.length - 1] as Column;
  const anchorCx = first.anchorCx;
  const centred =
    cols.length === 2 &&
    qualified.length < 2 &&
    anchorCx != null &&
    Math.abs(anchorCx - (first.cx + last.cx) / 2) <= 0.3 * pitch &&
    Math.abs(last.cx - first.cx) <= 1.5 * pitch;
  if (centred) return cols;

  const keep = new Set<Column>();
  for (const kind of ["adhan", "iqamah"] as const) {
    const best = nearestToAnchor(qualified.filter((c) => c.kind === kind));
    if (best) keep.add(best);
  }
  if (keep.size === 0) {
    const best = nearestToAnchor(cols);
    if (best) keep.add(best);
  }
  for (const col of cols) {
    if (keep.has(col)) {
      col.unclear = true;
      if (col.conf < 1) col.assumed = true;
      col.conf = UNCLEAR_CONF;
    } else {
      Object.assign(col, { prayer: null, conf: 0 });
    }
  }
  return cols.filter((c) => keep.has(c));
}

/** Columns without any header: map by count (5, 6, 10, 11 time columns). */
function columnsByCount(centres: number[]): Column[] {
  const sorted = [...centres].sort((a, b) => a - b);
  const plan: Record<number, Array<[TimetablePrayer, TimetableKind]>> = {
    5: IQAMAH_TIMETABLE_PRAYERS.map((p) => [p, "iqamah"]),
    6: TIMETABLE_PRAYERS.map((p) => [p, p === "sunrise" ? "adhan" : "iqamah"]),
    10: IQAMAH_TIMETABLE_PRAYERS.flatMap((p) => [
      [p, "adhan"],
      [p, "iqamah"],
    ]),
    11: ORDER,
  };
  const layout = plan[sorted.length];
  if (!layout)
    return sorted.map((cx) => ({ cx, prayer: null, kind: "iqamah", conf: 0, assumed: false }));
  return sorted.map((cx, i) => {
    const [prayer, kind] = layout[i] as [TimetablePrayer, TimetableKind];
    return { cx, prayer, kind, conf: 0.7, assumed: sorted.length === 5 || sorted.length === 6 };
  });
}

/** A column of day numbers in a monthly grid (internal). */
interface DayCandidate {
  id: number;
  centre: number;
  role: DateColumnRole | null;
  byRow: Map<number, number>;
  score: number;
}

interface DayColumnResult {
  /** Day number read in the chosen column for a row (null: unreadable / none chosen). */
  dayOf: (rowIndex: number) => number | null;
  columns: TimetableDateColumn[];
  chosen: number | null;
  ambiguous: boolean;
}

/** A Gregorian column only drops once, from the month's end (28–31) to its start (1–3). */
function gregorianConsistent(byRow: Map<number, number>): boolean {
  let previous: number | null = null;
  let drops = 0;
  for (const [, value] of [...byRow].sort((a, b) => a[0] - b[0])) {
    if (previous != null && value <= previous) {
      if (previous < 28 || value > 3) return false;
      drops += 1;
    }
    previous = value;
  }
  return drops <= 1;
}

/**
 * Plan step 3 + M8: finds every column of day numbers (left / right of the
 * times) and picks the one that dates the rows. A "Date" / Gregorian header
 * wins; a Hijri / Ramadan-day column is never the date; without a header the
 * values decide (consecutive, at most one 28–31 → 1 month wrap). When more
 * than one column still fits, the result is `ambiguous` and the review asks.
 */
function dayColumn(
  dataRows: ItemRow[],
  headerRows: ItemRow[],
  pitch: number,
  firstTimeX: number,
  lastTimeX: number,
  forced: number | undefined,
): DayColumnResult | null {
  const ints = dataRows.flatMap((row, rowIndex) =>
    row.items
      .filter((i): i is Extract<Item, { kind: "int" }> => i.kind === "int")
      .filter((i) => i.value >= 1 && i.value <= 31)
      .filter((i) => i.tok.cx < firstTimeX - pitch * 0.3 || i.tok.cx > lastTimeX + pitch * 0.3)
      .map((i) => ({ rowIndex, cx: i.tok.cx, value: i.value })),
  );
  if (ints.length === 0) return null;
  const centres = clusterX(
    ints.map((i) => i.cx),
    Math.max(8, pitch * 0.5),
  ).sort((a, b) => a - b);

  const candidates: DayCandidate[] = centres.map((centre, id) => {
    const byRow = new Map<number, number>();
    for (const i of ints) {
      if (nearestIndex(centres, i.cx) === id && !byRow.has(i.rowIndex)) {
        byRow.set(i.rowIndex, i.value);
      }
    }
    let score = 0;
    let previous: number | null = null;
    for (let r = 0; r < dataRows.length; r += 1) {
      const v = byRow.get(r);
      if (v != null && previous != null && v === previous + 1) score += 1;
      previous = v ?? (previous != null ? previous + 1 : null);
    }
    return { id, centre, role: null, byRow, score };
  });

  // Header words ("Date", "Ramadan", "Hijri" …) on the column-header lines go
  // to their nearest day column. A title line ("Ramadan Timetable") is ignored.
  const headerLines = headerRows.filter((row) =>
    labels(row).some((i) => i.label.type === "prayer" || qualifierOf(i.label) != null),
  );
  for (const row of headerLines) {
    for (const item of row.items) {
      const role = dateColumnRole(item.tok.text);
      if (!role) continue;
      const index = nearestIndex(centres, item.tok.cx);
      const candidate = candidates[index];
      if (!candidate || Math.abs(candidate.centre - item.tok.cx) > Math.max(pitch, 40)) continue;
      // "Islamic Date": the Hijri word is the more specific one.
      if (candidate.role !== "hijri") candidate.role = role;
    }
  }

  const columns: TimetableDateColumn[] = candidates
    .filter((c) => c.byRow.size > 0)
    .map((c) => {
      const values = [...c.byRow].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
      return {
        id: c.id,
        header: c.role,
        first: values[0] ?? 0,
        last: values[values.length - 1] ?? 0,
      };
    });

  const minScore = Math.min(3, dataRows.length - 1);
  const better = (a: DayCandidate, b: DayCandidate) =>
    b.score - a.score ||
    Math.min(...a.byRow.values()) - Math.min(...b.byRow.values()) ||
    a.centre - b.centre;

  let chosen: DayCandidate | null = null;
  let ambiguous = false;
  const forcedCandidate = forced != null ? candidates.find((c) => c.id === forced) : undefined;
  if (forcedCandidate) {
    chosen = forcedCandidate;
  } else {
    const viable = candidates.filter((c) => c.score >= minScore);
    const notHijri = viable.filter((c) => c.role !== "hijri");
    const headed = notHijri.filter((c) => c.role === "gregorian");
    let pool = headed.length > 0 ? headed : notHijri;
    const consistent = pool.filter((c) => gregorianConsistent(c.byRow));
    if (consistent.length > 0) pool = consistent;
    pool.sort(better);
    chosen = pool[0] ?? null;
    // Two plausible date columns and no header to tell them apart, or only a
    // Hijri / Ramadan-day column: ask in review rather than guess.
    const same =
      pool.length > 1 &&
      pool.every((c) => [...c.byRow].every(([row, v]) => pool[0]?.byRow.get(row) === v));
    ambiguous = (pool.length > 1 && !same) || (chosen == null && viable.length > 0);
  }
  if (!chosen && !ambiguous) return null;
  const pick = chosen;
  return {
    dayOf: (rowIndex) => (pick ? (pick.byRow.get(rowIndex) ?? null) : null),
    columns,
    chosen: pick?.id ?? null,
    ambiguous,
  };
}

/** "Begins" / "Jamaat" written at the start of a daily strip's row. */
function rowQualifier(row: ItemRow): TimetableKind | null {
  for (const label of labels(row)) {
    const q = qualifierOf(label.label);
    if (q === "adhan" || q === "iqamah") return q;
  }
  return null;
}

interface ColumnsRow {
  day: number | null;
  dayInferred?: boolean;
  monthOffset?: number;
  placed: Placed[];
}

interface ColumnsResult {
  rows: ColumnsRow[];
  monthly: boolean;
  jumuah: Item[][];
  dates?: Omit<DayColumnResult, "dayOf">;
  monthWrap?: boolean;
}

function parseColumnsLayout(rows: ItemRow[], forcedDateColumn?: number): ColumnsResult | null {
  // Footnote lines ("Jumu'ah 1:15 & 2:00") hold a prayer label next to their times.
  const jumuah: Item[][] = [];
  const dataRows: ItemRow[] = [];
  for (const row of rows) {
    if (times(row).length === 0) continue;
    const pl = prayerLabels(row);
    if (pl.some((l) => l.label.prayer === "jumuah")) {
      jumuah.push(row.items);
      continue;
    }
    if (pl.length > 0) continue;
    dataRows.push(row);
  }
  if (dataRows.length === 0) return null;
  const headerRows = rows.filter(
    (row) => times(row).length === 0 && row.cy < (dataRows[0]?.cy ?? 0),
  );
  const gridRows = dataRows.filter((row) => times(row).length >= 3);
  const monthly = gridRows.length >= MONTHLY_MIN_ROWS;
  // A stray "Updated 10:30" line is not part of a daily strip.
  const usedRows = monthly || gridRows.length > 0 ? gridRows : dataRows;

  const allTimes = usedRows.flatMap((row) => times(row).map((t) => t.tok));
  const widthMedian = median(allTimes.map((t) => t.w)) || 1;
  const centres = clusterX(
    allTimes.map((t) => t.cx),
    widthMedian * 0.6,
  ).sort((a, b) => a - b);
  const gaps = centres.slice(1).map((c, i) => c - (centres[i] ?? c));
  const pitch = median(gaps) || widthMedian * 2;
  const columns = labelColumns(centres, headerRows, pitch) ?? columnsByCount(centres);

  const firstTimeX = centres[0] ?? 0;
  const lastTimeX = centres[centres.length - 1] ?? 0;
  const dates = monthly
    ? dayColumn(usedRows, headerRows, pitch, firstTimeX, lastTimeX, forcedDateColumn)
    : null;

  const out: ColumnsRow[] = [];
  let previousDay = 0;
  let lastRead: number | null = null;
  let monthOffset = 0;
  usedRows.forEach((row, rowIndex) => {
    const rowKind = monthly ? null : rowQualifier(row);
    const placed: Placed[] = [];
    const filled = new Set<number>();
    for (const time of times(row)) {
      const index = nearestIndex(
        columns.map((c) => c.cx),
        time.tok.cx,
      );
      const col = columns[index];
      if (!col?.prayer || Math.abs(col.cx - time.tok.cx) > 0.6 * pitch || filled.has(index))
        continue;
      filled.add(index);
      if (col.prayer === "jumuah") {
        jumuah.push([time]);
        continue;
      }
      const kind: TimetableKind = col.prayer === "sunrise" ? "adhan" : (rowKind ?? col.kind);
      placed.push({
        prayer: col.prayer,
        kind,
        clock: time.clock,
        raw: time.tok.text,
        tokenConf: time.tok.conf,
        layoutConf: Math.min(
          rowKind ? 1 : col.conf,
          col.unclear ? UNCLEAR_CONF : 1,
          time.tok.joined ? 0.9 : 1,
        ),
        assumed: rowKind ? false : col.assumed,
        ...(col.unclear && { unclear: true }),
      });
    }
    if (monthly) {
      // Expected-but-unreadable cells stay in the grid for review.
      columns.forEach((col, index) => {
        if (!col.prayer || col.prayer === "jumuah" || filled.has(index)) return;
        placed.push({
          prayer: col.prayer,
          kind: col.prayer === "sunrise" ? "adhan" : col.kind,
          clock: null,
          raw: "",
          tokenConf: 0,
          layoutConf: 0,
          assumed: col.assumed,
          ...(col.unclear && { unclear: true }),
        });
      });
      const read = dates?.dayOf(rowIndex) ?? null;
      // 28–31 → 1: the sheet runs into the next month (Ramadan sheets).
      if (read != null && lastRead != null && read < lastRead && lastRead >= 28 && read <= 3) {
        monthOffset += 1;
      }
      if (read != null) lastRead = read;
      const day = read ?? previousDay + 1;
      previousDay = day;
      out.push({
        day,
        ...(read == null && { dayInferred: true }),
        ...(monthOffset > 0 && { monthOffset }),
        placed,
      });
    } else {
      out.push({ day: null, placed });
    }
  });

  if (!monthly) {
    // Daily strip: "Begins" and "Jamaat" rows merge into one day; unlabeled second row = iqamah.
    const merged: Placed[] = [];
    const labelled = usedRows.map(rowQualifier);
    out.forEach((row, index) => {
      for (const p of row.placed) {
        if (p.prayer === "sunrise" || labelled[index]) merged.push(p);
        else if (out.length >= 2) {
          merged.push({
            ...p,
            kind: index === 0 ? "adhan" : "iqamah",
            layoutConf: Math.min(p.layoutConf, 0.9),
            assumed: false,
          });
        } else merged.push(p);
      }
    });
    return { rows: [{ day: null, placed: merged }], monthly: false, jumuah };
  }
  return {
    rows: out,
    monthly: true,
    jumuah,
    ...(dates && {
      dates: { columns: dates.columns, chosen: dates.chosen, ambiguous: dates.ambiguous },
    }),
    ...(monthOffset > 0 && { monthWrap: true }),
  };
}

// ── Entry point ─────────────────────────────────────────────────────────────

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function timetableDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `period` moved `offset` months on (a sheet that wraps into the next month). */
export function timetablePeriodFor(
  period: { year: number; month: number },
  offset = 0,
): { year: number; month: number } {
  const index = period.year * 12 + (period.month - 1) + offset;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** Begins-only sheet: at least this many prayers' single column tracks the calculated Adhan. */
const BEGINS_ONLY_MIN_PRAYERS = 3;

/**
 * Resolves calculated-time plausibility for assumed kinds: an unlabelled
 * column that tracks the Adhan is the Adhan. When most prayers' columns do,
 * the whole sheet lists start times only (L19) — then every assumed column is
 * the Adhan, even Fajr / Isha whose begins time follows a different method
 * than the user's (never saved as an iqamah). Returns true for such a sheet.
 */
function reclassifyAssumed(
  rows: Array<{ day: number | null; monthOffset?: number; placed: Placed[] }>,
  dateKeyOf: (day: number | null, monthOffset?: number) => string | null,
  options: ParseTimetableOptions,
): boolean {
  if (!options.calculated) return false;
  const votes = new Map<TimetablePrayer, { adhan: number; total: number }>();
  for (const row of rows) {
    const key = dateKeyOf(row.day, row.monthOffset);
    const calc = key ? options.calculated(key) : null;
    if (!calc) continue;
    for (const p of row.placed) {
      if (!p.assumed || !p.clock) continue;
      const target = calcOnTimeline(p.prayer, calc[p.prayer]);
      if (target == null) continue;
      const near = candidates(p, target).some((v) => Math.abs(v - target) <= 3);
      const vote = votes.get(p.prayer) ?? { adhan: 0, total: 0 };
      vote.total += 1;
      if (near) vote.adhan += 1;
      votes.set(p.prayer, vote);
    }
  }
  const tracks = (prayer: TimetablePrayer) => {
    const vote = votes.get(prayer);
    return !!vote && vote.total > 0 && vote.adhan / vote.total >= 0.8;
  };
  const tracking = [...votes.keys()].filter(tracks).length;
  const beginsOnly = tracking >= BEGINS_ONLY_MIN_PRAYERS;
  for (const row of rows) {
    for (const p of row.placed) {
      if (p.assumed && (beginsOnly || tracks(p.prayer))) {
        p.kind = "adhan";
        p.layoutConf = Math.max(p.layoutConf, 0.85);
      }
    }
  }
  return beginsOnly;
}

/** Same khutbah / iqamah slot read more than once (a monthly Jumu'ah column) → one slot. */
function dedupeJumuah(slots: TimetableJumuah[]): TimetableJumuah[] {
  const byKey = new Map<string, TimetableJumuah>();
  for (const slot of slots) {
    const key = `${slot.khutbahAt ?? ""}|${slot.iqamahAt ?? ""}`;
    const existing = byKey.get(key);
    if (!existing) byKey.set(key, { ...slot });
    else {
      existing.confidence = Math.max(existing.confidence, slot.confidence);
      existing.needsReview = existing.needsReview && slot.needsReview;
    }
  }
  return [...byKey.values()];
}

/** Parses on-device OCR output into a reviewable timetable. */
export function parseTimetable(
  ocr: OcrResult,
  options: ParseTimetableOptions = {},
): ParsedTimetable {
  const threshold = options.reviewThreshold ?? 0.8;
  const { rows: geoRows, skewDegrees } = prepareRows(ocr.tokens);
  const itemRows: ItemRow[] = geoRows.map((row: Row) => ({
    cy: row.cy,
    items: row.tokens.map(classify),
  }));
  const hint = monthHint(itemRows);
  const empty: ParsedTimetable = {
    layout: "none",
    orientation: null,
    rows: [],
    jumuah: [],
    monthHint: hint,
    skewDegrees,
  };

  const reference = options.referenceDate;
  const year = options.year ?? hint.year ?? reference?.year;
  const month = options.month ?? hint.month ?? reference?.month;

  // One prayer per row when ≥ 3 different prayers each label a line with times.
  const rowPrayers = new Set<string>();
  for (const row of itemRows) {
    if (times(row).length === 0) continue;
    for (const p of prayerLabels(row))
      if (p.label.prayer !== "jumuah") rowPrayers.add(p.label.prayer);
  }

  if (rowPrayers.size >= 3) {
    const { placed, jumuah } = parseRowsLayout(itemRows);
    const dateKey = reference
      ? timetableDateKey(reference.year, reference.month, reference.day)
      : null;
    const rows = [{ day: null, placed }];
    const beginsOnly = reclassifyAssumed(rows, () => dateKey, options);
    const hasIqamah = placed.some((p) => p.kind === "iqamah");
    return {
      ...empty,
      layout: placed.length ? "daily" : "none",
      orientation: "rows",
      rows: placed.length ? [finishRow(placed, null, dateKey, options, hasIqamah)] : [],
      jumuah: dedupeJumuah(jumuah.flatMap((items) => jumuahSlots(items, threshold))),
      ...(beginsOnly && !hasIqamah && { beginsOnly: true }),
    };
  }

  const columns = parseColumnsLayout(itemRows, options.dateColumn);
  if (!columns) return empty;
  const limitOf = (offset = 0): number => {
    if (!columns.monthly || !year || !month) return 31;
    const period = timetablePeriodFor({ year, month }, offset);
    return daysInMonth(period.year, period.month);
  };
  const dateKeyOf = (day: number | null, offset = 0): string | null => {
    if (day == null)
      return reference ? timetableDateKey(reference.year, reference.month, reference.day) : null;
    if (!year || !month || day > limitOf(offset)) return null;
    const period = timetablePeriodFor({ year, month }, offset);
    return timetableDateKey(period.year, period.month, day);
  };
  const beginsOnly = reclassifyAssumed(columns.rows, dateKeyOf, options);
  const rows = columns.rows
    .filter(
      (row) =>
        row.placed.length > 0 &&
        (row.day == null || (row.day >= 1 && row.day <= limitOf(row.monthOffset))),
    )
    .map((row) => {
      const hasIqamah = row.placed.some((p) => p.kind === "iqamah");
      const finished = finishRow(
        row.placed,
        row.day,
        dateKeyOf(row.day, row.monthOffset),
        options,
        hasIqamah,
      );
      return {
        ...finished,
        ...(row.dayInferred && { dayInferred: true }),
        ...(row.monthOffset && { monthOffset: row.monthOffset }),
      };
    });
  const anyIqamah = rows.some((row) => row.cells.some((c) => c.kind === "iqamah"));
  return {
    ...empty,
    layout: rows.length === 0 ? "none" : columns.monthly ? "monthly" : "daily",
    orientation: "columns",
    rows,
    jumuah: dedupeJumuah(columns.jumuah.flatMap((items) => jumuahSlots(items, threshold))),
    ...(columns.dates && {
      dateColumns: columns.dates.columns,
      dateColumn: columns.dates.chosen,
      dateColumnAmbiguous: columns.dates.ambiguous,
    }),
    ...(columns.monthWrap && { monthWrap: true }),
    ...(beginsOnly && !anyIqamah && { beginsOnly: true }),
  };
}
