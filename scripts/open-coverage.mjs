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
 * Open an allowlisted relative coverage report (never pass repo-root absolute
 * paths into a shell interpreter such as cmd.exe).
 * @param {{ id: string, dir: string }} pkg
 */
function openCoverageReport(pkg) {
  // Literal allowlist segment only — keeps argv free of uncontrolled abs paths.
  const relativeReport = path.join(pkg.dir, "coverage", "index.html");
  const absoluteReport = path.join(root, relativeReport);
  if (!fs.existsSync(absoluteReport)) {
    return { missing: true };
  }

  const platform = process.platform;
  /** @type {import("node:child_process").SpawnSyncReturns<Buffer>} */
  let result;
  if (platform === "win32") {
    // explorer.exe + relative path + cwd — no cmd.exe (CodeQL CWE-078/088).
    result = spawnSync("explorer.exe", [relativeReport.split(path.sep).join("\\")], {
      cwd: root,
      stdio: "ignore",
      windowsHide: true,
      shell: false,
    });
    // explorer.exe often exits 1 even when it successfully opens the file.
    if (result.error) {
      return { id: pkg.id, report: absoluteReport, result, failed: true };
    }
    return { id: pkg.id, report: absoluteReport, result, failed: false };
  }
  if (platform === "darwin") {
    result = spawnSync("open", [relativeReport], { cwd: root, stdio: "ignore", shell: false });
  } else {
    result = spawnSync("xdg-open", [relativeReport], { cwd: root, stdio: "ignore", shell: false });
  }
  const failed = Boolean(result.error || (result.status !== null && result.status !== 0));
  return { id: pkg.id, report: absoluteReport, result, failed };
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
  const outcome = openCoverageReport(pkg);
  if (outcome.missing) {
    missing.push(pkg.id);
    continue;
  }
  found.push(outcome);
  if (outcome.failed) {
    console.error(`Failed to open ${outcome.id}: ${outcome.report}`);
    continue;
  }
  console.log(`Opened ${outcome.id}: ${path.relative(root, outcome.report)}`);
}

if (found.length === 0) {
  console.error("No coverage reports found. Generate them first:\n  pnpm test:coverage");
  process.exit(1);
}

if (missing.length > 0) {
  console.warn(`Missing reports (run pnpm test:coverage): ${missing.join(", ")}`);
}
