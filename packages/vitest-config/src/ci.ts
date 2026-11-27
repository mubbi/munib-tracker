import type { TestUserConfig } from "vitest/config";

/**
 * Where each workspace writes its machine-readable test results in GitHub
 * Actions. `scripts/check.mjs` folds every package's file into one job summary.
 * Lives under `coverage/` so it is gitignored, a turbo `test*` output (cache
 * hits restore it), and does not match a Codecov upload pattern.
 */
export const CI_TEST_RESULTS_FILE = "coverage/test-results.json";

/**
 * Setup file that blocks every real outbound network call (loopback allowed)
 * and fails the test that attempted one. Every Vitest config lists it:
 *
 *   test: { ...ciReporting, setupFiles: [NO_NETWORK_SETUP], include: [...] }
 *
 * A package specifier, resolved from each workspace root by Vitest.
 */
export const NO_NETWORK_SETUP = "@munib-tracker/vitest-config/no-network";

/**
 * Reporters for GitHub Actions, spread into a config's `test` block:
 *
 *   test: { ...ciReporting, include: [...] }
 *
 * Keeps the console output and the inline failure annotations, adds the JSON
 * results file, and turns off Vitest's own per-package "Vitest Test Report"
 * job summary (one unlabeled block per workspace). Outside GitHub Actions it is
 * empty, so local runs keep Vitest's defaults.
 */
export const ciReporting: Pick<TestUserConfig, "reporters"> =
  process.env.GITHUB_ACTIONS === "true"
    ? {
        reporters: [
          "default",
          ["github-actions", { jobSummary: { enabled: false } }],
          ["json", { outputFile: CI_TEST_RESULTS_FILE }],
        ],
      }
    : {};
