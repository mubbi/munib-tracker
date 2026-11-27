/**
 * Parser for the Quranic Arabic Corpus morphology file (v0.4). Pure and
 * streaming: feed lines in any chunking and complete words come out in order,
 * so the builder can yield to the UI between chunks.
 *
 * Row format (tab-separated, after the `#` copyright blocks and the header row):
 *
 *     (surah:ayah:word:segment)  FORM  TAG  FEATURES
 *
 * FEATURES is `|`-separated; the first item is PREFIX / STEM / SUFFIX. A word's
 * root and lemma live on its STEM segment (`ROOT:rHm`, `LEM:r~aHiym`). Words
 * whose stem has no `ROOT:` (particles, pronouns, some proper nouns) are rootless
 * in the dataset — we never guess one.
 */

/** One stem of a word (almost always exactly one per word). */
export type QacStem = {
  /** Buckwalter root (`rHm`), or null when the dataset gives none. */
  root: string | null;
  /** Buckwalter lemma (`r~aHiym`), or null. */
  lemma: string | null;
  /** Part-of-speech tag of the stem segment (N, V, PN, …). */
  pos: string;
};

export type QacWord = {
  surah: number;
  ayah: number;
  /** 1-based word number within the ayah, as the corpus numbers it. */
  word: number;
  /** All segments' FORM concatenated (Buckwalter) — the whole written word. */
  form: string;
  stems: QacStem[];
};

const LOCATION = /^\((\d+):(\d+):(\d+):(\d+)\)$/;

type ParsedRow = {
  surah: number;
  ayah: number;
  word: number;
  form: string;
  tag: string;
  features: string[];
};

/** Parse one data row; returns null for comments, blank lines and the header. */
export function parseMorphologyRow(line: string): ParsedRow | null {
  if (line?.charCodeAt(0) !== 40 /* ( */) return null;
  const clean = line.endsWith("\r") ? line.slice(0, -1) : line;
  const parts = clean.split("\t");
  if (parts.length < 4) return null;
  const match = LOCATION.exec(parts[0]);
  if (!match) return null;
  return {
    surah: Number(match[1]),
    ayah: Number(match[2]),
    word: Number(match[3]),
    form: parts[1],
    tag: parts[2],
    features: parts[3].split("|"),
  };
}

function featureValue(features: string[], key: string): string | null {
  const prefix = `${key}:`;
  for (const f of features) if (f.startsWith(prefix)) return f.slice(prefix.length);
  return null;
}

/**
 * Streaming word assembler. `push(line)` returns a finished word when `line`
 * starts a new one; call `finish()` once at the end for the last word.
 */
export class QacWordAssembler {
  private current: QacWord | null = null;

  push(line: string): QacWord | null {
    const row = parseMorphologyRow(line);
    if (!row) return null;
    let done: QacWord | null = null;
    const cur = this.current;
    if (!cur || cur.surah !== row.surah || cur.ayah !== row.ayah || cur.word !== row.word) {
      done = cur;
      this.current = {
        surah: row.surah,
        ayah: row.ayah,
        word: row.word,
        form: "",
        stems: [],
      };
    }
    const word = this.current as QacWord;
    word.form += row.form;
    if (row.features[0] === "STEM") {
      word.stems.push({
        root: featureValue(row.features, "ROOT"),
        lemma: featureValue(row.features, "LEM"),
        pos: featureValue(row.features, "POS") ?? row.tag,
      });
    }
    return done;
  }

  finish(): QacWord | null {
    const done = this.current;
    this.current = null;
    return done;
  }
}

/** Parse a whole file (or excerpt) in one go — tests and the dev verify script. */
export function parseMorphologyWords(text: string): QacWord[] {
  const out: QacWord[] = [];
  const assembler = new QacWordAssembler();
  for (const line of text.split("\n")) {
    const done = assembler.push(line);
    if (done) out.push(done);
  }
  const last = assembler.finish();
  if (last) out.push(last);
  return out;
}

/** The leading `#` comment lines (both copyright blocks), verbatim. */
export function extractCopyrightNotice(text: string): string {
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line.startsWith("#") || (line.trim() === "" && lines.length)) {
      lines.push(line);
      continue;
    }
    break;
  }
  return lines.join("\n").trim();
}
