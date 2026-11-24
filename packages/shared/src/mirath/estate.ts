import type { MirathEstateInput, MirathIssue, MirathNetEstate } from "./types";

/** Money is handled in integer minor units (cents) so totals add up exactly. */
const toCents = (value: number): bigint =>
  BigInt(Math.round((Number.isFinite(value) ? value : 0) * 100));
const fromCents = (cents: bigint): number => Number(cents) / 100;

/**
 * Order of claims on an estate (Qur'an 4:11–12 "after any bequest … or debt";
 * debt before bequest by consensus, Tirmidhi 2122): funeral (tajhiz) → debts
 * → bequests, capped at one third of what remains (Bukhari 2742) → heirs.
 */
export function computeNetEstate(estate: MirathEstateInput): {
  estate: MirathNetEstate;
  issues: MirathIssue[];
} {
  const issues: MirathIssue[] = [];
  const gross = toCents(estate.gross);
  const funeral = toCents(estate.funeral);
  const debts = toCents(estate.debts);
  const requested = toCents(estate.bequests);
  if ([gross, funeral, debts, requested].some((v) => v < BigInt(0))) {
    issues.push({ code: "estate_negative" });
  }
  let net = gross - funeral - debts;
  if (net < BigInt(0)) {
    issues.push({ code: "debts_exceed_estate" });
    net = BigInt(0);
  }
  const positiveRequested = requested > BigInt(0) ? requested : BigInt(0);
  // ⅓ cap: bequests × 3 ≤ net (exact; the cap itself is floored to a whole cent).
  const capped = positiveRequested * BigInt(3) > net;
  const bequests = capped ? net / BigInt(3) : positiveRequested;
  return {
    issues,
    estate: {
      currency: estate.currency,
      gross: fromCents(gross),
      funeral: fromCents(funeral),
      debts: fromCents(debts),
      net: fromCents(net),
      bequestsRequested: fromCents(positiveRequested),
      bequests: fromCents(bequests),
      bequestCapped: capped,
      distributable: fromCents(net - bequests),
    },
  };
}

/**
 * Splits `totalCents` by exact rational weights (largest-remainder method), so
 * the parts are whole cents and always sum to the total.
 */
export function allocateCents(
  totalCents: bigint,
  weights: ReadonlyArray<{ n: bigint; d: bigint }>,
): bigint[] {
  const floors = weights.map((w) => (totalCents * w.n) / w.d);
  const remainders = weights.map((w, i) => ({
    i,
    // remainder numerator over w.d — compare as fractions via cross-multiplication
    rn: totalCents * w.n - (floors[i] ?? BigInt(0)) * w.d,
    rd: w.d,
  }));
  let left = totalCents - floors.reduce((a, b) => a + b, BigInt(0));
  const order = remainders
    .filter((r) => r.rn > BigInt(0))
    .sort((a, b) => {
      const l = a.rn * b.rd;
      const r = b.rn * a.rd;
      return l > r ? -1 : l < r ? 1 : a.i - b.i;
    });
  const out = [...floors];
  for (const r of order) {
    if (left <= BigInt(0)) break;
    out[r.i] = (out[r.i] ?? BigInt(0)) + BigInt(1);
    left -= BigInt(1);
  }
  return out;
}

export const centsOf = toCents;
export const amountOf = fromCents;
