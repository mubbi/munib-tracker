/**
 * Phone vs Android TV form-factor helpers for emulator / adb selection.
 * Keeps `pnpm dev:app:android` on phone AVDs and `pnpm dev:app:tv:android` on TV.
 */
const { spawnSync } = require("node:child_process");

/**
 * @param {string} name AVD display name from `emulator -list-avds`
 * @returns {boolean}
 */
function isLikelyTvAvdName(name) {
  const normalized = String(name || "")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_");
  if (!normalized) return false;
  return (
    normalized.includes("_tv_") ||
    normalized.startsWith("tv_") ||
    normalized.endsWith("_tv") ||
    normalized.includes("android_tv") ||
    normalized.includes("atv") ||
    normalized.includes("leanback") ||
    normalized.includes("firetv") ||
    normalized.includes("fire_tv") ||
    /\btv\b/.test(normalized.replaceAll("_", " "))
  );
}

/**
 * Prefer matching form-factor AVDs; fall back to the other kind if needed.
 *
 * @param {string[]} avds
 * @param {{ preferTv?: boolean }} [opts]
 * @returns {{ avd: string | undefined, usedFallback: boolean }}
 */
function pickPreferredAvd(avds, { preferTv = false } = {}) {
  const list = (avds || []).map((n) => n.trim()).filter(Boolean);
  if (!list.length) return { avd: undefined, usedFallback: false };

  const preferred = list.filter((n) => isLikelyTvAvdName(n) === preferTv);
  if (preferred.length) {
    return { avd: preferred[0], usedFallback: false };
  }
  return { avd: list[0], usedFallback: true };
}

/**
 * @param {string} serial
 * @param {{ timeoutMs?: number }} [opts]
 * @returns {boolean}
 */
function isAndroidTvAdbDevice(serial, { timeoutMs = 8_000 } = {}) {
  if (!serial) return false;

  const shell = (args) =>
    spawnSync("adb", ["-s", serial, "shell", ...args], {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: timeoutMs,
    });

  const features = shell(["pm", "list", "features"]);
  if ((features.stdout || "").includes("android.software.leanback")) {
    return true;
  }

  const characteristics = (shell(["getprop", "ro.build.characteristics"]).stdout || "")
    .trim()
    .toLowerCase();
  if (
    characteristics
      .split(",")
      .map((part) => part.trim())
      .includes("tv")
  ) {
    return true;
  }

  const productBlob = [
    shell(["getprop", "ro.product.name"]).stdout,
    shell(["getprop", "ro.product.model"]).stdout,
    shell(["getprop", "ro.product.device"]).stdout,
    shell(["getprop", "ro.product.system.name"]).stdout,
  ]
    .map((value) => (value || "").trim().toLowerCase())
    .join(" ");

  return /atv|android[_\s-]?tv|aosp[_\s-]?tv|leanback|google[_\s-]?atv|sdk_google_atv|\btv\b/.test(
    productBlob,
  );
}

module.exports = {
  isLikelyTvAvdName,
  pickPreferredAvd,
  isAndroidTvAdbDevice,
};
