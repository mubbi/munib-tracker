import type { AyahLattice, LogprobMatrix, SpotterVocabIds } from "./types";

/**
 * CTC forced alignment (NF-3.24 step 2) — Viterbi over the ayah's piece
 * lattice, with optional blanks between pieces and free leading / trailing
 * audio. Pure; type-only imports (the eval script runs this exact file in Node).
 *
 * States: `N[p]` = at text position p after a blank / filler frame; `E[i]` = on
 * lattice edge i (emitting its piece, which may repeat over several frames);
 * plus a garbage state before and after the ayah, so a breath, the ta'awwudh or
 * silence around the ayah is not forced into it. The path must spell the whole
 * text, in order, with any segmentation the model prefers. Two equal pieces in a
 * row need a blank between them (CTC collapse).
 *
 * Scores are relative to each frame's best class (`lp − maxLp` ≤ 0), so the
 * alignment `score` is a log-likelihood ratio against "whatever the model liked
 * best here", divided by the number of pieces emitted — 0 at best, very negative
 * when the audio is a different passage.
 */

export type Emission = {
  /** Lattice edge index. */
  edge: number;
  pieceId: number;
  /** Text span [pos, end) the piece spells. */
  pos: number;
  end: number;
  /** First / last frame (inclusive). */
  startFrame: number;
  endFrame: number;
};

export type CtcAlignment = {
  emissions: Emission[];
  /** Σ relative log-prob over the aligned span ÷ pieces emitted (≤ 0). */
  score: number;
  timeSteps: number;
};

export type AlignOptions = {
  /** Relative score per garbage frame (≤ 0). 0 = leading / trailing audio is free. */
  garbagePenalty?: number;
};

const NEG = Number.NEGATIVE_INFINITY;

