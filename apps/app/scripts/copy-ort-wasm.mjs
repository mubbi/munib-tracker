#!/usr/bin/env node
/**
 * Copies the ONNX Runtime Web files the Qur'an practice listener loads at run
 * time into `public/ort/<version>/` (§7 Web runtime files). They are served from
 * our own origin — never a public CDN — and the folder is git-ignored. The site
 * is not cross-origin isolated, so only the single-threaded wasm path is used;
 * the "threaded" file name is ORT's build name, it runs with numThreads = 1.
 *
 * The folder is versioned because `vercel.json` serves `/ort/*` as immutable for
 * a year: an unversioned path would keep a browser on the old runtime's
 * `ort.wasm.min.js` while a new `.mjs`/`.wasm` pair is fetched next to it. The
 * runtime (`engine/tilawa.web.ts`) builds its URL from `ortWebVersion` in
 * `src/constants/recitation-models.json`, so this script refuses to run when the
 * installed `onnxruntime-web` differs from that pin (bump both together;
 * `recitation-models.test.ts` checks the same thing).
 *
 * Runs before `build:web` and `web`. Idempotent; skips files already current and
 * removes files / folders left by older runtime versions.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");

/** The UMD entry plus the wasm module it imports from `env.wasm.wasmPaths`. */
const FILES = ["ort.wasm.min.js", "ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

/** Walk up from the app to find node_modules/onnxruntime-web (hoisted in this monorepo). */
function findOrtPackage() {
  let dir = appRoot;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "node_modules", "onnxruntime-web", "package.json");
    if (existsSync(candidate)) return dirname(candidate);
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const ortPackage = findOrtPackage();
if (!ortPackage) {
  console.warn(
    "[copy-ort-wasm] onnxruntime-web is not installed; the web listener will be unavailable.",
  );
  process.exit(0);
}

const { version } = JSON.parse(readFileSync(join(ortPackage, "package.json"), "utf8"));
const pinned = JSON.parse(
  readFileSync(join(appRoot, "src", "constants", "recitation-models.json"), "utf8"),
).ortWebVersion;
if (version !== pinned) {
  console.error(
    `[copy-ort-wasm] onnxruntime-web@${version} is installed but recitation-models.json pins ` +
      `ortWebVersion ${pinned}. Update "ortWebVersion" to match, or the web listener loads from a missing folder.`,
  );
  process.exit(1);
}

const ortDist = join(ortPackage, "dist");
const base = join(appRoot, "public", "ort");
const out = join(base, version);
mkdirSync(out, { recursive: true });

let copied = 0;
for (const name of FILES) {
  const from = join(ortDist, name);
  const to = join(out, name);
  if (!existsSync(from)) {
    console.error(`[copy-ort-wasm] missing ${name} in onnxruntime-web@${version}`);
    process.exit(1);
  }
  if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
  copyFileSync(from, to);
  copied += 1;
}

// Anything else under public/ort/ is from an older runtime (including the old
// unversioned layout) and must not ship next to the current one.
for (const entry of readdirSync(base, { withFileTypes: true })) {
  if (entry.name === version) continue;
  rmSync(join(base, entry.name), { recursive: true, force: true });
}

console.log(
  `[copy-ort-wasm] onnxruntime-web@${version}: ${copied} file(s) copied to public/ort/${version}/`,
);
