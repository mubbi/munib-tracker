/**
 * Wraps Expo CLI with extra heap for large monorepo web exports and post-export manifest patching.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const DEFAULT_HEAP_MB = 6144;

function metroHeapFlag(heapMb = process.env.METRO_NODE_HEAP_MB || DEFAULT_HEAP_MB) {
  return `--max-old-space-size=${heapMb}`;
}

function withMetroNodeHeap(env = process.env) {
  const existing = env.NODE_OPTIONS || "";
  if (existing.includes("max-old-space-size")) {
    return { ...env };
  }
  return {
    ...env,
    NODE_OPTIONS: `${existing} ${metroHeapFlag()}`.trim(),
  };
}

function runExpoCli(argv = process.argv.slice(2)) {
  const projectRoot = path.resolve(__dirname, "..");
  if (argv.length === 0) {
    console.error("Usage: node scripts/metro-node-heap.cjs <expo-cli-args...>");
    process.exit(1);
  }

  const env = withMetroNodeHeap();
  if (argv[0] === "export") {
    const { prepareWebExportEnv } = require("./prepare-web-export-env.cjs");
    prepareWebExportEnv(projectRoot);
    Object.assign(env, process.env);
  }

  const result = spawnSync("pnpm", ["exec", "expo", ...argv], {
    cwd: projectRoot,
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });

  if (
    result.status === 0 &&
    argv[0] === "export" &&
    argv.includes("--platform") &&
    argv.includes("web")
  ) {
    const { patchWebExportAppManifest } = require("./patch-web-export-app-manifest.cjs");
    patchWebExportAppManifest(path.join(projectRoot, "dist"), projectRoot);
  }

  process.exit(result.status ?? 1);
}

if (require.main === module) {
  runExpoCli();
}

module.exports = { DEFAULT_HEAP_MB, metroHeapFlag, withMetroNodeHeap, runExpoCli };
