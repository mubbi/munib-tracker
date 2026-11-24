import type {
  MadhhabId,
  WasiyyahBequest,
  WasiyyahData,
  WasiyyahDebtLine,
  WasiyyahDebtSource,
  WasiyyahTrustLine,
} from "@munib-tracker/shared/types";

import { type DebtEntry, outstanding, roundMoney, type VowEntry } from "@/lib/debts/debts";
import type { ObligationLine } from "@/lib/debts/obligations";

/**
 * Wasiyyah (Islamic will) rules (NF-3.9). Order of claims on the estate:
 * funeral → debts → bequests (≤ ⅓ of what remains) → heirs.
 *
 * Bequest limit: Bukhari 2742 ("one third, and a third is much"). No bequest to
 * an heir: Abu Dawud 2870 / Tirmidhi 2120. Debts before bequests: Qur'an 4:11–12
 * ("after any bequest … or debt"; debt is paid first by consensus, Tirmidhi 2122).
 * Excess over ⅓ and bequests to an heir stand only with the heirs' consent after
 * death — the majority view, labelled as such in the UI (proof log
 * `docs/proofs/wasiyyah.md`).
 *
 * Madhhab-aware (NF-3.0a): whether zakat / fidyah / kaffarah still owed are paid
 * from the whole estate (Shafi'i, Hanbali) or only when bequeathed and then from
 * the one-third (Hanafi, Maliki) — `FIQH_DIFFERENCES` id `wasiyyah.debtsToAllah`.
 * With no school chosen, the stricter result (less room for other bequests) is
 * applied and labelled.
 */

/** Obligations owed to Allah (as opposed to people) for the madhhab difference above. */
export const DEBTS_TO_ALLAH: ReadonlySet<WasiyyahDebtSource> = new Set([
  "zakat",
  "fidyah",
  "kaffarah",
]);

export const ONE_THIRD = 1 / 3;
/** Float tolerance for money comparisons (one cent). */
const EPSILON = 0.005;

export function emptyWasiyyahData(today: string, currency: string): WasiyyahData {
  return {
    testator: { name: "", date: today },
    funeral: { sunnahRites: true, muslimCemetery: true, avoidInnovations: true },
    currency,
    debts: [],
    trusts: [],
    bequests: [],
    guardians: [],
    witnesses: ["", ""],
    sideBySideEnglish: false,
  };
}

// ── Validation ──────────────────────────────────────────────────────────────

export type WasiyyahIssueCode =
  /** Section 1 is required. */
  | "testator_name_required"
  /** Σ bequests > ⅓ of the net estate (blocking; excess needs heirs' consent). */
  | "over_third"
  /** A bequest to an heir the user hasn't acknowledged (blocking). */
  | "heir_unacknowledged"
  /** Acknowledged bequest to an heir — printed with the consent note. */
  | "heir_bequest"
  /** Fixed-amount bequests can't be checked without the estimated estate. */
  | "estate_needed"
  /** Funeral + debts exceed the estimated estate. */
  | "debts_exceed_estate"
  /** Lines in another currency (or without an amount) are not in the totals. */
  | "lines_excluded"
  /** Fewer than two witnesses named (Qur'an 5:106). */
  | "witnesses_missing";

export interface WasiyyahIssue {
  code: WasiyyahIssueCode;
  bequestId?: string;
}

/** `capital`: obligations to Allah paid from the whole estate; `third`: from the one-third. */
export type DebtsToAllahView = "capital" | "third";

export interface WasiyyahLimitView {
  view: DebtsToAllahView;
  netAfterDebts: number;
  /** ⅓ of the net (never below 0). */
  limit: number;
  /** Bequests counted against the third (+ obligations to Allah in the `third` view). */
  used: number;
  /** limit − used (negative when over). */
  room: number;
}

export interface WasiyyahComputation {
  estate: number | null;
  funeral: number;
  debtsToPeople: number;
  debtsToAllah: number;
  /** Confirmed lines left out of the totals (other currency or no amount). */
  excludedLines: number;
  school: MadhhabId | null;
  /** Which view drove the limit; `stricter` = no school chosen. */
  applied: DebtsToAllahView | "stricter";
  limitView: WasiyyahLimitView | null;
  /** Σ percent bequests (percent of the net). */
  percentTotal: number;
  /** Σ fixed-amount bequests. */
  amountTotal: number;
  errors: WasiyyahIssue[];
  warnings: WasiyyahIssue[];
}

function positive(value: number | undefined): number {
  return value != null && Number.isFinite(value) && value > 0 ? value : 0;
}

