/**
 * Shared runner for the one-shot multi-device release scripts
 * (`android-release-all.js`, `ios-release-all.js`).
 *
 * Per device, strictly one at a time (a clean prebuild wipes the native dir):
 *   bump its build counter in apps/app/.env → prebuild (if any) → release → copy the artifact
 *   to the repo root as <device>-<buildNumber>-<versionName>.<ext> → upload (if configured).
 *
 * CLI flags handled here: --only a,b · --start N · --dry-run · --no-upload
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const appRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(appRoot, "../..");
const envPath = path.join(appRoot, ".env");

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function readEnv() {
  if (!fs.existsSync(envPath)) fail("Missing apps/app/.env — copy apps/app/.env.example first.");
  return fs.readFileSync(envPath, "utf8");
}

function envValue(contents, key) {
  const m = contents.match(new RegExp(`^${key}=([^\\r\\n#]*)`, "m"));
  return m ? m[1].trim() : null;
}

function writeEnvValue(key, value) {
  const contents = readEnv();
  const re = new RegExp(`^${key}=[^\\r\\n]*`, "m");
  if (!re.test(contents)) fail(`${key} not found in apps/app/.env.`);
  fs.writeFileSync(envPath, contents.replace(re, `${key}=${value}`));
}

function run(cmd, args, opts = {}) {
  console.log(`\n$ ${cmd} ${args.join(" ")}\n`);
  const res = spawnSync(cmd, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  return res.status ?? 1;
}

function pnpm(args) {
  const status = run("pnpm", args);
  if (status !== 0) {
    console.error(`\n✖ pnpm ${args.join(" ")} failed (exit ${status}).`);
    process.exit(status);
  }
}

/**
 * @typedef {object} DeviceSpec
 * @property {string} codeKey      .env build counter bumped before this device's build
 * @property {string} versionKey   .env marketing version used in the file name
 * @property {string[] | null | ((state: object) => string[] | null)} prebuild  pnpm args
 * @property {string[]} release    pnpm args
 * @property {() => string | null} artifact  absolute path of the built artifact
 * @property {string[]} [upload]   pnpm args — uploads the artifact from its default location
 * @property {(state: object) => void} [after]    update shared state after the build
 *
 * @param {object} config
 * @param {string} config.title
 * @param {string} [config.ext]  "aab" → copy to the repo root as <device>-<code>-<ver>.aab;
 *                               omit to leave the artifact where the release script put it
 * @param {string[]} config.order
 * @param {Record<string, DeviceSpec>} config.devices
 * @param {() => void} [config.beforePrebuild]
 * @param {() => string | null} [config.preflight]  returns an error message to abort a real run
 * @param {string} [config.reuseNote]         printed for --start ≤ current
 */
function runReleaseAll(config) {
  const { title, ext, order, devices } = config;
  const dryRun = process.argv.includes("--dry-run");
  const noUpload = process.argv.includes("--no-upload");

  const only = argValue("--only");
  const wanted = only ? only.split(",").map((s) => s.trim()) : order;
  const unknown = wanted.filter((d) => !order.includes(d));
  if (unknown.length) fail(`Unknown device(s): ${unknown.join(", ")} (use ${order.join(", ")}).`);
  const selected = order.filter((d) => wanted.includes(d));

  const env = readEnv();
  const startArg = argValue("--start");
  const start = startArg == null ? null : Number(startArg);
  if (start != null && (!Number.isInteger(start) || start <= 0))
    fail(`Invalid --start ${startArg}.`);

  // Each counter key advances independently (+1 per device that uses it).
  const next = {};
  const plan = selected.map((device) => {
    const spec = devices[device];
    const current = Number(envValue(env, spec.codeKey));
    if (!(spec.codeKey in next)) {
      if (start != null && Number.isInteger(current) && start <= current) {
        console.warn(
          `⚠ --start ${start} ≤ current ${spec.codeKey}=${current}; ${config.reuseNote ?? "stores reject reused build numbers."}`,
        );
      }
      next[spec.codeKey] = start ?? (Number.isInteger(current) ? current : 0) + 1;
    }
    const code = next[spec.codeKey]++;
    const versionName = envValue(env, spec.versionKey);
    if (!versionName) fail(`${spec.versionKey} missing from apps/app/.env.`);
    const out = ext ? path.join(repoRoot, `${device}-${code}-${versionName}.${ext}`) : null;
    return { device, code, versionName, out, upload: !noUpload && !!spec.upload };
  });

  console.log(`${title} — plan:`);
  for (const p of plan) {
    const spec = devices[p.device];
    const target = p.out ? `  → ${path.basename(p.out)}` : "";
    console.log(
      `  ${p.device.padEnd(7)} ${spec.codeKey}=${p.code}  v${p.versionName}${target}${p.upload ? "  + upload" : ""}`,
    );
  }
  if (dryRun) return;

  const preflightError = config.preflight?.();
  if (preflightError) fail(preflightError);

  const started = Date.now();
  const state = {};
  for (const p of plan) {
    const spec = devices[p.device];
    console.log(`\n════ ${p.device}: ${spec.codeKey}=${p.code} ════`);
    writeEnvValue(spec.codeKey, p.code);

    const prebuild = typeof spec.prebuild === "function" ? spec.prebuild(state) : spec.prebuild;
    if (prebuild) {
      config.beforePrebuild?.();
      pnpm(prebuild);
    }
    pnpm(spec.release);
    spec.after?.(state);

    const artifact = spec.artifact();
    if (!artifact || !fs.existsSync(artifact))
      fail(`Missing artifact for ${p.device}: ${artifact ?? "(none found)"}`);
    if (p.out) fs.copyFileSync(artifact, p.out);
    p.result = p.out ?? artifact;
    const mb = (fs.statSync(p.result).size / 1024 / 1024).toFixed(1);
    console.log(`\n✔ ${path.relative(repoRoot, p.result)} (${mb} MB)`);

    // Upload before the next device's clean prebuild can wipe the native dir.
    if (p.upload) {
      pnpm(spec.upload);
      console.log(`\n✔ uploaded ${p.device} (${spec.codeKey}=${p.code})`);
    }
  }

  const mins = Math.round((Date.now() - started) / 60000);
  console.log(`\nAll done in ~${mins} min:`);
  for (const p of plan) {
    console.log(`  ${path.relative(repoRoot, p.result)}${p.upload ? "  (uploaded)" : ""}`);
  }
  const finalCodes = Object.entries(next).map(([k, v]) => `${k}=${v - 1}`);
  console.log(`\napps/app/.env now has ${finalCodes.join(", ")}.`);
}

module.exports = { appRoot, repoRoot, run, runReleaseAll };
