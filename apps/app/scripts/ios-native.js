/**
 * Shared helpers for iOS Xcode scripts (signing report, release archive).
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const iosDir = path.join(projectRoot, "ios");
const keysDir = path.join(projectRoot, "ios-keys");
const teamEnvPath = path.join(keysDir, "team.env");
const exportOptionsPath = path.join(keysDir, "ExportOptions.plist");
const exportOptionsTemplatePath = path.join(keysDir, "ExportOptions.plist.template");
const exportDir = path.join(iosDir, "app-store-export");

const { loadAppEnv, loadDotEnv } = require("./lib/release-app-env.cjs");

function resolveSchemeName() {
  if (!fs.existsSync(iosDir)) {
    return "MunibTracker";
  }
  const xcodeprojs = fs.readdirSync(iosDir).filter((name) => name.endsWith(".xcodeproj"));
  if (xcodeprojs.length === 1) {
    return xcodeprojs[0].replace(".xcodeproj", "");
  }
  return "MunibTracker";
}

const SCHEME = resolveSchemeName();
const WORKSPACE_NAME = `${SCHEME}.xcworkspace`;
const ARCHIVE_NAME = `${SCHEME}.xcarchive`;

function loadProjectEnv() {
  const result = loadAppEnv(projectRoot);
  const { loadIosKeysDotEnv } = require("./lib/ios-keys.cjs");
  loadIosKeysDotEnv(projectRoot);
  loadDotEnv(teamEnvPath);
  return result;
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    shell: false,
    ...opts,
  });
}

function ensureIosProject() {
  if (!fs.existsSync(iosDir)) {
    console.error(
      "\nMissing apps/app/ios/ — generate the native project first:\n" +
        "  pnpm prebuild:app:ios\n" +
        "  or: cd apps/app && pnpm exec expo prebuild --platform ios\n",
    );
    process.exit(1);
  }
}

function workspacePath() {
  const workspace = path.join(iosDir, WORKSPACE_NAME);
  if (!fs.existsSync(workspace)) {
    console.error(
      `\nMissing ${workspace}\n` +
        "Run CocoaPods first:\n" +
        "  pnpm --filter app run ios:pod-install\n",
    );
    process.exit(1);
  }
  return workspace;
}

function pbxprojPath() {
  const matches = fs
    .readdirSync(iosDir)
    .filter((name) => name.endsWith(".xcodeproj"))
    .map((name) => path.join(iosDir, name, "project.pbxproj"));
  if (matches.length !== 1) {
    console.error(`Expected one .xcodeproj under ${iosDir}`);
    process.exit(1);
  }
  return matches[0];
}

function infoPlistPath() {
  return path.join(iosDir, SCHEME, "Info.plist");
}

function readTeamId() {
  const raw =
    process.env.EXPO_APPLE_TEAM_ID?.trim() ||
    process.env.IOS_DEVELOPMENT_TEAM?.trim() ||
    process.env.DEVELOPMENT_TEAM?.trim() ||
    "";
  return raw || null;
}

function syncDevelopmentTeam(teamId) {
  const pbx = pbxprojPath();
  let contents = fs.readFileSync(pbx, "utf8");
  if (/DEVELOPMENT_TEAM = /.test(contents)) {
    contents = contents.replace(/DEVELOPMENT_TEAM = [^;]+;/g, `DEVELOPMENT_TEAM = ${teamId};`);
  } else {
    contents = contents.replace(
      /(CURRENT_PROJECT_VERSION = \d+;\n)/g,
      `$1\t\t\t\tDEVELOPMENT_TEAM = ${teamId};\n`,
    );
  }
  fs.writeFileSync(pbx, contents, "utf8");
  console.log(`Synced DEVELOPMENT_TEAM=${teamId} → ${pbx}\n`);
}

function syncIosMarketingVersion(marketingVersion, { strict = true } = {}) {
  const version = String(marketingVersion).trim();
  const pbx = pbxprojPath();
  if (!fs.existsSync(pbx)) {
    if (strict) {
      console.error(`Missing ${pbx}`);
      process.exit(1);
    }
    return false;
  }

  let pbxContents = fs.readFileSync(pbx, "utf8");
  pbxContents = pbxContents.replace(
    /MARKETING_VERSION = [^;]+;/g,
    `MARKETING_VERSION = ${version};`,
  );
  fs.writeFileSync(pbx, pbxContents, "utf8");

  const plist = infoPlistPath();
  if (fs.existsSync(plist)) {
    let plistContents = fs.readFileSync(plist, "utf8");
    plistContents = plistContents.replace(
      /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleShortVersionString</key>\n    <string>${version}</string>`,
    );
    fs.writeFileSync(plist, plistContents, "utf8");
  }

  console.log(
    `iOS marketing version ${version} (EXPO_IOS_APP_VERSION → CFBundleShortVersionString)\n`,
  );
  return true;
}

function syncIosBuildNumber(buildNumber, { strict = true } = {}) {
  const code = String(buildNumber).trim();
  const pbx = pbxprojPath();
  if (!fs.existsSync(pbx)) {
    if (strict) {
      console.error(`Missing ${pbx}`);
      process.exit(1);
    }
    return false;
  }

  let pbxContents = fs.readFileSync(pbx, "utf8");
  pbxContents = pbxContents.replace(
    /CURRENT_PROJECT_VERSION = \d+;/g,
    `CURRENT_PROJECT_VERSION = ${code};`,
  );
  fs.writeFileSync(pbx, pbxContents, "utf8");

  const plist = infoPlistPath();
  if (fs.existsSync(plist)) {
    let plistContents = fs.readFileSync(plist, "utf8");
    plistContents = plistContents.replace(
      /<key>CFBundleVersion<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleVersion</key>\n    <string>${code}</string>`,
    );
    fs.writeFileSync(plist, plistContents, "utf8");
  }

  console.log(`iOS build number ${code} (EXPO_IOS_APP_BUILD_NUMBER → CFBundleVersion)\n`);
  return true;
}

function ensureExportOptionsPlist(teamId) {
  fs.mkdirSync(keysDir, { recursive: true });
  if (!fs.existsSync(exportOptionsTemplatePath)) {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>teamID</key>
  <string>YOUR_TEAM_ID</string>
  <key>uploadSymbols</key>
  <true/>
  <key>signingStyle</key>
  <string>automatic</string>
</dict>
</plist>
`;
    fs.writeFileSync(exportOptionsTemplatePath, template, "utf8");
  }

  let plist = fs.readFileSync(exportOptionsTemplatePath, "utf8");
  plist = plist.replace(/<string>YOUR_TEAM_ID<\/string>/, `<string>${teamId}</string>`);
  fs.writeFileSync(exportOptionsPath, plist, "utf8");
}

function ensureXcodeCli() {
  const xcodeSelect = runCapture("xcode-select", ["-p"]);
  if (xcodeSelect.status !== 0) {
    console.error("\nXcode command line tools not found. Install Xcode from the Mac App Store.\n");
    process.exit(1);
  }
}

function resolveReactNativeDir() {
  const result = runCapture(
    "node",
    ["-p", "require('path').dirname(require.resolve('react-native/package.json'))"],
    { cwd: projectRoot },
  );
  if (result.status !== 0) {
    console.error("\nCannot resolve react-native. From the monorepo root run:\n  pnpm install\n");
    process.exit(1);
  }
  return result.stdout.trim();
}

function iosReactCodegenSentinelPath() {
  return path.join(
    iosDir,
    "build/generated/ios/ReactCodegen/react/renderer/components/rnscreens/States.cpp",
  );
}

function ensureIosReactCodegen() {
  const sentinel = iosReactCodegenSentinelPath();
  if (fs.existsSync(sentinel)) {
    return;
  }

  const rnDir = resolveReactNativeDir();
  const codegenScript = path.join(rnDir, "scripts/generate-codegen-artifacts.js");
  console.log("Generating iOS ReactCodegen artifacts (missing ios/build/generated/ios)…\n");
  run("node", [codegenScript, "-p", projectRoot, "-t", "ios", "-o", iosDir], {
    cwd: projectRoot,
  });
}

function ensurePodsInstalled() {
  workspacePath();
  ensureIosReactCodegen();

  const podsRoot = path.join(iosDir, "Pods");
  if (!fs.existsSync(path.join(podsRoot, "Manifest.lock"))) {
    console.log("Running pod install…\n");
    run("pod", ["install"], { cwd: iosDir });
  }
}

function ensureJsBundleDeps() {
  try {
    require(path.join(projectRoot, "metro.config.js"));
  } catch (err) {
    console.error("\nJS bundle dependencies are missing or Metro config failed to load.\n");
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.error("\nFrom the monorepo root run:\n  pnpm install\n");
    process.exit(1);
  }
}

function cleanXcodeArchiveCaches() {
  const home = process.env.HOME || "";
  const moduleCache = path.join(home, "Library/Developer/Xcode/DerivedData/ModuleCache.noindex");
  if (fs.existsSync(moduleCache)) {
    console.log("Clearing Xcode ModuleCache.noindex…\n");
    fs.rmSync(moduleCache, { recursive: true, force: true });
  }
}

module.exports = {
  projectRoot,
  iosDir,
  keysDir,
  exportOptionsPath,
  exportDir,
  SCHEME,
  WORKSPACE_NAME,
  ARCHIVE_NAME,
  loadProjectEnv,
  run,
  runCapture,
  ensureIosProject,
  workspacePath,
  pbxprojPath,
  readTeamId,
  syncDevelopmentTeam,
  syncIosMarketingVersion,
  syncIosBuildNumber,
  ensureExportOptionsPlist,
  ensureXcodeCli,
  ensurePodsInstalled,
  ensureJsBundleDeps,
  ensureIosReactCodegen,
  cleanXcodeArchiveCaches,
};
