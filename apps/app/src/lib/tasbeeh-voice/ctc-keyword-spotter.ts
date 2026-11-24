/**
 * CTC keyword spotter (NF-3.20 step 4). Pure; no imports — the eval script runs
 * this exact file in Node.
 *
 * Token passing over a phrase *lattice*: the phrase's folded text, with every
 * vocab piece that matches it at each position (`phrase-tokens.json`). A path
 * may use any segmentation of the phrase into pieces, harakat-only pieces
 * ("fillers") may be emitted anywhere after the first piece, and CTC blanks /
 * repeats are allowed — so the search does not depend on the exact SentencePiece
 * segmentation (the tokenizer model is not part of the pin).
 *
 * "Any audio before and after": a fresh token enters the phrase at every frame,
 * and every score is RELATIVE to the best free path (the frame's max
 * log-probability). A token's score is therefore the log-likelihood ratio of
 * "the phrase was said here" against "whatever the model liked best here" — 0 at
 * best, more negative the less the audio fits. Back-to-back repeats are separate
 * entries, so they are found without a pause between them.
 */

export type LogprobMatrix = {
  logprobs: Float32Array;
  timeSteps: number;
  vocabSize: number;
};

/** Generated lattice for one phrase variant (`phrase-tokens.json`). */
export type LatticeVariant = {
  id: string;
  text: string;
  /** [position, pieceId, length] */
  edges: readonly (readonly [number, number, number])[] | readonly number[][];
};

export type SpotterVocab = {
  blankId: number;
  /** Piece ids that fold to "" (pure harakat). */
  fillers: readonly number[];
};

export type SpotHit = {
  /** First frame of the phrase (inclusive), window-relative. */
  startFrame: number;
  /** Last frame of the phrase (inclusive), window-relative. */
  endFrame: number;
  /**
   * Log-likelihood ratio of the phrase path vs the free path over the span,
   * divided by the number of pieces the path emitted (≤ 0; closer to 0 = surer).
   * Per-piece, not per-frame: dividing by frames would let a long run of blanks
   * dilute a forced, wrong path until silence "matched".
   */
  score: number;
  /** Mean per-piece log-probability of the pieces on the path (≤ 0). */
  pieceScore: number;
  variant: string;
};

type Edge = { pos: number; id: number; end: number };

type CompiledVariant = {
  id: string;
  length: number;
  edges: Edge[];
  /** edges indexed by start position */
  byStart: Edge[][];
};

export type CompiledPhrase = {
  variants: CompiledVariant[];
};

export function compilePhrase(variants: readonly LatticeVariant[]): CompiledPhrase {
  return {
    variants: variants.map((variant) => {
      const length = variant.text.length;
      const edges: Edge[] = (variant.edges as readonly (readonly number[])[]).map(
        ([pos, id, len]) => ({ pos, id, end: pos + len }),
      );
      const byStart: Edge[][] = Array.from({ length: length + 1 }, () => []);
      for (const edge of edges) byStart[edge.pos].push(edge);
      return { id: variant.id, length, edges, byStart };
    }),
  };
}

type Token = {
  /** Relative score (Σ lp − Σ maxLp) */
  score: number;
  start: number;
  /** Σ lp of emitted (non-blank) pieces and their count, for pieceScore. */
  pieceSum: number;
  pieces: number;
};

const EMPTY: Token = { score: -Infinity, start: -1, pieceSum: 0, pieces: 0 };

function better(a: Token, b: Token): Token {
  return b.score > a.score ? b : a;
}

export type SpotOptions = {
  /** Reject paths whose per-piece LLR (`SpotHit.score`) is below this. */
  minScore: number;
  /** Minimum phrase duration in frames. */
  minFrames?: number;
  /** Maximum phrase duration in frames (bounds the search). */
  maxFrames?: number;
};

/**
 * Find every candidate occurrence of a phrase in one window of CTC output.
 * Overlapping candidates are NOT merged here — `hit-dedupe.ts` does that by
 * absolute time, across windows.
 */
