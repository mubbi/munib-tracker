import type { CtcAlignment, Emission } from "./ctc-align";
import type { AyahLattice, ExpectedWord, LogprobMatrix, SpotterVocabIds, WordScore } from "./types";

/**
 * Goodness of pronunciation (NF-3.24 step 3). Pure; type-only imports.
 *
 * For each piece the forced alignment emitted, over its frames: the mean of
 * `log P(piece) − log P(best competitor)`. The competitor is the best class at
 * that frame that is NOT another way of writing the same text — pieces of the
 * lattice overlapping the same letters (`لَ` vs `ل`, `▁ال` vs `▁الْح`) and
 * harakat / alif fillers are excluded, the blank is included. Averaging over the
 * piece's frames is the duration normalisation; values are clipped to
 * ±{@link GOP_CLIP} so one very confident frame cannot dominate a word.
 *
 * A clearly recited piece wins its frame (GOP > 0). A substituted or dropped
 * piece is forced onto frames where something else wins (GOP < 0).
 */

export const GOP_CLIP = 20;

const clip = (x: number) => Math.max(-GOP_CLIP, Math.min(GOP_CLIP, x));

/** Ids that spell (part of) the same letters as `emission` — never its competitors. */
export function equivalentIds(lattice: AyahLattice, emission: Emission): Set<number> {
  const out = new Set<number>([emission.pieceId]);
  for (const [pos, id, len] of lattice.edges) {
    if (pos < emission.end && pos + len > emission.pos) out.add(id);
  }
  return out;
}

export function emissionGop(
  matrix: LogprobMatrix,
  emission: Emission,
  excluded: ReadonlySet<number>,
  vocab: SpotterVocabIds,
): number {
  const { logprobs, vocabSize: V } = matrix;
  const fillers = new Set(vocab.fillers);
  let sum = 0;
  let frames = 0;
  for (let t = emission.startFrame; t <= emission.endFrame; t++) {
    const o = t * V;
    const own = logprobs[o + emission.pieceId];
    let rival = Number.NEGATIVE_INFINITY;
    for (let v = 0; v < V; v++) {
      if (excluded.has(v) || fillers.has(v)) continue;
      const x = logprobs[o + v];
      if (x > rival) rival = x;
    }
    sum += clip(own - rival);
    frames += 1;
  }
  return frames ? sum / frames : -GOP_CLIP;
}

/** Word index that owns text position `pos` (binary search over word starts). */
function wordOf(lattice: AyahLattice, pos: number): number {
  let lo = 0;
  let hi = lattice.wordStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lattice.wordStarts[mid] <= pos) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Group piece GOPs into per-word scores (words in lattice order). */
export function wordScores(
  matrix: LogprobMatrix,
  words: readonly ExpectedWord[],
  lattice: AyahLattice,
  alignment: CtcAlignment,
  vocab: SpotterVocabIds,
  letterCount: (text: string) => number,
): WordScore[] {
  const gops: number[][] = words.map(() => []);
  const start: number[] = words.map(() => Number.POSITIVE_INFINITY);
  const end: number[] = words.map(() => -1);
  for (const emission of alignment.emissions) {
    const w = wordOf(lattice, emission.pos);
    gops[w].push(emissionGop(matrix, emission, equivalentIds(lattice, emission), vocab));
    start[w] = Math.min(start[w], emission.startFrame);
    end[w] = Math.max(end[w], emission.endFrame);
  }
  return words.map((word, w) => {
    const g = gops[w];
    const minGop = g.length ? Math.min(...g) : -GOP_CLIP;
    const meanGop = g.length ? g.reduce((a, b) => a + b, 0) / g.length : -GOP_CLIP;
    // A word with no emission of its own (only possible for an empty fold) borrows its neighbour's time.
    const startFrame = Number.isFinite(start[w]) ? start[w] : Math.max(0, end[w - 1] ?? 0);
    return {
      word: w,
      gops: g,
      minGop,
      meanGop,
      startFrame,
      endFrame: Math.max(startFrame, end[w]),
      chars: letterCount(word.text),
    };
  });
}
