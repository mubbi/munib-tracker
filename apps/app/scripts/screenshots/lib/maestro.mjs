import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { APP_ID, deepLink, TIMING } from "./config.mjs";
import { demoReadyMarkers } from "./demo-data.mjs";
import { prayerNames, translate } from "./i18n.mjs";
import { runCapture } from "./shell.mjs";

/** Expo Router paths for bottom tabs (avoid tapOn — flaky on Windows Maestro). */
const TAB_ROUTES = {
  home: "/",
  tracker: "/tracker",
  library: "/library",
  settings: "/settings",
};

function commandExists(name) {
  const check = process.platform === "win32" ? "where" : "which";
  return runCapture(check, [name]).ok;
}

/** Resolve Maestro CLI for Node spawn (Windows needs .bat; bare script is ENOENT). */
function resolveMaestroBinary() {
  if (process.env.MAESTRO_PATH) return process.env.MAESTRO_PATH;
  if (process.platform !== "win32") return "maestro";

  const where = runCapture("where", ["maestro"]);
  if (where.ok) {
    const lines = where.stdout
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const bat = lines.find((l) => /\.bat$/i.test(l));
    if (bat) return bat;
    for (const line of lines) {
      const batSibling = `${line}.bat`;
      if (fs.existsSync(batSibling)) return batSibling;
      if (/\.bat$/i.test(line)) return line;
    }
    if (lines[0]) return lines[0];
  }

  const homeBat = path.join(os.homedir(), ".maestro", "bin", "maestro.bat");
  if (fs.existsSync(homeBat)) return homeBat;
  return "maestro.bat";
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function materializeStep(step, { locale, prayers }) {
  switch (step.action) {
    case "wait":
      return [
        `- waitForAnimationToEnd:`,
        `    timeout: ${Math.max(200, step.ms ?? 200)}`,
        `- evalScript: \${java.lang.Thread.sleep(${Math.max(0, step.ms ?? 0)})}`,
      ];
    case "tapPrayerRow":
      return [
        `- tapOn:`,
        `    text: ${yamlQuote(prayers[step.prayer] ?? step.prayer)}`,
        `    optional: true`,
      ];
    case "tapText": {
      const text = step.text ?? translate(locale, step.textKey);
      return [`- tapOn:`, `    text: ${yamlQuote(text)}`, `    optional: true`];
    }
    default:
      return [];
  }
}

function sceneSteps(scene, { locale, prayers, outputDir }) {
  const markers = demoReadyMarkers(scene.id);
  const outFile = path.join(outputDir, scene.id).replace(/\\/g, "/");
  const animTimeout = Math.max(scene.waitMs ?? TIMING.animationMs, TIMING.animationMs);
  const steps = [`# scene: ${scene.id}`];

  if (scene.type === "tab") {
    const route = TAB_ROUTES[scene.tab] ?? `/${scene.tab}`;
    steps.push(`- openLink: ${yamlQuote(deepLink(route))}`);
  } else if (scene.route) {
    steps.push(`- openLink: ${yamlQuote(deepLink(scene.route))}`);
  }

  for (const step of scene.steps ?? []) {
    steps.push(...materializeStep(step, { locale, prayers }));
  }

  const primaryMarker = markers[0] ?? ".*Munib.*";
  // optional: true so a bad marker does not abort the rest of the matrix
  steps.push(
    `- extendedWaitUntil:`,
    `    visible:`,
    `      text: ${yamlQuote(primaryMarker)}`,
    `    timeout: ${Math.min(TIMING.readyTimeoutMs, 20_000)}`,
    `    optional: true`,
    `- waitForAnimationToEnd:`,
    `    timeout: ${animTimeout}`,
    `- takeScreenshot: ${yamlQuote(outFile)}`,
  );
  return steps;
}

/**
 * Generate Maestro YAML for one locale/theme capture session.
 * App must already be launched + seeded by capture-*.mjs.
 */
export function buildCaptureFlowYaml({
  platform,
  locale,
  scenes,
  outputDir,
  appId = APP_ID[platform],
  includeBootWait = true,
}) {
  const prayers = prayerNames(locale);
  const homeMarker = demoReadyMarkers("home")[0] ?? ".*Makkah.*";
  const lines = [`appId: ${appId}`, "---"];

  if (includeBootWait) {
    lines.push(
      "- extendedWaitUntil:",
      "    visible:",
      `      text: ${yamlQuote(homeMarker)}`,
      `    timeout: ${TIMING.readyTimeoutMs}`,
      "    optional: true",
      "- waitForAnimationToEnd:",
      `    timeout: ${TIMING.animationMs + TIMING.settleMs}`,
    );
  }

  for (const scene of scenes) {
    lines.push(...sceneSteps(scene, { locale, prayers, outputDir }));
  }

  return `${lines.join("\n")}\n`;
}

export function writeFlowFile(flowPath, yaml) {
  fs.mkdirSync(path.dirname(flowPath), { recursive: true });
  fs.writeFileSync(flowPath, yaml, "utf8");
}

export function runMaestro(flowPath, { dryRun = false } = {}) {
  if (dryRun) return { ok: true, stdout: "dry-run", stderr: "" };
  const maestro = resolveMaestroBinary();
  if (!commandExists("maestro") && !fs.existsSync(maestro)) {
    throw new Error(
      "Maestro CLI not found. Install: https://maestro.mobile.dev/docs/getting-started/installation",
    );
  }
  return runCapture(maestro, ["test", "--format", "junit", flowPath], {
    shell: process.platform === "win32",
  });
}

export function maestroAvailable() {
  if (commandExists("maestro")) return true;
  try {
    return fs.existsSync(resolveMaestroBinary());
  } catch {
    return false;
  }
}

export { translate };
