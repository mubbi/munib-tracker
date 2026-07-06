#!/usr/bin/env node
/**
 * Targeted quality checks — faster than full turbo for day-to-day work.
 *
 * Usage:
 *   node scripts/check.mjs [profile]
 *
 * Profiles:
 *   quick     lint + typecheck (default; fast pre-commit)
 *   style     format-and-lint + typecheck
 *   ci        typecheck + lint + test + build (matches .github/workflows/ci.yml)
 *
 * Individual steps: format, lint, typecheck, test, build, generate
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const GENERATED_PATHS = ["packages/api-contract/openapi.json", "packages/api-client/src/generated"];

/** @type {Record<string, { cmd: string; args: string[]; env?: NodeJS.ProcessEnv }>} */
const steps = {
  format: { cmd: "pnpm", args: ["format-and-lint"] },
  lint: { cmd: "pnpm", args: ["exec", "turbo", "run", "lint"] },
  typecheck: { cmd: "pnpm", args: ["exec", "turbo", "run", "check-types"] },
  test: { cmd: "pnpm", args: ["exec", "turbo", "run", "test"] },
  build: { cmd: "pnpm", args: ["exec", "turbo", "run", "build"] },
};

/** @type {Record<string, string[]>} */
const profiles = {
  quick: ["lint", "typecheck"],
  style: ["format", "lint", "typecheck"],
  ci: ["typecheck", "lint", "test", "build"],
};

function runStep(name) {
  if (name === "generate") {
    return runGenerateCheck();
  }

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
    env: { ...process.env, FORCE_COLOR: "1", ...(step.env ?? {}) },
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
    env: { ...process.env, FORCE_COLOR: "1" },
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
    env: { ...process.env, FORCE_COLOR: "1" },
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
    `Unknown profile "${arg}". Use: quick, style, ci, generate, or a step name.\n`,
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

if (failed) {
  process.stderr.write(`\nCHECK FAILED at step: ${failed}\n`);
  process.exit(1);
}

process.stdout.write(`\nCHECK OK (${profileName}: ${stepNames.join(" → ")})\n`);
process.exit(0);
