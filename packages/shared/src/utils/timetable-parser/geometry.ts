import { classifyLabel } from "./labels";
import { parseClockText, parseMeridiemToken } from "./normalise";
import type { OcrToken } from "./types";

/**
 * Steps 2–3 of the parser (geometry): word splitting, deskew, row clustering
 * by y-overlap, and joining split tokens ("5" ":" "12", "5:12" "PM") by box
 * adjacency. Pure and deterministic.
 */

export interface Tok {
  text: string;
  /** Confidence normalised to 0–1. */
  conf: number;
  /** Deskewed centre. */
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** True when several OCR tokens were joined into this one. */
  joined?: boolean;
}

export interface Row {
  tokens: Tok[];
  cy: number;
  h: number;
}

function normaliseConf(conf: number): number {
  if (!Number.isFinite(conf)) return 0.5;
  const value = conf > 1 ? conf / 100 : conf;
  return Math.min(1, Math.max(0, value));
}

const WORD_SPLIT = /\s+|(?<=\d)[-–—/|](?=\d)|[|]/;

/** Splits multi-word tokens (Vision returns phrases) into words with proportional boxes. */
function splitWords(token: OcrToken): OcrToken[] {
  const text = token.text.trim();
  if (!text) return [];
  if (!WORD_SPLIT.test(text)) return [{ ...token, text }];
  const out: OcrToken[] = [];
  const total = token.text.length || 1;
  const re = new RegExp(WORD_SPLIT.source, "g");
  let start = 0;
  const pushPart = (from: number, to: number) => {
    const part = token.text.slice(from, to).trim();
    if (!part) return;
    out.push({
      text: part,
      conf: token.conf,
      box: {
        x: token.box.x + (token.box.w * from) / total,
        y: token.box.y,
        w: (token.box.w * (to - from)) / total,
        h: token.box.h,
      },
    });
  };
  for (const match of token.text.matchAll(re)) {
    pushPart(start, match.index ?? 0);
    start = (match.index ?? 0) + match[0].length;
  }
  pushPart(start, token.text.length);
  return out;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
}

/**
 * Projection-profile deskew: the angle (−10°…10°, 0.5° steps) whose rotated
 * y-histogram is the most peaked — rows of a timetable line up.
 */
export function estimateSkew(tokens: Array<{ x: number; y: number; h: number }>): number {
  if (tokens.length < 4) return 0;
  const bin = Math.max(1, median(tokens.map((t) => t.h)) / 2);
  let best = 0;
  let bestScore = -1;
  for (let step = -20; step <= 20; step += 1) {
    const deg = step / 2;
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const counts = new Map<number, number>();
    for (const t of tokens) {
      const key = Math.round((t.y * cos - t.x * sin) / bin);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let score = 0;
    for (const count of counts.values()) score += count * count;
    if (
      score > bestScore + 1e-9 ||
      (Math.abs(score - bestScore) < 1e-9 && Math.abs(deg) < Math.abs(best))
    ) {
      best = deg;
      bestScore = score;
    }
  }
  return best;
}

function overlapRatio(aCy: number, aH: number, bCy: number, bH: number): number {
  const top = Math.max(aCy - aH / 2, bCy - bH / 2);
  const bottom = Math.min(aCy + aH / 2, bCy + bH / 2);
  return Math.max(0, bottom - top) / Math.max(1e-6, Math.min(aH, bH));
}

/** Clusters tokens into rows by vertical overlap ≥ 50%, each row sorted left → right. */
export function clusterRows(tokens: Tok[]): Row[] {
  const rows: Row[] = [];
  for (const tok of [...tokens].sort((a, b) => a.cy - b.cy)) {
    let target: Row | null = null;
    let bestRatio = 0.5;
    for (const row of rows) {
      const ratio = overlapRatio(tok.cy, tok.h, row.cy, row.h);
      if (ratio >= bestRatio) {
        bestRatio = ratio;
        target = row;
      }
    }
    if (target) {
      target.tokens.push(tok);
      target.cy = target.tokens.reduce((sum, t) => sum + t.cy, 0) / target.tokens.length;
      target.h = median(target.tokens.map((t) => t.h));
    } else {
      rows.push({ tokens: [tok], cy: tok.cy, h: tok.h });
    }
  }
  for (const row of rows) row.tokens.sort((a, b) => a.cx - b.cx);
  return rows.sort((a, b) => a.cy - b.cy);
}

const SEPARATOR_EDGE = /^[:.٫hH;]|[:.٫hH;]$/;

function gapBetween(a: Tok, b: Tok): number {
  return b.cx - b.w / 2 - (a.cx + a.w / 2);
}

function joinTokens(parts: Tok[], text: string): Tok {
  const left = Math.min(...parts.map((p) => p.cx - p.w / 2));
  const right = Math.max(...parts.map((p) => p.cx + p.w / 2));
  return {
    text,
    conf: Math.min(...parts.map((p) => p.conf)),
    cx: (left + right) / 2,
    cy: parts.reduce((sum, p) => sum + p.cy, 0) / parts.length,
    w: right - left,
    h: Math.max(...parts.map((p) => p.h)),
    joined: true,
  };
}

/** Joins "5" ":" "12" / "5:" "12" / "5" ".12" into one time token when the boxes touch. */
function joinSplitTimes(tokens: Tok[]): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < tokens.length) {
    let merged = false;
    for (const size of [3, 2]) {
      const parts = tokens.slice(i, i + size);
      if (parts.length < size) continue;
      const first = parts[0] as Tok;
      if (parseClockText(first.text)) break;
      const adjacent = parts.every(
        (p, k) => k === 0 || gapBetween(parts[k - 1] as Tok, p) <= 0.6 * Math.max(p.h, first.h),
      );
      if (!adjacent) continue;
      const hasSeparatorEdge = parts.some((p) => SEPARATOR_EDGE.test(p.text.trim()));
      if (!hasSeparatorEdge) continue;
      const text = parts.map((p) => p.text.trim()).join("");
      if (parseClockText(text)) {
        out.push(joinTokens(parts, text));
        i += size;
        merged = true;
        break;
      }
    }
    if (!merged) {
      out.push(tokens[i] as Tok);
      i += 1;
    }
  }
  return out;
}