export function bequestAmount(bequest: WasiyyahBequest, net: number): number {
  if (bequest.percent != null && positive(bequest.percent) > 0) {
    return roundMoney((Math.min(100, bequest.percent) / 100) * Math.max(0, net));
  }
  return roundMoney(positive(bequest.amount));
}

/** The view that applies for a school (`null` → caller computes both). */
export function debtsToAllahViewFor(school: MadhhabId): DebtsToAllahView {
  return school === "shafii" || school === "hanbali" ? "capital" : "third";
}

function limitFor(
  view: DebtsToAllahView,
  estate: number,
  funeral: number,
  people: number,
  allah: number,
  bequests: readonly WasiyyahBequest[],
): WasiyyahLimitView {
  const netAfterDebts = roundMoney(estate - funeral - people - (view === "capital" ? allah : 0));
  const limit = roundMoney(Math.max(0, netAfterDebts) * ONE_THIRD);
  const bequestSum = bequests.reduce((sum, b) => sum + bequestAmount(b, netAfterDebts), 0);
  const used = roundMoney(bequestSum + (view === "third" ? allah : 0));
  return { view, netAfterDebts, limit, used, room: roundMoney(limit - used) };
}

export function computeWasiyyah(data: WasiyyahData, school: MadhhabId | null): WasiyyahComputation {
  const errors: WasiyyahIssue[] = [];
  const warnings: WasiyyahIssue[] = [];

  if (!data.testator.name.trim()) errors.push({ code: "testator_name_required" });

  let people = 0;
  let allah = 0;
  let excludedLines = 0;
  for (const line of data.debts) {
    if (!line.confirmed) continue;
    const sameCurrency = !line.currency || line.currency === data.currency;
    if (positive(line.amount) <= 0 || !sameCurrency) {
      // Counts (qaza, vows) carry no amount by design; only flag money lines we can't add up.
      if (positive(line.amount) > 0) excludedLines += 1;
      continue;
    }
    if (DEBTS_TO_ALLAH.has(line.source)) allah += positive(line.amount);
    else people += positive(line.amount);
  }
  people = roundMoney(people);
  allah = roundMoney(allah);
  if (excludedLines > 0) warnings.push({ code: "lines_excluded" });

  const estate =
    positive(data.estimatedEstate) > 0 ? roundMoney(positive(data.estimatedEstate)) : null;
  const funeral = roundMoney(positive(data.funeralCost));
  const percentTotal = data.bequests.reduce(
    (sum, b) => sum + Math.min(100, positive(b.percent)),
    0,
  );
  const amountTotal = roundMoney(
    data.bequests.reduce((sum, b) => sum + (positive(b.percent) > 0 ? 0 : positive(b.amount)), 0),
  );

  let applied: WasiyyahComputation["applied"] = school ? debtsToAllahViewFor(school) : "stricter";
  let limitView: WasiyyahLimitView | null = null;

  if (estate != null) {
    if (school) {
      limitView = limitFor(
        debtsToAllahViewFor(school),
        estate,
        funeral,
        people,
        allah,
        data.bequests,
      );
    } else {
      const capital = limitFor("capital", estate, funeral, people, allah, data.bequests);
      const third = limitFor("third", estate, funeral, people, allah, data.bequests);
      limitView = third.room < capital.room ? third : capital;
      applied = "stricter";
    }
    if (limitView.netAfterDebts < 0) warnings.push({ code: "debts_exceed_estate" });
    if (data.bequests.length > 0 && limitView.used > limitView.limit + EPSILON) {
      errors.push({ code: "over_third" });
    }
  } else {
    if (percentTotal > 100 * ONE_THIRD + 1e-9) errors.push({ code: "over_third" });
    if (
      amountTotal > 0 ||
      (allah > 0 && data.bequests.length > 0 && school !== "shafii" && school !== "hanbali")
    ) {
      warnings.push({ code: "estate_needed" });
    }
  }

  for (const bequest of data.bequests) {
    if (!bequest.isHeir) continue;
    if (bequest.heirAcknowledged) warnings.push({ code: "heir_bequest", bequestId: bequest.id });
    else errors.push({ code: "heir_unacknowledged", bequestId: bequest.id });
  }

  if (data.witnesses.filter((w) => w.trim()).length < 2)
    warnings.push({ code: "witnesses_missing" });

  return {
    estate,
    funeral,
    debtsToPeople: people,
    debtsToAllah: allah,
    excludedLines,
    school,
    applied,
    limitView,
    percentTotal,
    amountTotal,
    errors,
    warnings,
  };
}

