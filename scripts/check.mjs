#!/usr/bin/env node
/**
 * Targeted quality checks — shared by local hooks and GitHub Actions.
 *
 * Usage:
 *   node scripts/check.mjs [profile]
 *
 * Profiles:
 *   quick     lint + typecheck (fast local smoke; not a git hook)
 *   style     format-and-lint + typecheck
 *   ci|push   lint → typecheck → test → build → generate (matches CI + pre-push)
 *
 * Individual steps: format, lint, typecheck, test, build, generate
 *   (also `pnpm check:test` / `pnpm check:generate`)
 *
 * Git hooks:
 *   pre-commit  — Biome --write --staged + restage (see .husky/pre-commit)
 *   pre-push    — this script with profile `ci`
 *
 * In GitHub Actions (GITHUB_STEP_SUMMARY set) it also writes one job summary:
 * per-step results, a per-package test table built from each workspace's
 * `coverage/test-results.json` (Vitest json reporter via
 * `@munib-tracker/vitest-config/ci`, Jest `--json`), failed tests, and
 * coverage totals read from each `coverage/clover.xml`. Per-package exit codes
 * and cache hits come from turbo's `--summarize` run file, so a package whose
 * runner crashed (worker timeout, unhandled error) is not shown as green.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IN_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";

const GENERATED_PATHS = ["packages/api-contract/openapi.json", "packages/api-client/src/generated"];

/** Non-interactive turbo logs in hooks/CI (turbo.json defaults to tui). */
const CHECK_ENV = {
  ...process.env,
  FORCE_COLOR: "1",
  TURBO_UI: process.env.TURBO_UI ?? "false",
};

/** @type {Record<string, { cmd: string; args: string[]; env?: NodeJS.ProcessEnv }>} */
const steps = {
  format: { cmd: "pnpm", args: ["format-and-lint"] },
  lint: { cmd: "pnpm", args: ["exec", "turbo", "run", "lint"] },
  typecheck: { cmd: "pnpm", args: ["exec", "turbo", "run", "check-types"] },
  // GitHub Actions needs coverage artifacts for Codecov; local pre-push stays fast.
  test: {
    cmd: "pnpm",
    args: IN_GITHUB_ACTIONS
      ? ["exec", "turbo", "run", "test:coverage", "--summarize"]
      : ["exec", "turbo", "run", "test"],
  },

  build: { cmd: "pnpm", args: ["exec", "turbo", "run", "build"] },
};

/** @type {Record<string, string[]>} */
const profiles = {
  quick: ["lint", "typecheck"],
  style: ["format", "lint", "typecheck"],
  // lint first for fast fail; generate last (OpenAPI drift after build)
  ci: ["lint", "typecheck", "test", "build", "generate"],
};

profiles.push = profiles.ci;

/** @type {Record<string, string>} */
const STEP_LABELS = {
  format: "Format + lint (Biome)",
  lint: "Lint (Biome)",
  typecheck: "Type-check",
  test: "Tests",
  build: "Build",
  generate: "OpenAPI client drift",
};

/** @type {Map<string, { ok: boolean; seconds: number }>} */
const stepResults = new Map();

/**
 * `test:coverage` task outcomes from turbo's run summary, keyed by workspace
 * directory (posix, repo-relative). Null when no summary was produced.
 * @type {Map<string, { exitCode: number | null; cached: boolean }> | null}
 */
let testTaskResults = null;

function runStep(name) {
  const started = Date.now();
  const ok = name === "generate" ? runGenerateCheck() : runCommandStep(name);
  stepResults.set(name, { ok, seconds: (Date.now() - started) / 1000 });
  if (name === "test" && IN_GITHUB_ACTIONS) {
    testTaskResults = readTurboRunSummary(started, "test:coverage");
  }
  return ok;
}

/**
 * Reads (then deletes, so the cached `.turbo` dir does not grow) the newest
 * `.turbo/runs/*.json` written since `sinceMs`.
 */
function readTurboRunSummary(sinceMs, task) {
  const runsDir = path.join(root, ".turbo", "runs");
  if (!existsSync(runsDir)) return null;
  const newest = readdirSync(runsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      file: path.join(runsDir, file),
      mtime: statSync(path.join(runsDir, file)).mtimeMs,
    }))
    .filter((entry) => entry.mtime >= sinceMs - 1000)
    .sort((a, b) => b.mtime - a.mtime)[0];
  if (!newest) return null;
  const summary = readJson(newest.file);
  rmSync(newest.file, { force: true });
  if (!Array.isArray(summary?.tasks)) return null;

  const results = new Map();
  for (const entry of summary.tasks) {
    if (!String(entry.taskId).endsWith(`#${task}`)) continue;
    results.set(String(entry.directory).replaceAll("\\", "/"), {
      exitCode: entry.execution?.exitCode ?? null,
      cached: entry.cache?.status === "HIT",
    });
  }
  return results;
}

