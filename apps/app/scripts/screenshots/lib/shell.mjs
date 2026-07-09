import { spawnSync } from "node:child_process";

export function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: opts.quiet ? "pipe" : "inherit",
    ...opts,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || `exit ${result.status}`;
    throw new Error(`${cmd} ${args.join(" ")} failed: ${detail}`);
  }
  return result;
}

export function runCapture(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...opts,
  });
  if (result.error) throw result.error;
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

export function commandExists(name) {
  const check = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(check, [name], { encoding: "utf8", stdio: "pipe" });
  return result.status === 0;
}

export function parseCsvEnv(name, fallback) {
  const raw = (process.env[name] ?? fallback).trim();
  if (!raw || raw === "all") return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function log(msg) {
  process.stdout.write(`${msg}\n`);
}

export function warn(msg) {
  process.stderr.write(`warn: ${msg}\n`);
}