export function forceAlign(
  matrix: LogprobMatrix,
  lattice: AyahLattice,
  vocab: SpotterVocabIds,
  options: AlignOptions = {},
): CtcAlignment | null {
  const { logprobs, timeSteps: T, vocabSize: V } = matrix;
  const len = lattice.text.length;
  const edges = lattice.edges;
  const E = edges.length;
  if (T === 0 || len === 0 || E === 0) return null;
  const garbage = Math.min(0, options.garbagePenalty ?? 0);
  const nState = (p: number) => p;
  const eState = (i: number) => len + 1 + i;
  const G0 = len + 1 + E;
  const G1 = G0 + 1;
  const NS = G1 + 1;

  const endingAt: number[][] = Array.from({ length: len + 1 }, () => []);
  edges.forEach(([pos, , l], i) => {
    endingAt[pos + l].push(i);
  });

  const maxLp = new Float64Array(T);
  const stayLp = new Float64Array(T);
  for (let t = 0; t < T; t++) {
    const o = t * V;
    let m = NEG;
    for (let v = 0; v < V; v++) {
      const x = logprobs[o + v];
      if (x > m) m = x;
    }
    let stay = logprobs[o + vocab.blankId];
    for (const f of vocab.fillers) {
      const x = logprobs[o + f];
      if (x > stay) stay = x;
    }
    maxLp[t] = m;
    stayLp[t] = stay - m;
  }
  const edgeEmit = (i: number, t: number) => logprobs[t * V + edges[i][1]] - maxLp[t];
  const emitOf = (s: number, t: number): number => {
    if (s <= len) return stayLp[t];
    if (s >= G0) return garbage;
    return edgeEmit(s - len - 1, t);
  };

  const back = new Int32Array(T * NS).fill(-1);
  let prev = new Float64Array(NS).fill(NEG);
  let cur = new Float64Array(NS);
  // Frame 0: garbage, the leading blank, or a first piece.
  prev[G0] = garbage;
  prev[nState(0)] = stayLp[0];
  for (let i = 0; i < E; i++) {
    if (edges[i][0] === 0) {
      prev[eState(i)] = edgeEmit(i, 0);
      back[eState(i)] = G0;
    }
  }

  // Best and best-with-a-different-piece among edges ending at each position.
  const topVal = new Float64Array(len + 1);
  const topIdx = new Int32Array(len + 1);
  const secVal = new Float64Array(len + 1);
  const secIdx = new Int32Array(len + 1);

  for (let t = 1; t < T; t++) {
    const row = t * NS;
    cur.fill(NEG);
    for (let p = 0; p <= len; p++) {
      let tv = NEG;
      let ti = -1;
      for (const i of endingAt[p]) {
        if (prev[eState(i)] > tv) {
          tv = prev[eState(i)];
          ti = i;
        }
      }
      let sv = NEG;
      let si = -1;
      if (ti >= 0) {
        const topId = edges[ti][1];
        for (const i of endingAt[p]) {
          if (edges[i][1] !== topId && prev[eState(i)] > sv) {
            sv = prev[eState(i)];
            si = i;
          }
        }
      }
      topVal[p] = tv;
      topIdx[p] = ti;
      secVal[p] = sv;
      secIdx[p] = si;
    }

    cur[G0] = prev[G0] + garbage;
    back[row + G0] = G0;

    for (let p = 0; p <= len; p++) {
      let best = prev[nState(p)];
      let from = nState(p);
      if (p === 0 && prev[G0] > best) {
        best = prev[G0];
        from = G0;
      }
      if (topVal[p] > best) {
        best = topVal[p];
        from = eState(topIdx[p]);
      }
      if (best === NEG) continue;
      cur[nState(p)] = best + stayLp[t];
      back[row + nState(p)] = from;
    }

    for (let i = 0; i < E; i++) {
      const [pos, id] = edges[i];
      const s = eState(i);
      let best = prev[s];
      let from = s;
      if (prev[nState(pos)] > best) {
        best = prev[nState(pos)];
        from = nState(pos);
      }
      if (pos === 0 && prev[G0] > best) {
        best = prev[G0];
        from = G0;
      }
      const useTop = topIdx[pos] >= 0 && edges[topIdx[pos]][1] !== id;
      const direct = useTop ? topVal[pos] : secVal[pos];
      const directIdx = useTop ? topIdx[pos] : secIdx[pos];
      if (directIdx >= 0 && direct > best) {
        best = direct;
        from = eState(directIdx);
      }
      if (best === NEG) continue;
      cur[s] = best + edgeEmit(i, t);
      back[row + s] = from;
    }

    let g1 = prev[G1];
    let g1From = G1;
    if (prev[nState(len)] > g1) {
      g1 = prev[nState(len)];
      g1From = nState(len);
    }
    if (topVal[len] > g1) {
      g1 = topVal[len];
      g1From = eState(topIdx[len]);
    }
    if (g1 > NEG) {
      cur[G1] = g1 + garbage;
      back[row + G1] = g1From;
    }

    const swap = prev;
    prev = cur;
    cur = swap;
  }

  // Best end: trailing garbage, the final blank, or a piece ending at the text end.
  let state = G1;
  if (prev[nState(len)] > prev[state]) state = nState(len);
  for (const i of endingAt[len]) if (prev[eState(i)] > prev[state]) state = eState(i);
  if (prev[state] === NEG) return null;

  const path = new Int32Array(T);
  for (let t = T - 1; t >= 0; t--) {
    path[t] = state;
    if (t === 0) break;
    state = back[t * NS + state];
    if (state < 0) return null;
  }

  const emissions: Emission[] = [];
  let first = -1;
  let last = -1;
  for (let t = 0; t < T; t++) {
    const s = path[t];
    if (s <= len || s >= G0) continue;
    const i = s - len - 1;
    const open = emissions[emissions.length - 1];
    if (open && open.edge === i && open.endFrame === t - 1) open.endFrame = t;
    else {
      const [pos, pieceId, l] = edges[i];
      emissions.push({ edge: i, pieceId, pos, end: pos + l, startFrame: t, endFrame: t });
    }
    if (first < 0) first = t;
    last = t;
  }
  if (!emissions.length) return null;
  let total = 0;
  for (let t = first; t <= last; t++) total += emitOf(path[t], t);
  return { emissions, score: total / emissions.length, timeSteps: T };
}
