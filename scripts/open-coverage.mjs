#!/usr/bin/env node
/**
 * Open HTML coverage reports in the default browser.
 *
 * Usage:
 *   node scripts/open-coverage.mjs [filter...]
 *
 * Examples:
 *   pnpm test:coverage:open
 *   pnpm test:coverage:open app
 *   pnpm test:coverage:open api shared
 *
 * Run `pnpm test:coverage` first if reports are missing.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Packages that produce a `coverage/index.html` via `pnpm test:coverage`. */
const COVERAGE_PACKAGES = [
  { id: "app", dir: "apps/app" },
  { id: "api", dir: "apps/api" },
  { id: "marketing-web", dir: "apps/marketing-web" },
  { id: "shared", dir: "packages/shared" },
  { id: "theme", dir: "packages/theme" },
  { id: "db", dir: "packages/db" },
];

/**
 * @param {string} filePath
 */
function openPath(filePath) {
  const platform = process.platform;
  if (platform === "win32") {
    // `start` is a cmd builtin; empty title arg avoids treating the path as the title.
    return spawnSync("cmd", ["/c", "start", "", filePath], { stdio: "ignore", windowsHide: true });
  }
  if (platform === "darwin") {
    return spawnSync("open", [filePath], { stdio: "ignore" });
  }
  return spawnSync("xdg-open", [filePath], { stdio: "ignore" });
}

/**
 * Match package ids only (never path prefixes like `apps/`).
 * Exact id wins; otherwise substring on the id (e.g. `marketing` → marketing-web).
 * @param {string[]} filters
 */
function selectPackages(filters) {
  if (filters.length === 0) {
    return COVERAGE_PACKAGES;
  }
  const exact = COVERAGE_PACKAGES.filter(({ id }) => filters.includes(id));
  if (exact.length > 0) {
    return exact;
  }
  return COVERAGE_PACKAGES.filter(({ id }) => filters.some((f) => id.includes(f)));
}

const filters = process.argv.slice(2).map((f) => f.toLowerCase());
const selected = selectPackages(filters);

if (filters.length && selected.length === 0) {
  console.error(
    `No coverage packages matched: ${filters.join(", ")}\nKnown: ${COVERAGE_PACKAGES.map((p) => p.id).join(", ")}`,
  );
  process.exit(1);
}

const found = [];
const missing = [];

for (const pkg of selected) {
  const report = path.join(root, pkg.dir, "coverage", "index.html");
  if (fs.existsSync(report)) {
    found.push({ id: pkg.id, report });
  } else {
    missing.push(pkg.id);
  }
}

if (found.length === 0) {
  console.error("No coverage reports found. Generate them first:\n  pnpm test:coverage");
  process.exit(1);
}

for (const { id, report } of found) {
  const result = openPath(report);
  if (result.error || (result.status !== null && result.status !== 0)) {
    console.error(`Failed to open ${id}: ${report}`);
    continue;
  }
  console.log(`Opened ${id}: ${path.relative(root, report)}`);
}

if (missing.length > 0) {
  console.warn(`Missing reports (run pnpm test:coverage): ${missing.join(", ")}`);
}
