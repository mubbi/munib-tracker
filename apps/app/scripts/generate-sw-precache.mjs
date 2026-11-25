/**
 * Post-export: injects the offline app-shell precache list + a build id into
 * dist/expo-service-worker.js (copied from public/ by `expo export`).
 *
 * - Precache = the HTML of the core routes (home, the installed-app shortcuts,
 *   the main tabs), the `/_expo/static/` entry bundles / stylesheets of every
 *   exported page (so any route boots offline from the root shell), and the
 *   manifest + icons. Visited pages and lazy chunks fill the runtime caches
 *   (see the SW's fetch strategies).
 * - BUILD_ID hashes the precached files, so the SW bytes change on every deploy
 *   that changes the app — browsers only install an updated SW when its bytes
 *   differ (web.dev "service worker lifecycle").
 *
 * Runs in `build:web` after inject-seo-head / generate-seo-files (final HTML).
 * Node-only, no TS import (same constraint as inject-seo-head.mjs).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Optional output dir (relative to the app, or absolute) — tests pass a temp export.
const distDir = path.resolve(projectRoot, process.argv[2] ?? "dist");
const swPath = path.join(distDir, "expo-service-worker.js");

/** Routes that must open offline: home, the manifest shortcuts, the main tabs. */
export const SHELL_ROUTES = [
  "/",
  "/tracker",
  "/qibla",
  "/tasbeeh/free",
  "/library",
  "/settings",
  "/zikr",
  "/dua",
  "/quran",
];

/** Small un-hashed files the installed app needs (icons, manifest). */
export const SHELL_STATIC = [
  "/manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/assets/images/icon-192.png",
  "/assets/images/icon-512.png",
];

const BUILD_ID_LINE = /const BUILD_ID = "[^"]*";/;
const PRECACHE_LINE = /const PRECACHE_URLS = \[[^\]]*\];/;

/** The exported HTML file for a clean route URL (`/qibla` → `qibla/index.html`). */
export function routeHtmlFile(dir, route) {
  const candidates =
    route === "/"
      ? ["index.html"]
      : [`${route.slice(1)}.html`, path.join(route.slice(1), "index.html")];
  for (const candidate of candidates) {
    const file = path.join(dir, candidate);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

/** Every exported `.html` file under `dir`. */
export function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** `/_expo/static/...` scripts + stylesheets referenced by an HTML page. */
export function staticRefs(html) {
  const refs = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\/_expo\/static\/[^"?#]+)"/g)) {
    refs.add(match[1]);
  }
  return refs;
}

/** Replace the two marker lines; throws if the SW source changed shape. */
export function injectPrecache(swSource, buildId, urls) {
  if (!BUILD_ID_LINE.test(swSource) || !PRECACHE_LINE.test(swSource)) {
    throw new Error("expo-service-worker.js: BUILD_ID / PRECACHE_URLS markers not found");
  }
  return swSource
    .replace(BUILD_ID_LINE, `const BUILD_ID = ${JSON.stringify(buildId)};`)
    .replace(PRECACHE_LINE, `const PRECACHE_URLS = ${JSON.stringify(urls)};`);
}

function main() {
  if (!fs.existsSync(swPath)) {
    console.error(`generate-sw-precache: ${path.relative(projectRoot, swPath)} not found`);
    process.exit(1);
  }

  const urls = [];
  const statics = new Set();
  const hash = crypto.createHash("sha256");

  for (const route of SHELL_ROUTES) {
    const file = routeHtmlFile(distDir, route);
    if (!file) {
      console.warn(`generate-sw-precache: no exported HTML for ${route} — skipped`);
      continue;
    }
    hash.update(fs.readFileSync(file, "utf8"));
    urls.push(route);
  }

  // Entry bundles of EVERY exported page (not their HTML): offline, any route
  // boots from the root shell and still finds its own route chunk. ~2–3 MB on
  // top of the shared bundles; the multi-MB lazy data chunks are not included.
  for (const file of htmlFiles(distDir)) {
    for (const ref of staticRefs(fs.readFileSync(file, "utf8"))) statics.add(ref);
  }

  for (const ref of [...statics].sort()) {
    // Hashed names: the name alone identifies the content.
    hash.update(ref);
    urls.push(ref);
  }

  let bytes = 0;
  for (const ref of SHELL_STATIC) {
    const file = path.join(distDir, ref.slice(1));
    if (!fs.existsSync(file)) continue;
    const body = fs.readFileSync(file);
    hash.update(body);
    bytes += body.length;
    urls.push(ref);
  }
  for (const ref of statics) {
    const file = path.join(distDir, ref.slice(1));
    if (fs.existsSync(file)) bytes += fs.statSync(file).size;
  }

  const buildId = hash.digest("hex").slice(0, 16);
  const source = fs.readFileSync(swPath, "utf8");
  fs.writeFileSync(swPath, injectPrecache(source, buildId, urls), "utf8");
  console.log(
    `generate-sw-precache: ${urls.length} URLs (${(bytes / 1e6).toFixed(1)} MB uncompressed), build ${buildId}`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
