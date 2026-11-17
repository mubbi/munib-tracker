#!/usr/bin/env node
/**
 * Copies the ONNX Runtime Web files the Qur'an practice listener loads at run
 * time into `public/ort/` (§7 Web runtime files). They are served from our own
 * origin — never a public CDN — and the folder is git-ignored. The site is not
 * cross-origin isolated, so only the single-threaded wasm path is used; the
 * "threaded" file name is ORT's build name, it runs with numThreads = 1.
 *
 * Runs before `build:web` and `web`. Idempotent; skips files already current.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");

const FILES = ["ort.wasm.min.js", "ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

/** Walk up from the app to find node_modules/onnxruntime-web (hoisted in this monorepo). */
function findOrtDist() {
  let dir = appRoot;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "node_modules", "onnxruntime-web", "package.json");
    if (existsSync(candidate)) return join(dirname(candidate), "dist");
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const ortDist = findOrtDist();
if (!ortDist) {
  console.warn(
    "[copy-ort-wasm] onnxruntime-web is not installed; the web listener will be unavailable.",
  );
  process.exit(0);
}

const version = JSON.parse(readFileSync(join(ortDist, "..", "package.json"), "utf8")).version;
const out = join(appRoot, "public", "ort");
mkdirSync(out, { recursive: true });

let copied = 0;
for (const name of FILES) {
  const from = join(ortDist, name);
  const to = join(out, name);
  if (!existsSync(from)) {
    console.warn(`[copy-ort-wasm] missing ${name} in onnxruntime-web@${version}`);
    continue;
  }
  if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
  copyFileSync(from, to);
  copied += 1;
}
console.log(`[copy-ort-wasm] onnxruntime-web@${version}: ${copied} file(s) copied to public/ort/`);
