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

/**
 * Maestro needs a JDK. Prefer JAVA_HOME; otherwise Homebrew OpenJDK on macOS.
 * Mutates process.env so child Maestro processes inherit it.
 */
function ensureJavaHome() {
  if (process.env.JAVA_HOME && fs.existsSync(path.join(process.env.JAVA_HOME, "bin", "java"))) {
    return process.env.JAVA_HOME;
  }
  const candidates = [
    "/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home",
    "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
    "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home",
    "/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home",
  ];
  for (const home of candidates) {
    if (fs.existsSync(path.join(home, "bin", "java"))) {
      process.env.JAVA_HOME = home;
      process.env.PATH = `${path.join(home, "bin")}${path.delimiter}${process.env.PATH || ""}`;
      return home;
    }
  }
  return process.env.JAVA_HOME || null;
}

/** Resolve Maestro CLI for Node spawn (Windows needs .bat; bare script is ENOENT). */
function resolveMaestroBinary() {
  if (process.env.MAESTRO_PATH) return process.env.MAESTRO_PATH;

  const homeBin = path.join(os.homedir(), ".maestro", "bin");
  if (process.platform === "win32") {
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

    const homeBat = path.join(homeBin, "maestro.bat");
    if (fs.existsSync(homeBat)) return homeBat;
    return "maestro.bat";
  }

  // Prefer PATH, then the default installer location (~/.maestro/bin).
  if (commandExists("maestro")) return "maestro";
  const homeUnix = path.join(homeBin, "maestro");
  if (fs.existsSync(homeUnix)) return homeUnix;
  return "maestro";
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

  // iOS may show a one-time "Open in App?" sheet after openLink.
  steps.push(`- tapOn:`, `    text: "Open"`, `    optional: true`);

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
    // Dismiss leftover system permission / deep-link sheets.
    lines.push(
      "- tapOn:",
      '    text: "Allow While Using App"',
      "    optional: true",
      "- tapOn:",
      '    text: "Allow"',
      "    optional: true",
      "- tapOn:",
      '    text: "Open"',
      "    optional: true",
      "- tapOn:",
      '    text: "Continue"',
      "    optional: true",
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

export function runMaestro(flowPath, { dryRun = false, deviceId = null } = {}) {
  if (dryRun) return { ok: true, stdout: "dry-run", stderr: "" };
  ensureJavaHome();
  const maestro = resolveMaestroBinary();
  if (!commandExists("maestro") && !fs.existsSync(maestro)) {
    throw new Error(
      "Maestro CLI not found. Install: https://maestro.mobile.dev/docs/getting-started/installation",
    );
  }
  const device =
    deviceId || process.env.MAESTRO_DEVICE || process.env.IOS_UDID || process.env.ANDROID_SERIAL;
  const args = ["test", "--format", "junit"];
  if (device) args.push("--udid", device);
  args.push(flowPath);
  return runCapture(maestro, args, {
    shell: process.platform === "win32",
    env: process.env,
  });
}

export function maestroAvailable() {
  ensureJavaHome();
  if (commandExists("maestro")) return true;
  try {
    return fs.existsSync(resolveMaestroBinary());
  } catch {
    return false;
  }
}

export { translate };