function runCommandStep(name) {
  const step = steps[name];
  if (!step) {
    process.stderr.write(`Unknown check step: ${name}\n`);
    return false;
  }

  const started = Date.now();
  process.stdout.write(`\n▶ check:${name} …\n`);
  const result = spawnSync(step.cmd, step.args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...CHECK_ENV, ...(step.env ?? {}) },
  });
  const ok = result.status === 0;
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  if (!ok) {
    process.stderr.write(
      `\n✗ check:${name} failed (exit ${result.status ?? "null"}, ${elapsed}s)\n`,
    );
  } else {
    process.stdout.write(`✓ check:${name} passed (${elapsed}s)\n`);
  }
  return ok;
}

function runGenerateCheck() {
  const started = Date.now();
  process.stdout.write("\n▶ check:generate …\n");

  const generate = spawnSync("pnpm", ["generate:api"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: CHECK_ENV,
  });
  if (generate.status !== 0) {
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    process.stderr.write(
      `\n✗ check:generate failed during generate:api (exit ${generate.status ?? "null"}, ${elapsed}s)\n`,
    );
    return false;
  }

  const diff = spawnSync("git", ["diff", "--exit-code", "--", ...GENERATED_PATHS], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: CHECK_ENV,
  });
  const ok = diff.status === 0;
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  if (!ok) {
    process.stderr.write(
      `\n✗ check:generate failed — generated files differ from git (exit ${diff.status ?? "null"}, ${elapsed}s)\n`,
    );
    process.stderr.write("Run `pnpm generate:api` and commit the updated generated output.\n");
  } else {
    process.stdout.write(`✓ check:generate passed (${elapsed}s)\n`);
  }
  return ok;
}

// ---------------------------------------------------------------------------
// GitHub Actions job summary
// ---------------------------------------------------------------------------

/** Same path as `CI_TEST_RESULTS_FILE` in packages/vitest-config/src/ci.ts. */
const TEST_RESULTS_FILE = "coverage/test-results.json";
const MAX_LISTED_FAILURES = 50;

