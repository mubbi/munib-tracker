import fs from "node:fs";
import path from "node:path";
import { APP_ID, deepLink, TIMING } from "./config.mjs";
import { demoReadyMarkers } from "./demo-data.mjs";
import { prayerNames, tabLabels, translate } from "./i18n.mjs";
import { runCapture } from "./shell.mjs";

function commandExists(name) {
  const check = process.platform === "win32" ? "where" : "which";
  return runCapture(check, [name]).ok;
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function materializeStep(step, { locale, prayers }) {
  switch (step.action) {
    case "wait":
      return [`- wait: ${step.ms}`];
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
  const outFile = path.join(outputDir, `${scene.id}.png`).replace(/\\/g, "/");
  const extraWait = Math.max(200, (scene.waitMs ?? TIMING.settleMs) - TIMING.animationMs);
  const steps = [`# scene: ${scene.id}`];

  if (scene.type === "tab") {
    steps.push(`- tapOn: ${yamlQuote(tabs[scene.tab])}`);
  } else if (scene.route) {
    steps.push(`- openLink: ${yamlQuote(deepLink(scene.route))}`);
  }

  for (const step of scene.steps ?? []) {
    steps.push(...materializeStep(step, { locale, prayers }));
  }

  steps.push(
    `- extendedWaitUntil:`,
    `    visible:`,
    ...markers.map((m) => `      ${yamlQuote(m)}`),
    `    timeout: ${TIMING.readyTimeoutMs}`,
    `- waitForAnimationToEnd:`,
    `    timeout: ${Math.max(scene.waitMs ?? TIMING.animationMs, TIMING.animationMs)}`,
    `- wait: ${extraWait}`,
  );

  if (!scene.keepOverlay) {
    steps.push(`- runFlow:`, `    when:`, `      visible: "Back"`, `    commands:`, `      - back`);
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
  const lines = [
    `appId: ${appId}`,
    "---",
    "- launchApp:",
    "    clearState: false",
    "- extendedWaitUntil:",
    "    visible:",
    ...demoReadyMarkers("home").map((m) => `      ${yamlQuote(m)}`),
    `    timeout: ${TIMING.readyTimeoutMs}`,
    "- waitForAnimationToEnd:",
    `    timeout: ${TIMING.animationMs}`,
    `- wait: ${TIMING.settleMs}`,
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
  if (!commandExists("maestro")) {
    throw new Error(
      "Maestro CLI not found. Install: https://maestro.mobile.dev/docs/getting-started/installation",
    );
  }
  return runCapture("maestro", ["test", "--format", "junit", flowPath]);
}

export function maestroAvailable() {
  return commandExists("maestro");
}

export { translate };
