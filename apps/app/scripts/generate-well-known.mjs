/**
 * Writes App Link verification files into `public/.well-known/` (copied into
 * `dist/` by Expo web export) so `my.munibtracker.app` can verify iOS AASA and
 * Android Digital Asset Links.
 *
 * Env (optional; sensible defaults for Munib Tracker):
 * - EXPO_APPLE_TEAM_ID — Apple Team ID prefix for AASA appID (default MHNXY53R3X)
 * - EXPO_PUBLIC_APP_IDENTIFIER — iOS bundle id (default app.munibtracker)
 * - EXPO_PUBLIC_ANDROID_PACKAGE — Android package (default app.munibtracker)
 * - ANDROID_APP_LINK_SHA256_FINGERPRINTS — Play App Signing (+ debug) SHA-256s
 *
 * Wired into `build:web` via package.json. Also safe to run standalone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(projectRoot, "public", ".well-known");

const TEAM_ID = (process.env.EXPO_APPLE_TEAM_ID ?? "MHNXY53R3X").trim();
const BUNDLE_ID = (process.env.EXPO_PUBLIC_APP_IDENTIFIER ?? "app.munibtracker").trim();
const ANDROID_PACKAGE = (process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? "app.munibtracker").trim();

/**
 * Upload-key fingerprint (always include). Play App Signing cert must be added via
 * ANDROID_APP_LINK_SHA256_FINGERPRINTS or App Links fail for Play Store installs.
 */
const DEFAULT_FINGERPRINTS = [
  "DF:6D:E8:63:F1:9D:B7:30:FD:28:79:18:9A:0B:5F:08:B3:EB:F1:47:38:60:24:DB:71:30:9E:B0:AE:95:46:71",
];

const envFingerprints = (process.env.ANDROID_APP_LINK_SHA256_FINGERPRINTS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const fingerprints = [...new Set([...DEFAULT_FINGERPRINTS, ...envFingerprints])];

/** Paths Apple OAuth + future HTTPS App Links may open into the native app. */
const AASA_PATHS = ["/oauth/apple", "/oauth/apple/*"];

function buildAasa() {
  if (!(process.env.EXPO_APPLE_TEAM_ID ?? "").trim()) {
    console.warn(
      "[well-known] EXPO_APPLE_TEAM_ID unset — using Munib Tracker team id MHNXY53R3X. Override via env if needed.",
    );
  }
  const appID = `${TEAM_ID}.${BUNDLE_ID}`;
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID,
          paths: AASA_PATHS,
        },
      ],
    },
  };
}

function buildAssetLinks() {
  if (envFingerprints.length === 0) {
    console.warn(
      "[well-known] ANDROID_APP_LINK_SHA256_FINGERPRINTS unset — only the upload cert fingerprint is published. Add the Play App Signing SHA-256 for production App Links.",
    );
  }
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];
}

fs.mkdirSync(outDir, { recursive: true });

const aasaPath = path.join(outDir, "apple-app-site-association");
const assetLinksPath = path.join(outDir, "assetlinks.json");

fs.writeFileSync(aasaPath, `${JSON.stringify(buildAasa(), null, 2)}\n`);
fs.writeFileSync(assetLinksPath, `${JSON.stringify(buildAssetLinks(), null, 2)}\n`);

console.log(`[well-known] Wrote ${path.relative(projectRoot, aasaPath)}`);
console.log(`[well-known] Wrote ${path.relative(projectRoot, assetLinksPath)}`);