/** Workspaces with a `test:coverage` script, as { dir, name, runner }. */
function listTestWorkspaces() {
  const workspaces = [];
  for (const group of ["apps", "packages"]) {
    const groupDir = path.join(root, group);
    if (!existsSync(groupDir)) continue;
    for (const entry of readdirSync(groupDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(groupDir, entry.name);
      const pkg = readJson(path.join(dir, "package.json"));
      const script = pkg?.scripts?.["test:coverage"];
      if (!script) continue;
      workspaces.push({
        dir,
        relDir: `${group}/${entry.name}`,
        name: String(pkg.name ?? entry.name).replace(/^@munib-tracker\//, ""),
        runner: script.trim().startsWith("jest") ? "Jest" : "Vitest",
      });
    }
  }
  return workspaces.sort((a, b) => a.name.localeCompare(b.name));
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Totals from a Jest-format JSON report (Vitest's json reporter emits the same
 * shape). Durations span the earliest suite start to the latest suite end.
 */
function summarizeTestResults(report, workspaceDir) {
  const files = Array.isArray(report.testResults) ? report.testResults : [];
  const ends = files.map((file) => Number(file.endTime)).filter(Number.isFinite);
  const start = Number(report.startTime);
  const seconds =
    ends.length > 0 && Number.isFinite(start) ? (Math.max(...ends) - start) / 1000 : null;

  /** @type {string[]} */
  const failures = [];
  for (const file of files) {
    const rel = path
      .relative(root, path.resolve(workspaceDir, file.name ?? ""))
      .replaceAll("\\", "/");
    const failedAssertions = (file.assertionResults ?? []).filter((a) => a.status === "failed");
    for (const assertion of failedAssertions) {
      const title = [...(assertion.ancestorTitles ?? []), assertion.title]
        .filter(Boolean)
        .join(" › ");
      failures.push(`\`${rel}\` › ${escapeMarkdown(title)}`);
    }
    if (file.status === "failed" && failedAssertions.length === 0) {
      failures.push(`\`${rel}\` — suite failed to run`);
    }
  }

  const failedFiles = files.filter((file) => file.status === "failed").length;
  return {
    files: files.length,
    failedFiles,
    total: Number(report.numTotalTests) || 0,
    passed: Number(report.numPassedTests) || 0,
    failed: Number(report.numFailedTests) || 0,
    skipped: (Number(report.numPendingTests) || 0) + (Number(report.numTodoTests) || 0),
    seconds,
    failures,
    ok: report.success === true || (failedFiles === 0 && Number(report.numFailedTests) === 0),
  };
}

const EMPTY_TEST_SUMMARY = {
  files: 0,
  failedFiles: 0,
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  seconds: null,
  ok: false,
};

/** Project-level totals from an istanbul `clover.xml`. */
function readCloverTotals(file) {
  let xml;
  try {
    xml = readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const metrics = /<project\b[^>]*>\s*<metrics\b([^>]*)\/?>/.exec(xml)?.[1];
  if (!metrics) return null;
  const attr = (key) => Number(new RegExp(`\\b${key}="(\\d+)"`).exec(metrics)?.[1] ?? Number.NaN);
  const pct = (covered, total) =>
    Number.isFinite(covered) && total > 0 ? (covered / total) * 100 : null;
  return {
    statements: pct(attr("coveredstatements"), attr("statements")),
    branches: pct(attr("coveredconditionals"), attr("conditionals")),
    functions: pct(attr("coveredmethods"), attr("methods")),
  };
}

function escapeMarkdown(text) {
  return String(text)
    .replace(/\r?\n/g, " ")
    .replace(/[|`<>]/g, (ch) => `\\${ch}`);
}

const formatCount = (n) => n.toLocaleString("en-US");
const formatSeconds = (s) =>
  s == null ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${s.toFixed(1)}s`;
const formatPercent = (p) => (p == null ? "—" : `${p.toFixed(1)}%`);
const countCell = (n, icon) => (n > 0 ? `${icon} ${formatCount(n)}` : "0");

function renderStepsTable({ stepNames, failed }) {
  const rows = stepNames.map((name) => {
    const result = stepResults.get(name);
    const status = !result ? "⏭️ Not run" : result.ok ? "✅ Passed" : "❌ Failed";
    const label = STEP_LABELS[name] ?? name;
    return `| ${name === failed ? `**${label}**` : label} | ${status} | ${formatSeconds(result?.seconds)} |`;
  });
  return ["| Step | Result | Time |", "| --- | --- | ---: |", ...rows].join("\n");
}

function renderTestsSection() {
  const packages = [];
  for (const ws of listTestWorkspaces()) {
    const task = testTaskResults?.get(ws.relDir);
    // Turbo ran nothing for this workspace (filtered out or not in the graph).
    if (testTaskResults && !task) continue;
    const report = readJson(path.join(ws.dir, TEST_RESULTS_FILE));
    if (!report && !task) continue;

    const summary = report
      ? summarizeTestResults(report, ws.dir)
      : { ...EMPTY_TEST_SUMMARY, failures: ["— no test results were written"] };
    const exitedNonZero = task != null && task.exitCode !== 0;
    if (exitedNonZero && summary.failures.length === 0) {
      summary.failures.push(
        `— runner exited with code ${task.exitCode ?? "?"} (unhandled error or worker crash; see the job log)`,
      );
    }
    packages.push({
      ...ws,
      ...summary,
      ok: summary.ok && !exitedNonZero && report != null,
      cached: task?.cached === true,
    });
  }
  if (packages.length === 0) {
    return "### 🧪 Tests\n\nNo test result files were found (`coverage/test-results.json`).";
  }

  const sum = (key) => packages.reduce((acc, p) => acc + p[key], 0);
  const totals = {
    files: sum("files"),
    total: sum("total"),
    passed: sum("passed"),
    failed: sum("failed"),
    skipped: sum("skipped"),
    failedFiles: sum("failedFiles"),
  };
  const allOk = packages.every((p) => p.ok);

  const headline = [
    `${formatCount(totals.passed)} passed`,
    totals.failed > 0 ? `${formatCount(totals.failed)} failed` : null,
    totals.skipped > 0 ? `${formatCount(totals.skipped)} skipped` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const lines = [
    `### 🧪 Tests ${allOk ? "✅" : "❌"} ${headline}`,
    "",
    `${formatCount(totals.total)} tests in ${formatCount(totals.files)} files across ${packages.length} ${packages.length === 1 ? "package" : "packages"}.`,
    "",
    "| Package | Runner | Files | Tests | Passed | Failed | Skipped | Time |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const p of packages) {
    const files = p.failedFiles > 0 ? `${p.files} (❌ ${p.failedFiles})` : String(p.files);
    lines.push(
      `| ${p.ok ? "✅" : "❌"} \`${p.name}\` | ${p.runner} | ${files} | ${formatCount(p.total)} | ${formatCount(p.passed)} | ${countCell(p.failed, "❌")} | ${countCell(p.skipped, "⏭️")} | ${p.cached ? "⚡ cached" : formatSeconds(p.seconds)} |`,
    );
  }
  lines.push(
    `| **Total** | | **${formatCount(totals.files)}** | **${formatCount(totals.total)}** | **${formatCount(totals.passed)}** | **${formatCount(totals.failed)}** | **${formatCount(totals.skipped)}** | |`,
  );

  const failures = packages.flatMap((p) => p.failures.map((f) => `- **${p.name}** ${f}`));
  if (failures.length > 0) {
    const shown = failures.slice(0, MAX_LISTED_FAILURES);
    const more = failures.length - shown.length;
    lines.push(
      "",
      `<details open><summary><b>❌ ${formatCount(failures.length)} failing ${failures.length === 1 ? "test" : "tests"}</b></summary>`,
      "",
      ...shown,
      ...(more > 0 ? [`- …and ${formatCount(more)} more (see the job log)`] : []),
      "",
      "</details>",
    );
  }
  return lines.join("\n");
}

function renderCoverageSection() {
  const rows = [];
  for (const ws of listTestWorkspaces()) {
    // Only packages turbo ran (or restored from cache) in this job.
    if (testTaskResults && !testTaskResults.has(ws.relDir)) continue;
    const totals = readCloverTotals(path.join(ws.dir, "coverage", "clover.xml"));
    if (!totals) continue;
    rows.push(
      `| \`${ws.name}\` | ${formatPercent(totals.statements)} | ${formatPercent(totals.branches)} | ${formatPercent(totals.functions)} |`,
    );
  }
  if (rows.length === 0) return null;
  return [
    "<details><summary><b>📊 Coverage by package</b> (per-file detail on Codecov)</summary>",
    "",
    "| Package | Statements | Branches | Functions |",
    "| --- | ---: | ---: | ---: |",
    ...rows,
    "",
    "</details>",
  ].join("\n");
}

function writeJobSummary({ profile, stepNames, failed }) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) return;

  const title = failed
    ? `## ❌ CI checks failed at ${STEP_LABELS[failed] ?? failed}`
    : "## ✅ CI checks passed";
  const sections = [title, "", renderStepsTable({ stepNames, failed })];

  if (stepResults.has("test")) {
    sections.push("", renderTestsSection());
    const coverage = renderCoverageSection();
    if (coverage) sections.push("", coverage);
  }

  if (failed) {
    sections.push(
      "",
      `> Reproduce locally with \`node scripts/check.mjs ${profile}\`. ` +
        "Fix lint with `pnpm format-and-lint:fix`; refresh the API client with `pnpm generate:api`.",
    );
  }

  try {
    appendFileSync(summaryFile, `${sections.join("\n")}\n`);
  } catch (error) {
    process.stderr.write(`Could not write the job summary: ${error}\n`);
  }
}

function resolveProfile(arg) {
  if (!arg || arg === "quick") {
    return { name: "quick", steps: profiles.quick };
  }
  if (profiles[arg]) {
    return { name: arg, steps: profiles[arg] };
  }
  if (steps[arg] || arg === "generate") {
    return { name: arg, steps: [arg] };
  }
  process.stderr.write(
    `Unknown profile "${arg}". Use: quick, style, ci, push, generate, or a step name.\n`,
  );
  process.exit(2);
}

const profileArg = process.argv[2];
const { name: profileName, steps: stepNames } = resolveProfile(profileArg);

process.stdout.write(`\nCHECK profile: ${profileName}\n`);

let failed = null;
for (const stepName of stepNames) {
  if (!runStep(stepName)) {
    failed = stepName;
    break;
  }
}

writeJobSummary({ profile: profileName, stepNames, failed });

if (failed) {
  process.stderr.write(`\nCHECK FAILED at step: ${failed}\n`);
  process.stderr.write(
    "Fix the reported errors (or run `pnpm format-and-lint:fix` / `pnpm generate:api` as needed), then re-run.\n",
  );
  process.exit(1);
}

process.stdout.write(`\nCHECK OK (${profileName}: ${stepNames.join(" → ")})\n`);
process.exit(0);
