#!/usr/bin/env node
/**
 * Web only: download the Qur'an practice listener files from their pinned GitHub
 * release, verify each SHA-256, and copy them into
 * `public/recitation-models/<engine>/<sha12>/<file>` so the browser downloads them
 * from this app's own origin. GitHub release assets send no CORS headers, so a
 * browser cannot fetch them directly (native apps can, and still do).
 *
 * Source of truth: `src/constants/recitation-models.json` (`webHosted` engines).
 * Downloads are cached in `node_modules/.cache/munib-recitation-models/<sha256>`
 * so repeated builds do not re-download. `public/recitation-models/` is git-ignored.
 *
 * Set MUNIB_SKIP_RECITATION_MODELS=1 to skip (the web listener then reports
 * "No connection" when someone taps Download).
 */
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const data = JSON.parse(
  readFileSync(join(appRoot, "src/constants/recitation-models.json"), "utf8"),
);
const cacheDir = join(appRoot, "..", "..", "node_modules", ".cache", "munib-recitation-models");
const outRoot = join(appRoot, "public", "recitation-models");

if (process.env.MUNIB_SKIP_RECITATION_MODELS === "1") {
  console.log("[recitation-models] skipped (MUNIB_SKIP_RECITATION_MODELS=1)");
  process.exit(0);
}

function sha256Of(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function ensureCached(file) {
  const cached = join(cacheDir, file.sha256);
  if (
    existsSync(cached) &&
    statSync(cached).size === file.bytes &&
    sha256Of(cached) === file.sha256
  ) {
    return cached;
  }
  mkdirSync(cacheDir, { recursive: true });
  const response = await fetch(file.url, { redirect: "follow" });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${file.url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const tmp = `${cached}.part`;
  await writeFile(tmp, bytes);
  if (bytes.length !== file.bytes || sha256Of(tmp) !== file.sha256) {
    unlinkSync(tmp);
    throw new Error(`Checksum mismatch for ${file.fileName}`);
  }
  renameSync(tmp, cached);
  return cached;
}

let copied = 0;
try {
  for (const [engine, spec] of Object.entries(data.engines)) {
    if (!spec.webHosted) continue;
    for (const file of spec.files) {
      // D18: files with a pinned public mirror (`webUrl`) are fetched by the browser
      // from that mirror — never copied into our own origin.
      if (file.webUrl) continue;
      const source = await ensureCached(file);
      const target = join(outRoot, engine, file.sha256.slice(0, 12), file.fileName);
      if (existsSync(target) && statSync(target).size === file.bytes) continue;
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(source, target);
      copied += 1;
    }
  }
  console.log(`[recitation-models] ${copied} file(s) copied to public/recitation-models/`);
} catch (error) {
  // Never fail the whole web build over an optional download; the listener then
  // reports "No connection" and practice still works listen-only.
  console.warn(`[recitation-models] could not prepare web listener files: ${error.message}`);
}
