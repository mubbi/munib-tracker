#!/usr/bin/env node
/**
 * Send Android TV remote keyevents to a running emulator/device.
 *
 * Phone-style emulator sidebar buttons (◁ ○ □) often do nothing on TV AVDs —
 * TV expects a D-pad remote. Use this helper or focus the emulator window and
 * press keyboard arrows / Enter / Esc.
 *
 * Usage (repo root):
 *   pnpm --filter app tv:remote home
 *   pnpm --filter app tv:remote back
 *   pnpm --filter app tv:remote up|down|left|right|select
 *   pnpm --filter app tv:remote apps
 *   ANDROID_SERIAL=emulator-5554 pnpm --filter app tv:remote home
 */
const { spawnSync } = require("node:child_process");

const KEYS = {
  home: "KEYCODE_HOME",
  back: "KEYCODE_BACK",
  up: "KEYCODE_DPAD_UP",
  down: "KEYCODE_DPAD_DOWN",
  left: "KEYCODE_DPAD_LEFT",
  right: "KEYCODE_DPAD_RIGHT",
  select: "KEYCODE_DPAD_CENTER",
  center: "KEYCODE_DPAD_CENTER",
  ok: "KEYCODE_DPAD_CENTER",
  enter: "KEYCODE_ENTER",
  apps: "KEYCODE_ALL_APPS",
  menu: "KEYCODE_MENU",
};

const name = (process.argv[2] || "").trim().toLowerCase();
if (!name || name === "help" || name === "--help") {
  console.log(
    "TV remote keys:\n  " +
      Object.keys(KEYS).join(", ") +
      "\n\nExample: pnpm --filter app tv:remote home",
  );
  process.exit(name ? 0 : 1);
}

const key = KEYS[name];
if (!key) {
  console.error(`Unknown key "${name}". Known: ${Object.keys(KEYS).join(", ")}`);
  process.exit(1);
}

const adbArgs = [];
if (process.env.ANDROID_SERIAL) {
  adbArgs.push("-s", process.env.ANDROID_SERIAL);
}
adbArgs.push("shell", "input", "keyevent", key);

const result = spawnSync("adb", adbArgs, {
  encoding: "utf8",
  shell: process.platform === "win32",
  timeout: 15_000,
});

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || `adb failed (${result.status})`);
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
}

console.log(`Sent ${key}`);