/** Attaches a lone "PM" / "م" token to the neighbouring time (right first, then left). */
function attachMeridiem(tokens: Tok[]): Tok[] {
  const used = new Set<number>();
  const out = tokens.map((t) => ({ ...t }));
  for (let i = 0; i < out.length; i += 1) {
    const tok = out[i] as Tok;
    const clock = parseClockText(tok.text);
    if (!clock || clock.meridiem) continue;
    for (const j of [i + 1, i - 1]) {
      const other = out[j];
      if (!other || used.has(j) || !parseMeridiemToken(other.text)) continue;
      const gap = j > i ? gapBetween(tok, other) : gapBetween(other, tok);
      if (gap > 1.2 * Math.max(tok.h, other.h)) continue;
      tok.text = j > i ? `${tok.text} ${other.text}` : `${tok.text} ${other.text}`;
      used.add(j);
      break;
    }
  }
  return out.filter((_, index) => !used.has(index));
}

/** Joins two adjacent words that only form a label together ("Friday Prayer", RTL pairs too). */
function joinLabelPairs(tokens: Tok[]): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < tokens.length) {
    const a = tokens[i] as Tok;
    const b = tokens[i + 1];
    if (b && gapBetween(a, b) <= 1.5 * Math.max(a.h, b.h)) {
      const forward = classifyLabel(`${a.text}${b.text}`);
      const pair = forward ?? classifyLabel(`${b.text}${a.text}`);
      const aLabel = classifyLabel(a.text);
      const bLabel = classifyLabel(b.text);
      // Keep "Fajr" "Begins" as two labels — only join when the pair adds meaning.
      const bothMeaningful = aLabel && bLabel && aLabel.type !== "other" && bLabel.type !== "other";
      if (pair && !bothMeaningful) {
        out.push(joinTokens([a, b], forward ? `${a.text}${b.text}` : `${b.text}${a.text}`));
        i += 2;
        continue;
      }
    }
    out.push(a);
    i += 1;
  }
  return out;
}

export interface PreparedLayout {
  rows: Row[];
  skewDegrees: number;
}

/** OCR tokens → deskewed rows of cleaned tokens. */
export function prepareRows(raw: readonly OcrToken[]): PreparedLayout {
  const words = raw.flatMap(splitWords).filter((t) => t.box.w > 0 && t.box.h > 0);
  const centres = words.map((t) => ({
    x: t.box.x + t.box.w / 2,
    y: t.box.y + t.box.h / 2,
    h: t.box.h,
  }));
  const skewDegrees = estimateSkew(centres);
  const rad = (skewDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const toks: Tok[] = words.map((t, index) => {
    const c = centres[index] as { x: number; y: number };
    return {
      text: t.text,
      conf: normaliseConf(t.conf),
      cx: c.x * cos + c.y * sin,
      cy: c.y * cos - c.x * sin,
      w: t.box.w,
      h: t.box.h,
    };
  });
  const rows = clusterRows(toks).map((row) => ({
    ...row,
    tokens: joinLabelPairs(attachMeridiem(joinSplitTimes(row.tokens))),
  }));
  return { rows, skewDegrees };
}

export { median };
