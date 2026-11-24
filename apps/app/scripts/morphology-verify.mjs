// NF-3.22 dev check: `pnpm --filter app morphology:verify`
//
// 1. Fetches the pinned Quranic Arabic Corpus morphology v0.4 (cached under the
//    gitignored scripts/build-data/.cache/), trying each pinned mirror in order.
// 2. Verifies the LF-normalised sha256 against the pinned hash.
// 3. Runs the real on-device pipeline (parse → index → alignment against the
//    bundled Tanzil text) under Jest, which writes
//    docs/proofs/root-word-search-alignment.md and fails on any unexplained
//    mismatch.
//
// The file is never committed and never modified.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(HERE, "..");
const CACHE_DIR = join(HERE, "build-data", ".cache", "quran-morphology");
const FILE = join(CACHE_DIR, "quranic-corpus-morphology-0.4.txt");

// Keep in sync with src/lib/quran-morphology/source.ts (QAC_MORPHOLOGY).
const SHA256 = "910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d";
const SOURCES = [
  "https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/a6d4217a9e1422978c367eadc833ff4883db77fb/data/quranic-corpus-morphology-0.4.txt",
  "https://media.githubusercontent.com/media/ezAldinWaez/quran-etl/6539e2de6cdbdb5ff5a97abb1666a7585540c2c3/reports/resources/quranic-corpus/quranic-corpus-morphology-0.4.txt",
];

function lfHash(text) {
  return createHash("sha256").update(text.replace(/\r/g, ""), "utf8").digest("hex");
}

async function ensureFile() {
  if (existsSync(FILE) && lfHash(readFileSync(FILE, "utf8")) === SHA256) return;
  mkdirSync(CACHE_DIR, { recursive: true });
  for (const url of SOURCES) {
    try {
      console.log(`fetching ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const hash = lfHash(text);
      if (hash !== SHA256) throw new Error(`hash mismatch ${hash}`);
      writeFileSync(FILE, text.replace(/\r/g, ""), "utf8");
      console.log(`verified sha256 ${hash}`);
      return;
    } catch (error) {
      console.warn(`  failed: ${error.message}`);
    }
  }
  throw new Error("No pinned mirror served the expected file.");
}

await ensureFile();
const result = spawnSync(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["exec", "jest", "--runTestsByPath", "src/lib/quran-morphology/morphology-verify.test.ts"],
  {
    cwd: APP_ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, MORPHOLOGY_FILE: FILE },
  },
);
process.exitCode = result.status ?? 1;