export function spotPhrase(
  matrix: LogprobMatrix,
  phrase: CompiledPhrase,
  vocab: SpotterVocab,
  options: SpotOptions,
): SpotHit[] {
  const { logprobs, timeSteps, vocabSize } = matrix;
  const minFrames = options.minFrames ?? 2;
  const maxFrames = options.maxFrames ?? Number.POSITIVE_INFINITY;
  const hits: SpotHit[] = [];

  for (const variant of phrase.variants) {
    const { edges, length } = variant;
    // State tokens: `none[p]` = at text position p after a blank / filler;
    // `edge[i]` = at edges[i].end having just emitted edges[i].id.
    let none: Token[] = new Array(length + 1).fill(EMPTY);
    let edgeTokens: Token[] = new Array(edges.length).fill(EMPTY);
    // Edges ending at each position (for "from edge state at p").
    const endingAt: number[][] = Array.from({ length: length + 1 }, () => []);
    edges.forEach((edge, i) => {
      endingAt[edge.end].push(i);
    });

    for (let t = 0; t < timeSteps; t++) {
      const offset = t * vocabSize;
      let maxLp = -Infinity;
      for (let v = 0; v < vocabSize; v++) {
        const value = logprobs[offset + v];
        if (value > maxLp) maxLp = value;
      }
      const blankLp = logprobs[offset + vocab.blankId];
      let fillerLp = -Infinity;
      for (const f of vocab.fillers) {
        const value = logprobs[offset + f];
        if (value > fillerLp) fillerLp = value;
      }
      const stayLp = Math.max(blankLp, fillerLp);

      const nextNone: Token[] = new Array(length + 1).fill(EMPTY);
      const nextEdge: Token[] = new Array(edges.length).fill(EMPTY);

      // Best token sitting at each position before this frame (any last piece).
      const atPos: Token[] = new Array(length + 1).fill(EMPTY);
      for (let p = 1; p <= length; p++) {
        let best = none[p];
        for (const i of endingAt[p]) best = better(best, edgeTokens[i]);
        atPos[p] = best;
      }
      // Fresh entry at position 0 for this frame (any audio before).
      atPos[0] = { score: 0, start: t, pieceSum: 0, pieces: 0 };

      // Stay (blank / filler) → none state at the same position (not at 0).
      for (let p = 1; p <= length; p++) {
        const from = atPos[p];
        if (from.score === -Infinity) continue;
        nextNone[p] = { ...from, score: from.score + stayLp - maxLp };
      }

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const lp = logprobs[offset + edge.id];
        const gain = lp - maxLp;
        // Repeat of the same piece (CTC collapse).
        let best: Token = EMPTY;
        const self = edgeTokens[i];
        if (self.score > -Infinity) best = { ...self, score: self.score + gain };
        // Enter from the position the piece starts at (after blank/filler or another piece).
        let from = none[edge.pos];
        if (edge.pos === 0) from = atPos[0];
        else {
          for (const j of endingAt[edge.pos]) {
            if (edges[j].id !== edge.id) from = better(from, edgeTokens[j]);
          }
        }
        if (from.score > -Infinity) {
          const entered: Token = {
            score: from.score + gain,
            start: from.start,
            pieceSum: from.pieceSum + lp,
            pieces: from.pieces + 1,
          };
          best = better(best, entered);
        }
        if (best.score > -Infinity && t - best.start + 1 <= maxFrames) nextEdge[i] = best;
      }

      none = nextNone;
      edgeTokens = nextEdge;

      // Completed phrase at this frame?
      let done: Token = none[length];
      for (const i of endingAt[length]) done = better(done, edgeTokens[i]);
      if (done.score === -Infinity) continue;
      const frames = t - done.start + 1;
      if (frames < minFrames) continue;
      const score = done.score / Math.max(1, done.pieces);
      if (score < options.minScore) continue;
      hits.push({
        startFrame: done.start,
        endFrame: t,
        score,
        pieceScore: done.pieces ? done.pieceSum / done.pieces : -Infinity,
        variant: variant.id,
      });
    }
  }
  return hits;
}

/* ------------------------------------------------------------------------ */
/* Alternative for spike S1: greedy decode + fuzzy match on folded text.      */
/* ------------------------------------------------------------------------ */

export type GreedyChar = { ch: string; frame: number };

/** Collapse a greedy CTC path into folded characters with the frame each began. */
export function greedyChars(
  matrix: LogprobMatrix,
  pieceText: (id: number) => string,
  blankId: number,
): GreedyChar[] {
  const { logprobs, timeSteps, vocabSize } = matrix;
  const out: GreedyChar[] = [];
  let prev = -1;
  for (let t = 0; t < timeSteps; t++) {
    const offset = t * vocabSize;
    let best = 0;
    let bestValue = logprobs[offset];
    for (let v = 1; v < vocabSize; v++) {
      if (logprobs[offset + v] > bestValue) {
        bestValue = logprobs[offset + v];
        best = v;
      }
    }
    if (best !== prev && best !== blankId) {
      for (const ch of pieceText(best)) out.push({ ch, frame: t });
    }
    prev = best;
  }
  return out;
}

/**
 * Semi-global edit-distance search of `text` in the greedy character stream.
 * Returns non-overlapping matches whose normalised distance ≤ `maxDistance`.
 */
export function greedyFuzzySpot(
  stream: readonly GreedyChar[],
  text: string,
  maxDistance: number,
  variant = "base",
): SpotHit[] {
  const pattern = text.trim();
  const m = pattern.length;
  const n = stream.length;
  if (!m || !n) return [];
  // dist[i][j]: pattern[0..i) vs stream ending at j, free start.
  let prevRow = new Array(n + 1).fill(0);
  const startOf: number[][] = [Array.from({ length: n + 1 }, (_, j) => j)];
  for (let i = 1; i <= m; i++) {
    const row = new Array(n + 1).fill(0);
    const start = new Array(n + 1).fill(0);
    row[0] = i;
    start[0] = 0;
    for (let j = 1; j <= n; j++) {
      const cost = pattern[i - 1] === stream[j - 1].ch ? 0 : 1;
      const diag = prevRow[j - 1] + cost;
      const up = prevRow[j] + 1;
      const left = row[j - 1] + 1;
      if (diag <= up && diag <= left) {
        row[j] = diag;
        start[j] = startOf[i - 1][j - 1];
      } else if (up <= left) {
        row[j] = up;
        start[j] = startOf[i - 1][j];
      } else {
        row[j] = left;
        start[j] = start[j - 1];
      }
    }
    startOf.push(start);
    prevRow = row;
  }
  const candidates: { s: number; e: number; d: number }[] = [];
  for (let j = 1; j <= n; j++) {
    const d = prevRow[j] / m;
    if (d <= maxDistance) candidates.push({ s: startOf[m][j], e: j - 1, d });
  }
  candidates.sort((a, b) => a.d - b.d || a.e - b.e);
  const taken: { s: number; e: number; d: number }[] = [];
  for (const c of candidates) {
    if (taken.some((k) => c.s <= k.e && k.s <= c.e)) continue;
    taken.push(c);
  }
  return taken
    .sort((a, b) => a.s - b.s)
    .map((c) => ({
      startFrame: stream[Math.min(c.s, n - 1)].frame,
      endFrame: stream[c.e].frame,
      score: -c.d,
      pieceScore: -c.d,
      variant,
    }));
}
