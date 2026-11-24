/**
 * Length-tolerant dynamic time warping for "teach a zikr" counting (NF-3.20,
 * D48–D51). Pure; no imports (the Node eval script loads this file directly).
 *
 * Features are `frames × dim` row-major matrices (`features.ts`). The frame cost
 * is the Euclidean distance divided by √dim, so a perfect match costs 0 and two
 * unrelated normalised frames cost about √2.
 *
 * Both searches use path-length normalisation: every cell keeps the running
 * cost and the number of steps on its best path, and a predecessor is chosen by
 * the lower AVERAGE cost. That keeps short and long paths comparable, so one
 * threshold works for slow and fast repeats.
 */

export type Matrix = { frames: number; dim: number; data: Float32Array };

export function frameCost(a: Matrix, i: number, b: Matrix, j: number): number {
  const dim = a.dim;
  const ao = i * dim;
  const bo = j * dim;
  let sum = 0;
  for (let k = 0; k < dim; k++) {
    const d = a.data[ao + k] - b.data[bo + k];
    sum += d * d;
  }
  return Math.sqrt(sum / dim);
}

/** Speeds a repeat may differ from the taught sample by (0.5× … 2×). */
export const MIN_LENGTH_RATIO = 0.5;
export const MAX_LENGTH_RATIO = 2;

/**
 * Average cost of the best full alignment of `a` onto `b` (both ends anchored).
 * Infinity when their lengths are too far apart to be the same phrase.
 */
export function dtwDistance(a: Matrix, b: Matrix): number {
  const m = a.frames;
  const n = b.frames;
  if (m === 0 || n === 0) return Number.POSITIVE_INFINITY;
  const ratio = n / m;
  if (ratio < MIN_LENGTH_RATIO || ratio > MAX_LENGTH_RATIO) return Number.POSITIVE_INFINITY;
  let prevCost = new Float64Array(m);
  let prevLen = new Float64Array(m);
  let curCost = new Float64Array(m);
  let curLen = new Float64Array(m);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      const c = frameCost(a, i, b, j);
      if (i === 0 && j === 0) {
        curCost[i] = c;
        curLen[i] = 1;
        continue;
      }
      let bestCost = Number.POSITIVE_INFINITY;
      let bestLen = 1;
      let bestAvg = Number.POSITIVE_INFINITY;
      const consider = (cost: number, len: number) => {
        const avg = (cost + c) / (len + 1);
        if (avg < bestAvg) {
          bestAvg = avg;
          bestCost = cost + c;
          bestLen = len + 1;
        }
      };
      if (j > 0 && i > 0) consider(prevCost[i - 1], prevLen[i - 1]);
      if (j > 0) consider(prevCost[i], prevLen[i]);
      if (i > 0) consider(curCost[i - 1], curLen[i - 1]);
      curCost[i] = bestCost;
      curLen[i] = bestLen;
    }
    [prevCost, curCost] = [curCost, prevCost];
    [prevLen, curLen] = [curLen, prevLen];
  }
  return prevCost[m - 1] / prevLen[m - 1];
}

export type SubsequenceMatch = {
  /** First query frame of the match. */
  start: number;
  /** Query frame after the match (exclusive). */
  end: number;
  /** Average frame cost along the path (lower = closer). */
  cost: number;
};

export type SubsequenceOptions = {
  /** Only matches at or below this average cost are returned. */
  maxCost: number;
  /** Shortest / longest match relative to the template (speed tolerance). */
  minLengthRatio?: number;
  maxLengthRatio?: number;
  /** Two matches may share at most this fraction of the shorter one. */
  maxOverlap?: number;
};

/**
 * Every place the template occurs inside the query (subsequence DTW: the
 * template must be used whole, the query may start and end anywhere). Returns
 * non-overlapping matches, best first, then sorted by time — so a burst that
 * holds two fast repeats yields two matches.
 */
export function findSubsequenceMatches(
  template: Matrix,
  query: Matrix,
  options: SubsequenceOptions,
): SubsequenceMatch[] {
  return pickNonOverlapping(subsequenceCandidates(template, query, options), options.maxOverlap);
}

/** Every end frame whose best path is under `maxCost` (overlapping; see `pickNonOverlapping`). */
export function subsequenceCandidates(
  template: Matrix,
  query: Matrix,
  options: SubsequenceOptions,
): SubsequenceMatch[] {
  const m = template.frames;
  const n = query.frames;
  const minRatio = options.minLengthRatio ?? MIN_LENGTH_RATIO;
  const maxRatio = options.maxLengthRatio ?? MAX_LENGTH_RATIO;
  if (m === 0 || n < Math.ceil(m * minRatio)) return [];
  let prevCost = new Float64Array(m);
  let prevLen = new Float64Array(m);
  let prevStart = new Int32Array(m);
  let curCost = new Float64Array(m);
  let curLen = new Float64Array(m);
  let curStart = new Int32Array(m);
  const candidates: SubsequenceMatch[] = [];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      const c = frameCost(template, i, query, j);
      let bestCost = Number.POSITIVE_INFINITY;
      let bestLen = 1;
      let bestStart = j;
      let bestAvg = Number.POSITIVE_INFINITY;
      const consider = (cost: number, len: number, start: number) => {
        const avg = (cost + c) / (len + 1);
        if (avg < bestAvg) {
          bestAvg = avg;
          bestCost = cost + c;
          bestLen = len + 1;
          bestStart = start;
        }
      };
      if (i === 0) {
        // Free start anywhere in the query.
        bestAvg = c;
        bestCost = c;
        bestLen = 1;
        bestStart = j;
        if (j > 0) consider(prevCost[0], prevLen[0], prevStart[0]);
      } else {
        if (j > 0) consider(prevCost[i - 1], prevLen[i - 1], prevStart[i - 1]);
        if (j > 0) consider(prevCost[i], prevLen[i], prevStart[i]);
        consider(curCost[i - 1], curLen[i - 1], curStart[i - 1]);
      }
      curCost[i] = bestCost;
      curLen[i] = bestLen;
      curStart[i] = bestStart;
    }
    const cost = curCost[m - 1] / curLen[m - 1];
    const length = j + 1 - curStart[m - 1];
    if (cost <= options.maxCost && length >= m * minRatio && length <= m * maxRatio) {
      candidates.push({ start: curStart[m - 1], end: j + 1, cost });
    }
    [prevCost, curCost] = [curCost, prevCost];
    [prevLen, curLen] = [curLen, prevLen];
    [prevStart, curStart] = [curStart, prevStart];
  }
  return candidates;
}

/** Greedy: lowest cost first, dropping anything that overlaps an accepted match. */
export function pickNonOverlapping<T extends SubsequenceMatch>(
  candidates: readonly T[],
  maxOverlap = 0.25,
): T[] {
  const accepted: T[] = [];
  for (const candidate of [...candidates].sort((a, b) => a.cost - b.cost)) {
    const clashes = accepted.some((other) => {
      const overlap = Math.min(other.end, candidate.end) - Math.max(other.start, candidate.start);
      if (overlap <= 0) return false;
      const shorter = Math.min(other.end - other.start, candidate.end - candidate.start);
      return overlap > shorter * maxOverlap;
    });
    if (!clashes) accepted.push(candidate);
  }
  return accepted.sort((a, b) => a.start - b.start);
}
