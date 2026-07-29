/**
 * Patch exported web bundles so expo-constants reads notification.vapidPublicKey on static hosts.
 */
const fs = require("fs");
const path = require("path");
const { buildPublicWebManifest } = require("./prepare-web-export-env.cjs");
const { loadAppEnv } = require("./lib/release-app-env.cjs");

const APP_MANIFEST_FALLBACK = /process\.env\.APP_MANIFEST\s*\|\|\s*\{\}/g;
const APP_MANIFEST_ACCESS = /process\.env\.APP_MANIFEST(?!\s*\|\|)/g;

function patchFileContents(source, manifestLiteral) {
  let next = source;
  next = next.replace(APP_MANIFEST_FALLBACK, `${manifestLiteral}||{}`);
  next = next.replace(APP_MANIFEST_ACCESS, manifestLiteral);
  return next;
}

/**
 * @param {string} distDir apps/app/dist
 * @param {string} projectRoot apps/app
 */
function patchWebExportAppManifest(distDir, projectRoot) {
  loadAppEnv(projectRoot);
  const manifest = buildPublicWebManifest(projectRoot);
  const manifestLiteral = JSON.stringify(JSON.stringify(manifest));

  const webJsDir = path.join(distDir, "_expo", "static", "js", "web");
  if (!fs.existsSync(webJsDir)) {
    console.warn("[patch-web-export-app-manifest] web JS output not found — skipping");
    return { patchedFiles: 0 };
  }

  let patchedFiles = 0;
  for (const name of fs.readdirSync(webJsDir)) {
    if (!name.endsWith(".js")) continue;
    const filePath = path.join(webJsDir, name);
    const before = fs.readFileSync(filePath, "utf8");
    if (!before.includes("process.env.APP_MANIFEST")) continue;
    const after = patchFileContents(before, manifestLiteral);
    if (after !== before) {
      fs.writeFileSync(filePath, after);
      patchedFiles += 1;
    }
  }

  if (patchedFiles === 0) {
    console.warn(
      "[patch-web-export-app-manifest] No bundles contained process.env.APP_MANIFEST — web push may rely on EXPO_PUBLIC inlining only.",
    );
  }

  return { patchedFiles };
}

module.exports = { patchWebExportAppManifest, patchFileContents };
