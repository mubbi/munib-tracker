/**
 * NF-3.22 performance check (plan acceptance: root lookup < 50 ms after the
 * one-time download; index build < 5 s on a mid-range phone). Skipped in the
 * normal test run — the dataset is never committed. Run it on a machine that has
 * the hash-checked file (fetched by `pnpm --filter app morphology:verify` into
 * the gitignored `scripts/build-data/.cache/quran-morphology/`):
 *
 *   ROOT_SEARCH_BENCH=1 pnpm --filter app exec jest --runInBand \
 *     src/lib/quran-morphology/root-search-benchmark.test.ts
 *
 * (`MORPHOLOGY_FILE=<path>` overrides the file.) It prints a timing table; the
 * figures are recorded in docs/proofs/root-word-search.md. A dev machine running
 * Node is not a phone — device QA still has to confirm the targets.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  createRootSuggestionIndex,
  getRootOccurrences,
  listRoots,
  rootToArabic,
  searchRoots,
  suggestRoots,
} from "@/lib/quran-roots";

import { buildRootIndex, type RootIndex } from "./build-index";
import { QAC_MORPHOLOGY, verifyMorphologyText } from "./source";

const DEFAULT_FILE = join(
  __dirname,
  "../../../scripts/build-data/.cache/quran-morphology/quranic-corpus-morphology-0.4.txt",
);
const FILE = process.env.MORPHOLOGY_FILE ?? DEFAULT_FILE;
const run = process.env.ROOT_SEARCH_BENCH && existsSync(FILE) ? describe : describe.skip;

function loadSurahArabic(surah: number): Record<string, string> {
  const pad = String(surah).padStart(3, "0");
  return JSON.parse(
    readFileSync(join(__dirname, `../../../assets/data/quran/arabic/${pad}.json`), "utf8"),
  ) as Record<string, string>;
}

/** High-resolution clock (the Jest environment's `performance.now()` is coarse). */
const now = () => Number(process.hrtime.bigint()) / 1e6;

function time<T>(fn: () => T): { ms: number; value: T } {
  const start = now();
  const value = fn();
  return { ms: now() - start, value };
}

function stats(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
  const round = (ms: number) => Math.round(ms * 1000) / 1000;
  return {
    n: sorted.length,
    p50: round(at(0.5)),
    p95: round(at(0.95)),
    max: round(sorted[sorted.length - 1] ?? 0),
  };
}

const fmt = (ms: number) => ms.toFixed(2);

run("NF-3.22 root search — performance (dev machine)", () => {
  jest.setTimeout(120_000);

  it("builds the index and answers lookups within the plan targets", async () => {
    const lines: string[] = [];
    const raw = readFileSync(FILE, "utf8");

    const verify = time(() => verifyMorphologyText(raw));
    const text = verify.value;

    const buildStart = now();
    const built = await buildRootIndex(text, {
      sourceHash: QAC_MORPHOLOGY.sha256,
      loadSurahArabic,
    });
    const buildMs = now() - buildStart;

    // The app persists the index as JSON and reloads it on later launches.
    const json = JSON.stringify(built);
    const reload = time(() => JSON.parse(json) as RootIndex);
    const index = reload.value;

    const roots = listRoots(index);
    const suggestionBuild = time(() => createRootSuggestionIndex(roots));

    // Queries generated from the dataset itself (never typed Arabic): every
    // root as spaced Arabic letters, a sample of whole-word forms, Latin input.
    const rootQueries = roots.map((r) => rootToArabic(r.root));
    const formKeys = Object.keys(index.forms);
    const formQueries = formKeys.filter((_, i) => i % Math.ceil(formKeys.length / 2000) === 0);
    const latinQueries = ["rhm", "ktb", "slm", "qwl", "elm", "Alh", "sjd", "Amn", "Hmd", "Sbr"];

    const sample = (queries: readonly string[], fn: (q: string) => unknown) =>
      stats(queries.map((q) => time(() => fn(q)).ms));

    // Warm up the JIT once so the first sample isn't an outlier.
    searchRoots(index, rootQueries[0] ?? "");

    const rootLookup = sample(rootQueries, (q) => searchRoots(index, q));
    const wordLookup = sample(formQueries, (q) => searchRoots(index, q));
    const latinLookup = sample(latinQueries, (q) => searchRoots(index, q));
    // A root page: every occurrence decoded and grouped (largest roots are the worst case).
    const occurrences = sample(
      roots.map((r) => r.root),
      (root) => getRootOccurrences(index, root),
    );
    const top = roots[0];
    const topPage = time(() => getRootOccurrences(index, top?.root ?? ""));
    // Full user path: type → parse → look up → open the first root's page.
    const fullPath = sample(rootQueries, (q) => {
      const hit = searchRoots(index, q);
      return hit.kind === "roots" ? getRootOccurrences(index, hit.roots[0] ?? "") : null;
    });
    const suggest = sample(
      rootQueries.slice(0, 200).map((q) => q.split(" ").slice(0, 2).join(" ")),
      (q) => suggestRoots(index, suggestionBuild.value, q),
    );

    lines.push(
      `node ${process.version} · ${process.platform}/${process.arch}`,
      `file ${(raw.length / 1e6).toFixed(2)} MB · words ${index.stats.words} · roots ${index.stats.roots} · lemmas ${index.stats.lemmas}`,
      `hash verify: ${fmt(verify.ms)} ms`,
      `index build (parse + align, no UI yields): ${fmt(buildMs)} ms`,
      `index JSON ${(json.length / 1024).toFixed(0)} KB · JSON.parse reload: ${fmt(reload.ms)} ms`,
      `suggestion index build: ${fmt(suggestionBuild.ms)} ms`,
      `root lookup (all roots, Arabic letters): ${JSON.stringify(rootLookup)}`,
      `word-form lookup: ${JSON.stringify(wordLookup)}`,
      `latin lookup: ${JSON.stringify(latinLookup)}`,
      `root page (getRootOccurrences, all roots): ${JSON.stringify(occurrences)}`,
      `largest root page (${top?.root}, ${top?.count} occurrences): ${fmt(topPage.ms)} ms`,
      `query → first root page: ${JSON.stringify(fullPath)}`,
      `"did you mean" (2-letter input): ${JSON.stringify(suggest)}`,
    );
    process.stdout.write(`\n[root-search-benchmark]\n${lines.join("\n")}\n`);

    expect(index.stats.roots).toBeGreaterThan(1500);
    expect(fullPath.p95).toBeLessThan(50);
    expect(buildMs).toBeLessThan(5000);
  });
});
