/**
 * Exact rational arithmetic for the Mirath engine (NF-3.10). Shares are always
 * `BigInt` numerator/denominator pairs, reduced, with a positive denominator —
 * never floats. Floats appear only at the display edge (`toPercent`).
 */
export interface Rational {
  readonly n: bigint;
  readonly d: bigint;
}

const ZERO_N = BigInt(0);
const ONE_N = BigInt(1);

function abs(x: bigint): bigint {
  return x < ZERO_N ? -x : x;
}

export function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== ZERO_N) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === ZERO_N || b === ZERO_N) return ZERO_N;
  return abs(a * b) / gcd(a, b);
}

export function rat(n: bigint | number, d: bigint | number = 1): Rational {
  let nn = typeof n === "bigint" ? n : BigInt(n);
  let dd = typeof d === "bigint" ? d : BigInt(d);
  if (dd === ZERO_N) throw new RangeError("Rational with zero denominator");
  if (dd < ZERO_N) {
    nn = -nn;
    dd = -dd;
  }
  const g = gcd(nn, dd);
  return g > ONE_N ? { n: nn / g, d: dd / g } : { n: nn, d: dd };
}

export const ZERO: Rational = rat(0);
export const ONE: Rational = rat(1);

export const add = (a: Rational, b: Rational): Rational => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Rational, b: Rational): Rational => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Rational, b: Rational): Rational => rat(a.n * b.n, a.d * b.d);
export function div(a: Rational, b: Rational): Rational {
  if (b.n === ZERO_N) throw new RangeError("Division by zero");
  return rat(a.n * b.d, a.d * b.n);
}
export const cmp = (a: Rational, b: Rational): -1 | 0 | 1 => {
  const l = a.n * b.d;
  const r = b.n * a.d;
  return l < r ? -1 : l > r ? 1 : 0;
};
export const eq = (a: Rational, b: Rational): boolean => cmp(a, b) === 0;
export const isZero = (a: Rational): boolean => a.n === ZERO_N;
export const max = (a: Rational, b: Rational): Rational => (cmp(a, b) >= 0 ? a : b);
export const min = (a: Rational, b: Rational): Rational => (cmp(a, b) <= 0 ? a : b);
export const sum = (values: readonly Rational[]): Rational => values.reduce(add, ZERO);

/** "3/8", "1" or "0". */
export function toFractionString(a: Rational): string {
  return a.d === ONE_N ? a.n.toString() : `${a.n}/${a.d}`;
}

/** Parses "3/8" / "1" (fixtures, snapshots). */
export function parseFraction(text: string): Rational {
  const [n, d] = text.trim().split("/");
  if (!n || !/^-?\d+$/.test(n) || (d != null && !/^\d+$/.test(d))) {
    throw new SyntaxError(`Not a fraction: ${text}`);
  }
  return rat(BigInt(n), d == null ? ONE_N : BigInt(d));
}

/** Display-only percentage (2 decimals). */
export function toPercent(a: Rational): number {
  const scaled = (a.n * BigInt(10000)) / a.d; // basis points, truncated
  const rem = (a.n * BigInt(10000)) % a.d;
  const rounded = rem * BigInt(2) >= a.d ? scaled + ONE_N : scaled;
  return Number(rounded) / 100;
}
