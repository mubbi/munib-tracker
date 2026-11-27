#!/usr/bin/env node
/**
 * One-shot local App Store release for both Apple form factors: iPhone → Apple TV.
 * macOS only (xcodebuild). The watchOS app is an embedded target of the iPhone app, so it
 * ships inside the iPhone IPA — there is no separate watch build.
 *
 * For each device: bump its own build number in apps/app/.env (+1), clean-prebuild, archive +
 * export the signed IPA to its default folder, then upload it to App Store Connect with the
 * upload script's default IPA (skip with --no-upload). Nothing is copied to the repo root:
 *   ios   → apps/app/ios/app-store-export/<Scheme>.ipa
 *   tvos  → apps/app/ios/app-store-export-tvos/<Scheme>.ipa
 * Each upload runs before the next device's clean prebuild, which wipes ios/ (export included).
 *
 *   ios   pnpm cleanbuild:app:ios     → pnpm release:app:ios    → pnpm release:app:ios:upload
 *         (EXPO_IOS_APP_BUILD_NUMBER, EXPO_IOS_APP_VERSION)
 *   tvos  pnpm prebuild:app:tv:ios    → pnpm release:app:tvos   → pnpm release:app:tvos:upload
 *         (EXPO_TVOS_APP_BUILD_NUMBER, EXPO_TVOS_APP_VERSION)
 *
 * Usage (from the repo root, on a Mac):
 *   pnpm release:app:ios:all                 # both: build + upload
 *   pnpm release:app:ios:all --no-upload     # build IPAs only (left in the export folders)
 *   pnpm release:app:ios:all --only tvos     # subset (ios,tvos; order kept)
 *   pnpm release:app:ios:all --start 10      # override the next build number (each counter)
 *   pnpm release:app:ios:all --dry-run       # print the plan (works on any OS)
 *
 * Upload needs ios-keys/app-store-connect.env + the .p8 key (scripts/setup-ios-app-store-connect.js).
 * Shared runner: scripts/lib/release-all.cjs.
 */
const fs = require("node:fs");
const path = require("node:path");
const { appRoot, runReleaseAll } = require("./lib/release-all.cjs");

const iosDir = path.join(appRoot, "ios");

/** First .ipa in an xcodebuild export folder (named <Scheme>.ipa). */
function ipaIn(folder) {
  return () => {
    const dir = path.join(iosDir, folder);
    if (!fs.existsSync(dir)) return null;
    const name = fs.readdirSync(dir).find((f) => f.endsWith(".ipa"));
    return name ? path.join(dir, name) : null;
  };
}

runReleaseAll({
  title: "Apple release (iPhone + Watch, Apple TV)",
  order: ["ios", "tvos"],
  reuseNote: "App Store Connect rejects a reused build number for the same version.",
  preflight: () =>
    process.platform === "darwin"
      ? null
      : "iOS / tvOS builds need macOS + Xcode (use --dry-run to preview the plan here).",
  devices: {
    ios: {
      codeKey: "EXPO_IOS_APP_BUILD_NUMBER",
      versionKey: "EXPO_IOS_APP_VERSION",
      prebuild: ["cleanbuild:app:ios"],
      release: ["release:app:ios"],
      artifact: ipaIn("app-store-export"),
      upload: ["release:app:ios:upload"],
    },
    tvos: {
      codeKey: "EXPO_TVOS_APP_BUILD_NUMBER",
      versionKey: "EXPO_TVOS_APP_VERSION",
      prebuild: ["prebuild:app:tv:ios"],
      release: ["release:app:tvos"],
      artifact: ipaIn("app-store-export-tvos"),
      upload: ["release:app:tvos:upload"],
    },
  },
});
