import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { APP_ID, deepLink, TIMING } from "./config.mjs";
import { demoReadyMarkers } from "./demo-data.mjs";
import { prayerNames, tabLabels, translate } from "./i18n.mjs";
import { runCapture } from "./shell.mjs";

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
    // Prefer sibling .bat next to the extensionless shim.
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
      // Maestro 2.x removed `wait:` — fold delay into animation wait + JS sleep.
      return [
        `- waitForAnimationToEnd:`,
        `    timeout: ${Math.max(200, step.ms ?? 200)}`,
        `- evalScript: \${java.lang.Thread.sleep(${Math.max(0, step.ms ?? 0)})}`,
      ];
    case "tapPrayerRow":
      return [`- tapOn: ${yamlQuote(prayers[step.prayer] ?? step.prayer)}`];
    case "tapText": {
      const text = step.text ?? translate(locale, step.textKey);
      return [`- tapOn: ${yamlQuote(text)}`];
    }
    default:
      return [];
  }
}

function sceneSteps(scene, { locale, tabs, prayers, outputDir }) {
  const markers = demoReadyMarkers(scene.id);
  // Prefer writing straight into captures-native; Maestro also mirrors under ~/.maestro/tests/.
  const outFile = path.join(outputDir, scene.id).replace(/\\/g, "/");
  const animTimeout = Math.max(scene.waitMs ?? TIMING.animationMs, TIMING.animationMs);
  const steps = [`# scene: ${scene.id}`];

  if (scene.type === "tab") {
    // Already on home after capture launch — tapping "Home" again hangs Maestro
    // 2.6 on Windows (tab label often not a plain text node).
    if (scene.tab !== "home") {
      steps.push(`- tapOn: ${yamlQuote(tabs[scene.tab])}`);
    }
  } else if (scene.route) {
    steps.push(`- openLink: ${yamlQuote(deepLink(scene.route))}`);
  }

  for (const step of scene.steps ?? []) {
    steps.push(...materializeStep(step, { locale, prayers }));
  }

  const primaryMarker = markers[0] ?? ".*Home.*";
  steps.push(
    `- extendedWaitUntil:`,
    `    visible:`,
    `      text: ${yamlQuote(primaryMarker)}`,
    `    timeout: ${TIMING.readyTimeoutMs}`,
    `- waitForAnimationToEnd:`,
    `    timeout: ${animTimeout}`,
  );

  if (!scene.keepOverlay && scene.type !== "tab") {
    // Conditional back-dismiss. Skip for tabs — Maestro 2.6 on Windows can hang
    // forever evaluating `when: visible: "Back"` against a flaky hierarchy.
    steps.push(
      `- runFlow:`,
      `    when:`,
      `      visible: "Back"`,
      `    commands:`,
      `      - back`,
    );
  }

  steps.push(`- takeScreenshot: ${yamlQuote(outFile)}`);
  return steps;
}

/** Generate Maestro YAML for one locale/theme capture session. */
export function buildCaptureFlowYaml({
  platform,
  locale,
  scenes,
  outputDir,
  appId = APP_ID[platform],
}) {
  const tabs = tabLabels(locale);
  const prayers = prayerNames(locale);
  const homeMarker = demoReadyMarkers("home")[0] ?? ".*Home.*";
  const lines = [
    `appId: ${appId}`,
    "---",
    // App is already launched + seeded by capture-*.mjs. Avoid a second
    // launchApp (it races Maestro's hierarchy driver on Windows/adb).
    "- runFlow:",
    "    when:",
    '      visible: "Allow"',
    "    commands:",
    '      - tapOn: "Allow"',
    "- runFlow:",
    "    when:",
    '      visible: "While using the app"',
    "    commands:",
    '      - tapOn: "While using the app"',
    "- runFlow:",
    "    when:",
    '      visible: "Only this time"',
    "    commands:",
    '      - tapOn: "While using the app"',
    "- extendedWaitUntil:",
    "    visible:",
    `      text: ${yamlQuote(homeMarker)}`,
    `    timeout: ${TIMING.readyTimeoutMs}`,
    "- waitForAnimationToEnd:",
    `    timeout: ${TIMING.animationMs + TIMING.settleMs}`,
  ];

  for (const scene of scenes) {
    lines.push(...sceneSteps(scene, { locale, tabs, prayers, outputDir }));
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
  // Absolute Windows paths with spaces need shell on some Node versions.
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