export function canSaveWasiyyah(computation: WasiyyahComputation): boolean {
  return computation.errors.length === 0;
}

// ── Import from the debts record (NF-3.8) ────────────────────────────────────

const OBLIGATION_SOURCE: Record<ObligationLine["id"], WasiyyahDebtSource | null> = {
  qaza_salah: "qaza_salah",
  qaza_fast: "qaza_fast",
  zakat: "zakat",
  fidyah: "fidyah",
  kaffarah: "kaffarah",
  // Vows are imported one line per vow (their text), not as a count.
  vows: null,
};

/**
 * Section 3: open "I owe" debts + the religious obligations summary + each
 * unfulfilled vow. Re-importing refreshes amounts and keeps the user's
 * confirmations (matched by source + sourceId); manual lines are kept; imported
 * lines whose source is gone (paid, deleted) drop out.
 */
export function importDebtLines(
  existing: readonly WasiyyahDebtLine[],
  input: {
    debts: readonly DebtEntry[];
    obligations: readonly ObligationLine[];
    vows: readonly VowEntry[];
  },
): WasiyyahDebtLine[] {
  const prior = new Map(existing.map((l) => [`${l.source}:${l.sourceId ?? l.id}`, l]));
  const keep = (source: WasiyyahDebtSource, sourceId: string) =>
    prior.get(`${source}:${sourceId}`)?.confirmed ?? false;
  const lines: WasiyyahDebtLine[] = [];

  for (const d of input.debts) {
    if (d.direction !== "i_owe" || d.status !== "open") continue;
    const left = outstanding(d);
    lines.push({
      id: `debt:${d.id}`,
      source: "debt",
      sourceId: d.id,
      label: d.counterparty,
      ...(left != null ? { amount: left, currency: d.currency } : {}),
      confirmed: keep("debt", d.id),
    });
  }
  for (const o of input.obligations) {
    const source = OBLIGATION_SOURCE[o.id];
    if (!source) continue;
    lines.push({
      id: `${source}:${source}`,
      source,
      sourceId: source,
      label: "",
      ...(o.amount != null ? { amount: o.amount, currency: o.currency } : {}),
      ...(o.count != null ? { count: o.count } : {}),
      confirmed: keep(source, source),
    });
  }
  for (const v of input.vows) {
    if (v.fulfilled) continue;
    lines.push({
      id: `vow:${v.id}`,
      source: "vow",
      sourceId: v.id,
      label: v.text,
      confirmed: keep("vow", v.id),
    });
  }
  return [...lines, ...existing.filter((l) => l.source === "manual")];
}

/** Section 4: trusts I hold (`trust_held`, still open), keeping confirmations. */
export function importTrustLines(
  existing: readonly WasiyyahTrustLine[],
  debts: readonly DebtEntry[],
): WasiyyahTrustLine[] {
  const prior = new Map(existing.map((l) => [l.sourceId ?? l.id, l]));
  const imported = debts
    .filter((d) => d.direction === "trust_held" && d.status === "open")
    .map(
      (d): WasiyyahTrustLine => ({
        id: `trust:${d.id}`,
        sourceId: d.id,
        counterparty: d.counterparty,
        ...(d.item ? { item: d.item } : {}),
        ...(d.amount != null ? { amount: d.amount, currency: d.currency } : {}),
        confirmed: prior.get(d.id)?.confirmed ?? false,
      }),
    );
  return [...imported, ...existing.filter((l) => !l.sourceId)];
}

/** Total of open "I owe" balances in one currency (for the review nudge snapshot). */
export function openIOweTotal(debts: readonly DebtEntry[], currency: string): number {
  let total = 0;
  for (const d of debts) {
    if (d.direction !== "i_owe" || d.status !== "open" || d.currency !== currency) continue;
    total += outstanding(d) ?? 0;
  }
  return roundMoney(total);
}

/** Trims names and drops empty guardians / bequests before a version is saved. */
export function normalizeWasiyyahData(data: WasiyyahData): WasiyyahData {
  return {
    ...data,
    testator: { ...data.testator, name: data.testator.name.trim() },
    guardians: data.guardians.map((g) => g.trim()).filter(Boolean),
    executor: data.executor?.trim() || undefined,
    bequests: data.bequests
      .map((b) => ({
        ...b,
        beneficiary: b.beneficiary.trim(),
        purpose: b.purpose?.trim() || undefined,
      }))
      .filter((b) => b.beneficiary),
    witnesses: [data.witnesses[0].trim(), data.witnesses[1].trim()],
    funeral: { ...data.funeral, notes: data.funeral.notes?.trim() || undefined },
  };
}
