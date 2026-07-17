/**
 * Writes App Link verification files into `public/.well-known/` (copied into
 * `dist/` by Expo web export) so `my.munibtracker.app` can verify iOS AASA and
 * Android Digital Asset Links.
 *
 * Env (optional; sensible defaults for Munib Tracker):
 * - EXPO_APPLE_TEAM_ID — Apple Team ID prefix for AASA appID
 * - EXPO_PUBLIC_APP_IDENTIFIER — iOS bundle id (default app.munibtracker)
 * - EXPO_PUBLIC_ANDROID_PACKAGE — Android package (default app.munibtracker)
 * - ANDROID_APP_LINK_SHA256_FINGERPRINTS — comma-separated cert fingerprints
 *
 * Wired into `build:web` via package.json. Also safe to run standalone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(projectRoot, "public", ".well-known");

const TEAM_ID = (process.env.EXPO_APPLE_TEAM_ID ?? "").trim();
const BUNDLE_ID = (process.env.EXPO_PUBLIC_APP_IDENTIFIER ?? "app.munibtracker").trim();
const ANDROID_PACKAGE = (process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? "app.munibtracker").trim();

/** Fallback debug/Play fingerprints already shipped in public/.well-known/assetlinks.json */
const DEFAULT_FINGERPRINTS = [
  "DF:6D:E8:63:F1:9D:B7:30:FD:28:79:18:9A:0B:5F:08:B3:EB:F1:47:38:60:24:DB:71:30:9E:B0:AE:95:46:71",
];

const envFingerprints = (process.env.ANDROID_APP_LINK_SHA256_FINGERPRINTS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const fingerprints = envFingerprints.length > 0 ? envFingerprints : DEFAULT_FINGERPRINTS;

/** Paths Apple OAuth + future HTTPS App Links may open into the native app. */
const AASA_PATHS = ["/oauth/apple", "/oauth/apple/*"];

function buildAasa() {
  if (!TEAM_ID) {
    console.warn(
      "[well-known] EXPO_APPLE_TEAM_ID unset — writing AASA with placeholder team id. Set the env before production deploy.",
    );
  }
  const appID = `${TEAM_ID || "TEAMID"}.${BUNDLE_ID}`;
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
