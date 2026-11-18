#!/usr/bin/env node
/**
 * Self-hosts the `@quran-lab/tajweedformer` browser SDK under
 * `public/tajweedformer/<version>/` (git-ignored), mirroring the package layout
 * (`web/` + `dist/`). The pronunciation drill imports it from there at run time
 * instead of letting Metro bundle it: the SDK finds its Worker and its
 * WebAssembly with `new URL(..., import.meta.url)`, which Vite / webpack / Parcel
 * rewrite but Metro does not — bundled, the wasm request resolves next to the
 * Metro chunk (`/_expo/static/js/web/tajweedformer.wasm`) and 404s.
 *
 * The folder is versioned so `/tajweedformer/*` can be cached as immutable;
 * `client.web.ts` reads the same version from the package's `package.json`.
 *
 * Runs before `build:web` and `web`. Idempotent; skips files already current and
 * removes folders left by older SDK versions.
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
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const PKG = "@quran-lab/tajweedformer";

/** Walk up from the app to find the package (hoisted in this monorepo). */
function findPackage() {
  let dir = appRoot;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "node_modules", ...PKG.split("/"), "package.json");
    if (existsSync(candidate)) return dirname(candidate);
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const pkgDir = findPackage();
if (!pkgDir) {
  console.warn(
    `[copy-tajweedformer-web] ${PKG} is not installed; the web drill will be unavailable.`,
  );
  process.exit(0);
}

const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const base = join(appRoot, "public", "tajweedformer");
const out = join(base, version);

// Browser files only: the web/ tree (minus type declarations) and the engine builds.
const sources = [];
for (const file of walk(join(pkgDir, "web"))) {
  if (!file.endsWith(".d.ts")) sources.push(file);
}
for (const name of [
  "tajweedformer.mjs",
  "tajweedformer.wasm",
  "tajweedformer-opus.mjs",
  "tajweedformer-opus.wasm",
]) {
  sources.push(join(pkgDir, "dist", name));
}
for (const name of ["LICENSE", "README.md"]) {
  if (existsSync(join(pkgDir, name))) sources.push(join(pkgDir, name));
}

let copied = 0;
for (const from of sources) {
  if (!existsSync(from)) {
    console.warn(`[copy-tajweedformer-web] missing ${relative(pkgDir, from)} in ${PKG}@${version}`);
    continue;
  }
  const to = join(out, relative(pkgDir, from));
  if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied += 1;
}

for (const entry of readdirSync(base, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name !== version) {
    rmSync(join(base, entry.name), { recursive: true, force: true });
  }
}

console.log(
  `[copy-tajweedformer-web] ${PKG}@${version}: ${copied} file(s) copied to public/tajweedformer/${version}/`,
);
